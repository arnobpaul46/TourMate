"use client";

import { inputClass, labelClass } from "@/lib/constants/formStyles";
import { getApiErrorMessage } from "@/lib/utils/apiError";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type RegisterResponse = {
  success: boolean;
  message: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await axiosInstance.post<RegisterResponse>(
        "/auth/register",
        { name, email, password }
      );

      toast.success(data.message || "Registration successful");
      router.push("/login");
    } catch (error: unknown) {
      toast.error(
        getApiErrorMessage(error, "Registration failed. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border-0 bg-transparent p-0 sm:border sm:border-slate-800 sm:bg-slate-800/50 sm:p-8 sm:backdrop-blur-xl">
      <h1 className="text-2xl font-bold text-white">Create account</h1>
      <p className="mt-2 text-sm text-slate-400">
        Join TourMate to book your next adventure
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="John Doe"
          />
        </div>

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
            placeholder="At least 6 characters"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 w-full rounded-full bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-emerald-400 hover:text-emerald-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
