import React, { useState, useEffect, useRef } from 'react';
import './EgyptianVoiceAssistant.css';

const EgyptianVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [businessInsights, setBusinessInsights] = useState([]);
  const [proactiveAlerts, setProactiveAlerts] = useState([]);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // الأوامر الصوتية باللهجة المصرية
  const egyptianCommands = {
    'عرض المبيعات': () => showSales(),
    'شوف المبيعات': () => showSales(),
    'إيه أخبار المبيعات': () => showSales(),
    'ازاي المبيعات النهاردة': () => showSales(),
    'إضافة منتج': () => addProduct(),
    'ضيف منتج جديد': () => addProduct(),
    'عايز أضيف منتج': () => addProduct(),
    'البحث عن عميل': () => searchCustomer(),
    'دور على عميل': () => searchCustomer(),
    'فين العميل': () => searchCustomer(),
    'إنشاء فاتورة': () => createInvoice(),
    'اعمل فاتورة جديدة': () => createInvoice(),
    'عايز فاتورة': () => createInvoice(),
    'عرض التقارير': () => showReports(),
    'شوف التقارير': () => showReports(),
    'إيه أخبار التقارير': () => showReports(),
    'حالة المخزون': () => checkInventory(),
    'شوف المخزون': () => checkInventory(),
    'إيه اللي في المخزن': () => checkInventory(),
    'مساعدة': () => showHelp(),
    'ساعدني': () => showHelp(),
    'إيه اللي أقدر أعمله': () => showHelp(),
    'صباح الخير': () => greetMorning(),
    'مساء الخير': () => greetEvening(),
    'إزيك': () => greetGeneral(),
    'أهلا': () => greetGeneral(),
    'السلام عليكم': () => greetIslamic(),
    'شكرا': () => thankYou(),
    'متشكر': () => thankYou(),
    'يلا بينا': () => motivate(),
    'خلاص كده': () => finish(),
    'كفاية': () => finish()
  };

  // الردود باللهجة المصرية
  const egyptianResponses = {
    greeting: [
      'أهلا وسهلا! إزيك النهاردة؟ عايز مساعدة في إيه؟',
      'أهلا بيك! نورت المكان، قولي عايز إيه؟',
      'مرحبا! إزي الشغل النهاردة؟ أقدر أساعدك في إيه؟'
    ],
    morning: [
      'صباح الخير! ربنا يخليك، النهاردة هيكون يوم حلو إن شاء الله',
      'صباح النور! يلا نشتغل ونخلص شغل كتير النهاردة',
      'صباح الفل! إيه خطة الشغل النهاردة؟'
    ],
    evening: [
      'مساء الخير! إزي كان يومك؟ اشتغلت إيه النهاردة؟',
      'مساء النور! يارب يكون يوم مثمر ومفيد',
      'مساء الفل! خلصت شغلك ولا لسه؟'
    ],
    islamic: [
      'وعليكم السلام ورحمة الله وبركاته! أهلا وسهلا',
      'وعليكم السلام! ربنا يكرمك، عايز مساعدة في إيه؟'
    ],
    thanks: [
      'العفو! ده واجبي، أي خدمة تاني؟',
      'ولا يهمك! أنا هنا علشان أساعدك',
      'متشكر إيه! ده شغلي، عايز حاجة تانية؟'
    ],
    motivation: [
      'يلا بينا نشتغل! النهاردة هيكون يوم رائع',
      'بالتوفيق! إحنا هنعمل حاجات حلوة كتير',
      'يلا نخلص الشغل ونفرح بالنتايج الحلوة'
    ],
    finish: [
      'تمام كده! لو احتجت أي حاجة أنا هنا',
      'خلاص! أي وقت تحتاجني اقولي',
      'ماشي! ربنا يوفقك في شغلك'
    ]
  };

  // الرؤى التجارية الاستباقية
  const businessInsightTemplates = [
    'المبيعات النهاردة أحسن من إمبارح بنسبة {percentage}%! كده احنا ماشيين صح',
    'في منتج {product} مبيعاته قليلة الفترة دي، ممكن نعمله عرض؟',
    'العميل {customer} مشتراش من فترة، ممكن نتواصل معاه؟',
    'المخزون بتاع {product} خلص تقريبا، لازم نطلب كمية جديدة',
    'الشهر ده أحسن من الشهر اللي فات! مبروك عليك النجاح',
    'في وقت الذروة من {time1} لـ {time2}، المبيعات بتزيد كتير',
    'العملاء بيحبوا المنتجات اللي سعرها من {price1} لـ {price2} جنيه'
  ];

  useEffect(() => {
    initializeSpeechRecognition();
    initializeSpeechSynthesis();
    generateProactiveInsights();
    
    // تحديث الرؤى كل 30 ثانية
    const insightInterval = setInterval(generateProactiveInsights, 30000);
    
    return () => {
      clearInterval(insightInterval);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ar-EG'; // اللهجة المصرية
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        processEgyptianCommand(speechResult);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        speakEgyptian('معلش، مسمعتكش كويس، ممكن تعيد تاني؟');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const initializeSpeechSynthesis = () => {
    synthRef.current = window.speechSynthesis;
  };

  const speakEgyptian = (text) => {
    if (synthRef.current && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // إعدادات الصوت العربي
      utterance.lang = 'ar-EG';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // البحث عن صوت عربي مناسب
      const voices = synthRef.current.getVoices();
      const arabicVoice = voices.find(voice => 
        voice.lang.includes('ar') || voice.name.includes('Arabic')
      );
      
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
      setResponse(text);
      
      // إضافة للمحادثة
      setConversation(prev => [...prev, {
        type: 'assistant',
        text: text,
        timestamp: new Date().toLocaleTimeString('ar-EG')
      }]);
    }
  };

  const processEgyptianCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // إضافة للمحادثة
    setConversation(prev => [...prev, {
      type: 'user',
      text: command,
      timestamp: new Date().toLocaleTimeString('ar-EG')
    }]);
    
    // البحث عن الأمر المطابق
    let commandFound = false;
    
    for (const [key, action] of Object.entries(egyptianCommands)) {
      if (lowerCommand.includes(key.toLowerCase()) || 
          command.includes(key) ||
          lowerCommand.includes(key.toLowerCase().replace(/\s+/g, ''))) {
        action();
        commandFound = true;
        break;
      }
    }
    
    if (!commandFound) {
      // رد ذكي للأوامر غير المفهومة
      const smartResponses = [
        'معلش مفهمتكش، ممكن تقولي تاني بطريقة تانية؟',
        'مش فاهم قصدك إيه، جرب تقول "مساعدة" علشان أشوف إزاي أقدر أساعدك',
        'ممكن توضحلي أكتر؟ أو قول "مساعدة" علشان أعرفك بالأوامر المتاحة'
      ];
      
      const randomResponse = smartResponses[Math.floor(Math.random() * smartResponses.length)];
      speakEgyptian(randomResponse);
    }
  };

  const generateProactiveInsights = () => {
    // محاكاة بيانات تجارية
    const mockData = {
      todaySales: Math.floor(Math.random() * 50000) + 10000,
      yesterdaySales: Math.floor(Math.random() * 45000) + 8000,
      lowStockProducts: ['شاي أحمد', 'سكر', 'أرز أبو كاس'],
      topCustomers: ['أحمد محمد', 'فاطمة علي', 'محمود حسن'],
      peakHours: '2:00 م - 5:00 م',
      popularPriceRange: '50-100'
    };
    
    const insights = [];
    
    // حساب نسبة التحسن
    const improvementPercentage = ((mockData.todaySales - mockData.yesterdaySales) / mockData.yesterdaySales * 100).toFixed(1);
    
    if (improvementPercentage > 0) {
      insights.push(`المبيعات النهاردة أحسن من إمبارح بنسبة ${improvementPercentage}%! كده احنا ماشيين صح`);
    }
    
    // تنبيهات المخزون
    if (mockData.lowStockProducts.length > 0) {
      const product = mockData.lowStockProducts[Math.floor(Math.random() * mockData.lowStockProducts.length)];
      insights.push(`المخزون بتاع ${product} خلص تقريبا، لازم نطلب كمية جديدة`);
    }
    
    // رؤى أوقات الذروة
    insights.push(`في وقت الذروة من ${mockData.peakHours}، المبيعات بتزيد كتير`);
    
    // رؤى الأسعار
    insights.push(`العملاء بيحبوا المنتجات اللي سعرها من ${mockData.popularPriceRange} جنيه`);
    
    setBusinessInsights(insights);
    
    // إنشاء تنبيهات استباقية
    const alerts = [
      'تذكير: وقت الذروة قرب، استعد للزحمة!',
      'اقتراح: ممكن نعمل عرض على المنتجات البطيئة؟',
      'ملاحظة: العملاء الكبار محتاجين متابعة'
    ];
    
    setProactiveAlerts(alerts);
  };

  // وظائف الأوامر
  const showSales = () => {
    const responses = [
      'المبيعات النهاردة ممتازة! وصلت لـ 35 ألف جنيه، والحمد لله الأرقام حلوة',
      'مبيعات اليوم كويسة جدا، 42 فاتورة بإجمالي 28 ألف جنيه',
      'الحمد لله، المبيعات ماشية حلو، النهاردة عملنا 31 ألف جنيه'
    ];
    speakEgyptian(responses[Math.floor(Math.random() * responses.length)]);
  };

  const addProduct = () => {
    speakEgyptian('تمام! هفتحلك صفحة إضافة منتج جديد دلوقتي');
    // هنا يمكن إضافة كود للانتقال لصفحة إضافة المنتج
  };

  const searchCustomer = () => {
    speakEgyptian('ماشي! قولي اسم العميل اللي عايز تدور عليه وأنا هدورله');
  };

  const createInvoice = () => {
    speakEgyptian('حاضر! هفتحلك صفحة إنشاء فاتورة جديدة علطول');
  };

  const showReports = () => {
    speakEgyptian('التقارير جاهزة! هعرضلك تقرير شامل عن المبيعات والأرباح');
  };

  const checkInventory = () => {
    const responses = [
      'المخزون كويس بس في شوية حاجات محتاجة تجديد، زي الشاي والسكر',
      'الحمد لله المخزون مليان، بس خلي بالك من الأرز قرب يخلص',
      'المخزون تمام، كل حاجة متوفرة والحمد لله'
    ];
    speakEgyptian(responses[Math.floor(Math.random() * responses.length)]);
  };

  const showHelp = () => {
    speakEgyptian('أنا هنا علشان أساعدك! تقدر تقولي: عرض المبيعات، إضافة منتج، إنشاء فاتورة، حالة المخزون، أو أي حاجة تانية تحتاجها');
  };

  const greetMorning = () => {
    const responses = egyptianResponses.morning;
    speakEgyptian(responses[Math.floor(Math.random() * responses.length)]);
  };

  const greetEvening = () => {
    const responses = egyptianResponses.evening;
    speakEgyptian(responses[Math.floor(Math.random() * responses.length)]);
  };

  const greetGeneral = () => {
    const responses = egyptianResponses.greeting;
    speakEgyptian(responses[Math.floor(Math.random() * responses.length)]);
  };

  const greetIslamic = () => {
    const responses = egyptianResponses.islamic;
    speakEgyptian(responses[Math.floor(Math.random() * responses.length)]);
  };

  const thankYou = () => {
    const responses = egyptianResponses.thanks;
    speakEgyptian(responses[Math.floor(Math.random() * responses.length)]);
  };

  const motivate = () => {
    const responses = egyptianResponses.motivation;
    speakEgyptian(responses[Math.floor(Math.random() * responses.length)]);
  };

  const finish = () => {
    const responses = egyptianResponses.finish;
    speakEgyptian(responses[Math.floor(Math.random() * responses.length)]);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleAssistant = () => {
    setIsActive(!isActive);
    if (!isActive) {
      speakEgyptian('أهلا وسهلا! أنا المساعد الذكي بتاعك، إزاي أقدر أساعدك النهاردة؟');
    }
  };

  return (
    <div className="egyptian-voice-assistant">
      {/* زر تفعيل المساعد */}
      <button 
        className={`assistant-toggle ${isActive ? 'active' : ''}`}
        onClick={toggleAssistant}
        title="المساعد الذكي الصوتي"
      >
        <div className="assistant-icon">
          <i className="fas fa-microphone"></i>
          {isListening && <div className="pulse-ring"></div>}
          {isSpeaking && <div className="speaking-indicator"></div>}
        </div>
      </button>

      {/* واجهة المساعد */}
      {isActive && (
        <div className="assistant-interface">
          <div className="assistant-header">
            <h3>🎤 المساعد الذكي المصري</h3>
            <button 
              className="close-btn"
              onClick={() => setIsActive(false)}
            >
              ×
            </button>
          </div>

          {/* حالة المساعد */}
          <div className="assistant-status">
            <div className={`status-indicator ${isListening ? 'listening' : isSpeaking ? 'speaking' : 'idle'}`}>
              {isListening ? '🎧 بسمعك...' : isSpeaking ? '🗣️ بتكلم...' : '😊 جاهز للمساعدة'}
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="control-buttons">
            <button 
              className={`listen-btn ${isListening ? 'active' : ''}`}
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
            >
              {isListening ? '⏹️ إيقاف' : '🎤 اتكلم'}
            </button>
            
            <button 
              className="help-btn"
              onClick={() => speakEgyptian('تقدر تقولي: عرض المبيعات، إضافة منتج، إنشاء فاتورة، حالة المخزون، البحث عن عميل، عرض التقارير، أو مساعدة')}
            >
              ❓ الأوامر المتاحة
            </button>
          </div>

          {/* الرؤى التجارية الاستباقية */}
          {businessInsights.length > 0 && (
            <div className="business-insights">
              <h4>💡 رؤى تجارية ذكية</h4>
              <div className="insights-list">
                {businessInsights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="insight-item">
                    <span className="insight-icon">📊</span>
                    <span className="insight-text">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* التنبيهات الاستباقية */}
          {proactiveAlerts.length > 0 && (
            <div className="proactive-alerts">
              <h4>🔔 تنبيهات ذكية</h4>
              <div className="alerts-list">
                {proactiveAlerts.slice(0, 2).map((alert, index) => (
                  <div key={index} className="alert-item">
                    <span className="alert-icon">⚠️</span>
                    <span className="alert-text">{alert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* سجل المحادثة */}
          <div className="conversation-log">
            <h4>💬 سجل المحادثة</h4>
            <div className="conversation-list">
              {conversation.slice(-5).map((msg, index) => (
                <div key={index} className={`conversation-item ${msg.type}`}>
                  <div className="message-content">
                    <span className="message-text">{msg.text}</span>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* الأوامر السريعة */}
          <div className="quick-commands">
            <h4>⚡ أوامر سريعة</h4>
            <div className="commands-grid">
              <button onClick={() => processEgyptianCommand('عرض المبيعات')}>
                📈 المبيعات
              </button>
              <button onClick={() => processEgyptianCommand('إضافة منتج')}>
                ➕ منتج جديد
              </button>
              <button onClick={() => processEgyptianCommand('إنشاء فاتورة')}>
                🧾 فاتورة
              </button>
              <button onClick={() => processEgyptianCommand('حالة المخزون')}>
                📦 المخزون
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EgyptianVoiceAssistant;

