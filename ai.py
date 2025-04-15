import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
##pip install google-generativeai python-dotenv

load_dotenv()
api_key = os.getenv('MY_API_KEY')
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-2.0-flash')

def generate_english_quiz(quiz_type: str, difficulty: str, user_language: str) -> dict:
    prompt = f"""
    Create a {difficulty} level {quiz_type} quiz question for English learners.
    The user's native language is {user_language}.

    Requirements:
    1. Provide one clear multiple-choice question
    2. Include 4 answer options (only one correct)
    3. Mark the correct answer with (Correct)
    4. Add a brief explanation in {user_language}

    Format your response as valid JSON with these keys:
    {{
        "question": "The question text",
        "options": ["option1", "option2", "option3", "option4"],
        "correct_index": 0,
        "explanation": "Explanation in the user's language"
    }}
    """

    try:
        response = model.generate_content(prompt)
        quiz_data = json.loads(response.text)

        required_keys = ["question", "options", "correct_index", "explanation"]
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
            "explanation": "The correct answer uses the present simple tense for regular actions."
        }

def english_learning_chat(user_message: str, conversation_history: list, user_language: str) -> str:
    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
    ]

    history_snippet = "\n".join(conversation_history[-6:])
    context = f"""
    You are a friendly and patient English conversation partner helping a native {user_language} speaker improve their English skills through real conversation.

    Your goals are to:
    1. Keep the conversation going in natural, everyday English.
    2. Encourage the user to respond in English and express their ideas.
    3. Gently correct grammar or vocabulary mistakes **only when they interfere with understanding**, and offer an improved version.
    4. Occasionally suggest better word choices or sentence structures **after** the user finishes a message.
    5. Use {user_language} translations only for difficult words or abstract ideas if the user seems confused.
    6. Ask follow-up questions to keep the learner engaged and practicing.
    7. Be encouraging and help build the user’s confidence.
    8. Do NOT give long grammar explanations unless the user asks directly — focus on conversation.

    Start by greeting the user and asking them a simple question in English to get them talking. Then, follow their lead and guide the conversation like a real English tutor would.

    Current conversation history:
    {history_snippet}
    """

    try:
        response = model.generate_content(
            contents=[context, user_message],
            safety_settings=safety_settings
        )
        return response.text
    except Exception as e:
        print(f"Error in chat: {str(e)}")
        return "I'm having trouble responding right now. Could you try asking something else?"

def validate_quiz_request(quiz_type: str, difficulty: str, language: str) -> bool:
    valid_quiz_types = ['grammar', 'vocabulary']
    valid_difficulties = ['easy', 'medium', 'hard']

    if quiz_type.lower() not in valid_quiz_types:
        raise ValueError(f"Invalid quiz type. Must be one of {valid_quiz_types}")

    if difficulty.lower() not in valid_difficulties:
        raise ValueError(f"Invalid difficulty. Must be one of {valid_difficulties}")

    if not language.strip():
        raise ValueError("Invalid language. Language cannot be empty.")

    return True

def safe_generate_quiz(quiz_type: str, difficulty: str, user_language: str) -> dict:
    try:
        validate_quiz_request(quiz_type, difficulty, user_language)
        return generate_english_quiz(quiz_type, difficulty, user_language)
    except ValueError as ve:
        print(f"Validation error: {ve}")
        return {"error": str(ve)}
    except Exception as e:
        print(f"Unexpected error: {e}")
        return {"error": "Failed to generate quiz"}
