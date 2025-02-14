import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


 const inter = Inter({
     weight: ['400', '700'],
     style: ['normal', 'italic'],
     subsets: ['latin'],
     display: 'swap',
 });

export const metadata: Metadata = {
  title: {
      template:"%s | AK Proleter",
      default:"AK Proleter"

  },
  description: "Atletski Klub Proleter Zrenjanin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
