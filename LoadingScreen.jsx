import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState('جاري التحميل...');
  const [progress, setProgress] = useState(0);

  const loadingMessages = [
    'جاري تحضير النظام...',
    'تحميل البيانات...',
    'تفعيل الذكاء الاصطناعي...',
    'إعداد المزامنة...',
    'تجهيز الواجهة...',
    'أهلاً بك في مدينة سوسنا! 🎉'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 400],
              y: [0, Math.random() * 800],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="text-center z-10">
        {/* شعار متحرك */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-4xl font-bold text-white"
            >
              س
            </motion.span>
          </div>
        </motion.div>

        {/* اسم التطبيق */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl font-bold text-white mb-2"
        >
          مدينة سوسنا
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-xl text-blue-100 mb-8"
        >
          نظام إدارة المبيعات الذكي
        </motion.p>

        {/* شريط التقدم */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-80 mx-auto mb-6"
        >
          <div className="bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-white/80 text-sm mt-2">{Math.round(progress)}%</p>
        </motion.div>

        {/* نص التحميل */}
        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-white/90 text-lg"
        >
          {loadingText}
        </motion.p>

        {/* نقاط متحركة */}
        <div className="flex justify-center mt-4 space-x-1 space-x-reverse">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

