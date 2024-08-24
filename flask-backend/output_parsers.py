from typing import List, Dict, Any
from langchain.output_parsers import PydanticOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
import logging

# Define a Pydantic model for summarizing information
class Summary(BaseModel):
    summary: str = Field(description="summary")
    facts: List[str] = Field(description="interesting facts about them")

    # Method to convert the Summary instance to a dictionary
    def to_dict(self) -> Dict[str, Any]:
        return {"summary": self.summary, "facts": self.facts}

    # Method to ensure that summary and facts are not empty, with fallback generation
    def ensure_non_empty(self):
        if not self.summary or len(self.summary.strip()) == 0:
            logging.warning("Summary is empty. Attempting to generate a fallback summary.")
            self.summary = "No detailed summary available, but this person seems to be noteworthy."

        if not self.facts or len(self.facts) == 0:
            logging.warning("Facts are empty. Attempting to generate fallback facts.")
            self.facts = ["This person has an online presence, but detailed facts are unavailable."]

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

    # Method to ensure that topics of interest are not empty, with fallback generation
    def ensure_non_empty(self):
        if not self.topics_of_interest or len(self.topics_of_interest) == 0:
            logging.warning("Topics of Interest are empty. Attempting to generate fallback topics.")
            self.topics_of_interest = ["Exploring various fields of interest."]

# Create output parsers for each Pydantic model
class EnhancedPydanticOutputParser(PydanticOutputParser):
    def parse(self, text: str) -> Any:
        # Attempt to parse the output, and if empty, handle fallback logic
        try:
            parsed_output = super().parse(text)
            if isinstance(parsed_output, Summary):
                parsed_output.ensure_non_empty()
            elif isinstance(parsed_output, TopicOfInterest):
                parsed_output.ensure_non_empty()
            return parsed_output
        except Exception as e:
            logging.error(f"Parsing failed: {e}")
            return None

# Use EnhancedPydanticOutputParser instead of the standard PydanticOutputParser
summary_parser = EnhancedPydanticOutputParser(pydantic_object=Summary)
ice_breaker_parser = EnhancedPydanticOutputParser(pydantic_object=IceBreaker)
topics_of_interest_parser = EnhancedPydanticOutputParser(pydantic_object=TopicOfInterest)
