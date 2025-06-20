import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  FileText, 
  Package, 
  Users, 
  Recycle, 
  BarChart3, 
  Bot, 
  Settings,
  Plus,
  Search,
  Bell,
  Zap
} from 'lucide-react';

const MobileNavigation = ({ currentPage, onPageChange, user }) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'الرئيسية', color: 'from-blue-500 to-blue-600' },
    { id: 'invoices', icon: FileText, label: 'الفواتير', color: 'from-green-500 to-green-600' },
    { id: 'products', icon: Package, label: 'المنتجات', color: 'from-purple-500 to-purple-600' },
    { id: 'customers', icon: Users, label: 'العملاء', color: 'from-orange-500 to-orange-600' },
    { id: 'assistant', icon: Bot, label: 'المساعد', color: 'from-pink-500 to-pink-600' },
  ];

  const quickActions = [
    { id: 'new-invoice', icon: FileText, label: 'فاتورة جديدة', action: () => onPageChange('invoices') },
    { id: 'add-product', icon: Package, label: 'إضافة منتج', action: () => onPageChange('products') },
    { id: 'add-customer', icon: Users, label: 'عميل جديد', action: () => onPageChange('customers') },
    { id: 'reports', icon: BarChart3, label: 'التقارير', action: () => onPageChange('reports') },
  ];

  return (
    <>
      {/* الإجراءات السريعة */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowQuickActions(false)}
          >
            <motion.div
              initial={{ scale: 0, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 100 }}
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 gap-3 w-64">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      action.action();
                      setShowQuickActions(false);
                    }}
                    className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-lg transition-all"
                  >
                    <action.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 text-center">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* شريط التنقل الرئيسي */}
      <div className="mobile-nav bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(item.id)}
                className="relative flex flex-col items-center py-2 px-3 rounded-xl transition-all"
              >
                {/* مؤشر النشاط */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl opacity-10`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* الأيقونة */}
                <div className={`relative p-2 rounded-lg transition-all ${
                  isActive 
                    ? `bg-gradient-to-r ${item.color} shadow-lg` 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <item.icon 
                    className={`w-5 h-5 transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`} 
                  />
                  
                  {/* نقطة الإشعارات */}
                  {item.id === 'assistant' && notifications > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-xs text-white font-bold">
                        {notifications > 9 ? '9+' : notifications}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* التسمية */}
                <span className={`text-xs mt-1 transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 font-semibold' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>

                {/* تأثير النبضة للعنصر النشط */}
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl opacity-20`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}

          {/* زر الإجراءات السريعة */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowQuickActions(true)}
            className="relative flex flex-col items-center py-2 px-3"
          >
            <motion.div
              animate={{ rotate: showQuickActions ? 45 : 0 }}
              className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg"
            >
              <Plus className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              المزيد
            </span>

            {/* تأثير الوهج */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.button>
        </div>

        {/* مؤشر الاتصال */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-500 rounded-full shadow-lg"
          />
        </div>
      </div>

      {/* زر عائم للبحث السريع */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center z-30"
      >
        <Search className="w-6 h-6 text-white" />
      </motion.button>

      {/* زر عائم للإشعارات */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 left-4 w-14 h-14 bg-gradient-to-r from-green-500 to-teal-600 rounded-full shadow-2xl flex items-center justify-center z-30"
      >
        <Bell className="w-6 h-6 text-white" />
        {notifications > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs text-white font-bold">
              {notifications > 9 ? '9+' : notifications}
            </span>
          </motion.div>
        )}
      </motion.button>
    </>
  );
};

export default MobileNavigation;

