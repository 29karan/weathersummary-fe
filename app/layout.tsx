import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/MantineProvider";

export const metadata: Metadata = {
  title: "UK Weather Dashboard",
  description: "Regional weather data and climate statistics for the United Kingdom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
