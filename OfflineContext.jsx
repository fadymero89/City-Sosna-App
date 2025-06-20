// مكون إدارة الحالة الأوفلاين
import React, { createContext, useContext, useEffect, useState } from 'react';
import SyncManager from '../utils/syncManager.js';
import LocalDatabase from '../utils/localDatabase.js';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState({
    inProgress: false,
    lastSync: null,
    pendingItems: 0,
    message: ''
  });
  const [syncManager] = useState(() => new SyncManager());
  const [localDb] = useState(() => new LocalDatabase());

  useEffect(() => {
    // إعداد مستمعي المزامنة
    const handleSyncUpdate = (data) => {
      switch (data.type) {
        case 'connection':
          setIsOnline(data.isOnline);
          break;
        case 'sync_start':
          setSyncStatus(prev => ({
            ...prev,
            inProgress: true,
            message: 'جاري المزامنة...'
          }));
          break;
        case 'sync_complete':
          setSyncStatus(prev => ({
            ...prev,
            inProgress: false,
            lastSync: new Date(),
            message: data.message,
            pendingItems: data.failureCount || 0
          }));
          break;
        case 'download_start':
          setSyncStatus(prev => ({
            ...prev,
            inProgress: true,
            message: 'جاري تحميل البيانات...'
          }));
          break;
        case 'download_complete':
          setSyncStatus(prev => ({
            ...prev,
            inProgress: false,
            message: data.message
          }));
          break;
        default:
          break;
      }
    };

    syncManager.addSyncCallback(handleSyncUpdate);

    // تحديث عدد العناصر المعلقة
    const updatePendingItems = async () => {
      const queue = await localDb.getSyncQueue();
      setSyncStatus(prev => ({
        ...prev,
        pendingItems: queue.length
      }));
    };

    updatePendingItems();
    const interval = setInterval(updatePendingItems, 10000); // كل 10 ثوان

    return () => {
      syncManager.removeSyncCallback(handleSyncUpdate);
      clearInterval(interval);
    };
  }, [syncManager, localDb]);

  // دوال إدارة البيانات
  const addProduct = async (product) => {
    try {
      const id = await localDb.add('products', product);
      return { success: true, id };
    } catch (error) {
      console.error('خطأ في إضافة المنتج:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProduct = async (product) => {
    try {
      await localDb.update('products', product);
      return { success: true };
    } catch (error) {
      console.error('خطأ في تحديث المنتج:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (id) => {
    try {
      await localDb.delete('products', id);
      return { success: true };
    } catch (error) {
      console.error('خطأ في حذف المنتج:', error);
      return { success: false, error: error.message };
    }
  };

  const getProducts = async (filter) => {
    try {
      const products = await localDb.getAll('products', filter);
      return { success: true, data: products };
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
      return { success: false, error: error.message };
    }
  };

  const addCustomer = async (customer) => {
    try {
      const id = await localDb.add('customers', customer);
      return { success: true, id };
    } catch (error) {
      console.error('خطأ في إضافة العميل:', error);
      return { success: false, error: error.message };
    }
  };

  const updateCustomer = async (customer) => {
    try {
      await localDb.update('customers', customer);
      return { success: true };
    } catch (error) {
      console.error('خطأ في تحديث العميل:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await localDb.delete('customers', id);
      return { success: true };
    } catch (error) {
      console.error('خطأ في حذف العميل:', error);
      return { success: false, error: error.message };
    }
  };

  const getCustomers = async (filter) => {
    try {
      const customers = await localDb.getAll('customers', filter);
      return { success: true, data: customers };
    } catch (error) {
      console.error('خطأ في جلب العملاء:', error);
      return { success: false, error: error.message };
    }
  };

  const addInvoice = async (invoice) => {
    try {
      const id = await localDb.add('invoices', invoice);
      return { success: true, id };
    } catch (error) {
      console.error('خطأ في إضافة الفاتورة:', error);
      return { success: false, error: error.message };
    }
  };

  const updateInvoice = async (invoice) => {
    try {
      await localDb.update('invoices', invoice);
      return { success: true };
    } catch (error) {
      console.error('خطأ في تحديث الفاتورة:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await localDb.delete('invoices', id);
      return { success: true };
    } catch (error) {
      console.error('خطأ في حذف الفاتورة:', error);
      return { success: false, error: error.message };
    }
  };

  const getInvoices = async (filter) => {
    try {
      const invoices = await localDb.getAll('invoices', filter);
      return { success: true, data: invoices };
    } catch (error) {
      console.error('خطأ في جلب الفواتير:', error);
      return { success: false, error: error.message };
    }
  };

  // دوال المزامنة
  const forceSync = async () => {
    await syncManager.forcSync();
  };

  const downloadServerData = async () => {
    await syncManager.downloadServerData();
  };

  const clearAllData = async () => {
    await syncManager.clearAllData();
  };

  const value = {
    // حالة الاتصال
    isOnline,
    syncStatus,
    
    // دوال المنتجات
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    
    // دوال العملاء
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomers,
    
    // دوال الفواتير
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoices,
    
    // دوال المزامنة
    forceSync,
    downloadServerData,
    clearAllData,
    
    // قاعدة البيانات المحلية
    localDb,
    syncManager
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};

