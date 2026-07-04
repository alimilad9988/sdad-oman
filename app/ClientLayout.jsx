// app/ClientLayout.jsx
'use client'

import { useEffect } from 'react';

export default function ClientLayout({ children }) {
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
    
    // مراقبة التغييرات
    const interval = setInterval(hidePath, 500);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
}
