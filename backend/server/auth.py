# ============================================================
# StyleAdvisor AI - Authentication Endpoints
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/auth
# ============================================================

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import httpx
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(prefix="/auth", tags=["Authentication"])

EXTERNAL_AUTH_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/auth"

# ============ Models ============

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2)
    language: Optional[str] = 'tr'

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = 'bearer'
    expires_in: int

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    is_premium: bool = False
    created_at: str

class AuthResponse(BaseModel):
    user: UserResponse
    tokens: TokenResponse

# ============ Endpoints ============

@router.post("/register", response_model=AuthResponse, summary="Register new user")
async def register(request: RegisterRequest):
    """
    Register a new user with email and password.
    
    - **email**: Valid email address
    - **password**: Minimum 8 characters
    - **full_name**: User's full name
    - **language**: Preferred language (default: tr)
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_AUTH_URL}/register",
                json=request.dict(),
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Registration failed')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/login", response_model=AuthResponse, summary="Login user")
async def login(request: LoginRequest):
    """
    Authenticate user with email and password.
    
    Returns access token and refresh token on success.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_AUTH_URL}/login",
                json=request.dict(),
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Login failed')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/refresh", response_model=TokenResponse, summary="Refresh access token")
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh the access token using a valid refresh token.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_AUTH_URL}/refresh",
                json=request.dict(),
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Token refresh failed')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/logout", summary="Logout user")
async def logout(authorization: Optional[str] = Header(None)):
    """
    Logout the current user and invalidate their token.
    """
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": authorization} if authorization else {}
            response = await client.post(
                f"{EXTERNAL_AUTH_URL}/logout",
                headers=headers,
                timeout=30.0
            )
            if response.status_code == 200:
                return {"message": "Logged out successfully"}
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Logout failed')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/logout-all", summary="Logout from all devices")
async def logout_all(authorization: Optional[str] = Header(None)):
    """
    Logout from all devices and invalidate all tokens.
    """
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": authorization} if authorization else {}
            response = await client.post(
                f"{EXTERNAL_AUTH_URL}/logout-all",
                headers=headers,
                timeout=30.0
            )
            if response.status_code == 200:
                return {"message": "Logged out from all devices"}
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Logout all failed')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.get("/me", response_model=UserResponse, summary="Get current user")
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Get the currently authenticated user's profile.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header required")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{EXTERNAL_AUTH_URL}/me",
                headers={"Authorization": authorization},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to get user')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")
