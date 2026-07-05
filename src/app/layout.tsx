import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PageViewTracker from "@/components/PageViewTracker";
import PostHogProvider from "@/components/PostHogProvider";

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
  title: "Erken Systems — Smart Business Systems Builder",
  description:
    "I build smart systems for businesses. AI is part of every system, but the system is the product. Voice agents, workflow automations, CRM integrations, dashboards — built by an operator, not an agency.",
  metadataBase: new URL("https://erken.systems"),
  openGraph: {
    title: "Erken Systems — Smart Business Systems Builder",
    description:
      "Voice agents, workflows, dashboards — built into one system that runs your business while you focus on the work that matters.",
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
        <PostHogProvider
          apiKey={process.env.POSTHOG_KEY || ""}
          host={process.env.POSTHOG_HOST || "https://us.i.posthog.com"}
        />
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
