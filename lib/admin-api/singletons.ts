import { adminFetch } from "./client";
import {
  ApiResponse,
  HomePageResource,
  AboutPageResource,
  ProductServicesPageResource,
  ExpertisePageResource,
  CustomerExperiencePageResource,
  CaseStudiesPageResource,
  BlogPageResource,
  CareerPageResource,
  ContactPageResource,
  AdminSiteSettingsResource,
} from "@/types/admin";

const PROHIBITED_KEYS = new Set([
  "id",
  "key",
  "updated_by",
  "created_at",
  "updated_at",
  "media",
  "hero_media",
  "background_media",
  "logo",
  "favicon",
  "footer_image",
  "default_og_image",
  "hero_steps",
  "author",
  "department",
]);

function cleanSingletonPayload<T extends Record<string, any>>(data: T): Partial<T> {
  if (!data || typeof data !== "object") return data;
  const cleaned: Record<string, any> = {};
  for (const [k, v] of Object.entries(data)) {
    if (PROHIBITED_KEYS.has(k)) continue;
    if (v !== undefined) {
      cleaned[k] = v;
    }
  }
  return cleaned as Partial<T>;
}

export const singletonsApi = {
  // Site Settings
  getSiteSettings: async (): Promise<AdminSiteSettingsResource> => {
    const res = await adminFetch<ApiResponse<AdminSiteSettingsResource>>("/admin/site-settings");
    return res.data;
  },
  updateSiteSettings: async (data: AdminSiteSettingsResource): Promise<AdminSiteSettingsResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<AdminSiteSettingsResource>>("/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },

  // Home Page
  getHomePage: async (): Promise<HomePageResource> => {
    const res = await adminFetch<ApiResponse<HomePageResource>>("/admin/home-page");
    return res.data;
  },
  updateHomePage: async (data: HomePageResource): Promise<HomePageResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<HomePageResource>>("/admin/home-page", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },

  // About Page
  getAboutPage: async (): Promise<AboutPageResource> => {
    const res = await adminFetch<ApiResponse<AboutPageResource>>("/admin/about-page");
    return res.data;
  },
  updateAboutPage: async (data: AboutPageResource): Promise<AboutPageResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<AboutPageResource>>("/admin/about-page", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },

  // Product & Services Page
  getProductServicesPage: async (): Promise<ProductServicesPageResource> => {
    const res = await adminFetch<ApiResponse<ProductServicesPageResource>>("/admin/product-services-page");
    return res.data;
  },
  updateProductServicesPage: async (data: ProductServicesPageResource): Promise<ProductServicesPageResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<ProductServicesPageResource>>("/admin/product-services-page", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },

  // Expertise Page
  getExpertisePage: async (): Promise<ExpertisePageResource> => {
    const res = await adminFetch<ApiResponse<ExpertisePageResource>>("/admin/expertise-page");
    return res.data;
  },
  updateExpertisePage: async (data: ExpertisePageResource): Promise<ExpertisePageResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<ExpertisePageResource>>("/admin/expertise-page", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },

  // Customer Experience Page
  getCustomerExperiencePage: async (): Promise<CustomerExperiencePageResource> => {
    const res = await adminFetch<ApiResponse<CustomerExperiencePageResource>>("/admin/customer-experience-page");
    return res.data;
  },
  updateCustomerExperiencePage: async (data: CustomerExperiencePageResource): Promise<CustomerExperiencePageResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<CustomerExperiencePageResource>>("/admin/customer-experience-page", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },

  // Case Studies Page
  getCaseStudiesPage: async (): Promise<CaseStudiesPageResource> => {
    const res = await adminFetch<ApiResponse<CaseStudiesPageResource>>("/admin/case-studies-page");
    return res.data;
  },
  updateCaseStudiesPage: async (data: CaseStudiesPageResource): Promise<CaseStudiesPageResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<CaseStudiesPageResource>>("/admin/case-studies-page", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },

  // Blog Page
  getBlogPage: async (): Promise<BlogPageResource> => {
    const res = await adminFetch<ApiResponse<BlogPageResource>>("/admin/blog-page");
    return res.data;
  },
  updateBlogPage: async (data: BlogPageResource): Promise<BlogPageResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<BlogPageResource>>("/admin/blog-page", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },

  // Career Page
  getCareerPage: async (): Promise<CareerPageResource> => {
    const res = await adminFetch<ApiResponse<CareerPageResource>>("/admin/career-page");
    return res.data;
  },
  updateCareerPage: async (data: CareerPageResource): Promise<CareerPageResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<CareerPageResource>>("/admin/career-page", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },

  // Contact Page
  getContactPage: async (): Promise<ContactPageResource> => {
    const res = await adminFetch<ApiResponse<ContactPageResource>>("/admin/contact-page");
    return res.data;
  },
  updateContactPage: async (data: ContactPageResource): Promise<ContactPageResource> => {
    const cleaned = cleanSingletonPayload(data);
    const res = await adminFetch<ApiResponse<ContactPageResource>>("/admin/contact-page", {
      method: "PUT",
      body: JSON.stringify(cleaned),
    });
    return res.data;
  },
};
