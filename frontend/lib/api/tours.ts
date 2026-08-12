import axiosInstance from "@/lib/axios";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type TourPackage = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  images: string[];
  categoryId: string;
  category?: Category;
  reviewCount?: number;
  avgRating?: number;
};

export type Review = {
  id: string;
  rating: number;
  comment?: string | null;
  userId: string;
  tourPackageId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type TourPackageDetail = TourPackage & {
  reviews: Review[];
};

type ApiListResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type TourPackagesQuery = {
  searchTerm?: string;
  search?: string;
  categoryId?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "price" | "createdAt" | "title" | "duration";
  sortOrder?: "asc" | "desc";
};

function normalizeTourPackageParams(
  params: TourPackagesQuery = {}
): Record<string, string | number | undefined> {
  const query: Record<string, string | number | undefined> = {};

  const search = params.searchTerm?.trim() || params.search?.trim();
  if (search) query.searchTerm = search;

  if (params.categoryId) query.categoryId = params.categoryId;
  if (params.category) query.category = params.category;
  if (params.minPrice !== undefined) query.minPrice = params.minPrice;
  if (params.maxPrice !== undefined) query.maxPrice = params.maxPrice;
  if (params.page !== undefined) query.page = params.page;
  if (params.limit !== undefined) query.limit = params.limit;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortOrder) query.sortOrder = params.sortOrder;

  return query;
}

export type TourPackagesResult = {
  data: TourPackage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await axiosInstance.get<ApiListResponse<Category[]>>(
    "/categories"
  );
  return data.data ?? [];
}

export async function fetchFeaturedTours(limit = 6): Promise<TourPackage[]> {
  const result = await fetchTourPackages({ limit, sortBy: "createdAt", sortOrder: "desc" });
  return result.data;
}

export async function fetchTourPackages(
  params: TourPackagesQuery = {}
): Promise<TourPackagesResult> {
  const { data } = await axiosInstance.get<ApiListResponse<TourPackage[]>>(
    "/tour-packages",
    { params: normalizeTourPackageParams(params) }
  );

  return {
    data: data.data,
    meta: data.meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: data.data.length,
      totalPages: 1,
    },
  };
}

export async function fetchTourPackageById(
  id: string
): Promise<TourPackageDetail | null> {
  try {
    const { data } = await axiosInstance.get<ApiListResponse<TourPackageDetail>>(
      `/tour-packages/${id}`
    );
    return data.data;
  } catch {
    return null;
  }
}

export type CreateTourPackageInput = {
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  categoryId: string;
  images?: string[];
};

export type UpdateTourPackageInput = Partial<CreateTourPackageInput>;

export async function createTourPackage(
  input: CreateTourPackageInput
): Promise<TourPackage> {
  const { data } = await axiosInstance.post<ApiListResponse<TourPackage>>(
    "/tour-packages",
    input
  );
  return data.data;
}

export async function updateTourPackage(
  id: string,
  input: UpdateTourPackageInput
): Promise<TourPackage> {
  const { data } = await axiosInstance.patch<ApiListResponse<TourPackage>>(
    `/tour-packages/${id}`,
    input
  );
  return data.data;
}

export async function deleteTourPackage(id: string): Promise<TourPackage> {
  const { data } = await axiosInstance.delete<ApiListResponse<TourPackage>>(
    `/tour-packages/${id}`
  );
  return data.data;
}
