from fastapi import FastAPI, HTTPException, Request, Depends, Path
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from routes.tasks import router as tasks_router
from routes.auth import router as auth_router
from schemas import TaskCreate, TaskUpdate, TaskCompletionUpdate
from db import get_session
from auth.jwt_handler import get_current_user_id_from_token

# Note: Database tables should be created manually using:
# python -m db_init
# This prevents blocking the server startup

app = FastAPI(
    title="Task Management API",
    description="REST API for managing user tasks with persistent storage",
    version="1.0.0"
)

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes first
app.include_router(auth_router, prefix="/auth")

# Include task routes
app.include_router(tasks_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Task Management API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "task-management-api"}

# Global exception handler for authentication errors
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 401:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": "Unauthorized",
                "message": exc.detail
            }
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "message": str(exc.detail)
        }
    )
