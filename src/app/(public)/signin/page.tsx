"use client";

import AuthLayout from "@/components/app/auth/AuthLayout";
import { SignInForm } from "@/components/app/forms/SignInForm";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/");
    }
  }, [session, isPending, router]);

  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
