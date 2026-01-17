# ============================================================
# StyleAdvisor AI - Email OTP Authentication Endpoints
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/auth/email
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import httpx
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(prefix="/auth/email", tags=["Email OTP"])

EXTERNAL_EMAIL_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/auth/email"

# ============ Models ============

class EmailOTPStartRequest(BaseModel):
    email: EmailStr

class EmailOTPVerifyRequest(BaseModel):
    email: EmailStr
    otp: str

class OTPStartResponse(BaseModel):
    message: str
    expires_in: int

class OTPVerifyResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'
    user: dict

# ============ Endpoints ============

@router.post("/start", response_model=OTPStartResponse, summary="Request OTP code")
async def start_email_otp(request: EmailOTPStartRequest):
    """
    Request an OTP code to be sent to the provided email address.
    
    - **email**: Valid email address to receive OTP
    
    The OTP will be valid for a limited time (usually 5 minutes).
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_EMAIL_URL}/start",
                json=request.dict(),
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to send OTP')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/verify", response_model=OTPVerifyResponse, summary="Verify OTP and login")
async def verify_email_otp(request: EmailOTPVerifyRequest):
    """
    Verify the OTP code and login the user.
    
    - **email**: Email address that received the OTP
    - **otp**: The OTP code received via email
    
    Returns access token and user info on success.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_EMAIL_URL}/verify",
                json=request.dict(),
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'OTP verification failed')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")
