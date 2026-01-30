# DB 테이블
from typing import Optional, Dict
from sqlmodel import SQLModel, Field, Column
from sqlalchemy import JSON # Posrgres사용시 JSONB로 교체 -> 아래 result_json: Dict = Field(sa_column=Column(JSONB))로 교체
from datetime import datetime

class AnalysisLog(SQLModel, table=True):
    __tablename__ = "analysis_logs"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    persona: str
    
    # Gemini 분석 결과 원본을 통째로 저장 (가장 유연한 방식)
    result_json: Dict = Field(sa_column=Column(JSON))