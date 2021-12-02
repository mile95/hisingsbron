from typing import Optional

from fastapi import FastAPI, Depends
from fastapi_utils.tasks import repeat_every
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from logger import setup_logging
from datetime import date
from data_fetcher import fetch_data
from crud import get_historical_records, get_latest_status

setup_logging()

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
@repeat_every(seconds=5, raise_exceptions=True)
def startup_event():
    fetch_data()


@app.get("/current-status")
def get_current_status():
    return get_latest_status()


@app.get("/history")
def get_history(time_since):
    # Example 30d
    # Example 1w
    return get_historical_records(time_since)