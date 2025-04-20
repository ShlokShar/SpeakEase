import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
import sys

load_dotenv()
api_key = os.getenv('MY_API_KEY')
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-2.0-flash')

def generate_english_quiz(quiz_type: str, categories: str) -> dict:
    prompt = f"""
    Create a {quiz_type} quiz question for English learners.
    The categories are: {categories}

    Requirements:
    1. Provide one clear multiple-choice question
    2. Include 4 answer options (only one correct)
    3. Mark the correct answer with (Correct)

    Format your response as valid JSON with these keys:
    {{
        "question": "The question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correct_index": 0,
    }}
    """

    try:
        response = model.generate_content(prompt)
        quiz_data = json.loads(response.text)

        required_keys = ["question", "options", "correct_index"]
        if not all(key in quiz_data for key in required_keys):
            raise ValueError("Invalid quiz format received from API")

        if not isinstance(quiz_data["options"], list) or len(quiz_data["options"]) != 4:
            raise ValueError("Options should be a list of 4 items")

        return quiz_data

    except Exception as e:
        print(f"Error generating quiz: {str(e)}")
        return {
            "question": "Which sentence is correct?",
            "options": [
                "She go to school every day.",
                "She goes to school every day.",
                "She going to school every day.",
                "She gone to school every day."
            ],
            "correct_index": 1,
        }

def safe_generate_quiz(quiz_type: str, categories: str) -> dict:
    try:
        return generate_english_quiz(quiz_type, categories)
    except ValueError as ve:
        print(f"Validation error: {ve}")
        return {"error": str(ve)}
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"error": "Failed to generate quiz"}
    
if __name__== "__main__":
    quiz_type = str(sys.argv[1])
    categories = sys.argv[2]

    result = safe_generate_quiz(quiz_type, categories)
    print(result)
    sys.stdout.flush()