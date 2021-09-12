from typing import Optional

from fastapi import FastAPI
from fastapi_utils.tasks import repeat_every
from logger import setup_logging
from datetime import datetime
from data_fetcher import fetch_data
import models
from database import engine

models.Base.metadata.create_all(bind=engine)

setup_logging()

app = FastAPI()


@app.on_event("startup")
@repeat_every(seconds=10)
def startup_event():
    fetch_data()


@app.get("/current-status")
def get_current_status():
    """
    TODO: Get latest entry from database
    """
    return {"Status": "Open"}


@app.get("/history")
def get_history(from_date: datetime, to_date: datetime):
    # Example 2021-09-05T18:19:04Z
    # Example 2021-09-05T20:19:04+02:00
    """
    TODO: Get entries between from_date and to_date from database
    """
    return {"fakedata": "fakedata"}
