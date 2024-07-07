from typing import List, Dict, Any
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

# Define a Pydantic model for summarizing information
class Summary(BaseModel):
    summary: str = Field(description="summary")
    facts: List[str] = Field(description="interesting facts about them")

    # Method to convert the Summary instance to a dictionary
    def to_dict(self) -> Dict[str, Any]:
        return {"summary": self.summary, "facts": self.facts}

# Define a Pydantic model for generating ice breakers
class IceBreaker(BaseModel):
    ice_breakers: List[str] = Field(description="ice breaker list")

    # Method to convert the IceBreaker instance to a dictionary
    def to_dict(self) -> Dict[str, Any]:
        return {"ice_breakers": self.ice_breakers}

# Define a Pydantic model for identifying topics of interest
class TopicOfInterest(BaseModel):
    topics_of_interest: List[str] = Field(
        description="topic that might interest the person"
    )

    # Method to convert the TopicOfInterest instance to a dictionary
    def to_dict(self) -> Dict[str, Any]:
        return {"topics_of_interest": self.topics_of_interest}

# Create output parsers for each Pydantic model
summary_parser = PydanticOutputParser(pydantic_object=Summary)
ice_breaker_parser = PydanticOutputParser(pydantic_object=IceBreaker)
topics_of_interest_parser = PydanticOutputParser(pydantic_object=TopicOfInterest)
