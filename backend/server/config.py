# ============================================================
# StyleAdvisor AI - Configuration
# ============================================================

import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

# External API Base URL
EXTERNAL_API_BASE_URL = os.getenv('EXTERNAL_API_BASE_URL', 'https://google-auth-e4er.onrender.com')

# API Version
API_VERSION = 'v1'

# Database
MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.getenv('DB_NAME', 'styleadvisor_db')

# JWT Settings
JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key-here')
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7
