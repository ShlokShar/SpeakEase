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
    9. Do NOT correct the user if they're text is perfectly understandable
    10. Do not use special characters such as * or **

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
    
if __name__== "__main__":
    user_message = str(sys.argv[1])
    history = sys.argv[2]
    user_language = str(sys.argv[2])

    result = chat(user_message, history, user_language)
    print(result)
    sys.stdout.flush()