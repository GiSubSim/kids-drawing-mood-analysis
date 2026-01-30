# 서버 실행

from fastapi import FastAPI, UploadFile, File, Form, Depends
from typing import List
from sqlmodel import Session, SQLModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, get_session
from .models import AnalysisLog
from .schemas import AnalysisResponse
from .services import run_gemini_analysis

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_endpoint(
    files: List[UploadFile] = File(...),
    persona: str = Form(...),
    db: Session = Depends(get_session)
):
    
    # 1. 이미지 읽기
    image_data = [await file.read() for file in files]

    # 2. AI 분석
    result = await run_gemini_analysis(image_data, persona) # 인풋으로 이미지데이터, 페르조나 선택값
    
    # DB 저장
    log = AnalysisLog(persona=persona, result_json=result)
    db.add(log)
    db.commit()
    
    return result