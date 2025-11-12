"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <div className="container py-8">{children}</div>;
}
