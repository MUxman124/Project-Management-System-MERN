"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      // If token exists, redirect to admin dashboard
      router.push("/admin/dashboard");
    } else {
      // If no token, stay on the current page or redirect to login
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}