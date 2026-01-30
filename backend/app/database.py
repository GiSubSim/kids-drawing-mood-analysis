# DB 연결

from sqlmodel import create_engine, Session
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


# SQLite일 경우에만 특별한 옵션 추가
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
else:
    engine = create_engine(DATABASE_URL)

def get_session():
    with Session(engine) as session:
        yield session



# # postgresSQL 쓸 때 필요
# engine = create_engine(DATABASE_URL)

# def get_session():
#     with Session(engine) as session:
#         yield session