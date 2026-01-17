# ============================================================
# StyleAdvisor AI - Apple Sign-In Authentication Endpoints
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/auth/apple
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import httpx
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(prefix="/auth/apple", tags=["Apple Auth"])

EXTERNAL_APPLE_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/auth/apple"

# ============ Models ============

class AppleAuthStartRequest(BaseModel):
    redirect_uri: Optional[str] = None

class AppleAuthStartResponse(BaseModel):
    id: str
    auth_url: str

class AppleAuthStatusResponse(BaseModel):
    status: str  # 'pending', 'completed', 'expired', 'error'
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    user: Optional[dict] = None
    error: Optional[str] = None

class AppleCallbackRequest(BaseModel):
    code: str
    id_token: Optional[str] = None
    state: Optional[str] = None
    user: Optional[dict] = None  # Apple sends user info on first sign-in

class AppleCallbackResponse(BaseModel):
    success: bool
    message: str
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    user: Optional[dict] = None

# ============ Endpoints ============

@router.post("/start", response_model=AppleAuthStartResponse, summary="Start Apple authentication")
async def start_apple_auth(request: AppleAuthStartRequest = None):
    """
    Start the Apple Sign-In flow.
    
    Returns an ID to track the auth status and the URL for Apple Sign-In.
    The ID should be used to poll the /status endpoint.
    """
    async with httpx.AsyncClient() as client:
        try:
            body = request.dict() if request else {}
            response = await client.post(
                f"{EXTERNAL_APPLE_URL}/start",
                json=body,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to start Apple auth')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.get("/status/{auth_id}", response_model=AppleAuthStatusResponse, summary="Check Apple auth status")
async def check_apple_auth_status(auth_id: str):
    """
    Check the status of an Apple Sign-In flow.
    
    - **auth_id**: The ID returned from /start endpoint
    
    Poll this endpoint to check if the user has completed authentication.
    Status values:
    - 'pending': User hasn't completed auth yet
    - 'completed': Auth successful, tokens available
    - 'expired': Auth session expired
    - 'error': Auth failed
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{EXTERNAL_APPLE_URL}/status/{auth_id}",
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to get auth status')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/callback", response_model=AppleCallbackResponse, summary="Apple Sign-In callback")
async def apple_callback(request: AppleCallbackRequest):
    """
    Apple Sign-In callback endpoint.
    
    This endpoint handles the callback from Apple Sign-In.
    For native apps, the authorization code and id_token are sent directly.
    
    - **code**: Authorization code from Apple
    - **id_token**: Identity token from Apple (optional)
    - **state**: State parameter for CSRF protection
    - **user**: User info (only sent on first sign-in)
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_APPLE_URL}/callback",
                json=request.dict(),
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Apple callback failed')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")
