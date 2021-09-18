from sqlalchemy import Column, String
from sqlalchemy.sql.sqltypes import DateTime

from app.database import Base


class Status(Base):
    __tablename__ = "status"

    timestamp = Column(DateTime, primary_key=True)
    status = Column(String)
