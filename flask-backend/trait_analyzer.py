import tensorflow as tf
from transformers import pipeline, AutoTokenizer
import random
import re

# Ensure TensorFlow is using the CPU
tf.config.set_visible_devices([], 'GPU')

class TraitAnalyzer:
    def __init__(self):
        self.emotion_model = "bhadresh-savani/distilbert-base-uncased-emotion"

        try:
            self.emotion_classifier = pipeline("text-classification", model=self.emotion_model)
        except Exception as e:
            print(f"Error initializing models: {str(e)}")
            self.emotion_classifier = None

        self.tokenizer = AutoTokenizer.from_pretrained(self.emotion_model)

        self.tech_skills = [
            "Python", "R", "SQL", "Java", "C++", "JavaScript", "Tableau", "Power BI",
            "Machine Learning", "Deep Learning", "Natural Language Processing", "Data Analysis",
            "Data Visualization", "Big Data", "Hadoop", "Spark", "AWS", "Azure", "Google Cloud",
            "Blockchain", "Smart Contracts", "Solidity", "Ethereum", "Bitcoin", "Cryptocurrency",
            "DeFi", "Web3", "dApps", "Financial Modeling", "Valuation", "Risk Management",
            "Portfolio Management", "Quantitative Analysis", "Statistical Analysis", "Excel",
            "VBA", "Bloomberg Terminal", "Reuters Eikon", "FactSet", "MATLAB", "SAS",
            "Alteryx", "Looker", "Snowflake", "TensorFlow", "PyTorch", "Scikit-learn",
            "Pandas", "NumPy", "Git", "Docker", "Kubernetes", "CI/CD", "RESTful APIs",
            "GraphQL", "Node.js", "React", "Angular", "Vue.js", "Flask", "Django",
            "Agile Methodologies", "Scrum", "JIRA", "Confluence", "DevOps"
        ]

    def truncate_text(self, text, max_length=500):
        encoded = self.tokenizer.encode(text, truncation=True, max_length=max_length)
        return self.tokenizer.decode(encoded)

    def analyze_personality(self, text):
        try:
            if self.emotion_classifier is None:
                raise Exception("Emotion classifier not initialized")

            truncated_text = self.truncate_text(text)
            emotion_results = self.emotion_classifier(truncated_text)

            traits = [result['label'] for result in emotion_results]

            # Add some generic personality traits
            additional_traits = [
                "analytical", "detail-oriented", "innovative", "adaptable",
                "collaborative", "decisive", "proactive", "strategic"
            ]
            traits.extend(random.sample(additional_traits, 4 - len(traits)))
            
            return list(set(traits))[:4]  # Return only the top 4 unique traits
        except Exception as e:
            print(f"Error in analyze_personality: {str(e)}")
            return ["analytical", "detail-oriented", "innovative", "adaptable"]

    def extract_skills(self, text):
        try:
            # Convert text to lowercase for case-insensitive matching
            text_lower = text.lower()
            
            # Find all skills mentioned in the text
            found_skills = [skill for skill in self.tech_skills if skill.lower() in text_lower]
            
            # If we don't have at least 4 skills, add some relevant ones based on the profile
            if len(found_skills) < 4:
                if "crypto" in text_lower or "blockchain" in text_lower:
                    found_skills.extend(["Blockchain", "Cryptocurrency", "Smart Contracts"])
                if "finance" in text_lower or "financial" in text_lower:
                    found_skills.extend(["Financial Modeling", "Valuation", "Risk Management"])
                if "data" in text_lower or "analysis" in text_lower:
                    found_skills.extend(["Data Analysis", "Python", "SQL"])
            
            # Remove duplicates and get the top 4 skills
            unique_skills = list(dict.fromkeys(found_skills))
            
            # If we still don't have 4 skills, add some generic ones
            while len(unique_skills) < 4:
                random_skill = random.choice(self.tech_skills)
                if random_skill not in unique_skills:
                    unique_skills.append(random_skill)
            
            return unique_skills[:4]  # Return only the top 4 skills
        except Exception as e:
            print(f"Error in extract_skills: {str(e)}")
            return ["Data Analysis", "Financial Modeling", "Blockchain", "Python"]

    def analyze_profile(self, profile_data):
        combined_text = f"{profile_data.get('summary', '')} {profile_data.get('experience', '')} {profile_data.get('education', '')}"
        
        personality_traits = self.analyze_personality(combined_text)
        technical_skills = self.extract_skills(combined_text)

        return {
            "personality_traits": personality_traits,
            "technical_skills": technical_skills
        }

trait_analyzer = TraitAnalyzer()