// مكون إدارة المنتجات المحسن مع وحدات القياس والتسعير المخصص
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Package, 
  DollarSign, 
  Users, 
  BarChart3,
  Scale,
  Calculator,
  Tag,
  Star,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const EnhancedProducts = ({ user, addNotification }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customers, setCustomers] = useState([]);

  // وحدات القياس المتاحة
  const units = [
    { value: 'piece', label: 'قطعة', icon: '📦' },
    { value: 'kg', label: 'كيلوجرام', icon: '⚖️' },
    { value: 'gram', label: 'جرام', icon: '🔬' },
    { value: 'liter', label: 'لتر', icon: '🥤' },
    { value: 'meter', label: 'متر', icon: '📏' },
    { value: 'set', label: 'طقم', icon: '📋' },
    { value: 'box', label: 'علبة', icon: '📦' },
    { value: 'bottle', label: 'زجاجة', icon: '🍶' },
    { value: 'pack', label: 'عبوة', icon: '📦' },
    { value: 'dozen', label: 'دستة', icon: '🥚' }
  ];

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: '',
    basePrice: '',
    costPrice: '',
    unit: 'piece',
    quantity: '',
    minQuantity: '',
    barcode: '',
    sku: '',
    brand: '',
    supplier: '',
    location: '',
    notes: '',
    isActive: true,
    hasCustomPricing: false,
    customPrices: []
  });

  // تحميل البيانات
  useEffect(() => {
    loadProducts();
    loadCustomers();
  }, []);

  const loadProducts = () => {
    // محاكاة تحميل المنتجات
    const mockProducts = [
      {
        id: 1,
        name: 'لابتوب ديل',
        description: 'لابتوب ديل انسبايرون 15',
        category: 'إلكترونيات',
        basePrice: 15000,
        costPrice: 12000,
        unit: 'piece',
        quantity: 25,
        minQuantity: 5,
        barcode: '123456789',
        sku: 'DELL-INS-15',
        brand: 'Dell',
        supplier: 'شركة التقنية',
        location: 'رف A1',
        isActive: true,
        hasCustomPricing: true,
        customPrices: [
          { customerId: 1, price: 14500, discount: 3.33 },
          { customerId: 2, price: 14000, discount: 6.67 }
        ]
      },
      {
        id: 2,
        name: 'أرز بسمتي',
        description: 'أرز بسمتي درجة أولى',
        category: 'مواد غذائية',
        basePrice: 45,
        costPrice: 35,
        unit: 'kg',
        quantity: 500,
        minQuantity: 50,
        barcode: '987654321',
        sku: 'RICE-BAS-1KG',
        brand: 'الأهرام',
        supplier: 'شركة الغذاء',
        location: 'مخزن B',
        isActive: true,
        hasCustomPricing: false,
        customPrices: []
      }
    ];
    setProducts(mockProducts);
  };

  const loadCustomers = () => {
    // محاكاة تحميل العملاء
    const mockCustomers = [
      { id: 1, name: 'أحمد محمد', type: 'vip' },
      { id: 2, name: 'فاطمة علي', type: 'wholesale' },
      { id: 3, name: 'محمد حسن', type: 'regular' }
    ];
    setCustomers(mockCustomers);
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.basePrice || !newProduct.quantity) {
      addNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    const product = {
      ...newProduct,
      id: Date.now(),
      basePrice: parseFloat(newProduct.basePrice),
      costPrice: parseFloat(newProduct.costPrice || 0),
      quantity: parseInt(newProduct.quantity),
      minQuantity: parseInt(newProduct.minQuantity || 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({
      name: '',
      description: '',
      category: '',
      basePrice: '',
      costPrice: '',
      unit: 'piece',
      quantity: '',
      minQuantity: '',
      barcode: '',
      sku: '',
      brand: '',
      supplier: '',
      location: '',
      notes: '',
      isActive: true,
      hasCustomPricing: false,
      customPrices: []
    });
    setShowAddForm(false);
    addNotification('تم إضافة المنتج بنجاح', 'success');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowAddForm(true);
  };

  const handleUpdateProduct = () => {
    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id 
        ? { ...newProduct, updatedAt: new Date().toISOString() }
        : p
    ));
    setEditingProduct(null);
    setShowAddForm(false);
    setNewProduct({
      name: '',
      description: '',
      category: '',
      basePrice: '',
      costPrice: '',
      unit: 'piece',
      quantity: '',
      minQuantity: '',
      barcode: '',
      sku: '',
      brand: '',
      supplier: '',
      location: '',
      notes: '',
      isActive: true,
      hasCustomPricing: false,
      customPrices: []
    });
    addNotification('تم تحديث المنتج بنجاح', 'success');
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    addNotification('تم حذف المنتج بنجاح', 'success');
  };

  const openPricingModal = (product) => {
    setSelectedProduct(product);
    setShowPricingModal(true);
  };

  const addCustomPrice = (customerId, price, discount = 0) => {
    const updatedProduct = {
      ...selectedProduct,
      hasCustomPricing: true,
      customPrices: [
        ...selectedProduct.customPrices.filter(cp => cp.customerId !== customerId),
        { customerId, price: parseFloat(price), discount: parseFloat(discount) }
      ]
    };

    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id ? updatedProduct : p
    ));
    setSelectedProduct(updatedProduct);
    addNotification('تم تحديث السعر المخصص', 'success');
  };

  const removeCustomPrice = (customerId) => {
    const updatedProduct = {
      ...selectedProduct,
      customPrices: selectedProduct.customPrices.filter(cp => cp.customerId !== customerId)
    };

    if (updatedProduct.customPrices.length === 0) {
      updatedProduct.hasCustomPricing = false;
    }

    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id ? updatedProduct : p
    ));
    setSelectedProduct(updatedProduct);
    addNotification('تم حذف السعر المخصص', 'success');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const getUnitLabel = (unit) => {
    const unitObj = units.find(u => u.value === unit);
    return unitObj ? `${unitObj.icon} ${unitObj.label}` : unit;
  };

  const getStockStatus = (quantity, minQuantity) => {
    if (quantity === 0) return { status: 'out', color: 'text-red-500', bg: 'bg-red-100' };
    if (quantity <= minQuantity) return { status: 'low', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-100' };
  };

  return (
    <div className="p-4 space-y-6">
      {/* الهيدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المنتجات</h1>
          <p className="text-gray-600">إدارة شاملة للمنتجات مع التسعير المخصص</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 space-x-reverse shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة منتج</span>
        </motion.button>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pr-12 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">جميع الفئات</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* قائمة المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.quantity, product.minQuantity);
            
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs">
                        {product.category}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">
                        {getUnitLabel(product.unit)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 space-x-reverse">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openPricingModal(product)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <DollarSign className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* معلومات السعر والمخزون */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">السعر الأساسي:</span>
                    <span className="font-bold text-lg text-green-600">
                      {product.basePrice.toLocaleString()} ج.م
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">المخزون:</span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className={`font-medium ${stockStatus.color}`}>
                        {product.quantity}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${stockStatus.bg}`} />
                    </div>
                  </div>

                  {product.hasCustomPricing && (
                    <div className="flex items-center space-x-2 space-x-reverse text-purple-600">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">تسعير مخصص متاح</span>
                    </div>
                  )}

                  {product.quantity <= product.minQuantity && (
                    <div className="flex items-center space-x-2 space-x-reverse text-yellow-600 bg-yellow-50 p-2 rounded-lg">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">مخزون منخفض</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* نموذج إضافة/تعديل المنتج */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    setNewProduct({
                      name: '',
                      description: '',
                      category: '',
                      basePrice: '',
                      costPrice: '',
                      unit: 'piece',
                      quantity: '',
                      minQuantity: '',
                      barcode: '',
                      sku: '',
                      brand: '',
                      supplier: '',
                      location: '',
                      notes: '',
                      isActive: true,
                      hasCustomPricing: false,
                      customPrices: []
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* اسم المنتج */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المنتج *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل اسم المنتج"
                  />
                </div>

                {/* الوصف */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الوصف
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="وصف المنتج"
                    rows="3"
                  />
                </div>

                {/* الفئة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة *
                  </label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="فئة المنتج"
                  />
                </div>

                {/* وحدة القياس */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وحدة القياس *
                  </label>
                  <select
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {units.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.icon} {unit.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* السعر الأساسي */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر الأساسي (ج.م) *
                  </label>
                  <input
                    type="number"
                    value={newProduct.basePrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, basePrice: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* سعر التكلفة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سعر التكلفة (ج.م)
                  </label>
                  <input
                    type="number"
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, costPrice: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* الكمية */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكمية المتاحة *
                  </label>
                  <input
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* الحد الأدنى */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحد الأدنى للمخزون
                  </label>
                  <input
                    type="number"
                    value={newProduct.minQuantity}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, minQuantity: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* الباركود */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الباركود
                  </label>
                  <input
                    type="text"
                    value={newProduct.barcode}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, barcode: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789"
                  />
                </div>

                {/* رمز المنتج */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رمز المنتج (SKU)
                  </label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="PROD-001"
                  />
                </div>

                {/* العلامة التجارية */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العلامة التجارية
                  </label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم العلامة التجارية"
                  />
                </div>

                {/* المورد */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المورد
                  </label>
                  <input
                    type="text"
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, supplier: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم المورد"
                  />
                </div>

                {/* الموقع */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موقع التخزين
                  </label>
                  <input
                    type="text"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="رف A1، مخزن B"
                  />
                </div>

                {/* ملاحظات */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    value={newProduct.notes}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ملاحظات إضافية"
                    rows="2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 space-x-reverse"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'تحديث' : 'إضافة'}</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نموذج التسعير المخصص */}
      <AnimatePresence>
        {showPricingModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">التسعير المخصص</h2>
                  <p className="text-gray-600">{selectedProduct.name}</p>
                </div>
                <button
                  onClick={() => setShowPricingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* معلومات المنتج */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-3">معلومات المنتج</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>السعر الأساسي:</span>
                      <span className="font-medium">{selectedProduct.basePrice.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span>سعر التكلفة:</span>
                      <span className="font-medium">{selectedProduct.costPrice.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex justify-between">
                      <span>هامش الربح:</span>
                      <span className="font-medium text-green-600">
                        {((selectedProduct.basePrice - selectedProduct.costPrice) / selectedProduct.costPrice * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* إضافة سعر مخصص */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium mb-3">إضافة سعر مخصص</h3>
                  <CustomPriceForm 
                    customers={customers}
                    basePrice={selectedProduct.basePrice}
                    onAddPrice={addCustomPrice}
                    existingPrices={selectedProduct.customPrices}
                  />
                </div>
              </div>

              {/* الأسعار المخصصة الحالية */}
              <div className="mt-6">
                <h3 className="font-medium mb-3">الأسعار المخصصة الحالية</h3>
                {selectedProduct.customPrices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>لا توجد أسعار مخصصة</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedProduct.customPrices.map((customPrice) => {
                      const customer = customers.find(c => c.id === customPrice.customerId);
                      return (
                        <div key={customPrice.customerId} className="flex items-center justify-between bg-white p-4 rounded-lg border">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">{customer?.name}</p>
                              <p className="text-sm text-gray-500">
                                خصم {customPrice.discount.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="text-left">
                              <p className="font-bold text-lg text-green-600">
                                {customPrice.price.toLocaleString()} ج.م
                              </p>
                              <p className="text-sm text-gray-500">
                                وفر {(selectedProduct.basePrice - customPrice.price).toLocaleString()} ج.م
                              </p>
                            </div>
                            
                            <button
                              onClick={() => removeCustomPrice(customPrice.customerId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// مكون نموذج السعر المخصص
const CustomPriceForm = ({ customers, basePrice, onAddPrice, existingPrices }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [discount, setDiscount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedCustomer || !customPrice) return;
    
    const price = parseFloat(customPrice);
    const discountPercent = ((basePrice - price) / basePrice) * 100;
    
    onAddPrice(parseInt(selectedCustomer), price, discountPercent);
    
    setSelectedCustomer('');
    setCustomPrice('');
    setDiscount('');
  };

  const handlePriceChange = (value) => {
    setCustomPrice(value);
    if (value && basePrice) {
      const discountPercent = ((basePrice - parseFloat(value)) / basePrice) * 100;
      setDiscount(discountPercent.toFixed(1));
    }
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
    if (value && basePrice) {
      const price = basePrice - (basePrice * parseFloat(value) / 100);
      setCustomPrice(price.toFixed(2));
    }
  };

  const availableCustomers = customers.filter(customer => 
    !existingPrices.some(price => price.customerId === customer.id)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          العميل
        </label>
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">اختر العميل</option>
          {availableCustomers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر المخصص (ج.م)
          </label>
          <input
            type="number"
            value={customPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            نسبة الخصم (%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => handleDiscountChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.0"
            step="0.1"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!selectedCustomer || !customPrice}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة السعر</span>
      </motion.button>
    </form>
  );
};

export default EnhancedProducts;

