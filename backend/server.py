from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime

# Import all routers
from routers.auth import router as auth_router
from routers.email_otp import router as email_otp_router
from routers.google_auth import router as google_auth_router
from routers.apple_auth import router as apple_auth_router
from routers.password_reset import router as password_reset_router
from routers.pdf_read import router as pdf_read_router
from routers.notifications import router as notifications_router
from routers.delete_account import router as delete_account_router
from routers.premium import router as premium_router
from routers.webhooks import router as webhooks_router


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(
    title="StyleAdvisor AI API",
    description="Backend API for StyleAdvisor AI mobile application",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create versioned API router
api_v1_router = APIRouter(prefix="/api/v1")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "StyleAdvisor AI Backend API"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "StyleAdvisor AI"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include all routers in the versioned API router
api_v1_router.include_router(auth_router)
api_v1_router.include_router(email_otp_router)
api_v1_router.include_router(google_auth_router)
api_v1_router.include_router(apple_auth_router)
api_v1_router.include_router(password_reset_router)
api_v1_router.include_router(pdf_read_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(delete_account_router)
api_v1_router.include_router(premium_router)
api_v1_router.include_router(webhooks_router)

# Include all routers in the main app
app.include_router(api_router)
app.include_router(api_v1_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
