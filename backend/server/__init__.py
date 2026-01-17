# StyleAdvisor AI - Backend Server Module
# All API endpoints are organized in separate files for maintainability

from .auth import router as auth_router
from .email_otp import router as email_otp_router
from .google_auth import router as google_auth_router
from .apple_auth import router as apple_auth_router
from .password_reset import router as password_reset_router
from .pdf_read import router as pdf_read_router
from .notifications import router as notifications_router
from .delete_account import router as delete_account_router
from .premium import router as premium_router
from .webhooks import router as webhooks_router

__all__ = [
    'auth_router',
    'email_otp_router',
    'google_auth_router',
    'apple_auth_router',
    'password_reset_router',
    'pdf_read_router',
    'notifications_router',
    'delete_account_router',
    'premium_router',
    'webhooks_router',
]
