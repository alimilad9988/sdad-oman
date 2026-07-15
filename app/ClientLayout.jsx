// app/ClientLayout.jsx
'use client'

import { useEffect } from 'react';

export default function ClientLayout({ children }) {
  useEffect(() => {
    // ====== منع الرجوع فقط (بدون منع Backspace) ======
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };

    // تم تعديل هذا الجزء - لم نعد نمنع Backspace
    // لإتاحة حذف النص في حقول الإدخال
    const handleKeyDown = (e) => {
      // نمنع فقط Alt+ArrowLeft (الرجوع للخلف في المتصفح)
      // لكن لا نمنع Backspace حتى يتمكن المستخدم من الحذف
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <>{children}</>;
}
