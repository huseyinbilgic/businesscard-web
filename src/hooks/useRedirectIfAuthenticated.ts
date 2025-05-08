"use client";
import { RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export const useRedirectIfAuthenticated = () => {
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isInitialized = useSelector((state: RootState) => state.auth.isInitialized);


  useEffect(() => {
    if (!isInitialized) return;
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isInitialized, isLoggedIn, router]);
};
