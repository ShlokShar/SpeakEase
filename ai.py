import os
import json
from google import genai

# Initialize Gemini
GEMINI_API_KEY = os.getenv("AIzaSyCfK7-uZ82TXHfB1cYTctOngANed9gTzus")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')