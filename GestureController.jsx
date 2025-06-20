// نظام الإيماءات والتفاعل المتقدم
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Zap, 
  Hand, 
  Smartphone, 
  Vibrate, 
  Volume2, 
  Eye, 
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Maximize,
  Minimize,
  Play,
  Pause,
  FastForward,
  Rewind
} from 'lucide-react';

const GestureController = ({ user, addNotification, onGestureAction }) => {
  const [isActive, setIsActive] = useState(false);
  const [gestureMode, setGestureMode] = useState('swipe');
  const [detectedGesture, setDetectedGesture] = useState(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [sensitivity, setSensitivity] = useState(50);
  
  const containerRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  // أنواع الإيماءات المدعومة
  const gestureTypes = [
    {
      id: 'swipe',
      name: 'السحب',
      icon: Hand,
      description: 'التنقل بالسحب في الاتجاهات'
    },
    {
      id: 'shake',
      name: 'الهز',
      icon: Vibrate,
      description: 'هز الجهاز للتراجع أو التحديث'
    },
    {
      id: 'tilt',
      name: 'الإمالة',
      icon: Smartphone,
      description: 'إمالة الجهاز للتحكم'
    },
    {
      id: 'voice',
      name: 'الصوت',
      icon: Volume2,
      description: 'أوامر صوتية سريعة'
    }
  ];

  // الإيماءات والأوامر المخصصة
  const gestureCommands = {
    'swipe-up': { action: 'scroll-up', name: 'التمرير لأعلى' },
    'swipe-down': { action: 'scroll-down', name: 'التمرير لأسفل' },
    'swipe-left': { action: 'next-page', name: 'الصفحة التالية' },
    'swipe-right': { action: 'prev-page', name: 'الصفحة السابقة' },
    'double-tap': { action: 'quick-action', name: 'إجراء سريع' },
    'long-press': { action: 'context-menu', name: 'قائمة السياق' },
    'pinch-in': { action: 'zoom-out', name: 'تصغير' },
    'pinch-out': { action: 'zoom-in', name: 'تكبير' },
    'shake': { action: 'refresh', name: 'تحديث' },
    'tilt-left': { action: 'sidebar-open', name: 'فتح الشريط الجانبي' },
    'tilt-right': { action: 'sidebar-close', name: 'إغلاق الشريط الجانبي' }
  };

  useEffect(() => {
    if (!isActive) return;

    // إعداد مستشعر الحركة
    const handleDeviceMotion = (event) => {
      if (gestureMode === 'shake') {
        const acceleration = event.accelerationIncludingGravity;
        const threshold = sensitivity / 10;
        
        if (Math.abs(acceleration.x) > threshold || 
            Math.abs(acceleration.y) > threshold || 
            Math.abs(acceleration.z) > threshold) {
          handleGestureDetected('shake');
        }
      }
    };

    // إعداد مستشعر الاتجاه
    const handleDeviceOrientation = (event) => {
      if (gestureMode === 'tilt') {
        const tiltThreshold = sensitivity / 5;
        
        if (event.gamma > tiltThreshold) {
          handleGestureDetected('tilt-right');
        } else if (event.gamma < -tiltThreshold) {
          handleGestureDetected('tilt-left');
        }
      }
    };

    // طلب الإذن للوصول للمستشعرات
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('devicemotion', handleDeviceMotion);
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        }
      });
    } else {
      window.addEventListener('devicemotion', handleDeviceMotion);
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, [isActive, gestureMode, sensitivity]);

  const handleGestureDetected = (gestureType) => {
    const command = gestureCommands[gestureType];
    if (command) {
      setDetectedGesture({ type: gestureType, command });
      
      // تنفيذ الإجراء
      if (onGestureAction) {
        onGestureAction(command.action, gestureType);
      }
      
      // إشعار المستخدم
      addNotification(`تم تنفيذ: ${command.name}`, 'success');
      
      // إخفاء الإشعار بعد ثانيتين
      setTimeout(() => setDetectedGesture(null), 2000);
    }
  };

  // معالجة إيماءات اللمس
  const handleTouchStart = (e) => {
    if (gestureMode !== 'swipe') return;
    
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    currentPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (gestureMode !== 'swipe') return;
    
    const touch = e.touches[0];
    currentPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = () => {
    if (gestureMode !== 'swipe') return;
    
    const deltaX = currentPos.current.x - startPos.current.x;
    const deltaY = currentPos.current.y - startPos.current.y;
    const threshold = sensitivity;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // حركة أفقية
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handleGestureDetected('swipe-right');
        } else {
          handleGestureDetected('swipe-left');
        }
      }
    } else {
      // حركة عمودية
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          handleGestureDetected('swipe-down');
        } else {
          handleGestureDetected('swipe-up');
        }
      }
    }
  };

  const calibrateGestures = () => {
    setIsCalibrating(true);
    addNotification('جاري معايرة الإيماءات...', 'info');
    
    setTimeout(() => {
      setIsCalibrating(false);
      addNotification('تم معايرة الإيماءات بنجاح!', 'success');
    }, 3000);
  };

  return (
    <div className="gesture-controller">
      {/* زر تفعيل الإيماءات */}
      <motion.button
        className={`fixed top-20 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50 ${
          isActive 
            ? 'bg-gradient-to-r from-orange-500 to-red-500' 
            : 'bg-gradient-to-r from-gray-400 to-gray-500'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsActive(!isActive)}
      >
        <Hand className="w-5 h-5 text-white" />
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-orange-300"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* منطقة الكشف عن الإيماءات */}
      {isActive && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-30 pointer-events-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* إشعار الإيماءة المكتشفة */}
      <AnimatePresence>
        {detectedGesture && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className="bg-black/80 text-white px-6 py-3 rounded-full flex items-center space-x-3 space-x-reverse">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="font-medium">{detectedGesture.command.name}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* لوحة إعدادات الإيماءات */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed bottom-20 right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 z-40 w-80"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                التحكم بالإيماءات
              </h3>
              
              {/* اختيار نوع الإيماءة */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {gestureTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setGestureMode(type.id)}
                    className={`p-2 rounded-lg border transition-all ${
                      gestureMode === type.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <type.icon className={`w-4 h-4 mx-auto mb-1 ${
                      gestureMode === type.id ? 'text-orange-600' : 'text-gray-500'
                    }`} />
                    <div className="text-xs">{type.name}</div>
                  </button>
                ))}
              </div>

              {/* شريط الحساسية */}
              <div className="mb-3">
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                  الحساسية: {sensitivity}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* زر المعايرة */}
              <button
                onClick={calibrateGestures}
                disabled={isCalibrating}
                className="w-full p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-sm flex items-center justify-center space-x-2 space-x-reverse"
              >
                {isCalibrating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span>{isCalibrating ? 'جاري المعايرة...' : 'معايرة الإيماءات'}</span>
              </button>
            </div>

            {/* قائمة الأوامر المتاحة */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                الأوامر المتاحة:
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {Object.entries(gestureCommands).map(([gesture, command]) => (
                  <div key={gesture} className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {gesture.replace('-', ' ')}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {command.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestureController;

