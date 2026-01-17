# ============================================================
# StyleAdvisor AI - Push Notifications Endpoints
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/notifications
# ============================================================

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import httpx
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(prefix="/notifications", tags=["Notifications"])

EXTERNAL_NOTIF_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/notifications"

# ============ Models ============

class PushTokenRequest(BaseModel):
    token: str
    device_id: str
    platform: str  # 'ios', 'android'
    device_name: Optional[str] = None

class PushTokenResponse(BaseModel):
    success: bool
    message: str

class SendNotificationRequest(BaseModel):
    user_id: str
    title: str
    body: str
    data: Optional[Dict[str, Any]] = None

class BulkNotificationRequest(BaseModel):
    user_ids: List[str]
    title: str
    body: str
    data: Optional[Dict[str, Any]] = None

class NotificationResponse(BaseModel):
    success: bool
    message: str
    notification_id: Optional[str] = None

class NotificationStatsResponse(BaseModel):
    total_sent: int
    total_delivered: int
    total_failed: int
    delivery_rate: float

# ============ Endpoints ============

@router.post("/tokens", response_model=PushTokenResponse, summary="Save push notification token")
async def save_push_token(
    request: PushTokenRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Save a push notification token for the authenticated user.
    
    - **token**: The push notification token from Expo/FCM/APNs
    - **device_id**: Unique identifier for the device
    - **platform**: 'ios' or 'android'
    - **device_name**: Optional human-readable device name
    """
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": authorization} if authorization else {}
            response = await client.post(
                f"{EXTERNAL_NOTIF_URL}/tokens",
                json=request.dict(),
                headers=headers,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to save token')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.delete("/tokens/{device_id}", response_model=PushTokenResponse, summary="Remove push notification token")
async def remove_push_token(
    device_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    Remove a push notification token for a specific device.
    
    - **device_id**: The device ID whose token should be removed
    """
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": authorization} if authorization else {}
            response = await client.delete(
                f"{EXTERNAL_NOTIF_URL}/tokens/{device_id}",
                headers=headers,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to remove token')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/send", response_model=NotificationResponse, summary="Send notification")
async def send_notification(
    request: SendNotificationRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Send a push notification to a specific user.
    
    - **user_id**: Target user's ID
    - **title**: Notification title
    - **body**: Notification body text
    - **data**: Optional additional data payload
    """
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": authorization} if authorization else {}
            response = await client.post(
                f"{EXTERNAL_NOTIF_URL}/send",
                json=request.dict(),
                headers=headers,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to send notification')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/send/bulk", response_model=NotificationResponse, summary="Send bulk notification")
async def send_bulk_notification(
    request: BulkNotificationRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Send push notifications to multiple users at once.
    
    - **user_ids**: List of target user IDs
    - **title**: Notification title
    - **body**: Notification body text
    - **data**: Optional additional data payload
    """
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": authorization} if authorization else {}
            response = await client.post(
                f"{EXTERNAL_NOTIF_URL}/send/bulk",
                json=request.dict(),
                headers=headers,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to send bulk notification')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.get("/stats", response_model=NotificationStatsResponse, summary="Get notification statistics")
async def get_notification_stats(authorization: Optional[str] = Header(None)):
    """
    Get statistics about sent notifications.
    
    Returns metrics like total sent, delivered, failed, and delivery rate.
    """
    async with httpx.AsyncClient() as client:
        try:
            headers = {"Authorization": authorization} if authorization else {}
            response = await client.get(
                f"{EXTERNAL_NOTIF_URL}/stats",
                headers=headers,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to get stats')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")
