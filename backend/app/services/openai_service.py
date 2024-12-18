import os
import openai
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

openai.api_key = os.getenv('OPENAI_API_KEY')

class OpenAIService:
    def __init__(self):
        self.model = os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo')
        self.max_tokens = int(os.getenv('OPENAI_MAX_TOKENS', 500))

    def analyze_logs(self, logs: List[Dict]) -> List[str]:
        responses = []
        for log in logs:
            prompt = self._create_prompt(log)
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[{"role": "system", "content": "You are a SonicWall security expert."},
                          {"role": "user", "content": prompt}],
                max_tokens=self.max_tokens,
                n=1,
                stop=None,
                temperature=0.5
            )
            responses.append(response.choices[0].message['content'].strip())
        return responses

    def _create_prompt(self, log: Dict) -> str:
        return f"""
        As a SonicWall security expert, analyze the following firewall log entry:

        Context:
        - This is from a SonicWall Next-Generation Firewall
        - We need to determine if this is a genuine security concern or a benign/expected event
        - Consider common false positives and known legitimate patterns
        - Evaluate based on industry best practices and SonicWall-specific knowledge

        Log Entry:
        [CATEGORY]: {log['category']}
        [SEVERITY]: {log['severity']}
        [SOURCE]: {log['source']}
        [MESSAGE]: {log['message']}

        Please provide:
        1. A brief assessment of whether this is likely a genuine security concern or a benign event
        2. The reasoning behind your assessment
        3. Recommended actions if any are needed
        4. Whether this type of event can be safely marked as innocuous for future occurrences

        Keep the response concise and focused on actionable insights.
        """ 