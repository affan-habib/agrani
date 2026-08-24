# Agrani REST API Specification & Master Reference

**Base URL**: `http://192.168.30.27:8000/api/v1`  
**API Version**: `1.0.0`  
**OpenAPI Spec**: `3.1.0`  
**Backend Framework**: Laravel 13 (RESTful Architecture)  
**Total Endpoints / Operations**: 200 operations across 107 paths (26 Public operations, 174 Admin operations)  

---

## 1. Authentication & Request Headers

### 1.1 Public / Frontend Authentication
- **Header**: `X-Frontend-API-Token`
- **Value**: Frontend client token string
- **Usage**: Sent with public requests for bot protection and access validation.
```http
X-Frontend-API-Token: <your_frontend_api_token>
Accept: application/json
Content-Type: application/json
```

### 1.2 Admin Authentication
- **Mechanism**: Laravel Sanctum Bearer Token
- **Header**: `Authorization: Bearer <access_token>`
- **Login Endpoint**: `POST /api/v1/admin/auth/login`
- **Response**: Returns `token` and `user` profile.
- **Header format**:
```http
Authorization: Bearer <sanctum_access_token>
Accept: application/json
Content-Type: application/json
```

---

## 2. Standard Envelopes & Response Format

### 2.1 Standard Success Envelope
All successful 200/201 responses wrap primary payloads in a `data` key. Paginated list endpoints also include `meta` and `links`.

```json
{
  "data": {
    "id": 1,
    "title": "Example Resource"
  },
  "links": {
    "first": "http://192.168.30.27:8000/api/v1/admin/blog-posts?page=1",
    "last": "http://192.168.30.27:8000/api/v1/admin/blog-posts?page=5",
    "prev": null,
    "next": "http://192.168.30.27:8000/api/v1/admin/blog-posts?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 5,
    "links": [
      { "url": null, "label": "&laquo; Previous", "active": false },
      { "url": "http://192.168.30.27:8000/api/v1/admin/blog-posts?page=1", "label": "1", "active": true },
      { "url": "http://192.168.30.27:8000/api/v1/admin/blog-posts?page=2", "label": "2", "active": false }
    ],
    "path": "http://192.168.30.27:8000/api/v1/admin/blog-posts",
    "per_page": 15,
    "to": 15,
    "total": 68
  }
}
```

### 2.2 Standard Error Envelope
All error responses (4xx, 5xx) follow a consistent structure containing a stable error `code`, user-facing `message`, optional validation `fields`, and a unique `request_id`.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "fields": {
      "email": [
        "The email field is required."
      ],
      "password": [
        "The password must be at least 8 characters."
      ]
    }
  },
  "request_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```

### 2.3 HTTP Status Codes
| Code | Meaning | Typical Usage |
|---|---|---|
| `200 OK` | Request successful | GET requests, updates returning resource |
| `201 Created` | Resource created | Successful POST creation |
| `204 No Content` | Successful deletion | Successful DELETE operations |
| `401 Unauthorized` | `AuthenticationException` | Missing/invalid Bearer token |
| `403 Forbidden` | `AuthorizationException` | Insufficient permissions / role |
| `404 Not Found` | `NotFoundHttpException` | Resource slug or ID not found |
| `409 Conflict` | `ConflictException` | State conflict (e.g. deleting category with posts) |
| `413 Payload Too Large` | `PostTooLargeException` | Uploaded file / media exceeds max size |
| `422 Unprocessable Entity` | `ValidationException` | Field validation errors |
| `429 Too Many Requests` | `TooManyRequestsHttpException` | Rate limit exceeded (login, apply, forms) |

---

## 3. Public API Endpoints Directory (Frontend)

### 3.1 System & Global Settings

#### `GET` `/health`
- **Operation ID**: `v1.health`
- **Tag**: `Health`
- **Summary**: Check API availability
- **Responses**:
  - `200`: `HealthResource` → object

#### `GET` `/site-settings`
- **Operation ID**: `v1.site-settings.show`
- **Tag**: `SiteSettings`
- **Summary**: Handle the incoming request
- **Responses**:
  - `200`: `PublicSiteSettingsResource` → object

### 3.2 Home Page & Global Sections

#### `GET` `/home`
- **Operation ID**: `v1.home.show`
- **Tag**: `Home`
- **Responses**:
  - `200`: Response → object

#### `GET` `/why-choose-us`
- **Operation ID**: `v1.why-choose-us.index`
- **Tag**: `WhyChooseUsItem`
- **Query / Path Parameters**:
  - `featured` (query, boolean | null, _Optional_)
- **Responses**:
  - `200`: Array of `WhyChooseUsItemResource` → object
  - `422`: Response

#### `GET` `/sectors`
- **Operation ID**: `v1.sectors.index`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `featured` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Array of `SectorSummaryResource` → object
  - `422`: Response

#### `GET` `/sectors/{slug}`
- **Operation ID**: `v1.sectors.show`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `slug` (path, string, **Required**)
- **Responses**:
  - `200`: `SectorResource` → object
  - `404`: Response

#### `GET` `/testimonials`
- **Operation ID**: `v1.testimonials.index`
- **Tag**: `Testimonial`
- **Query / Path Parameters**:
  - `featured` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Array of `TestimonialResource` → object
  - `422`: Response

### 3.3 About Us Page

#### `GET` `/about`
- **Operation ID**: `v1.about.show`
- **Tag**: `About`
- **Responses**:
  - `200`: Response → object

### 3.4 Services & Products

#### `GET` `/services`
- **Operation ID**: `v1.services.index`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `featured` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Array of `ServiceSummaryResource` → object
  - `422`: Response

#### `GET` `/services/{slug}`
- **Operation ID**: `v1.services.show`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `slug` (path, string, **Required**)
- **Responses**:
  - `200`: `ServiceResource` → object
  - `404`: Response

#### `GET` `/product-services`
- **Operation ID**: `v1.product-services.show`
- **Tag**: `ProductServices`
- **Responses**:
  - `200`: Response → object

### 3.5 Expertise & Customer Experience

#### `GET` `/expertise`
- **Operation ID**: `v1.expertise.show`
- **Tag**: `Expertise`
- **Responses**:
  - `200`: Response → object

#### `GET` `/customer-experience`
- **Operation ID**: `v1.customer-experience.show`
- **Tag**: `CustomerExperience`
- **Responses**:
  - `200`: Response → object

### 3.6 Case Studies

#### `GET` `/case-study-tags`
- **Operation ID**: `v1.case-study-tags.index`
- **Tag**: `CaseStudy`
- **Responses**:
  - `200`: Array of `CaseStudyTagResource` → object

#### `GET` `/case-studies`
- **Operation ID**: `v1.case-studies.index`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `tag` (query, string | null, _Optional_)
  - `service` (query, string | null, _Optional_)
  - `industry` (query, string | null, _Optional_)
  - `search` (query, string | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Array of `CaseStudySummaryResource` → object
  - `422`: Response

#### `GET` `/case-studies/{slug}`
- **Operation ID**: `v1.case-studies.show`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `slug` (path, string, **Required**)
- **Responses**:
  - `200`: `CaseStudyResource` → object
  - `404`: Response

### 3.7 Blog & Articles

#### `GET` `/blog/categories`
- **Operation ID**: `v1.blog.categories`
- **Tag**: `Blog`
- **Responses**:
  - `200`: Array of `BlogCategoryResource` → object

#### `GET` `/blog`
- **Operation ID**: `v1.blog.index`
- **Tag**: `Blog`
- **Query / Path Parameters**:
  - `category` (query, string | null, _Optional_)
  - `search` (query, string | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Array of `BlogPostSummaryResource` → object
  - `422`: Response

#### `GET` `/blog/{slug}`
- **Operation ID**: `v1.blog.show`
- **Tag**: `Blog`
- **Query / Path Parameters**:
  - `slug` (path, string, **Required**)
- **Responses**:
  - `200`: `BlogPostResource` → object
  - `404`: Response

### 3.8 Careers, Jobs & Applications

#### `GET` `/careers`
- **Operation ID**: `v1.careers.show`
- **Tag**: `Career`
- **Responses**:
  - `200`: Response → object

#### `GET` `/careers/jobs`
- **Operation ID**: `v1.careers.jobs.index`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `department` (query, string | null, _Optional_)
  - `opening_type` (query, `OpeningType` | null, _Optional_)
  - `employment_type` (query, string | null, _Optional_)
  - `work_mode` (query, `WorkMode` | null, _Optional_)
  - `location` (query, string | null, _Optional_)
  - `search` (query, string | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Array of `CareerJobSummaryResource` → object
  - `422`: Response

#### `GET` `/careers/jobs/{slug}`
- **Operation ID**: `v1.careers.jobs.show`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `slug` (path, string, **Required**)
- **Responses**:
  - `200`: `CareerJobResource` → object
  - `404`: Response

#### `POST` `/careers/jobs/{job}/apply`
- **Operation ID**: `v1.careers.jobs.apply`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `job` (path, string, **Required**)
- **Request Body**:
  - *Media Type*: `multipart/form-data`
  - *Schema*: `StoreJobApplicationRequest`
  - *Fields*:
    - `applicant_name`: string (**Required**) — *max: 200*
    - `email`: string (email) (**Required**) — *max: 320, format: email*
    - `phone`: string (**Required**) — *max: 50, pattern: `^[0-9+()\-\.\s]{7,50}$`*
    - `resume`: string (binary) (**Required**) — *format: binary, Maximum file size: 5120 kilobytes.*
    - `cover_letter`: string | null (_Optional_) — *max: 10000*
    - `job_id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `201`: Response → object
  - `404`: Response
  - `413`: Response
  - `422`: Response
  - `429`: Response

### 3.9 Contact, Quote Requests & Newsletter

#### `GET` `/contact`
- **Operation ID**: `v1.contact.show`
- **Tag**: `Contact`
- **Responses**:
  - `200`: Response → object

#### `POST` `/quote-requests`
- **Operation ID**: `v1.quote-requests.store`
- **Tag**: `QuoteRequest`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreQuoteRequest`
  - *Fields*:
    - `first_name`: string (**Required**) — *max: 100*
    - `last_name`: string (**Required**) — *max: 100*
    - `phone`: string (**Required**) — *max: 50, pattern: `^[0-9+()\-.\s]{7,50}$`*
    - `country_code`: string | null (_Optional_) — *max: 10, pattern: `^\+[0-9]{1,4}$`*
    - `email`: string | null (_Optional_) — *max: 320, format: email*
    - `city`: string | null (_Optional_) — *max: 150*
    - `message`: string (**Required**) — *max: 5000*
    - `source_page`: string (**Required**) — *max: 100, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `website`: string | null (_Optional_) — *max: 255*
    - `status`: string (_Optional_)
    - `admin_notes`: string (_Optional_)
    - `assigned_to`: string (_Optional_)
- **Responses**:
  - `201`: Response → object
  - `422`: Response
  - `429`: Response

#### `POST` `/newsletter/subscribe`
- **Operation ID**: `v1.newsletter.subscribe`
- **Tag**: `Newsletter`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `SubscribeNewsletterRequest`
  - *Fields*:
    - `email`: string (email) (**Required**) — *max: 320, format: email*
    - `source_page`: string | null (_Optional_) — *max: 100, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `website`: string | null (_Optional_) — *max: 255*
    - `status`: string (_Optional_)
    - `subscribed_at`: string (_Optional_)
    - `unsubscribed_at`: string (_Optional_)
- **Responses**:
  - `200`: Response → object
  - `422`: Response
  - `429`: Response

---

## 4. Admin API Endpoints Directory (Backend Control Panel)

### 4.1 Authentication

#### `POST` `/admin/auth/login`
- **Operation ID**: `v1.admin.auth.login`
- **Tag**: `Auth`
- **Summary**: Authenticate an active administrator and issue a bearer token
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `LoginRequest`
  - *Fields*:
    - `email`: string (email) (**Required**) — *max: 254, format: email*
    - `password`: string (**Required**) — *max: 255*
    - `device_name`: string (_Optional_) — *max: 100*
- **Responses**:
  - `200`: `AdminLoginResource` → object
  - `401`: Response → `AuthenticationException`
  - `422`: Response → `ValidationException`
  - `429`: Response → `TooManyRequestsHttpException`

#### `GET` `/admin/auth/me`
- **Operation ID**: `v1.admin.auth.me`
- **Tag**: `Auth`
- **Summary**: Return the authenticated administrator
- **Responses**:
  - `200`: `AdminUserResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `POST` `/admin/auth/logout`
- **Operation ID**: `v1.admin.auth.logout`
- **Tag**: `Auth`
- **Summary**: Revoke only the bearer token used for this request
- **Responses**:
  - `200`: Response → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

### 4.2 Roles & Permissions

#### `GET` `/admin/roles`
- **Operation ID**: `v1.admin.roles.index`
- **Tag**: `Role`
- **Summary**: List assignable administrative roles
- **Responses**:
  - `200`: Array of `RoleResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `GET` `/admin/permissions`
- **Operation ID**: `v1.admin.permissions.index`
- **Tag**: `Permission`
- **Summary**: List the deployment-owned permission vocabulary
- **Responses**:
  - `200`: Array of `PermissionResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/roles/{role}/permissions`
- **Operation ID**: `v1.admin.roles.permissions.update`
- **Tag**: `RolePermission`
- **Summary**: Handle the incoming request
- **Query / Path Parameters**:
  - `role` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `SyncRolePermissionsRequest`
  - *Fields*:
    - `permissions`: Array<integer> (**Required**)
- **Responses**:
  - `200`: `RoleResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `ModelNotFoundException`
  - `422`: Response → `ValidationException`

#### `PUT` `/admin/users/{user}/roles`
- **Operation ID**: `v1.admin.users.roles.update`
- **Tag**: `UserRole`
- **Summary**: Handle the incoming request
- **Query / Path Parameters**:
  - `user` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `SyncUserRolesRequest`
  - *Fields*:
    - `roles`: Array<integer> (**Required**)
- **Responses**:
  - `200`: `AdminUserResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `ModelNotFoundException`
  - `422`: Response → `ValidationException`

### 4.3 Media Management

#### `GET` `/admin/media`
- **Operation ID**: `v1.admin.media.index`
- **Tag**: `Media`
- **Summary**: Display a listing of the resource
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `mime_type` (query, string | null, _Optional_)
  - `uploaded_by` (query, integer | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `MediaResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/media`
- **Operation ID**: `v1.admin.media.store`
- **Tag**: `Media`
- **Summary**: Store a newly created resource in storage
- **Request Body**:
  - *Media Type*: `multipart/form-data`
  - *Schema*: `StoreMediaRequest`
  - *Fields*:
    - `file`: string (binary) (**Required**) — *format: binary, Maximum file size: 10240 kilobytes.*
    - `alt_text`: string | null (_Optional_) — *max: 500*
    - `title`: string | null (_Optional_) — *max: 500*
    - `caption`: string | null (_Optional_) — *max: 5000*
- **Responses**:
  - `201`: `MediaResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `413`: Response → `PostTooLargeException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/media/{media}`
- **Operation ID**: `v1.admin.media.show`
- **Tag**: `Media`
- **Summary**: Display the specified resource
- **Query / Path Parameters**:
  - `media` (path, integer, **Required**)
- **Responses**:
  - `200`: `MediaResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PATCH` `/admin/media/{media}`
- **Operation ID**: `v1.admin.media.update`
- **Tag**: `Media`
- **Summary**: Update the specified resource in storage
- **Query / Path Parameters**:
  - `media` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateMediaRequest`
  - *Fields*:
    - `alt_text`: string | null (_Optional_) — *max: 500*
    - `title`: string | null (_Optional_) — *max: 500*
    - `caption`: string | null (_Optional_) — *max: 5000*
    - `file`: string (_Optional_)
    - `disk`: string (_Optional_)
    - `path`: string (_Optional_)
    - `filename`: string (_Optional_)
    - `original_name`: string (_Optional_)
    - `extension`: string (_Optional_)
    - `mime_type`: string (_Optional_)
    - `size_bytes`: string (_Optional_)
    - `width`: string (_Optional_)
    - `height`: string (_Optional_)
    - `checksum_sha256`: string (_Optional_)
    - `uploaded_by`: string (_Optional_)
- **Responses**:
  - `200`: `MediaResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/media/{media}`
- **Operation ID**: `v1.admin.media.destroy`
- **Tag**: `Media`
- **Summary**: Remove the specified resource from storage
- **Query / Path Parameters**:
  - `media` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `409`: Response → `ConflictException`

### 4.4 Global Site Settings

#### `GET` `/admin/site-settings`
- **Operation ID**: `v1.admin.site-settings.show`
- **Tag**: `SiteSettings`
- **Summary**: Display the global site settings singleton
- **Responses**:
  - `200`: `AdminSiteSettingsResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/site-settings`
- **Operation ID**: `v1.admin.site-settings.update`
- **Tag**: `SiteSettings`
- **Summary**: Update the global site settings singleton
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateSiteSettingsRequest`
  - *Fields*:
    - `company_name`: string (_Optional_) — *max: 150*
    - `legal_name`: string | null (_Optional_) — *max: 150*
    - `tagline`: string | null (_Optional_) — *max: 255*
    - `short_description`: string | null (_Optional_) — *max: 500*
    - `company_description`: string | null (_Optional_) — *max: 10000*
    - `website_url`: string | null (_Optional_) — *max: 2048, format: uri*
    - `primary_email`: string | null (_Optional_) — *max: 254, format: email*
    - `secondary_email`: string | null (_Optional_) — *max: 254, format: email*
    - `primary_phone`: string | null (_Optional_) — *max: 50*
    - `secondary_phone`: string | null (_Optional_) — *max: 50*
    - `whatsapp_phone`: string | null (_Optional_) — *max: 50*
    - `address_line_1`: string | null (_Optional_) — *max: 255*
    - `address_line_2`: string | null (_Optional_) — *max: 255*
    - `city`: string | null (_Optional_) — *max: 120*
    - `state_or_region`: string | null (_Optional_) — *max: 120*
    - `postal_code`: string | null (_Optional_) — *max: 32*
    - `country`: string | null (_Optional_) — *max: 100*
    - `business_hours_text`: string | null (_Optional_) — *max: 2000*
    - `latitude`: number | null (_Optional_) — *minVal: -90, maxVal: 90*
    - `longitude`: number | null (_Optional_) — *minVal: -180, maxVal: 180*
    - `map_embed_url`: string | null (_Optional_) — *max: 2048, format: uri*
    - `footer_description`: string | null (_Optional_) — *max: 5000*
    - `newsletter_title`: string | null (_Optional_) — *max: 255*
    - `newsletter_description`: string | null (_Optional_) — *max: 500*
    - `copyright_text`: string | null (_Optional_) — *max: 500*
    - `default_seo_title`: string | null (_Optional_) — *max: 255*
    - `default_seo_description`: string | null (_Optional_) — *max: 500*
    - `default_canonical_base_url`: string | null (_Optional_) — *max: 2048, format: uri*
    - `logo_media_id`: integer | null (_Optional_)
    - `favicon_media_id`: integer | null (_Optional_)
    - `footer_media_id`: integer | null (_Optional_)
    - `default_og_image_media_id`: integer | null (_Optional_)
    - `social_links`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `channel`: enum ("facebook", "linkedin", "twitter", "instagram", "youtube") (**Required**) — *values: ["facebook", "linkedin", "twitter", "instagram", "youtube"]*
        - `label`: string (**Required**) — *max: 100*
        - `url`: string (uri) (**Required**) — *max: 2048, format: uri*
        - `icon_key`: string | null (_Optional_) — *max: 100*
        - `is_active`: boolean (_Optional_)
        - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 10000*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
    - `logo_path`: string (_Optional_)
    - `favicon_path`: string (_Optional_)
    - `footer_media_path`: string (_Optional_)
    - `default_og_image_path`: string (_Optional_)
    - `path`: string (_Optional_)
    - `disk`: string (_Optional_)
- **Responses**:
  - `200`: `AdminSiteSettingsResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

### 4.5 Page Content (Singletons)

#### `GET` `/admin/home-page`
- **Operation ID**: `v1.admin.home-page.show`
- **Tag**: `HomePage`
- **Responses**:
  - `200`: `HomePageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/home-page`
- **Operation ID**: `v1.admin.home-page.update`
- **Tag**: `HomePage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateHomePageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 255*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `hero_media_id`: integer | null (_Optional_)
    - `review_rating`: number | null (_Optional_)
    - `review_count`: integer | null (_Optional_) — *minVal: 0*
    - `review_label`: string | null (_Optional_) — *max: 150*
    - `primary_cta_text`: string | null (_Optional_) — *max: 150*
    - `primary_cta_url`: string | null (_Optional_) — *max: 2048*
    - `secondary_cta_text`: string | null (_Optional_) — *max: 150*
    - `secondary_cta_url`: string | null (_Optional_) — *max: 2048*
    - `services_eyebrow`: string | null (_Optional_) — *max: 255*
    - `services_title`: string | null (_Optional_) — *max: 255*
    - `sectors_eyebrow`: string | null (_Optional_) — *max: 255*
    - `sectors_title`: string | null (_Optional_) — *max: 500*
    - `why_choose_us_eyebrow`: string | null (_Optional_) — *max: 255*
    - `why_choose_us_title`: string | null (_Optional_) — *max: 500*
    - `why_choose_us_cta_text`: string | null (_Optional_) — *max: 150*
    - `why_choose_us_cta_url`: string | null (_Optional_) — *max: 2048*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `hero_steps`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `label`: string (**Required**) — *max: 100*
        - `sort_order`: integer (**Required**) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `HomePageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/home-page`
- **Operation ID**: `v1.admin.home-page.patch`
- **Tag**: `HomePage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateHomePageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 255*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `hero_media_id`: integer | null (_Optional_)
    - `review_rating`: number | null (_Optional_)
    - `review_count`: integer | null (_Optional_) — *minVal: 0*
    - `review_label`: string | null (_Optional_) — *max: 150*
    - `primary_cta_text`: string | null (_Optional_) — *max: 150*
    - `primary_cta_url`: string | null (_Optional_) — *max: 2048*
    - `secondary_cta_text`: string | null (_Optional_) — *max: 150*
    - `secondary_cta_url`: string | null (_Optional_) — *max: 2048*
    - `services_eyebrow`: string | null (_Optional_) — *max: 255*
    - `services_title`: string | null (_Optional_) — *max: 255*
    - `sectors_eyebrow`: string | null (_Optional_) — *max: 255*
    - `sectors_title`: string | null (_Optional_) — *max: 500*
    - `why_choose_us_eyebrow`: string | null (_Optional_) — *max: 255*
    - `why_choose_us_title`: string | null (_Optional_) — *max: 500*
    - `why_choose_us_cta_text`: string | null (_Optional_) — *max: 150*
    - `why_choose_us_cta_url`: string | null (_Optional_) — *max: 2048*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `hero_steps`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `label`: string (**Required**) — *max: 100*
        - `sort_order`: integer (**Required**) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `HomePageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/about-page`
- **Operation ID**: `v1.admin.about-page.show`
- **Tag**: `AboutPage`
- **Responses**:
  - `200`: `AboutPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/about-page`
- **Operation ID**: `v1.admin.about-page.update`
- **Tag**: `AboutPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateAboutPageRequest`
  - *Fields*:
    - `intro_eyebrow`: string | null (_Optional_) — *max: 255*
    - `intro_title`: string | null (_Optional_) — *max: 255*
    - `intro_description`: string | null (_Optional_) — *max: 50000*
    - `featured_media_id`: integer | null (_Optional_)
    - `director_message_title`: string | null (_Optional_) — *max: 255*
    - `director_message`: string | null (_Optional_) — *max: 50000*
    - `director_leadership_member_id`: integer | null (_Optional_)
    - `director_name`: string | null (_Optional_) — *max: 200*
    - `director_designation`: string | null (_Optional_) — *max: 200*
    - `mission`: string | null (_Optional_) — *max: 50000*
    - `vision`: string | null (_Optional_) — *max: 50000*
    - `purpose_title`: string | null (_Optional_) — *max: 500*
    - `purpose_description`: string | null (_Optional_) — *max: 5000*
    - `purpose_media_id`: integer | null (_Optional_)
    - `mission_title`: string | null (_Optional_) — *max: 500*
    - `vision_title`: string | null (_Optional_) — *max: 500*
    - `values_title`: string | null (_Optional_) — *max: 500*
    - `testimonials_title`: string | null (_Optional_) — *max: 500*
    - `testimonials_description`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `mission_points`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `description`: string (**Required**) — *max: 5000*
        - `sort_order`: integer (**Required**) — *minVal: 0, maxVal: 100000*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `AboutPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/about-page`
- **Operation ID**: `v1.admin.about-page.patch`
- **Tag**: `AboutPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateAboutPageRequest`
  - *Fields*:
    - `intro_eyebrow`: string | null (_Optional_) — *max: 255*
    - `intro_title`: string | null (_Optional_) — *max: 255*
    - `intro_description`: string | null (_Optional_) — *max: 50000*
    - `featured_media_id`: integer | null (_Optional_)
    - `director_message_title`: string | null (_Optional_) — *max: 255*
    - `director_message`: string | null (_Optional_) — *max: 50000*
    - `director_leadership_member_id`: integer | null (_Optional_)
    - `director_name`: string | null (_Optional_) — *max: 200*
    - `director_designation`: string | null (_Optional_) — *max: 200*
    - `mission`: string | null (_Optional_) — *max: 50000*
    - `vision`: string | null (_Optional_) — *max: 50000*
    - `purpose_title`: string | null (_Optional_) — *max: 500*
    - `purpose_description`: string | null (_Optional_) — *max: 5000*
    - `purpose_media_id`: integer | null (_Optional_)
    - `mission_title`: string | null (_Optional_) — *max: 500*
    - `vision_title`: string | null (_Optional_) — *max: 500*
    - `values_title`: string | null (_Optional_) — *max: 500*
    - `testimonials_title`: string | null (_Optional_) — *max: 500*
    - `testimonials_description`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `mission_points`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `description`: string (**Required**) — *max: 5000*
        - `sort_order`: integer (**Required**) — *minVal: 0, maxVal: 100000*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `AboutPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/product-services-page`
- **Operation ID**: `v1.admin.product-services-page.show`
- **Tag**: `ProductServicesPage`
- **Responses**:
  - `200`: `ProductServicesPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/product-services-page`
- **Operation ID**: `v1.admin.product-services-page.update`
- **Tag**: `ProductServicesPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateProductServicesPageRequest`
  - *Fields*:
    - `eyebrow`: string | null (_Optional_) — *max: 255*
    - `title`: string | null (_Optional_) — *max: 255*
    - `services_tab_label`: string | null (_Optional_) — *max: 100*
    - `products_tab_label`: string | null (_Optional_) — *max: 100*
    - `services_introduction`: string | null (_Optional_) — *max: 5000*
    - `service_cta_text`: string | null (_Optional_) — *max: 150*
    - `service_cta_url`: string | null (_Optional_) — *max: 2048*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `ProductServicesPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/product-services-page`
- **Operation ID**: `v1.admin.product-services-page.patch`
- **Tag**: `ProductServicesPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateProductServicesPageRequest`
  - *Fields*:
    - `eyebrow`: string | null (_Optional_) — *max: 255*
    - `title`: string | null (_Optional_) — *max: 255*
    - `services_tab_label`: string | null (_Optional_) — *max: 100*
    - `products_tab_label`: string | null (_Optional_) — *max: 100*
    - `services_introduction`: string | null (_Optional_) — *max: 5000*
    - `service_cta_text`: string | null (_Optional_) — *max: 150*
    - `service_cta_url`: string | null (_Optional_) — *max: 2048*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `ProductServicesPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/expertise-page`
- **Operation ID**: `v1.admin.expertise-page.show`
- **Tag**: `ExpertisePage`
- **Responses**:
  - `200`: `ExpertisePageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/expertise-page`
- **Operation ID**: `v1.admin.expertise-page.update`
- **Tag**: `ExpertisePage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateExpertisePageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `technical_team_title`: string | null (_Optional_) — *max: 500*
    - `technical_team_description`: string | null (_Optional_) — *max: 5000*
    - `technological_expertise_title`: string | null (_Optional_) — *max: 500*
    - `technological_expertise_description`: string | null (_Optional_) — *max: 5000*
    - `capabilities_title`: string | null (_Optional_) — *max: 2000*
    - `capabilities_description`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `ExpertisePageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/expertise-page`
- **Operation ID**: `v1.admin.expertise-page.patch`
- **Tag**: `ExpertisePage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateExpertisePageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `technical_team_title`: string | null (_Optional_) — *max: 500*
    - `technical_team_description`: string | null (_Optional_) — *max: 5000*
    - `technological_expertise_title`: string | null (_Optional_) — *max: 500*
    - `technological_expertise_description`: string | null (_Optional_) — *max: 5000*
    - `capabilities_title`: string | null (_Optional_) — *max: 2000*
    - `capabilities_description`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `ExpertisePageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/customer-experience-page`
- **Operation ID**: `v1.admin.customer-experience-page.show`
- **Tag**: `CustomerExperiencePage`
- **Responses**:
  - `200`: `CustomerExperiencePageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/customer-experience-page`
- **Operation ID**: `v1.admin.customer-experience-page.update`
- **Tag**: `CustomerExperiencePage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCustomerExperiencePageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `testimonial_ids`: Array<integer> (_Optional_)
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `CustomerExperiencePageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/customer-experience-page`
- **Operation ID**: `v1.admin.customer-experience-page.patch`
- **Tag**: `CustomerExperiencePage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCustomerExperiencePageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `testimonial_ids`: Array<integer> (_Optional_)
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `CustomerExperiencePageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/case-studies-page`
- **Operation ID**: `v1.admin.case-studies-page.show`
- **Tag**: `CaseStudiesPage`
- **Responses**:
  - `200`: `CaseStudiesPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/case-studies-page`
- **Operation ID**: `v1.admin.case-studies-page.update`
- **Tag**: `CaseStudiesPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCaseStudiesPageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `detail_eyebrow`: string | null (_Optional_) — *max: 255*
    - `detail_title`: string | null (_Optional_) — *max: 500*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `CaseStudiesPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/case-studies-page`
- **Operation ID**: `v1.admin.case-studies-page.patch`
- **Tag**: `CaseStudiesPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCaseStudiesPageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `detail_eyebrow`: string | null (_Optional_) — *max: 255*
    - `detail_title`: string | null (_Optional_) — *max: 500*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `CaseStudiesPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/blog-page`
- **Operation ID**: `v1.admin.blog-page.show`
- **Tag**: `BlogPage`
- **Responses**:
  - `200`: `BlogPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/blog-page`
- **Operation ID**: `v1.admin.blog-page.update`
- **Tag**: `BlogPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateBlogPageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `detail_share_title`: string | null (_Optional_) — *max: 255*
    - `related_posts_title`: string | null (_Optional_) — *max: 500*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `BlogPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/blog-page`
- **Operation ID**: `v1.admin.blog-page.patch`
- **Tag**: `BlogPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateBlogPageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `detail_share_title`: string | null (_Optional_) — *max: 255*
    - `related_posts_title`: string | null (_Optional_) — *max: 500*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `BlogPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/career-page`
- **Operation ID**: `v1.admin.career-page.show`
- **Tag**: `CareerPage`
- **Responses**:
  - `200`: `CareerPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/career-page`
- **Operation ID**: `v1.admin.career-page.update`
- **Tag**: `CareerPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCareerPageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `hero_media_id`: integer | null (_Optional_)
    - `testimonials_title`: string | null (_Optional_) — *max: 500*
    - `testimonials_description`: string | null (_Optional_) — *max: 5000*
    - `current_openings_title`: string | null (_Optional_) — *max: 500*
    - `current_openings_description`: string | null (_Optional_) — *max: 5000*
    - `internship_openings_title`: string | null (_Optional_) — *max: 500*
    - `internship_openings_description`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `testimonial_ids`: Array<integer> (_Optional_)
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `CareerPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/career-page`
- **Operation ID**: `v1.admin.career-page.patch`
- **Tag**: `CareerPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCareerPageRequest`
  - *Fields*:
    - `hero_eyebrow`: string | null (_Optional_) — *max: 255*
    - `hero_title`: string | null (_Optional_) — *max: 500*
    - `hero_description`: string | null (_Optional_) — *max: 5000*
    - `hero_media_id`: integer | null (_Optional_)
    - `testimonials_title`: string | null (_Optional_) — *max: 500*
    - `testimonials_description`: string | null (_Optional_) — *max: 5000*
    - `current_openings_title`: string | null (_Optional_) — *max: 500*
    - `current_openings_description`: string | null (_Optional_) — *max: 5000*
    - `internship_openings_title`: string | null (_Optional_) — *max: 500*
    - `internship_openings_description`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 500*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `testimonial_ids`: Array<integer> (_Optional_)
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `CareerPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/contact-page`
- **Operation ID**: `v1.admin.contact-page.show`
- **Tag**: `ContactPage`
- **Responses**:
  - `200`: `ContactPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`

#### `PUT` `/admin/contact-page`
- **Operation ID**: `v1.admin.contact-page.update`
- **Tag**: `ContactPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateContactPageRequest`
  - *Fields*:
    - `eyebrow`: string | null (_Optional_) — *max: 255*
    - `title`: string | null (_Optional_) — *max: 255*
    - `introduction`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 255*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `ContactPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/contact-page`
- **Operation ID**: `v1.admin.contact-page.patch`
- **Tag**: `ContactPage`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateContactPageRequest`
  - *Fields*:
    - `eyebrow`: string | null (_Optional_) — *max: 255*
    - `title`: string | null (_Optional_) — *max: 255*
    - `introduction`: string | null (_Optional_) — *max: 5000*
    - `quote_title`: string | null (_Optional_) — *max: 255*
    - `quote_description`: string | null (_Optional_) — *max: 5000*
    - `quote_form_title`: string | null (_Optional_) — *max: 255*
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `key`: string (_Optional_)
    - `updated_by`: string (_Optional_)
- **Responses**:
  - `200`: `ContactPageResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

### 4.6 Blog Posts & Categories

#### `GET` `/admin/blog-posts`
- **Operation ID**: `v1.admin.blog-posts.index`
- **Tag**: `BlogPost`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `status` (query, `BlogStatus` | null, _Optional_)
  - `category_id` (query, integer | null, _Optional_)
  - `author_person_id` (query, integer | null, _Optional_)
  - `featured` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.BlogPostResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/blog-posts`
- **Operation ID**: `v1.admin.blog-posts.store`
- **Tag**: `BlogPost`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreBlogPostRequest`
  - *Fields*:
    - `title`: string (**Required**) — *max: 255*
    - `slug`: string (**Required**) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `excerpt`: string (**Required**) — *max: 5000*
    - `featured_media_id`: integer | null (_Optional_)
    - `author_person_id`: integer | null (_Optional_)
    - `is_featured`: boolean (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
    - `og_media_id`: integer | null (_Optional_)
    - `category_ids`: Array<integer> (_Optional_)
    - `related_post_ids`: Array<integer> (_Optional_)
    - `blocks`: string (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
    - `reading_time_minutes`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.BlogPostResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/blog-posts/{blogPost}`
- **Operation ID**: `v1.admin.blog-posts.show`
- **Tag**: `BlogPost`
- **Query / Path Parameters**:
  - `blogPost` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogPostResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/blog-posts/{blogPost}`
- **Operation ID**: `v1.admin.blog-posts.update`
- **Tag**: `BlogPost`
- **Query / Path Parameters**:
  - `blogPost` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateBlogPostRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 255*
    - `slug`: string (_Optional_) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `excerpt`: string (_Optional_) — *max: 5000*
    - `featured_media_id`: integer | null (_Optional_)
    - `author_person_id`: integer | null (_Optional_)
    - `is_featured`: boolean (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
    - `og_media_id`: integer | null (_Optional_)
    - `category_ids`: Array<integer> (_Optional_)
    - `related_post_ids`: Array<integer> (_Optional_)
    - `blocks`: string (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
    - `reading_time_minutes`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogPostResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/blog-posts/{blogPost}`
- **Operation ID**: `v1.admin.blog-posts.patch`
- **Tag**: `BlogPost`
- **Query / Path Parameters**:
  - `blogPost` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateBlogPostRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 255*
    - `slug`: string (_Optional_) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `excerpt`: string (_Optional_) — *max: 5000*
    - `featured_media_id`: integer | null (_Optional_)
    - `author_person_id`: integer | null (_Optional_)
    - `is_featured`: boolean (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
    - `og_media_id`: integer | null (_Optional_)
    - `category_ids`: Array<integer> (_Optional_)
    - `related_post_ids`: Array<integer> (_Optional_)
    - `blocks`: string (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
    - `reading_time_minutes`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogPostResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/blog-posts/{blogPost}`
- **Operation ID**: `v1.admin.blog-posts.destroy`
- **Tag**: `BlogPost`
- **Query / Path Parameters**:
  - `blogPost` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/blog-posts/{blogPost}/publish`
- **Operation ID**: `v1.admin.blog-posts.publish`
- **Tag**: `BlogPost`
- **Query / Path Parameters**:
  - `blogPost` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `PublishBlogPostRequest`
  - *Fields*:
    - `published_at`: string | null (_Optional_) — *format: date-time*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogPostResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/blog-posts/{blogPost}/unpublish`
- **Operation ID**: `v1.admin.blog-posts.unpublish`
- **Tag**: `BlogPost`
- **Query / Path Parameters**:
  - `blogPost` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogPostResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/blog-posts/{blogPost}/archive`
- **Operation ID**: `v1.admin.blog-posts.archive`
- **Tag**: `BlogPost`
- **Query / Path Parameters**:
  - `blogPost` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogPostResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/blog-categories`
- **Operation ID**: `v1.admin.blog-categories.index`
- **Tag**: `BlogCategory`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `status` (query, `BlogStatus` | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.BlogCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/blog-categories`
- **Operation ID**: `v1.admin.blog-categories.store`
- **Tag**: `BlogCategory`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreBlogCategoryRequest`
  - *Fields*:
    - `name`: string (**Required**) — *max: 200*
    - `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.BlogCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/blog-categories/{blogCategory}`
- **Operation ID**: `v1.admin.blog-categories.show`
- **Tag**: `BlogCategory`
- **Query / Path Parameters**:
  - `blogCategory` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/blog-categories/{blogCategory}`
- **Operation ID**: `v1.admin.blog-categories.update`
- **Tag**: `BlogCategory`
- **Query / Path Parameters**:
  - `blogCategory` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateBlogCategoryRequest`
  - *Fields*:
    - `name`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/blog-categories/{blogCategory}`
- **Operation ID**: `v1.admin.blog-categories.patch`
- **Tag**: `BlogCategory`
- **Query / Path Parameters**:
  - `blogCategory` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateBlogCategoryRequest`
  - *Fields*:
    - `name`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/blog-categories/{blogCategory}`
- **Operation ID**: `v1.admin.blog-categories.destroy`
- **Tag**: `BlogCategory`
- **Query / Path Parameters**:
  - `blogCategory` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `409`: Response → `ConflictException`

#### `POST` `/admin/blog-categories/{blogCategory}/publish`
- **Operation ID**: `v1.admin.blog-categories.publish`
- **Tag**: `BlogCategory`
- **Query / Path Parameters**:
  - `blogCategory` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `PublishBlogCategoryRequest`
  - *Fields*:
    - `published_at`: string | null (_Optional_) — *format: date-time*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/blog-categories/{blogCategory}/unpublish`
- **Operation ID**: `v1.admin.blog-categories.unpublish`
- **Tag**: `BlogCategory`
- **Query / Path Parameters**:
  - `blogCategory` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/blog-categories/{blogCategory}/archive`
- **Operation ID**: `v1.admin.blog-categories.archive`
- **Tag**: `BlogCategory`
- **Query / Path Parameters**:
  - `blogCategory` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.BlogCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

### 4.7 Careers, Jobs & Applications

#### `GET` `/admin/jobs`
- **Operation ID**: `v1.admin.jobs.index`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `status` (query, `CareerJobStatus` | null, _Optional_)
  - `department_id` (query, integer | null, _Optional_)
  - `opening_type` (query, `OpeningType` | null, _Optional_)
  - `employment_type` (query, string | null, _Optional_)
  - `work_mode` (query, `WorkMode` | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.CareerJobResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/jobs`
- **Operation ID**: `v1.admin.jobs.store`
- **Tag**: `CareerJob`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreCareerJobRequest`
  - *Fields*:
    - `department_id`: integer (**Required**)
    - `title`: string (**Required**) — *max: 255*
    - `slug`: string (**Required**) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `employment_type`: enum ("full-time", "part-time", "contract", "temporary") (**Required**) — *values: ["full-time", "part-time", "contract", "temporary"]*
    - `work_mode`: `WorkMode` (**Required**)
    - `experience_level`: string (**Required**) — *max: 100*
    - `location`: string (**Required**) — *max: 255*
    - `salary_min`: number | null (_Optional_) — *minVal: 0*
    - `salary_max`: number | null (_Optional_) — *minVal: 0*
    - `salary_currency`: string | null (_Optional_) — *max: 3, min: 3, pattern: `^[A-Z]{3}$`*
    - `salary_period`: string | null (_Optional_) — *values: ["hour", "month", "year", null]*
    - `description`: string (**Required**) — *max: 50000*
    - `requirements`: string (**Required**) — *max: 50000*
    - `responsibilities`: string (**Required**) — *max: 50000*
    - `application_deadline`: string | null (_Optional_) — *format: date-time*
    - `opening_type`: `OpeningType` (**Required**)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.CareerJobResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/jobs/{careerJob}`
- **Operation ID**: `v1.admin.jobs.show`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `careerJob` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CareerJobResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/jobs/{careerJob}`
- **Operation ID**: `v1.admin.jobs.update`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `careerJob` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCareerJobRequest`
  - *Fields*:
    - `department_id`: integer (_Optional_)
    - `title`: string (_Optional_) — *max: 255*
    - `slug`: string (_Optional_) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `employment_type`: enum ("full-time", "part-time", "contract", "temporary") (_Optional_) — *values: ["full-time", "part-time", "contract", "temporary"]*
    - `work_mode`: `WorkMode` (_Optional_)
    - `experience_level`: string (_Optional_) — *max: 100*
    - `location`: string (_Optional_) — *max: 255*
    - `salary_min`: number | null (_Optional_) — *minVal: 0*
    - `salary_max`: number | null (_Optional_) — *minVal: 0*
    - `salary_currency`: string | null (_Optional_) — *max: 3, min: 3, pattern: `^[A-Z]{3}$`*
    - `salary_period`: string | null (_Optional_) — *values: ["hour", "month", "year", null]*
    - `description`: string (_Optional_) — *max: 50000*
    - `requirements`: string (_Optional_) — *max: 50000*
    - `responsibilities`: string (_Optional_) — *max: 50000*
    - `application_deadline`: string | null (_Optional_) — *format: date-time*
    - `opening_type`: `OpeningType` (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CareerJobResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/jobs/{careerJob}`
- **Operation ID**: `v1.admin.jobs.patch`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `careerJob` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCareerJobRequest`
  - *Fields*:
    - `department_id`: integer (_Optional_)
    - `title`: string (_Optional_) — *max: 255*
    - `slug`: string (_Optional_) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `employment_type`: enum ("full-time", "part-time", "contract", "temporary") (_Optional_) — *values: ["full-time", "part-time", "contract", "temporary"]*
    - `work_mode`: `WorkMode` (_Optional_)
    - `experience_level`: string (_Optional_) — *max: 100*
    - `location`: string (_Optional_) — *max: 255*
    - `salary_min`: number | null (_Optional_) — *minVal: 0*
    - `salary_max`: number | null (_Optional_) — *minVal: 0*
    - `salary_currency`: string | null (_Optional_) — *max: 3, min: 3, pattern: `^[A-Z]{3}$`*
    - `salary_period`: string | null (_Optional_) — *values: ["hour", "month", "year", null]*
    - `description`: string (_Optional_) — *max: 50000*
    - `requirements`: string (_Optional_) — *max: 50000*
    - `responsibilities`: string (_Optional_) — *max: 50000*
    - `application_deadline`: string | null (_Optional_) — *format: date-time*
    - `opening_type`: `OpeningType` (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CareerJobResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/jobs/{careerJob}`
- **Operation ID**: `v1.admin.jobs.destroy`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `careerJob` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/jobs/{careerJob}/publish`
- **Operation ID**: `v1.admin.jobs.publish`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `careerJob` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `PublishCareerJobRequest`
  - *Fields*:
    - `published_at`: string | null (_Optional_) — *format: date-time*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CareerJobResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/jobs/{careerJob}/unpublish`
- **Operation ID**: `v1.admin.jobs.unpublish`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `careerJob` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CareerJobResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/jobs/{careerJob}/archive`
- **Operation ID**: `v1.admin.jobs.archive`
- **Tag**: `CareerJob`
- **Query / Path Parameters**:
  - `careerJob` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CareerJobResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/job-applications`
- **Operation ID**: `v1.admin.job-applications.index`
- **Tag**: `JobApplication`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `status` (query, `JobApplicationStatus` | null, _Optional_)
  - `career_job_id` (query, integer | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `JobApplicationResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/job-applications/{jobApplication}`
- **Operation ID**: `v1.admin.job-applications.show`
- **Tag**: `JobApplication`
- **Query / Path Parameters**:
  - `jobApplication` (path, integer, **Required**)
- **Responses**:
  - `200`: `JobApplicationResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PATCH` `/admin/job-applications/{jobApplication}`
- **Operation ID**: `v1.admin.job-applications.update`
- **Tag**: `JobApplication`
- **Query / Path Parameters**:
  - `jobApplication` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateJobApplicationRequest`
  - *Fields*:
    - `status`: `JobApplicationStatus` (**Required**)
    - `id`: string (_Optional_)
    - `applicant_name`: string (_Optional_)
    - `email`: string (_Optional_)
    - `phone`: string (_Optional_)
    - `resume_media_id`: string (_Optional_)
- **Responses**:
  - `200`: `JobApplicationResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/job-applications/{jobApplication}/resume`
- **Operation ID**: `v1.admin.job-applications.resume`
- **Tag**: `JobApplication`
- **Query / Path Parameters**:
  - `jobApplication` (path, integer, **Required**)
- **Responses**:
  - `200`: Response
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/departments`
- **Operation ID**: `v1.admin.departments.index`
- **Tag**: `Department`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.DepartmentResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/departments`
- **Operation ID**: `v1.admin.departments.store`
- **Tag**: `Department`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreDepartmentRequest`
  - *Fields*:
    - `name`: string (**Required**) — *max: 200*
    - `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.DepartmentResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/departments/{department}`
- **Operation ID**: `v1.admin.departments.show`
- **Tag**: `Department`
- **Query / Path Parameters**:
  - `department` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.DepartmentResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/departments/{department}`
- **Operation ID**: `v1.admin.departments.update`
- **Tag**: `Department`
- **Query / Path Parameters**:
  - `department` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateDepartmentRequest`
  - *Fields*:
    - `name`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.DepartmentResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/departments/{department}`
- **Operation ID**: `v1.admin.departments.patch`
- **Tag**: `Department`
- **Query / Path Parameters**:
  - `department` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateDepartmentRequest`
  - *Fields*:
    - `name`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.DepartmentResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/departments/{department}`
- **Operation ID**: `v1.admin.departments.destroy`
- **Tag**: `Department`
- **Query / Path Parameters**:
  - `department` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `409`: Response → `ConflictException`

### 4.8 Case Studies & Tags

#### `GET` `/admin/case-studies`
- **Operation ID**: `v1.admin.case-studies.index`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `industry` (query, string | null, _Optional_)
  - `status` (query, `CaseStudyStatus` | null, _Optional_)
  - `tag_id` (query, integer | null, _Optional_)
  - `service_id` (query, integer | null, _Optional_)
  - `featured` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.CaseStudyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/case-studies`
- **Operation ID**: `v1.admin.case-studies.store`
- **Tag**: `CaseStudy`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreCaseStudyRequest`
  - *Fields*:
    - `title`: string (**Required**) — *max: 255*
    - `slug`: string (**Required**) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `short_summary`: string (**Required**) — *max: 5000*
    - `client`: string | null (_Optional_) — *max: 255*
    - `industry`: string (**Required**) — *max: 200*
    - `project_statement`: string | null (_Optional_) — *max: 10000*
    - `featured_media_id`: integer | null (_Optional_)
    - `is_featured`: boolean (_Optional_)
    - `author_person_id`: integer | null (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
    - `og_media_id`: integer | null (_Optional_)
    - `tag_ids`: Array<integer> (_Optional_)
    - `service_ids`: Array<integer> (_Optional_)
    - `related_case_study_ids`: Array<integer> (_Optional_)
    - `blocks`: string (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.CaseStudyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/case-studies/{caseStudy}`
- **Operation ID**: `v1.admin.case-studies.show`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `caseStudy` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CaseStudyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/case-studies/{caseStudy}`
- **Operation ID**: `v1.admin.case-studies.update`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `caseStudy` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCaseStudyRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 255*
    - `slug`: string (_Optional_) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `short_summary`: string (_Optional_) — *max: 5000*
    - `client`: string | null (_Optional_) — *max: 255*
    - `industry`: string (_Optional_) — *max: 200*
    - `project_statement`: string | null (_Optional_) — *max: 10000*
    - `featured_media_id`: integer | null (_Optional_)
    - `is_featured`: boolean (_Optional_)
    - `author_person_id`: integer | null (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
    - `og_media_id`: integer | null (_Optional_)
    - `tag_ids`: Array<integer> (_Optional_)
    - `service_ids`: Array<integer> (_Optional_)
    - `related_case_study_ids`: Array<integer> (_Optional_)
    - `blocks`: string (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CaseStudyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/case-studies/{caseStudy}`
- **Operation ID**: `v1.admin.case-studies.patch`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `caseStudy` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCaseStudyRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 255*
    - `slug`: string (_Optional_) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `short_summary`: string (_Optional_) — *max: 5000*
    - `client`: string | null (_Optional_) — *max: 255*
    - `industry`: string (_Optional_) — *max: 200*
    - `project_statement`: string | null (_Optional_) — *max: 10000*
    - `featured_media_id`: integer | null (_Optional_)
    - `is_featured`: boolean (_Optional_)
    - `author_person_id`: integer | null (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
    - `og_media_id`: integer | null (_Optional_)
    - `tag_ids`: Array<integer> (_Optional_)
    - `service_ids`: Array<integer> (_Optional_)
    - `related_case_study_ids`: Array<integer> (_Optional_)
    - `blocks`: string (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CaseStudyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/case-studies/{caseStudy}`
- **Operation ID**: `v1.admin.case-studies.destroy`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `caseStudy` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/case-studies/{caseStudy}/publish`
- **Operation ID**: `v1.admin.case-studies.publish`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `caseStudy` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `PublishCaseStudyRequest`
  - *Fields*:
    - `published_at`: string | null (_Optional_) — *format: date-time*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CaseStudyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/case-studies/{caseStudy}/unpublish`
- **Operation ID**: `v1.admin.case-studies.unpublish`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `caseStudy` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CaseStudyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/case-studies/{caseStudy}/archive`
- **Operation ID**: `v1.admin.case-studies.archive`
- **Tag**: `CaseStudy`
- **Query / Path Parameters**:
  - `caseStudy` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CaseStudyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/case-study-tags`
- **Operation ID**: `v1.admin.case-study-tags.index`
- **Tag**: `CaseStudyTag`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.CaseStudyTagResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/case-study-tags`
- **Operation ID**: `v1.admin.case-study-tags.store`
- **Tag**: `CaseStudyTag`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreCaseStudyTagRequest`
  - *Fields*:
    - `name`: string (**Required**) — *max: 200*
    - `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.CaseStudyTagResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/case-study-tags/{caseStudyTag}`
- **Operation ID**: `v1.admin.case-study-tags.show`
- **Tag**: `CaseStudyTag`
- **Query / Path Parameters**:
  - `caseStudyTag` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CaseStudyTagResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/case-study-tags/{caseStudyTag}`
- **Operation ID**: `v1.admin.case-study-tags.update`
- **Tag**: `CaseStudyTag`
- **Query / Path Parameters**:
  - `caseStudyTag` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCaseStudyTagRequest`
  - *Fields*:
    - `name`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CaseStudyTagResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/case-study-tags/{caseStudyTag}`
- **Operation ID**: `v1.admin.case-study-tags.patch`
- **Tag**: `CaseStudyTag`
- **Query / Path Parameters**:
  - `caseStudyTag` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCaseStudyTagRequest`
  - *Fields*:
    - `name`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.CaseStudyTagResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/case-study-tags/{caseStudyTag}`
- **Operation ID**: `v1.admin.case-study-tags.destroy`
- **Tag**: `CaseStudyTag`
- **Query / Path Parameters**:
  - `caseStudyTag` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `409`: Response → `ConflictException`

### 4.9 Services & Sectors

#### `GET` `/admin/services`
- **Operation ID**: `v1.admin.services.index`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `status` (query, `ServiceStatus` | null, _Optional_)
  - `featured` (query, boolean | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.ServiceResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/services`
- **Operation ID**: `v1.admin.services.store`
- **Tag**: `Service`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreServiceRequest`
  - *Fields*:
    - `title`: string (**Required**) — *max: 200*
    - `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `short_description`: string | null (_Optional_) — *max: 1000*
    - `full_description`: string | null (_Optional_) — *max: 100000*
    - `icon_media_id`: integer | null (_Optional_)
    - `featured_image_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_featured`: boolean (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `features`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `title`: string (**Required**) — *max: 200*
        - `description`: string | null (_Optional_) — *max: 5000*
        - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
        - `id`: string (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.ServiceResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/services/{service}`
- **Operation ID**: `v1.admin.services.show`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `service` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.ServiceResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/services/{service}`
- **Operation ID**: `v1.admin.services.update`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `service` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateServiceRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `short_description`: string | null (_Optional_) — *max: 1000*
    - `full_description`: string | null (_Optional_) — *max: 100000*
    - `icon_media_id`: integer | null (_Optional_)
    - `featured_image_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_featured`: boolean (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `features`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `title`: string (**Required**) — *max: 200*
        - `description`: string | null (_Optional_) — *max: 5000*
        - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
        - `id`: string (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.ServiceResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/services/{service}`
- **Operation ID**: `v1.admin.services.patch`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `service` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateServiceRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `short_description`: string | null (_Optional_) — *max: 1000*
    - `full_description`: string | null (_Optional_) — *max: 100000*
    - `icon_media_id`: integer | null (_Optional_)
    - `featured_image_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_featured`: boolean (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `features`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `title`: string (**Required**) — *max: 200*
        - `description`: string | null (_Optional_) — *max: 5000*
        - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
        - `id`: string (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.ServiceResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/services/{service}`
- **Operation ID**: `v1.admin.services.destroy`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `service` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `409`: Response → `ConflictException`

#### `POST` `/admin/services/{service}/publish`
- **Operation ID**: `v1.admin.services.publish`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `service` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `PublishServiceRequest`
  - *Fields*:
    - `published_at`: string | null (_Optional_) — *format: date-time*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.ServiceResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/services/{service}/unpublish`
- **Operation ID**: `v1.admin.services.unpublish`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `service` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.ServiceResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/services/{service}/archive`
- **Operation ID**: `v1.admin.services.archive`
- **Tag**: `Service`
- **Query / Path Parameters**:
  - `service` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.ServiceResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/sectors`
- **Operation ID**: `v1.admin.sectors.index`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `status` (query, `SectorStatus` | null, _Optional_)
  - `featured` (query, boolean | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.SectorResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/sectors`
- **Operation ID**: `v1.admin.sectors.store`
- **Tag**: `Sector`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreSectorRequest`
  - *Fields*:
    - `title`: string (**Required**) — *max: 200*
    - `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `short_description`: string (**Required**) — *max: 1000*
    - `full_description`: string | null (_Optional_) — *max: 100000*
    - `icon_media_id`: integer | null (_Optional_)
    - `featured_image_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_featured`: boolean (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.SectorResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/sectors/{sector}`
- **Operation ID**: `v1.admin.sectors.show`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `sector` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.SectorResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/sectors/{sector}`
- **Operation ID**: `v1.admin.sectors.update`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `sector` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateSectorRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `short_description`: string (_Optional_) — *max: 1000*
    - `full_description`: string | null (_Optional_) — *max: 100000*
    - `icon_media_id`: integer | null (_Optional_)
    - `featured_image_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_featured`: boolean (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.SectorResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/sectors/{sector}`
- **Operation ID**: `v1.admin.sectors.patch`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `sector` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateSectorRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `short_description`: string (_Optional_) — *max: 1000*
    - `full_description`: string | null (_Optional_) — *max: 100000*
    - `icon_media_id`: integer | null (_Optional_)
    - `featured_image_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_featured`: boolean (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `seo_title`: string | null (_Optional_) — *max: 255*
    - `seo_description`: string | null (_Optional_) — *max: 500*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
    - `published_at`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.SectorResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/sectors/{sector}`
- **Operation ID**: `v1.admin.sectors.destroy`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `sector` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/sectors/{sector}/publish`
- **Operation ID**: `v1.admin.sectors.publish`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `sector` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `PublishSectorRequest`
  - *Fields*:
    - `published_at`: string | null (_Optional_) — *format: date-time*
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.SectorResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/sectors/{sector}/unpublish`
- **Operation ID**: `v1.admin.sectors.unpublish`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `sector` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.SectorResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/sectors/{sector}/archive`
- **Operation ID**: `v1.admin.sectors.archive`
- **Tag**: `Sector`
- **Query / Path Parameters**:
  - `sector` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.SectorResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

### 4.10 Technologies & Categories

#### `GET` `/admin/technologies`
- **Operation ID**: `v1.admin.technologies.index`
- **Tag**: `Technology`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `technology_category_id` (query, integer | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `TechnologyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/technologies`
- **Operation ID**: `v1.admin.technologies.store`
- **Tag**: `Technology`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreTechnologyRequest`
  - *Fields*:
    - `technology_category_id`: integer (**Required**)
    - `name`: string (**Required**) — *max: 200*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `201`: `TechnologyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/technologies/{technology}`
- **Operation ID**: `v1.admin.technologies.show`
- **Tag**: `Technology`
- **Query / Path Parameters**:
  - `technology` (path, integer, **Required**)
- **Responses**:
  - `200`: `TechnologyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/technologies/{technology}`
- **Operation ID**: `v1.admin.technologies.update`
- **Tag**: `Technology`
- **Query / Path Parameters**:
  - `technology` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateTechnologyRequest`
  - *Fields*:
    - `technology_category_id`: integer (_Optional_)
    - `name`: string (_Optional_) — *max: 200*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `TechnologyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/technologies/{technology}`
- **Operation ID**: `v1.admin.technologies.patch`
- **Tag**: `Technology`
- **Query / Path Parameters**:
  - `technology` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateTechnologyRequest`
  - *Fields*:
    - `technology_category_id`: integer (_Optional_)
    - `name`: string (_Optional_) — *max: 200*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `TechnologyResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/technologies/{technology}`
- **Operation ID**: `v1.admin.technologies.destroy`
- **Tag**: `Technology`
- **Query / Path Parameters**:
  - `technology` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/technology-categories`
- **Operation ID**: `v1.admin.technology-categories.index`
- **Tag**: `TechnologyCategory`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `TechnologyCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/technology-categories`
- **Operation ID**: `v1.admin.technology-categories.store`
- **Tag**: `TechnologyCategory`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreTechnologyCategoryRequest`
  - *Fields*:
    - `name`: string (**Required**) — *max: 200*
    - `icon_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `201`: `TechnologyCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/technology-categories/{technologyCategory}`
- **Operation ID**: `v1.admin.technology-categories.show`
- **Tag**: `TechnologyCategory`
- **Query / Path Parameters**:
  - `technologyCategory` (path, integer, **Required**)
- **Responses**:
  - `200`: `TechnologyCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/technology-categories/{technologyCategory}`
- **Operation ID**: `v1.admin.technology-categories.update`
- **Tag**: `TechnologyCategory`
- **Query / Path Parameters**:
  - `technologyCategory` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateTechnologyCategoryRequest`
  - *Fields*:
    - `name`: string (_Optional_) — *max: 200*
    - `icon_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `TechnologyCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/technology-categories/{technologyCategory}`
- **Operation ID**: `v1.admin.technology-categories.patch`
- **Tag**: `TechnologyCategory`
- **Query / Path Parameters**:
  - `technologyCategory` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateTechnologyCategoryRequest`
  - *Fields*:
    - `name`: string (_Optional_) — *max: 200*
    - `icon_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `TechnologyCategoryResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/technology-categories/{technologyCategory}`
- **Operation ID**: `v1.admin.technology-categories.destroy`
- **Tag**: `TechnologyCategory`
- **Query / Path Parameters**:
  - `technologyCategory` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

### 4.11 Company Values, Capabilities & Leadership

#### `GET` `/admin/company-values`
- **Operation ID**: `v1.admin.company-values.index`
- **Tag**: `CompanyValue`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `CompanyValueResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/company-values`
- **Operation ID**: `v1.admin.company-values.store`
- **Tag**: `CompanyValue`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreCompanyValueRequest`
  - *Fields*:
    - `title`: string (**Required**) — *max: 200*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `icon_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
    - `about_page_id`: string (_Optional_)
- **Responses**:
  - `201`: `CompanyValueResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/company-values/{companyValue}`
- **Operation ID**: `v1.admin.company-values.show`
- **Tag**: `CompanyValue`
- **Query / Path Parameters**:
  - `companyValue` (path, integer, **Required**)
- **Responses**:
  - `200`: `CompanyValueResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/company-values/{companyValue}`
- **Operation ID**: `v1.admin.company-values.update`
- **Tag**: `CompanyValue`
- **Query / Path Parameters**:
  - `companyValue` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCompanyValueRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `icon_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
    - `about_page_id`: string (_Optional_)
- **Responses**:
  - `200`: `CompanyValueResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/company-values/{companyValue}`
- **Operation ID**: `v1.admin.company-values.patch`
- **Tag**: `CompanyValue`
- **Query / Path Parameters**:
  - `companyValue` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCompanyValueRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `icon_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
    - `about_page_id`: string (_Optional_)
- **Responses**:
  - `200`: `CompanyValueResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/company-values/{companyValue}`
- **Operation ID**: `v1.admin.company-values.destroy`
- **Tag**: `CompanyValue`
- **Query / Path Parameters**:
  - `companyValue` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/company-capabilities`
- **Operation ID**: `v1.admin.company-capabilities.index`
- **Tag**: `CompanyCapability`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `CompanyCapabilityResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/company-capabilities`
- **Operation ID**: `v1.admin.company-capabilities.store`
- **Tag**: `CompanyCapability`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreCompanyCapabilityRequest`
  - *Fields*:
    - `title`: string (**Required**) — *max: 200*
    - `subtitle`: string | null (_Optional_) — *max: 500*
    - `description`: string (**Required**) — *max: 10000*
    - `icon_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `features`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `label`: string (**Required**) — *max: 500*
        - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
        - `id`: string (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `201`: `CompanyCapabilityResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/company-capabilities/{companyCapability}`
- **Operation ID**: `v1.admin.company-capabilities.show`
- **Tag**: `CompanyCapability`
- **Query / Path Parameters**:
  - `companyCapability` (path, integer, **Required**)
- **Responses**:
  - `200`: `CompanyCapabilityResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/company-capabilities/{companyCapability}`
- **Operation ID**: `v1.admin.company-capabilities.update`
- **Tag**: `CompanyCapability`
- **Query / Path Parameters**:
  - `companyCapability` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCompanyCapabilityRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `subtitle`: string | null (_Optional_) — *max: 500*
    - `description`: string (_Optional_) — *max: 10000*
    - `icon_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `features`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `label`: string (**Required**) — *max: 500*
        - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
        - `id`: string (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `CompanyCapabilityResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/company-capabilities/{companyCapability}`
- **Operation ID**: `v1.admin.company-capabilities.patch`
- **Tag**: `CompanyCapability`
- **Query / Path Parameters**:
  - `companyCapability` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateCompanyCapabilityRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `subtitle`: string | null (_Optional_) — *max: 500*
    - `description`: string (_Optional_) — *max: 10000*
    - `icon_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `features`: Array<object> (_Optional_)
      - *Item Object Structure:*
        - `label`: string (**Required**) — *max: 500*
        - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
        - `id`: string (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `CompanyCapabilityResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/company-capabilities/{companyCapability}`
- **Operation ID**: `v1.admin.company-capabilities.destroy`
- **Tag**: `CompanyCapability`
- **Query / Path Parameters**:
  - `companyCapability` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/leadership-members`
- **Operation ID**: `v1.admin.leadership-members.index`
- **Tag**: `LeadershipMember`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `LeadershipMemberResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/leadership-members`
- **Operation ID**: `v1.admin.leadership-members.store`
- **Tag**: `LeadershipMember`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreLeadershipMemberRequest`
  - *Fields*:
    - `full_name`: string (**Required**) — *max: 200*
    - `designation`: string (**Required**) — *max: 200*
    - `short_bio`: string (**Required**) — *max: 5000*
    - `full_bio`: string | null (_Optional_) — *max: 50000*
    - `profile_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `201`: `LeadershipMemberResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/leadership-members/{leadershipMember}`
- **Operation ID**: `v1.admin.leadership-members.show`
- **Tag**: `LeadershipMember`
- **Query / Path Parameters**:
  - `leadershipMember` (path, integer, **Required**)
- **Responses**:
  - `200`: `LeadershipMemberResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/leadership-members/{leadershipMember}`
- **Operation ID**: `v1.admin.leadership-members.update`
- **Tag**: `LeadershipMember`
- **Query / Path Parameters**:
  - `leadershipMember` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateLeadershipMemberRequest`
  - *Fields*:
    - `full_name`: string (_Optional_) — *max: 200*
    - `designation`: string (_Optional_) — *max: 200*
    - `short_bio`: string (_Optional_) — *max: 5000*
    - `full_bio`: string | null (_Optional_) — *max: 50000*
    - `profile_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `LeadershipMemberResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/leadership-members/{leadershipMember}`
- **Operation ID**: `v1.admin.leadership-members.patch`
- **Tag**: `LeadershipMember`
- **Query / Path Parameters**:
  - `leadershipMember` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateLeadershipMemberRequest`
  - *Fields*:
    - `full_name`: string (_Optional_) — *max: 200*
    - `designation`: string (_Optional_) — *max: 200*
    - `short_bio`: string (_Optional_) — *max: 5000*
    - `full_bio`: string | null (_Optional_) — *max: 50000*
    - `profile_media_id`: integer | null (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `LeadershipMemberResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/leadership-members/{leadershipMember}`
- **Operation ID**: `v1.admin.leadership-members.destroy`
- **Tag**: `LeadershipMember`
- **Query / Path Parameters**:
  - `leadershipMember` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `409`: Response → `ConflictException`

#### `GET` `/admin/expertise-roles`
- **Operation ID**: `v1.admin.expertise-roles.index`
- **Tag**: `ExpertiseRole`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `ExpertiseRoleResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/expertise-roles`
- **Operation ID**: `v1.admin.expertise-roles.store`
- **Tag**: `ExpertiseRole`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreExpertiseRoleRequest`
  - *Fields*:
    - `title`: string (**Required**) — *max: 200*
    - `icon_media_id`: integer (**Required**)
    - `description`: string (**Required**) — *max: 10000*
    - `stack_label`: string | null (_Optional_) — *max: 255*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `201`: `ExpertiseRoleResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/expertise-roles/{expertiseRole}`
- **Operation ID**: `v1.admin.expertise-roles.show`
- **Tag**: `ExpertiseRole`
- **Query / Path Parameters**:
  - `expertiseRole` (path, integer, **Required**)
- **Responses**:
  - `200`: `ExpertiseRoleResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/expertise-roles/{expertiseRole}`
- **Operation ID**: `v1.admin.expertise-roles.update`
- **Tag**: `ExpertiseRole`
- **Query / Path Parameters**:
  - `expertiseRole` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateExpertiseRoleRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `icon_media_id`: integer (_Optional_)
    - `description`: string (_Optional_) — *max: 10000*
    - `stack_label`: string | null (_Optional_) — *max: 255*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `ExpertiseRoleResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/expertise-roles/{expertiseRole}`
- **Operation ID**: `v1.admin.expertise-roles.patch`
- **Tag**: `ExpertiseRole`
- **Query / Path Parameters**:
  - `expertiseRole` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateExpertiseRoleRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `icon_media_id`: integer (_Optional_)
    - `description`: string (_Optional_) — *max: 10000*
    - `stack_label`: string | null (_Optional_) — *max: 255*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `ExpertiseRoleResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/expertise-roles/{expertiseRole}`
- **Operation ID**: `v1.admin.expertise-roles.destroy`
- **Tag**: `ExpertiseRole`
- **Query / Path Parameters**:
  - `expertiseRole` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/metrics`
- **Operation ID**: `v1.admin.metrics.index`
- **Tag**: `Metric`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `MetricResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/metrics`
- **Operation ID**: `v1.admin.metrics.store`
- **Tag**: `Metric`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreMetricRequest`
  - *Fields*:
    - `key`: string (**Required**) — *max: 100, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `value`: string (**Required**) — *max: 100*
    - `prefix`: string | null (_Optional_) — *max: 30*
    - `suffix`: string | null (_Optional_) — *max: 30*
    - `label`: string (**Required**) — *max: 150*
    - `description`: string | null (_Optional_) — *max: 2000*
    - `icon_media_id`: integer | null (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- **Responses**:
  - `201`: `MetricResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/metrics/{metric}`
- **Operation ID**: `v1.admin.metrics.show`
- **Tag**: `Metric`
- **Query / Path Parameters**:
  - `metric` (path, integer, **Required**)
- **Responses**:
  - `200`: `MetricResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/metrics/{metric}`
- **Operation ID**: `v1.admin.metrics.update`
- **Tag**: `Metric`
- **Query / Path Parameters**:
  - `metric` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateMetricRequest`
  - *Fields*:
    - `key`: string (_Optional_) — *max: 100, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `value`: string (_Optional_) — *max: 100*
    - `prefix`: string | null (_Optional_) — *max: 30*
    - `suffix`: string | null (_Optional_) — *max: 30*
    - `label`: string (_Optional_) — *max: 150*
    - `description`: string | null (_Optional_) — *max: 2000*
    - `icon_media_id`: integer | null (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `MetricResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/metrics/{metric}`
- **Operation ID**: `v1.admin.metrics.patch`
- **Tag**: `Metric`
- **Query / Path Parameters**:
  - `metric` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateMetricRequest`
  - *Fields*:
    - `key`: string (_Optional_) — *max: 100, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
    - `value`: string (_Optional_) — *max: 100*
    - `prefix`: string | null (_Optional_) — *max: 30*
    - `suffix`: string | null (_Optional_) — *max: 30*
    - `label`: string (_Optional_) — *max: 150*
    - `description`: string | null (_Optional_) — *max: 2000*
    - `icon_media_id`: integer | null (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `MetricResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/metrics/{metric}`
- **Operation ID**: `v1.admin.metrics.destroy`
- **Tag**: `Metric`
- **Query / Path Parameters**:
  - `metric` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/why-choose-us`
- **Operation ID**: `v1.admin.why-choose-us.index`
- **Tag**: `WhyChooseUsItem`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `featured` (query, boolean | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.WhyChooseUsItemResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/why-choose-us`
- **Operation ID**: `v1.admin.why-choose-us.store`
- **Tag**: `WhyChooseUsItem`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreWhyChooseUsItemRequest`
  - *Fields*:
    - `title`: string (**Required**) — *max: 200*
    - `short_title`: string | null (_Optional_) — *max: 100*
    - `description`: string (**Required**) — *max: 10000*
    - `icon_media_id`: integer | null (_Optional_)
    - `metric_value`: string | null (_Optional_) — *max: 50*
    - `metric_suffix`: string | null (_Optional_) — *max: 30*
    - `cta_text`: string | null (_Optional_) — *max: 150*
    - `cta_url`: string | null (_Optional_) — *max: 2048*
    - `is_featured`: boolean (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.WhyChooseUsItemResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/why-choose-us/{whyChooseUsItem}`
- **Operation ID**: `v1.admin.why-choose-us.show`
- **Tag**: `WhyChooseUsItem`
- **Query / Path Parameters**:
  - `whyChooseUsItem` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.WhyChooseUsItemResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/why-choose-us/{whyChooseUsItem}`
- **Operation ID**: `v1.admin.why-choose-us.update`
- **Tag**: `WhyChooseUsItem`
- **Query / Path Parameters**:
  - `whyChooseUsItem` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateWhyChooseUsItemRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `short_title`: string | null (_Optional_) — *max: 100*
    - `description`: string (_Optional_) — *max: 10000*
    - `icon_media_id`: integer | null (_Optional_)
    - `metric_value`: string | null (_Optional_) — *max: 50*
    - `metric_suffix`: string | null (_Optional_) — *max: 30*
    - `cta_text`: string | null (_Optional_) — *max: 150*
    - `cta_url`: string | null (_Optional_) — *max: 2048*
    - `is_featured`: boolean (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.WhyChooseUsItemResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/why-choose-us/{whyChooseUsItem}`
- **Operation ID**: `v1.admin.why-choose-us.patch`
- **Tag**: `WhyChooseUsItem`
- **Query / Path Parameters**:
  - `whyChooseUsItem` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateWhyChooseUsItemRequest`
  - *Fields*:
    - `title`: string (_Optional_) — *max: 200*
    - `short_title`: string | null (_Optional_) — *max: 100*
    - `description`: string (_Optional_) — *max: 10000*
    - `icon_media_id`: integer | null (_Optional_)
    - `metric_value`: string | null (_Optional_) — *max: 50*
    - `metric_suffix`: string | null (_Optional_) — *max: 30*
    - `cta_text`: string | null (_Optional_) — *max: 150*
    - `cta_url`: string | null (_Optional_) — *max: 2048*
    - `is_featured`: boolean (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.WhyChooseUsItemResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/why-choose-us/{whyChooseUsItem}`
- **Operation ID**: `v1.admin.why-choose-us.destroy`
- **Tag**: `WhyChooseUsItem`
- **Query / Path Parameters**:
  - `whyChooseUsItem` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `GET` `/admin/testimonials`
- **Operation ID**: `v1.admin.testimonials.index`
- **Tag**: `Testimonial`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `status` (query, `TestimonialStatus` | null, _Optional_)
  - `featured` (query, boolean | null, _Optional_)
  - `active` (query, boolean | null, _Optional_)
  - `rating` (query, integer | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `App.Http.Resources.Api.V1.Admin.TestimonialResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `POST` `/admin/testimonials`
- **Operation ID**: `v1.admin.testimonials.store`
- **Tag**: `Testimonial`
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `StoreTestimonialRequest`
  - *Fields*:
    - `customer_name`: string (**Required**) — *max: 200*
    - `customer_role`: string | null (_Optional_) — *max: 200*
    - `company`: string | null (_Optional_) — *max: 200*
    - `department`: string | null (_Optional_) — *max: 200*
    - `testimonial`: string (**Required**) — *max: 10000*
    - `avatar_media_id`: integer | null (_Optional_)
    - `rating`: integer | null (_Optional_) — *minVal: 1, maxVal: 5*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_featured`: boolean (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `201`: `App.Http.Resources.Api.V1.Admin.TestimonialResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/testimonials/{testimonial}`
- **Operation ID**: `v1.admin.testimonials.show`
- **Tag**: `Testimonial`
- **Query / Path Parameters**:
  - `testimonial` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.TestimonialResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PUT` `/admin/testimonials/{testimonial}`
- **Operation ID**: `v1.admin.testimonials.update`
- **Tag**: `Testimonial`
- **Query / Path Parameters**:
  - `testimonial` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateTestimonialRequest`
  - *Fields*:
    - `customer_name`: string (_Optional_) — *max: 200*
    - `customer_role`: string | null (_Optional_) — *max: 200*
    - `company`: string | null (_Optional_) — *max: 200*
    - `department`: string | null (_Optional_) — *max: 200*
    - `testimonial`: string (_Optional_) — *max: 10000*
    - `avatar_media_id`: integer | null (_Optional_)
    - `rating`: integer | null (_Optional_) — *minVal: 1, maxVal: 5*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_featured`: boolean (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.TestimonialResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `PATCH` `/admin/testimonials/{testimonial}`
- **Operation ID**: `v1.admin.testimonials.patch`
- **Tag**: `Testimonial`
- **Query / Path Parameters**:
  - `testimonial` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateTestimonialRequest`
  - *Fields*:
    - `customer_name`: string (_Optional_) — *max: 200*
    - `customer_role`: string | null (_Optional_) — *max: 200*
    - `company`: string | null (_Optional_) — *max: 200*
    - `department`: string | null (_Optional_) — *max: 200*
    - `testimonial`: string (_Optional_) — *max: 10000*
    - `avatar_media_id`: integer | null (_Optional_)
    - `rating`: integer | null (_Optional_) — *minVal: 1, maxVal: 5*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `is_featured`: boolean (_Optional_)
    - `is_active`: boolean (_Optional_)
    - `id`: string (_Optional_)
    - `status`: string (_Optional_)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.TestimonialResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `DELETE` `/admin/testimonials/{testimonial}`
- **Operation ID**: `v1.admin.testimonials.destroy`
- **Tag**: `Testimonial`
- **Query / Path Parameters**:
  - `testimonial` (path, integer, **Required**)
- **Responses**:
  - `204`: No content
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/testimonials/{testimonial}/publish`
- **Operation ID**: `v1.admin.testimonials.publish`
- **Tag**: `Testimonial`
- **Query / Path Parameters**:
  - `testimonial` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.TestimonialResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/testimonials/{testimonial}/unpublish`
- **Operation ID**: `v1.admin.testimonials.unpublish`
- **Tag**: `Testimonial`
- **Query / Path Parameters**:
  - `testimonial` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.TestimonialResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `POST` `/admin/testimonials/{testimonial}/archive`
- **Operation ID**: `v1.admin.testimonials.archive`
- **Tag**: `Testimonial`
- **Query / Path Parameters**:
  - `testimonial` (path, integer, **Required**)
- **Responses**:
  - `200`: `App.Http.Resources.Api.V1.Admin.TestimonialResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

### 4.12 Lead & Inquiries Management

#### `GET` `/admin/quote-requests`
- **Operation ID**: `v1.admin.quote-requests.index`
- **Tag**: `QuoteRequest`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `status` (query, `QuoteRequestStatus` | null, _Optional_)
  - `source_page` (query, string | null, _Optional_)
  - `created_from` (query, string | null, _Optional_)
  - `created_to` (query, string | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `QuoteRequestResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/quote-requests/{quoteRequest}`
- **Operation ID**: `v1.admin.quote-requests.show`
- **Tag**: `QuoteRequest`
- **Query / Path Parameters**:
  - `quoteRequest` (path, integer, **Required**)
- **Responses**:
  - `200`: `QuoteRequestResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PATCH` `/admin/quote-requests/{quoteRequest}`
- **Operation ID**: `v1.admin.quote-requests.update`
- **Tag**: `QuoteRequest`
- **Query / Path Parameters**:
  - `quoteRequest` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateQuoteRequest`
  - *Fields*:
    - `status`: `QuoteRequestStatus` (_Optional_)
    - `admin_notes`: string | null (_Optional_) — *max: 10000*
    - `first_name`: string (_Optional_)
    - `last_name`: string (_Optional_)
    - `phone`: string (_Optional_)
    - `country_code`: string (_Optional_)
    - `email`: string (_Optional_)
    - `city`: string (_Optional_)
    - `message`: string (_Optional_)
    - `source_page`: string (_Optional_)
    - `assigned_to`: string (_Optional_)
- **Responses**:
  - `200`: `QuoteRequestResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/newsletter-subscribers`
- **Operation ID**: `v1.admin.newsletter-subscribers.index`
- **Tag**: `NewsletterSubscriber`
- **Query / Path Parameters**:
  - `search` (query, string | null, _Optional_)
  - `status` (query, `NewsletterSubscriberStatus` | null, _Optional_)
  - `source_page` (query, string | null, _Optional_)
  - `created_from` (query, string | null, _Optional_)
  - `created_to` (query, string | null, _Optional_)
  - `sort` (query, string | null, _Optional_)
  - `page` (query, integer | null, _Optional_)
  - `per_page` (query, integer | null, _Optional_)
- **Responses**:
  - `200`: Paginated set of `NewsletterSubscriberResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `422`: Response → `ValidationException`

#### `GET` `/admin/newsletter-subscribers/{newsletterSubscriber}`
- **Operation ID**: `v1.admin.newsletter-subscribers.show`
- **Tag**: `NewsletterSubscriber`
- **Query / Path Parameters**:
  - `newsletterSubscriber` (path, integer, **Required**)
- **Responses**:
  - `200`: `NewsletterSubscriberResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`

#### `PATCH` `/admin/newsletter-subscribers/{newsletterSubscriber}`
- **Operation ID**: `v1.admin.newsletter-subscribers.update`
- **Tag**: `NewsletterSubscriber`
- **Query / Path Parameters**:
  - `newsletterSubscriber` (path, integer, **Required**)
- **Request Body**:
  - *Media Type*: `application/json`
  - *Schema*: `UpdateNewsletterSubscriberRequest`
  - *Fields*:
    - `status`: `NewsletterSubscriberStatus` (**Required**)
    - `email`: string (_Optional_)
    - `source_page`: string (_Optional_)
    - `subscribed_at`: string (_Optional_)
    - `unsubscribed_at`: string (_Optional_)
- **Responses**:
  - `200`: `NewsletterSubscriberResource` → object
  - `401`: Response → `AuthenticationException`
  - `403`: Response → `AuthorizationException`
  - `404`: Response → `NotFoundHttpException`
  - `422`: Response → `ValidationException`

---

## 5. Complete Schemas & Field Dictionary

### `AboutPageResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `intro_eyebrow`: string | null (**Required**)
- `intro_title`: string | null (**Required**)
- `intro_description`: string | null (**Required**)
- `featured_media_id`: integer | null (**Required**)
- `featured_media`: `MediaResource` | null (**Required**)
- `director_message_title`: string | null (**Required**)
- `director_message`: string | null (**Required**)
- `director_leadership_member_id`: integer | null (**Required**)
- `director_leadership_member`: `LeadershipMemberResource` | null (**Required**)
- `director_name`: string | null (**Required**)
- `director_designation`: string | null (**Required**)
- `mission`: string | null (**Required**)
- `vision`: string | null (**Required**)
- `purpose_title`: string | null (**Required**)
- `purpose_description`: string | null (**Required**)
- `purpose_media_id`: integer | null (**Required**)
- `purpose_media`: `MediaResource` | null (**Required**)
- `mission_title`: string | null (**Required**)
- `vision_title`: string | null (**Required**)
- `values_title`: string | null (**Required**)
- `mission_points`: Array<object> (**Required**)
  - *Item Object Structure:*
    - `id`: integer (**Required**)
    - `description`: string (**Required**)
    - `sort_order`: integer (**Required**)
- `testimonials_title`: string | null (**Required**)
- `testimonials_description`: string | null (**Required**)
- `quote_title`: string | null (**Required**)
- `quote_description`: string | null (**Required**)
- `quote_form_title`: string | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `AdminLoginResource`

**Type**: `object`

**Properties**:
- `user`: `AdminUserResource` (**Required**)
- `access_token`: string (**Required**)
- `token_type`: string (**Required**)
- `expires_at`: string (**Required**)

### `AdminSiteSettingsResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `company_name`: string (**Required**)
- `legal_name`: string | null (**Required**)
- `tagline`: string | null (**Required**)
- `short_description`: string | null (**Required**)
- `company_description`: string | null (**Required**)
- `website_url`: string | null (**Required**)
- `primary_email`: string | null (**Required**)
- `secondary_email`: string | null (**Required**)
- `primary_phone`: string | null (**Required**)
- `secondary_phone`: string | null (**Required**)
- `whatsapp_phone`: string | null (**Required**)
- `address_line_1`: string | null (**Required**)
- `address_line_2`: string | null (**Required**)
- `city`: string | null (**Required**)
- `state_or_region`: string | null (**Required**)
- `postal_code`: string | null (**Required**)
- `country`: string | null (**Required**)
- `business_hours_text`: string | null (**Required**)
- `latitude`: number | null (**Required**)
- `longitude`: number | null (**Required**)
- `map_embed_url`: string | null (**Required**)
- `footer_description`: string | null (**Required**)
- `newsletter_title`: string | null (**Required**)
- `newsletter_description`: string | null (**Required**)
- `copyright_text`: string | null (**Required**)
- `default_seo_title`: string | null (**Required**)
- `default_seo_description`: string | null (**Required**)
- `default_canonical_base_url`: string | null (**Required**)
- `logo_media_id`: integer | null (**Required**)
- `favicon_media_id`: integer | null (**Required**)
- `footer_media_id`: integer | null (**Required**)
- `default_og_image_media_id`: integer | null (**Required**)
- `media`: object (**Required**)
  - `logo`: `MediaResource` | null (**Required**)
  - `favicon`: `MediaResource` | null (**Required**)
  - `footer_image`: `MediaResource` | null (**Required**)
  - `default_og_image`: `MediaResource` | null (**Required**)
- `social_links`: Array<object> (**Required**)
  - *Item Object Structure:*
    - `id`: integer (**Required**)
    - `channel`: string (**Required**)
    - `label`: string (**Required**)
    - `url`: string (**Required**)
    - `icon_key`: string | null (**Required**)
    - `is_active`: boolean (**Required**)
    - `sort_order`: integer (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `AdminUserResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `name`: string (**Required**)
- `email`: string (**Required**)
- `is_active`: boolean (**Required**)
- `last_login_at`: string | null (**Required**)
- `roles`: Array<string> (**Required**)
- `permissions`: Array<string> (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.BlogCategoryResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `name`: string (**Required**)
- `slug`: string (**Required**)
- `description`: string | null (**Required**)
- `sort_order`: integer (**Required**)
- `status`: string (**Required**)
- `published_at`: string | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.BlogPostResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `excerpt`: string (**Required**)
- `featured_media_id`: integer | null (**Required**)
- `featured_media`: `MediaResource` | null (**Required**)
- `author_person_id`: integer | null (**Required**)
- `author`: `App.Http.Resources.Api.V1.Admin.PersonResource` | null (**Required**)
- `is_featured`: boolean (**Required**)
- `status`: string (**Required**)
- `publication_date`: string | null (**Required**)
- `reading_time_minutes`: integer | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `canonical_url`: string | null (**Required**)
- `og_media_id`: integer | null (**Required**)
- `og_media`: `MediaResource` | null (**Required**)
- `categories`: Array<`App.Http.Resources.Api.V1.Admin.BlogCategoryResource`> (**Required**)
- `content`: Array<`App.Http.Resources.Api.V1.Admin.ContentBlockResource`> (**Required**)
- `related_posts`: Array<`App.Http.Resources.Api.V1.Admin.BlogPostSummaryResource`> (_Optional_)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.BlogPostSummaryResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `excerpt`: string (**Required**)
- `featured_media`: `MediaResource` | null (**Required**)
- `status`: string (**Required**)
- `publication_date`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.CareerJobResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `department_id`: integer (**Required**)
- `department`: `App.Http.Resources.Api.V1.Admin.DepartmentResource` (**Required**)
- `employment_type`: string (**Required**)
- `work_mode`: string (**Required**)
- `experience_level`: string (**Required**)
- `location`: string (**Required**)
- `salary_min`: string | null (**Required**)
- `salary_max`: string | null (**Required**)
- `salary_currency`: string | null (**Required**)
- `salary_period`: string | null (**Required**)
- `description`: string (**Required**)
- `requirements`: string (**Required**)
- `responsibilities`: string (**Required**)
- `application_deadline`: string | null (**Required**)
- `opening_type`: string (**Required**)
- `status`: string (**Required**)
- `published_at`: string | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.CaseStudyResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_summary`: string (**Required**)
- `client`: string | null (**Required**)
- `industry`: string (**Required**)
- `project_statement`: string | null (**Required**)
- `featured_media_id`: integer | null (**Required**)
- `featured_media`: `MediaResource` | null (**Required**)
- `author_person_id`: integer | null (**Required**)
- `author`: `App.Http.Resources.Api.V1.Admin.PersonResource` | null (**Required**)
- `is_featured`: boolean (**Required**)
- `status`: string (**Required**)
- `publication_date`: string | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `canonical_url`: string | null (**Required**)
- `og_media_id`: integer | null (**Required**)
- `og_media`: `MediaResource` | null (**Required**)
- `tags`: Array<`App.Http.Resources.Api.V1.Admin.CaseStudyTagResource`> (**Required**)
- `services`: Array<`CaseStudyServiceResource`> (**Required**)
- `content`: Array<`App.Http.Resources.Api.V1.Admin.ContentBlockResource`> (**Required**)
- `related_case_studies`: Array<`App.Http.Resources.Api.V1.Admin.CaseStudySummaryResource`> (_Optional_)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.CaseStudySummaryResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_summary`: string (**Required**)
- `client`: string | null (**Required**)
- `industry`: string (**Required**)
- `featured_media`: `MediaResource` | null (**Required**)
- `author`: `App.Http.Resources.Api.V1.Admin.PersonResource` | null (**Required**)
- `status`: string (**Required**)
- `publication_date`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.CaseStudyTagResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `name`: string (**Required**)
- `slug`: string (**Required**)
- `description`: string | null (**Required**)
- `sort_order`: integer (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.ContentBlockResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `type`: string (**Required**)
- `payload`: Array<object> (**Required**)
- `media`: Array<`MediaResource`> (**Required**)
- `sort_order`: integer (**Required**)

### `App.Http.Resources.Api.V1.Admin.DepartmentResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `name`: string (**Required**)
- `slug`: string (**Required**)
- `description`: string | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_active`: boolean (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.PersonResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `name`: string (**Required**)
- `slug`: string (**Required**)
- `job_title`: string | null (**Required**)
- `organization`: string | null (**Required**)
- `bio`: string | null (**Required**)
- `experience_text`: string | null (**Required**)
- `avatar_media_id`: integer | null (**Required**)
- `avatar_media`: `MediaResource` | null (**Required**)
- `email`: string | null (**Required**)
- `linkedin_url`: string | null (**Required**)
- `person_type`: string (**Required**)
- `is_active`: boolean (**Required**)

### `App.Http.Resources.Api.V1.Admin.SectorResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_description`: string (**Required**)
- `full_description`: string | null (**Required**)
- `icon_media_id`: integer | null (**Required**)
- `featured_image_media_id`: integer | null (**Required**)
- `media`: object (**Required**)
  - `icon`: `MediaResource` | null (**Required**)
  - `featured_image`: `MediaResource` | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_featured`: boolean (**Required**)
- `is_active`: boolean (**Required**)
- `status`: string (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `published_at`: string | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.ServiceFeatureResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `description`: string | null (**Required**)
- `sort_order`: integer (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.ServiceResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_description`: string | null (**Required**)
- `full_description`: string | null (**Required**)
- `icon_media_id`: integer | null (**Required**)
- `featured_image_media_id`: integer | null (**Required**)
- `media`: object (**Required**)
  - `icon`: `MediaResource` | null (**Required**)
  - `featured_image`: `MediaResource` | null (**Required**)
- `features`: Array<`App.Http.Resources.Api.V1.Admin.ServiceFeatureResource`> (**Required**)
- `sort_order`: integer (**Required**)
- `is_featured`: boolean (**Required**)
- `is_active`: boolean (**Required**)
- `status`: string (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `published_at`: string | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.TestimonialResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `customer_name`: string (**Required**)
- `customer_role`: string | null (**Required**)
- `company`: string | null (**Required**)
- `department`: string | null (**Required**)
- `testimonial`: string (**Required**)
- `avatar_media_id`: integer | null (**Required**)
- `avatar`: `MediaResource` | null (**Required**)
- `rating`: integer | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_featured`: boolean (**Required**)
- `is_active`: boolean (**Required**)
- `status`: string (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `App.Http.Resources.Api.V1.Admin.WhyChooseUsItemResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `short_title`: string | null (**Required**)
- `description`: string (**Required**)
- `icon_media_id`: integer | null (**Required**)
- `icon`: `MediaResource` | null (**Required**)
- `metric_value`: string | null (**Required**)
- `metric_suffix`: string | null (**Required**)
- `cta_text`: string | null (**Required**)
- `cta_url`: string | null (**Required**)
- `is_featured`: boolean (**Required**)
- `sort_order`: integer (**Required**)
- `is_active`: boolean (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `BlogCategoryResource`

**Type**: `object`

**Properties**:
- `name`: string (**Required**)
- `slug`: string (**Required**)
- `description`: string | null (**Required**)
- `sort_order`: integer (**Required**)

### `BlogPageResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `hero_eyebrow`: string | null (**Required**)
- `hero_title`: string | null (**Required**)
- `hero_description`: string | null (**Required**)
- `detail_share_title`: string | null (**Required**)
- `related_posts_title`: string | null (**Required**)
- `quote_title`: string | null (**Required**)
- `quote_description`: string | null (**Required**)
- `quote_form_title`: string | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `BlogPostResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `excerpt`: string (**Required**)
- `featured_media`: `PublicMediaResource` | null (**Required**)
- `author`: `PersonResource` | null (**Required**)
- `categories`: Array<`BlogCategoryResource`> (**Required**)
- `is_featured`: boolean (**Required**)
- `publication_date`: string | null (**Required**)
- `reading_time_minutes`: integer | null (**Required**)
- `content`: Array<`ContentBlockResource`> (**Required**)
- `seo`: object (**Required**)
  - `title`: string | null (**Required**)
  - `description`: string | null (**Required**)
  - `canonical_url`: string | null (**Required**)
  - `og_media`: `PublicMediaResource` | null (**Required**)
- `related_posts`: Array<`BlogPostSummaryResource`> (_Optional_)

### `BlogPostSummaryResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `excerpt`: string (**Required**)
- `featured_media`: `PublicMediaResource` | null (**Required**)
- `author`: `PersonResource` | null (**Required**)
- `categories`: Array<`BlogCategoryResource`> (**Required**)
- `is_featured`: boolean (**Required**)
- `publication_date`: string | null (**Required**)
- `reading_time_minutes`: integer | null (**Required**)

### `BlogStatus`

**Enum Values**: `["draft", "published", "archived"]`

### `CareerJobResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `department`: `DepartmentResource` (**Required**)
- `employment_type`: string (**Required**)
- `work_mode`: string (**Required**)
- `experience_level`: string (**Required**)
- `location`: string (**Required**)
- `salary`: object (**Required**)
  - `min`: string | null (**Required**)
  - `max`: string | null (**Required**)
  - `currency`: string | null (**Required**)
  - `period`: string | null (**Required**)
- `application_deadline`: string | null (**Required**)
- `opening_type`: string (**Required**)
- `publication_date`: string | null (**Required**)
- `description`: string (**Required**)
- `requirements`: string (**Required**)
- `responsibilities`: string (**Required**)

### `CareerJobStatus`

**Enum Values**: `["draft", "published", "archived"]`

### `CareerJobSummaryResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `department`: `DepartmentResource` (**Required**)
- `employment_type`: string (**Required**)
- `work_mode`: string (**Required**)
- `experience_level`: string (**Required**)
- `location`: string (**Required**)
- `salary`: object (**Required**)
  - `min`: string | null (**Required**)
  - `max`: string | null (**Required**)
  - `currency`: string | null (**Required**)
  - `period`: string | null (**Required**)
- `application_deadline`: string | null (**Required**)
- `opening_type`: string (**Required**)
- `publication_date`: string | null (**Required**)

### `CareerPageResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `hero_eyebrow`: string | null (**Required**)
- `hero_title`: string | null (**Required**)
- `hero_description`: string | null (**Required**)
- `hero_media_id`: integer | null (**Required**)
- `hero_media`: `MediaResource` | null (**Required**)
- `testimonials_title`: string | null (**Required**)
- `testimonials_description`: string | null (**Required**)
- `current_openings_title`: string | null (**Required**)
- `current_openings_description`: string | null (**Required**)
- `internship_openings_title`: string | null (**Required**)
- `internship_openings_description`: string | null (**Required**)
- `quote_title`: string | null (**Required**)
- `quote_description`: string | null (**Required**)
- `quote_form_title`: string | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `testimonial_ids`: Array<integer | string> (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `CaseStudiesPageResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `hero_eyebrow`: string | null (**Required**)
- `hero_title`: string | null (**Required**)
- `hero_description`: string | null (**Required**)
- `detail_eyebrow`: string | null (**Required**)
- `detail_title`: string | null (**Required**)
- `quote_title`: string | null (**Required**)
- `quote_description`: string | null (**Required**)
- `quote_form_title`: string | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `CaseStudyResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_summary`: string (**Required**)
- `client`: string | null (**Required**)
- `industry`: string (**Required**)
- `featured_media`: `PublicMediaResource` | null (**Required**)
- `author`: `PersonResource` | null (**Required**)
- `tags`: Array<`CaseStudyTagResource`> (**Required**)
- `services`: Array<`ServiceSummaryResource`> (**Required**)
- `is_featured`: boolean (**Required**)
- `publication_date`: string | null (**Required**)
- `project_statement`: string | null (**Required**)
- `content`: Array<`ContentBlockResource`> (**Required**)
- `seo`: object (**Required**)
  - `title`: string | null (**Required**)
  - `description`: string | null (**Required**)
  - `canonical_url`: string | null (**Required**)
  - `og_media`: `PublicMediaResource` | null (**Required**)
- `related_case_studies`: Array<`CaseStudySummaryResource`> (_Optional_)

### `CaseStudyServiceResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_description`: string | null (**Required**)
- `icon`: `MediaResource` | null (**Required**)
- `sort_order`: string | null (**Required**)
- `is_active`: boolean (**Required**)
- `status`: string (**Required**)

### `CaseStudyStatus`

**Enum Values**: `["draft", "published", "archived"]`

### `CaseStudySummaryResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_summary`: string (**Required**)
- `client`: string | null (**Required**)
- `industry`: string (**Required**)
- `featured_media`: `PublicMediaResource` | null (**Required**)
- `author`: `PersonResource` | null (**Required**)
- `tags`: Array<`CaseStudyTagResource`> (**Required**)
- `services`: Array<`ServiceSummaryResource`> (**Required**)
- `is_featured`: boolean (**Required**)
- `publication_date`: string | null (**Required**)

### `CaseStudyTagResource`

**Type**: `object`

**Properties**:
- `name`: string (**Required**)
- `slug`: string (**Required**)
- `description`: string | null (**Required**)
- `sort_order`: integer (**Required**)

### `CompanyCapabilityFeatureResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `label`: string (**Required**)
- `sort_order`: integer (**Required**)

### `CompanyCapabilityResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `subtitle`: string | null (**Required**)
- `description`: string (**Required**)
- `icon_media_id`: integer | null (**Required**)
- `icon_media`: `MediaResource` | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_active`: boolean (**Required**)
- `features`: Array<`CompanyCapabilityFeatureResource`> (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `CompanyValueResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `description`: string | null (**Required**)
- `icon_media_id`: integer | null (**Required**)
- `icon_media`: `MediaResource` | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_active`: boolean (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `ContactPageResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `eyebrow`: string | null (**Required**)
- `title`: string | null (**Required**)
- `introduction`: string | null (**Required**)
- `quote_title`: string | null (**Required**)
- `quote_description`: string | null (**Required**)
- `quote_form_title`: string | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `ContentBlockResource`

**Type**: `object`

**Properties**:
- `type`: string (**Required**)
- `payload`: object | object | Array<object> (**Required**)
- `sort_order`: integer (**Required**)

### `CustomerExperiencePageResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `hero_eyebrow`: string | null (**Required**)
- `hero_title`: string | null (**Required**)
- `hero_description`: string | null (**Required**)
- `quote_title`: string | null (**Required**)
- `quote_description`: string | null (**Required**)
- `quote_form_title`: string | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `testimonial_ids`: Array<integer | string> (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `DepartmentResource`

**Type**: `object`

**Properties**:
- `name`: string (**Required**)
- `slug`: string (**Required**)

### `ExpertisePageResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `hero_eyebrow`: string | null (**Required**)
- `hero_title`: string | null (**Required**)
- `hero_description`: string | null (**Required**)
- `technical_team_title`: string | null (**Required**)
- `technical_team_description`: string | null (**Required**)
- `technological_expertise_title`: string | null (**Required**)
- `technological_expertise_description`: string | null (**Required**)
- `capabilities_title`: string | null (**Required**)
- `capabilities_description`: string | null (**Required**)
- `quote_title`: string | null (**Required**)
- `quote_description`: string | null (**Required**)
- `quote_form_title`: string | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `ExpertiseRoleResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `title`: string (**Required**)
- `description`: string (**Required**)
- `stack_label`: string | null (**Required**)
- `icon_media_id`: integer (**Required**)
- `icon_media`: `MediaResource` (**Required**)
- `sort_order`: integer (**Required**)
- `is_active`: boolean (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `HealthResource`

**Type**: `object`

**Properties**:
- `status`: string (**Required**)

### `HomePageResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `hero_eyebrow`: string | null (**Required**)
- `hero_title`: string | null (**Required**)
- `hero_description`: string | null (**Required**)
- `hero_media_id`: integer | null (**Required**)
- `hero_media`: `MediaResource` | null (**Required**)
- `review_rating`: string | null (**Required**)
- `review_count`: integer | null (**Required**)
- `review_label`: string | null (**Required**)
- `primary_cta_text`: string | null (**Required**)
- `primary_cta_url`: string | null (**Required**)
- `secondary_cta_text`: string | null (**Required**)
- `secondary_cta_url`: string | null (**Required**)
- `services_eyebrow`: string | null (**Required**)
- `services_title`: string | null (**Required**)
- `sectors_eyebrow`: string | null (**Required**)
- `sectors_title`: string | null (**Required**)
- `why_choose_us_eyebrow`: string | null (**Required**)
- `why_choose_us_title`: string | null (**Required**)
- `why_choose_us_cta_text`: string | null (**Required**)
- `why_choose_us_cta_url`: string | null (**Required**)
- `quote_title`: string | null (**Required**)
- `quote_description`: string | null (**Required**)
- `quote_form_title`: string | null (**Required**)
- `hero_steps`: Array<object> (**Required**)
  - *Item Object Structure:*
    - `id`: integer (**Required**)
    - `label`: string (**Required**)
    - `sort_order`: integer (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `JobApplicationResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `reference`: string (**Required**)
- `job`: `App.Http.Resources.Api.V1.Admin.CareerJobResource` (**Required**)
- `applicant_name`: string (**Required**)
- `email`: string (**Required**)
- `phone`: string (**Required**)
- `cover_letter`: string | null (**Required**)
- `status`: string (**Required**)
- `resume`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `JobApplicationStatus`

**Enum Values**: `["new", "reviewing", "shortlisted", "rejected", "hired"]`

### `LeadershipMemberResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `full_name`: string (**Required**)
- `designation`: string (**Required**)
- `short_bio`: string (**Required**)
- `full_bio`: string | null (**Required**)
- `profile_media_id`: integer | null (**Required**)
- `profile_media`: `MediaResource` | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_active`: boolean (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `LoginRequest`

**Type**: `object`

**Properties**:
- `email`: string (email) (**Required**) — *max: 254, format: email*
- `password`: string (**Required**) — *max: 255*
- `device_name`: string (_Optional_) — *max: 100*

### `MediaResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `uuid`: string (**Required**)
- `url`: null (**Required**)
- `original_name`: string (**Required**)
- `filename`: string (**Required**)
- `extension`: string (**Required**)
- `mime_type`: string (**Required**)
- `size_bytes`: integer (**Required**)
- `width`: integer | null (**Required**)
- `height`: integer | null (**Required**)
- `alt_text`: string | null (**Required**)
- `title`: string | null (**Required**)
- `caption`: string | null (**Required**)
- `visibility`: string (**Required**)
- `uploader`: object | null (_Optional_)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `MetricResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `value`: string (**Required**)
- `prefix`: string | null (**Required**)
- `suffix`: string | null (**Required**)
- `label`: string (**Required**)
- `description`: string | null (**Required**)
- `icon_media_id`: integer | null (**Required**)
- `icon_media`: `MediaResource` | null (**Required**)
- `is_active`: boolean (**Required**)
- `sort_order`: integer (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `NewsletterSubscriberResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `email`: string (**Required**)
- `status`: string (**Required**)
- `source_page`: string | null (**Required**)
- `subscribed_at`: string | null (**Required**)
- `unsubscribed_at`: string | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `NewsletterSubscriberStatus`

**Enum Values**: `["subscribed", "unsubscribed", "suppressed"]`

### `OpeningType`

**Enum Values**: `["job", "internship"]`

### `Permission`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `name`: string (**Required**)
- `resource`: string (**Required**)
- `action`: string (**Required**)
- `description`: string | null (**Required**)
- `created_at`: string | null (**Required**) — *format: date-time*
- `updated_at`: string | null (**Required**) — *format: date-time*

### `PermissionResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `name`: string (**Required**)
- `resource`: `Permission` (**Required**)
- `action`: string (**Required**)
- `description`: string | null (**Required**)

### `PersonResource`

**Type**: `object`

**Properties**:
- `name`: string (**Required**)
- `slug`: string (**Required**)
- `job_title`: string | null (**Required**)
- `organization`: string | null (**Required**)
- `bio`: string | null (**Required**)
- `avatar`: `PublicMediaResource` | null (**Required**)
- `linkedin_url`: string | null (**Required**)

### `ProductServicesPageResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `key`: string (**Required**)
- `eyebrow`: string | null (**Required**)
- `title`: string | null (**Required**)
- `services_tab_label`: string | null (**Required**)
- `products_tab_label`: string | null (**Required**)
- `services_introduction`: string | null (**Required**)
- `service_cta_text`: string | null (**Required**)
- `service_cta_url`: string | null (**Required**)
- `quote_title`: string | null (**Required**)
- `quote_description`: string | null (**Required**)
- `quote_form_title`: string | null (**Required**)
- `seo_title`: string | null (**Required**)
- `seo_description`: string | null (**Required**)
- `updated_by`: object | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `PublicMediaResource`

**Type**: `object`

**Properties**:
- `uuid`: string (**Required**)
- `url`: null (**Required**)
- `mime_type`: string (**Required**)
- `width`: integer | null (**Required**)
- `height`: integer | null (**Required**)
- `alt_text`: string | null (**Required**)
- `title`: string | null (**Required**)
- `caption`: string | null (**Required**)

### `PublicSiteSettingsResource`

**Type**: `object`

**Properties**:
- `company`: object (**Required**)
  - `name`: string (**Required**)
  - `legal_name`: string | null (**Required**)
  - `tagline`: string | null (**Required**)
  - `short_description`: string | null (**Required**)
  - `description`: string | null (**Required**)
  - `website_url`: string | null (**Required**)
- `branding`: object (**Required**)
  - `logo`: `PublicMediaResource` | null (**Required**)
  - `favicon`: `PublicMediaResource` | null (**Required**)
  - `footer_image`: `PublicMediaResource` | null (**Required**)
- `contact`: object (**Required**)
  - `primary_email`: string | null (**Required**)
  - `secondary_email`: string | null (**Required**)
  - `primary_phone`: string | null (**Required**)
  - `secondary_phone`: string | null (**Required**)
  - `whatsapp_phone`: string | null (**Required**)
  - `address`: object (**Required**)
    - `line_1`: string | null (**Required**)
    - `line_2`: string | null (**Required**)
    - `city`: string | null (**Required**)
    - `state_or_region`: string | null (**Required**)
    - `postal_code`: string | null (**Required**)
    - `country`: string | null (**Required**)
  - `business_hours`: string | null (**Required**)
  - `map`: object (**Required**)
    - `latitude`: number | null (**Required**)
    - `longitude`: number | null (**Required**)
    - `embed_url`: string | null (**Required**)
- `social`: object (**Required**)
  - `links`: Array<object> (**Required**)
    - *Item Object Structure:*
      - `channel`: string (**Required**)
      - `label`: string (**Required**)
      - `url`: string (**Required**)
      - `icon_key`: string | null (**Required**)
- `footer`: object (**Required**)
  - `description`: string | null (**Required**)
  - `newsletter`: object (**Required**)
    - `title`: string | null (**Required**)
    - `description`: string | null (**Required**)
  - `copyright`: string | null (**Required**)
- `seo`: object (**Required**)
  - `default_title`: string | null (**Required**)
  - `default_description`: string | null (**Required**)
  - `default_og_image`: `PublicMediaResource` | null (**Required**)
  - `canonical_base_url`: string | null (**Required**)

### `PublishBlogCategoryRequest`

**Type**: `object`

**Properties**:
- `published_at`: string | null (_Optional_) — *format: date-time*
- `id`: string (_Optional_)
- `status`: string (_Optional_)

### `PublishBlogPostRequest`

**Type**: `object`

**Properties**:
- `published_at`: string | null (_Optional_) — *format: date-time*
- `id`: string (_Optional_)
- `status`: string (_Optional_)

### `PublishCareerJobRequest`

**Type**: `object`

**Properties**:
- `published_at`: string | null (_Optional_) — *format: date-time*
- `id`: string (_Optional_)
- `status`: string (_Optional_)

### `PublishCaseStudyRequest`

**Type**: `object`

**Properties**:
- `published_at`: string | null (_Optional_) — *format: date-time*
- `id`: string (_Optional_)
- `status`: string (_Optional_)

### `PublishSectorRequest`

**Type**: `object`

**Properties**:
- `published_at`: string | null (_Optional_) — *format: date-time*
- `id`: string (_Optional_)
- `status`: string (_Optional_)

### `PublishServiceRequest`

**Type**: `object`

**Properties**:
- `published_at`: string | null (_Optional_) — *format: date-time*
- `id`: string (_Optional_)
- `status`: string (_Optional_)

### `QuoteRequestResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `reference`: string (**Required**)
- `first_name`: string (**Required**)
- `last_name`: string (**Required**)
- `phone`: string (**Required**)
- `country_code`: string | null (**Required**)
- `email`: string | null (**Required**)
- `city`: string | null (**Required**)
- `message`: string (**Required**)
- `source_page`: string (**Required**)
- `status`: string (**Required**)
- `admin_notes`: string | null (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `QuoteRequestStatus`

**Enum Values**: `["new", "contacted", "qualified", "closed", "spam"]`

### `RoleResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `name`: string (**Required**)
- `slug`: string (**Required**)
- `description`: string | null (**Required**)
- `is_system`: boolean (**Required**)
- `permissions`: Array<string> (**Required**)

### `SectorResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_description`: string (**Required**)
- `icon`: `PublicMediaResource` | null (**Required**)
- `featured_image`: `PublicMediaResource` | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_featured`: boolean (**Required**)
- `full_description`: string | null (**Required**)
- `seo`: object (**Required**)
  - `title`: string | null (**Required**)
  - `description`: string | null (**Required**)
- `published_at`: string | null (**Required**)

### `SectorStatus`

**Enum Values**: `["draft", "published", "archived"]`

### `SectorSummaryResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_description`: string (**Required**)
- `icon`: `PublicMediaResource` | null (**Required**)
- `featured_image`: `PublicMediaResource` | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_featured`: boolean (**Required**)

### `ServiceFeatureResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `description`: string | null (**Required**)
- `sort_order`: integer (**Required**)

### `ServiceResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_description`: string | null (**Required**)
- `icon`: `PublicMediaResource` | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_featured`: boolean (**Required**)
- `full_description`: string | null (**Required**)
- `featured_image`: `PublicMediaResource` | null (**Required**)
- `features`: Array<`ServiceFeatureResource`> (**Required**)
- `seo`: object (**Required**)
  - `title`: string | null (**Required**)
  - `description`: string | null (**Required**)
- `published_at`: string | null (**Required**)

### `ServiceStatus`

**Enum Values**: `["draft", "published", "archived"]`

### `ServiceSummaryResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `slug`: string (**Required**)
- `short_description`: string | null (**Required**)
- `icon`: `PublicMediaResource` | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_featured`: boolean (**Required**)

### `StandardErrorResponse`

**Type**: `object`

**Properties**:
- `error`: object (**Required**)
  - `code`: string (**Required**)
  - `message`: string (**Required**)
  - `fields`: object (_Optional_)
- `request_id`: string (**Required**)

### `StandardSuccessResponse`

**Type**: `object`

**Properties**:
- `data`: object (**Required**)
- `meta`: object (_Optional_)

### `StoreBlogCategoryRequest`

**Type**: `object`

**Properties**:
- `name`: string (**Required**) — *max: 200*
- `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `description`: string | null (_Optional_) — *max: 5000*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `StoreBlogPostRequest`

**Type**: `object`

**Properties**:
- `title`: string (**Required**) — *max: 255*
- `slug`: string (**Required**) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `excerpt`: string (**Required**) — *max: 5000*
- `featured_media_id`: integer | null (_Optional_)
- `author_person_id`: integer | null (_Optional_)
- `is_featured`: boolean (_Optional_)
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
- `og_media_id`: integer | null (_Optional_)
- `category_ids`: Array<integer> (_Optional_)
- `related_post_ids`: Array<integer> (_Optional_)
- `blocks`: string (_Optional_)
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)
- `reading_time_minutes`: string (_Optional_)

### `StoreCareerJobRequest`

**Type**: `object`

**Properties**:
- `department_id`: integer (**Required**)
- `title`: string (**Required**) — *max: 255*
- `slug`: string (**Required**) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `employment_type`: enum ("full-time", "part-time", "contract", "temporary") (**Required**) — *values: ["full-time", "part-time", "contract", "temporary"]*
- `work_mode`: `WorkMode` (**Required**)
- `experience_level`: string (**Required**) — *max: 100*
- `location`: string (**Required**) — *max: 255*
- `salary_min`: number | null (_Optional_) — *minVal: 0*
- `salary_max`: number | null (_Optional_) — *minVal: 0*
- `salary_currency`: string | null (_Optional_) — *max: 3, min: 3, pattern: `^[A-Z]{3}$`*
- `salary_period`: string | null (_Optional_) — *values: ["hour", "month", "year", null]*
- `description`: string (**Required**) — *max: 50000*
- `requirements`: string (**Required**) — *max: 50000*
- `responsibilities`: string (**Required**) — *max: 50000*
- `application_deadline`: string | null (_Optional_) — *format: date-time*
- `opening_type`: `OpeningType` (**Required**)
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `StoreCaseStudyRequest`

**Type**: `object`

**Properties**:
- `title`: string (**Required**) — *max: 255*
- `slug`: string (**Required**) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `short_summary`: string (**Required**) — *max: 5000*
- `client`: string | null (_Optional_) — *max: 255*
- `industry`: string (**Required**) — *max: 200*
- `project_statement`: string | null (_Optional_) — *max: 10000*
- `featured_media_id`: integer | null (_Optional_)
- `is_featured`: boolean (_Optional_)
- `author_person_id`: integer | null (_Optional_)
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
- `og_media_id`: integer | null (_Optional_)
- `tag_ids`: Array<integer> (_Optional_)
- `service_ids`: Array<integer> (_Optional_)
- `related_case_study_ids`: Array<integer> (_Optional_)
- `blocks`: string (_Optional_)
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `StoreCaseStudyTagRequest`

**Type**: `object`

**Properties**:
- `name`: string (**Required**) — *max: 200*
- `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `description`: string | null (_Optional_) — *max: 5000*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `id`: string (_Optional_)

### `StoreCompanyCapabilityRequest`

**Type**: `object`

**Properties**:
- `title`: string (**Required**) — *max: 200*
- `subtitle`: string | null (_Optional_) — *max: 500*
- `description`: string (**Required**) — *max: 10000*
- `icon_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `features`: Array<object> (_Optional_)
  - *Item Object Structure:*
    - `label`: string (**Required**) — *max: 500*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- `id`: string (_Optional_)

### `StoreCompanyValueRequest`

**Type**: `object`

**Properties**:
- `title`: string (**Required**) — *max: 200*
- `description`: string | null (_Optional_) — *max: 5000*
- `icon_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)
- `about_page_id`: string (_Optional_)

### `StoreDepartmentRequest`

**Type**: `object`

**Properties**:
- `name`: string (**Required**) — *max: 200*
- `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `description`: string | null (_Optional_) — *max: 5000*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `StoreExpertiseRoleRequest`

**Type**: `object`

**Properties**:
- `title`: string (**Required**) — *max: 200*
- `icon_media_id`: integer (**Required**)
- `description`: string (**Required**) — *max: 10000*
- `stack_label`: string | null (_Optional_) — *max: 255*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `StoreJobApplicationRequest`

**Type**: `object`

**Properties**:
- `applicant_name`: string (**Required**) — *max: 200*
- `email`: string (email) (**Required**) — *max: 320, format: email*
- `phone`: string (**Required**) — *max: 50, pattern: `^[0-9+()\-\.\s]{7,50}$`*
- `resume`: string (binary) (**Required**) — *format: binary, Maximum file size: 5120 kilobytes.*
- `cover_letter`: string | null (_Optional_) — *max: 10000*
- `job_id`: string (_Optional_)
- `status`: string (_Optional_)

### `StoreLeadershipMemberRequest`

**Type**: `object`

**Properties**:
- `full_name`: string (**Required**) — *max: 200*
- `designation`: string (**Required**) — *max: 200*
- `short_bio`: string (**Required**) — *max: 5000*
- `full_bio`: string | null (_Optional_) — *max: 50000*
- `profile_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `StoreMediaRequest`

**Type**: `object`

**Properties**:
- `file`: string (binary) (**Required**) — *format: binary, Maximum file size: 10240 kilobytes.*
- `alt_text`: string | null (_Optional_) — *max: 500*
- `title`: string | null (_Optional_) — *max: 500*
- `caption`: string | null (_Optional_) — *max: 5000*

### `StoreMetricRequest`

**Type**: `object`

**Properties**:
- `key`: string (**Required**) — *max: 100, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `value`: string (**Required**) — *max: 100*
- `prefix`: string | null (_Optional_) — *max: 30*
- `suffix`: string | null (_Optional_) — *max: 30*
- `label`: string (**Required**) — *max: 150*
- `description`: string | null (_Optional_) — *max: 2000*
- `icon_media_id`: integer | null (_Optional_)
- `is_active`: boolean (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `id`: string (_Optional_)

### `StoreQuoteRequest`

**Type**: `object`

**Properties**:
- `first_name`: string (**Required**) — *max: 100*
- `last_name`: string (**Required**) — *max: 100*
- `phone`: string (**Required**) — *max: 50, pattern: `^[0-9+()\-.\s]{7,50}$`*
- `country_code`: string | null (_Optional_) — *max: 10, pattern: `^\+[0-9]{1,4}$`*
- `email`: string | null (_Optional_) — *max: 320, format: email*
- `city`: string | null (_Optional_) — *max: 150*
- `message`: string (**Required**) — *max: 5000*
- `source_page`: string (**Required**) — *max: 100, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `website`: string | null (_Optional_) — *max: 255*
- `status`: string (_Optional_)
- `admin_notes`: string (_Optional_)
- `assigned_to`: string (_Optional_)

### `StoreSectorRequest`

**Type**: `object`

**Properties**:
- `title`: string (**Required**) — *max: 200*
- `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `short_description`: string (**Required**) — *max: 1000*
- `full_description`: string | null (_Optional_) — *max: 100000*
- `icon_media_id`: integer | null (_Optional_)
- `featured_image_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_featured`: boolean (_Optional_)
- `is_active`: boolean (_Optional_)
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `StoreServiceRequest`

**Type**: `object`

**Properties**:
- `title`: string (**Required**) — *max: 200*
- `slug`: string (**Required**) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `short_description`: string | null (_Optional_) — *max: 1000*
- `full_description`: string | null (_Optional_) — *max: 100000*
- `icon_media_id`: integer | null (_Optional_)
- `featured_image_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_featured`: boolean (_Optional_)
- `is_active`: boolean (_Optional_)
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `features`: Array<object> (_Optional_)
  - *Item Object Structure:*
    - `title`: string (**Required**) — *max: 200*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `StoreTechnologyCategoryRequest`

**Type**: `object`

**Properties**:
- `name`: string (**Required**) — *max: 200*
- `icon_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `StoreTechnologyRequest`

**Type**: `object`

**Properties**:
- `technology_category_id`: integer (**Required**)
- `name`: string (**Required**) — *max: 200*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `StoreTestimonialRequest`

**Type**: `object`

**Properties**:
- `customer_name`: string (**Required**) — *max: 200*
- `customer_role`: string | null (_Optional_) — *max: 200*
- `company`: string | null (_Optional_) — *max: 200*
- `department`: string | null (_Optional_) — *max: 200*
- `testimonial`: string (**Required**) — *max: 10000*
- `avatar_media_id`: integer | null (_Optional_)
- `rating`: integer | null (_Optional_) — *minVal: 1, maxVal: 5*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_featured`: boolean (_Optional_)
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)
- `status`: string (_Optional_)

### `StoreWhyChooseUsItemRequest`

**Type**: `object`

**Properties**:
- `title`: string (**Required**) — *max: 200*
- `short_title`: string | null (_Optional_) — *max: 100*
- `description`: string (**Required**) — *max: 10000*
- `icon_media_id`: integer | null (_Optional_)
- `metric_value`: string | null (_Optional_) — *max: 50*
- `metric_suffix`: string | null (_Optional_) — *max: 30*
- `cta_text`: string | null (_Optional_) — *max: 150*
- `cta_url`: string | null (_Optional_) — *max: 2048*
- `is_featured`: boolean (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `SubscribeNewsletterRequest`

**Type**: `object`

**Properties**:
- `email`: string (email) (**Required**) — *max: 320, format: email*
- `source_page`: string | null (_Optional_) — *max: 100, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `website`: string | null (_Optional_) — *max: 255*
- `status`: string (_Optional_)
- `subscribed_at`: string (_Optional_)
- `unsubscribed_at`: string (_Optional_)

### `SyncRolePermissionsRequest`

**Type**: `object`

**Properties**:
- `permissions`: Array<integer> (**Required**)

### `SyncUserRolesRequest`

**Type**: `object`

**Properties**:
- `roles`: Array<integer> (**Required**)

### `TechnologyCategoryResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `name`: string (**Required**)
- `icon_media_id`: integer | null (**Required**)
- `icon_media`: `MediaResource` | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_active`: boolean (**Required**)
- `technologies`: Array<`TechnologyResource`> (_Optional_)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `TechnologyResource`

**Type**: `object`

**Properties**:
- `id`: integer (**Required**)
- `technology_category_id`: integer (**Required**)
- `technology_category`: object (_Optional_)
  - `id`: integer (**Required**)
  - `name`: string (**Required**)
- `name`: string (**Required**)
- `sort_order`: integer (**Required**)
- `is_active`: boolean (**Required**)
- `created_at`: string | null (**Required**)
- `updated_at`: string | null (**Required**)

### `TestimonialResource`

**Type**: `object`

**Properties**:
- `customer_name`: string (**Required**)
- `customer_role`: string | null (**Required**)
- `company`: string | null (**Required**)
- `department`: string | null (**Required**)
- `testimonial`: string (**Required**)
- `avatar`: `PublicMediaResource` | null (**Required**)
- `rating`: integer | null (**Required**)
- `sort_order`: integer (**Required**)
- `is_featured`: boolean (**Required**)

### `TestimonialStatus`

**Enum Values**: `["draft", "published", "archived"]`

### `UpdateAboutPageRequest`

**Type**: `object`

**Properties**:
- `intro_eyebrow`: string | null (_Optional_) — *max: 255*
- `intro_title`: string | null (_Optional_) — *max: 255*
- `intro_description`: string | null (_Optional_) — *max: 50000*
- `featured_media_id`: integer | null (_Optional_)
- `director_message_title`: string | null (_Optional_) — *max: 255*
- `director_message`: string | null (_Optional_) — *max: 50000*
- `director_leadership_member_id`: integer | null (_Optional_)
- `director_name`: string | null (_Optional_) — *max: 200*
- `director_designation`: string | null (_Optional_) — *max: 200*
- `mission`: string | null (_Optional_) — *max: 50000*
- `vision`: string | null (_Optional_) — *max: 50000*
- `purpose_title`: string | null (_Optional_) — *max: 500*
- `purpose_description`: string | null (_Optional_) — *max: 5000*
- `purpose_media_id`: integer | null (_Optional_)
- `mission_title`: string | null (_Optional_) — *max: 500*
- `vision_title`: string | null (_Optional_) — *max: 500*
- `values_title`: string | null (_Optional_) — *max: 500*
- `testimonials_title`: string | null (_Optional_) — *max: 500*
- `testimonials_description`: string | null (_Optional_) — *max: 5000*
- `quote_title`: string | null (_Optional_) — *max: 500*
- `quote_description`: string | null (_Optional_) — *max: 5000*
- `quote_form_title`: string | null (_Optional_) — *max: 255*
- `mission_points`: Array<object> (_Optional_)
  - *Item Object Structure:*
    - `description`: string (**Required**) — *max: 5000*
    - `sort_order`: integer (**Required**) — *minVal: 0, maxVal: 100000*
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)

### `UpdateBlogCategoryRequest`

**Type**: `object`

**Properties**:
- `name`: string (_Optional_) — *max: 200*
- `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `description`: string | null (_Optional_) — *max: 5000*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `UpdateBlogPageRequest`

**Type**: `object`

**Properties**:
- `hero_eyebrow`: string | null (_Optional_) — *max: 255*
- `hero_title`: string | null (_Optional_) — *max: 500*
- `hero_description`: string | null (_Optional_) — *max: 5000*
- `detail_share_title`: string | null (_Optional_) — *max: 255*
- `related_posts_title`: string | null (_Optional_) — *max: 500*
- `quote_title`: string | null (_Optional_) — *max: 500*
- `quote_description`: string | null (_Optional_) — *max: 5000*
- `quote_form_title`: string | null (_Optional_) — *max: 255*
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)

### `UpdateBlogPostRequest`

**Type**: `object`

**Properties**:
- `title`: string (_Optional_) — *max: 255*
- `slug`: string (_Optional_) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `excerpt`: string (_Optional_) — *max: 5000*
- `featured_media_id`: integer | null (_Optional_)
- `author_person_id`: integer | null (_Optional_)
- `is_featured`: boolean (_Optional_)
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
- `og_media_id`: integer | null (_Optional_)
- `category_ids`: Array<integer> (_Optional_)
- `related_post_ids`: Array<integer> (_Optional_)
- `blocks`: string (_Optional_)
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)
- `reading_time_minutes`: string (_Optional_)

### `UpdateCareerJobRequest`

**Type**: `object`

**Properties**:
- `department_id`: integer (_Optional_)
- `title`: string (_Optional_) — *max: 255*
- `slug`: string (_Optional_) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `employment_type`: enum ("full-time", "part-time", "contract", "temporary") (_Optional_) — *values: ["full-time", "part-time", "contract", "temporary"]*
- `work_mode`: `WorkMode` (_Optional_)
- `experience_level`: string (_Optional_) — *max: 100*
- `location`: string (_Optional_) — *max: 255*
- `salary_min`: number | null (_Optional_) — *minVal: 0*
- `salary_max`: number | null (_Optional_) — *minVal: 0*
- `salary_currency`: string | null (_Optional_) — *max: 3, min: 3, pattern: `^[A-Z]{3}$`*
- `salary_period`: string | null (_Optional_) — *values: ["hour", "month", "year", null]*
- `description`: string (_Optional_) — *max: 50000*
- `requirements`: string (_Optional_) — *max: 50000*
- `responsibilities`: string (_Optional_) — *max: 50000*
- `application_deadline`: string | null (_Optional_) — *format: date-time*
- `opening_type`: `OpeningType` (_Optional_)
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `UpdateCareerPageRequest`

**Type**: `object`

**Properties**:
- `hero_eyebrow`: string | null (_Optional_) — *max: 255*
- `hero_title`: string | null (_Optional_) — *max: 500*
- `hero_description`: string | null (_Optional_) — *max: 5000*
- `hero_media_id`: integer | null (_Optional_)
- `testimonials_title`: string | null (_Optional_) — *max: 500*
- `testimonials_description`: string | null (_Optional_) — *max: 5000*
- `current_openings_title`: string | null (_Optional_) — *max: 500*
- `current_openings_description`: string | null (_Optional_) — *max: 5000*
- `internship_openings_title`: string | null (_Optional_) — *max: 500*
- `internship_openings_description`: string | null (_Optional_) — *max: 5000*
- `quote_title`: string | null (_Optional_) — *max: 500*
- `quote_description`: string | null (_Optional_) — *max: 5000*
- `quote_form_title`: string | null (_Optional_) — *max: 255*
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `testimonial_ids`: Array<integer> (_Optional_)
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)

### `UpdateCaseStudiesPageRequest`

**Type**: `object`

**Properties**:
- `hero_eyebrow`: string | null (_Optional_) — *max: 255*
- `hero_title`: string | null (_Optional_) — *max: 500*
- `hero_description`: string | null (_Optional_) — *max: 5000*
- `detail_eyebrow`: string | null (_Optional_) — *max: 255*
- `detail_title`: string | null (_Optional_) — *max: 500*
- `quote_title`: string | null (_Optional_) — *max: 500*
- `quote_description`: string | null (_Optional_) — *max: 5000*
- `quote_form_title`: string | null (_Optional_) — *max: 255*
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)

### `UpdateCaseStudyRequest`

**Type**: `object`

**Properties**:
- `title`: string (_Optional_) — *max: 255*
- `slug`: string (_Optional_) — *max: 255, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `short_summary`: string (_Optional_) — *max: 5000*
- `client`: string | null (_Optional_) — *max: 255*
- `industry`: string (_Optional_) — *max: 200*
- `project_statement`: string | null (_Optional_) — *max: 10000*
- `featured_media_id`: integer | null (_Optional_)
- `is_featured`: boolean (_Optional_)
- `author_person_id`: integer | null (_Optional_)
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `canonical_url`: string | null (_Optional_) — *max: 2048, format: uri*
- `og_media_id`: integer | null (_Optional_)
- `tag_ids`: Array<integer> (_Optional_)
- `service_ids`: Array<integer> (_Optional_)
- `related_case_study_ids`: Array<integer> (_Optional_)
- `blocks`: string (_Optional_)
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `UpdateCaseStudyTagRequest`

**Type**: `object`

**Properties**:
- `name`: string (_Optional_) — *max: 200*
- `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `description`: string | null (_Optional_) — *max: 5000*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `id`: string (_Optional_)

### `UpdateCompanyCapabilityRequest`

**Type**: `object`

**Properties**:
- `title`: string (_Optional_) — *max: 200*
- `subtitle`: string | null (_Optional_) — *max: 500*
- `description`: string (_Optional_) — *max: 10000*
- `icon_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `features`: Array<object> (_Optional_)
  - *Item Object Structure:*
    - `label`: string (**Required**) — *max: 500*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- `id`: string (_Optional_)

### `UpdateCompanyValueRequest`

**Type**: `object`

**Properties**:
- `title`: string (_Optional_) — *max: 200*
- `description`: string | null (_Optional_) — *max: 5000*
- `icon_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)
- `about_page_id`: string (_Optional_)

### `UpdateContactPageRequest`

**Type**: `object`

**Properties**:
- `eyebrow`: string | null (_Optional_) — *max: 255*
- `title`: string | null (_Optional_) — *max: 255*
- `introduction`: string | null (_Optional_) — *max: 5000*
- `quote_title`: string | null (_Optional_) — *max: 255*
- `quote_description`: string | null (_Optional_) — *max: 5000*
- `quote_form_title`: string | null (_Optional_) — *max: 255*
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)

### `UpdateCustomerExperiencePageRequest`

**Type**: `object`

**Properties**:
- `hero_eyebrow`: string | null (_Optional_) — *max: 255*
- `hero_title`: string | null (_Optional_) — *max: 500*
- `hero_description`: string | null (_Optional_) — *max: 5000*
- `quote_title`: string | null (_Optional_) — *max: 500*
- `quote_description`: string | null (_Optional_) — *max: 5000*
- `quote_form_title`: string | null (_Optional_) — *max: 255*
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `testimonial_ids`: Array<integer> (_Optional_)
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)

### `UpdateDepartmentRequest`

**Type**: `object`

**Properties**:
- `name`: string (_Optional_) — *max: 200*
- `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `description`: string | null (_Optional_) — *max: 5000*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `UpdateExpertisePageRequest`

**Type**: `object`

**Properties**:
- `hero_eyebrow`: string | null (_Optional_) — *max: 255*
- `hero_title`: string | null (_Optional_) — *max: 500*
- `hero_description`: string | null (_Optional_) — *max: 5000*
- `technical_team_title`: string | null (_Optional_) — *max: 500*
- `technical_team_description`: string | null (_Optional_) — *max: 5000*
- `technological_expertise_title`: string | null (_Optional_) — *max: 500*
- `technological_expertise_description`: string | null (_Optional_) — *max: 5000*
- `capabilities_title`: string | null (_Optional_) — *max: 2000*
- `capabilities_description`: string | null (_Optional_) — *max: 5000*
- `quote_title`: string | null (_Optional_) — *max: 500*
- `quote_description`: string | null (_Optional_) — *max: 5000*
- `quote_form_title`: string | null (_Optional_) — *max: 255*
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)

### `UpdateExpertiseRoleRequest`

**Type**: `object`

**Properties**:
- `title`: string (_Optional_) — *max: 200*
- `icon_media_id`: integer (_Optional_)
- `description`: string (_Optional_) — *max: 10000*
- `stack_label`: string | null (_Optional_) — *max: 255*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `UpdateHomePageRequest`

**Type**: `object`

**Properties**:
- `hero_eyebrow`: string | null (_Optional_) — *max: 255*
- `hero_title`: string | null (_Optional_) — *max: 255*
- `hero_description`: string | null (_Optional_) — *max: 5000*
- `hero_media_id`: integer | null (_Optional_)
- `review_rating`: number | null (_Optional_)
- `review_count`: integer | null (_Optional_) — *minVal: 0*
- `review_label`: string | null (_Optional_) — *max: 150*
- `primary_cta_text`: string | null (_Optional_) — *max: 150*
- `primary_cta_url`: string | null (_Optional_) — *max: 2048*
- `secondary_cta_text`: string | null (_Optional_) — *max: 150*
- `secondary_cta_url`: string | null (_Optional_) — *max: 2048*
- `services_eyebrow`: string | null (_Optional_) — *max: 255*
- `services_title`: string | null (_Optional_) — *max: 255*
- `sectors_eyebrow`: string | null (_Optional_) — *max: 255*
- `sectors_title`: string | null (_Optional_) — *max: 500*
- `why_choose_us_eyebrow`: string | null (_Optional_) — *max: 255*
- `why_choose_us_title`: string | null (_Optional_) — *max: 500*
- `why_choose_us_cta_text`: string | null (_Optional_) — *max: 150*
- `why_choose_us_cta_url`: string | null (_Optional_) — *max: 2048*
- `quote_title`: string | null (_Optional_) — *max: 500*
- `quote_description`: string | null (_Optional_) — *max: 5000*
- `quote_form_title`: string | null (_Optional_) — *max: 255*
- `hero_steps`: Array<object> (_Optional_)
  - *Item Object Structure:*
    - `label`: string (**Required**) — *max: 100*
    - `sort_order`: integer (**Required**) — *minVal: 0, maxVal: 100000*
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)

### `UpdateJobApplicationRequest`

**Type**: `object`

**Properties**:
- `status`: `JobApplicationStatus` (**Required**)
- `id`: string (_Optional_)
- `applicant_name`: string (_Optional_)
- `email`: string (_Optional_)
- `phone`: string (_Optional_)
- `resume_media_id`: string (_Optional_)

### `UpdateLeadershipMemberRequest`

**Type**: `object`

**Properties**:
- `full_name`: string (_Optional_) — *max: 200*
- `designation`: string (_Optional_) — *max: 200*
- `short_bio`: string (_Optional_) — *max: 5000*
- `full_bio`: string | null (_Optional_) — *max: 50000*
- `profile_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `UpdateMediaRequest`

**Type**: `object`

**Properties**:
- `alt_text`: string | null (_Optional_) — *max: 500*
- `title`: string | null (_Optional_) — *max: 500*
- `caption`: string | null (_Optional_) — *max: 5000*
- `file`: string (_Optional_)
- `disk`: string (_Optional_)
- `path`: string (_Optional_)
- `filename`: string (_Optional_)
- `original_name`: string (_Optional_)
- `extension`: string (_Optional_)
- `mime_type`: string (_Optional_)
- `size_bytes`: string (_Optional_)
- `width`: string (_Optional_)
- `height`: string (_Optional_)
- `checksum_sha256`: string (_Optional_)
- `uploaded_by`: string (_Optional_)

### `UpdateMetricRequest`

**Type**: `object`

**Properties**:
- `key`: string (_Optional_) — *max: 100, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `value`: string (_Optional_) — *max: 100*
- `prefix`: string | null (_Optional_) — *max: 30*
- `suffix`: string | null (_Optional_) — *max: 30*
- `label`: string (_Optional_) — *max: 150*
- `description`: string | null (_Optional_) — *max: 2000*
- `icon_media_id`: integer | null (_Optional_)
- `is_active`: boolean (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `id`: string (_Optional_)

### `UpdateNewsletterSubscriberRequest`

**Type**: `object`

**Properties**:
- `status`: `NewsletterSubscriberStatus` (**Required**)
- `email`: string (_Optional_)
- `source_page`: string (_Optional_)
- `subscribed_at`: string (_Optional_)
- `unsubscribed_at`: string (_Optional_)

### `UpdateProductServicesPageRequest`

**Type**: `object`

**Properties**:
- `eyebrow`: string | null (_Optional_) — *max: 255*
- `title`: string | null (_Optional_) — *max: 255*
- `services_tab_label`: string | null (_Optional_) — *max: 100*
- `products_tab_label`: string | null (_Optional_) — *max: 100*
- `services_introduction`: string | null (_Optional_) — *max: 5000*
- `service_cta_text`: string | null (_Optional_) — *max: 150*
- `service_cta_url`: string | null (_Optional_) — *max: 2048*
- `quote_title`: string | null (_Optional_) — *max: 500*
- `quote_description`: string | null (_Optional_) — *max: 5000*
- `quote_form_title`: string | null (_Optional_) — *max: 255*
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)

### `UpdateQuoteRequest`

**Type**: `object`

**Properties**:
- `status`: `QuoteRequestStatus` (_Optional_)
- `admin_notes`: string | null (_Optional_) — *max: 10000*
- `first_name`: string (_Optional_)
- `last_name`: string (_Optional_)
- `phone`: string (_Optional_)
- `country_code`: string (_Optional_)
- `email`: string (_Optional_)
- `city`: string (_Optional_)
- `message`: string (_Optional_)
- `source_page`: string (_Optional_)
- `assigned_to`: string (_Optional_)

### `UpdateSectorRequest`

**Type**: `object`

**Properties**:
- `title`: string (_Optional_) — *max: 200*
- `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `short_description`: string (_Optional_) — *max: 1000*
- `full_description`: string | null (_Optional_) — *max: 100000*
- `icon_media_id`: integer | null (_Optional_)
- `featured_image_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_featured`: boolean (_Optional_)
- `is_active`: boolean (_Optional_)
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `UpdateServiceRequest`

**Type**: `object`

**Properties**:
- `title`: string (_Optional_) — *max: 200*
- `slug`: string (_Optional_) — *max: 200, pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`*
- `short_description`: string | null (_Optional_) — *max: 1000*
- `full_description`: string | null (_Optional_) — *max: 100000*
- `icon_media_id`: integer | null (_Optional_)
- `featured_image_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_featured`: boolean (_Optional_)
- `is_active`: boolean (_Optional_)
- `seo_title`: string | null (_Optional_) — *max: 255*
- `seo_description`: string | null (_Optional_) — *max: 500*
- `features`: Array<object> (_Optional_)
  - *Item Object Structure:*
    - `title`: string (**Required**) — *max: 200*
    - `description`: string | null (_Optional_) — *max: 5000*
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
    - `id`: string (_Optional_)
- `id`: string (_Optional_)
- `status`: string (_Optional_)
- `published_at`: string (_Optional_)

### `UpdateSiteSettingsRequest`

**Type**: `object`

**Properties**:
- `company_name`: string (_Optional_) — *max: 150*
- `legal_name`: string | null (_Optional_) — *max: 150*
- `tagline`: string | null (_Optional_) — *max: 255*
- `short_description`: string | null (_Optional_) — *max: 500*
- `company_description`: string | null (_Optional_) — *max: 10000*
- `website_url`: string | null (_Optional_) — *max: 2048, format: uri*
- `primary_email`: string | null (_Optional_) — *max: 254, format: email*
- `secondary_email`: string | null (_Optional_) — *max: 254, format: email*
- `primary_phone`: string | null (_Optional_) — *max: 50*
- `secondary_phone`: string | null (_Optional_) — *max: 50*
- `whatsapp_phone`: string | null (_Optional_) — *max: 50*
- `address_line_1`: string | null (_Optional_) — *max: 255*
- `address_line_2`: string | null (_Optional_) — *max: 255*
- `city`: string | null (_Optional_) — *max: 120*
- `state_or_region`: string | null (_Optional_) — *max: 120*
- `postal_code`: string | null (_Optional_) — *max: 32*
- `country`: string | null (_Optional_) — *max: 100*
- `business_hours_text`: string | null (_Optional_) — *max: 2000*
- `latitude`: number | null (_Optional_) — *minVal: -90, maxVal: 90*
- `longitude`: number | null (_Optional_) — *minVal: -180, maxVal: 180*
- `map_embed_url`: string | null (_Optional_) — *max: 2048, format: uri*
- `footer_description`: string | null (_Optional_) — *max: 5000*
- `newsletter_title`: string | null (_Optional_) — *max: 255*
- `newsletter_description`: string | null (_Optional_) — *max: 500*
- `copyright_text`: string | null (_Optional_) — *max: 500*
- `default_seo_title`: string | null (_Optional_) — *max: 255*
- `default_seo_description`: string | null (_Optional_) — *max: 500*
- `default_canonical_base_url`: string | null (_Optional_) — *max: 2048, format: uri*
- `logo_media_id`: integer | null (_Optional_)
- `favicon_media_id`: integer | null (_Optional_)
- `footer_media_id`: integer | null (_Optional_)
- `default_og_image_media_id`: integer | null (_Optional_)
- `social_links`: Array<object> (_Optional_)
  - *Item Object Structure:*
    - `channel`: enum ("facebook", "linkedin", "twitter", "instagram", "youtube") (**Required**) — *values: ["facebook", "linkedin", "twitter", "instagram", "youtube"]*
    - `label`: string (**Required**) — *max: 100*
    - `url`: string (uri) (**Required**) — *max: 2048, format: uri*
    - `icon_key`: string | null (_Optional_) — *max: 100*
    - `is_active`: boolean (_Optional_)
    - `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 10000*
- `id`: string (_Optional_)
- `key`: string (_Optional_)
- `updated_by`: string (_Optional_)
- `logo_path`: string (_Optional_)
- `favicon_path`: string (_Optional_)
- `footer_media_path`: string (_Optional_)
- `default_og_image_path`: string (_Optional_)
- `path`: string (_Optional_)
- `disk`: string (_Optional_)

### `UpdateTechnologyCategoryRequest`

**Type**: `object`

**Properties**:
- `name`: string (_Optional_) — *max: 200*
- `icon_media_id`: integer | null (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `UpdateTechnologyRequest`

**Type**: `object`

**Properties**:
- `technology_category_id`: integer (_Optional_)
- `name`: string (_Optional_) — *max: 200*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `UpdateTestimonialRequest`

**Type**: `object`

**Properties**:
- `customer_name`: string (_Optional_) — *max: 200*
- `customer_role`: string | null (_Optional_) — *max: 200*
- `company`: string | null (_Optional_) — *max: 200*
- `department`: string | null (_Optional_) — *max: 200*
- `testimonial`: string (_Optional_) — *max: 10000*
- `avatar_media_id`: integer | null (_Optional_)
- `rating`: integer | null (_Optional_) — *minVal: 1, maxVal: 5*
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_featured`: boolean (_Optional_)
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)
- `status`: string (_Optional_)

### `UpdateWhyChooseUsItemRequest`

**Type**: `object`

**Properties**:
- `title`: string (_Optional_) — *max: 200*
- `short_title`: string | null (_Optional_) — *max: 100*
- `description`: string (_Optional_) — *max: 10000*
- `icon_media_id`: integer | null (_Optional_)
- `metric_value`: string | null (_Optional_) — *max: 50*
- `metric_suffix`: string | null (_Optional_) — *max: 30*
- `cta_text`: string | null (_Optional_) — *max: 150*
- `cta_url`: string | null (_Optional_) — *max: 2048*
- `is_featured`: boolean (_Optional_)
- `sort_order`: integer (_Optional_) — *minVal: 0, maxVal: 100000*
- `is_active`: boolean (_Optional_)
- `id`: string (_Optional_)

### `WhyChooseUsItemResource`

**Type**: `object`

**Properties**:
- `title`: string (**Required**)
- `short_title`: string | null (**Required**)
- `description`: string (**Required**)
- `icon`: `PublicMediaResource` | null (**Required**)
- `metric`: object (**Required**)
  - `value`: string | null (**Required**)
  - `suffix`: string | null (**Required**)
- `cta`: object | null (**Required**)
- `is_featured`: boolean (**Required**)
- `sort_order`: integer (**Required**)

### `WorkMode`

**Enum Values**: `["onsite", "hybrid", "remote"]`

