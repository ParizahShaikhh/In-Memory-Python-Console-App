from sqlmodel import SQLModel
from db import engine
from models import Task, User


def create_db_and_tables():
    """
    Create database tables based on SQLModel models.

    This function creates all tables defined in the models:
    - users: User authentication and profile data
    - tasks: User tasks with CRUD operations

    It should be called on application startup.
    """
    SQLModel.metadata.create_all(bind=engine)


if __name__ == "__main__":
    create_db_and_tables()
    print("Database tables created successfully.")
    print("Tables created: users, tasks")
