from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from sqlmodel import Session
from typing import Generator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# Lazy engine - only created when first accessed
_engine = None

def get_engine():
    """Get or create the database engine (lazy initialization)."""
    global _engine
    if _engine is None:
        _engine = create_engine(
            DATABASE_URL,
            poolclass=QueuePool,
            pool_size=5,
            max_overflow=10,
            pool_recycle=300,
            echo=False
        )
    return _engine

# For backwards compatibility - this will be accessed as a property
class _EngineLazy:
    def __getattr__(self, name):
        return getattr(get_engine(), name)

engine = _EngineLazy()

def get_session() -> Generator[Session, None, None]:
    """
    Dependency function that provides database sessions.

    Yields:
        Session: A SQLModel session for database operations
    """
    with Session(get_engine()) as session:
        yield session
