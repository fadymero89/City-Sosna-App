// مكون التسجيل المحسن
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, MapPin, Briefcase, Calendar, Check, AlertCircle, Sparkles } from 'lucide-react';

const Register = ({ onRegister, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    businessType: '',
    birthDate: '',
    userType: 'customer' // customer أو employee
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // تقييم قوة كلمة المرور
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [formData.password]);

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
      if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح';
      if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
      else if (!/^01[0-2,5]{1}[0-9]{8}$/.test(formData.phone)) newErrors.phone = 'رقم الهاتف غير صحيح';
    }

    if (stepNumber === 2) {
      if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
      else if (formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
      if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;

    setIsLoading(true);

    try {
      // محاكاة تسجيل المستخدم
      await new Promise(resolve => setTimeout(resolve, 2000));

      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        businessType: formData.businessType,
        userType: formData.userType,
        registrationDate: new Date().toISOString(),
        isActive: true
      };

      onRegister(userData);
    } catch (error) {
      setErrors({ submit: 'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // إزالة الخطأ عند بدء الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500';
    if (passwordStrength < 50) return 'bg-orange-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'ضعيفة';
    if (passwordStrength < 50) return 'متوسطة';
    if (passwordStrength < 75) return 'جيدة';
    return 'قوية';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية متدرجة متحركة */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-pattern opacity-20" />
        
        {/* جسيمات متحركة */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            {/* الهيدر */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-2">إنشاء حساب جديد</h1>
              <p className="text-white/70">انضم إلى مدينة سوسنا</p>
              
              {/* مؤشر التقدم */}
              <div className="flex items-center justify-center mt-6 space-x-2 space-x-reverse">
                {[1, 2].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step >= stepNumber 
                        ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' 
                        : 'bg-white/20 text-white/60'
                    }`}>
                      {step > stepNumber ? <Check className="w-4 h-4" /> : stepNumber}
                    </div>
                    {stepNumber < 2 && (
                      <div className={`w-8 h-1 mx-2 rounded transition-all duration-300 ${
                        step > stepNumber ? 'bg-gradient-to-r from-green-400 to-blue-500' : 'bg-white/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* نوع المستخدم - العملاء فقط */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">نوع الحساب</label>
                      <div className="grid grid-cols-1 gap-3">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData(prev => ({ ...prev, userType: 'customer' }))}
                          className="p-3 rounded-xl border-2 border-blue-400 bg-blue-500/20 text-white transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse"
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">عميل</span>
                        </motion.button>
                      </div>
                      <p className="text-xs text-white/60 mt-2 text-center">
                        حسابات الموظفين يتم إنشاؤها من قبل الإدارة فقط
                      </p>
                    </div>

                    {/* الاسم */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">الاسم الكامل</label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          className={`w-full pr-12 pl-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                            errors.name ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.name}
                        </motion.p>
                      )}
                    </div>

                    {/* البريد الإلكتروني */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">البريد الإلكتروني</label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          className={`w-full pr-12 pl-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                            errors.email ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    {/* رقم الهاتف */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">رقم الهاتف</label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="01xxxxxxxxx"
                          className={`w-full pr-12 pl-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                            errors.phone ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>

                    {/* زر التالي */}
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    >
                      التالي
                    </motion.button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* كلمة المرور */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="أدخل كلمة المرور"
                          className={`w-full pr-12 pl-12 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                            errors.password ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* مؤشر قوة كلمة المرور */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                            <span>قوة كلمة المرور</span>
                            <span>{getPasswordStrengthText()}</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength}%` }}
                              transition={{ duration: 0.3 }}
                              className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                            />
                          </div>
                        </div>
                      )}
                      
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.password}
                        </motion.p>
                      )}
                    </div>

                    {/* تأكيد كلمة المرور */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">تأكيد كلمة المرور</label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="أعد إدخال كلمة المرور"
                          className={`w-full pr-12 pl-12 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                            errors.confirmPassword ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>

                    {/* العنوان */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">العنوان</label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="أدخل عنوانك"
                          className={`w-full pr-12 pl-4 py-3 bg-white/10 border-2 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 ${
                            errors.address ? 'border-red-400' : 'border-white/30 focus:border-blue-400'
                          }`}
                        />
                      </div>
                      {errors.address && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-xs mt-1 flex items-center"
                        >
                          <AlertCircle className="w-3 h-3 mr-1" />
                          {errors.address}
                        </motion.p>
                      )}
                    </div>

                    {/* نوع العمل (اختياري) */}
                    <div>
                      <label className="block text-white/90 text-sm font-medium mb-2">نوع العمل (اختياري)</label>
                      <div className="relative">
                        <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        <input
                          type="text"
                          name="businessType"
                          value={formData.businessType}
                          onChange={handleInputChange}
                          placeholder="مثال: تجارة، خدمات، صناعة"
                          className="w-full pr-12 pl-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* أزرار التنقل */}
                    <div className="flex space-x-3 space-x-reverse">
                      <motion.button
                        type="button"
                        onClick={handleBack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/30"
                      >
                        السابق
                      </motion.button>
                      
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            جاري التسجيل...
                          </div>
                        ) : (
                          'إنشاء الحساب'
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* رسالة خطأ عامة */}
              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-400 rounded-xl p-3 text-red-400 text-sm text-center"
                >
                  {errors.submit}
                </motion.div>
              )}
            </form>

            {/* رابط العودة لتسجيل الدخول */}
            <div className="text-center mt-6">
              <button
                onClick={onBackToLogin}
                className="text-white/70 hover:text-white text-sm transition-colors duration-300"
              >
                لديك حساب بالفعل؟ <span className="text-blue-400 hover:text-blue-300">سجل الدخول</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;

