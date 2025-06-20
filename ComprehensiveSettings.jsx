// نظام الإعدادات الشامل للتطبيق
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Save, User, Shield, Bell, Palette, 
  Database, Wifi, Lock, Eye, EyeOff, Plus, 
  Trash2, Edit, Check, X, Users, DollarSign,
  Store, Package, FileText, BarChart3, Globe,
  Smartphone, Monitor, Tablet, RefreshCw
} from 'lucide-react';

const ComprehensiveSettings = ({ user, onUpdateSettings, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // إعدادات عامة
    general: {
      companyName: 'مدينة سوسنا',
      companyAddress: 'القاهرة، مصر',
      companyPhone: '+20123456789',
      companyEmail: 'info@sosna.com',
      currency: 'ج.م',
      language: 'ar',
      timezone: 'Africa/Cairo',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'arabic'
    },
    // إعدادات المبيعات
    sales: {
      taxRate: 14,
      discountLimit: 50,
      autoInvoiceNumber: true,
      invoicePrefix: 'INV-',
      allowNegativeStock: false,
      requireCustomerInfo: true,
      defaultPaymentMethod: 'cash',
      printAfterSale: true
    },
    // إعدادات التسعير
    pricing: {
      enableCustomerPricing: true,
      defaultMarkup: 30,
      priceRounding: 'nearest',
      showCostPrice: false,
      allowPriceEdit: true,
      bulkDiscountEnabled: true,
      loyaltyPointsEnabled: true,
      seasonalPricingEnabled: false
    },
    // إعدادات المخزون
    inventory: {
      lowStockAlert: true,
      lowStockThreshold: 10,
      autoReorderEnabled: false,
      trackExpiry: true,
      batchTracking: false,
      serialNumberTracking: false,
      locationTracking: true,
      stockMovementLog: true
    },
    // إعدادات الإشعارات
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      lowStockAlerts: true,
      newOrderAlerts: true,
      paymentAlerts: true,
      systemUpdates: true,
      marketingEmails: false
    },
    // إعدادات الأمان
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: [],
      auditLog: true,
      dataEncryption: true,
      backupFrequency: 'daily'
    },
    // إعدادات المظهر
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      fontSize: 'medium',
      compactMode: false,
      animations: true,
      rtlSupport: true,
      customLogo: null
    },
    // إعدادات التقارير
    reports: {
      autoGenerate: true,
      emailReports: false,
      reportFrequency: 'weekly',
      includeCharts: true,
      exportFormat: 'pdf',
      dataRetention: 365,
      anonymizeData: false,
      customReports: []
    }
  });

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'فادي أحمد',
      email: 'fadi@sosna.com',
      role: 'مدير',
      permissions: ['all'],
      active: true,
      lastLogin: '2024-06-19'
    }
  ]);

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    password: '',
    role: 'موظف',
    permissions: []
  });

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const tabs = [
    { id: 'general', name: 'عام', icon: Settings },
    { id: 'sales', name: 'المبيعات', icon: DollarSign },
    { id: 'pricing', name: 'التسعير', icon: BarChart3 },
    { id: 'inventory', name: 'المخزون', icon: Package },
    { id: 'employees', name: 'الموظفين', icon: Users },
    { id: 'notifications', name: 'الإشعارات', icon: Bell },
    { id: 'security', name: 'الأمان', icon: Shield },
    { id: 'appearance', name: 'المظهر', icon: Palette },
    { id: 'reports', name: 'التقارير', icon: FileText }
  ];

  const roles = [
    { value: 'مدير', label: 'مدير', permissions: ['all'] },
    { value: 'موظف مبيعات', label: 'موظف مبيعات', permissions: ['sales', 'customers', 'products'] },
    { value: 'أمين مخزن', label: 'أمين مخزن', permissions: ['inventory', 'products'] },
    { value: 'محاسب', label: 'محاسب', permissions: ['invoices', 'reports', 'customers'] },
    { value: 'موظف', label: 'موظف', permissions: ['basic'] }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    onUpdateSettings(settings);
    // حفظ الإعدادات في localStorage
    localStorage.setItem('sosna_settings', JSON.stringify(settings));
  };

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.password) {
      const employee = {
        id: Date.now(),
        ...newEmployee,
        active: true,
        lastLogin: null,
        createdAt: new Date().toISOString()
      };
      setEmployees(prev => [...prev, employee]);
      setNewEmployee({ name: '', email: '', password: '', role: 'موظف', permissions: [] });
      setShowAddEmployee(false);
    }
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const handleToggleEmployeeStatus = (id) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, active: !emp.active } : emp
    ));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">الإعدادات العامة</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">اسم الشركة</label>
          <input
            type="text"
            value={settings.general.companyName}
            onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الشركة</label>
          <input
            type="text"
            value={settings.general.companyAddress}
            onChange={(e) => handleSettingChange('general', 'companyAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">هاتف الشركة</label>
          <input
            type="tel"
            value={settings.general.companyPhone}
            onChange={(e) => handleSettingChange('general', 'companyPhone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">بريد الشركة الإلكتروني</label>
          <input
            type="email"
            value={settings.general.companyEmail}
            onChange={(e) => handleSettingChange('general', 'companyEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="ج.م">جنيه مصري (ج.م)</option>
            <option value="$">دولار أمريكي ($)</option>
            <option value="€">يورو (€)</option>
            <option value="ر.س">ريال سعودي (ر.س)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">تنسيق التاريخ</label>
          <select
            value={settings.general.dateFormat}
            onChange={(e) => handleSettingChange('general', 'dateFormat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderEmployeeSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">إدارة الموظفين</h3>
        <button
          onClick={() => setShowAddEmployee(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          إضافة موظف
        </button>
      </div>

      {/* قائمة الموظفين */}
      <div className="space-y-3">
        {employees.map(employee => (
          <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${employee.active ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <h4 className="font-medium text-gray-800">{employee.name}</h4>
                <p className="text-sm text-gray-600">{employee.email}</p>
                <p className="text-xs text-gray-500">{employee.role}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleEmployeeStatus(employee.id)}
                className={`px-3 py-1 rounded text-sm ${
                  employee.active 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {employee.active ? 'إيقاف' : 'تفعيل'}
              </button>
              
              <button
                onClick={() => setEditingEmployee(employee)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              {employee.id !== 1 && (
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* نموذج إضافة موظف */}
      <AnimatePresence>
        {showAddEmployee && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">إضافة موظف جديد</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                  <input
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الدور الوظيفي</label>
                  <select
                    value={newEmployee.role}
                    onChange={(e) => {
                      const selectedRole = roles.find(r => r.value === e.target.value);
                      setNewEmployee(prev => ({ 
                        ...prev, 
                        role: e.target.value,
                        permissions: selectedRole?.permissions || []
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddEmployee}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  إضافة
                </button>
                <button
                  onClick={() => setShowAddEmployee(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'employees':
        return renderEmployeeSettings();
      case 'sales':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">إعدادات المبيعات</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">معدل الضريبة (%)</label>
                <input
                  type="number"
                  value={settings.sales.taxRate}
                  onChange={(e) => handleSettingChange('sales', 'taxRate', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">حد الخصم الأقصى (%)</label>
                <input
                  type="number"
                  value={settings.sales.discountLimit}
                  onChange={(e) => handleSettingChange('sales', 'discountLimit', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.sales.autoInvoiceNumber}
                  onChange={(e) => handleSettingChange('sales', 'autoInvoiceNumber', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <label className="text-sm text-gray-700">ترقيم الفواتير تلقائياً</label>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.sales.allowNegativeStock}
                  onChange={(e) => handleSettingChange('sales', 'allowNegativeStock', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <label className="text-sm text-gray-700">السماح بالمخزون السالب</label>
              </div>
            </div>
          </div>
        );
      case 'pricing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">إعدادات التسعير</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.pricing.enableCustomerPricing}
                  onChange={(e) => handleSettingChange('pricing', 'enableCustomerPricing', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <label className="text-sm text-gray-700">تفعيل التسعير المخصص للعملاء</label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">هامش الربح الافتراضي (%)</label>
                <input
                  type="number"
                  value={settings.pricing.defaultMarkup}
                  onChange={(e) => handleSettingChange('pricing', 'defaultMarkup', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.pricing.loyaltyPointsEnabled}
                  onChange={(e) => handleSettingChange('pricing', 'loyaltyPointsEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <label className="text-sm text-gray-700">تفعيل نقاط الولاء</label>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.pricing.bulkDiscountEnabled}
                  onChange={(e) => handleSettingChange('pricing', 'bulkDiscountEnabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
                <label className="text-sm text-gray-700">تفعيل خصم الكمية</label>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="text-center text-gray-500">قريباً...</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex h-full">
          {/* الشريط الجانبي */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">الإعدادات</h2>
            </div>
            
            <nav className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-right transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* المحتوى الرئيسي */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {renderTabContent()}
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  حفظ الإعدادات
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComprehensiveSettings;

