# ============================================================
# StyleAdvisor AI - Webhook Endpoints
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/webhooks
# ============================================================

from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
import httpx
import logging
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(tags=["Webhooks"])

EXTERNAL_WEBHOOK_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/webhooks"
EXTERNAL_LEGACY_WEBHOOK_URL = f"{EXTERNAL_API_BASE_URL}/webhooks"

logger = logging.getLogger(__name__)

# ============ Models ============

class WebhookResponse(BaseModel):
    success: bool
    message: str

# ============ Endpoints ============

@router.post("/webhooks/revenuecat", response_model=WebhookResponse, summary="RevenueCat webhook (v1)")
async def revenuecat_webhook_v1(
    request: Request,
    x_revenuecat_signature: Optional[str] = Header(None, alias="X-RevenueCat-Signature")
):
    """
    Handle RevenueCat webhook events (v1 path).
    
    This endpoint receives webhook notifications from RevenueCat for:
    - Initial purchases
    - Renewals
    - Cancellations
    - Billing issues
    - Product changes
    - Expirations
    
    The webhook is verified using the X-RevenueCat-Signature header.
    """
    try:
        body = await request.json()
        logger.info(f"RevenueCat webhook received (v1): {body.get('type', 'unknown')}")
    except Exception:
        body = {}
    
    async with httpx.AsyncClient() as client:
        try:
            headers = {}
            if x_revenuecat_signature:
                headers["X-RevenueCat-Signature"] = x_revenuecat_signature
            
            response = await client.post(
                f"{EXTERNAL_WEBHOOK_URL}/revenuecat",
                json=body,
                headers=headers,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"RevenueCat webhook failed: {response.status_code}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Webhook processing failed')
                )
        except httpx.RequestError as e:
            logger.error(f"RevenueCat webhook error: {str(e)}")
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")


@router.post("/webhooks/revenuecat/legacy", response_model=WebhookResponse, summary="RevenueCat webhook (legacy path)")
async def revenuecat_webhook_legacy(
    request: Request,
    x_revenuecat_signature: Optional[str] = Header(None, alias="X-RevenueCat-Signature")
):
    """
    Handle RevenueCat webhook events (legacy path).
    
    This is the legacy webhook endpoint path for backwards compatibility.
    New integrations should use /api/v1/webhooks/revenuecat instead.
    """
    try:
        body = await request.json()
        logger.info(f"RevenueCat webhook received (legacy): {body.get('type', 'unknown')}")
    except Exception:
        body = {}
    
    async with httpx.AsyncClient() as client:
        try:
            headers = {}
            if x_revenuecat_signature:
                headers["X-RevenueCat-Signature"] = x_revenuecat_signature
            
            response = await client.post(
                f"{EXTERNAL_LEGACY_WEBHOOK_URL}/revenuecat",
                json=body,
                headers=headers,
                timeout=30.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"RevenueCat legacy webhook failed: {response.status_code}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get('detail', 'Webhook processing failed')
                )
        except httpx.RequestError as e:
            logger.error(f"RevenueCat legacy webhook error: {str(e)}")
            raise HTTPException(status_code=503, detail=f"External service unavailable: {str(e)}")
