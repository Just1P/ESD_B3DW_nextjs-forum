"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";

const routesWithoutHeader = ["/signin", "/signup"];

export function ConditionalHeader() {
  const pathname = usePathname();

  if (routesWithoutHeader.includes(pathname)) {
    return null;
  }

  return <Header />;
}
