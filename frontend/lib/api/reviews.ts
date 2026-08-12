import axiosInstance from "@/lib/axios";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CreateReviewInput = {
  tourPackageId: string;
  rating: number;
  comment?: string;
};

export async function createReview(input: CreateReviewInput) {
  const { data } = await axiosInstance.post<ApiResponse<unknown>>(
    "/reviews",
    input
  );
  return data;
}
