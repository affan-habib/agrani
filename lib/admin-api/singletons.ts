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

export const singletonsApi = {
  // Site Settings
  getSiteSettings: async (): Promise<AdminSiteSettingsResource> => {
    const res = await adminFetch<ApiResponse<AdminSiteSettingsResource>>("/admin/site-settings");
    return res.data;
  },
  updateSiteSettings: async (data: AdminSiteSettingsResource): Promise<AdminSiteSettingsResource> => {
    const res = await adminFetch<ApiResponse<AdminSiteSettingsResource>>("/admin/site-settings", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Home Page
  getHomePage: async (): Promise<HomePageResource> => {
    const res = await adminFetch<ApiResponse<HomePageResource>>("/admin/home-page");
    return res.data;
  },
  updateHomePage: async (data: HomePageResource): Promise<HomePageResource> => {
    const res = await adminFetch<ApiResponse<HomePageResource>>("/admin/home-page", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // About Page
  getAboutPage: async (): Promise<AboutPageResource> => {
    const res = await adminFetch<ApiResponse<AboutPageResource>>("/admin/about-page");
    return res.data;
  },
  updateAboutPage: async (data: AboutPageResource): Promise<AboutPageResource> => {
    const res = await adminFetch<ApiResponse<AboutPageResource>>("/admin/about-page", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Product & Services Page
  getProductServicesPage: async (): Promise<ProductServicesPageResource> => {
    const res = await adminFetch<ApiResponse<ProductServicesPageResource>>("/admin/product-services-page");
    return res.data;
  },
  updateProductServicesPage: async (data: ProductServicesPageResource): Promise<ProductServicesPageResource> => {
    const res = await adminFetch<ApiResponse<ProductServicesPageResource>>("/admin/product-services-page", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Expertise Page
  getExpertisePage: async (): Promise<ExpertisePageResource> => {
    const res = await adminFetch<ApiResponse<ExpertisePageResource>>("/admin/expertise-page");
    return res.data;
  },
  updateExpertisePage: async (data: ExpertisePageResource): Promise<ExpertisePageResource> => {
    const res = await adminFetch<ApiResponse<ExpertisePageResource>>("/admin/expertise-page", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Customer Experience Page
  getCustomerExperiencePage: async (): Promise<CustomerExperiencePageResource> => {
    const res = await adminFetch<ApiResponse<CustomerExperiencePageResource>>("/admin/customer-experience-page");
    return res.data;
  },
  updateCustomerExperiencePage: async (data: CustomerExperiencePageResource): Promise<CustomerExperiencePageResource> => {
    const res = await adminFetch<ApiResponse<CustomerExperiencePageResource>>("/admin/customer-experience-page", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Case Studies Page
  getCaseStudiesPage: async (): Promise<CaseStudiesPageResource> => {
    const res = await adminFetch<ApiResponse<CaseStudiesPageResource>>("/admin/case-studies-page");
    return res.data;
  },
  updateCaseStudiesPage: async (data: CaseStudiesPageResource): Promise<CaseStudiesPageResource> => {
    const res = await adminFetch<ApiResponse<CaseStudiesPageResource>>("/admin/case-studies-page", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Blog Page
  getBlogPage: async (): Promise<BlogPageResource> => {
    const res = await adminFetch<ApiResponse<BlogPageResource>>("/admin/blog-page");
    return res.data;
  },
  updateBlogPage: async (data: BlogPageResource): Promise<BlogPageResource> => {
    const res = await adminFetch<ApiResponse<BlogPageResource>>("/admin/blog-page", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Career Page
  getCareerPage: async (): Promise<CareerPageResource> => {
    const res = await adminFetch<ApiResponse<CareerPageResource>>("/admin/career-page");
    return res.data;
  },
  updateCareerPage: async (data: CareerPageResource): Promise<CareerPageResource> => {
    const res = await adminFetch<ApiResponse<CareerPageResource>>("/admin/career-page", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  // Contact Page
  getContactPage: async (): Promise<ContactPageResource> => {
    const res = await adminFetch<ApiResponse<ContactPageResource>>("/admin/contact-page");
    return res.data;
  },
  updateContactPage: async (data: ContactPageResource): Promise<ContactPageResource> => {
    const res = await adminFetch<ApiResponse<ContactPageResource>>("/admin/contact-page", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },
};
