import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { HealthProvider } from "../context/HealthContext";
import { AppShell } from "../components/layout/AppShell";

export const metadata: Metadata = {
  title: "AAHMS — Autonomous Astronaut Health Monitoring System",
  description: "NASA Space Apps Challenge 2026: Health Monitoring Software for Astronauts on Long-Duration Space Missions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-[#F4F6F4] text-[#172A2B]">
        <AuthProvider>
          <HealthProvider>
            <AppShell>
              {children}
            </AppShell>
          </HealthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
