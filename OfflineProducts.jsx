// مكون إدارة المنتجات مع دعم العمل الأوفلاين
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package, DollarSign, Hash, Tag, Save, X } from 'lucide-react';
import { useOffline } from '../contexts/OfflineContext';

const OfflineProducts = () => {
  const { getProducts, addProduct, updateProduct, deleteProduct, isOnline } = useOffline();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await getProducts();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('خطأ في تحميل المنتجات:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      createdAt: new Date().toISOString()
    };

    try {
      let result;
      if (editingProduct) {
        result = await updateProduct({ ...productData, id: editingProduct.id });
      } else {
        result = await addProduct(productData);
      }

      if (result.success) {
        await loadProducts();
        resetForm();
        setShowAddForm(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error('خطأ في حفظ المنتج:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      description: product.description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        const result = await deleteProduct(id);
        if (result.success) {
          await loadProducts();
        }
      } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      stock: '',
      description: ''
    });
  };

  const handleCancel = () => {
    resetForm();
    setShowAddForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* رأس الصفحة */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h1>
            <p className="text-gray-600 text-sm">
              {products.length} منتج • {isOnline ? 'متصل' : 'غير متصل'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة منتج
        </button>
      </div>

      {/* شريط البحث */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="البحث في المنتجات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* قائمة المنتجات */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Tag className="w-4 h-4" />
                    <span>{product.category}</span>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="font-medium">{product.price} جنيه</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span>{product.stock} قطعة</span>
                  </div>
                </div>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                )}
                
                {product.needsSync && (
                  <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    في انتظار المزامنة
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">لا توجد منتجات</h3>
          <p className="text-gray-500">
            {searchTerm ? 'لم يتم العثور على منتجات تطابق البحث' : 'ابدأ بإضافة منتج جديد'}
          </p>
        </div>
      )}

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
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
                </h2>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المنتج
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    السعر (جنيه)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الفئة
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الكمية المتاحة
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف (اختياري)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {editingProduct ? 'تحديث' : 'حفظ'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfflineProducts;

