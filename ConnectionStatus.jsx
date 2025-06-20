// مكون شريط حالة الاتصال والمزامنة
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, RefreshCw, Download, Upload, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';

const ConnectionStatus = () => {
  const { isOnline, syncStatus, forceSync, downloadServerData } = useOffline();

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (syncStatus.inProgress) return 'bg-yellow-500';
    if (syncStatus.pendingItems > 0) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    if (syncStatus.inProgress) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (syncStatus.pendingItems > 0) return <Upload className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'غير متصل';
    if (syncStatus.inProgress) return 'جاري المزامنة...';
    if (syncStatus.pendingItems > 0) return `${syncStatus.pendingItems} عنصر في الانتظار`;
    return 'متصل ومتزامن';
  };

  const formatLastSync = () => {
    if (!syncStatus.lastSync) return 'لم تتم المزامنة بعد';
    
    const now = new Date();
    const lastSync = new Date(syncStatus.lastSync);
    const diffMinutes = Math.floor((now - lastSync) / (1000 * 60));
    
    if (diffMinutes < 1) return 'منذ لحظات';
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `منذ ${diffDays} يوم`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* شريط الحالة الرئيسي */}
      <motion.div
        className={`${getStatusColor()} text-white px-4 py-2 flex items-center justify-between text-sm`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isOnline && (
            <>
              <button
                onClick={forceSync}
                disabled={syncStatus.inProgress}
                className="p-1 rounded hover:bg-white/20 transition-colors disabled:opacity-50"
                title="مزامنة فورية"
              >
                <RefreshCw className={`w-4 h-4 ${syncStatus.inProgress ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={downloadServerData}
                disabled={syncStatus.inProgress}
                className="p-1 rounded hover:bg-white/20 transition-colors disabled:opacity-50"
                title="تحميل البيانات"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
          
          <div className="flex items-center gap-1 text-xs opacity-75">
            <Clock className="w-3 h-3" />
            <span>{formatLastSync()}</span>
          </div>
        </div>
      </motion.div>

      {/* رسائل المزامنة */}
      <AnimatePresence>
        {syncStatus.message && (
          <motion.div
            className="bg-blue-500 text-white px-4 py-2 text-sm text-center"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {syncStatus.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* تحذير عدم الاتصال */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            className="bg-red-600 text-white px-4 py-3 text-center"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <div>
                <div className="font-medium">وضع عدم الاتصال</div>
                <div className="text-sm opacity-90">
                  ستتم مزامنة التغييرات عند عودة الاتصال
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectionStatus;

