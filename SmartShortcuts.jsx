// نظام الاختصارات الذكية والإجراءات السريعة
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Star, 
  Bookmark, 
  Clock, 
  TrendingUp, 
  Target,
  Lightbulb,
  Rocket,
  Wand2,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Play,
  Settings,
  BarChart3,
  Users,
  Package,
  FileText,
  Calculator,
  Search,
  Filter,
  Download,
  Upload,
  Share,
  Copy
} from 'lucide-react';

const SmartShortcuts = ({ user, addNotification, onShortcutAction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [customShortcuts, setCustomShortcuts] = useState([]);
  const [isCreatingShortcut, setIsCreatingShortcut] = useState(false);
  const [newShortcut, setNewShortcut] = useState({
    name: '',
    action: '',
    icon: 'Zap',
    color: 'blue'
  });

  // الاختصارات الذكية المقترحة بناءً على سلوك المستخدم
  const smartSuggestions = [
    {
      id: 'quick_invoice',
      name: 'فاتورة سريعة',
      description: 'إنشاء فاتورة بأكثر المنتجات مبيعاً',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      action: 'create_quick_invoice',
      frequency: 'يومي',
      timeSaved: '3 دقائق'
    },
    {
      id: 'daily_report',
      name: 'تقرير اليوم',
      description: 'عرض ملخص مبيعات اليوم',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      action: 'show_daily_report',
      frequency: 'يومي',
      timeSaved: '2 دقيقة'
    },
    {
      id: 'top_customers',
      name: 'أهم العملاء',
      description: 'قائمة بأفضل 10 عملاء',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      action: 'show_top_customers',
      frequency: 'أسبوعي',
      timeSaved: '1 دقيقة'
    },
    {
      id: 'low_stock',
      name: 'مخزون منخفض',
      description: 'المنتجات التي تحتاج إعادة تموين',
      icon: Package,
      color: 'from-orange-500 to-red-500',
      action: 'check_low_stock',
      frequency: 'يومي',
      timeSaved: '2 دقيقة'
    },
    {
      id: 'profit_calc',
      name: 'حاسبة الأرباح',
      description: 'حساب الأرباح المتوقعة',
      icon: Calculator,
      color: 'from-yellow-500 to-orange-500',
      action: 'calculate_profits',
      frequency: 'أسبوعي',
      timeSaved: '5 دقائق'
    },
    {
      id: 'backup_data',
      name: 'نسخ احتياطي',
      description: 'حفظ نسخة احتياطية من البيانات',
      icon: Download,
      color: 'from-gray-500 to-slate-500',
      action: 'backup_data',
      frequency: 'أسبوعي',
      timeSaved: '1 دقيقة'
    }
  ];

  // الألوان المتاحة للاختصارات المخصصة
  const availableColors = [
    { name: 'أزرق', value: 'blue', class: 'from-blue-500 to-cyan-500' },
    { name: 'أخضر', value: 'green', class: 'from-green-500 to-emerald-500' },
    { name: 'بنفسجي', value: 'purple', class: 'from-purple-500 to-pink-500' },
    { name: 'أحمر', value: 'red', class: 'from-red-500 to-rose-500' },
    { name: 'أصفر', value: 'yellow', class: 'from-yellow-500 to-orange-500' },
    { name: 'رمادي', value: 'gray', class: 'from-gray-500 to-slate-500' }
  ];

  // الأيقونات المتاحة
  const availableIcons = [
    { name: 'برق', component: Zap },
    { name: 'نجمة', component: Star },
    { name: 'هدف', component: Target },
    { name: 'صاروخ', component: Rocket },
    { name: 'لمبة', component: Lightbulb },
    { name: 'ملف', component: FileText },
    { name: 'مستخدمين', component: Users },
    { name: 'حزمة', component: Package },
    { name: 'رسم بياني', component: BarChart3 },
    { name: 'حاسبة', component: Calculator }
  ];

  useEffect(() => {
    // تحميل الاختصارات المحفوظة
    const savedShortcuts = localStorage.getItem('sosna_shortcuts');
    if (savedShortcuts) {
      setCustomShortcuts(JSON.parse(savedShortcuts));
    }

    // تحليل سلوك المستخدم واقتراح اختصارات ذكية
    analyzeUserBehavior();
  }, []);

  const analyzeUserBehavior = () => {
    // محاكاة تحليل سلوك المستخدم
    const userActions = JSON.parse(localStorage.getItem('user_actions') || '[]');
    const frequentActions = userActions.reduce((acc, action) => {
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {});

    // اقتراح اختصارات بناءً على الأنشطة الأكثر تكراراً
    const suggestedShortcuts = smartSuggestions.filter(shortcut => {
      return frequentActions[shortcut.action] > 3; // إذا تم تنفيذ الإجراء أكثر من 3 مرات
    });

    setShortcuts(suggestedShortcuts);
  };

  const executeShortcut = (shortcut) => {
    // تسجيل الإجراء
    const userActions = JSON.parse(localStorage.getItem('user_actions') || '[]');
    userActions.push(shortcut.action);
    localStorage.setItem('user_actions', JSON.stringify(userActions));

    // تنفيذ الإجراء
    if (onShortcutAction) {
      onShortcutAction(shortcut.action, shortcut);
    }

    addNotification(`تم تنفيذ: ${shortcut.name}`, 'success');
    
    // إضافة تأثير بصري
    setIsVisible(false);
  };

  const createCustomShortcut = () => {
    if (!newShortcut.name || !newShortcut.action) {
      addNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    const shortcut = {
      ...newShortcut,
      id: Date.now(),
      type: 'custom',
      createdAt: new Date().toISOString()
    };

    const updatedShortcuts = [...customShortcuts, shortcut];
    setCustomShortcuts(updatedShortcuts);
    localStorage.setItem('sosna_shortcuts', JSON.stringify(updatedShortcuts));

    setNewShortcut({ name: '', action: '', icon: 'Zap', color: 'blue' });
    setIsCreatingShortcut(false);
    addNotification('تم إنشاء الاختصار بنجاح!', 'success');
  };

  const deleteCustomShortcut = (shortcutId) => {
    const updatedShortcuts = customShortcuts.filter(s => s.id !== shortcutId);
    setCustomShortcuts(updatedShortcuts);
    localStorage.setItem('sosna_shortcuts', JSON.stringify(updatedShortcuts));
    addNotification('تم حذف الاختصار', 'info');
  };

  const renderShortcutCard = (shortcut, isCustom = false) => {
    const IconComponent = isCustom 
      ? availableIcons.find(i => i.name === shortcut.icon)?.component || Zap
      : shortcut.icon;
    
    const colorClass = isCustom 
      ? availableColors.find(c => c.value === shortcut.color)?.class || 'from-blue-500 to-cyan-500'
      : shortcut.color;

    return (
      <motion.div
        key={shortcut.id}
        className={`relative p-4 rounded-xl bg-gradient-to-r ${colorClass} text-white cursor-pointer group`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => executeShortcut(shortcut)}
        layout
      >
        {isCustom && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteCustomShortcut(shortcut.id);
            }}
            className="absolute top-2 right-2 p-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}

        <div className="flex items-center space-x-3 space-x-reverse mb-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">{shortcut.name}</h3>
            {shortcut.description && (
              <p className="text-xs opacity-90">{shortcut.description}</p>
            )}
          </div>
        </div>

        {!isCustom && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="w-3 h-3" />
              <span>يوفر {shortcut.timeSaved}</span>
            </div>
            <div className="flex items-center space-x-1 space-x-reverse">
              <TrendingUp className="w-3 h-3" />
              <span>{shortcut.frequency}</span>
            </div>
          </div>
        )}

        {/* تأثير الشرارات */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut"
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* زر الاختصارات الذكية */}
      <motion.button
        className="fixed bottom-20 left-4 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(!isVisible)}
      >
        <Sparkles className="w-6 h-6 text-white" />
        {shortcuts.length > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs text-white font-bold">{shortcuts.length}</span>
          </motion.div>
        )}
      </motion.button>

      {/* واجهة الاختصارات */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* رأس الواجهة */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">الاختصارات الذكية</h3>
                      <p className="text-sm opacity-90">إجراءات سريعة ومخصصة</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 bg-white/20 rounded-full"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-4 max-h-[70vh] overflow-y-auto">
                {!isCreatingShortcut ? (
                  <>
                    {/* الاختصارات الذكية المقترحة */}
                    {shortcuts.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center space-x-2 space-x-reverse mb-3">
                          <Wand2 className="w-5 h-5 text-indigo-500" />
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                            مقترحة لك
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {shortcuts.map(shortcut => renderShortcutCard(shortcut))}
                        </div>
                      </div>
                    )}

                    {/* الاختصارات المخصصة */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                            اختصاراتي
                          </h4>
                        </div>
                        <button
                          onClick={() => setIsCreatingShortcut(true)}
                          className="p-2 bg-indigo-500 text-white rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {customShortcuts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                          {customShortcuts.map(shortcut => renderShortcutCard(shortcut, true))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>لا توجد اختصارات مخصصة</p>
                          <p className="text-sm">انقر على + لإنشاء اختصار جديد</p>
                        </div>
                      )}
                    </div>

                    {/* نصائح الاستخدام */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <Lightbulb className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold text-blue-800 dark:text-blue-200">
                          نصائح ذكية
                        </span>
                      </div>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• الاختصارات تتعلم من استخدامك اليومي</li>
                        <li>• يمكنك إنشاء اختصارات مخصصة لمهامك</li>
                        <li>• الاختصارات توفر الوقت والجهد</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  /* واجهة إنشاء اختصار جديد */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                        إنشاء اختصار جديد
                      </h4>
                      <button
                        onClick={() => setIsCreatingShortcut(false)}
                        className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full"
                      >
                        ×
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        اسم الاختصار
                      </label>
                      <input
                        type="text"
                        value={newShortcut.name}
                        onChange={(e) => setNewShortcut({...newShortcut, name: e.target.value})}
                        placeholder="مثال: تقرير المبيعات"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الإجراء
                      </label>
                      <input
                        type="text"
                        value={newShortcut.action}
                        onChange={(e) => setNewShortcut({...newShortcut, action: e.target.value})}
                        placeholder="مثال: show_sales_report"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الأيقونة
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {availableIcons.map((icon) => (
                          <button
                            key={icon.name}
                            onClick={() => setNewShortcut({...newShortcut, icon: icon.name})}
                            className={`p-3 rounded-lg border-2 ${
                              newShortcut.icon === icon.name
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                : 'border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            <icon.component className="w-5 h-5 mx-auto" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        اللون
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => setNewShortcut({...newShortcut, color: color.value})}
                            className={`p-3 rounded-lg bg-gradient-to-r ${color.class} text-white text-sm ${
                              newShortcut.color === color.value ? 'ring-2 ring-gray-400' : ''
                            }`}
                          >
                            {color.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={createCustomShortcut}
                      className="w-full p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium"
                    >
                      إنشاء الاختصار
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartShortcuts;

