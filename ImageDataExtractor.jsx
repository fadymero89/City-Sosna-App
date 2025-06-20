// نظام إدخال البيانات من الصور
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Scan, 
  FileText, 
  CreditCard, 
  Package,
  Eye,
  Download,
  Trash2,
  Check,
  X,
  Zap,
  Brain,
  Image as ImageIcon,
  QrCode,
  Receipt,
  ShoppingCart,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';

const ImageDataExtractor = ({ user, addNotification, onDataExtracted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionType, setExtractionType] = useState('auto');
  const [previewMode, setPreviewMode] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // أنواع الاستخراج المدعومة
  const extractionTypes = [
    {
      id: 'auto',
      name: 'تحليل تلقائي',
      icon: Brain,
      description: 'تحليل ذكي لنوع المحتوى'
    },
    {
      id: 'barcode',
      name: 'باركود',
      icon: QrCode,
      description: 'قراءة الباركود والـ QR Code'
    },
    {
      id: 'receipt',
      name: 'فاتورة',
      icon: Receipt,
      description: 'استخراج بيانات الفواتير'
    },
    {
      id: 'product',
      name: 'منتج',
      icon: Package,
      description: 'تحليل معلومات المنتج'
    },
    {
      id: 'text',
      name: 'نص',
      icon: FileText,
      description: 'استخراج النصوص العربية والإنجليزية'
    },
    {
      id: 'business_card',
      name: 'كارت شخصي',
      icon: CreditCard,
      description: 'استخراج بيانات العملاء'
    }
  ];

  // محاكاة استخراج البيانات من الصور
  const simulateDataExtraction = useCallback((imageData, type) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let extractedInfo = {};
        
        switch (type) {
          case 'barcode':
            extractedInfo = {
              type: 'barcode',
              code: '1234567890123',
              format: 'EAN-13',
              product: {
                name: 'منتج مسح ضوئي',
                price: 45.50,
                category: 'إلكترونيات'
              }
            };
            break;
            
          case 'receipt':
            extractedInfo = {
              type: 'receipt',
              merchant: 'متجر سوسنا',
              date: new Date().toLocaleDateString('ar-EG'),
              total: 156.75,
              items: [
                { name: 'منتج أ', quantity: 2, price: 25.50 },
                { name: 'منتج ب', quantity: 1, price: 105.75 }
              ],
              tax: 12.50,
              paymentMethod: 'نقدي'
            };
            break;
            
          case 'product':
            extractedInfo = {
              type: 'product',
              name: 'منتج من الصورة',
              description: 'منتج تم تحليله من الصورة المرفوعة',
              estimatedPrice: 89.99,
              category: 'منتجات عامة',
              brand: 'علامة تجارية',
              features: ['ميزة 1', 'ميزة 2', 'ميزة 3']
            };
            break;
            
          case 'business_card':
            extractedInfo = {
              type: 'business_card',
              name: 'أحمد محمد علي',
              company: 'شركة التجارة الحديثة',
              position: 'مدير المبيعات',
              phone: '01234567890',
              email: 'ahmed@company.com',
              address: 'القاهرة، مصر'
            };
            break;
            
          case 'text':
            extractedInfo = {
              type: 'text',
              content: 'النص المستخرج من الصورة باللغة العربية والإنجليزية',
              language: 'ar-en',
              confidence: 0.95
            };
            break;
            
          default: // auto
            extractedInfo = {
              type: 'auto_detected',
              detectedType: 'product',
              confidence: 0.87,
              suggestions: [
                'يبدو أن هذه صورة منتج',
                'يمكن إضافته للمخزون',
                'السعر المقترح: 75 جنيه'
              ],
              data: {
                name: 'منتج مكتشف تلقائياً',
                estimatedPrice: 75.00,
                category: 'منتجات متنوعة'
              }
            };
        }
        
        resolve(extractedInfo);
      }, 2000 + Math.random() * 1000);
    });
  }, []);

  const handleImageCapture = useCallback(async (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target.result;
      setCapturedImage(imageData);
      setIsProcessing(true);
      
      try {
        const extracted = await simulateDataExtraction(imageData, extractionType);
        setExtractedData(extracted);
        addNotification('تم استخراج البيانات بنجاح! 🎉', 'success');
      } catch (error) {
        addNotification('حدث خطأ في استخراج البيانات', 'error');
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsDataURL(file);
  }, [extractionType, simulateDataExtraction, addNotification]);

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmData = () => {
    if (extractedData && onDataExtracted) {
      onDataExtracted(extractedData);
    }
    resetState();
    addNotification('تم حفظ البيانات المستخرجة', 'success');
  };

  const resetState = () => {
    setCapturedImage(null);
    setExtractedData(null);
    setIsProcessing(false);
    setPreviewMode(false);
  };

  const renderExtractedData = () => {
    if (!extractedData) return null;

    switch (extractedData.type) {
      case 'barcode':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <QrCode className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">باركود: {extractedData.code}</span>
            </div>
            {extractedData.product && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800">{extractedData.product.name}</h4>
                <p className="text-blue-600">السعر: {extractedData.product.price} جنيه</p>
                <p className="text-blue-600">الفئة: {extractedData.product.category}</p>
              </div>
            )}
          </div>
        );

      case 'receipt':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Receipt className="w-5 h-5 text-green-500" />
              <span className="font-semibold">فاتورة من {extractedData.merchant}</span>
            </div>
            <div className="bg-green-50 p-3 rounded-lg space-y-2">
              <p><strong>التاريخ:</strong> {extractedData.date}</p>
              <p><strong>الإجمالي:</strong> {extractedData.total} جنيه</p>
              <div>
                <strong>الأصناف:</strong>
                {extractedData.items.map((item, index) => (
                  <div key={index} className="text-sm text-green-700 mr-4">
                    • {item.name} × {item.quantity} = {item.price} جنيه
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'product':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Package className="w-5 h-5 text-purple-500" />
              <span className="font-semibold">{extractedData.name}</span>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg space-y-2">
              <p><strong>الوصف:</strong> {extractedData.description}</p>
              <p><strong>السعر المقترح:</strong> {extractedData.estimatedPrice} جنيه</p>
              <p><strong>الفئة:</strong> {extractedData.category}</p>
              {extractedData.features && (
                <div>
                  <strong>المميزات:</strong>
                  {extractedData.features.map((feature, index) => (
                    <span key={index} className="inline-block bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded mr-1 mt-1">
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'business_card':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <User className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">{extractedData.name}</span>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg space-y-2">
              <p><strong>الشركة:</strong> {extractedData.company}</p>
              <p><strong>المنصب:</strong> {extractedData.position}</p>
              <p><strong>الهاتف:</strong> {extractedData.phone}</p>
              <p><strong>البريد:</strong> {extractedData.email}</p>
              <p><strong>العنوان:</strong> {extractedData.address}</p>
            </div>
          </div>
        );

      case 'auto_detected':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Brain className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold">تحليل تلقائي</span>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg space-y-2">
              <p><strong>النوع المكتشف:</strong> {extractedData.detectedType}</p>
              <p><strong>مستوى الثقة:</strong> {Math.round(extractedData.confidence * 100)}%</p>
              <div>
                <strong>الاقتراحات:</strong>
                {extractedData.suggestions.map((suggestion, index) => (
                  <div key={index} className="text-sm text-indigo-700">• {suggestion}</div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-600">تم استخراج البيانات بنجاح</p>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <>
      {/* زر فتح أداة استخراج البيانات */}
      <motion.button
        className="fixed bottom-36 left-4 w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(!isVisible)}
      >
        <Scan className="w-6 h-6 text-white" />
      </motion.button>

      {/* واجهة استخراج البيانات */}
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
              className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* رأس الأداة */}
              <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Scan className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">استخراج البيانات</h3>
                      <p className="text-sm opacity-90">من الصور والمستندات</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 bg-white/20 rounded-full"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {!capturedImage ? (
                  <>
                    {/* اختيار نوع الاستخراج */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        نوع الاستخراج
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {extractionTypes.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setExtractionType(type.id)}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              extractionType === type.id
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                            }`}
                          >
                            <type.icon className={`w-6 h-6 mx-auto mb-1 ${
                              extractionType === type.id ? 'text-green-600' : 'text-gray-500'
                            }`} />
                            <div className="text-xs font-medium text-center">
                              {type.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* أزرار التقاط الصور */}
                    <div className="space-y-3">
                      <button
                        onClick={handleCameraCapture}
                        className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center space-x-3 space-x-reverse"
                      >
                        <Camera className="w-5 h-5" />
                        <span>التقاط صورة</span>
                      </button>

                      <button
                        onClick={handleFileUpload}
                        className="w-full p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center space-x-3 space-x-reverse"
                      >
                        <Upload className="w-5 h-5" />
                        <span>رفع صورة</span>
                      </button>
                    </div>

                    {/* وصف النوع المحدد */}
                    {extractionTypes.find(t => t.id === extractionType) && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {extractionTypes.find(t => t.id === extractionType).description}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* معاينة الصورة */}
                    <div className="mb-4">
                      <div className="relative">
                        <img
                          src={capturedImage}
                          alt="Captured"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setPreviewMode(!previewMode)}
                          className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={resetState}
                          className="absolute top-2 left-2 p-2 bg-black/50 text-white rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* حالة المعالجة */}
                    {isProcessing && (
                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Zap className="w-5 h-5 text-blue-500" />
                          </motion.div>
                          <span className="text-blue-700 dark:text-blue-300">
                            جاري تحليل الصورة واستخراج البيانات...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* البيانات المستخرجة */}
                    {extractedData && !isProcessing && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          البيانات المستخرجة
                        </h4>
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                          {renderExtractedData()}
                        </div>
                      </div>
                    )}

                    {/* أزرار التحكم */}
                    {extractedData && !isProcessing && (
                      <div className="flex space-x-3 space-x-reverse">
                        <button
                          onClick={handleConfirmData}
                          className="flex-1 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center space-x-2 space-x-reverse"
                        >
                          <Check className="w-4 h-4" />
                          <span>حفظ البيانات</span>
                        </button>
                        <button
                          onClick={resetState}
                          className="flex-1 p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center space-x-2 space-x-reverse"
                        >
                          <X className="w-4 h-4" />
                          <span>إلغاء</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* مدخلات الملفات المخفية */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageCapture(e.target.files[0])}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleImageCapture(e.target.files[0])}
                className="hidden"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageDataExtractor;

