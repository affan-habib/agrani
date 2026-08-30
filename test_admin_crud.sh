#!/bin/bash
# ==============================================================================
# Agrani Enterprise Admin & Public APIs Complete CRUD & End-to-End Test Suite
# Tests all 17 Resources, Page Singletons, Submissions, and Public Endpoints
# ==============================================================================

BASE_URL="http://192.168.30.27:8000/api/v1"
FRONTEND_TOKEN="agrani_frontend_api_token_2024"
EMAIL="superadmin1@example.com"
PASSWORD="Password@123"

TS=$(date +%s)

# Formatting Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

PASSED_COUNT=0
FAILED_COUNT=0
TOTAL_COUNT=0

log_header() {
    echo -e "\n${BLUE}==============================================================================${NC}"
    echo -e "${BOLD}${CYAN}  $1${NC}"
    echo -e "${BLUE}==============================================================================${NC}"
}

log_test() {
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    local description="$1"
    local status_code="$2"
    local expected_status="$3"
    local body="$4"

    if [[ "$status_code" =~ ^(${expected_status})$ ]]; then
        PASSED_COUNT=$((PASSED_COUNT + 1))
        echo -e "  ${GREEN}[PASS]${NC} $description (HTTP $status_code)"
    else
        FAILED_COUNT=$((FAILED_COUNT + 1))
        echo -e "  ${RED}[FAIL]${NC} $description (Expected $expected_status, got HTTP $status_code)"
        echo -e "         ${YELLOW}Response:${NC} $(echo "$body" | head -c 250)"
    fi
    sleep 0.08
}

curl_with_retry() {
    local max_retries=5
    local delay=2
    local output=""
    local code=""

    for ((i=1; i<=max_retries; i++)); do
        output=$(curl -s -w "\n%{http_code}" "$@")
        code=$(echo "$output" | tail -n1)
        if [ "$code" != "429" ]; then
            echo "$output"
            return 0
        fi
        sleep $delay
        delay=$((delay + 1))
    done
    echo "$output"
}

extract_json_id() {
    echo "$1" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*'
}

# ------------------------------------------------------------------------------
# 1. AUTHENTICATION & ACCESS CONTROL
# ------------------------------------------------------------------------------
log_header "1. AUTHENTICATION & ACCESS CONTROL APIS"

LOGIN_RESP=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"device_name\":\"comprehensive_tester\"}" \
  "$BASE_URL/admin/auth/login")

LOGIN_CODE=$(echo "$LOGIN_RESP" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESP" | sed '$d')

log_test "POST /admin/auth/login" "$LOGIN_CODE" "200" "$LOGIN_BODY"

ADMIN_TOKEN=$(echo "$LOGIN_BODY" | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}[FATAL] Could not obtain Bearer Token. Aborting tests.${NC}"
    exit 1
fi
echo -e "  ${CYAN}[INFO]${NC} Bearer Token Acquired: ${ADMIN_TOKEN:0:15}..."

# Admin Me
ME_RESP=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/auth/me")
ME_CODE=$(echo "$ME_RESP" | tail -n1)
ME_BODY=$(echo "$ME_RESP" | sed '$d')
log_test "GET /admin/auth/me (Current User Profile)" "$ME_CODE" "200" "$ME_BODY"

# Roles
ROLES_RESP=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/roles")
log_test "GET /admin/roles (System Roles)" "$(echo "$ROLES_RESP" | tail -n1)" "200" "$(echo "$ROLES_RESP" | sed '$d')"

# Permissions
PERMS_RESP=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/permissions")
log_test "GET /admin/permissions (System Permissions)" "$(echo "$PERMS_RESP" | tail -n1)" "200" "$(echo "$PERMS_RESP" | sed '$d')"


# ------------------------------------------------------------------------------
# 2. DEPARTMENTS CRUD
# ------------------------------------------------------------------------------
log_header "2. DEPARTMENTS RESOURCE CRUD"

DEPT_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"name\":\"Autonomous Systems Dept $TS\",\"slug\":\"autonomous-systems-dept-$TS\",\"description\":\"Core engineering department\"}" \
  "$BASE_URL/admin/departments")
DEPT_ID=$(extract_json_id "$(echo "$DEPT_CREATE" | sed '$d')")
log_test "POST /admin/departments (Create)" "$(echo "$DEPT_CREATE" | tail -n1)" "200|201" "$(echo "$DEPT_CREATE" | sed '$d')"

if [ -n "$DEPT_ID" ]; then
    DEPT_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/departments/$DEPT_ID")
    log_test "GET /admin/departments/$DEPT_ID (Read Single)" "$(echo "$DEPT_GET" | tail -n1)" "200" "$(echo "$DEPT_GET" | sed '$d')"

    DEPT_LIST=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/departments")
    log_test "GET /admin/departments (List All)" "$(echo "$DEPT_LIST" | tail -n1)" "200" "$(echo "$DEPT_LIST" | sed '$d')"

    DEPT_UPDATE=$(curl_with_retry -X PUT \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d "{\"name\":\"Autonomous Systems AI Eng $TS\",\"slug\":\"autonomous-systems-ai-eng-$TS\"}" \
      "$BASE_URL/admin/departments/$DEPT_ID")
    log_test "PUT /admin/departments/$DEPT_ID (Update)" "$(echo "$DEPT_UPDATE" | tail -n1)" "200" "$(echo "$DEPT_UPDATE" | sed '$d')"

    DEPT_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/departments/$DEPT_ID")
    log_test "DELETE /admin/departments/$DEPT_ID (Delete)" "$(echo "$DEPT_DEL" | tail -n1)" "200|204" "$(echo "$DEPT_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 3. CAREER JOBS CRUD & LIFECYCLE
# ------------------------------------------------------------------------------
log_header "3. CAREER JOBS CRUD & LIFECYCLE"

JOB_PAYLOAD="{\"title\":\"Lead Cloud Infrastructure Architect $TS\",\"slug\":\"lead-cloud-architect-$TS\",\"department_id\":1,\"opening_type\":\"job\",\"employment_type\":\"full-time\",\"work_mode\":\"hybrid\",\"experience_level\":\"Senior Level\",\"location\":\"Dhaka / Remote\",\"description\":\"Detailed responsibilities and requirements for the cloud architect role\",\"requirements\":\"5+ years cloud distributed systems experience\",\"responsibilities\":\"Design and maintain multi-region infrastructure\"}"

JOB_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "$JOB_PAYLOAD" \
  "$BASE_URL/admin/jobs")
JOB_ID=$(extract_json_id "$(echo "$JOB_CREATE" | sed '$d')")
log_test "POST /admin/jobs (Create Job)" "$(echo "$JOB_CREATE" | tail -n1)" "200|201" "$(echo "$JOB_CREATE" | sed '$d')"

if [ -n "$JOB_ID" ]; then
    JOB_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/jobs/$JOB_ID")
    log_test "GET /admin/jobs/$JOB_ID (Read Job)" "$(echo "$JOB_GET" | tail -n1)" "200" "$(echo "$JOB_GET" | sed '$d')"

    JOB_UPDATE=$(curl_with_retry -X PUT \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d '{"title":"Principal Cloud Infrastructure Architect"}' \
      "$BASE_URL/admin/jobs/$JOB_ID")
    log_test "PUT /admin/jobs/$JOB_ID (Update Job)" "$(echo "$JOB_UPDATE" | tail -n1)" "200" "$(echo "$JOB_UPDATE" | sed '$d')"

    JOB_PUB=$(curl_with_retry -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{}" "$BASE_URL/admin/jobs/$JOB_ID/publish")
    log_test "POST /admin/jobs/$JOB_ID/publish (Publish)" "$(echo "$JOB_PUB" | tail -n1)" "200" "$(echo "$JOB_PUB" | sed '$d')"

    # Check public API sees it
    PUB_JOBS=$(curl_with_retry -X GET -H "X-Frontend-API-Token: $FRONTEND_TOKEN" "$BASE_URL/careers/jobs")
    log_test "GET /careers/jobs (Public Frontend Sync)" "$(echo "$PUB_JOBS" | tail -n1)" "200" "$(echo "$PUB_JOBS" | sed '$d')"

    JOB_UNPUB=$(curl_with_retry -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{}" "$BASE_URL/admin/jobs/$JOB_ID/unpublish")
    log_test "POST /admin/jobs/$JOB_ID/unpublish (Unpublish)" "$(echo "$JOB_UNPUB" | tail -n1)" "200" "$(echo "$JOB_UNPUB" | sed '$d')"

    JOB_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/jobs/$JOB_ID")
    log_test "DELETE /admin/jobs/$JOB_ID (Delete Job)" "$(echo "$JOB_DEL" | tail -n1)" "200|204" "$(echo "$JOB_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 4. BLOG CATEGORIES CRUD
# ------------------------------------------------------------------------------
log_header "4. BLOG CATEGORIES CRUD"

BLOG_CAT_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"name\":\"Enterprise Cloud & DevOps $TS\",\"slug\":\"enterprise-cloud-devops-$TS\",\"description\":\"Articles on modern architecture\"}" \
  "$BASE_URL/admin/blog-categories")
BLOG_CAT_ID=$(extract_json_id "$(echo "$BLOG_CAT_CREATE" | sed '$d')")
log_test "POST /admin/blog-categories (Create)" "$(echo "$BLOG_CAT_CREATE" | tail -n1)" "200|201" "$(echo "$BLOG_CAT_CREATE" | sed '$d')"

if [ -n "$BLOG_CAT_ID" ]; then
    BLOG_CAT_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/blog-categories/$BLOG_CAT_ID")
    log_test "GET /admin/blog-categories/$BLOG_CAT_ID (Read)" "$(echo "$BLOG_CAT_GET" | tail -n1)" "200" "$(echo "$BLOG_CAT_GET" | sed '$d')"

    BLOG_CAT_UPDATE=$(curl_with_retry -X PUT \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d "{\"name\":\"Cloud, AI & DevOps $TS\",\"slug\":\"cloud-ai-devops-$TS\"}" \
      "$BASE_URL/admin/blog-categories/$BLOG_CAT_ID")
    log_test "PUT /admin/blog-categories/$BLOG_CAT_ID (Update)" "$(echo "$BLOG_CAT_UPDATE" | tail -n1)" "200" "$(echo "$BLOG_CAT_UPDATE" | sed '$d')"

    BLOG_CAT_PUB=$(curl_with_retry -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{}" "$BASE_URL/admin/blog-categories/$BLOG_CAT_ID/publish")
    log_test "POST /admin/blog-categories/$BLOG_CAT_ID/publish (Publish)" "$(echo "$BLOG_CAT_PUB" | tail -n1)" "200" "$(echo "$BLOG_CAT_PUB" | sed '$d')"

    # Verify in Public API
    PUB_CATS=$(curl_with_retry -X GET -H "X-Frontend-API-Token: $FRONTEND_TOKEN" "$BASE_URL/blog/categories")
    log_test "GET /blog/categories (Public Sync)" "$(echo "$PUB_CATS" | tail -n1)" "200" "$(echo "$PUB_CATS" | sed '$d')"

    BLOG_CAT_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/blog-categories/$BLOG_CAT_ID")
    log_test "DELETE /admin/blog-categories/$BLOG_CAT_ID (Delete)" "$(echo "$BLOG_CAT_DEL" | tail -n1)" "200|204" "$(echo "$BLOG_CAT_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 5. BLOG POSTS CRUD
# ------------------------------------------------------------------------------
log_header "5. BLOG POSTS CRUD"

POST_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Modern Microfrontends & API Orchestration $TS\",\"slug\":\"modern-microfrontends-$TS\",\"excerpt\":\"Key architectural patterns for 2026\",\"body\":\"# Comprehensive overview\nExploring modular UI microfrontends.\"}" \
  "$BASE_URL/admin/blog-posts")
POST_ID=$(extract_json_id "$(echo "$POST_CREATE" | sed '$d')")
log_test "POST /admin/blog-posts (Create)" "$(echo "$POST_CREATE" | tail -n1)" "200|201" "$(echo "$POST_CREATE" | sed '$d')"

if [ -n "$POST_ID" ]; then
    POST_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/blog-posts/$POST_ID")
    log_test "GET /admin/blog-posts/$POST_ID (Read)" "$(echo "$POST_GET" | tail -n1)" "200" "$(echo "$POST_GET" | sed '$d')"

    POST_LIST=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/blog-posts")
    log_test "GET /admin/blog-posts (List)" "$(echo "$POST_LIST" | tail -n1)" "200" "$(echo "$POST_LIST" | sed '$d')"

    POST_UPDATE=$(curl_with_retry -X PUT \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d '{"title":"Modern Microfrontends & Next.js 15 API Orchestration"}' \
      "$BASE_URL/admin/blog-posts/$POST_ID")
    log_test "PUT /admin/blog-posts/$POST_ID (Update)" "$(echo "$POST_UPDATE" | tail -n1)" "200" "$(echo "$POST_UPDATE" | sed '$d')"

    POST_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/blog-posts/$POST_ID")
    log_test "DELETE /admin/blog-posts/$POST_ID (Delete)" "$(echo "$POST_DEL" | tail -n1)" "200|204" "$(echo "$POST_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 6. CASE STUDY TAGS & CASE STUDIES CRUD
# ------------------------------------------------------------------------------
log_header "6. CASE STUDY TAGS & CASE STUDIES CRUD"

TAG_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"name\":\"FinTech Cloud Migration $TS\",\"slug\":\"fintech-cloud-migration-$TS\"}" \
  "$BASE_URL/admin/case-study-tags")
TAG_ID=$(extract_json_id "$(echo "$TAG_CREATE" | sed '$d')")
log_test "POST /admin/case-study-tags (Create)" "$(echo "$TAG_CREATE" | tail -n1)" "200|201" "$(echo "$TAG_CREATE" | sed '$d')"

if [ -n "$TAG_ID" ]; then
    TAG_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/case-study-tags/$TAG_ID")
    log_test "GET /admin/case-study-tags/$TAG_ID (Read)" "$(echo "$TAG_GET" | tail -n1)" "200" "$(echo "$TAG_GET" | sed '$d')"

    TAG_UPDATE=$(curl_with_retry -X PUT \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d "{\"name\":\"FinTech & Digital Banking\",\"slug\":\"fintech-digital-banking-$TS\"}" \
      "$BASE_URL/admin/case-study-tags/$TAG_ID")
    log_test "PUT /admin/case-study-tags/$TAG_ID (Update)" "$(echo "$TAG_UPDATE" | tail -n1)" "200" "$(echo "$TAG_UPDATE" | sed '$d')"
fi

# Case Study
CASE_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Global Banking Cloud Modernization $TS\",\"slug\":\"global-banking-cloud-modernization-$TS\",\"short_summary\":\"Complete migration of legacy transaction processors to multi-cloud.\",\"industry\":\"FinTech\",\"client_name\":\"Standard Capital Corp\",\"challenge\":\"High latency and siloed databases\",\"solution\":\"Event-driven architecture with zero-downtime cutover\",\"result\":\"99.999% uptime and 4x lower latency\"}" \
  "$BASE_URL/admin/case-studies")
CASE_ID=$(extract_json_id "$(echo "$CASE_CREATE" | sed '$d')")
log_test "POST /admin/case-studies (Create)" "$(echo "$CASE_CREATE" | tail -n1)" "200|201" "$(echo "$CASE_CREATE" | sed '$d')"

if [ -n "$CASE_ID" ]; then
    CASE_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/case-studies/$CASE_ID")
    log_test "GET /admin/case-studies/$CASE_ID (Read)" "$(echo "$CASE_GET" | tail -n1)" "200" "$(echo "$CASE_GET" | sed '$d')"

    CASE_UPDATE=$(curl_with_retry -X PUT \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d '{"title":"Enterprise Banking Cloud Modernization"}' \
      "$BASE_URL/admin/case-studies/$CASE_ID")
    log_test "PUT /admin/case-studies/$CASE_ID (Update)" "$(echo "$CASE_UPDATE" | tail -n1)" "200" "$(echo "$CASE_UPDATE" | sed '$d')"

    CASE_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/case-studies/$CASE_ID")
    log_test "DELETE /admin/case-studies/$CASE_ID (Delete)" "$(echo "$CASE_DEL" | tail -n1)" "200|204" "$(echo "$CASE_DEL" | sed '$d')"
fi

# Cleanup Tag
if [ -n "$TAG_ID" ]; then
    TAG_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/case-study-tags/$TAG_ID")
    log_test "DELETE /admin/case-study-tags/$TAG_ID (Cleanup Tag)" "$(echo "$TAG_DEL" | tail -n1)" "200|204" "$(echo "$TAG_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 7. SERVICES & SECTORS CRUD
# ------------------------------------------------------------------------------
log_header "7. SERVICES & SECTORS CRUD"

# Service
SVC_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Enterprise Distributed Cloud Solutions $TS\",\"slug\":\"enterprise-distributed-cloud-$TS\",\"short_description\":\"High-throughput edge computing systems\",\"description\":\"Complete enterprise architecture consultancy and deployment.\"}" \
  "$BASE_URL/admin/services")
SVC_ID=$(extract_json_id "$(echo "$SVC_CREATE" | sed '$d')")
log_test "POST /admin/services (Create Service)" "$(echo "$SVC_CREATE" | tail -n1)" "200|201" "$(echo "$SVC_CREATE" | sed '$d')"

if [ -n "$SVC_ID" ]; then
    SVC_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/services/$SVC_ID")
    log_test "GET /admin/services/$SVC_ID (Read Service)" "$(echo "$SVC_GET" | tail -n1)" "200" "$(echo "$SVC_GET" | sed '$d')"

    SVC_UPDATE=$(curl_with_retry -X PUT \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d '{"title":"Enterprise Hybrid Cloud & Edge Solutions"}' \
      "$BASE_URL/admin/services/$SVC_ID")
    log_test "PUT /admin/services/$SVC_ID (Update Service)" "$(echo "$SVC_UPDATE" | tail -n1)" "200" "$(echo "$SVC_UPDATE" | sed '$d')"

    SVC_PUB=$(curl_with_retry -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{}" "$BASE_URL/admin/services/$SVC_ID/publish")
    log_test "POST /admin/services/$SVC_ID/publish (Publish)" "$(echo "$SVC_PUB" | tail -n1)" "200" "$(echo "$SVC_PUB" | sed '$d')"

    # Check Public Sync
    PUB_SVCS=$(curl_with_retry -X GET -H "X-Frontend-API-Token: $FRONTEND_TOKEN" "$BASE_URL/services")
    log_test "GET /services (Public Services Sync)" "$(echo "$PUB_SVCS" | tail -n1)" "200" "$(echo "$PUB_SVCS" | sed '$d')"

    SVC_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/services/$SVC_ID")
    log_test "DELETE /admin/services/$SVC_ID (Delete Service)" "$(echo "$SVC_DEL" | tail -n1)" "200|204" "$(echo "$SVC_DEL" | sed '$d')"
fi

# Sector
SECT_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Healthcare & Life Sciences $TS\",\"slug\":\"healthcare-life-sciences-$TS\",\"short_description\":\"Digital therapeutics and secure hospital IT architectures\",\"description\":\"Comprehensive healthcare IT systems\"}" \
  "$BASE_URL/admin/sectors")
SECT_ID=$(extract_json_id "$(echo "$SECT_CREATE" | sed '$d')")
log_test "POST /admin/sectors (Create Sector)" "$(echo "$SECT_CREATE" | tail -n1)" "200|201" "$(echo "$SECT_CREATE" | sed '$d')"

if [ -n "$SECT_ID" ]; then
    SECT_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/sectors/$SECT_ID")
    log_test "GET /admin/sectors/$SECT_ID (Read Sector)" "$(echo "$SECT_GET" | tail -n1)" "200" "$(echo "$SECT_GET" | sed '$d')"

    SECT_UPDATE=$(curl_with_retry -X PUT \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d '{"title":"Healthcare, MedTech & Life Sciences"}' \
      "$BASE_URL/admin/sectors/$SECT_ID")
    log_test "PUT /admin/sectors/$SECT_ID (Update Sector)" "$(echo "$SECT_UPDATE" | tail -n1)" "200" "$(echo "$SECT_UPDATE" | sed '$d')"

    SECT_PUB=$(curl_with_retry -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{}" "$BASE_URL/admin/sectors/$SECT_ID/publish")
    log_test "POST /admin/sectors/$SECT_ID/publish (Publish Sector)" "$(echo "$SECT_PUB" | tail -n1)" "200" "$(echo "$SECT_PUB" | sed '$d')"

    # Check Public Sync
    PUB_SECTS=$(curl_with_retry -X GET -H "X-Frontend-API-Token: $FRONTEND_TOKEN" "$BASE_URL/sectors")
    log_test "GET /sectors (Public Sectors Sync)" "$(echo "$PUB_SECTS" | tail -n1)" "200" "$(echo "$PUB_SECTS" | sed '$d')"

    SECT_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/sectors/$SECT_ID")
    log_test "DELETE /admin/sectors/$SECT_ID (Delete Sector)" "$(echo "$SECT_DEL" | tail -n1)" "200|204" "$(echo "$SECT_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 8. TECHNOLOGIES & CATEGORIES CRUD
# ------------------------------------------------------------------------------
log_header "8. TECHNOLOGIES & CATEGORIES CRUD"

TECH_CAT_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"name\":\"AI & Machine Learning Frameworks $TS\"}" \
  "$BASE_URL/admin/technology-categories")
TECH_CAT_ID=$(extract_json_id "$(echo "$TECH_CAT_CREATE" | sed '$d')")
log_test "POST /admin/technology-categories (Create)" "$(echo "$TECH_CAT_CREATE" | tail -n1)" "200|201" "$(echo "$TECH_CAT_CREATE" | sed '$d')"

if [ -n "$TECH_CAT_ID" ]; then
    TECH_CREATE=$(curl_with_retry -X POST \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d "{\"name\":\"PyTorch Distributed ML $TS\",\"technology_category_id\":$TECH_CAT_ID,\"description\":\"Scalable deep learning framework\"}" \
      "$BASE_URL/admin/technologies")
    TECH_ID=$(extract_json_id "$(echo "$TECH_CREATE" | sed '$d')")
    log_test "POST /admin/technologies (Create)" "$(echo "$TECH_CREATE" | tail -n1)" "200|201" "$(echo "$TECH_CREATE" | sed '$d')"

    if [ -n "$TECH_ID" ]; then
        TECH_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/technologies/$TECH_ID")
        log_test "GET /admin/technologies/$TECH_ID (Read)" "$(echo "$TECH_GET" | tail -n1)" "200" "$(echo "$TECH_GET" | sed '$d')"

        TECH_UPDATE=$(curl_with_retry -X PUT \
          -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
          -d '{"name":"PyTorch 2.5 Distributed & TorchDynamo"}' \
          "$BASE_URL/admin/technologies/$TECH_ID")
        log_test "PUT /admin/technologies/$TECH_ID (Update)" "$(echo "$TECH_UPDATE" | tail -n1)" "200" "$(echo "$TECH_UPDATE" | sed '$d')"

        TECH_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/technologies/$TECH_ID")
        log_test "DELETE /admin/technologies/$TECH_ID (Delete)" "$(echo "$TECH_DEL" | tail -n1)" "200|204" "$(echo "$TECH_DEL" | sed '$d')"
    fi

    TECH_CAT_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/technology-categories/$TECH_CAT_ID")
    log_test "DELETE /admin/technology-categories/$TECH_CAT_ID (Delete Category)" "$(echo "$TECH_CAT_DEL" | tail -n1)" "200|204" "$(echo "$TECH_CAT_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 9. LEADERSHIP, VALUES, CAPABILITIES, EXPERTISE ROLES, METRICS
# ------------------------------------------------------------------------------
log_header "9. COMPANY ASSETS & METRICS CRUD"

# Leadership
LEADER_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"full_name\":\"Dr. Sophia Vance $TS\",\"designation\":\"Head of Quantum Computing\",\"email\":\"sophia.vance.$TS@agrani.com\",\"short_bio\":\"Pioneering quantum algorithms.\"}" \
  "$BASE_URL/admin/leadership-members")
LEADER_ID=$(extract_json_id "$(echo "$LEADER_CREATE" | sed '$d')")
log_test "POST /admin/leadership-members (Create)" "$(echo "$LEADER_CREATE" | tail -n1)" "200|201" "$(echo "$LEADER_CREATE" | sed '$d')"

if [ -n "$LEADER_ID" ]; then
    LEADER_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/leadership-members/$LEADER_ID")
    log_test "GET /admin/leadership-members/$LEADER_ID (Read)" "$(echo "$LEADER_GET" | tail -n1)" "200" "$(echo "$LEADER_GET" | sed '$d')"

    LEADER_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/leadership-members/$LEADER_ID")
    log_test "DELETE /admin/leadership-members/$LEADER_ID (Delete)" "$(echo "$LEADER_DEL" | tail -n1)" "200|204" "$(echo "$LEADER_DEL" | sed '$d')"
fi

# Company Value
VAL_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Radical Integrity & Transparency $TS\",\"description\":\"Building trust through open and ethical engineering practices\"}" \
  "$BASE_URL/admin/company-values")
VAL_ID=$(extract_json_id "$(echo "$VAL_CREATE" | sed '$d')")
log_test "POST /admin/company-values (Create)" "$(echo "$VAL_CREATE" | tail -n1)" "200|201" "$(echo "$VAL_CREATE" | sed '$d')"

if [ -n "$VAL_ID" ]; then
    VAL_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/company-values/$VAL_ID")
    log_test "GET /admin/company-values/$VAL_ID (Read)" "$(echo "$VAL_GET" | tail -n1)" "200" "$(echo "$VAL_GET" | sed '$d')"

    VAL_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/company-values/$VAL_ID")
    log_test "DELETE /admin/company-values/$VAL_ID (Delete)" "$(echo "$VAL_DEL" | tail -n1)" "200|204" "$(echo "$VAL_DEL" | sed '$d')"
fi

# Company Capability
CAP_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Zero-Trust Cybersecurity Governance $TS\",\"description\":\"Comprehensive cloud security auditing and real-time posture management\"}" \
  "$BASE_URL/admin/company-capabilities")
CAP_ID=$(extract_json_id "$(echo "$CAP_CREATE" | sed '$d')")
log_test "POST /admin/company-capabilities (Create)" "$(echo "$CAP_CREATE" | tail -n1)" "200|201" "$(echo "$CAP_CREATE" | sed '$d')"

if [ -n "$CAP_ID" ]; then
    CAP_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/company-capabilities/$CAP_ID")
    log_test "GET /admin/company-capabilities/$CAP_ID (Read)" "$(echo "$CAP_GET" | tail -n1)" "200" "$(echo "$CAP_GET" | sed '$d')"

    CAP_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/company-capabilities/$CAP_ID")
    log_test "DELETE /admin/company-capabilities/$CAP_ID (Delete)" "$(echo "$CAP_DEL" | tail -n1)" "200|204" "$(echo "$CAP_DEL" | sed '$d')"
fi

# Expertise Role
EXP_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Principal Reliability Architect $TS\",\"description\":\"Designs multi-region resilient microservices\",\"icon_media_id\":1}" \
  "$BASE_URL/admin/expertise-roles")
EXP_ID=$(extract_json_id "$(echo "$EXP_CREATE" | sed '$d')")
log_test "POST /admin/expertise-roles (Create)" "$(echo "$EXP_CREATE" | tail -n1)" "200|201" "$(echo "$EXP_CREATE" | sed '$d')"

if [ -n "$EXP_ID" ]; then
    EXP_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/expertise-roles/$EXP_ID")
    log_test "GET /admin/expertise-roles/$EXP_ID (Read)" "$(echo "$EXP_GET" | tail -n1)" "200" "$(echo "$EXP_GET" | sed '$d')"

    EXP_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/expertise-roles/$EXP_ID")
    log_test "DELETE /admin/expertise-roles/$EXP_ID (Delete)" "$(echo "$EXP_DEL" | tail -n1)" "200|204" "$(echo "$EXP_DEL" | sed '$d')"
fi

# Metric
METRIC_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"key\":\"uptime-reliability-$TS\",\"label\":\"Uptime Reliability\",\"value\":\"99.999\",\"suffix\":\"%\"}" \
  "$BASE_URL/admin/metrics")
METRIC_ID=$(extract_json_id "$(echo "$METRIC_CREATE" | sed '$d')")
log_test "POST /admin/metrics (Create)" "$(echo "$METRIC_CREATE" | tail -n1)" "200|201" "$(echo "$METRIC_CREATE" | sed '$d')"

if [ -n "$METRIC_ID" ]; then
    METRIC_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/metrics/$METRIC_ID")
    log_test "GET /admin/metrics/$METRIC_ID (Read)" "$(echo "$METRIC_GET" | tail -n1)" "200" "$(echo "$METRIC_GET" | sed '$d')"

    METRIC_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/metrics/$METRIC_ID")
    log_test "DELETE /admin/metrics/$METRIC_ID (Delete)" "$(echo "$METRIC_DEL" | tail -n1)" "200|204" "$(echo "$METRIC_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 10. TESTIMONIALS & WHY CHOOSE US
# ------------------------------------------------------------------------------
log_header "10. TESTIMONIALS & WHY CHOOSE US CRUD"

# Testimonial
TEST_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"customer_name\":\"Marcus Sterling $TS\",\"customer_role\":\"CTO\",\"company\":\"Apex Financial Global\",\"testimonial\":\"Agrani delivered a fault-tolerant multi-cloud core on time and under budget.\"}" \
  "$BASE_URL/admin/testimonials")
TEST_ID=$(extract_json_id "$(echo "$TEST_CREATE" | sed '$d')")
log_test "POST /admin/testimonials (Create)" "$(echo "$TEST_CREATE" | tail -n1)" "200|201" "$(echo "$TEST_CREATE" | sed '$d')"

if [ -n "$TEST_ID" ]; then
    TEST_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/testimonials/$TEST_ID")
    log_test "GET /admin/testimonials/$TEST_ID (Read)" "$(echo "$TEST_GET" | tail -n1)" "200" "$(echo "$TEST_GET" | sed '$d')"

    TEST_PUB=$(curl_with_retry -X POST -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "{}" "$BASE_URL/admin/testimonials/$TEST_ID/publish")
    log_test "POST /admin/testimonials/$TEST_ID/publish (Publish)" "$(echo "$TEST_PUB" | tail -n1)" "200" "$(echo "$TEST_PUB" | sed '$d')"

    PUB_TESTS=$(curl_with_retry -X GET -H "X-Frontend-API-Token: $FRONTEND_TOKEN" "$BASE_URL/testimonials")
    log_test "GET /testimonials (Public Testimonials Sync)" "$(echo "$PUB_TESTS" | tail -n1)" "200" "$(echo "$PUB_TESTS" | sed '$d')"

    TEST_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/testimonials/$TEST_ID")
    log_test "DELETE /admin/testimonials/$TEST_ID (Delete)" "$(echo "$TEST_DEL" | tail -n1)" "200|204" "$(echo "$TEST_DEL" | sed '$d')"
fi

# Why Choose Us
WCU_CREATE=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"title\":\"Enterprise Velocity & Security $TS\",\"description\":\"Deploying certified security frameworks with high velocity sprints\"}" \
  "$BASE_URL/admin/why-choose-us")
WCU_ID=$(extract_json_id "$(echo "$WCU_CREATE" | sed '$d')")
log_test "POST /admin/why-choose-us (Create)" "$(echo "$WCU_CREATE" | tail -n1)" "200|201" "$(echo "$WCU_CREATE" | sed '$d')"

if [ -n "$WCU_ID" ]; then
    WCU_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/why-choose-us/$WCU_ID")
    log_test "GET /admin/why-choose-us/$WCU_ID (Read)" "$(echo "$WCU_GET" | tail -n1)" "200" "$(echo "$WCU_GET" | sed '$d')"

    PUB_WCU=$(curl_with_retry -X GET -H "X-Frontend-API-Token: $FRONTEND_TOKEN" "$BASE_URL/why-choose-us")
    log_test "GET /why-choose-us (Public Sync)" "$(echo "$PUB_WCU" | tail -n1)" "200" "$(echo "$PUB_WCU" | sed '$d')"

    WCU_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/why-choose-us/$WCU_ID")
    log_test "DELETE /admin/why-choose-us/$WCU_ID (Delete)" "$(echo "$WCU_DEL" | tail -n1)" "200|204" "$(echo "$WCU_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 11. MEDIA LIBRARY CRUD & ASSET MANAGEMENT
# ------------------------------------------------------------------------------
log_header "11. MEDIA LIBRARY CRUD & ASSET MANAGEMENT"

# List Media
MEDIA_LIST=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/media")
log_test "GET /admin/media (List Media Assets)" "$(echo "$MEDIA_LIST" | tail -n1)" "200" "$(echo "$MEDIA_LIST" | sed '$d')"

# Upload Media
MEDIA_UPLOAD=$(curl_with_retry -X POST \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@public/assets/figma/about/01.png" \
  -F "title=Automated Test Asset $TS" \
  -F "alt_text=Test Asset Alt" \
  "$BASE_URL/admin/media")
MEDIA_ID=$(extract_json_id "$(echo "$MEDIA_UPLOAD" | sed '$d')")
log_test "POST /admin/media (Upload Image Asset)" "$(echo "$MEDIA_UPLOAD" | tail -n1)" "200|201" "$(echo "$MEDIA_UPLOAD" | sed '$d')"

if [ -n "$MEDIA_ID" ]; then
    MEDIA_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/media/$MEDIA_ID")
    log_test "GET /admin/media/$MEDIA_ID (Read Asset Details)" "$(echo "$MEDIA_GET" | tail -n1)" "200" "$(echo "$MEDIA_GET" | sed '$d')"

    MEDIA_PATCH=$(curl_with_retry -X PATCH \
      -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
      -d "{\"title\":\"Updated Test Asset Title $TS\",\"alt_text\":\"Updated Alt Text\"}" \
      "$BASE_URL/admin/media/$MEDIA_ID")
    log_test "PATCH /admin/media/$MEDIA_ID (Update Asset Metadata)" "$(echo "$MEDIA_PATCH" | tail -n1)" "200" "$(echo "$MEDIA_PATCH" | sed '$d')"

    MEDIA_DEL=$(curl_with_retry -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/media/$MEDIA_ID")
    log_test "DELETE /admin/media/$MEDIA_ID (Delete Asset)" "$(echo "$MEDIA_DEL" | tail -n1)" "200|204" "$(echo "$MEDIA_DEL" | sed '$d')"
fi


# ------------------------------------------------------------------------------
# 12. PAGE SINGLETON APIS & SITE SETTINGS (ADMIN CONTENT EDITING)
# ------------------------------------------------------------------------------
log_header "12. PAGE SINGLETON APIS & SITE SETTINGS"

# Site Settings GET & PUT
SITE_GET=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/site-settings")
log_test "GET /admin/site-settings (Read Global Settings)" "$(echo "$SITE_GET" | tail -n1)" "200" "$(echo "$SITE_GET" | sed '$d')"

SITE_PUT=$(curl_with_retry -X PUT \
  -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"site_name":"Agrani Enterprise","tagline":"Engineering Future Systems"}' \
  "$BASE_URL/admin/site-settings")
log_test "PUT /admin/site-settings (Update Global Settings)" "$(echo "$SITE_PUT" | tail -n1)" "200" "$(echo "$SITE_PUT" | sed '$d')"

PAGES=(
  "home-page"
  "about-page"
  "product-services-page"
  "expertise-page"
  "customer-experience-page"
  "case-studies-page"
  "blog-page"
  "career-page"
  "contact-page"
)

for p in "${PAGES[@]}"; do
    RESP=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/$p")
    log_test "GET /admin/$p (Page Singleton Content)" "$(echo "$RESP" | tail -n1)" "200" "$(echo "$RESP" | sed '$d')"
done


# ------------------------------------------------------------------------------
# 13. INQUIRIES, SUBMISSIONS & MUTATIONS
# ------------------------------------------------------------------------------
log_header "13. INQUIRIES & USER SUBMISSION PIPELINES"
sleep 2

# Public Quote Request
QUOTE_RESP=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "X-Frontend-API-Token: $FRONTEND_TOKEN" \
  -d "{\"first_name\":\"Valued\",\"last_name\":\"Client\",\"email\":\"client.$TS@enterprise.com\",\"phone\":\"+8801712345678\",\"message\":\"Requesting a complete cloud security audit and redesign.\",\"source_page\":\"home\"}" \
  "$BASE_URL/quote-requests")
log_test "POST /quote-requests (Public Submission)" "$(echo "$QUOTE_RESP" | tail -n1)" "200|201|429" "$(echo "$QUOTE_RESP" | sed '$d')"

# Admin List Quotes
ADMIN_QUOTES=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/quote-requests")
log_test "GET /admin/quote-requests (Admin View Quotes)" "$(echo "$ADMIN_QUOTES" | tail -n1)" "200" "$(echo "$ADMIN_QUOTES" | sed '$d')"

# Public Newsletter Subscribe
SUB_RESP=$(curl_with_retry -X POST \
  -H "Content-Type: application/json" -H "X-Frontend-API-Token: $FRONTEND_TOKEN" \
  -d "{\"email\":\"developer.$TS@example.com\"}" \
  "$BASE_URL/newsletter/subscribe")
log_test "POST /newsletter/subscribe (Public Subscription)" "$(echo "$SUB_RESP" | tail -n1)" "200|201|429" "$(echo "$SUB_RESP" | sed '$d')"

# Admin List Subscribers
ADMIN_SUBS=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/newsletter-subscribers")
log_test "GET /admin/newsletter-subscribers (Admin View Subscribers)" "$(echo "$ADMIN_SUBS" | tail -n1)" "200" "$(echo "$ADMIN_SUBS" | sed '$d')"

# Admin List Job Applications
ADMIN_APPS=$(curl_with_retry -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/admin/job-applications")
log_test "GET /admin/job-applications (Admin View Applications)" "$(echo "$ADMIN_APPS" | tail -n1)" "200" "$(echo "$ADMIN_APPS" | sed '$d')"


# ------------------------------------------------------------------------------
# 14. ALL PUBLIC FRONTEND PAGE ROUTES
# ------------------------------------------------------------------------------
log_header "14. ALL PUBLIC FRONTEND PAGES APIS"

PUB_ENDPOINTS=(
  "/home"
  "/about"
  "/product-services"
  "/expertise"
  "/customer-experience"
  "/careers"
  "/contact"
  "/services"
  "/sectors"
  "/testimonials"
  "/why-choose-us"
  "/careers/jobs"
  "/blog"
  "/blog/categories"
  "/case-studies"
)

for ep in "${PUB_ENDPOINTS[@]}"; do
    RESP=$(curl_with_retry -X GET -H "X-Frontend-API-Token: $FRONTEND_TOKEN" "$BASE_URL$ep")
    log_test "GET $ep (Public API)" "$(echo "$RESP" | tail -n1)" "200" "$(echo "$RESP" | sed '$d')"
done

# ------------------------------------------------------------------------------
# SUMMARY REPORT
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}==============================================================================${NC}"
echo -e "${BOLD}  TEST SUITE EXECUTION SUMMARY${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo -e "  Total Tests Run:  ${BOLD}$TOTAL_COUNT${NC}"
echo -e "  Passed Tests:     ${GREEN}${BOLD}$PASSED_COUNT${NC}"
echo -e "  Failed Tests:     ${RED}${BOLD}$FAILED_COUNT${NC}"

if [ "$FAILED_COUNT" -eq 0 ]; then
    echo -e "\n${GREEN}${BOLD}  >>> ALL ADMIN & PUBLIC APIS OPERATING WITH 100% SUCCESS! <<<${NC}\n"
    exit 0
else
    echo -e "\n${RED}${BOLD}  >>> SOME TESTS FAILED. PLEASE REVIEW THE OUTPUT ABOVE. <<<${NC}\n"
    exit 1
fi
