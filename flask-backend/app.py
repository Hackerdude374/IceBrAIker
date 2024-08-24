from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from ice_breaker import ice_break_with
import traceback
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.route("/")
def home():
    return jsonify(message="Welcome to IceBrAIker API!")

@app.route("/process", methods=["POST"])
def process():
    try:
        data = request.get_json()
        name = data.get("name")
        logger.info(f"Processing request for name: {name}")
        
        summary_and_facts, interests, ice_breakers, profile_pic_url, traits_and_skills = ice_break_with(name=name)
        
        response = {
            "summary_and_facts": summary_and_facts.to_dict(),
            "interests": interests.to_dict(),
            "ice_breakers": ice_breakers.to_dict(),
            "picture_url": profile_pic_url,
            "traits_and_skills": traits_and_skills,
        }
        logger.info("Successfully processed request")
        return jsonify(response)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        logger.error(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred. Please try again later."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)