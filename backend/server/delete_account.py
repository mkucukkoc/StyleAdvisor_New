# ============================================================
# StyleAdvisor AI - Delete Account Endpoints (GDPR/KVKK Compliant)
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/delete-account
# ============================================================

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import httpx
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(prefix="/delete-account", tags=["Delete Account"])

EXTERNAL_DELETE_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/delete-account"

# ============ Models ============

class DeleteAccountRequest(BaseModel):
    reason: Optional[str] = None
    feedback: Optional[str] = None
    confirm: bool = True

class DeleteAccountResponse(BaseModel):
    success: bool
    message: str
    job_id: str
    scheduled_deletion_date: Optional[str] = None

class ExportDataResponse(BaseModel):
    success: bool
    message: str
    download_url: Optional[str] = None
    expires_at: Optional[str] = None

class RestoreAccountRequest(BaseModel):
    job_id: str

class RestoreAccountResponse(BaseModel):
    success: bool
    message: str

class DeletionJobStatus(BaseModel):
    job_id: str
    status: str  # 'pending', 'processing', 'completed', 'cancelled'
    created_at: str
    scheduled_date: Optional[str] = None
    completed_at: Optional[str] = None

# ============ Endpoints ============

@router.post("", response_model=DeleteAccountResponse, summary="Initiate account deletion")
async def initiate_account_deletion(
    request: DeleteAccountRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Initiate the account deletion process.
    
    - **reason**: Optional reason for leaving
    - **feedback**: Optional feedback for improvement
    - **confirm**: Must be true to confirm deletion
    
    Account deletion is typically delayed (e.g., 30 days) to allow for recovery.
    During this period, the account is deactivated but can be restored.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                EXTERNAL_DELETE_URL,
                json=request.dict(),
                headers={"Authorization": authorization},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to initiate deletion')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/export", response_model=ExportDataResponse, summary="Export user data (GDPR)")
async def export_user_data(authorization: Optional[str] = Header(None)):
    """
    Export all user data in compliance with GDPR/KVKK.
    
    Returns a download URL for a file containing all user data.
    The download link is temporary and expires after a set time.
    
    Data includes:
    - Profile information
    - Wardrobe items
    - Analysis history
    - Favorites
    - Settings and preferences
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_DELETE_URL}/export",
                headers={"Authorization": authorization},
                timeout=60.0  # Longer timeout for data export
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to export data')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/restore", response_model=RestoreAccountResponse, summary="Restore deleted account")
async def restore_account(
    request: RestoreAccountRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Restore a deleted account before the grace period ends.
    
    - **job_id**: The deletion job ID returned when deletion was initiated
    
    This can only be done during the grace period (typically 30 days).
    After the grace period, the account and all data are permanently deleted.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_DELETE_URL}/restore",
                json=request.dict(),
                headers={"Authorization": authorization},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to restore account')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.get("/jobs/{job_id}", response_model=DeletionJobStatus, summary="Get deletion job status")
async def get_deletion_job_status(
    job_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    Get the status of a specific deletion job.
    
    - **job_id**: The deletion job ID
    
    Status values:
    - 'pending': Deletion scheduled but not started
    - 'processing': Deletion in progress
    - 'completed': Deletion finished
    - 'cancelled': Deletion was cancelled (account restored)
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{EXTERNAL_DELETE_URL}/jobs/{job_id}",
                headers={"Authorization": authorization},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to get job status')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.get("/jobs/latest", response_model=DeletionJobStatus, summary="Get latest deletion job for user")
async def get_latest_deletion_job(authorization: Optional[str] = Header(None)):
    """
    Get the most recent deletion job for the authenticated user.
    
    Useful to check if there's an active deletion request.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{EXTERNAL_DELETE_URL}/jobs/latest",
                headers={"Authorization": authorization},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                raise HTTPException(status_code=404, detail="No deletion job found")
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to get latest job')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")
