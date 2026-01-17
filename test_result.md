#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  StyleAdvisor AI mobil uygulaması için backend entegrasyonu yapılması gerekiyor.
  Kullanıcı external API (https://google-auth-e4er.onrender.com) ile authentication ve diğer işlemler için bağlantı istiyor.
  Tüm endpoint'ler proxy olarak backend'e eklenmeli.

backend:
  - task: "Authentication Endpoints (register, login, refresh, logout, logout-all, me)"
    implemented: true
    working: "NA"
    file: "backend/routers/auth.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "External API'ye proxy yapan auth endpoint'leri eklendi"

  - task: "Email OTP Endpoints (start, verify)"
    implemented: true
    working: "NA"
    file: "backend/routers/email_otp.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Email OTP başlatma ve doğrulama endpoint'leri eklendi"

  - task: "Google Auth Endpoints (start, status, callback)"
    implemented: true
    working: "NA"
    file: "backend/routers/google_auth.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Google OAuth başlatma, durum kontrolü ve callback endpoint'leri eklendi"

  - task: "Apple Auth Endpoints (start, status, callback)"
    implemented: true
    working: "NA"
    file: "backend/routers/apple_auth.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Apple Sign-In endpoint'leri eklendi"

  - task: "Password Reset Endpoints (request, confirm)"
    implemented: true
    working: "NA"
    file: "backend/routers/password_reset.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Şifre sıfırlama talep ve onay endpoint'leri eklendi"

  - task: "PDF Read Endpoint (health)"
    implemented: true
    working: "NA"
    file: "backend/routers/pdf_read.py"
    stuck_count: 0
    priority: "low"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "PDF okuma servisi health check endpoint'i eklendi"

  - task: "Notifications Endpoints (tokens, send, send/bulk, stats)"
    implemented: true
    working: "NA"
    file: "backend/routers/notifications.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Push notification token yönetimi ve gönderme endpoint'leri eklendi"

  - task: "Delete Account Endpoints (GDPR/KVKK compliant)"
    implemented: true
    working: "NA"
    file: "backend/routers/delete_account.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Hesap silme, veri dışa aktarma ve hesap geri yükleme endpoint'leri eklendi"

  - task: "Premium Subscription Endpoints (customer-info, restore, sync, status)"
    implemented: true
    working: "NA"
    file: "backend/routers/premium.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Premium abonelik yönetimi endpoint'leri eklendi"

  - task: "Webhook Endpoints (RevenueCat)"
    implemented: true
    working: "NA"
    file: "backend/routers/webhooks.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "RevenueCat webhook endpoint'leri eklendi"

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus:
    - "Authentication Endpoints"
    - "Google Auth Endpoints"
    - "Premium Subscription Endpoints"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Tüm backend endpoint'leri oluşturuldu. External API (https://google-auth-e4er.onrender.com) ile proxy bağlantısı kuruldu.
      Oluşturulan endpoint'ler:
      - /api/v1/auth/* (register, login, refresh, logout, logout-all, me)
      - /api/v1/auth/email/* (start, verify)
      - /api/v1/auth/google/* (start, status/{id}, callback)
      - /api/v1/auth/apple/* (start, status/{id}, callback)
      - /api/v1/auth/password-reset/* (request, confirm)
      - /api/v1/pdfread/health
      - /api/v1/notifications/* (tokens, send, send/bulk, stats)
      - /api/v1/delete-account/* (init, export, restore, jobs)
      - /api/v1/premium/* (customer-info, restore, sync, status)
      - /api/v1/webhooks/revenuecat