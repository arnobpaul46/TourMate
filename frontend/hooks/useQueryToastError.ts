"use client";

import { getApiErrorMessage } from "@/lib/utils/apiError";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useQueryToastError(
  isError: boolean,
  error: unknown,
  fallbackMessage: string
) {
  const hasToasted = useRef(false);

  useEffect(() => {
    if (isError && !hasToasted.current) {
      hasToasted.current = true;
      toast.error(getApiErrorMessage(error, fallbackMessage));
    }
    if (!isError) {
      hasToasted.current = false;
    }
  }, [isError, error, fallbackMessage]);
}
