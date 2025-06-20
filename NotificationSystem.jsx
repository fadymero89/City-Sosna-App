import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react';

const NotificationSystem = ({ notifications }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'warning':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'from-green-500 to-emerald-600';
      case 'error':
        return 'from-red-500 to-pink-600';
      case 'warning':
        return 'from-yellow-500 to-orange-600';
      default:
        return 'from-blue-500 to-cyan-600';
    }
  };

  const playNotificationSound = (type) => {
    if (!soundEnabled) return;
    
    // محاكاة أصوات مختلفة للإشعارات
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // تردد مختلف لكل نوع إشعار
    const frequencies = {
      success: [523, 659, 784], // C-E-G
      error: [392, 311], // G-Eb
      warning: [440, 554], // A-C#
      info: [523, 659] // C-E
    };
    
    const freq = frequencies[type] || frequencies.info;
    
    freq.forEach((f, i) => {
      setTimeout(() => {
        oscillator.frequency.setValueAtTime(f, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        if (i === 0) {
          oscillator.start(audioContext.currentTime);
        }
        if (i === freq.length - 1) {
          oscillator.stop(audioContext.currentTime + 0.1);
        }
      }, i * 100);
    });
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      playNotificationSound(latestNotification.type);
    }
  }, [notifications, soundEnabled]);

  return (
    <>
      {/* زر التحكم في الصوت */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-20 left-4 w-12 h-12 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full shadow-lg flex items-center justify-center z-50"
      >
        {soundEnabled ? (
          <Volume2 className="w-5 h-5 text-white" />
        ) : (
          <VolumeX className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* حاوية الإشعارات */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30 
                }}
                className={`bg-gradient-to-r ${colorClass} rounded-2xl p-4 shadow-2xl text-white relative overflow-hidden`}
              >
                {/* تأثير الوهج */}
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                
                <div className="relative z-10 flex items-start space-x-3 space-x-reverse">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex-shrink-0"
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm font-medium leading-relaxed"
                    >
                      {notification.message}
                    </motion.p>
                  </div>
                </div>

                {/* شريط التقدم */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-white/30"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: "linear" }}
                />

                {/* تأثير النبضة */}
                <motion.div
                  className="absolute inset-0 border-2 border-white/50 rounded-2xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* إشعار عائم للحالة */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
          >
            <Bell className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default NotificationSystem;

