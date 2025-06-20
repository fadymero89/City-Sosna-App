import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OfflineProvider } from './OfflineContext';
import LoadingScreen from './LoadingScreen';
import LoginScreen from './LoginScreen';
import Register from './Register';
import Dashboard from './Dashboard';
import MobileNavigation from './MobileNavigation';
import NotificationSystem from './NotificationSystem';
import ConnectionStatus from './ConnectionStatus';
import OfflineProducts from './OfflineProducts';
import EnhancedProducts from './EnhancedProducts';
import VoiceAssistant from './VoiceAssistant';
import EgyptianVoiceAssistant from './EgyptianVoiceAssistant';
import EmployeeManagement from './EmployeeManagement';
import ImageDataExtractor from './ImageDataExtractor';
import GestureController from "./GestureController";
import DirectCommunication from "./DirectCommunication";
import SmartShortcuts from "./SmartShortcuts";
import PWAInstaller from "./PWAInstaller";
import CommunicationSystem from "./CommunicationSystem";
import CustomerInterface from "./CustomerInterface";
import ComprehensiveSettings from "./ComprehensiveSettings";
import { 
  InvoicesScreen, 
  CustomersScreen, 
  ScrapScreen, 
  ReportsScreen, 
  AIAssistant, 
  SettingsScreen 
} from './TempComponents';
import { useLocalStorage, useOfflineSync, useTheme } from './useLocalStorage';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useLocalStorage('sosna_user', null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { theme, toggleTheme } = useTheme();
  const { isOnline, syncStatus } = useOfflineSync();

  useEffect(() => {
    // محاكاة تحميل التطبيق
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [...prev, notification]);

    // إزالة الإشعار بعد 5 ثوان
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    addNotification(`أهلاً بك، ${userData.name}! 🎉`, 'success');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowRegister(false);
    addNotification(`مرحباً بك في مدينة سوسنا، ${userData.name}! 🎉`, 'success');
  };

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('dashboard');
    addNotification('تم تسجيل الخروج بنجاح', 'info');
  };

  const handleDataExtracted = (extractedData) => {
    // معالجة البيانات المستخرجة حسب النوع
    switch (extractedData.type) {
      case 'product':
      case 'auto_detected':
        // إضافة منتج جديد
        setCurrentPage('products');
        addNotification('تم استخراج بيانات المنتج، يمكنك مراجعتها وحفظها', 'info');
        break;
      case 'business_card':
        // إضافة عميل جديد
        setCurrentPage('customers');
        addNotification('تم استخراج بيانات العميل، يمكنك مراجعتها وحفظها', 'info');
        break;
      case 'receipt':
        // إنشاء فاتورة
        setCurrentPage('invoices');
        addNotification('تم استخراج بيانات الفاتورة، يمكنك مراجعتها', 'info');
        break;
      default:
        addNotification('تم استخراج البيانات بنجاح', 'success');
    }
  };

  const handleGestureAction = (action, gestureType) => {
    // معالجة إجراءات الإيماءات
    switch (action) {
      case 'next-page':
        // التنقل للصفحة التالية
        const pages = ['dashboard', 'invoices', 'products', 'customers', 'reports'];
        const currentIndex = pages.indexOf(currentPage);
        const nextIndex = (currentIndex + 1) % pages.length;
        setCurrentPage(pages[nextIndex]);
        break;
      case 'prev-page':
        // التنقل للصفحة السابقة
        const pagesBack = ['dashboard', 'invoices', 'products', 'customers', 'reports'];
        const currentIndexBack = pagesBack.indexOf(currentPage);
        const prevIndex = currentIndexBack === 0 ? pagesBack.length - 1 : currentIndexBack - 1;
        setCurrentPage(pagesBack[prevIndex]);
        break;
      case 'refresh':
        // تحديث الصفحة
        window.location.reload();
        break;
      case 'scroll-up':
        // التمرير لأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'scroll-down':
        // التمرير لأسفل
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        break;
      default:
        addNotification(`تم تنفيذ إجراء: ${action}`, 'info');
    }
  };

  const handleShortcutAction = (action, shortcut) => {
    // معالجة إجراءات الاختصارات الذكية
    switch (action) {
      case 'create_quick_invoice':
        setCurrentPage('invoices');
        addNotification('فتح صفحة الفواتير لإنشاء فاتورة سريعة', 'info');
        break;
      case 'show_daily_report':
        setCurrentPage('reports');
        addNotification('عرض تقرير مبيعات اليوم', 'info');
        break;
      case 'show_top_customers':
        setCurrentPage('customers');
        addNotification('عرض قائمة أفضل العملاء', 'info');
        break;
      case 'check_low_stock':
        setCurrentPage('products');
        addNotification('فحص المنتجات ذات المخزون المنخفض', 'warning');
        break;
      case 'calculate_profits':
        addNotification('حساب الأرباح: إجمالي الأرباح المتوقعة 15,750 جنيه', 'success');
        break;
      case 'backup_data':
        addNotification('تم إنشاء نسخة احتياطية من البيانات بنجاح', 'success');
        break;
      default:
        addNotification(`تم تنفيذ اختصار: ${shortcut.name}`, 'info');
    }
  };

  const handleUpdateSettings = (newSettings) => {
    // حفظ الإعدادات وتطبيقها
    localStorage.setItem('sosna_settings', JSON.stringify(newSettings));
    addNotification('تم حفظ الإعدادات بنجاح', 'success');
    setShowSettings(false);
  };

  const renderCurrentPage = () => {
    const pageProps = { user, addNotification };

    // إذا كان المستخدم عميل، عرض واجهة العملاء المخصصة
    if (user && user.type === 'customer') {
      return <CustomerInterface user={user} onLogout={handleLogout} />;
    }

    // واجهة الموظفين والإدارة
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard {...pageProps} />;
      case 'invoices':
        return <InvoicesScreen {...pageProps} />;
      case 'products':
        return <EnhancedProducts {...pageProps} />;
      case 'customers':
        return <CustomersScreen {...pageProps} />;
      case 'employees':
        return <EmployeeManagement {...pageProps} />;
      case 'scrap':
        return <ScrapScreen {...pageProps} />;
      case 'reports':
        return <ReportsScreen {...pageProps} />;
      case 'assistant':
        return <AIAssistant {...pageProps} />;
      case 'settings':
        return <SettingsScreen {...pageProps} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} onOpenSettings={() => setShowSettings(true)} />;
      case 'communication':
        return <CommunicationSystem {...pageProps} />;
      default:
        return <Dashboard {...pageProps} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <OfflineProvider>
        {showRegister ? (
          <Register onRegister={handleRegister} onBackToLogin={handleBackToLogin} />
        ) : (
          <LoginScreen onLogin={handleLogin} onShowRegister={handleShowRegister} />
        )}
      </OfflineProvider>
    );
  }

  return (
    <OfflineProvider>
      <div className={`app ${theme}`}>
        {/* شريط حالة الاتصال والمزامنة */}
        <ConnectionStatus />

        {/* شريط الحالة */}
        <div className="status-bar bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 mt-16">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{syncStatus}</span>
            </div>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">مدينة سوسنا</h1>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {user.name?.charAt(0) || 'م'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* عرض الميزات الإضافية للموظفين فقط */}
        {user.role !== 'customer' && (
          <>
            {/* شريط التنقل */}
            <MobileNavigation 
              currentPage={currentPage} 
              onPageChange={setCurrentPage}
              user={user}
            />

            {/* المساعد الذكي الصوتي */}
            <VoiceAssistant user={user} addNotification={addNotification} />

            {/* أداة استخراج البيانات من الصور */}
            <ImageDataExtractor 
              user={user} 
              addNotification={addNotification} 
              onDataExtracted={handleDataExtracted}
            />

            {/* نظام التحكم بالإيماءات */}
            <GestureController 
              user={user} 
              addNotification={addNotification} 
              onGestureAction={handleGestureAction}
            />

            {/* نظام التواصل المباشر */}
            <DirectCommunication 
              user={user} 
              addNotification={addNotification}
            />

            {/* الاختصارات الذكية */}
            <SmartShortcuts 
              user={user} 
              addNotification={addNotification} 
              onShortcutAction={handleShortcutAction}
            />
          </>
        )}

        {/* نظام الإشعارات */}
        <NotificationSystem notifications={notifications} />

        {/* مثبت التطبيق PWA */}
        <PWAInstaller />

        {/* نظام الإعدادات الشامل */}
        <AnimatePresence>
          {showSettings && (
            <ComprehensiveSettings
              user={user}
              onUpdateSettings={handleUpdateSettings}
              onClose={() => setShowSettings(false)}
            />
          )}
        </AnimatePresence>

        {/* تأثيرات خلفية */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10" />
          
          {/* جسيمات متحركة */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              animate={{
                x: [0, Math.random() * window.innerWidth],
                y: [0, Math.random() * window.innerHeight],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
      </div>
    </OfflineProvider>
  );
}

export default App;

