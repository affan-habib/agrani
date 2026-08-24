import { adminFetch } from "./client";
import {
  ApiResponse,
  ApiPaginatedResponse,
  BlogPostResource,
  StoreBlogPostRequest,
  UpdateBlogPostRequest,
  BlogCategoryResource,
  StoreBlogCategoryRequest,
  UpdateBlogCategoryRequest,
  CareerJobResource,
  StoreCareerJobRequest,
  UpdateCareerJobRequest,
  DepartmentResource,
  StoreDepartmentRequest,
  CaseStudyResource,
  StoreCaseStudyRequest,
  UpdateCaseStudyRequest,
  CaseStudyTagResource,
  StoreCaseStudyTagRequest,
  ServiceResource,
  StoreServiceRequest,
  UpdateServiceRequest,
  SectorResource,
  StoreSectorRequest,
  UpdateSectorRequest,
  TechnologyResource,
  StoreTechnologyRequest,
  TechnologyCategoryResource,
  StoreTechnologyCategoryRequest,
  LeadershipMemberResource,
  StoreLeadershipMemberRequest,
  CompanyValueResource,
  StoreCompanyValueRequest,
  CompanyCapabilityResource,
  StoreCompanyCapabilityRequest,
  ExpertiseRoleResource,
  StoreExpertiseRoleRequest,
  MetricResource,
  StoreMetricRequest,
  TestimonialResource,
  StoreTestimonialRequest,
  WhyChooseUsItemResource,
  StoreWhyChooseUsItemRequest,
} from "@/types/admin";

export interface ListQueryParams {
  search?: string;
  status?: string;
  sort?: string;
  page?: number;
  per_page?: number;
  [key: string]: any;
}

// Blog Posts
export const blogPostsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<BlogPostResource>>("/admin/blog-posts", { params }),
  get: (id: number) => adminFetch<ApiResponse<BlogPostResource>>(`/admin/blog-posts/${id}`).then(r => r.data),
  create: (data: StoreBlogPostRequest) => adminFetch<ApiResponse<BlogPostResource>>("/admin/blog-posts", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: UpdateBlogPostRequest) => adminFetch<ApiResponse<BlogPostResource>>(`/admin/blog-posts/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  patch: (id: number, data: Partial<UpdateBlogPostRequest>) => adminFetch<ApiResponse<BlogPostResource>>(`/admin/blog-posts/${id}`, { method: "PATCH", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/blog-posts/${id}`, { method: "DELETE" }),
  publish: (id: number, published_at?: string) => adminFetch<ApiResponse<BlogPostResource>>(`/admin/blog-posts/${id}/publish`, { method: "POST", body: JSON.stringify({ published_at }) }).then(r => r.data),
  unpublish: (id: number) => adminFetch<ApiResponse<BlogPostResource>>(`/admin/blog-posts/${id}/unpublish`, { method: "POST" }).then(r => r.data),
  archive: (id: number) => adminFetch<ApiResponse<BlogPostResource>>(`/admin/blog-posts/${id}/archive`, { method: "POST" }).then(r => r.data),
};

// Blog Categories
export const blogCategoriesApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<BlogCategoryResource>>("/admin/blog-categories", { params }),
  get: (id: number) => adminFetch<ApiResponse<BlogCategoryResource>>(`/admin/blog-categories/${id}`).then(r => r.data),
  create: (data: StoreBlogCategoryRequest) => adminFetch<ApiResponse<BlogCategoryResource>>("/admin/blog-categories", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: UpdateBlogCategoryRequest) => adminFetch<ApiResponse<BlogCategoryResource>>(`/admin/blog-categories/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/blog-categories/${id}`, { method: "DELETE" }),
  publish: (id: number) => adminFetch<ApiResponse<BlogCategoryResource>>(`/admin/blog-categories/${id}/publish`, { method: "POST" }).then(r => r.data),
  unpublish: (id: number) => adminFetch<ApiResponse<BlogCategoryResource>>(`/admin/blog-categories/${id}/unpublish`, { method: "POST" }).then(r => r.data),
  archive: (id: number) => adminFetch<ApiResponse<BlogCategoryResource>>(`/admin/blog-categories/${id}/archive`, { method: "POST" }).then(r => r.data),
};

// Career Jobs
export const careerJobsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<CareerJobResource>>("/admin/jobs", { params }),
  get: (id: number) => adminFetch<ApiResponse<CareerJobResource>>(`/admin/jobs/${id}`).then(r => r.data),
  create: (data: StoreCareerJobRequest) => adminFetch<ApiResponse<CareerJobResource>>("/admin/jobs", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: UpdateCareerJobRequest) => adminFetch<ApiResponse<CareerJobResource>>(`/admin/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/jobs/${id}`, { method: "DELETE" }),
  publish: (id: number) => adminFetch<ApiResponse<CareerJobResource>>(`/admin/jobs/${id}/publish`, { method: "POST" }).then(r => r.data),
  unpublish: (id: number) => adminFetch<ApiResponse<CareerJobResource>>(`/admin/jobs/${id}/unpublish`, { method: "POST" }).then(r => r.data),
  archive: (id: number) => adminFetch<ApiResponse<CareerJobResource>>(`/admin/jobs/${id}/archive`, { method: "POST" }).then(r => r.data),
};

// Departments
export const departmentsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<DepartmentResource>>("/admin/departments", { params }),
  get: (id: number) => adminFetch<ApiResponse<DepartmentResource>>(`/admin/departments/${id}`).then(r => r.data),
  create: (data: StoreDepartmentRequest) => adminFetch<ApiResponse<DepartmentResource>>("/admin/departments", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: Partial<StoreDepartmentRequest>) => adminFetch<ApiResponse<DepartmentResource>>(`/admin/departments/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/departments/${id}`, { method: "DELETE" }),
};

// Case Studies
export const caseStudiesApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<CaseStudyResource>>("/admin/case-studies", { params }),
  get: (id: number) => adminFetch<ApiResponse<CaseStudyResource>>(`/admin/case-studies/${id}`).then(r => r.data),
  create: (data: StoreCaseStudyRequest) => adminFetch<ApiResponse<CaseStudyResource>>("/admin/case-studies", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: UpdateCaseStudyRequest) => adminFetch<ApiResponse<CaseStudyResource>>(`/admin/case-studies/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/case-studies/${id}`, { method: "DELETE" }),
  publish: (id: number) => adminFetch<ApiResponse<CaseStudyResource>>(`/admin/case-studies/${id}/publish`, { method: "POST" }).then(r => r.data),
  unpublish: (id: number) => adminFetch<ApiResponse<CaseStudyResource>>(`/admin/case-studies/${id}/unpublish`, { method: "POST" }).then(r => r.data),
  archive: (id: number) => adminFetch<ApiResponse<CaseStudyResource>>(`/admin/case-studies/${id}/archive`, { method: "POST" }).then(r => r.data),
};

// Case Study Tags
export const caseStudyTagsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<CaseStudyTagResource>>("/admin/case-study-tags", { params }),
  get: (id: number) => adminFetch<ApiResponse<CaseStudyTagResource>>(`/admin/case-study-tags/${id}`).then(r => r.data),
  create: (data: StoreCaseStudyTagRequest) => adminFetch<ApiResponse<CaseStudyTagResource>>("/admin/case-study-tags", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: StoreCaseStudyTagRequest) => adminFetch<ApiResponse<CaseStudyTagResource>>(`/admin/case-study-tags/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/case-study-tags/${id}`, { method: "DELETE" }),
};

// Services
export const servicesApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<ServiceResource>>("/admin/services", { params }),
  get: (id: number) => adminFetch<ApiResponse<ServiceResource>>(`/admin/services/${id}`).then(r => r.data),
  create: (data: StoreServiceRequest) => adminFetch<ApiResponse<ServiceResource>>("/admin/services", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: UpdateServiceRequest) => adminFetch<ApiResponse<ServiceResource>>(`/admin/services/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/services/${id}`, { method: "DELETE" }),
  publish: (id: number) => adminFetch<ApiResponse<ServiceResource>>(`/admin/services/${id}/publish`, { method: "POST" }).then(r => r.data),
  unpublish: (id: number) => adminFetch<ApiResponse<ServiceResource>>(`/admin/services/${id}/unpublish`, { method: "POST" }).then(r => r.data),
  archive: (id: number) => adminFetch<ApiResponse<ServiceResource>>(`/admin/services/${id}/archive`, { method: "POST" }).then(r => r.data),
};

// Sectors
export const sectorsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<SectorResource>>("/admin/sectors", { params }),
  get: (id: number) => adminFetch<ApiResponse<SectorResource>>(`/admin/sectors/${id}`).then(r => r.data),
  create: (data: StoreSectorRequest) => adminFetch<ApiResponse<SectorResource>>("/admin/sectors", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: UpdateSectorRequest) => adminFetch<ApiResponse<SectorResource>>(`/admin/sectors/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/sectors/${id}`, { method: "DELETE" }),
  publish: (id: number) => adminFetch<ApiResponse<SectorResource>>(`/admin/sectors/${id}/publish`, { method: "POST" }).then(r => r.data),
  unpublish: (id: number) => adminFetch<ApiResponse<SectorResource>>(`/admin/sectors/${id}/unpublish`, { method: "POST" }).then(r => r.data),
  archive: (id: number) => adminFetch<ApiResponse<SectorResource>>(`/admin/sectors/${id}/archive`, { method: "POST" }).then(r => r.data),
};

// Technologies
export const technologiesApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<TechnologyResource>>("/admin/technologies", { params }),
  get: (id: number) => adminFetch<ApiResponse<TechnologyResource>>(`/admin/technologies/${id}`).then(r => r.data),
  create: (data: StoreTechnologyRequest) => adminFetch<ApiResponse<TechnologyResource>>("/admin/technologies", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: Partial<StoreTechnologyRequest>) => adminFetch<ApiResponse<TechnologyResource>>(`/admin/technologies/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/technologies/${id}`, { method: "DELETE" }),
};

// Technology Categories
export const technologyCategoriesApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<TechnologyCategoryResource>>("/admin/technology-categories", { params }),
  get: (id: number) => adminFetch<ApiResponse<TechnologyCategoryResource>>(`/admin/technology-categories/${id}`).then(r => r.data),
  create: (data: StoreTechnologyCategoryRequest) => adminFetch<ApiResponse<TechnologyCategoryResource>>("/admin/technology-categories", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: StoreTechnologyCategoryRequest) => adminFetch<ApiResponse<TechnologyCategoryResource>>(`/admin/technology-categories/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/technology-categories/${id}`, { method: "DELETE" }),
};

// Leadership Members
export const leadershipApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<LeadershipMemberResource>>("/admin/leadership-members", { params }),
  get: (id: number) => adminFetch<ApiResponse<LeadershipMemberResource>>(`/admin/leadership-members/${id}`).then(r => r.data),
  create: (data: StoreLeadershipMemberRequest) => adminFetch<ApiResponse<LeadershipMemberResource>>("/admin/leadership-members", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: Partial<StoreLeadershipMemberRequest>) => adminFetch<ApiResponse<LeadershipMemberResource>>(`/admin/leadership-members/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/leadership-members/${id}`, { method: "DELETE" }),
};

// Company Values
export const companyValuesApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<CompanyValueResource>>("/admin/company-values", { params }),
  get: (id: number) => adminFetch<ApiResponse<CompanyValueResource>>(`/admin/company-values/${id}`).then(r => r.data),
  create: (data: StoreCompanyValueRequest) => adminFetch<ApiResponse<CompanyValueResource>>("/admin/company-values", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: StoreCompanyValueRequest) => adminFetch<ApiResponse<CompanyValueResource>>(`/admin/company-values/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/company-values/${id}`, { method: "DELETE" }),
};

// Company Capabilities
export const companyCapabilitiesApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<CompanyCapabilityResource>>("/admin/company-capabilities", { params }),
  get: (id: number) => adminFetch<ApiResponse<CompanyCapabilityResource>>(`/admin/company-capabilities/${id}`).then(r => r.data),
  create: (data: StoreCompanyCapabilityRequest) => adminFetch<ApiResponse<CompanyCapabilityResource>>("/admin/company-capabilities", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: StoreCompanyCapabilityRequest) => adminFetch<ApiResponse<CompanyCapabilityResource>>(`/admin/company-capabilities/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/company-capabilities/${id}`, { method: "DELETE" }),
};

// Expertise Roles
export const expertiseRolesApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<ExpertiseRoleResource>>("/admin/expertise-roles", { params }),
  get: (id: number) => adminFetch<ApiResponse<ExpertiseRoleResource>>(`/admin/expertise-roles/${id}`).then(r => r.data),
  create: (data: StoreExpertiseRoleRequest) => adminFetch<ApiResponse<ExpertiseRoleResource>>("/admin/expertise-roles", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: StoreExpertiseRoleRequest) => adminFetch<ApiResponse<ExpertiseRoleResource>>(`/admin/expertise-roles/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/expertise-roles/${id}`, { method: "DELETE" }),
};

// Metrics
export const metricsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<MetricResource>>("/admin/metrics", { params }),
  get: (id: number) => adminFetch<ApiResponse<MetricResource>>(`/admin/metrics/${id}`).then(r => r.data),
  create: (data: StoreMetricRequest) => adminFetch<ApiResponse<MetricResource>>("/admin/metrics", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: StoreMetricRequest) => adminFetch<ApiResponse<MetricResource>>(`/admin/metrics/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/metrics/${id}`, { method: "DELETE" }),
};

// Testimonials
export const testimonialsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<TestimonialResource>>("/admin/testimonials", { params }),
  get: (id: number) => adminFetch<ApiResponse<TestimonialResource>>(`/admin/testimonials/${id}`).then(r => r.data),
  create: (data: StoreTestimonialRequest) => adminFetch<ApiResponse<TestimonialResource>>("/admin/testimonials", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: StoreTestimonialRequest) => adminFetch<ApiResponse<TestimonialResource>>(`/admin/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/testimonials/${id}`, { method: "DELETE" }),
  publish: (id: number) => adminFetch<ApiResponse<TestimonialResource>>(`/admin/testimonials/${id}/publish`, { method: "POST" }).then(r => r.data),
  unpublish: (id: number) => adminFetch<ApiResponse<TestimonialResource>>(`/admin/testimonials/${id}/unpublish`, { method: "POST" }).then(r => r.data),
  archive: (id: number) => adminFetch<ApiResponse<TestimonialResource>>(`/admin/testimonials/${id}/archive`, { method: "POST" }).then(r => r.data),
};

// Why Choose Us Items
export const whyChooseUsApi = {
  list: (params?: ListQueryParams) => adminFetch<ApiPaginatedResponse<WhyChooseUsItemResource>>("/admin/why-choose-us", { params }),
  get: (id: number) => adminFetch<ApiResponse<WhyChooseUsItemResource>>(`/admin/why-choose-us/${id}`).then(r => r.data),
  create: (data: StoreWhyChooseUsItemRequest) => adminFetch<ApiResponse<WhyChooseUsItemResource>>("/admin/why-choose-us", { method: "POST", body: JSON.stringify(data) }).then(r => r.data),
  update: (id: number, data: StoreWhyChooseUsItemRequest) => adminFetch<ApiResponse<WhyChooseUsItemResource>>(`/admin/why-choose-us/${id}`, { method: "PUT", body: JSON.stringify(data) }).then(r => r.data),
  delete: (id: number) => adminFetch(`/admin/why-choose-us/${id}`, { method: "DELETE" }),
};
