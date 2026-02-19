import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { isAuthenticated } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prepwise",
  description: "An AI interview platform which helps you prepare for interviews",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isUserAuthenticated = await isAuthenticated();

  // if(!isUserAuthenticated) redirect('/sign-in');

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pattern`}
      >
        {children}
        <Toaster
          theme="dark"
          richColors
          toastOptions={{
            classNames: {
              toast:
                "bg-dark-200 border border-primary-200/60 text-light-100 rounded-2xl shadow-lg",
              title: "text-light-100 font-semibold",
              description: "text-light-200 text-sm",
              actionButton:
                "bg-primary-200 text-dark-100 font-semibold rounded-full px-3 py-1 hover:bg-primary-200/80",
              cancelButton:
                "bg-dark-100 text-light-100 rounded-full px-3 py-1 border border-input hover:bg-dark-200",
              icon: "text-primary-200",
              closeButton: "text-light-200 hover:text-light-100",
            },
          }}
        />
      </body>
    </html>
  );
}
