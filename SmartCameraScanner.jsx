import React, { useState, useRef, useEffect } from 'react';
import './SmartCameraScanner.css';

const SmartCameraScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanMode, setScanMode] = useState('barcode'); // barcode, qr, product, invoice, business_card
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);
  const [cameraFacing, setCameraFacing] = useState('environment'); // environment or user
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [autoScanEnabled, setAutoScanEnabled] = useState(true);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // أنواع المسح المختلفة
  const scanModes = {
    barcode: {
      name: 'باركود',
      icon: '📊',
      description: 'مسح الباركود لإضافة المنتجات',
      color: '#667eea'
    },
    qr: {
      name: 'QR كود',
      icon: '📱',
      description: 'مسح رمز الاستجابة السريعة',
      color: '#764ba2'
    },
    product: {
      name: 'منتج',
      icon: '📦',
      description: 'تصوير المنتج لاستخراج البيانات',
      color: '#f093fb'
    },
    invoice: {
      name: 'فاتورة',
      icon: '🧾',
      description: 'تصوير الفاتورة لاستخراج البيانات',
      color: '#4ecdc4'
    },
    business_card: {
      name: 'كارت شخصي',
      icon: '💳',
      description: 'تصوير الكارت لإضافة العميل',
      color: '#ff6b6b'
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setIsScanning(true);
      
      // بدء المسح التلقائي إذا كان مفعلاً
      if (autoScanEnabled) {
        startAutoScan();
      }
      
    } catch (error) {
      console.error('خطأ في تشغيل الكاميرا:', error);
      alert('لا يمكن الوصول للكاميرا. تأكد من إعطاء الإذن للتطبيق.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    
    return imageData;
  };

  const processImage = async (imageData) => {
    setIsProcessing(true);
    
    try {
      // محاكاة معالجة الصورة واستخراج البيانات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let extractedInfo = {};
      
      switch (scanMode) {
        case 'barcode':
          extractedInfo = await processBarcodeImage(imageData);
          break;
        case 'qr':
          extractedInfo = await processQRImage(imageData);
          break;
        case 'product':
          extractedInfo = await processProductImage(imageData);
          break;
        case 'invoice':
          extractedInfo = await processInvoiceImage(imageData);
          break;
        case 'business_card':
          extractedInfo = await processBusinessCardImage(imageData);
          break;
        default:
          extractedInfo = { error: 'نوع مسح غير مدعوم' };
      }
      
      setExtractedData(extractedInfo);
      addToScanHistory(extractedInfo);
      
    } catch (error) {
      console.error('خطأ في معالجة الصورة:', error);
      setExtractedData({ error: 'فشل في معالجة الصورة' });
    } finally {
      setIsProcessing(false);
    }
  };

  const processBarcodeImage = async (imageData) => {
    // محاكاة قراءة الباركود
    const mockBarcodes = [
      { code: '1234567890123', name: 'شاي أحمد', price: 25.50, category: 'مشروبات' },
      { code: '9876543210987', name: 'سكر أبيض', price: 18.00, category: 'بقالة' },
      { code: '5555666677778', name: 'أرز أبو كاس', price: 45.00, category: 'حبوب' },
      { code: '1111222233334', name: 'زيت عباد الشمس', price: 32.75, category: 'زيوت' }
    ];
    
    const randomProduct = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    
    return {
      type: 'barcode',
      success: true,
      data: {
        barcode: randomProduct.code,
        productName: randomProduct.name,
        price: randomProduct.price,
        category: randomProduct.category,
        timestamp: new Date().toLocaleString('ar-EG'),
        confidence: 0.95
      }
    };
  };

  const processQRImage = async (imageData) => {
    // محاكاة قراءة QR Code
    const mockQRData = [
      { type: 'url', content: 'https://sosna-city.com/product/123' },
      { type: 'contact', content: 'أحمد محمد\n01234567890\nahmed@email.com' },
      { type: 'wifi', content: 'WIFI:T:WPA;S:SosnaWiFi;P:password123;;' },
      { type: 'text', content: 'كود خصم: SOSNA2024' }
    ];
    
    const randomQR = mockQRData[Math.floor(Math.random() * mockQRData.length)];
    
    return {
      type: 'qr',
      success: true,
      data: {
        qrType: randomQR.type,
        content: randomQR.content,
        timestamp: new Date().toLocaleString('ar-EG'),
        confidence: 0.92
      }
    };
  };

  const processProductImage = async (imageData) => {
    // محاكاة تحليل صورة المنتج
    const mockProducts = [
      {
        name: 'عصير برتقال طبيعي',
        brand: 'فريش',
        category: 'مشروبات',
        estimatedPrice: 15.50,
        description: 'عصير برتقال طبيعي 100% بدون إضافات',
        size: '1 لتر',
        features: ['طبيعي', 'بدون سكر مضاف', 'غني بفيتامين سي']
      },
      {
        name: 'بسكويت شوكولاتة',
        brand: 'أولكر',
        category: 'حلويات',
        estimatedPrice: 12.00,
        description: 'بسكويت مقرمش بالشوكولاتة',
        size: '150 جرام',
        features: ['مقرمش', 'بالشوكولاتة', 'للأطفال']
      }
    ];
    
    const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    
    return {
      type: 'product',
      success: true,
      data: {
        ...randomProduct,
        timestamp: new Date().toLocaleString('ar-EG'),
        confidence: 0.88
      }
    };
  };

  const processInvoiceImage = async (imageData) => {
    // محاكاة استخراج بيانات الفاتورة
    return {
      type: 'invoice',
      success: true,
      data: {
        invoiceNumber: 'INV-2024-001',
        date: '2024-01-15',
        vendor: 'شركة التوريدات المصرية',
        total: 1250.75,
        items: [
          { name: 'شاي أحمد', quantity: 10, price: 25.50 },
          { name: 'سكر أبيض', quantity: 5, price: 18.00 },
          { name: 'أرز أبو كاس', quantity: 20, price: 45.00 }
        ],
        tax: 125.08,
        timestamp: new Date().toLocaleString('ar-EG'),
        confidence: 0.91
      }
    };
  };

  const processBusinessCardImage = async (imageData) => {
    // محاكاة استخراج بيانات الكارت الشخصي
    const mockCards = [
      {
        name: 'أحمد محمد علي',
        title: 'مدير المبيعات',
        company: 'شركة النور للتجارة',
        phone: '01234567890',
        email: 'ahmed.mohamed@alnoor.com',
        address: 'القاهرة، مصر الجديدة'
      },
      {
        name: 'فاطمة حسن',
        title: 'مديرة التسويق',
        company: 'مؤسسة الأمل',
        phone: '01098765432',
        email: 'fatma.hassan@alamal.com',
        address: 'الجيزة، المهندسين'
      }
    ];
    
    const randomCard = mockCards[Math.floor(Math.random() * mockCards.length)];
    
    return {
      type: 'business_card',
      success: true,
      data: {
        ...randomCard,
        timestamp: new Date().toLocaleString('ar-EG'),
        confidence: 0.89
      }
    };
  };

  const addToScanHistory = (data) => {
    setScanHistory(prev => [
      {
        id: Date.now(),
        mode: scanMode,
        data: data,
        timestamp: new Date().toLocaleString('ar-EG')
      },
      ...prev.slice(0, 9) // الاحتفاظ بآخر 10 عمليات مسح
    ]);
  };

  const startAutoScan = () => {
    const scanInterval = setInterval(() => {
      if (isScanning && autoScanEnabled && !isProcessing) {
        const imageData = captureImage();
        if (imageData) {
          processImage(imageData);
        }
      }
    }, 3000); // مسح كل 3 ثواني

    return () => clearInterval(scanInterval);
  };

  const handleManualCapture = () => {
    const imageData = captureImage();
    if (imageData) {
      processImage(imageData);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCamera = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
    if (isScanning) {
      stopCamera();
      setTimeout(startCamera, 500);
    }
  };

  const addProductFromScan = (productData) => {
    // هنا يمكن إضافة المنتج إلى قاعدة البيانات
    console.log('إضافة منتج من المسح:', productData);
    alert(`تم إضافة المنتج: ${productData.productName || productData.name}`);
  };

  const addCustomerFromCard = (cardData) => {
    // هنا يمكن إضافة العميل إلى قاعدة البيانات
    console.log('إضافة عميل من الكارت:', cardData);
    alert(`تم إضافة العميل: ${cardData.name}`);
  };

  return (
    <div className="smart-camera-scanner">
      <div className="scanner-header">
        <h2>📸 الماسح الذكي المتطور</h2>
        <p>تصوير وقراءة الأصناف والباركود بالذكاء الاصطناعي</p>
      </div>

      {/* أوضاع المسح */}
      <div className="scan-modes">
        <h3>اختر نوع المسح:</h3>
        <div className="modes-grid">
          {Object.entries(scanModes).map(([key, mode]) => (
            <button
              key={key}
              className={`mode-btn ${scanMode === key ? 'active' : ''}`}
              onClick={() => setScanMode(key)}
              style={{ borderColor: mode.color }}
            >
              <span className="mode-icon">{mode.icon}</span>
              <span className="mode-name">{mode.name}</span>
              <span className="mode-desc">{mode.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* أدوات التحكم */}
      <div className="scanner-controls">
        <div className="control-row">
          <button
            className={`control-btn primary ${isScanning ? 'stop' : 'start'}`}
            onClick={isScanning ? stopCamera : startCamera}
          >
            {isScanning ? '⏹️ إيقاف الكاميرا' : '📷 تشغيل الكاميرا'}
          </button>
          
          <button
            className="control-btn secondary"
            onClick={toggleCamera}
            disabled={!isScanning}
          >
            🔄 تبديل الكاميرا
          </button>
          
          <button
            className="control-btn secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            📁 رفع صورة
          </button>
        </div>

        <div className="control-row">
          <label className="toggle-control">
            <input
              type="checkbox"
              checked={autoScanEnabled}
              onChange={(e) => setAutoScanEnabled(e.target.checked)}
            />
            <span>المسح التلقائي</span>
          </label>
          
          <label className="toggle-control">
            <input
              type="checkbox"
              checked={flashEnabled}
              onChange={(e) => setFlashEnabled(e.target.checked)}
            />
            <span>الفلاش</span>
          </label>
        </div>
      </div>

      {/* منطقة الكاميرا */}
      <div className="camera-container">
        {isScanning ? (
          <div className="camera-view">
            <video
              ref={videoRef}
              className="camera-video"
              autoPlay
              playsInline
              muted
            />
            <div className="scan-overlay">
              <div className="scan-frame">
                <div className="corner top-left"></div>
                <div className="corner top-right"></div>
                <div className="corner bottom-left"></div>
                <div className="corner bottom-right"></div>
                <div className="scan-line"></div>
              </div>
              <div className="scan-info">
                <p>وجه الكاميرا نحو {scanModes[scanMode].name}</p>
                {autoScanEnabled && <p>المسح التلقائي مفعل</p>}
              </div>
            </div>
            
            {!autoScanEnabled && (
              <button
                className="capture-btn"
                onClick={handleManualCapture}
                disabled={isProcessing}
              >
                📸 التقط الصورة
              </button>
            )}
          </div>
        ) : (
          <div className="camera-placeholder">
            <div className="placeholder-content">
              <span className="placeholder-icon">📷</span>
              <p>اضغط "تشغيل الكاميرا" للبدء</p>
            </div>
          </div>
        )}
      </div>

      {/* معالجة الصورة */}
      {isProcessing && (
        <div className="processing-indicator">
          <div className="processing-spinner"></div>
          <p>جاري معالجة الصورة بالذكاء الاصطناعي...</p>
        </div>
      )}

      {/* نتائج المسح */}
      {extractedData && (
        <div className="scan-results">
          <h3>نتائج المسح:</h3>
          <div className="result-card">
            {extractedData.success ? (
              <div className="success-result">
                <div className="result-header">
                  <span className="result-icon">{scanModes[extractedData.type]?.icon}</span>
                  <span className="result-type">{scanModes[extractedData.type]?.name}</span>
                  <span className="confidence">دقة: {Math.round(extractedData.data.confidence * 100)}%</span>
                </div>
                
                <div className="result-data">
                  {extractedData.type === 'barcode' && (
                    <div className="barcode-result">
                      <h4>{extractedData.data.productName}</h4>
                      <p><strong>الباركود:</strong> {extractedData.data.barcode}</p>
                      <p><strong>السعر:</strong> {extractedData.data.price} جنيه</p>
                      <p><strong>الفئة:</strong> {extractedData.data.category}</p>
                      <button
                        className="action-btn"
                        onClick={() => addProductFromScan(extractedData.data)}
                      >
                        ➕ إضافة للمنتجات
                      </button>
                    </div>
                  )}
                  
                  {extractedData.type === 'product' && (
                    <div className="product-result">
                      <h4>{extractedData.data.name}</h4>
                      <p><strong>العلامة التجارية:</strong> {extractedData.data.brand}</p>
                      <p><strong>الفئة:</strong> {extractedData.data.category}</p>
                      <p><strong>الحجم:</strong> {extractedData.data.size}</p>
                      <p><strong>السعر المقدر:</strong> {extractedData.data.estimatedPrice} جنيه</p>
                      <p><strong>الوصف:</strong> {extractedData.data.description}</p>
                      <div className="features">
                        <strong>المميزات:</strong>
                        {extractedData.data.features.map((feature, index) => (
                          <span key={index} className="feature-tag">{feature}</span>
                        ))}
                      </div>
                      <button
                        className="action-btn"
                        onClick={() => addProductFromScan(extractedData.data)}
                      >
                        ➕ إضافة للمنتجات
                      </button>
                    </div>
                  )}
                  
                  {extractedData.type === 'business_card' && (
                    <div className="card-result">
                      <h4>{extractedData.data.name}</h4>
                      <p><strong>المنصب:</strong> {extractedData.data.title}</p>
                      <p><strong>الشركة:</strong> {extractedData.data.company}</p>
                      <p><strong>الهاتف:</strong> {extractedData.data.phone}</p>
                      <p><strong>البريد:</strong> {extractedData.data.email}</p>
                      <p><strong>العنوان:</strong> {extractedData.data.address}</p>
                      <button
                        className="action-btn"
                        onClick={() => addCustomerFromCard(extractedData.data)}
                      >
                        👤 إضافة للعملاء
                      </button>
                    </div>
                  )}
                  
                  {extractedData.type === 'invoice' && (
                    <div className="invoice-result">
                      <h4>فاتورة رقم: {extractedData.data.invoiceNumber}</h4>
                      <p><strong>التاريخ:</strong> {extractedData.data.date}</p>
                      <p><strong>المورد:</strong> {extractedData.data.vendor}</p>
                      <p><strong>الإجمالي:</strong> {extractedData.data.total} جنيه</p>
                      <p><strong>الضريبة:</strong> {extractedData.data.tax} جنيه</p>
                      <div className="invoice-items">
                        <strong>الأصناف:</strong>
                        {extractedData.data.items.map((item, index) => (
                          <div key={index} className="invoice-item">
                            {item.name} - الكمية: {item.quantity} - السعر: {item.price} جنيه
                          </div>
                        ))}
                      </div>
                      <button className="action-btn">📊 إضافة للنظام</button>
                    </div>
                  )}
                  
                  {extractedData.type === 'qr' && (
                    <div className="qr-result">
                      <h4>QR Code - {extractedData.data.qrType}</h4>
                      <div className="qr-content">
                        <pre>{extractedData.data.content}</pre>
                      </div>
                      <button className="action-btn">📋 نسخ المحتوى</button>
                    </div>
                  )}
                </div>
                
                <div className="result-footer">
                  <small>تم المسح في: {extractedData.data.timestamp}</small>
                </div>
              </div>
            ) : (
              <div className="error-result">
                <span className="error-icon">❌</span>
                <p>{extractedData.error}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* سجل المسح */}
      {scanHistory.length > 0 && (
        <div className="scan-history">
          <h3>سجل المسح الأخير:</h3>
          <div className="history-list">
            {scanHistory.slice(0, 5).map((scan) => (
              <div key={scan.id} className="history-item">
                <span className="history-icon">{scanModes[scan.mode]?.icon}</span>
                <div className="history-info">
                  <span className="history-type">{scanModes[scan.mode]?.name}</span>
                  <span className="history-time">{scan.timestamp}</span>
                </div>
                <span className="history-status">
                  {scan.data.success ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* عناصر مخفية */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default SmartCameraScanner;

