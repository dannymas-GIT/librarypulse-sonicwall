import openai
import os
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

def test_openai_api():
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, how can you assist me today?"}
            ],
            max_tokens=50
        )

        print("OpenAI API Test Successful:")
        print(response['choices'][0]['message']['content'].strip())
    except Exception as e:
        print("OpenAI API Test Failed:", str(e))

if __name__ == "__main__":
    test_openai_api()