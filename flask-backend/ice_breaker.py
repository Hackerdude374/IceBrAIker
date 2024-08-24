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

def ice_break_with(name: str) -> Tuple[Summary, TopicOfInterest, IceBreaker, str, dict]:
    linkedin_username = linkedin_lookup_agent(name=name)
    linkedin_data = scrape_linkedin_profile(linkedin_profile_url=linkedin_username)

    summary_chain = get_summary_chain()
    summary_and_facts: Summary = summary_chain.invoke(
        input={"information": linkedin_data},
    )

    interests_chain = get_interests_chain()
    interests: TopicOfInterest = interests_chain.invoke(
        input={"information": linkedin_data},
    )

    ice_breaker_chain = get_ice_breaker_chain()
    ice_breakers: IceBreaker = ice_breaker_chain.invoke(
        input={"information": linkedin_data},
    )

    # Analyze traits and skills
    traits_and_skills = trait_analyzer.analyze_profile(linkedin_data)

    return (
        summary_and_facts,
        interests,
        ice_breakers,
        linkedin_data.get("profile_pic_url"),
        traits_and_skills,  # Add the new traits and skills to the return value
    )

if __name__ == "__main__":
    pass