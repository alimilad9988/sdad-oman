// app/layout.jsx
import { Geist, Geist_Mono, Tajawal } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tajawal = Tajawal({
  weight: ["400", "700", "900"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
});

// ✅ Metadata في Server Component (بدون 'use client')
export const metadata = {
  title: "بوابة سداد عُمان",
  description: "بوابة الدفع الإلكتروني الآمن في سلطنة عُمان",
  openGraph: {
    title: "بوابة سداد عُمان",
    description: "بوابة الدفع الإلكتروني الآمن في سلطنة عُمان",
    images: [
      {
        url: "https://raw.githubusercontent.com/alimilad9988/sdad-oman/refs/heads/main/public/img.jpg",
        width: 1200,
        height: 630,
        alt: "بوابة سداد عُمان",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "بوابة سداد عُمان",
    description: "بوابة الدفع الإلكتروني الآمن في سلطنة عُمان",
    images: ["https://raw.githubusercontent.com/alimilad9988/sdad-oman/refs/heads/main/public/img.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#800000" />
        
        {/* منع التخزين المؤقت */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="min-h-full flex flex-col font-tajawal bg-gradient-to-br from-gray-50 to-gray-100">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
  }
