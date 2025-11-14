"use client";

import { SUCCESS_MESSAGES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const oauthSuccess = searchParams.get("oauth");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Erreur lors de la connexion avec le fournisseur OAuth");

      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname + url.search);
    } else if (oauthSuccess === "success") {
      toast.success(SUCCESS_MESSAGES.SIGN_IN);

      const url = new URL(window.location.href);
      url.searchParams.delete("oauth");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  return null;
}
