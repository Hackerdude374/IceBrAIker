import os
from dotenv import load_dotenv
from langchain.prompts.prompt import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
# Load environment variables from the .env file
load_dotenv()

    
    
    
    
def scrape_linkedin_profile(linkedin_profile_url):
    # This function should scrape LinkedIn profile data
    # For now, let's return dummy data
    return "LinkedIn profile information about Eden Marco"

if __name__ == '__main__':
    print("Hello LangChain")
    
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
    linkedin_data = scrape_linkedin_profile( linkedin_profile_url="https://www.linkedin.com/in/eden-marco")
    
    res = chain.invoke(input={"information": linkedin_data})
    
    print(res)
