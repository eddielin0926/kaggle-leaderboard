import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaggle Leaderboard",
  description: "Display Kaggle leaderboard in histgram chart",
  verification: { google: "__yoJCyddGvDaY3qO4Kp4-D73_qrmd-yfE5WONmK-lI" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
