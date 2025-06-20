// نظام إدارة قاعدة البيانات المحلية
class LocalDatabase {
  constructor() {
    this.dbName = 'sosna_offline_db';
    this.version = 1;
    this.db = null;
    this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // إنشاء جداول قاعدة البيانات المحلية
        if (!db.objectStoreNames.contains('products')) {
          const productsStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
          productsStore.createIndex('name', 'name', { unique: false });
          productsStore.createIndex('category', 'category', { unique: false });
          productsStore.createIndex('lastModified', 'lastModified', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('customers')) {
          const customersStore = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
          customersStore.createIndex('name', 'name', { unique: false });
          customersStore.createIndex('phone', 'phone', { unique: false });
          customersStore.createIndex('lastModified', 'lastModified', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('invoices')) {
          const invoicesStore = db.createObjectStore('invoices', { keyPath: 'id', autoIncrement: true });
          invoicesStore.createIndex('customerId', 'customerId', { unique: false });
          invoicesStore.createIndex('date', 'date', { unique: false });
          invoicesStore.createIndex('status', 'status', { unique: false });
          invoicesStore.createIndex('lastModified', 'lastModified', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('operation', 'operation', { unique: false });
          syncStore.createIndex('table', 'table', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // إضافة timestamp للتعديل
    data.lastModified = new Date().toISOString();
    data.needsSync = true;
    
    const result = await new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // إضافة العملية لقائمة المزامنة
    await this.addToSyncQueue('create', storeName, result, data);
    
    return result;
  }

  async update(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    data.lastModified = new Date().toISOString();
    data.needsSync = true;
    
    const result = await new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    await this.addToSyncQueue('update', storeName, data.id, data);
    
    return result;
  }

  async delete(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    const result = await new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    await this.addToSyncQueue('delete', storeName, id, null);
    
    return result;
  }

  async get(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName, filter = null) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        let results = request.result;
        if (filter) {
          results = results.filter(filter);
        }
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async addToSyncQueue(operation, table, recordId, data) {
    const syncItem = {
      operation,
      table,
      recordId,
      data,
      timestamp: new Date().toISOString(),
      attempts: 0,
      maxAttempts: 3
    };
    
    const transaction = this.db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    
    return new Promise((resolve, reject) => {
      const request = store.add(syncItem);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueue() {
    return this.getAll('sync_queue');
  }

  async removeSyncItem(id) {
    const transaction = this.db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateSyncItem(id, data) {
    const transaction = this.db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    
    return new Promise((resolve, reject) => {
      const request = store.put({ ...data, id });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearSyncQueue() {
    const transaction = this.db.transaction(['sync_queue'], 'readwrite');
    const store = transaction.objectStore('sync_queue');
    
    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async setSetting(key, value) {
    const transaction = this.db.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    return new Promise((resolve, reject) => {
      const request = store.put({ key, value });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSetting(key) {
    const transaction = this.db.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }
}

export default LocalDatabase;

