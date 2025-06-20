// نظام المزامنة التلقائية
import LocalDatabase from './localDatabase.js';

class SyncManager {
  constructor() {
    this.db = new LocalDatabase();
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.syncInterval = null;
    this.serverUrl = 'https://api.sosna.local'; // سيتم تحديثه لاحقاً
    this.syncCallbacks = [];
    
    this.init();
  }

  init() {
    // مراقبة حالة الاتصال
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onConnectionChange(true);
      this.startAutoSync();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.onConnectionChange(false);
      this.stopAutoSync();
    });
    
    // بدء المزامنة التلقائية إذا كان متصلاً
    if (this.isOnline) {
      this.startAutoSync();
    }
  }

  onConnectionChange(isOnline) {
    this.syncCallbacks.forEach(callback => {
      if (typeof callback === 'function') {
        callback({ isOnline, type: 'connection' });
      }
    });
  }

  addSyncCallback(callback) {
    this.syncCallbacks.push(callback);
  }

  removeSyncCallback(callback) {
    const index = this.syncCallbacks.indexOf(callback);
    if (index > -1) {
      this.syncCallbacks.splice(index, 1);
    }
  }

  startAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    // مزامنة كل 30 ثانية
    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.performSync();
      }
    }, 30000);
    
    // مزامنة فورية
    if (this.isOnline && !this.syncInProgress) {
      setTimeout(() => this.performSync(), 1000);
    }
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async performSync() {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    this.notifyCallbacks({ type: 'sync_start' });

    try {
      // جلب قائمة المزامنة
      const syncQueue = await this.db.getSyncQueue();
      
      if (syncQueue.length === 0) {
        this.notifyCallbacks({ type: 'sync_complete', success: true, message: 'لا توجد بيانات للمزامنة' });
        return;
      }

      let successCount = 0;
      let failureCount = 0;

      // معالجة كل عنصر في قائمة المزامنة
      for (const item of syncQueue) {
        try {
          const success = await this.syncItem(item);
          if (success) {
            await this.db.removeSyncItem(item.id);
            successCount++;
          } else {
            // زيادة عدد المحاولات
            item.attempts++;
            if (item.attempts >= item.maxAttempts) {
              // حذف العنصر إذا تجاوز الحد الأقصى للمحاولات
              await this.db.removeSyncItem(item.id);
              failureCount++;
            } else {
              await this.db.updateSyncItem(item.id, item);
            }
          }
        } catch (error) {
          console.error('خطأ في مزامنة العنصر:', error);
          failureCount++;
        }
      }

      this.notifyCallbacks({
        type: 'sync_complete',
        success: true,
        message: `تمت المزامنة بنجاح: ${successCount} عنصر، فشل: ${failureCount} عنصر`,
        successCount,
        failureCount
      });

    } catch (error) {
      console.error('خطأ في المزامنة:', error);
      this.notifyCallbacks({
        type: 'sync_complete',
        success: false,
        message: 'فشل في المزامنة: ' + error.message
      });
    } finally {
      this.syncInProgress = false;
    }
  }

  async syncItem(item) {
    try {
      const { operation, table, recordId, data } = item;
      
      // محاكاة استدعاء API
      // في التطبيق الحقيقي، سيتم استبدال هذا بـ API calls فعلية
      const response = await this.mockApiCall(operation, table, recordId, data);
      
      if (response.success) {
        // تحديث البيانات المحلية بالمعرف الجديد من الخادم إذا لزم الأمر
        if (operation === 'create' && response.serverId) {
          await this.updateLocalRecordId(table, recordId, response.serverId);
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('خطأ في مزامنة العنصر:', error);
      return false;
    }
  }

  async mockApiCall(operation, table, recordId, data) {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    // محاكاة نجاح العملية (90% نجاح)
    const success = Math.random() > 0.1;
    
    if (success) {
      return {
        success: true,
        serverId: operation === 'create' ? Math.floor(Math.random() * 10000) + 1000 : recordId,
        message: `تمت ${operation} بنجاح في جدول ${table}`
      };
    } else {
      throw new Error('فشل في الاتصال بالخادم');
    }
  }

  async updateLocalRecordId(table, oldId, newId) {
    try {
      const record = await this.db.get(table, oldId);
      if (record) {
        record.id = newId;
        record.serverId = newId;
        record.needsSync = false;
        
        await this.db.delete(table, oldId);
        await this.db.add(table, record);
      }
    } catch (error) {
      console.error('خطأ في تحديث معرف السجل:', error);
    }
  }

  notifyCallbacks(data) {
    this.syncCallbacks.forEach(callback => {
      if (typeof callback === 'function') {
        callback(data);
      }
    });
  }

  async forcSync() {
    if (!this.isOnline) {
      this.notifyCallbacks({
        type: 'sync_complete',
        success: false,
        message: 'لا يوجد اتصال بالإنترنت'
      });
      return;
    }

    await this.performSync();
  }

  async clearAllData() {
    try {
      await this.db.clearSyncQueue();
      
      // حذف جميع البيانات المحلية
      const tables = ['products', 'customers', 'invoices'];
      for (const table of tables) {
        const transaction = this.db.db.transaction([table], 'readwrite');
        const store = transaction.objectStore(table);
        await new Promise((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
      
      this.notifyCallbacks({
        type: 'data_cleared',
        success: true,
        message: 'تم حذف جميع البيانات المحلية'
      });
    } catch (error) {
      console.error('خطأ في حذف البيانات:', error);
      this.notifyCallbacks({
        type: 'data_cleared',
        success: false,
        message: 'فشل في حذف البيانات: ' + error.message
      });
    }
  }

  async getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress,
      pendingItems: (await this.db.getSyncQueue()).length
    };
  }

  async downloadServerData() {
    if (!this.isOnline) {
      throw new Error('لا يوجد اتصال بالإنترنت');
    }

    try {
      this.notifyCallbacks({ type: 'download_start' });
      
      // محاكاة تحميل البيانات من الخادم
      const serverData = await this.mockDownloadData();
      
      // حفظ البيانات محلياً
      for (const [table, records] of Object.entries(serverData)) {
        for (const record of records) {
          record.needsSync = false;
          record.lastModified = new Date().toISOString();
          await this.db.add(table, record);
        }
      }
      
      this.notifyCallbacks({
        type: 'download_complete',
        success: true,
        message: 'تم تحميل البيانات من الخادم بنجاح'
      });
      
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      this.notifyCallbacks({
        type: 'download_complete',
        success: false,
        message: 'فشل في تحميل البيانات: ' + error.message
      });
    }
  }

  async mockDownloadData() {
    // محاكاة تأخير التحميل
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      products: [
        { id: 1, name: 'منتج تجريبي 1', price: 100, category: 'فئة أ', stock: 50 },
        { id: 2, name: 'منتج تجريبي 2', price: 200, category: 'فئة ب', stock: 30 }
      ],
      customers: [
        { id: 1, name: 'عميل تجريبي 1', phone: '01234567890', address: 'العنوان 1' },
        { id: 2, name: 'عميل تجريبي 2', phone: '01234567891', address: 'العنوان 2' }
      ]
    };
  }
}

export default SyncManager;

