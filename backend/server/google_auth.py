# ============================================================
# StyleAdvisor AI - Google OAuth Authentication Endpoints
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/auth/google
# ============================================================

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
import httpx
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(prefix="/auth/google", tags=["Google Auth"])

EXTERNAL_GOOGLE_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/auth/google"

# ============ Models ============

class GoogleAuthStartRequest(BaseModel):
    redirect_uri: Optional[str] = None

class GoogleAuthStartResponse(BaseModel):
    id: str
    auth_url: str

class GoogleAuthStatusResponse(BaseModel):
    status: str  # 'pending', 'completed', 'expired', 'error'
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    user: Optional[dict] = None
    error: Optional[str] = None

class GoogleCallbackResponse(BaseModel):
    success: bool
    message: str

# ============ Endpoints ============

@router.post("/start", response_model=GoogleAuthStartResponse, summary="Start Google authentication")
async def start_google_auth(request: GoogleAuthStartRequest = None):
    """
    Start the Google OAuth flow.
    
    Returns an ID to track the auth status and the URL to redirect the user to.
    The ID should be used to poll the /status endpoint.
    """
    async with httpx.AsyncClient() as client:
        try:
            body = request.dict() if request else {}
            response = await client.post(
                f"{EXTERNAL_GOOGLE_URL}/start",
                json=body,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to start Google auth')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.get("/status/{auth_id}", response_model=GoogleAuthStatusResponse, summary="Check Google auth status")
async def check_google_auth_status(auth_id: str):
    """
    Check the status of a Google OAuth flow.
    
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
                f"{EXTERNAL_GOOGLE_URL}/status/{auth_id}",
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


@router.get("/callback", response_model=GoogleCallbackResponse, summary="Google OAuth callback")
async def google_callback(
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None)
):
    """
    Google OAuth callback endpoint.
    
    This endpoint is called by Google after the user authorizes the application.
    It should not be called directly by clients.
    """
    async with httpx.AsyncClient() as client:
        try:
            params = {}
            if code:
                params['code'] = code
            if state:
                params['state'] = state
            if error:
                params['error'] = error
                
            response = await client.get(
                f"{EXTERNAL_GOOGLE_URL}/callback",
                params=params,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Google callback failed')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")
