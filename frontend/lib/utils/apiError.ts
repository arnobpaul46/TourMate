import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message as string;
  }
  return fallback;
}
