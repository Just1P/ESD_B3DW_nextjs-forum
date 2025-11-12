import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-md p-8 shadow-sm">
          {children}
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/auth-image.jpg"
          alt="Authentification"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
