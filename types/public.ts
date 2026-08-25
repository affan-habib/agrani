export interface ApiResponse<T> {
  data: T;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface PaginationLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}

export interface PaginatedResponse<T, TPageContent = never> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
  page_content?: TPageContent;
}

export interface PublicMedia {
  uuid?: string;
  url?: string | null;
  path?: string | null;
  alt_text?: string | null;
  title?: string | null;
  caption?: string | null;
  mime_type?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface PublicLink {
  text?: string | null;
  label?: string | null;
  url?: string | null;
}

export interface QuoteContent {
  title?: string | null;
  description?: string | null;
  form_title?: string | null;
  submission_endpoint?: string | null;
  source_page?: string | null;
}

export interface SiteSettings {
  company?: {
    name?: string | null;
    legal_name?: string | null;
    short_description?: string | null;
    description?: string | null;
    website_url?: string | null;
  };
  branding?: {
    logo?: PublicMedia | null;
    favicon?: PublicMedia | null;
    footer_image?: PublicMedia | null;
  };
  contact?: {
    primary_email?: string | null;
    secondary_email?: string | null;
    primary_phone?: string | null;
    secondary_phone?: string | null;
    whatsapp_phone?: string | null;
    business_hours?: string | null;
    address?: Address | null;
    map?: { embed_url?: string | null } | null;
  };
  social?: {
    links?: Array<{
      channel?: string | null;
      label?: string | null;
      url?: string | null;
      icon_key?: string | null;
    }>;
  };
  footer?: {
    description?: string | null;
    copyright?: string | null;
    newsletter?: { title?: string | null; description?: string | null } | null;
  };
}

export interface Address {
  line_1?: string | null;
  line_2?: string | null;
  city?: string | null;
  state_or_region?: string | null;
  postal_code?: string | null;
  country?: string | null;
}

export interface PageHero {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  introduction?: string | null;
  media?: PublicMedia | null;
  featured_media?: PublicMedia | null;
  primary_cta?: PublicLink | null;
  secondary_cta?: PublicLink | null;
  steps?: Array<{ label?: string | null; sort_order?: number }>;
  review?: { rating?: number | null; count?: number | null; label?: string | null } | null;
}

export interface ServiceSummary {
  title: string;
  slug: string;
  short_description?: string | null;
  full_description?: string | null;
  icon?: PublicMedia | null;
  featured_image?: PublicMedia | null;
  features?: Array<string | { title?: string; name?: string; description?: string }>;
  sort_order?: number;
  is_featured?: boolean;
}

export interface SectorSummary extends ServiceSummary {}

export interface WhyChooseItem {
  title: string;
  short_title?: string | null;
  description?: string | null;
  icon?: PublicMedia | null;
  metric?: { value?: string | number | null; suffix?: string | null } | null;
  cta?: PublicLink | null;
  is_featured?: boolean;
  sort_order?: number;
}

export interface Testimonial {
  customer_name: string;
  customer_role?: string | null;
  company?: string | null;
  department?: string | null;
  testimonial: string;
  avatar?: PublicMedia | null;
  rating?: number | null;
  sort_order?: number;
  is_featured?: boolean;
}

export interface HomePageData {
  hero: PageHero;
  sections: {
    services?: { eyebrow?: string | null; title?: string | null };
    sectors?: { eyebrow?: string | null; title?: string | null };
    why_choose_us?: { eyebrow?: string | null; title?: string | null; cta?: PublicLink | null };
    quote?: QuoteContent;
  };
  statistics: Array<{
    key?: string;
    value?: string | number | null;
    prefix?: string | null;
    suffix?: string | null;
    label?: string | null;
    description?: string | null;
    icon?: PublicMedia | null;
    sort_order?: number;
  }>;
  services: ServiceSummary[];
  sectors: SectorSummary[];
  why_choose_us: WhyChooseItem[];
  testimonials: Testimonial[];
  site_settings: SiteSettings;
}

export interface LeadershipMember {
  full_name: string;
  designation?: string | null;
  short_bio?: string | null;
  full_bio?: string | null;
  profile_media?: PublicMedia | Record<string, unknown> | null;
  sort_order?: number;
}

export interface AboutPageData {
  overview: PageHero;
  director_message?: {
    title?: string | null;
    message?: string | null;
    director?: LeadershipMember | null;
  } | null;
  mission_vision?: {
    title?: string | null;
    description?: string | null;
    featured_media?: PublicMedia | null;
    mission_title?: string | null;
    mission?: string | null;
    mission_points?: Array<{ description?: string | null; sort_order?: number }>;
    vision_title?: string | null;
    vision?: string | null;
    values_title?: string | null;
  } | null;
  values?: Array<{ title?: string | null; description?: string | null; icon?: PublicMedia | null }>;
  leadership?: LeadershipMember[];
  testimonials_section?: { title?: string | null; description?: string | null } | null;
  testimonials?: Testimonial[];
  quote?: QuoteContent;
  site_settings?: SiteSettings;
}

export interface ProductServicesPageData {
  page: {
    eyebrow?: string | null;
    title?: string | null;
    description?: string | null;
    tabs?: { services?: string | null; products?: string | null };
    services_introduction?: string | null;
    products_introduction?: string | null;
    service_cta?: PublicLink | null;
  };
  services: ServiceSummary[];
  products: ServiceSummary[];
  quote?: QuoteContent;
  site_settings?: SiteSettings;
}

export interface Author {
  name?: string | null;
  slug?: string | null;
  job_title?: string | null;
  organization?: string | null;
  bio?: string | null;
  avatar?: PublicMedia | null;
  linkedin_url?: string | null;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number;
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_media?: PublicMedia | null;
  author?: Author | null;
  categories?: BlogCategory[];
  is_featured?: boolean;
  publication_date?: string | null;
  reading_time_minutes?: number | null;
  content?: ContentBlock[];
  related_posts?: BlogPost[];
}

export interface CaseStudy {
  title: string;
  slug: string;
  short_summary?: string | null;
  project_statement?: string | null;
  client?: string | null;
  industry?: string | null;
  featured_media?: PublicMedia | null;
  author?: Author | null;
  publication_date?: string | null;
  content?: ContentBlock[];
  related_case_studies?: CaseStudy[];
}

export interface ContentBlock {
  type: string;
  payload?: Record<string, unknown>;
  sort_order?: number;
}

export interface ListingPageContent {
  hero?: PageHero;
  detail?: { eyebrow?: string | null; title?: string | null; share_title?: string | null; related_posts_title?: string | null };
  quote?: QuoteContent;
  site_settings?: SiteSettings;
}

export interface CustomerExperiencePageData {
  hero: PageHero;
  testimonials: Testimonial[];
  quote?: QuoteContent;
  site_settings?: SiteSettings;
}

export interface ExpertisePageData {
  page: PageHero;
  sections?: {
    technical_team?: { title?: string | null; description?: string | null };
    technological_expertise?: { title?: string | null; description?: string | null };
    company_capabilities?: { title?: string | null; description?: string | null };
  };
  roles?: unknown;
  technology_categories?: unknown;
  company_capabilities?: unknown;
  quote?: QuoteContent;
  site_settings?: SiteSettings;
}

export interface CareerJob {
  title: string;
  slug: string;
  department?: { name?: string | null } | string | Record<string, unknown> | null;
  employment_type?: string | null;
  work_mode?: string | null;
  experience_level?: string | null;
  location?: string | null;
  salary?: { min?: string | number | null; max?: string | number | null; currency?: string | null; period?: string | null } | null;
  application_deadline?: string | null;
  opening_type?: string | null;
}

export interface CareerSection<T> {
  title?: string | null;
  description?: string | null;
  items?: T[];
}

export interface CareerPageData {
  hero: PageHero;
  employee_feedback?: CareerSection<Testimonial>;
  current_openings?: CareerSection<CareerJob>;
  internship_openings?: CareerSection<CareerJob>;
  quote?: QuoteContent;
  site_settings?: SiteSettings;
}

export interface ContactPageData {
  page: PageHero;
  office?: {
    address?: Address | null;
    phones?: { primary?: string | null; secondary?: string | null; whatsapp?: string | null };
    emails?: { primary?: string | null; secondary?: string | null };
    website_url?: string | null;
    business_hours?: string | null;
  };
  map?: { latitude?: string | number | null; longitude?: string | number | null; embed_url?: string | null };
  quote?: QuoteContent;
}
