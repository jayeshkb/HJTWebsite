import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.hindujaintemple.org"),
  title: {
    default: "Hindu-Jain Temple | Monroeville, Pennsylvania",
    template: "%s | Hindu-Jain Temple",
  },
  description:
    "A welcoming home for Hindu and Jain worship, cultural programs, and community in Monroeville, Pennsylvania.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Hindu-Jain Temple",
    title: "Hindu-Jain Temple | Monroeville, Pennsylvania",
    description:
      "A welcoming home for Hindu and Jain worship, cultural programs, and community in Monroeville, Pennsylvania.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-US">
      <body>{children}</body>
    </html>
  );
}
