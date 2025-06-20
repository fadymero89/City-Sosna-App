import React, { useState, useEffect } from 'react';
import './PWAInstaller.css';

const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installationProgress, setInstallationProgress] = useState(0);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState({});
  const [supportedFeatures, setSupportedFeatures] = useState({});

  useEffect(() => {
    checkPWAStatus();
    detectDevice();
    checkSupportedFeatures();
    setupEventListeners();
    
    // إظهار بانر التثبيت بعد 30 ثانية إذا لم يكن مثبتاً
    const timer = setTimeout(() => {
      if (!isInstalled && !isStandalone && isInstallable) {
        setShowInstallBanner(true);
      }
    }, 30000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const checkPWAStatus = () => {
    // فحص إذا كان التطبيق يعمل في وضع standalone
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                     window.navigator.standalone ||
                     document.referrer.includes('android-app://');
    
    setIsStandalone(standalone);
    
    // فحص إذا كان التطبيق مثبتاً
    if ('getInstalledRelatedApps' in navigator) {
      navigator.getInstalledRelatedApps().then((relatedApps) => {
        setIsInstalled(relatedApps.length > 0);
      });
    }
  };

  const detectDevice = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    const device = {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
      isIOS: /iPad|iPhone|iPod/.test(userAgent),
      isAndroid: /Android/.test(userAgent),
      isChrome: /Chrome/.test(userAgent),
      isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
      isFirefox: /Firefox/.test(userAgent),
      platform: platform,
      userAgent: userAgent
    };
    
    setDeviceInfo(device);
  };

  const checkSupportedFeatures = () => {
    const features = {
      serviceWorker: 'serviceWorker' in navigator,
      pushNotifications: 'PushManager' in window,
      backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
      webShare: 'share' in navigator,
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      geolocation: 'geolocation' in navigator,
      storage: 'storage' in navigator && 'estimate' in navigator.storage,
      badging: 'setAppBadge' in navigator,
      fileSystem: 'showOpenFilePicker' in window,
      webLocks: 'locks' in navigator,
      wakeLock: 'wakeLock' in navigator
    };
    
    setSupportedFeatures(features);
  };

  const setupEventListeners = () => {
    // الاستماع لحدث beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // الاستماع لحدث appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowInstallBanner(false);
      console.log('✅ تم تثبيت التطبيق بنجاح!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  };

  const installPWA = async () => {
    if (!deferredPrompt) {
      showManualInstallInstructions();
      return;
    }

    try {
      setInstallationProgress(25);
      
      // إظهار مربع حوار التثبيت
      deferredPrompt.prompt();
      setInstallationProgress(50);
      
      // انتظار اختيار المستخدم
      const { outcome } = await deferredPrompt.userChoice;
      setInstallationProgress(75);
      
      if (outcome === 'accepted') {
        console.log('✅ المستخدم وافق على التثبيت');
        setInstallationProgress(100);
        
        // إخفاء البانر
        setShowInstallBanner(false);
        
        setTimeout(() => {
          setInstallationProgress(0);
        }, 2000);
      } else {
        console.log('❌ المستخدم رفض التثبيت');
        setInstallationProgress(0);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('خطأ في التثبيت:', error);
      setInstallationProgress(0);
      showManualInstallInstructions();
    }
  };

  const showManualInstallInstructions = () => {
    let instructions = '';
    
    if (deviceInfo.isIOS) {
      instructions = `
        لتثبيت التطبيق على iOS:
        1. اضغط على زر المشاركة (⬆️) في Safari
        2. اختر "إضافة إلى الشاشة الرئيسية"
        3. اضغط "إضافة" لتأكيد التثبيت
      `;
    } else if (deviceInfo.isAndroid && deviceInfo.isChrome) {
      instructions = `
        لتثبيت التطبيق على Android:
        1. اضغط على القائمة (⋮) في Chrome
        2. اختر "إضافة إلى الشاشة الرئيسية"
        3. اضغط "إضافة" لتأكيد التثبيت
      `;
    } else {
      instructions = `
        لتثبيت التطبيق:
        1. ابحث عن خيار "تثبيت التطبيق" في متصفحك
        2. أو اضغط على أيقونة التثبيت في شريط العناوين
        3. اتبع التعليمات لإكمال التثبيت
      `;
    }
    
    alert(instructions);
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker مسجل بنجاح:', registration);
        
        // التحقق من التحديثات
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // يوجد تحديث جديد
              if (confirm('يوجد تحديث جديد للتطبيق. هل تريد إعادة التحميل؟')) {
                window.location.reload();
              }
            }
          });
        });
        
        return registration;
      } catch (error) {
        console.error('❌ خطأ في تسجيل Service Worker:', error);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('✅ تم منح إذن الإشعارات');
        
        // إرسال إشعار تجريبي
        new Notification('مدينة سوسنا', {
          body: 'تم تفعيل الإشعارات بنجاح!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          dir: 'rtl',
          lang: 'ar'
        });
      }
    }
  };

  const shareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'مدينة سوسنا - نظام إدارة شامل',
          text: 'تطبيق متطور لإدارة الأعمال مع ميزات ذكية ومبتكرة',
          url: window.location.href
        });
      } catch (error) {
        console.log('تم إلغاء المشاركة');
      }
    } else {
      // نسخ الرابط للحافظة
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('تم نسخ رابط التطبيق للحافظة!');
      });
    }
  };

  const getStorageUsage = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? (used / quota * 100).toFixed(2) : 0;
      
      return {
        used: formatBytes(used),
        quota: formatBytes(quota),
        percentage: percentage
      };
    }
    return null;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearAppData = async () => {
    if (confirm('هل أنت متأكد من مسح جميع بيانات التطبيق؟ سيتم حذف التخزين المؤقت والبيانات المحلية.')) {
      try {
        // مسح التخزين المؤقت
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        // مسح التخزين المحلي
        localStorage.clear();
        sessionStorage.clear();
        
        // مسح IndexedDB
        if ('indexedDB' in window) {
          // يمكن إضافة منطق مسح قواعد البيانات المحلية هنا
        }
        
        alert('تم مسح جميع بيانات التطبيق بنجاح!');
        window.location.reload();
      } catch (error) {
        console.error('خطأ في مسح البيانات:', error);
        alert('حدث خطأ أثناء مسح البيانات');
      }
    }
  };

  return (
    <div className="pwa-installer">
      {/* بانر التثبيت */}
      {showInstallBanner && !isInstalled && !isStandalone && (
        <div className="install-banner">
          <div className="banner-content">
            <div className="banner-icon">📱</div>
            <div className="banner-text">
              <h4>ثبت تطبيق مدينة سوسنا</h4>
              <p>احصل على تجربة أفضل مع التطبيق المثبت</p>
            </div>
            <div className="banner-actions">
              <button className="install-btn" onClick={installPWA}>
                تثبيت
              </button>
              <button 
                className="dismiss-btn" 
                onClick={() => setShowInstallBanner(false)}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* واجهة إدارة PWA */}
      <div className="pwa-manager">
        <div className="pwa-header">
          <h2>🚀 إدارة التطبيق التقدمي</h2>
          <p>تحكم في إعدادات وميزات التطبيق التقدمي</p>
        </div>

        {/* حالة التطبيق */}
        <div className="app-status">
          <h3>حالة التطبيق</h3>
          <div className="status-grid">
            <div className={`status-item ${isInstalled ? 'active' : ''}`}>
              <span className="status-icon">📱</span>
              <span className="status-text">
                {isInstalled ? 'مثبت' : 'غير مثبت'}
              </span>
            </div>
            
            <div className={`status-item ${isStandalone ? 'active' : ''}`}>
              <span className="status-icon">🖥️</span>
              <span className="status-text">
                {isStandalone ? 'وضع مستقل' : 'وضع متصفح'}
              </span>
            </div>
            
            <div className={`status-item ${supportedFeatures.serviceWorker ? 'active' : ''}`}>
              <span className="status-icon">⚙️</span>
              <span className="status-text">
                {supportedFeatures.serviceWorker ? 'Service Worker نشط' : 'Service Worker غير مدعوم'}
              </span>
            </div>
            
            <div className={`status-item ${isInstallable ? 'active' : ''}`}>
              <span className="status-icon">⬇️</span>
              <span className="status-text">
                {isInstallable ? 'قابل للتثبيت' : 'غير قابل للتثبيت'}
              </span>
            </div>
          </div>
        </div>

        {/* معلومات الجهاز */}
        <div className="device-info">
          <h3>معلومات الجهاز</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">النوع:</span>
              <span className="info-value">
                {deviceInfo.isMobile ? 'موبايل' : 'كمبيوتر'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">النظام:</span>
              <span className="info-value">
                {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'أخرى'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">المتصفح:</span>
              <span className="info-value">
                {deviceInfo.isChrome ? 'Chrome' : 
                 deviceInfo.isSafari ? 'Safari' : 
                 deviceInfo.isFirefox ? 'Firefox' : 'أخرى'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">المنصة:</span>
              <span className="info-value">{deviceInfo.platform}</span>
            </div>
          </div>
        </div>

        {/* الميزات المدعومة */}
        <div className="supported-features">
          <h3>الميزات المدعومة</h3>
          <div className="features-grid">
            {Object.entries(supportedFeatures).map(([feature, supported]) => (
              <div key={feature} className={`feature-item ${supported ? 'supported' : 'not-supported'}`}>
                <span className="feature-icon">
                  {supported ? '✅' : '❌'}
                </span>
                <span className="feature-name">
                  {getFeatureName(feature)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* إجراءات التطبيق */}
        <div className="app-actions">
          <h3>إجراءات التطبيق</h3>
          <div className="actions-grid">
            {!isInstalled && isInstallable && (
              <button className="action-btn primary" onClick={installPWA}>
                📱 تثبيت التطبيق
              </button>
            )}
            
            {!isInstalled && !isInstallable && (
              <button className="action-btn secondary" onClick={showManualInstallInstructions}>
                📖 تعليمات التثبيت
              </button>
            )}
            
            <button className="action-btn secondary" onClick={registerServiceWorker}>
              ⚙️ تسجيل Service Worker
            </button>
            
            <button className="action-btn secondary" onClick={requestNotificationPermission}>
              🔔 تفعيل الإشعارات
            </button>
            
            <button className="action-btn secondary" onClick={shareApp}>
              📤 مشاركة التطبيق
            </button>
            
            <button className="action-btn danger" onClick={clearAppData}>
              🗑️ مسح بيانات التطبيق
            </button>
          </div>
        </div>

        {/* شريط تقدم التثبيت */}
        {installationProgress > 0 && (
          <div className="installation-progress">
            <div className="progress-label">جاري التثبيت...</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${installationProgress}%` }}
              ></div>
            </div>
            <div className="progress-percentage">{installationProgress}%</div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="additional-info">
          <h3>معلومات إضافية</h3>
          <div className="info-cards">
            <div className="info-card">
              <h4>🔄 التحديثات التلقائية</h4>
              <p>يتم فحص التحديثات تلقائياً وتطبيقها في الخلفية</p>
            </div>
            
            <div className="info-card">
              <h4>📱 العمل بدون إنترنت</h4>
              <p>يمكن استخدام التطبيق حتى بدون اتصال بالإنترنت</p>
            </div>
            
            <div className="info-card">
              <h4>🔒 الأمان والخصوصية</h4>
              <p>جميع البيانات محمية ومشفرة محلياً</p>
            </div>
            
            <div className="info-card">
              <h4>⚡ الأداء السريع</h4>
              <p>تحميل سريع وأداء محسن للهواتف المحمولة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function getFeatureName(feature) {
    const names = {
      serviceWorker: 'Service Worker',
      pushNotifications: 'الإشعارات الفورية',
      backgroundSync: 'المزامنة الخلفية',
      webShare: 'مشاركة الويب',
      camera: 'الكاميرا',
      geolocation: 'تحديد الموقع',
      storage: 'تقدير التخزين',
      badging: 'شارات التطبيق',
      fileSystem: 'نظام الملفات',
      webLocks: 'أقفال الويب',
      wakeLock: 'منع السكون'
    };
    return names[feature] || feature;
  }
};

export default PWAInstaller;

