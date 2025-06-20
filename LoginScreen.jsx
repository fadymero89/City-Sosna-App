import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Smartphone, Fingerprint, Shield, Sparkles, UserPlus, Settings } from 'lucide-react';
import biometricAuth from '../utils/biometricAuth';

const LoginScreen = ({ onLogin, onShowRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // password, fingerprint, face
  const [particles, setParticles] = useState([]);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [availableAuthenticators, setAvailableAuthenticators] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // فحص دعم البصمة
    const checkBiometricSupport = async () => {
      setBiometricSupported(biometricAuth.isSupported);
      setBiometricRegistered(biometricAuth.hasBiometricRegistered());
      
      if (biometricAuth.isSupported) {
        const authenticators = await biometricAuth.getAvailableAuthenticators();
        setAvailableAuthenticators(authenticators);
      }
    };

    checkBiometricSupport();

    // إنشاء جسيمات متحركة في الخلفية
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
    }));
    setParticles(newParticles);

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
        y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
      })));
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // عرض الإشعارات
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // تسجيل البصمة
  const handleBiometricRegistration = async () => {
    if (!username) {
      showNotification('يرجى إدخال اسم المستخدم أولاً', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await biometricAuth.registerBiometric(username);
      if (result.success) {
        setBiometricRegistered(true);
        setShowBiometricSetup(false);
        showNotification('تم تسجيل البصمة بنجاح! 🎉', 'success');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // محاكاة عملية تسجيل الدخول
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (username && password) {
      onLogin({
        id: 1,
        name: username,
        role: 'admin',
        avatar: null,
        loginTime: new Date().toISOString(),
        permissions: ['all']
      });
    }

    setIsLoading(false);
  };

  const handleBiometricLogin = async (type) => {
    if (!biometricRegistered) {
      showNotification('لا توجد بصمة مسجلة. يرجى تسجيل البصمة أولاً', 'warning');
      setShowBiometricSetup(true);
      return;
    }

    setIsLoading(true);
    setLoginMethod(type);

    try {
      const result = await biometricAuth.authenticateWithBiometric();
      if (result.success) {
        onLogin({
          id: 1,
          name: result.username,
          role: 'admin',
          avatar: null,
          loginTime: new Date().toISOString(),
          permissions: ['all'],
          loginMethod: 'biometric'
        });
        showNotification('تم تسجيل الدخول بالبصمة بنجاح! 🎉', 'success');
      }
    } catch (error) {
      showNotification(error.message, 'error');
      setLoginMethod('password');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* نظام الإشعارات */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-4 left-4 right-4 z-50"
          >
            <div className={`p-4 rounded-xl backdrop-blur-xl border shadow-lg ${
              notification.type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-100' :
              notification.type === 'error' ? 'bg-red-500/20 border-red-400/30 text-red-100' :
              notification.type === 'warning' ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-100' :
              'bg-blue-500/20 border-blue-400/30 text-blue-100'
            }`}>
              <p className="text-center font-medium">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* خلفية متدرجة متحركة */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* جسيمات متحركة */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute bg-white/10 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="w-full max-w-md"
        >
          {/* بطاقة تسجيل الدخول */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* الشعار والعنوان */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "backOut" }}
                className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-3xl font-bold text-white mb-2"
              >
                مدينة سوسنا
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-blue-100"
              >
                نظام إدارة المبيعات الذكي
              </motion.p>
            </div>

            {/* طرق تسجيل الدخول */}
            <div className="mb-6">
              <div className="flex justify-center space-x-4 space-x-reverse mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLoginMethod('password')}
                  className={`p-3 rounded-xl transition-all ${
                    loginMethod === 'password'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-blue-100'
                  }`}
                >
                  <Shield className="w-5 h-5" />
                </motion.button>

                {biometricSupported && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBiometricLogin('fingerprint')}
                    className={`p-3 rounded-xl transition-all relative ${
                      biometricRegistered 
                        ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                        : 'bg-white/10 text-blue-100'
                    }`}
                  >
                    <Fingerprint className="w-5 h-5" />
                    {biometricRegistered && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                    )}
                  </motion.button>
                )}

                {biometricSupported && !biometricRegistered && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBiometricSetup(true)}
                    className="p-3 rounded-xl bg-yellow-500/20 text-yellow-100 border border-yellow-400/30 transition-all"
                  >
                    <Settings className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* إعداد البصمة */}
              {showBiometricSetup && (
                <motion.div
                  key="biometric-setup"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                  >
                    <Settings className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-white text-lg mb-2">إعداد البصمة</h3>
                  <p className="text-blue-200 text-sm mb-6">
                    سيتم ربط البصمة باسم المستخدم الحالي
                  </p>
                  
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBiometricRegistration}
                      disabled={isLoading || !username}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {isLoading ? 'جاري التسجيل...' : 'تسجيل البصمة'}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowBiometricSetup(false)}
                      className="w-full py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                    >
                      إلغاء
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {loginMethod === 'password' && !showBiometricSetup && (
                <motion.form
                  key="password-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  {/* حقل اسم المستخدم */}
                  <div>
                    <label className="block text-blue-100 text-sm font-medium mb-2">
                      اسم المستخدم
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="أدخل اسم المستخدم"
                      required
                    />
                  </div>

                  {/* حقل كلمة المرور */}
                  <div>
                    <label className="block text-blue-100 text-sm font-medium mb-2">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pr-12"
                        placeholder="أدخل كلمة المرور"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* زر تسجيل الدخول */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2 space-x-reverse">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>جاري تسجيل الدخول...</span>
                      </div>
                    ) : (
                      'تسجيل الدخول'
                    )}
                  </motion.button>
                </motion.form>
              )}

              {loginMethod === 'fingerprint' && !showBiometricSetup && (
                <motion.div
                  key="fingerprint"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-8"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(34, 197, 94, 0.7)',
                        '0 0 0 10px rgba(34, 197, 94, 0)',
                        '0 0 0 0 rgba(34, 197, 94, 0)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
                  >
                    <Fingerprint className="w-12 h-12 text-white" />
                  </motion.div>
                  <p className="text-white text-lg mb-2">ضع إصبعك على المستشعر</p>
                  <p className="text-blue-200 text-sm">للدخول بالبصمة</p>
                  
                  {isLoading && (
                    <div className="mt-4">
                      <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      <p className="text-blue-200 text-sm mt-2">جاري التحقق من البصمة...</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* معلومات البصمة */}
            {biometricSupported && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="text-center mt-4"
              >
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <Fingerprint className="w-4 h-4 text-blue-300" />
                  <span className="text-blue-300 text-xs">
                    {biometricRegistered ? 'البصمة مسجلة ومتاحة' : 'يمكن تسجيل البصمة'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* رابط إنشاء حساب جديد */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-center mt-6"
            >
              <button 
                onClick={onShowRegister}
                className="text-blue-200 hover:text-white transition-colors text-sm"
              >
                إنشاء حساب جديد
              </button>
            </motion.div>
          </div>

          {/* معلومات إضافية */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center mt-6"
          >
            <p className="text-blue-200 text-sm">
              © 2024 مدينة سوسنا للأدوات المنزلية
            </p>
            <p className="text-blue-300 text-xs mt-1">
              تصميم: المهندس فادي إسحق فوزي
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginScreen;

