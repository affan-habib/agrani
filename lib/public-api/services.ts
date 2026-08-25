import { publicFetch } from "./client";
import {
  ApiResponse,
  ApiPaginatedResponse,
  PublicHomePageResource,
  HomePageResource,
  AboutPageResource,
  ProductServicesPageResource,
  ExpertisePageResource,
  CustomerExperiencePageResource,
  CaseStudiesPageResource,
  ContactPageResource,
  CareerPageResource,
  BlogPageResource,
  AdminSiteSettingsResource,
  BlogPostResource,
  BlogCategoryResource,
  CareerJobResource,
  DepartmentResource,
  CaseStudyResource,
  CaseStudyTagResource,
  ServiceResource,
  SectorResource,
  TestimonialResource,
  WhyChooseUsItemResource,
  QuoteRequestResource,
  JobApplicationResource,
} from "@/types/admin";

export interface SubmitQuotePayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_type?: string;
  budget_range?: string;
  timeline?: string;
  project_details: string;
  source_page?: string;
}

export interface SubscribeNewsletterPayload {
  email: string;
  first_name?: string;
  last_name?: string;
}

export const publicApi = {
  // Page Singletons
  getHome: () => publicFetch<ApiResponse<PublicHomePageResource>>("/home").then(r => r.data),
  getAbout: () => publicFetch<ApiResponse<AboutPageResource>>("/about").then(r => r.data),
  getProductServices: () => publicFetch<ApiResponse<ProductServicesPageResource>>("/product-services").then(r => r.data),
  getExpertise: () => publicFetch<ApiResponse<ExpertisePageResource>>("/expertise").then(r => r.data),
  getCustomerExperience: () => publicFetch<ApiResponse<CustomerExperiencePageResource>>("/customer-experience").then(r => r.data),
  getCareersPage: () => publicFetch<ApiResponse<CareerPageResource>>("/careers").then(r => r.data),
  getContactPage: () => publicFetch<ApiResponse<ContactPageResource>>("/contact").then(r => r.data),
  getSiteSettings: () => publicFetch<ApiResponse<AdminSiteSettingsResource>>("/admin/site-settings").then(r => r.data),

  // Collections
  getServices: (params?: Record<string, any>) => publicFetch<ApiResponse<ServiceResource[]>>("/services", { params }).then(r => r.data),
  getServiceBySlug: (slug: string) => publicFetch<ApiResponse<ServiceResource>>(`/services/${slug}`).then(r => r.data),
  
  getSectors: (params?: Record<string, any>) => publicFetch<ApiResponse<SectorResource[]>>("/sectors", { params }).then(r => r.data),
  getSectorBySlug: (slug: string) => publicFetch<ApiResponse<SectorResource>>(`/sectors/${slug}`).then(r => r.data),

  getTestimonials: (params?: Record<string, any>) => publicFetch<ApiResponse<TestimonialResource[]>>("/testimonials", { params }).then(r => r.data),
  getWhyChooseUs: (params?: Record<string, any>) => publicFetch<ApiResponse<WhyChooseUsItemResource[]>>("/why-choose-us", { params }).then(r => r.data),

  // Careers & Jobs
  getJobs: (params?: Record<string, any>) => publicFetch<ApiResponse<CareerJobResource[]>>("/careers/jobs", { params }).then(r => r.data),
  getJobBySlug: (slug: string) => publicFetch<ApiResponse<CareerJobResource>>(`/careers/jobs/${slug}`).then(r => r.data),
  applyForJob: (jobIdOrSlug: string | number, formData: FormData) => {
    return publicFetch<ApiResponse<JobApplicationResource>>(`/careers/jobs/${jobIdOrSlug}/apply`, {
      method: "POST",
      body: formData,
      isMultipart: true,
    }).then(r => r.data);
  },

  // Blog
  getBlogPosts: (params?: Record<string, any>) => publicFetch<ApiPaginatedResponse<BlogPostResource>>("/blog", { params }),
  getBlogCategories: () => publicFetch<ApiResponse<BlogCategoryResource[]>>("/blog/categories").then(r => r.data),
  getBlogPostBySlug: (slug: string) => publicFetch<ApiResponse<BlogPostResource>>(`/blog/${slug}`).then(r => r.data),

  // Case Studies
  getCaseStudies: (params?: Record<string, any>) => publicFetch<ApiResponse<CaseStudyResource[]>>("/case-studies", { params }).then(r => r.data),
  getCaseStudyBySlug: (slug: string) => publicFetch<ApiResponse<CaseStudyResource>>(`/case-studies/${slug}`).then(r => r.data),
  getCaseStudyTags: () => publicFetch<ApiResponse<CaseStudyTagResource[]>>("/case-study-tags").then(r => r.data),

  // Form Submissions
  submitQuoteRequest: (payload: SubmitQuotePayload) => {
    return publicFetch<ApiResponse<QuoteRequestResource>>("/quote-requests", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then(r => r.data);
  },
  subscribeNewsletter: (payload: SubscribeNewsletterPayload) => {
    return publicFetch<ApiResponse<{ message: string }>>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then(r => r.data);
  },
};
