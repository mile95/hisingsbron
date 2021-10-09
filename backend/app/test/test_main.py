import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from main import app, get_db
from data_fetcher import fetch_data
from datetime import datetime

from crud import store_status

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
TIMESTAMP_2019 = datetime.fromisoformat("2019-01-01 10:10:10")
TIMESTAMP_2020 = datetime.fromisoformat("2020-01-01 10:10:10")
TIMESTAMP_2021 = datetime.fromisoformat("2021-01-01 10:10:10")

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(scope="module")
def db():
    store_status(next(override_get_db()), TIMESTAMP_2019, "Closed")
    store_status(next(override_get_db()), TIMESTAMP_2020, "Open")
    store_status(next(override_get_db()), TIMESTAMP_2021, "Closed")
    yield None
    os.remove("test.db")


def test_get_current_status(db):
    response = client.get("/current-status")
    assert response.status_code == 200
    assert response.json() == {"status": "Closed", "timestamp": "2021-01-01T10:10:10"}


def test_get_history(db):
    response = client.get("/history?from_date=2019-01-01&to_date=2022-01-01")
    assert response.status_code == 200
    assert response.json() == [
        {"status": "Closed", "timestamp": "2019-01-01T10:10:10"},
        {"status": "Open", "timestamp": "2020-01-01T10:10:10"},
        {"status": "Closed", "timestamp": "2021-01-01T10:10:10"},
    ]
