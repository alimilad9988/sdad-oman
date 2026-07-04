'use client'

import { useEffect } from 'react';
import { Geist, Geist_Mono, Tajawal } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "بوابة سداد عُمان",
  description: "بوابة الدفع الإلكتروني الآمن في سلطنة عُمان",
};

export default function RootLayout({ children }) {
  useEffect(() => {
    // ====== منع الرجوع ======
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Backspace' || (e.altKey && e.key === 'ArrowLeft')) {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    // ====== إخفاء المسار ======
    const hidePath = () => {
      if (window.location.pathname !== '/') {
        sessionStorage.setItem('realPath', window.location.pathname);
        window.history.replaceState(null, '', '/');
      }
    };

    hidePath();

    // مراقبة التغييرات
    const interval = setInterval(hidePath, 500);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} ${tajawal.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#800000" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col font-tajawal bg-gradient-to-br from-gray-50 to-gray-100">
        {children}
      </body>
    </html>
  );
}
