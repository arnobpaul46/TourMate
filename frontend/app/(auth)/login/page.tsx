"use client";

import { inputClass, labelClass } from "@/lib/constants/formStyles";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import axiosInstance from "@/lib/axios";
import { useAuth, User } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
};

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await axiosInstance.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { user, accessToken } = data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      setAuth(user, accessToken);

      toast.success(data.message || "Logged in successfully");

      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard/bookings");
      }
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Login failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border-0 bg-transparent p-0 sm:border sm:border-slate-800 sm:bg-slate-800/50 sm:p-8 sm:backdrop-blur-xl">
      <h1 className="text-2xl font-bold text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-400">
        Sign in to your TourMate account
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 w-full rounded-full bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-emerald-400 hover:text-emerald-300"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
