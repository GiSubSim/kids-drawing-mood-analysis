# backend/app/database.py
# SQLite가 아닐 때(즉, Neon DB를 쓸 때)" 끊김 방지 기능(pool_pre_ping=True)을 넣은 코드

from sqlmodel import create_engine, Session
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# 1. SQLite일 경우 (로컬 테스트용)
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}
    engine = create_engine(DATABASE_URL, connect_args=connect_args)

# 2. PostgreSQL일 경우 (Neon DB / Render 배포용)
else:
    # 💡 여기에 pool_pre_ping=True 옵션을 추가했습니다!
    # DB 연결이 끊겼는지 확인하고, 끊겼으면 재연결해주는 옵션입니다.
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

def get_session():
    with Session(engine) as session:
        yield session