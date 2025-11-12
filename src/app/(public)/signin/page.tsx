"use client";

import AuthLayout from "@/components/app/auth/AuthLayout";
import { SignInForm } from "@/components/app/forms/SignInForm";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
