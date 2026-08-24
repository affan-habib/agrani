# Agrani API Integration Master To-Do Checklist

> **Purpose**: This checklist provides an exhaustive, step-by-step roadmap for an AI agent or engineering team to implement full backend API integration for both the **Public Frontend** and the **Admin Control Panel** of Agrani Technologies.
> 
> **Base API URL**: `http://192.168.30.27:8000/api/v1`  
> **API Docs**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | **OpenAPI Spec**: [openapi.json](./openapi.json)

---

## 🛠️ Phase 1: Environment & Core Infrastructure Setup

- [ ] **1.1 Configure Environment Variables**
  - [ ] Create/update `.env.local` and `.env.example` with:
    - `NEXT_PUBLIC_API_BASE_URL=http://192.168.30.27:8000/api/v1`
    - `NEXT_PUBLIC_FRONTEND_API_TOKEN=<configured_token>`
  - [ ] Add runtime validation for environment variables.

- [ ] **1.2 Create Type-Safe API Client (HTTP Layer)**
  - [ ] Create `lib/api/client.ts` (Fetch/Axios wrapper).
  - [ ] Implement request interceptor:
    - Automatically attach `X-Frontend-API-Token` for public endpoints.
    - Automatically attach `Authorization: Bearer <token>` for admin requests.
    - Set `Accept: application/json` and `Content-Type: application/json` (except for `multipart/form-data`).
  - [ ] Implement response interceptor:
    - Standardize unwrapping of `{ data, meta, links }`.
    - Handle standard error envelope `{ error: { code, message, fields }, request_id }`.
    - Handle 401 Unauthorized (trigger admin logout/redirect to login).
    - Handle 422 Validation Errors (format field errors for forms).
    - Handle 429 Rate Limiting with user-friendly retry messages.

- [ ] **1.3 Media / Image URL Helper Utility**
  - [ ] Create `lib/utils/media.ts` to format media objects from the API (`path`, `url`, `conversions`, `responsive_urls`, `alt_text`).
  - [ ] Add fallback image handling for missing or null media.

---

## 📦 Phase 2: TypeScript Data Models & Type Definitions

- [ ] **2.1 Core System Types** (`types/api/common.ts`)
  - [ ] `ApiResponse<T>`, `ApiListResponse<T>`, `ApiErrorResponse`, `PaginationMeta`, `PaginationLinks`.
  - [ ] `PublicMediaResource`, `MediaResource`, `ContentBlockResource`.

- [ ] **2.2 Public Resource Types** (`types/api/public.ts`)
  - [ ] `PublicSiteSettingsResource`, `HomePageResource`, `AboutPageResource`.
  - [ ] `ServiceSummaryResource`, `ServiceResource`, `SectorSummaryResource`, `SectorResource`.
  - [ ] `CaseStudySummaryResource`, `CaseStudyResource`, `CaseStudyTagResource`.
  - [ ] `BlogPostSummaryResource`, `BlogPostResource`, `BlogCategoryResource`.
  - [ ] `CareerJobSummaryResource`, `CareerJobResource`, `DepartmentResource`.
  - [ ] `ExpertisePageResource`, `ProductServicesPageResource`, `CustomerExperiencePageResource`.
  - [ ] `WhyChooseUsItemResource`, `TestimonialResource`, `MetricResource`.

- [ ] **2.3 Admin Resource & Request Types** (`types/api/admin.ts`)
  - [ ] `AdminLoginResource`, `AdminUserResource`, `RoleResource`, `PermissionResource`.
  - [ ] `StoreBlogPostRequest`, `UpdateBlogPostRequest`, `PublishBlogPostRequest`.
  - [ ] `StoreCareerJobRequest`, `UpdateCareerJobRequest`, `StoreJobApplicationRequest`.
  - [ ] `StoreCaseStudyRequest`, `UpdateCaseStudyRequest`, `StoreServiceRequest`, `StoreSectorRequest`.
  - [ ] `StoreQuoteRequest`, `StoreContactRequest`, `SubscribeNewsletterRequest`.
  - [ ] Status enums: `BlogStatus`, `CareerJobStatus`, `CaseStudyStatus`, `ServiceStatus`, `SectorStatus`, `WorkMode`, `OpeningType`.

---

## 🌐 Phase 3: Public Website Data Integration

### 3.1 Global Chrome & Site Settings
- [ ] Connect `GET /site-settings` to root layout and footer/header:
  - [ ] Dynamic company branding, logo, slogan, address, phone, email.
  - [ ] Social links (LinkedIn, Twitter, Facebook, YouTube, GitHub).
  - [ ] Copyright notice and dynamic site navigation.

### 3.2 Homepage (`app/page.tsx`)
- [ ] Connect `GET /home`:
  - [ ] Hero section (eyebrow, title, description, primary CTA, secondary CTA, stats, background media).
  - [ ] Services preview section.
  - [ ] Why choose us section.
  - [ ] Customer experience / testimonials section.
  - [ ] Quote request banner section.
  - [ ] Dynamic SEO metadata (`title`, `description`).
- [ ] Connect `GET /why-choose-us` for detailed capability cards.
- [ ] Connect `GET /testimonials` for client quotes.
- [ ] Connect `GET /sectors` for industries/sectors carousel.

### 3.3 About Us Page (`app/about/page.tsx`)
- [ ] Connect `GET /about`:
  - [ ] Overview (eyebrow, title, description, featured media).
  - [ ] Director message & profile.
  - [ ] Mission, Vision & Core Values list.
  - [ ] Leadership members list (`leadership`).
  - [ ] Testimonials section & Quote section.
  - [ ] SEO metadata.

### 3.4 Services & Products Pages
- [ ] **Services Listing** (`app/services/page.tsx`):
  - [ ] Connect `GET /services` (query params: `search`, `status`, `sort`, `page`, `per_page`).
- [ ] **Service Details** (`app/services/[slug]/page.tsx`):
  - [ ] Connect `GET /services/{slug}` (detailed features, media, content blocks, quote CTA).
- [ ] **Products & Services Summary** (`app/products/page.tsx`):
  - [ ] Connect `GET /product-services` (hero, product offerings, features, SEO).

### 3.5 Expertise & Customer Experience Pages
- [ ] **Expertise Page** (`app/expertise/page.tsx`):
  - [ ] Connect `GET /expertise` (hero, roles, technologies, capabilities, SEO).
- [ ] **Customer Experience Page** (`app/customer-experience/page.tsx`):
  - [ ] Connect `GET /customer-experience` (hero, journey stages, metrics, testimonials, SEO).

### 3.6 Case Studies Pages
- [ ] **Case Studies Listing** (`app/case-studies/page.tsx`):
  - [ ] Connect `GET /case-studies` (query params: `tag`, `sector`, `service`, `search`, `sort`, `page`, `per_page`).
  - [ ] Implement filter tags and search input.
- [ ] **Case Study Details** (`app/case-studies/[slug]/page.tsx`):
  - [ ] Connect `GET /case-studies/{slug}` (client, challenge, solution, results, metrics, media gallery, related studies).

### 3.7 Blog Pages
- [ ] **Blog Listing** (`app/blog/page.tsx`):
  - [ ] Connect `GET /blog` (query params: `category`, `search`, `sort`, `page`, `per_page`).
  - [ ] Connect `GET /blog/categories` for sidebar category filter pills.
  - [ ] Implement pagination & search bar.
- [ ] **Blog Post Details** (`app/blog/[slug]/page.tsx`):
  - [ ] Connect `GET /blog/{slug}` (author, published date, reading time, categories, body content blocks, related posts, share links).

### 3.8 Careers & Job Portal
- [ ] **Careers Landing** (`app/career/page.tsx`):
  - [ ] Connect `GET /careers` (hero, employee feedback, openings count, perks).
  - [ ] Connect `GET /careers/jobs` (query params: `department`, `opening_type`, `employment_type`, `work_mode`, `location`, `search`).
- [ ] **Job Details** (`app/career/[slug]/page.tsx`):
  - [ ] Connect `GET /careers/jobs/{slug}` (responsibilities, requirements, benefits, salary range, deadline).

---

## 📝 Phase 4: Public Form Submissions & User Interactions

- [ ] **4.1 Contact Form** (`app/contact/page.tsx`)
  - [ ] Connect `GET /contact` for page content, office locations, phone/email info.
  - [ ] Connect `POST /contact` to submit inquiry:
    - Payload: `name`, `email`, `phone` (opt), `company` (opt), `subject` (opt), `message`, `service_interest` (opt).
    - Handle validation errors (422) inline.
    - Show success message / reference ID.

- [ ] **4.2 Quote Request Modal / Page**
  - [ ] Connect `POST /quote-requests`:
    - Payload: `name`, `email`, `phone`, `company` (opt), `service_type`, `budget_range` (opt), `timeline` (opt), `project_details`, `source_page`.
    - Provide budget range & service dropdown options.

- [ ] **4.3 Job Application Form with Resume Upload**
  - [ ] Connect `POST /careers/jobs/{job}/apply`:
    - Form type: `multipart/form-data`.
    - Payload: `applicant_name`, `email`, `phone`, `resume` (file <= 5MB: PDF/DOC/DOCX), `cover_letter` (opt).
    - Handle 413 Payload Too Large and 422 File format errors.
    - Display submission reference code upon success.

- [ ] **4.4 Newsletter Subscription** (Footer / Sidebar)
  - [ ] Connect `POST /newsletter/subscribe`:
    - Payload: `email`, `first_name` (opt), `last_name` (opt).
    - Handle duplicate email / already subscribed responses cleanly.

---

## 🔐 Phase 5: Admin Authentication & Session Management

- [ ] **5.1 Admin Authentication State & Context**
  - [ ] Create `context/AdminAuthContext.tsx` or Zustand store.
  - [ ] Connect `POST /admin/auth/login` (`email`, `password`, `device_name`).
  - [ ] Securely store bearer token in HTTP-only cookies or encrypted localStorage.
  - [ ] Connect `GET /admin/auth/me` to restore session on app load.
  - [ ] Connect `POST /admin/auth/logout` to invalidate current Sanctum token.
  - [ ] Implement Route Guard / Next.js Middleware for `/admin/*` routes.

---

## 🎛️ Phase 6: Admin Dashboard - Singletons & Page Content Management

Implement Admin UI with Form controls, Live Preview, and Save/Publish buttons:

- [ ] **6.1 Home Page Editor** (`GET/PUT/PATCH /admin/home-page`)
- [ ] **6.2 About Page Editor** (`GET/PUT/PATCH /admin/about-page`)
- [ ] **6.3 Services & Products Page Editor** (`GET/PUT/PATCH /admin/product-services-page`)
- [ ] **6.4 Expertise Page Editor** (`GET/PUT/PATCH /admin/expertise-page`)
- [ ] **6.5 Customer Experience Page Editor** (`GET/PUT/PATCH /admin/customer-experience-page`)
- [ ] **6.6 Case Studies Page Editor** (`GET/PUT/PATCH /admin/case-studies-page`)
- [ ] **6.7 Blog Page Editor** (`GET/PUT/PATCH /admin/blog-page`)
- [ ] **6.8 Career Page Editor** (`GET/PUT/PATCH /admin/career-page`)
- [ ] **6.9 Contact Page Editor** (`GET/PUT/PATCH /admin/contact-page`)
- [ ] **6.10 Site Settings Editor** (`GET/PUT /admin/site-settings`)

---

## 📚 Phase 7: Admin Resources & Collections CRUD (Full Lifecycle)

For each module, implement: Data Table (Search, Filter, Pagination, Sorting) + Create Modal/Page + Edit Form + Delete Modal + State Action Buttons (Publish, Unpublish, Archive).

- [ ] **7.1 Blog Posts Management**
  - [ ] `GET /admin/blog-posts` (list with status, author, category filters).
  - [ ] `POST /admin/blog-posts` (create with markdown/rich blocks, SEO, tags, media).
  - [ ] `GET /admin/blog-posts/{id}` (detail).
  - [ ] `PUT /admin/blog-posts/{id}` and `PATCH /admin/blog-posts/{id}` (update).
  - [ ] `DELETE /admin/blog-posts/{id}` (delete).
  - [ ] `POST /admin/blog-posts/{id}/publish` (publish).
  - [ ] `POST /admin/blog-posts/{id}/unpublish` (revert to draft).
  - [ ] `POST /admin/blog-posts/{id}/archive` (archive).

- [ ] **7.2 Blog Categories Management**
  - [ ] CRUD on `/admin/blog-categories` + `/publish`, `/unpublish`, `/archive`.

- [ ] **7.3 Career Jobs Management**
  - [ ] CRUD on `/admin/jobs` + `/publish`, `/unpublish`, `/archive`.
  - [ ] Department relations via `/admin/departments`.

- [ ] **7.4 Case Studies & Tags Management**
  - [ ] CRUD on `/admin/case-studies` + `/publish`, `/unpublish`, `/archive`.
  - [ ] CRUD on `/admin/case-study-tags`.

- [ ] **7.5 Services & Sectors Management**
  - [ ] CRUD on `/admin/services` + `/publish`, `/unpublish`, `/archive`.
  - [ ] CRUD on `/admin/sectors` + `/publish`, `/unpublish`, `/archive`.

- [ ] **7.6 Technologies & Categories Management**
  - [ ] CRUD on `/admin/technologies`.
  - [ ] CRUD on `/admin/technology-categories`.

- [ ] **7.7 Team, Values & Proof Points Management**
  - [ ] CRUD on `/admin/leadership-members`.
  - [ ] CRUD on `/admin/company-values`.
  - [ ] CRUD on `/admin/capabilities`.
  - [ ] CRUD on `/admin/expertise-roles`.
  - [ ] CRUD on `/admin/metrics`.
  - [ ] CRUD on `/admin/testimonials` + `/publish`, `/unpublish`, `/archive`.
  - [ ] CRUD on `/admin/why-choose-us`.

---

## 📬 Phase 8: Admin Inquiries & Leads Management

- [ ] **8.1 Job Applications Dashboard**
  - [ ] `GET /admin/job-applications` (list with filter by job, status).
  - [ ] `GET /admin/job-applications/{id}` (view candidate details & resume download).
  - [ ] `PATCH /admin/job-applications/{id}` (update status: `pending`, `reviewed`, `shortlisted`, `rejected`, etc.).

- [ ] **8.2 Contact Messages Inbox**
  - [ ] `GET /admin/contacts` (list with status filter).
  - [ ] `GET /admin/contacts/{id}` (view message).
  - [ ] `PATCH /admin/contacts/{id}` (mark as read/replied/archived).

- [ ] **8.3 Quote Requests Dashboard**
  - [ ] `GET /admin/quote-requests` (list with budget & service filters).
  - [ ] `GET /admin/quote-requests/{id}` (view project details).
  - [ ] `PATCH /admin/quote-requests/{id}` (update status).

- [ ] **8.4 Newsletter Subscribers List**
  - [ ] `GET /admin/newsletter-subscribers` (filter active/unsubscribed).
  - [ ] `GET /admin/newsletter-subscribers/{id}`.
  - [ ] `PATCH /admin/newsletter-subscribers/{id}` (toggle active/unsubscribed status).

---

## 🖼️ Phase 9: Admin Media Library & Asset Uploads

- [ ] **9.1 Media Browser & File Uploader**
  - [ ] `GET /admin/media` (paginated media gallery with search and mime-type filters).
  - [ ] `POST /admin/media` (`multipart/form-data` upload: file <= 10MB, alt_text, title, caption).
  - [ ] `GET /admin/media/{id}` (view file metadata, conversions, responsive sizes).
  - [ ] `PATCH /admin/media/{id}` (update alt_text, title, caption).
  - [ ] `DELETE /admin/media/{id}` (delete media asset).
- [ ] **9.2 Reusable Media Picker Component**
  - [ ] Build a modal dialog to select or upload media directly from any Admin Form (e.g. blog featured image, hero banner, logo, author avatar).

---

## 👥 Phase 10: Admin Roles, Permissions & Access Control

- [ ] **10.1 Role & Permission Management**
  - [ ] `GET /admin/permissions` (list all system permissions).
  - [ ] `GET /admin/roles` (list all defined roles with assigned permissions).
  - [ ] `PUT /admin/roles/{role}/permissions` (sync permissions array for a role).
  - [ ] `PUT /admin/users/{user}/roles` (assign roles to an administrator).
- [ ] **10.2 Client-Side Permission Gates**
  - [ ] Create `<Can permission="..."/>` or `usePermission()` hook to conditionally render UI controls based on the logged-in admin user permissions.

---

## ⚡ Phase 11: Performance, Caching & Verification

- [ ] **11.1 Next.js App Router Data Strategy**
  - [ ] Configure `revalidate` tags (e.g., `next: { tags: ["blog", "site-settings"] }`) for ISR on public pages.
  - [ ] Implement On-Demand ISR revalidation when admin saves/publishes content.
- [ ] **11.2 Error Boundaries & Fallback States**
  - [ ] Add `loading.tsx` skeletons for all public routes.
  - [ ] Add `error.tsx` boundary to handle API downtimes gracefully.
- [ ] **11.3 End-to-End Smoke Testing**
  - [ ] Verify all public pages load correctly with live API data.
  - [ ] Verify all form submissions work and create backend records.
  - [ ] Verify admin login, CRUD, publishing workflows, and file uploads.
