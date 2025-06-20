// واجهة العميل الاحترافية المخصصة
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Package, Receipt, User, Search, Filter,
  Star, Heart, Share2, MessageCircle, Phone, Mail,
  MapPin, Clock, Truck, CreditCard, Gift, Zap,
  Eye, Plus, Minus, Check, X, ArrowRight, ArrowLeft,
  Grid, List, SortAsc, SortDesc, Calendar, Download,
  Bell, Settings, LogOut, Home, Sparkles, Award,
  TrendingUp, ThumbsUp, Camera, Mic, QrCode
} from 'lucide-react';

const CustomerInterface = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('products');
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // بيانات المنتجات التجريبية
  const [products] = useState([
    {
      id: 1,
      name: 'لابتوب Dell XPS 13',
      price: 25000,
      originalPrice: 28000,
      category: 'إلكترونيات',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      reviews: 156,
      inStock: true,
      description: 'لابتوب عالي الأداء مع معالج Intel Core i7 وذاكرة 16GB',
      features: ['معالج Intel Core i7', 'ذاكرة 16GB RAM', 'SSD 512GB', 'شاشة 13.3 بوصة'],
      discount: 11,
      isNew: true,
      isFeatured: true
    },
    {
      id: 2,
      name: 'هاتف iPhone 15 Pro',
      price: 45000,
      originalPrice: 50000,
      category: 'إلكترونيات',
      image: '/api/placeholder/300/300',
      rating: 4.9,
      reviews: 324,
      inStock: true,
      description: 'أحدث هاتف من آبل مع كاميرا احترافية ومعالج A17 Pro',
      features: ['معالج A17 Pro', 'كاميرا 48MP', 'شاشة 6.1 بوصة', 'مقاوم للماء'],
      discount: 10,
      isNew: true,
      isFeatured: true
    },
    {
      id: 3,
      name: 'ساعة Apple Watch Series 9',
      price: 15000,
      originalPrice: 17000,
      category: 'إكسسوارات',
      image: '/api/placeholder/300/300',
      rating: 4.7,
      reviews: 89,
      inStock: true,
      description: 'ساعة ذكية متطورة مع مراقبة الصحة والرياضة',
      features: ['مراقبة النبض', 'GPS مدمج', 'مقاوم للماء', 'بطارية 18 ساعة'],
      discount: 12,
      isNew: false,
      isFeatured: true
    }
  ]);

  // فواتير العميل
  const [customerInvoices] = useState([
    {
      id: 'INV-001',
      date: '2024-06-15',
      total: 25000,
      status: 'مكتملة',
      items: [
        { name: 'لابتوب Dell XPS 13', quantity: 1, price: 25000 }
      ]
    },
    {
      id: 'INV-002',
      date: '2024-06-10',
      total: 15000,
      status: 'قيد التوصيل',
      items: [
        { name: 'ساعة Apple Watch Series 9', quantity: 1, price: 15000 }
      ]
    }
  ]);

  const categories = [
    { id: 'all', name: 'جميع المنتجات', icon: Grid },
    { id: 'إلكترونيات', name: 'إلكترونيات', icon: Zap },
    { id: 'إكسسوارات', name: 'إكسسوارات', icon: Gift },
    { id: 'أجهزة منزلية', name: 'أجهزة منزلية', icon: Home }
  ];

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    
    addNotification(`تم إضافة ${product.name} إلى السلة`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
      default:
        return a.name.localeCompare(b.name, 'ar');
    }
  });

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const renderProductCard = (product) => (
    <motion.div
      key={product.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        viewMode === 'grid' ? 'w-full' : 'flex'
      }`}
    >
      <div className={`relative ${viewMode === 'grid' ? 'aspect-square' : 'w-32 h-32 flex-shrink-0'}`}>
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <Package className="w-16 h-16 text-blue-500" />
        </div>
        
        {/* شارات المنتج */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">جديد</span>
          )}
          {product.discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">مميز</span>
          )}
        </div>

        {/* أزرار التفاعل */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              favorites.includes(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setSelectedProduct(product)}
            className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white backdrop-blur-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight">{product.name}</h3>
          {viewMode === 'list' && (
            <div className="flex items-center gap-1 ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          )}
        </div>

        {viewMode === 'grid' && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-500">({product.reviews})</span>
          </div>
        )}

        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-600">{product.price.toLocaleString()} ج.م</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{product.category}</span>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className={`p-2 rounded-lg transition-colors ${
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderProductsView = () => (
    <div className="space-y-6">
      {/* شريط البحث والفلترة */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* البحث */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* الفئات */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* أدوات التحكم */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">ترتيب حسب الاسم</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">التقييم</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المنتجات */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        <AnimatePresence>
          {sortedProducts.map(renderProductCard)}
        </AnimatePresence>
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">لا توجد منتجات</h3>
          <p className="text-gray-400">جرب تغيير معايير البحث أو الفلترة</p>
        </div>
      )}
    </div>
  );

  const renderInvoicesView = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">فواتيري</h2>
        
        {customerInvoices.map(invoice => (
          <div key={invoice.id} className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-gray-800">فاتورة #{invoice.id}</h3>
                <p className="text-sm text-gray-600">{invoice.date}</p>
              </div>
              <div className="text-left">
                <p className="font-bold text-blue-600">{invoice.total.toLocaleString()} ج.م</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                  invoice.status === 'مكتملة' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {invoice.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{item.price.toLocaleString()} ج.م</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCartSidebar = () => (
    <AnimatePresence>
      {showCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setShowCart(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">سلة التسوق ({cartItemsCount})</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">السلة فارغة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-blue-500" />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-blue-600 font-semibold">{item.price.toLocaleString()} ج.م</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-2 py-1 bg-white rounded border">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:bg-red-100 text-red-600 rounded ml-auto"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">الإجمالي:</span>
                    <span className="font-bold text-xl text-blue-600">
                      {cartTotal.toLocaleString()} ج.م
                    </span>
                  </div>
                  
                  <button
                    onClick={() => {
                      addNotification('تم إرسال الطلب بنجاح! سيتم التواصل معك قريباً', 'success');
                      setCart([]);
                      setShowCart(false);
                    }}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    إرسال الطلب
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* الهيدر */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">مدينة سوسنا</h1>
                <p className="text-xs text-gray-600">مرحباً، {user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 hover:bg-gray-100 rounded-lg"
              >
                <ShoppingCart className="w-6 h-6 text-gray-600" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* التنقل */}
      <nav className="bg-white border-b px-4 py-2">
        <div className="flex gap-1">
          {[
            { id: 'products', name: 'المنتجات', icon: Package },
            { id: 'invoices', name: 'فواتيري', icon: Receipt },
            { id: 'profile', name: 'حسابي', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'products' && renderProductsView()}
            {currentView === 'invoices' && renderInvoicesView()}
            {currentView === 'profile' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">معلومات الحساب</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                    <p className="text-gray-800">{user.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                    <p className="text-gray-800">{user.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                    <p className="text-gray-800">{user.address}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* سلة التسوق */}
      {renderCartSidebar()}

      {/* نظام الإشعارات */}
      <div className="fixed top-20 left-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`p-3 rounded-lg shadow-lg max-w-sm ${
                notification.type === 'success' 
                  ? 'bg-green-500 text-white'
                  : notification.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerInterface;

