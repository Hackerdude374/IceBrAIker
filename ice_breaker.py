import os
from dotenv import load_dotenv
from langchain.prompts.prompt import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from third_parties.linkedin import scrape_linkedin_profile
from agents.linkedin_lookup_agent import lookup as linkedin_lookup_agent



def ice_break_with(name: str) ->str:
    linkedin_username = linkedin_lookup_agent(name=name)
    linkedin_data = scrape_linkedin_profile(linkedin_profile_url=linkedin_username)
    
     
    summary_template = """
    Given LinkedIn info {information} about a person, I want you to create:
    1. A short summary
    2. Two interesting facts about them
    """
    
    summary_prompt_template = PromptTemplate(
        input_variables=["information"], template=summary_template
    )
    
    llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
    
        
    chain = LLMChain(llm=llm, prompt=summary_prompt_template)

    
    res = chain.invoke(input={"information": linkedin_data})
    
    print(res)
    
    
# def scrape_linkedin_profile(linkedin_profile_url):
#     # This function should scrape LinkedIn profile data
#     # For now, let's return dummy data
#     return "LinkedIn profile information about Eden Marco"

if __name__ == '__main__':
    load_dotenv()
    print("Ice Breaker Enter")
    ice_break_with(name="Eden Marco")
   

