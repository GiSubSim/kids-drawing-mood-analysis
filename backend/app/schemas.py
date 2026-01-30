# 데이터 검증

from pydantic import BaseModel
from typing import List, Dict

class CommentarySection(BaseModel):
    title: str
    content: str

class AnalysisData(BaseModel):
    mind_expression: str
    persona_mind_sentence: str
    persona_energy_sentence: str
    word_cloud: List[str]
    top_5_colors: List[str]
    energy_chart: Dict[str, float]

class AnalysisResponse(BaseModel):
    analysis_result: AnalysisData
    character_commentary: str
    commentary_sections: List[CommentarySection]