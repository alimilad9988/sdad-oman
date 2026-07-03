'use client' // <-- ضروري لاستخدام useRouter

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [ip, setIp] = useState('جاري التحميل...');
  
  // جلب IP من API
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('/api/ip');
        const data = await response.json();
        setIp(data.ip);
        console.log('IP:', data.ip);
        // هنا يمكنك إرسال IP إلى أي API خارجي
        // await sendIpToExternalApi(data.ip);
        
      } catch (error) {
        console.error('خطأ في جلب IP:', error);
        setIp('غير متاح');
      }
    };
    
    fetchIp();
  }, []);
  
  const handleClick = () => {
    router.push("/payment");
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start md:justify-between p-4 sm:p-6 md:p-12 lg:p-24 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* البطاقة العلوية */}
      <div className="z-10 w-full max-w-5xl mx-auto rounded-lg shadow-xl bg-white/95 backdrop-blur-sm border border-gray-100 p-6 sm:p-8 md:p-10 mt-4 md:mt-0">
        <div className="flex flex-col items-center">
          <Image
            src="/iconoman.jfif"
            alt="بوابة سداد عُمان"
            width={80}
            height={80}
            priority
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#800000] mt-3 sm:mt-4 font-bold text-center">
            بوابة سداد عُمان
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-1 sm:mt-2 text-center">
            الدفع الإلكتروني الآمن
          </p>
        </div>
      </div>
      
      {/* البطاقة السفلية */}
      <div className="z-10 w-full max-w-5xl mx-auto rounded-lg shadow-xl bg-white mt-4 sm:mt-5 md:mt-6 p-6 sm:p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          {/* الشعار */}
          <div className="mb-4 sm:mb-5 md:mb-6">
            <Image
              src="/iconoman.jfif"
              alt="شعار سداد عُمان"
              width={100}
              height={100}
              priority
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full shadow-md"
            />
          </div>
          
          {/* العنوان */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#800000] mb-4 sm:mb-5 md:mb-6">
            عن سداد عُمان
          </h2>
          
          {/* المحتوى */}
          <div className="space-y-3 sm:space-y-4 text-right max-w-3xl mx-auto w-full">
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              سداد عُمان هي منصة دفع إلكتروني آمنة وسهلة الاستخدام تتيح للمواطنين 
              والمقيمين في سلطنة عمان دفع فواتيرهم ورسومهم الحكومية والخاصة بكل يسر وأمان.
            </p>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              تتميز المنصة بتكاملها مع جميع البنوك المحلية وتوفرها على أعلى معايير 
              الأمان والخصوصية لضمان سلامة معاملاتك المالية.
            </p>
            
            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
              يمكنك استخدام سداد عُمان لدفع فواتير الكهرباء والماء والهاتف والإنترنت 
              والعديد من الخدمات الأخرى.
            </p>
          </div>
          
          {/* زر بدء الخدمة */}
          <button 
            onClick={handleClick} 
            className="mt-6 sm:mt-7 md:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#800000] text-white rounded-lg shadow-md hover:bg-[#600000] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 w-full sm:w-[90%] md:w-[80%] text-base sm:text-lg font-semibold"
          >
            بدء الخدمة
          </button>
        </div>
      </div>
    </main>
  );
}
