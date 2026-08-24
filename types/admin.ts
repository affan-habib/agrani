/**
 * Agrani Admin TypeScript Interfaces & Types
 * Generated from OpenAPI 3.1.0 Specification
 */

// ==========================================
// Common Types & Pagination
// ==========================================

export interface ApiMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  links: ApiMetaLink[];
  path: string | null;
  per_page: number;
  to: number | null;
  total: number;
}

export interface PaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiPaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
}

export interface ApiErrorResponse {
  error: ApiError;
  request_id: string;
}

// ==========================================
// Status Enums
// ==========================================

export type BlogStatus = "draft" | "published" | "archived";
export type CareerJobStatus = "draft" | "published" | "archived";
export type CaseStudyStatus = "draft" | "published" | "archived";
export type ServiceStatus = "draft" | "published" | "archived";
export type SectorStatus = "draft" | "published" | "archived";
export type TestimonialStatus = "draft" | "published" | "archived";
export type WorkMode = "onsite" | "remote" | "hybrid";
export type OpeningType = "experienced" | "entry-level" | "internship";
export type EmploymentType = "full-time" | "part-time" | "contract" | "temporary";
export type JobApplicationStatus = "pending" | "reviewed" | "shortlisted" | "interviewed" | "offered" | "rejected";
export type NewsletterSubscriberStatus = "subscribed" | "unsubscribed";

// ==========================================
// Auth & User Management
// ==========================================

export interface AdminUserResource {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AdminLoginResource {
  access_token?: string;
  token?: string;
  token_type?: string;
  expires_at?: string;
  user: AdminUserResource;
}

export interface LoginRequest {
  email: string;
  password: string;
  device_name?: string;
}

export interface RoleResource {
  id: number;
  name: string;
  display_name?: string;
  description?: string;
  permissions?: string[];
}

export interface PermissionResource {
  id: number;
  name: string;
  display_name?: string;
  group?: string;
}

export interface SyncRolePermissionsRequest {
  permissions: string[];
}

export interface SyncUserRolesRequest {
  roles: string[];
}

// ==========================================
// Media Library
// ==========================================

export interface MediaResource {
  id: number;
  file_name: string;
  name?: string;
  mime_type: string;
  size: number;
  url: string;
  alt_text?: string | null;
  title?: string | null;
  caption?: string | null;
  created_at: string;
  updated_at: string;
  conversions?: Record<string, string>;
  responsive_urls?: string[];
}

export interface StoreMediaRequest {
  file: File;
  alt_text?: string | null;
  title?: string | null;
  caption?: string | null;
}

export interface UpdateMediaRequest {
  alt_text?: string | null;
  title?: string | null;
  caption?: string | null;
}

// ==========================================
// Page Content Singletons
// ==========================================

export interface ContentBlockResource {
  id?: string;
  type: string;
  heading?: string | null;
  body?: string | null;
  media_id?: number | null;
  media?: MediaResource | null;
  sort_order?: number;
  metadata?: Record<string, any>;
}

export interface AdminSiteSettingsResource {
  company_name?: string | null;
  site_title?: string | null;
  tagline?: string | null;
  contact_email?: string | null;
  support_email?: string | null;
  phone?: string | null;
  address?: string | null;
  social_links?: {
    linkedin?: string | null;
    twitter?: string | null;
    facebook?: string | null;
    youtube?: string | null;
    github?: string | null;
  } | null;
  logo_media_id?: number | null;
  logo?: MediaResource | null;
  favicon_media_id?: number | null;
  favicon?: MediaResource | null;
  footer_text?: string | null;
  copyright?: string | null;
}

export interface HomePageResource {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    primary_cta_label?: string | null;
    primary_cta_url?: string | null;
    secondary_cta_label?: string | null;
    secondary_cta_url?: string | null;
    media_id?: number | null;
    media?: MediaResource | null;
  };
  services_section?: {
    title?: string | null;
    description?: string | null;
  };
  why_choose_us_section?: {
    title?: string | null;
    description?: string | null;
  };
  testimonials_section?: {
    title?: string | null;
    description?: string | null;
  };
  quote_section?: {
    title?: string | null;
    description?: string | null;
    form_title?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface AboutPageResource {
  overview?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    featured_media?: MediaResource[] | null;
  };
  director_message?: {
    title?: string | null;
    message?: string | null;
    director?: {
      full_name?: string | null;
      designation?: string | null;
      short_bio?: string | null;
      full_bio?: string | null;
      profile_media_id?: number | null;
      profile_media?: MediaResource | null;
    } | null;
  };
  mission_vision?: {
    title?: string | null;
    description?: string | null;
    mission_title?: string | null;
    mission?: string | null;
    mission_points?: Array<{ description: string; sort_order: number }>;
    vision_title?: string | null;
    vision?: string | null;
    values_title?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface ProductServicesPageResource {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface ExpertisePageResource {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface CustomerExperiencePageResource {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface CaseStudiesPageResource {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface BlogPageResource {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface CareerPageResource {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
  };
  employee_feedback?: {
    title?: string | null;
    description?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  };
}

export interface ContactPageResource {
  hero?: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
  };
  contact_info?: {
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    business_hours?: string | null;
  };
  seo?: {
    title?: string | null;
    description?: string | null;
  };
}

// ==========================================
// Resources: Blog & News
// ==========================================

export interface BlogCategoryResource {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  status: BlogStatus;
  sort_order?: number;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreBlogCategoryRequest {
  name: string;
  slug?: string;
  description?: string | null;
  sort_order?: number;
  status?: BlogStatus;
}

export interface UpdateBlogCategoryRequest {
  name?: string;
  slug?: string;
  description?: string | null;
  sort_order?: number;
  status?: BlogStatus;
}

export interface BlogPostResource {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  status: BlogStatus;
  published_at?: string | null;
  reading_time_minutes?: number | null;
  is_featured?: boolean;
  featured_media_id?: number | null;
  featured_media?: MediaResource | null;
  author_person_id?: number | null;
  author?: PersonResource | null;
  category_ids?: number[];
  categories?: BlogCategoryResource[];
  related_post_ids?: number[];
  related_posts?: BlogPostResource[];
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  blocks?: any[];
  created_at: string;
  updated_at: string;
}

export interface StoreBlogPostRequest {
  title: string;
  slug?: string;
  excerpt?: string | null;
  body?: string | null;
  is_featured?: boolean;
  featured_media_id?: number | null;
  author_person_id?: number | null;
  category_ids?: number[];
  related_post_ids?: number[];
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  status?: BlogStatus;
  published_at?: string | null;
  blocks?: any;
}

export interface UpdateBlogPostRequest extends Partial<StoreBlogPostRequest> {}

// ==========================================
// Resources: Careers & Jobs
// ==========================================

export interface DepartmentResource {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreDepartmentRequest {
  name: string;
  description?: string | null;
  sort_order?: number;
}

export interface CareerJobResource {
  id: number;
  title: string;
  slug: string;
  department_id?: number | null;
  department?: DepartmentResource | null;
  opening_type: OpeningType;
  employment_type: EmploymentType;
  work_mode: WorkMode;
  location?: string | null;
  short_description?: string | null;
  description?: string | null;
  requirements?: string | null;
  responsibilities?: string | null;
  benefits?: string | null;
  experience_years_min?: number | null;
  experience_years_max?: number | null;
  application_deadline?: string | null;
  status: CareerJobStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreCareerJobRequest {
  title: string;
  slug?: string;
  department_id?: number | null;
  opening_type: OpeningType;
  employment_type: EmploymentType;
  work_mode: WorkMode;
  location?: string | null;
  short_description?: string | null;
  description?: string | null;
  requirements?: string | null;
  responsibilities?: string | null;
  benefits?: string | null;
  experience_years_min?: number | null;
  experience_years_max?: number | null;
  application_deadline?: string | null;
  status?: CareerJobStatus;
}

export interface UpdateCareerJobRequest extends Partial<StoreCareerJobRequest> {}

// ==========================================
// Resources: Case Studies
// ==========================================

export interface CaseStudyTagResource {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface StoreCaseStudyTagRequest {
  name: string;
  slug?: string;
}

export interface CaseStudyResource {
  id: number;
  title: string;
  slug: string;
  client_name?: string | null;
  sector_id?: number | null;
  sector?: SectorResource | null;
  service_ids?: number[];
  services?: ServiceResource[];
  tag_ids?: number[];
  tags?: CaseStudyTagResource[];
  excerpt?: string | null;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  key_metrics?: Array<{ label: string; value: string }> | null;
  featured_media_id?: number | null;
  featured_media?: MediaResource | null;
  is_featured?: boolean;
  status: CaseStudyStatus;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreCaseStudyRequest {
  title: string;
  slug?: string;
  client_name?: string | null;
  sector_id?: number | null;
  service_ids?: number[];
  tag_ids?: number[];
  excerpt?: string | null;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  key_metrics?: Array<{ label: string; value: string }>;
  featured_media_id?: number | null;
  is_featured?: boolean;
  status?: CaseStudyStatus;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface UpdateCaseStudyRequest extends Partial<StoreCaseStudyRequest> {}

// ==========================================
// Resources: Services & Sectors
// ==========================================

export interface ServiceFeatureResource {
  id?: number;
  title: string;
  description?: string | null;
  sort_order?: number;
}

export interface ServiceResource {
  id: number;
  title: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  icon_media_id?: number | null;
  icon_media?: MediaResource | null;
  featured_media_id?: number | null;
  featured_media?: MediaResource | null;
  features?: ServiceFeatureResource[] | null;
  status: ServiceStatus;
  sort_order?: number;
  is_featured?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreServiceRequest {
  title: string;
  slug?: string;
  short_description?: string | null;
  description?: string | null;
  icon_media_id?: number | null;
  featured_media_id?: number | null;
  features?: ServiceFeatureResource[];
  status?: ServiceStatus;
  sort_order?: number;
  is_featured?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface UpdateServiceRequest extends Partial<StoreServiceRequest> {}

export interface SectorResource {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  icon_media_id?: number | null;
  icon_media?: MediaResource | null;
  featured_media_id?: number | null;
  featured_media?: MediaResource | null;
  status: SectorStatus;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreSectorRequest {
  title: string;
  slug?: string;
  description?: string | null;
  icon_media_id?: number | null;
  featured_media_id?: number | null;
  status?: SectorStatus;
  sort_order?: number;
}

export interface UpdateSectorRequest extends Partial<StoreSectorRequest> {}

// ==========================================
// Resources: Technologies & Categories
// ==========================================

export interface TechnologyCategoryResource {
  id: number;
  name: string;
  slug: string;
  sort_order?: number;
  technologies_count?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreTechnologyCategoryRequest {
  name: string;
  sort_order?: number;
}

export interface TechnologyResource {
  id: number;
  name: string;
  category_id?: number | null;
  category?: TechnologyCategoryResource | null;
  icon_media_id?: number | null;
  icon_media?: MediaResource | null;
  description?: string | null;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreTechnologyRequest {
  name: string;
  category_id?: number | null;
  icon_media_id?: number | null;
  description?: string | null;
  sort_order?: number;
}

// ==========================================
// Resources: Company, Leadership, Testimonials
// ==========================================

export interface PersonResource {
  id: number;
  full_name: string;
  designation?: string | null;
  email?: string | null;
  short_bio?: string | null;
  full_bio?: string | null;
  profile_media_id?: number | null;
  profile_media?: MediaResource | null;
  sort_order?: number;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadershipMemberResource extends PersonResource {}

export interface StoreLeadershipMemberRequest {
  full_name: string;
  designation?: string | null;
  email?: string | null;
  short_bio?: string | null;
  full_bio?: string | null;
  profile_media_id?: number | null;
  sort_order?: number;
  linkedin_url?: string | null;
  twitter_url?: string | null;
}

export interface CompanyValueResource {
  id: number;
  title: string;
  description: string;
  icon_media_id?: number | null;
  icon_media?: MediaResource | null;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreCompanyValueRequest {
  title: string;
  description: string;
  icon_media_id?: number | null;
  sort_order?: number;
}

export interface CompanyCapabilityResource {
  id: number;
  title: string;
  description: string;
  features?: Array<{ title: string; description?: string }> | null;
  icon_media_id?: number | null;
  icon_media?: MediaResource | null;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreCompanyCapabilityRequest {
  title: string;
  description: string;
  features?: Array<{ title: string; description?: string }>;
  icon_media_id?: number | null;
  sort_order?: number;
}

export interface ExpertiseRoleResource {
  id: number;
  title: string;
  description?: string | null;
  skills?: string[] | null;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreExpertiseRoleRequest {
  title: string;
  description?: string | null;
  skills?: string[];
  sort_order?: number;
}

export interface MetricResource {
  id: number;
  label: string;
  value: string;
  suffix?: string | null;
  description?: string | null;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreMetricRequest {
  label: string;
  value: string;
  suffix?: string | null;
  description?: string | null;
  sort_order?: number;
}

export interface TestimonialResource {
  id: number;
  author_name: string;
  author_title?: string | null;
  company_name?: string | null;
  content: string;
  rating?: number | null;
  avatar_media_id?: number | null;
  avatar_media?: MediaResource | null;
  status: TestimonialStatus;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreTestimonialRequest {
  author_name: string;
  author_title?: string | null;
  company_name?: string | null;
  content: string;
  rating?: number | null;
  avatar_media_id?: number | null;
  status?: TestimonialStatus;
  sort_order?: number;
}

export interface WhyChooseUsItemResource {
  id: number;
  title: string;
  description: string;
  icon_media_id?: number | null;
  icon_media?: MediaResource | null;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface StoreWhyChooseUsItemRequest {
  title: string;
  description: string;
  icon_media_id?: number | null;
  sort_order?: number;
}

// ==========================================
// Inquiries & Submissions
// ==========================================

export interface JobApplicationResource {
  id: number;
  job_id: number;
  job?: CareerJobResource | null;
  applicant_name: string;
  email: string;
  phone: string;
  resume_url?: string | null;
  cover_letter?: string | null;
  status: JobApplicationStatus;
  reference_code?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequestResource {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service_type?: string | null;
  budget_range?: string | null;
  timeline?: string | null;
  project_details: string;
  source_page?: string | null;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessageResource {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  subject?: string | null;
  message: string;
  service_interest?: string | null;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriberResource {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  status: NewsletterSubscriberStatus;
  subscribed_at: string;
  unsubscribed_at?: string | null;
  created_at: string;
  updated_at: string;
}
