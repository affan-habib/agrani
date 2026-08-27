import { publicFetch } from "./client";
import type {
  AboutPageData,
  ApiResponse,
  BlogCategory,
  BlogPost,
  CareerJob,
  CareerPageData,
  CaseStudy,
  ContactPageData,
  CustomerExperiencePageData,
  ExpertisePageData,
  HomePageData,
  ListingPageContent,
  PaginatedResponse,
  ProductServicesPageData,
  SectorSummary,
  ServiceSummary,
  Testimonial,
  WhyChooseItem,
} from "@/types/public";

export interface SubmitQuotePayload {
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone: string;
  city?: string;
  message?: string;
  project_details?: string;
  source_page?: string;
}

export interface SubscribeNewsletterPayload {
  email: string;
  first_name?: string;
  last_name?: string;
}

const data = <T>(response: ApiResponse<T>) => response.data;

export const publicApi = {
  getHome: () => publicFetch<ApiResponse<HomePageData>>("/home").then(data),
  getAbout: () => publicFetch<ApiResponse<AboutPageData>>("/about").then(data),
  getProductServices: async () => {
    const res = await publicFetch<ApiResponse<ProductServicesPageData>>("/product-services").then(data);
    if (res && Array.isArray(res.services)) {
      res.services = await Promise.all(
        res.services.map(async (svc) => {
          if (!Array.isArray(svc.features) || svc.features.length === 0) {
            try {
              const detailed = await publicFetch<ApiResponse<ServiceSummary>>(`/services/${svc.slug}`).then(data);
              if (detailed && Array.isArray(detailed.features) && detailed.features.length > 0) {
                return { ...svc, features: detailed.features };
              }
            } catch {
              // fallback
            }
          }
          return svc;
        })
      );
    }
    return res;
  },
  getExpertise: () => publicFetch<ApiResponse<ExpertisePageData>>("/expertise").then(data),
  getCustomerExperience: () => publicFetch<ApiResponse<CustomerExperiencePageData>>("/customer-experience").then(data),
  getCareersPage: () => publicFetch<ApiResponse<CareerPageData>>("/careers").then(data),
  getContactPage: () => publicFetch<ApiResponse<ContactPageData>>("/contact").then(data),

  getServices: (params?: Record<string, unknown>) =>
    publicFetch<PaginatedResponse<ServiceSummary>>("/services", { params }).then(data),
  getServiceBySlug: (slug: string) =>
    publicFetch<ApiResponse<ServiceSummary>>(`/services/${slug}`).then(data),
  getSectors: (params?: Record<string, unknown>) =>
    publicFetch<PaginatedResponse<SectorSummary>>("/sectors", { params }).then(data),
  getTestimonials: (params?: Record<string, unknown>) =>
    publicFetch<PaginatedResponse<Testimonial>>("/testimonials", { params }).then(data),
  getWhyChooseUs: (params?: Record<string, unknown>) =>
    publicFetch<ApiResponse<WhyChooseItem[]>>("/why-choose-us", { params }).then(data),

  getJobs: (params?: Record<string, unknown>) =>
    publicFetch<PaginatedResponse<CareerJob>>("/careers/jobs", { params }).then(data),
  getJobBySlug: (slug: string) =>
    publicFetch<ApiResponse<CareerJob>>(`/careers/jobs/${slug}`).then(data),
  applyForJob: (jobIdOrSlug: string | number, formData: FormData) =>
    publicFetch<ApiResponse<unknown>>(`/careers/jobs/${jobIdOrSlug}/apply`, {
      method: "POST",
      body: formData,
      isMultipart: true,
    }).then(data),

  getBlogPosts: (params?: Record<string, unknown>) =>
    publicFetch<PaginatedResponse<BlogPost, ListingPageContent>>("/blog", { params }),
  getBlogCategories: () =>
    publicFetch<ApiResponse<BlogCategory[]>>("/blog/categories").then(data),
  getBlogPostBySlug: (slug: string) =>
    publicFetch<ApiResponse<BlogPost>>(`/blog/${encodeURIComponent(slug)}`).then(data),

  getCaseStudies: (params?: Record<string, unknown>) =>
    publicFetch<PaginatedResponse<CaseStudy, ListingPageContent>>("/case-studies", { params }),
  getCaseStudyBySlug: (slug: string) =>
    publicFetch<ApiResponse<CaseStudy>>(`/case-studies/${encodeURIComponent(slug)}`).then(data),

  submitQuoteRequest: (payload: SubmitQuotePayload) => {
    const nameParts = (payload.name || "").trim().split(/\s+/).filter(Boolean);
    const body = {
      first_name: payload.first_name || nameParts[0],
      last_name: payload.last_name || nameParts.slice(1).join(" "),
      phone: payload.phone,
      message: payload.message || payload.project_details,
      source_page: payload.source_page,
      email: payload.email,
      city: payload.city,
    };

    return publicFetch<ApiResponse<unknown>>("/quote-requests", {
      method: "POST",
      body: JSON.stringify(body),
    }).then(data);
  },

  subscribeNewsletter: (payload: SubscribeNewsletterPayload) =>
    publicFetch<ApiResponse<{ message: string }>>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then(data),
};
