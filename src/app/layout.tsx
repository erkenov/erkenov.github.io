import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PageViewTracker from "@/components/PageViewTracker";
import PostHogProvider from "@/components/PostHogProvider";
import GhlWidgetLoader from "@/components/GhlWidgetLoader";

/* Self-hosted variable fonts (2026-08-23): next/font/google fetches from
   Google Fonts at BUILD time, and that fetch started hanging on this
   machine (two builds wedged for 20+ min while curl succeeded). The
   variable latin woff2 files now live in ./fonts/ — zero build-time
   network, same CSS variables, same look. */
const inter = localFont({
  src: "./fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMonoVariable.woff2",
  variable: "--font-jetbrains",
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
        <GhlWidgetLoader />
        {children}
      </body>
    </html>
  );
}
