import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

def scrape_linkedin_profile(linkedin_profile_url: str, mock: bool = False):
    """Scrape information from LinkedIn profiles, manually or using Proxycurl API."""
    
    try:
        if mock:
            linkedin_profile_url = "https://gist.githubusercontent.com/emarco177/0d6a3f93dd06634d95e46a2782ed7490/raw/78233eb934aa9850b689471a604465b188e761a0/eden-marco.json"
            response = requests.get(linkedin_profile_url, timeout=10)
        else:
            api_endpoint = "https://nubela.co/proxycurl/api/v2/linkedin"
            header_dic = {"Authorization": f'Bearer {os.environ.get("PROXYCURL_API_KEY")}'}
            response = requests.get(api_endpoint, params={"url": linkedin_profile_url}, headers=header_dic, timeout=10000000)
        
        response.raise_for_status()
        
        data = response.json()
        data = {
            k: v
            for k, v in data.items()
            if v not in ([], "", "", None)
            and k not in ["people_also_viewed", "certifications"]
        }
        if data.get("groups"):
            for group_dict in data.get("groups"):
                group_dict.pop("profile_pic_url")
        
        with open("linkedin_profile.json", "w") as f:
            json.dump(data, f, indent=4)
        
        return data
    
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    print(scrape_linkedin_profile(linkedin_profile_url="https://www.linkedin.com/in/eden-marco/"))
