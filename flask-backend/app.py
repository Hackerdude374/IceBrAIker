# from flask import Flask, render_template, request, jsonify
# from dotenv import load_dotenv

# from ice_breaker import ice_break_with

# # Load environment variables from the .env file
# load_dotenv()

# # Create a new Flask web application
# app = Flask(__name__)

# # Define a route for the home page
# @app.route("/")
# def index():
#     # Render the 'index.html' template when someone visits the home page
#     return render_template("index.html")

# # Define a route to process form submissions
# @app.route("/process", methods=["POST"])
# def process():
#     # Get the name from the form submission
#     name = request.form["name"]
#     # Use the ice_break_with function to get the summary, interests, ice breakers, and profile picture URL
#     summary_and_facts, interests, ice_breakers, profile_pic_url = ice_break_with(name=name)
    
#     # Return the results as a JSON response
#     return jsonify(
#         {
#             "summary_and_facts": summary_and_facts.to_dict(),  # Convert summary to a dictionary
#             "interests": interests.to_dict(),  # Convert interests to a dictionary
#             "ice_breakers": ice_breakers.to_dict(),  # Convert ice breakers to a dictionary
#             "picture_url": profile_pic_url,  # Include the profile picture URL
#         }
#     )

# # Run the web application when this script is executed
# if __name__ == "__main__":
#     # Start the web server on all network interfaces and enable debug mode
#     app.run(host="0.0.0.0", debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from ice_breaker import ice_break_with

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS


# @app.route("/")
# def home():
#     return jsonify(message="Welcome to IceBrAIker API!")

@app.route("/process", methods=["POST"])
def process():
    data = request.get_json()
    name = data.get("name")
    summary_and_facts, interests, ice_breakers, profile_pic_url = ice_break_with(name=name)
    return jsonify(
        {
            "summary_and_facts": summary_and_facts.to_dict(),
            "interests": interests.to_dict(),
            "ice_breakers": ice_breakers.to_dict(),
            "picture_url": profile_pic_url,
        }
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
