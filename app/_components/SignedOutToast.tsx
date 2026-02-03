"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

export default function SignedOutToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const isSignedOut = searchParams.get("signedOut") === "true";
    if (!isSignedOut) return;

    toast.success("Vous avez été déconnecté");

    const url = new URL(window.location.href);
    url.searchParams.delete("signedOut");
    router.replace(url.pathname + url.search);
  }, [searchParams, router]);

  return null;
}
