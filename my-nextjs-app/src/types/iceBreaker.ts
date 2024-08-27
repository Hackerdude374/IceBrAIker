export interface IceBreakerData {
    summary_and_facts: {
      summary: string;
      facts: string[];
    };
    interests: {
      topics_of_interest: string[];
    };
    ice_breakers: {
      ice_breakers: string[];
    };
    picture_url: string;
    traits_and_skills: {
      personality_traits: string[];
      technical_skills: string[];
    };
  }