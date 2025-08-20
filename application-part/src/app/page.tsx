"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // replace() avoids stacking history
  }, [router]);

  return null; // nothing to render since redirect happens immediately
}
