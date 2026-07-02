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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-50">
      {/* البطاقة العلوية */}
      <div className="z-10 w-full flex-col mx-auto max-w-5xl items-center justify-between rounded-lg shadow-xl bg-white/95 backdrop-blur-sm text-sm lg:flex p-10 border border-gray-100">
        <Image
          src="/iconoman.jfif"
          alt="بوابة سداد عُمان"
          width={100}
          height={100}
          priority
          className="mx-auto"
        />
        {/* عرض IP (للاختبار فقط - يمكنك حذف هذا السطر) */}
        <p className="text-4xl text-[#800000] mt-4 font-bold text-center">
          بوابة سداد عُمان
        </p>
        <p className="text-lg text-gray-600 mt-2 text-center">
          الدفع الإلكتروني الآمن
        </p>
      </div>
      
      {/* البطاقة السفلية */}
      <div className="z-10 w-full max-w-5xl mx-auto p-8 lg:p-10 rounded-lg shadow-xl bg-white mt-5">
        <div className="flex flex-col items-center text-center">
          {/* الشعار */}
          <div className="mb-6">
            <Image
              src="/iconoman.jfif"
              alt="شعار سداد عُمان"
              width={120}
              height={120}
              priority
              className="rounded-full shadow-md"
            />
          </div>
          
          {/* العنوان */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#800000] mb-6">
            عن سداد عُمان
          </h1>
          
          {/* المحتوى */}
          <div className="space-y-4 text-right max-w-3xl mx-auto w-full">
            <p className="text-lg text-gray-700 leading-relaxed">
              سداد عُمان هي منصة دفع إلكتروني آمنة وسهلة الاستخدام تتيح للمواطنين 
              والمقيمين في سلطنة عمان دفع فواتيرهم ورسومهم الحكومية والخاصة بكل يسر وأمان.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              تتميز المنصة بتكاملها مع جميع البنوك المحلية وتوفرها على أعلى معايير 
              الأمان والخصوصية لضمان سلامة معاملاتك المالية.
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              يمكنك استخدام سداد عُمان لدفع فواتير الكهرباء والماء والهاتف والإنترنت 
              والعديد من الخدمات الأخرى.
            </p>
          </div>
          
          <button 
            onClick={handleClick} 
            className="mt-8 px-8 py-3 bg-[#800000] text-white rounded-lg shadow-md hover:bg-[#600000] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 w-[90%] md:w-[90%] text-lg font-semibold"
          >
            بدء الخدمة
          </button>
        </div>
      </div>
    </main>
  );
}