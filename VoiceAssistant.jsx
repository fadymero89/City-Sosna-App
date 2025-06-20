// نظام المساعد الذكي الصوتي
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Users,
  Package,
  DollarSign,
  Calendar,
  Clock,
  Zap
} from 'lucide-react';

const VoiceAssistant = ({ user, addNotification }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [insights, setInsights] = useState([]);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const insightTimerRef = useRef(null);

  // بيانات تجريبية للرؤى التجارية
  const businessInsights = [
    {
      type: 'trend',
      icon: TrendingUp,
      title: 'اتجاه المبيعات',
      message: 'مبيعات اليوم أعلى بنسبة 15% من الأمس. استمر في هذا الأداء الممتاز!',
      priority: 'high',
      action: 'عرض التفاصيل'
    },
    {
      type: 'alert',
      icon: AlertTriangle,
      title: 'تنبيه المخزون',
      message: 'منتج "الهاتف الذكي" أوشك على النفاد. متبقي 5 قطع فقط.',
      priority: 'urgent',
      action: 'طلب مخزون'
    },
    {
      type: 'suggestion',
      icon: Lightbulb,
      title: 'اقتراح ذكي',
      message: 'يمكنك زيادة الأرباح بنسبة 8% عبر تطبيق خصم 5% على المنتجات البطيئة الحركة.',
      priority: 'medium',
      action: 'تطبيق الاقتراح'
    },
    {
      type: 'performance',
      icon: BarChart3,
      title: 'أداء الفريق',
      message: 'أحمد محمد حقق أعلى مبيعات هذا الأسبوع بقيمة 12,500 جنيه.',
      priority: 'info',
      action: 'عرض التقرير'
    },
    {
      type: 'customer',
      icon: Users,
      title: 'عميل مهم',
      message: 'العميل "شركة النور" لم يقم بطلبية منذ 15 يوم. قد يحتاج متابعة.',
      priority: 'medium',
      action: 'اتصال بالعميل'
    }
  ];

  // الأوامر الصوتية المدعومة
  const voiceCommands = {
    'عرض المبيعات': () => handleCommand('sales'),
    'إضافة منتج': () => handleCommand('add_product'),
    'البحث عن عميل': () => handleCommand('search_customer'),
    'إنشاء فاتورة': () => handleCommand('create_invoice'),
    'عرض التقارير': () => handleCommand('reports'),
    'حالة المخزون': () => handleCommand('inventory'),
    'مساعدة': () => handleCommand('help'),
    'إغلاق المساعد': () => setIsVisible(false),
    'أهلا': () => handleGreeting(),
    'شكرا': () => handleThanks()
  };

  useEffect(() => {
    // تهيئة التعرف على الصوت
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ar-SA';

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        processVoiceCommand(speechResult);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('خطأ في التعرف على الصوت:', event.error);
        setIsListening(false);
        addNotification('حدث خطأ في التعرف على الصوت', 'error');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // تهيئة تحويل النص إلى كلام
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // بدء عرض الرؤى التجارية
    startInsightRotation();

    return () => {
      if (insightTimerRef.current) {
        clearInterval(insightTimerRef.current);
      }
    };
  }, []);

  const startInsightRotation = () => {
    setInsights(businessInsights);
    insightTimerRef.current = setInterval(() => {
      setCurrentInsight(prev => (prev + 1) % businessInsights.length);
    }, 8000);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if (synthRef.current && voiceEnabled) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    }
  };

  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase();
    let commandFound = false;

    // البحث عن الأوامر المطابقة
    Object.keys(voiceCommands).forEach(key => {
      if (lowerCommand.includes(key.toLowerCase())) {
        voiceCommands[key]();
        commandFound = true;
      }
    });

    if (!commandFound) {
      const response = `عذراً، لم أفهم الأمر "${command}". يمكنك قول "مساعدة" لمعرفة الأوامر المتاحة.`;
      setResponse(response);
      speak(response);
    }

    // إضافة إلى تاريخ المحادثة
    setConversationHistory(prev => [...prev, {
      type: 'user',
      message: command,
      timestamp: new Date()
    }, {
      type: 'assistant',
      message: response,
      timestamp: new Date()
    }]);
  };

  const handleCommand = (commandType) => {
    let response = '';
    
    switch (commandType) {
      case 'sales':
        response = 'إجمالي مبيعات اليوم 8,500 جنيه من 23 فاتورة. أداء ممتاز!';
        break;
      case 'add_product':
        response = 'سأفتح صفحة إضافة منتج جديد لك الآن.';
        // يمكن إضافة منطق للانتقال لصفحة إضافة المنتج
        break;
      case 'search_customer':
        response = 'ما اسم العميل الذي تريد البحث عنه؟';
        break;
      case 'create_invoice':
        response = 'سأفتح صفحة إنشاء فاتورة جديدة لك.';
        break;
      case 'reports':
        response = 'تقارير هذا الشهر تظهر نمو 12% في المبيعات مقارنة بالشهر الماضي.';
        break;
      case 'inventory':
        response = 'لديك 156 منتج في المخزون. 3 منتجات تحتاج إعادة طلب.';
        break;
      case 'help':
        response = 'يمكنك قول: عرض المبيعات، إضافة منتج، البحث عن عميل، إنشاء فاتورة، عرض التقارير، أو حالة المخزون.';
        break;
      default:
        response = 'كيف يمكنني مساعدتك اليوم؟';
    }

    setResponse(response);
    speak(response);
    addNotification(response, 'info');
  };

  const handleGreeting = () => {
    const greetings = [
      `أهلاً بك ${user?.name || 'عزيزي'}! كيف يمكنني مساعدتك اليوم؟`,
      `مرحباً ${user?.name || 'صديقي'}! أنا هنا لمساعدتك في إدارة أعمالك.`,
      `أهلاً وسهلاً! جاهز لمساعدتك في أي شيء تحتاجه.`
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    setResponse(greeting);
    speak(greeting);
  };

  const handleThanks = () => {
    const thanks = [
      'العفو! أنا سعيد لمساعدتك.',
      'لا شكر على واجب! أنا هنا دائماً.',
      'تسلم! استمتع بيومك.'
    ];
    const thank = thanks[Math.floor(Math.random() * thanks.length)];
    setResponse(thank);
    speak(thank);
  };

  const handleInsightAction = (insight) => {
    addNotification(`تم تنفيذ: ${insight.action}`, 'success');
    speak(`تم ${insight.action} بنجاح`);
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled) {
      speak('تم تفعيل الصوت');
    }
  };

  const currentInsightData = insights[currentInsight];

  return (
    <>
      {/* زر المساعد العائم */}
      <motion.button
        className="fixed bottom-20 left-4 w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(!isVisible)}
        animate={{
          boxShadow: isListening ? '0 0 20px rgba(147, 51, 234, 0.6)' : '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <Brain className="w-6 h-6 text-white" />
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-300"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* واجهة المساعد */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md max-h-[80vh] overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* رأس المساعد */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">المساعد الذكي</h3>
                      <p className="text-sm opacity-90">
                        {isListening ? 'أستمع إليك...' : 'جاهز للمساعدة'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={toggleVoice}
                      className="p-2 bg-white/20 rounded-full"
                    >
                      {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setIsVisible(false)}
                      className="p-2 bg-white/20 rounded-full"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              {/* الرؤى التجارية */}
              {currentInsightData && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <motion.div
                    key={currentInsight}
                    className={`p-3 rounded-lg ${
                      currentInsightData.priority === 'urgent' ? 'bg-red-50 border border-red-200' :
                      currentInsightData.priority === 'high' ? 'bg-green-50 border border-green-200' :
                      currentInsightData.priority === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <currentInsightData.icon className={`w-5 h-5 mt-1 ${
                        currentInsightData.priority === 'urgent' ? 'text-red-500' :
                        currentInsightData.priority === 'high' ? 'text-green-500' :
                        currentInsightData.priority === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                          {currentInsightData.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {currentInsightData.message}
                        </p>
                        <button
                          onClick={() => handleInsightAction(currentInsightData)}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
                        >
                          {currentInsightData.action}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* منطقة المحادثة */}
              <div className="p-4 max-h-60 overflow-y-auto">
                {transcript && (
                  <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>أنت:</strong> {transcript}
                    </p>
                  </div>
                )}
                
                {response && (
                  <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      <strong>المساعد:</strong> {response}
                    </p>
                  </div>
                )}

                {!transcript && !response && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">
                      اضغط على الميكروفون وابدأ الحديث
                    </p>
                  </div>
                )}
              </div>

              {/* أزرار التحكم */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center space-x-4 space-x-reverse">
                  <motion.button
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isListening ? stopListening : startListening}
                    animate={{
                      scale: isListening ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: isListening ? Infinity : 0
                    }}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </motion.button>
                </div>
                
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-500">
                    {isListening ? 'اضغط لإيقاف التسجيل' : 'اضغط للبدء في الحديث'}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceAssistant;

