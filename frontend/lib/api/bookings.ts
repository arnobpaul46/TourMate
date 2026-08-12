import axiosInstance from "@/lib/axios";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type CreateBookingInput = {
  tourPackageId: string;
  travelDate: string;
  guests: number;
};

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type BookingTourPackage = {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: number;
};

export type BookingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Booking = {
  id: string;
  tourPackageId: string;
  userId: string;
  travelDate: string;
  guests: number;
  totalPrice: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  tourPackage: BookingTourPackage;
  user?: BookingUser;
};

export type UpdateBookingStatusInput = {
  bookingStatus?: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus?: PaymentStatus;
};

export async function createBooking(
  input: CreateBookingInput
): Promise<Booking> {
  const { data } = await axiosInstance.post<ApiResponse<Booking>>(
    "/bookings",
    input
  );
  return data.data;
}

export async function fetchBookings(): Promise<Booking[]> {
  const { data } = await axiosInstance.get<ApiResponse<Booking[]>>("/bookings");
  return data.data;
}

export async function cancelBooking(id: string): Promise<Booking> {
  const { data } = await axiosInstance.delete<ApiResponse<Booking>>(
    `/bookings/${id}`
  );
  return data.data;
}

export async function updateBookingStatus(
  id: string,
  input: UpdateBookingStatusInput
): Promise<Booking> {
  const { data } = await axiosInstance.patch<ApiResponse<Booking>>(
    `/bookings/${id}/status`,
    input
  );
  return data.data;
}
