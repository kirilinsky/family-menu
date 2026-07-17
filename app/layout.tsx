import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/auth";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PadMenu",
  description: "Family menu",
  // Belt & suspenders with <html translate="no">: Google Translate rewrites
  // DOM text nodes under React and crashes reconciliation (insertBefore errors)
  other: { google: "notranslate" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    // translate="no": Google Translate mutates the DOM under React and crashes it
    <html lang="ru" translate="no" className={inter.variable}>
      <body className="flex">
        <ClerkProvider appearance={{ theme: shadcn }}>
          <Sidebar isAdmin={session?.isAdmin ?? false} />
          <div className="min-h-screen flex-1">{children}</div>
        </ClerkProvider>
      </body>
    </html>
  );
}
