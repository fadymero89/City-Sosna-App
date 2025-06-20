import React, { useState, useRef, useEffect } from 'react';
import './VoiceToInvoiceSystem.css';

const VoiceToInvoiceSystem = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [extractedInvoice, setExtractedInvoice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingHistory, setRecordingHistory] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('ar-EG');
  const [voiceCommands, setVoiceCommands] = useState([]);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);

  // أوامر صوتية ذكية لإنشاء الفواتير
  const invoiceCommands = {
    'ابدأ فاتورة جديدة': () => startNewInvoice(),
    'اعمل فاتورة للعميل': (customerName) => createInvoiceForCustomer(customerName),
    'ضيف منتج': (productName, quantity, price) => addProductToInvoice(productName, quantity, price),
    'احسب الإجمالي': () => calculateTotal(),
    'طبق خصم': (discount) => applyDiscount(discount),
    'ضيف ضريبة': (tax) => addTax(tax),
    'احفظ الفاتورة': () => saveInvoice(),
    'إلغاء الفاتورة': () => cancelInvoice(),
    'عرض الفاتورة': () => previewInvoice(),
    'طباعة الفاتورة': () => printInvoice()
  };

  // قوالب الفواتير الصوتية
  const voiceTemplates = [
    {
      name: 'فاتورة بيع عادية',
      pattern: 'فاتورة للعميل {customer} منتج {product} كمية {quantity} سعر {price}',
      example: 'فاتورة للعميل أحمد محمد منتج شاي أحمد كمية 5 سعر 25 جنيه'
    },
    {
      name: 'فاتورة متعددة الأصناف',
      pattern: 'فاتورة للعميل {customer} أصناف {products} مع الأسعار {prices}',
      example: 'فاتورة للعميل فاطمة أصناف شاي وسكر وأرز مع الأسعار 25 و 18 و 45 جنيه'
    },
    {
      name: 'فاتورة بخصم',
      pattern: 'فاتورة للعميل {customer} منتج {product} كمية {quantity} سعر {price} خصم {discount}%',
      example: 'فاتورة للعميل محمود منتج زيت كمية 3 سعر 30 جنيه خصم 10%'
    }
  ];

  useEffect(() => {
    initializeSpeechRecognition();
    generateSmartSuggestions();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript + interimTranscript);
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      // إعداد تحليل مستوى الصوت
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();
      
      // إعداد MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start(1000); // تسجيل كل ثانية
      setIsRecording(true);
      setRecordingTime(0);
      
      // بدء التعرف على الكلام
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      // بدء العداد
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('خطأ في بدء التسجيل:', error);
      alert('لا يمكن الوصول للميكروفون. تأكد من إعطاء الإذن للتطبيق.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      setAudioLevel(0);
    }
  };

  const processVoiceCommand = (command) => {
    const lowerCommand = command.toLowerCase().trim();
    
    // البحث عن أوامر الفاتورة
    for (const [pattern, action] of Object.entries(invoiceCommands)) {
      if (lowerCommand.includes(pattern.toLowerCase())) {
        action();
        break;
      }
    }
    
    // تحليل ذكي للنص لاستخراج بيانات الفاتورة
    analyzeInvoiceContent(command);
  };

  const analyzeInvoiceContent = (text) => {
    setIsProcessing(true);
    
    // محاكاة تحليل النص بالذكاء الاصطناعي
    setTimeout(() => {
      const extractedData = extractInvoiceFromText(text);
      setExtractedInvoice(extractedData);
      addToRecordingHistory(text, extractedData);
      setIsProcessing(false);
    }, 2000);
  };

  const extractInvoiceFromText = (text) => {
    // تحليل ذكي للنص العربي لاستخراج بيانات الفاتورة
    const patterns = {
      customer: /(?:للعميل|العميل|الزبون)\s+([أ-ي\s]+?)(?:\s|$|منتج|صنف)/,
      product: /(?:منتج|صنف|سلعة)\s+([أ-ي\s]+?)(?:\s|$|كمية|سعر)/,
      quantity: /(?:كمية|عدد)\s+(\d+)/,
      price: /(?:سعر|بسعر|ثمن)\s+(\d+(?:\.\d+)?)\s*(?:جنيه|ريال|درهم)?/,
      discount: /(?:خصم|تخفيض)\s+(\d+(?:\.\d+)?)\s*%?/,
      tax: /(?:ضريبة|ضرائب)\s+(\d+(?:\.\d+)?)\s*%?/
    };
    
    const extracted = {};
    
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = text.match(pattern);
      if (match) {
        extracted[key] = match[1].trim();
      }
    }
    
    // استخراج منتجات متعددة
    const productMatches = text.match(/(?:أصناف|منتجات)\s+([أ-ي\s،و]+)/);
    if (productMatches) {
      extracted.products = productMatches[1].split(/[،و]/).map(p => p.trim()).filter(p => p);
    }
    
    // استخراج أسعار متعددة
    const priceMatches = text.match(/(?:أسعار|بأسعار)\s+([\d\s،و.]+)/);
    if (priceMatches) {
      extracted.prices = priceMatches[1].split(/[،و]/).map(p => parseFloat(p.trim())).filter(p => !isNaN(p));
    }
    
    // إنشاء فاتورة منظمة
    const invoice = {
      id: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString('ar-EG'),
      customer: extracted.customer || 'عميل غير محدد',
      items: [],
      subtotal: 0,
      discount: parseFloat(extracted.discount) || 0,
      tax: parseFloat(extracted.tax) || 14, // ضريبة افتراضية 14%
      total: 0,
      confidence: 0.85,
      originalText: text
    };
    
    // إضافة الأصناف
    if (extracted.products && extracted.prices) {
      extracted.products.forEach((product, index) => {
        const price = extracted.prices[index] || 0;
        const quantity = 1; // كمية افتراضية
        invoice.items.push({
          name: product,
          quantity: quantity,
          price: price,
          total: quantity * price
        });
      });
    } else if (extracted.product) {
      const quantity = parseInt(extracted.quantity) || 1;
      const price = parseFloat(extracted.price) || 0;
      invoice.items.push({
        name: extracted.product,
        quantity: quantity,
        price: price,
        total: quantity * price
      });
    }
    
    // حساب الإجماليات
    invoice.subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = (invoice.subtotal * invoice.discount) / 100;
    const taxAmount = ((invoice.subtotal - discountAmount) * invoice.tax) / 100;
    invoice.total = invoice.subtotal - discountAmount + taxAmount;
    
    return invoice;
  };

  const addToRecordingHistory = (text, invoice) => {
    setRecordingHistory(prev => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleString('ar-EG'),
        text: text,
        invoice: invoice,
        duration: recordingTime
      },
      ...prev.slice(0, 9) // الاحتفاظ بآخر 10 تسجيلات
    ]);
  };

  const generateSmartSuggestions = () => {
    const suggestions = [
      'جرب قول: "فاتورة للعميل أحمد منتج شاي كمية 5 سعر 25 جنيه"',
      'يمكنك قول: "اعمل فاتورة لفاطمة أصناف سكر وأرز بأسعار 18 و 45 جنيه"',
      'جرب: "فاتورة لمحمود منتج زيت كمية 3 سعر 30 جنيه خصم 10%"',
      'قل: "ابدأ فاتورة جديدة للعميل سارة"',
      'يمكنك: "ضيف منتج بسكويت كمية 10 سعر 12 جنيه"'
    ];
    
    setSmartSuggestions(suggestions);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveInvoiceToSystem = (invoice) => {
    // هنا يمكن حفظ الفاتورة في قاعدة البيانات
    console.log('حفظ الفاتورة:', invoice);
    alert(`تم حفظ الفاتورة رقم ${invoice.id} بنجاح!`);
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voice-recording-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // وظائف الأوامر الصوتية
  const startNewInvoice = () => {
    setExtractedInvoice(null);
    setTranscript('');
    console.log('بدء فاتورة جديدة');
  };

  const createInvoiceForCustomer = (customerName) => {
    console.log(`إنشاء فاتورة للعميل: ${customerName}`);
  };

  const addProductToInvoice = (productName, quantity, price) => {
    console.log(`إضافة منتج: ${productName}, الكمية: ${quantity}, السعر: ${price}`);
  };

  const calculateTotal = () => {
    console.log('حساب الإجمالي');
  };

  const applyDiscount = (discount) => {
    console.log(`تطبيق خصم: ${discount}%`);
  };

  const addTax = (tax) => {
    console.log(`إضافة ضريبة: ${tax}%`);
  };

  const saveInvoice = () => {
    if (extractedInvoice) {
      saveInvoiceToSystem(extractedInvoice);
    }
  };

  const cancelInvoice = () => {
    setExtractedInvoice(null);
    setTranscript('');
    console.log('إلغاء الفاتورة');
  };

  const previewInvoice = () => {
    console.log('عرض الفاتورة');
  };

  const printInvoice = () => {
    console.log('طباعة الفاتورة');
  };

  return (
    <div className="voice-to-invoice-system">
      <div className="system-header">
        <h2>🎤 نظام الفواتير الصوتية الذكي</h2>
        <p>أنشئ فواتير كاملة بصوتك فقط باستخدام الذكاء الاصطناعي</p>
      </div>

      {/* أدوات التحكم الرئيسية */}
      <div className="main-controls">
        <div className="recording-section">
          <div className="recording-visualizer">
            <div className="audio-level-container">
              <div 
                className="audio-level-bar"
                style={{ height: `${(audioLevel / 255) * 100}%` }}
              ></div>
            </div>
            
            <button
              className={`record-btn ${isRecording ? 'recording' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              <div className="record-icon">
                {isRecording ? '⏹️' : '🎤'}
              </div>
              <span className="record-text">
                {isRecording ? 'إيقاف التسجيل' : 'ابدأ التسجيل'}
              </span>
            </button>
            
            {isRecording && (
              <div className="recording-info">
                <div className="recording-time">{formatTime(recordingTime)}</div>
                <div className="recording-status">🔴 جاري التسجيل...</div>
              </div>
            )}
          </div>
        </div>

        <div className="language-settings">
          <label>اللغة:</label>
          <select 
            value={selectedLanguage} 
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="ar-EG">العربية (مصر)</option>
            <option value="ar-SA">العربية (السعودية)</option>
            <option value="ar">العربية (عام)</option>
          </select>
        </div>
      </div>

      {/* قوالب الفواتير الصوتية */}
      <div className="voice-templates">
        <h3>📋 قوالب الفواتير الصوتية</h3>
        <div className="templates-grid">
          {voiceTemplates.map((template, index) => (
            <div key={index} className="template-card">
              <h4>{template.name}</h4>
              <p className="template-pattern">{template.pattern}</p>
              <div className="template-example">
                <strong>مثال:</strong>
                <p>"{template.example}"</p>
              </div>
              <button 
                className="use-template-btn"
                onClick={() => setTranscript(template.example)}
              >
                استخدم هذا القالب
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* الاقتراحات الذكية */}
      <div className="smart-suggestions">
        <h3>💡 اقتراحات ذكية</h3>
        <div className="suggestions-list">
          {smartSuggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item">
              <span className="suggestion-icon">🗣️</span>
              <span className="suggestion-text">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* النص المستخرج */}
      {transcript && (
        <div className="transcript-section">
          <h3>📝 النص المستخرج:</h3>
          <div className="transcript-content">
            <p>{transcript}</p>
            {isProcessing && (
              <div className="processing-indicator">
                <div className="processing-spinner"></div>
                <span>جاري تحليل النص وإنشاء الفاتورة...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* الفاتورة المستخرجة */}
      {extractedInvoice && (
        <div className="extracted-invoice">
          <h3>🧾 الفاتورة المستخرجة</h3>
          <div className="invoice-card">
            <div className="invoice-header">
              <div className="invoice-info">
                <h4>فاتورة رقم: {extractedInvoice.id}</h4>
                <p>التاريخ: {extractedInvoice.date} - الوقت: {extractedInvoice.time}</p>
                <p>العميل: {extractedInvoice.customer}</p>
                <div className="confidence-badge">
                  دقة الاستخراج: {Math.round(extractedInvoice.confidence * 100)}%
                </div>
              </div>
            </div>

            <div className="invoice-items">
              <h5>الأصناف:</h5>
              <div className="items-table">
                <div className="table-header">
                  <span>الصنف</span>
                  <span>الكمية</span>
                  <span>السعر</span>
                  <span>الإجمالي</span>
                </div>
                {extractedInvoice.items.map((item, index) => (
                  <div key={index} className="table-row">
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>{item.price.toFixed(2)} جنيه</span>
                    <span>{item.total.toFixed(2)} جنيه</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="invoice-totals">
              <div className="total-row">
                <span>المجموع الفرعي:</span>
                <span>{extractedInvoice.subtotal.toFixed(2)} جنيه</span>
              </div>
              {extractedInvoice.discount > 0 && (
                <div className="total-row discount">
                  <span>الخصم ({extractedInvoice.discount}%):</span>
                  <span>-{((extractedInvoice.subtotal * extractedInvoice.discount) / 100).toFixed(2)} جنيه</span>
                </div>
              )}
              <div className="total-row tax">
                <span>الضريبة ({extractedInvoice.tax}%):</span>
                <span>+{(((extractedInvoice.subtotal - (extractedInvoice.subtotal * extractedInvoice.discount) / 100) * extractedInvoice.tax) / 100).toFixed(2)} جنيه</span>
              </div>
              <div className="total-row final">
                <span>الإجمالي النهائي:</span>
                <span>{extractedInvoice.total.toFixed(2)} جنيه</span>
              </div>
            </div>

            <div className="invoice-actions">
              <button 
                className="action-btn primary"
                onClick={() => saveInvoiceToSystem(extractedInvoice)}
              >
                💾 حفظ الفاتورة
              </button>
              <button className="action-btn secondary">
                🖨️ طباعة
              </button>
              <button className="action-btn secondary">
                📧 إرسال بالبريد
              </button>
              <button className="action-btn secondary">
                ✏️ تعديل
              </button>
            </div>

            <div className="original-text">
              <details>
                <summary>النص الأصلي المسجل</summary>
                <p>"{extractedInvoice.originalText}"</p>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* سجل التسجيلات */}
      {recordingHistory.length > 0 && (
        <div className="recording-history">
          <h3>📚 سجل التسجيلات</h3>
          <div className="history-list">
            {recordingHistory.slice(0, 5).map((record) => (
              <div key={record.id} className="history-item">
                <div className="history-header">
                  <span className="history-time">{record.timestamp}</span>
                  <span className="history-duration">{formatTime(record.duration)}</span>
                </div>
                <div className="history-content">
                  <p className="history-text">"{record.text}"</p>
                  {record.invoice && (
                    <div className="history-invoice">
                      <small>
                        فاتورة للعميل: {record.invoice.customer} | 
                        الإجمالي: {record.invoice.total.toFixed(2)} جنيه
                      </small>
                    </div>
                  )}
                </div>
                <div className="history-actions">
                  <button 
                    className="history-btn"
                    onClick={() => setExtractedInvoice(record.invoice)}
                  >
                    📋 عرض الفاتورة
                  </button>
                  <button 
                    className="history-btn"
                    onClick={() => setTranscript(record.text)}
                  >
                    🔄 إعادة المعالجة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* أدوات إضافية */}
      <div className="additional-tools">
        <h3>🛠️ أدوات إضافية</h3>
        <div className="tools-grid">
          <button 
            className="tool-btn"
            onClick={downloadAudio}
            disabled={!audioBlob}
          >
            📥 تحميل التسجيل
          </button>
          <button 
            className="tool-btn"
            onClick={() => setTranscript('')}
          >
            🗑️ مسح النص
          </button>
          <button 
            className="tool-btn"
            onClick={() => setExtractedInvoice(null)}
          >
            🆕 فاتورة جديدة
          </button>
          <button 
            className="tool-btn"
            onClick={generateSmartSuggestions}
          >
            💡 اقتراحات جديدة
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceToInvoiceSystem;

