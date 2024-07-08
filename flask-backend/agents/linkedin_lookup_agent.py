# import os

# from langchain import hub
# from langchain.agents import (
#     create_react_agent,
#     AgentExecutor,
# )
# from langchain_core.tools import Tool
# from langchain_openai import ChatOpenAI
# from langchain.prompts.prompt import PromptTemplate
# from dotenv import load_dotenv
# from tools.tools import get_profile_url_tavily

# load_dotenv()


# def lookup(name: str) -> str:
#     llm = ChatOpenAI(
#         temperature=0,
#         model_name="gpt-3.5-turbo",
#         openai_api_key=os.environ["OPENAI_API_KEY"],
#     )
#     template = """given the full name {name_of_person}, I want you to get me a link to their LinkedIn profile page.
#                   Your answer should contain only a URL."""

#     prompt_template = PromptTemplate(
#         template=template, input_variables=["name_of_person"]
#     )
#     tools_for_agent = [
#         Tool(
#             name="Crawl Google 4 linkedin profile page",
#             func=get_profile_url_tavily,
#             description="useful for when you need get the Linkedin Page URL",
#         )
#     ]

#     react_prompt = hub.pull("hwchase17/react")
#     agent = create_react_agent(llm=llm, tools=tools_for_agent, prompt=react_prompt)
#     agent_executor = AgentExecutor(agent=agent, tools=tools_for_agent, verbose=True)

#     result = agent_executor.invoke(
#         input={"input": prompt_template.format_prompt(name_of_person=name)}
#     )

#     linked_profile_url = result["output"]
#     return linked_profile_url

import os
from dotenv import load_dotenv
from langchain import hub
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import Tool
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from tools.tools import get_profile_url_tavily

load_dotenv()

def lookup(name: str) -> str:
    llm = ChatOpenAI(
        temperature=0,
        model_name="gpt-3.5-turbo",
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )
    
    template = """Given the full name {name_of_person}, I want you to get me a link to their LinkedIn profile page.
                  Your answer should contain only a URL."""

    prompt_template = PromptTemplate(
        template=template, input_variables=["name_of_person"]
    )

    tools_for_agent = [
        Tool(
            name="Crawl Google for LinkedIn profile page",
            func=get_profile_url_tavily,
            description="Useful for when you need to get the LinkedIn Page URL",
        )
    ]

    react_prompt = hub.pull("hwchase17/react")
    agent = create_react_agent(llm=llm, tools=tools_for_agent, prompt=react_prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools_for_agent, verbose=True)

    formatted_prompt = prompt_template.format(name_of_person=name)
    result = agent_executor.invoke({"input": formatted_prompt})

    linked_profile_url = result.get("output", "").strip()

    if "linkedin.com/in/" in linked_profile_url.lower():
        return linked_profile_url
    else:
        return "Unable to find the LinkedIn profile page for " + name

# Ensure the get_profile_url_tavily function is properly defined in tools/tools.py
