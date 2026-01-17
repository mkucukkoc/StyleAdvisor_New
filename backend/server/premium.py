# ============================================================
# StyleAdvisor AI - Premium Subscription Endpoints
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/premium
# ============================================================

from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
import httpx
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(prefix="/premium", tags=["Premium"])

EXTERNAL_PREMIUM_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/premium"

# ============ Models ============

class CustomerInfoRequest(BaseModel):
    customer_info: Dict[str, Any]
    app_user_id: Optional[str] = None

class PremiumSyncRequest(BaseModel):
    receipt: Optional[str] = None
    product_id: Optional[str] = None
    transaction_id: Optional[str] = None

class PremiumStatusResponse(BaseModel):
    is_premium: bool
    subscription_type: Optional[str] = None  # 'monthly', 'yearly', 'lifetime'
    expires_at: Optional[str] = None
    auto_renew: bool = False
    features: Optional[Dict[str, bool]] = None

class PremiumSyncResponse(BaseModel):
    success: bool
    message: str
    is_premium: bool
    subscription_type: Optional[str] = None
    expires_at: Optional[str] = None

class RestorePurchaseResponse(BaseModel):
    success: bool
    message: str
    restored_purchases: int
    is_premium: bool

# ============ Endpoints ============

@router.post("/customer-info", response_model=PremiumSyncResponse, summary="Sync premium status with customer info")
async def sync_customer_info(
    request: CustomerInfoRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Sync premium subscription status with RevenueCat customer info.
    
    - **customer_info**: RevenueCat customer info object
    - **app_user_id**: Optional RevenueCat app user ID
    
    This endpoint should be called when:
    - App launches and customer info is fetched
    - After a successful purchase
    - When customer info is updated
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_PREMIUM_URL}/customer-info",
                json=request.dict(),
                headers={"Authorization": authorization},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to sync customer info')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/restore", response_model=RestorePurchaseResponse, summary="Restore premium purchases")
async def restore_purchases(authorization: Optional[str] = Header(None)):
    """
    Restore previous premium purchases.
    
    This endpoint triggers a restore of all previous purchases from
    the App Store or Play Store associated with the user's account.
    
    Useful when:
    - User reinstalls the app
    - User logs in on a new device
    - User's premium status seems incorrect
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{EXTERNAL_PREMIUM_URL}/restore",
                headers={"Authorization": authorization},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to restore purchases')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/sync", response_model=PremiumSyncResponse, summary="Manual premium sync")
async def manual_sync(
    request: PremiumSyncRequest = None,
    authorization: Optional[str] = Header(None)
):
    """
    Manually sync premium status with the payment provider.
    
    - **receipt**: Optional purchase receipt for validation
    - **product_id**: Optional product identifier
    - **transaction_id**: Optional transaction ID
    
    If no parameters are provided, syncs based on stored customer info.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    async with httpx.AsyncClient() as client:
        try:
            body = request.dict() if request else {}
            response = await client.post(
                f"{EXTERNAL_PREMIUM_URL}/sync",
                json=body,
                headers={"Authorization": authorization},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to sync premium')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.get("/status", response_model=PremiumStatusResponse, summary="Get premium status")
async def get_premium_status(authorization: Optional[str] = Header(None)):
    """
    Get the current premium subscription status.
    
    Returns:
    - **is_premium**: Whether user has active premium
    - **subscription_type**: Type of subscription (monthly/yearly/lifetime)
    - **expires_at**: When the subscription expires (null for lifetime)
    - **auto_renew**: Whether auto-renewal is enabled
    - **features**: Dictionary of premium features and their availability
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{EXTERNAL_PREMIUM_URL}/status",
                headers={"Authorization": authorization},
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Failed to get premium status')
                )
        except httpx.RequestError as e:
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")
