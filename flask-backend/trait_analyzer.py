import tensorflow as tf
from transformers import pipeline, AutoTokenizer
import random

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
            # Split the text to separate skills section
            parts = text.lower().split("skills:")
            skills_section = parts[1] if len(parts) > 1 else ""
            
            # Find explicitly mentioned skills
            explicit_skills = [skill for skill in self.tech_skills if skill.lower() in skills_section]
            
            # Find all skills mentioned in the entire text
            all_skills = [skill for skill in self.tech_skills if skill.lower() in text.lower()]
            
            # Prioritize explicit skills, then fill in with other mentioned skills
            final_skills = explicit_skills + [skill for skill in all_skills if skill not in explicit_skills]
            
            # If we don't have at least 4 skills, add some relevant ones based on the profile
            if len(final_skills) < 4:
                if "crypto" in text or "blockchain" in text:
                    final_skills.extend(["Blockchain", "Cryptocurrency", "Smart Contracts"])
                if "finance" in text or "financial" in text:
                    final_skills.extend(["Financial Modeling", "Valuation", "Risk Management"])
                if "data" in text or "analysis" in text:
                    final_skills.extend(["Data Analysis", "Python", "SQL"])
            
            # Remove duplicates and get the top 4 skills
            unique_skills = list(dict.fromkeys(final_skills))
            
            return unique_skills[:4]  # Return only the top 4 skills
        except Exception as e:
            print(f"Error in extract_skills: {str(e)}")
            return ["Data Analysis", "Financial Modeling", "Blockchain", "Python"]

    def extract_experience_text(self, experiences):
        experience_text = ""
        for exp in experiences:
            experience_text += f"{exp.get('title', '')} {exp.get('description', '')} "
        return experience_text
    
    def extract_recommendations_text(self, recommendations):
        recommendations_text = ""
        for rec in recommendations:
            recommendations_text += f"{rec.get('recommendation', '')} "
        return recommendations_text

    def analyze_profile(self, profile_data):
        try:
            # For personality traits
            personality_text = f"{profile_data.get('summary', '')} {profile_data.get('experience', '')} {profile_data.get('education', '')} {self.extract_recommendations_text(profile_data.get('recommendations', []))}"
            personality_traits = self.analyze_personality(personality_text)

            # For technical skills
            skills_text = profile_data.get('skills', '')
            projects_text = profile_data.get('projects', '')
            experience_text = self.extract_experience_text(profile_data.get('experiences', []))
            
            technical_skills_text = f"{skills_text} {projects_text} {experience_text}"
            technical_skills = self.extract_skills(technical_skills_text)

            return {
                "personality_traits": personality_traits,
                "technical_skills": technical_skills
            }
        except Exception as e:
            print(f"Error in analyze_profile: {str(e)}")
            return {
                "personality_traits": ["adaptable", "analytical", "detail-oriented", "innovative"],
                "technical_skills": ["Data Analysis", "Python", "SQL", "Problem Solving"]
            }

trait_analyzer = TraitAnalyzer()