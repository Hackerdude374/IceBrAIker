from typing import Tuple
from agents.linkedin_lookup_agent import lookup as linkedin_lookup_agent
from chains.custom_chains import (
    get_summary_chain,
    get_interests_chain,
    get_ice_breaker_chain,
)
from third_parties.linkedin import scrape_linkedin_profile
from output_parsers import (
    Summary,
    IceBreaker,
    TopicOfInterest,
)
from trait_analyzer import trait_analyzer  # Import the new trait analyzer
import logging
from langchain_core.exceptions import OutputParserException

def ice_break_with(name: str) -> Tuple[Summary, TopicOfInterest, IceBreaker, str, dict]:
    linkedin_username = linkedin_lookup_agent(name=name)
    
    # Check if the LinkedIn profile URL was found
    if "Unable to find the LinkedIn profile page" in linkedin_username:
        return (
            Summary(summary="", facts=[]),
            TopicOfInterest(topics_of_interest=[]),
            IceBreaker(ice_breakers=[]),
            "",
            {}
        )

    linkedin_data = scrape_linkedin_profile(linkedin_profile_url=linkedin_username)
    
    # Ensure linkedin_data is not None or empty
    if not linkedin_data:
        return (
            Summary(summary="", facts=[]),
            TopicOfInterest(topics_of_interest=[]),
            IceBreaker(ice_breakers=[]),
            "",
            {}
        )

    summary_chain = get_summary_chain()
    try:
        summary_and_facts: Summary = summary_chain.invoke(
            input={"information": linkedin_data},
        )
    except OutputParserException as e:
        logging.error(f"Failed to parse Summary: {str(e)}")
        summary_and_facts = Summary(summary="", facts=[])

    interests_chain = get_interests_chain()
    interests: TopicOfInterest = interests_chain.invoke(
        input={"information": linkedin_data},
    ) if linkedin_data else TopicOfInterest(topics_of_interest=[])

    ice_breaker_chain = get_ice_breaker_chain()
    ice_breakers: IceBreaker = ice_breaker_chain.invoke(
        input={"information": linkedin_data},
    ) if linkedin_data else IceBreaker(ice_breakers=[])

    # Analyze traits and skills if linkedin_data exists
    traits_and_skills = trait_analyzer.analyze_profile(linkedin_data) if linkedin_data else {}

    return (
        summary_and_facts,
        interests,
        ice_breakers,
        linkedin_data.get("profile_pic_url", ""),
        traits_and_skills,  # Add the new traits and skills to the return value
    )

if __name__ == "__main__":
    pass
