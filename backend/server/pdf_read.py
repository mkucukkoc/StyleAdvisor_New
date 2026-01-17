# ============================================================
# StyleAdvisor AI - PDF Read Endpoints
# ============================================================
# Base URL: https://google-auth-e4er.onrender.com/api/v1/pdfread
# ============================================================

from fastapi import APIRouter, HTTPException
import httpx
from .config import EXTERNAL_API_BASE_URL

router = APIRouter(prefix="/pdfread", tags=["PDF Read"])

EXTERNAL_PDF_URL = f"{EXTERNAL_API_BASE_URL}/api/v1/pdfread"

# ============ Endpoints ============

@router.get("/health", summary="PDF Read service health check")
async def pdf_read_health():
    """
    Check the health status of the PDF Read service.
    
    Returns the service status and any relevant metrics.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{EXTERNAL_PDF_URL}/health",
                timeout=10.0
            )
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    "status": "unhealthy",
                    "message": "PDF service returned non-200 status"
                }
        except httpx.RequestError as e:
            return {
                "status": "unavailable",
                "message": f"Cannot reach PDF service: {str(e)}"
            }
