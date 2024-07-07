
from dotenv import load_dotenv
load_dotenv()


from langchain.prompts.prompt import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain_core.tools import Tool

from langchain.agents import(
    create_react_agent,
    AgentExecutor,
)

from langchain import hub

# def lookup(name: str) -> str:
#     return "https://www.linkedin.com/in/eden-marco/"

def lookup(name: str) -> str:
    llm = ChatOpenAI(
        temperature=0,
        model_name="gpt-3.5-turbo",
    )
    template = """given the full name{name_of_person} I want you to get it me a link to their Linkedin profile page. Your answer should only contain a URL."""
    
    prompt_template = PromptTemplate(
        template=template,input_variables=["name_of_person"]
    )
    tools_for_agent = [
        Tool(
            name="Crawl Google 4 linkedin profile page",
            func="?"
            description="useful for when you need get the LinkedIn Page URL"
        )
    ]
    # langchain object
    react_prompt = hub.pull("hwchase17/react")
    
    
    if __name__ == "__main__":
        linkedin_url = lookup(name="Eden Marco")