'use client';

import { useAuthGuard } from "@/hooks/useAuthGuard";
import "./page.module.css";

export default function Home() {
  const { loading } = useAuthGuard();

  if (loading) {
    return <p>Yonlendiriliyor...</p>;
  }
  return <h1>Hello, Next.js!</h1>;
}
