# ============================================================
# StyleAdvisor AI - Password Reset Endpoints
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/auth/password-reset
# ============================================================

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
import httpx
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(prefix="/auth/password-reset", tags=["Password Reset"])

EXTERNAL_PASSWORD_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/auth/password-reset"

# ============ Models ============

class PasswordResetRequestModel(BaseModel):
    email: EmailStr

class PasswordResetConfirmModel(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

class PasswordResetResponse(BaseModel):
    message: str
    success: bool = True

# ============ Endpoints ============

@router.post("/request", response_model=PasswordResetResponse, summary="Request password reset")
async def request_password_reset(request: PasswordResetRequestModel):
    """
    Request a password reset email.
    
    - **email**: The email address associated with the account
    
    If the email exists, a password reset link will be sent.
    For security, this endpoint returns success even if the email doesn't exist.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_PASSWORD_URL}/request",
                json=request.dict(),
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                # For security, don't reveal if email exists
                return {"message": "If the email exists, a reset link has been sent", "success": True}
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/confirm", response_model=PasswordResetResponse, summary="Confirm password reset")
async def confirm_password_reset(request: PasswordResetConfirmModel):
    """
    Confirm the password reset with the token and new password.
    
    - **token**: The reset token from the email link
    - **new_password**: The new password (minimum 8 characters)
    
    The token is single-use and expires after a set time (usually 1 hour).
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_PASSWORD_URL}/confirm",
                json=request.dict(),
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Password reset failed')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")
