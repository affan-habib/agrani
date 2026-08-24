import { adminFetch } from "./client";
import {
  ApiResponse,
  ApiPaginatedResponse,
  JobApplicationResource,
  JobApplicationStatus,
  QuoteRequestResource,
  ContactMessageResource,
  NewsletterSubscriberResource,
} from "@/types/admin";
import { ListQueryParams } from "./resources";

// Job Applications
export const jobApplicationsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<JobApplicationResource>>("/admin/job-applications", { params }),
  get: (id: number) => adminFetch<ApiResponse<JobApplicationResource>>(`/admin/job-applications/${id}`).then(r => r.data),
  updateStatus: (id: number, status: JobApplicationStatus) =>
    adminFetch<ApiResponse<JobApplicationResource>>(`/admin/job-applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }).then(r => r.data),
};

// Contact Messages
export const contactsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<ContactMessageResource>>("/admin/contacts", { params }),
  get: (id: number) => adminFetch<ApiResponse<ContactMessageResource>>(`/admin/contacts/${id}`).then(r => r.data),
  updateStatus: (id: number, status: string) =>
    adminFetch<ApiResponse<ContactMessageResource>>(`/admin/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }).then(r => r.data),
};

// Quote Requests
export const quoteRequestsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<QuoteRequestResource>>("/admin/quote-requests", { params }),
  get: (id: number) => adminFetch<ApiResponse<QuoteRequestResource>>(`/admin/quote-requests/${id}`).then(r => r.data),
  updateStatus: (id: number, status: string) =>
    adminFetch<ApiResponse<QuoteRequestResource>>(`/admin/quote-requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }).then(r => r.data),
};

// Newsletter Subscribers
export const newsletterSubscribersApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<NewsletterSubscriberResource>>("/admin/newsletter-subscribers", { params }),
  get: (id: number) => adminFetch<ApiResponse<NewsletterSubscriberResource>>(`/admin/newsletter-subscribers/${id}`).then(r => r.data),
  updateStatus: (id: number, status: "subscribed" | "unsubscribed") =>
    adminFetch<ApiResponse<NewsletterSubscriberResource>>(`/admin/newsletter-subscribers/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }).then(r => r.data),
};
