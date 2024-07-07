from typing import Tuple
from agents.linkedin_lookup_agent import lookup as linkedin_lookup_agent
from agents.twitter_lookup_agent import lookup as twitter_lookup_agent
from chains.custom_chains import (
    get_summary_chain,
    get_interests_chain,
    get_ice_breaker_chain,
)
from third_parties.linkedin import scrape_linkedin_profile
from third_parties.twitter import scrape_user_ttweets
from output_parsers import (
    Summary,
    IceBreaker,
    TopicOfInterest,
)

def ice_break_with(name: str) -> Tuple[Summary, TopicOfInterest, IceBreaker, str]:
    # Step 1: Find their LinkedIn profile
    linkedin_username = linkedin_lookup_agent(name=name)
    # Step 2: Get information from their LinkedIn profile
    linkedin_data = scrape_linkedin_profile(linkedin_profile_url=linkedin_username)

    # Step 3: Find their Twitter profile
    twitter_username = twitter_lookup_agent(name=name)
    # Step 4: Get their recent tweets
    tweets = scrape_user_tweets(username=twitter_username)

    # Step 5: Summarize the LinkedIn and Twitter information
    summary_chain = get_summary_chain()
    summary_and_facts: Summary = summary_chain.invoke(
        input={"information": linkedin_data, "twitter_posts": tweets},
    )

    # Step 6: Find topics they might be interested in
    interests_chain = get_interests_chain()
    interests: TopicOfInterest = interests_chain.invoke(
        input={"information": linkedin_data, "twitter_posts": tweets}
    )

    # Step 7: Create ice breakers using their LinkedIn and Twitter information
    ice_breaker_chain = get_ice_breaker_chain()
    ice_breakers: IceBreaker = ice_breaker_chain.invoke(
        input={"information": linkedin_data, "twitter_posts": tweets}
    )

    # Return the summary, interests, ice breakers, and profile picture URL
    return (
        summary_and_facts,
        interests,
        ice_breakers,
        linkedin_data.get("profile_pic_url"),
    )

if __name__ == "__main__":
    pass
