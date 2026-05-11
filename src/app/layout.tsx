import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Receptionist for Auto Repair Shops — Shamil Erkenov",
  description:
    "Independent auto repair shops lose $500–$3,000 every time a customer can't reach the phone. We answer every call, qualify the job, and book it into your calendar — 24/7. Built by Shamil Erkenov.",
  metadataBase: new URL("https://shamil.work"),
  openGraph: {
    title: "AI Receptionist for Auto Repair Shops",
    description:
      "Answers every call, qualifies the job, books it into your calendar — 24/7. From $400/month.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
