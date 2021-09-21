from typing import Optional

from fastapi import FastAPI, Depends
from fastapi_utils.tasks import repeat_every
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from logger import setup_logging
from datetime import date
from data_fetcher import fetch_data
from models import Base
from database import engine, SessionLocal
from crud import get_history_between_dates, get_latest_status

Base.metadata.create_all(bind=engine)
setup_logging()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
@repeat_every(seconds=10, raise_exceptions=True)
def startup_event():
    fetch_data()


@app.get("/current-status")
def get_current_status(db: Session = Depends(get_db)):
    return get_latest_status(db=db)


@app.get("/history")
def get_history(from_date: date, to_date: date, db: Session = Depends(get_db)):
    # Example 2021-09-05T18:19:04Z
    # Example 2021-09-05T20:19:04+02:00
    return get_history_between_dates(db=db, from_date=from_date, to_date=to_date)
