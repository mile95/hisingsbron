from sqlalchemy.orm import Session

import models


def store_status(db: Session, timestamp: str, status: str):
    db_status = models.Status(timestamp=timestamp, status=status)
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status


def get_latest_status(db: Session):
    return db.query(models.Status).order_by(models.Status.timestamp.desc()).first()
