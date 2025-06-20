// Service Worker للتطبيق التقدمي (PWA)
const CACHE_NAME = 'sosna-app-v1.0.0';
const STATIC_CACHE_NAME = 'sosna-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'sosna-dynamic-v1.0.0';

// الملفات الأساسية للتخزين المؤقت
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // الخطوط العربية
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap',
  // الأيقونات
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// الملفات الديناميكية للتخزين المؤقت
const DYNAMIC_FILES = [
  '/api/products',
  '/api/customers',
  '/api/invoices',
  '/api/dashboard',
  '/api/settings'
];

// استراتيجيات التخزين المؤقت
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// تكوين استراتيجيات التخزين لكل نوع من الطلبات
const ROUTE_STRATEGIES = {
  '/api/': CACHE_STRATEGIES.NETWORK_FIRST,
  '/static/': CACHE_STRATEGIES.CACHE_FIRST,
  '/images/': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  '/icons/': CACHE_STRATEGIES.CACHE_FIRST,
  '/': CACHE_STRATEGIES.STALE_WHILE_REVALIDATE
};

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: تثبيت...');
  
  event.waitUntil(
    Promise.all([
      // تخزين الملفات الأساسية
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('📦 تخزين الملفات الأساسية...');
        return cache.addAll(STATIC_FILES);
      }),
      
      // تخزين الملفات الديناميكية
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        console.log('🔄 إعداد التخزين الديناميكي...');
        return Promise.resolve();
      })
    ]).then(() => {
      console.log('✅ Service Worker: تم التثبيت بنجاح');
      // فرض تفعيل Service Worker الجديد فوراً
      return self.skipWaiting();
    })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: تفعيل...');
  
  event.waitUntil(
    Promise.all([
      // حذف التخزين المؤقت القديم
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName !== CACHE_NAME) {
              console.log('🗑️ حذف التخزين المؤقت القديم:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // السيطرة على جميع العملاء
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker: تم التفعيل بنجاح');
    })
  );
});

// اعتراض طلبات الشبكة
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // تجاهل طلبات غير HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // تحديد استراتيجية التخزين المؤقت
  const strategy = getStrategyForRequest(request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// تحديد استراتيجية التخزين المؤقت للطلب
function getStrategyForRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // البحث عن استراتيجية مطابقة
  for (const [route, strategy] of Object.entries(ROUTE_STRATEGIES)) {
    if (pathname.startsWith(route)) {
      return strategy;
    }
  }
  
  // استراتيجية افتراضية
  return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
}

// معالجة الطلبات حسب الاستراتيجية
async function handleRequest(request, strategy) {
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request);
    
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request);
    
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request);
    
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return networkOnly(request);
    
    case CACHE_STRATEGIES.CACHE_ONLY:
      return cacheOnly(request);
    
    default:
      return staleWhileRevalidate(request);
  }
}

// استراتيجية: التخزين المؤقت أولاً
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('خطأ في استراتيجية cache-first:', error);
    return getOfflineFallback(request);
  }
}

// استراتيجية: الشبكة أولاً
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('الشبكة غير متاحة، البحث في التخزين المؤقت...');
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return getOfflineFallback(request);
  }
}

// استراتيجية: قديم أثناء إعادة التحقق
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // تحديث التخزين المؤقت في الخلفية
  const networkResponsePromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // تجاهل أخطاء الشبكة في التحديث الخلفي
  });
  
  // إرجاع الاستجابة المخزنة فوراً إن وجدت
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // إذا لم توجد استجابة مخزنة، انتظر الشبكة
  try {
    return await networkResponsePromise;
  } catch (error) {
    return getOfflineFallback(request);
  }
}

// استراتيجية: الشبكة فقط
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return getOfflineFallback(request);
  }
}

// استراتيجية: التخزين المؤقت فقط
async function cacheOnly(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || getOfflineFallback(request);
}

// الحصول على صفحة بديلة عند عدم الاتصال
function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // صفحة HTML بديلة
  if (request.destination === 'document') {
    return new Response(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>غير متصل - مدينة سوسنا</title>
        <style>
          body {
            font-family: 'Cairo', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 50px 20px;
            margin: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .offline-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          }
          .offline-icon {
            font-size: 80px;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 28px;
            margin-bottom: 15px;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .retry-btn:hover {
            background: white;
            color: #667eea;
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <div class="offline-icon">📱</div>
          <h1>غير متصل بالإنترنت</h1>
          <p>يبدو أنك غير متصل بالإنترنت حالياً.<br>
          تحقق من اتصالك وحاول مرة أخرى.</p>
          <button class="retry-btn" onclick="window.location.reload()">
            إعادة المحاولة
          </button>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  }
  
  // استجابة JSON بديلة للـ API
  if (url.pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({
      error: 'غير متصل بالإنترنت',
      message: 'لا يمكن الوصول للخادم حالياً',
      offline: true,
      timestamp: new Date().toISOString()
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
  }
  
  // استجابة عامة
  return new Response('المحتوى غير متاح في وضع عدم الاتصال', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// معالجة رسائل من التطبيق الرئيسي
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: CACHE_NAME,
        timestamp: new Date().toISOString()
      });
      break;
    
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
    
    case 'CACHE_URLS':
      if (payload && payload.urls) {
        cacheUrls(payload.urls).then(() => {
          event.ports[0].postMessage({ success: true });
        });
      }
      break;
    
    default:
      console.log('رسالة غير معروفة:', type);
  }
});

// مسح جميع التخزين المؤقت
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('🗑️ تم مسح جميع التخزين المؤقت');
}

// تخزين مؤقت لعناوين URL محددة
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.error('خطأ في تخزين:', url, error);
      }
    })
  );
  console.log('📦 تم تخزين العناوين المحددة');
}

// معالجة تحديثات الخلفية
self.addEventListener('backgroundsync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// تنفيذ مزامنة الخلفية
async function doBackgroundSync() {
  try {
    // مزامنة البيانات المعلقة
    console.log('🔄 تنفيذ مزامنة الخلفية...');
    
    // هنا يمكن إضافة منطق مزامنة البيانات
    // مثل إرسال الفواتير المعلقة، تحديث المنتجات، إلخ
    
    console.log('✅ تمت مزامنة الخلفية بنجاح');
  } catch (error) {
    console.error('❌ خطأ في مزامنة الخلفية:', error);
  }
}

// معالجة الإشعارات الفورية
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'لديك إشعار جديد من مدينة سوسنا',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      image: data.image,
      vibrate: [200, 100, 200],
      dir: 'rtl',
      lang: 'ar',
      tag: data.tag || 'sosna-notification',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'عرض',
          icon: '/icons/view-icon.png'
        },
        {
          action: 'dismiss',
          title: 'إغلاق',
          icon: '/icons/close-icon.png'
        }
      ],
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'مدينة سوسنا', options)
    );
  }
});

// معالجة النقر على الإشعارات
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  } else if (event.action === 'dismiss') {
    // لا حاجة لفعل شيء، الإشعار مغلق بالفعل
  } else {
    // النقر على الإشعار نفسه
    const url = event.notification.data.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // البحث عن نافذة مفتوحة للتطبيق
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // فتح نافذة جديدة إذا لم توجد
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// تسجيل معلومات Service Worker
console.log('🚀 Service Worker مدينة سوسنا جاهز!');
console.log('📦 إصدار التخزين المؤقت:', CACHE_NAME);
console.log('🔧 الملفات الأساسية:', STATIC_FILES.length);
console.log('🌐 استراتيجيات التخزين:', Object.keys(ROUTE_STRATEGIES).length);

