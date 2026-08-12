import axiosInstance from "@/lib/axios";
import { Category } from "@/lib/api/tours";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CreateCategoryInput = {
  name: string;
  description?: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export async function createCategory(
  input: CreateCategoryInput
): Promise<Category> {
  const { data } = await axiosInstance.post<ApiResponse<Category>>(
    "/categories",
    input
  );
  return data.data;
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<Category> {
  const { data } = await axiosInstance.patch<ApiResponse<Category>>(
    `/categories/${id}`,
    input
  );
  return data.data;
}

export async function deleteCategory(id: string): Promise<Category> {
  const { data } = await axiosInstance.delete<ApiResponse<Category>>(
    `/categories/${id}`
  );
  return data.data;
}
