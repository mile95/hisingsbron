from typing import Optional

from fastapi import FastAPI, Depends
from fastapi_utils.tasks import repeat_every
from sqlalchemy.orm import Session
from logger import setup_logging
import asyncio
from datetime import date
from data_fetcher import fetch_data
import models
from database import engine, SessionLocal
import crud

models.Base.metadata.create_all(bind=engine)
setup_logging()

# Make sure to raise exception that happens outside the main thread.
asyncio.get_running_loop().set_exception_handler(None)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()


@app.on_event("startup")
@repeat_every(seconds=10, raise_exceptions=True)
def startup_event():
    fetch_data()


@app.get("/current-status")
def get_current_status(db: Session = Depends(get_db)):
    return crud.get_latest_status(db=db)


@app.get("/history")
def get_history(from_date: date, to_date: date, db: Session = Depends(get_db)):
    # Example 2021-09-05T18:19:04Z
    # Example 2021-09-05T20:19:04+02:00
    return crud.get_history_between_dates(db=db, from_date=from_date, to_date=to_date)
