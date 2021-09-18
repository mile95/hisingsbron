from sqlalchemy.orm import Session
from datetime import date

from models import Status


def store_status(db: Session, timestamp: str, status: str):
    db_status = Status(timestamp=timestamp, status=status)
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status


def get_latest_status(db: Session):
    return db.query(Status).order_by(Status.timestamp.desc()).first()


def get_history_between_dates(db: Session, from_date: date, to_date: date):
    return (
        db.query(Status)
        .filter(Status.timestamp.between(str(from_date), str(to_date)))
        .all()
    )
