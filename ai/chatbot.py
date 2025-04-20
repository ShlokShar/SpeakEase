import os
import json
import google.generativeai as genai
from dotenv import load_dotenv # type: ignore
import sys

load_dotenv()
api_key = os.getenv('MY_API_KEY')
genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-2.0-flash')


def chat(user_message: str, conversation_history: list, user_language: str) -> str:
    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        }
    ]
    
    context = f"""
    You are an English teaching assistant helping a {user_language} speaker learn English.
    Your responses should:
    1. Be helpful for English language practice
    2. Provide gentle corrections when needed
    3. Be culturally sensitive
    4. Optionally include {user_language} translations for complex concepts
    5. Maintain ethical standards at all times
    6. Not include special characters such as **, *, :, etc.
    
    Current conversation history:
    {"\n".join(conversation_history[-6:])}
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
    
if __name__== "__main__":
    user_message = str(sys.argv[1])
    history = sys.argv[2]
    user_language = str(sys.argv[2])

    result = chat(user_message, history, user_language)
    print(result)
    sys.stdout.flush()