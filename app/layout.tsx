"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/registry/header/header";
import { AppSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["monospace"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/" || pathname === "/login";

  return (
    <html lang="en">
      <head>
        <link
          href="https://db.onlinewebfonts.com/c/76614a7aa12ccd71628bc50ad3d80264?family=Geon+Expanded+Medium"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
            <SidebarProvider defaultOpen={false}>
              {!isLoginPage && (
                <div className="fixed top-0 left-0 w-full h-1.5 z-50">
                  <Image
                    src="/bosch-banner.jpeg"
                    alt="Bosch Banner"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {!isLoginPage && (
                <div className="fixed top-1.5 left-0 w-full z-40 bg-white shadow-sm">
                  <Header />
                </div>
              )}

              {!isLoginPage ? (
                    <div className="flex pt-10 w-full overflow-hidden">
                      <AppSidebar  />
                      <main className="h-full bg-gray-50 w-full py-3 px-2 overflow-y-auto">
                        {children}
                      </main>
                    </div>
              ) : (
                <main className="h-[99vh] w-full bg-linear-to-b from-[#d0e7ff] to-[#f0f8ff] flex items-center justify-center p-4">
                  {children}
                </main>
              )}
            </SidebarProvider>

        <Toaster position="top-right" />
      </body> 
    </html>
  );
}
