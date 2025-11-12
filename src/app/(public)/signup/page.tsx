"use client";

import AuthLayout from "@/components/app/auth/AuthLayout";
import { SignUpForm } from "@/components/app/forms/SignUpForm";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
