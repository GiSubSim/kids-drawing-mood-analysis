# 제미나이 호출

import google.generativeai as genai
import json
import os
from PIL import Image
import io
from .prompts import SYSTEM_PROMPT

def configure_genai():
    api_key = os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=api_key)

async def run_gemini_analysis(image_bytes_list: list[bytes], persona: str):
    configure_genai()
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash", 
        system_instruction=SYSTEM_PROMPT
    )

    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
    ]
    
    # 제목 입력 로직 제거됨 (요청사항 반영)
    content_inputs = [f"사용자가 선택한 페르소나: {persona}\n위 페르소나 말투로 JSON 포맷에 맞춰 답변해줘."]
    
    for img_bytes in image_bytes_list:
        image = Image.open(io.BytesIO(img_bytes))
        content_inputs.append(image)
        
    response = model.generate_content(
        content_inputs,
        safety_settings=safety_settings,
        generation_config={
            "response_mime_type": "application/json", 
            "temperature": 0.2
        }
    )
    return json.loads(response.text)

