import React, { useState, useEffect } from 'react';
import './UltimateSettingsPanel.css';

const UltimateSettingsPanel = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'مدينة سوسنا',
      companyLogo: '',
      language: 'ar',
      currency: 'EGP',
      timezone: 'Africa/Cairo',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'arabic',
      theme: 'light',
      rtlSupport: true,
      autoSave: true,
      backupFrequency: 'daily'
    },
    pricing: {
      enableCustomPricing: true,
      priceCalculationMethod: 'markup', // markup, margin, fixed
      defaultMarkup: 25,
      enableBulkDiscounts: true,
      enableCustomerSpecificPricing: true,
      enableSeasonalPricing: true,
      taxRate: 14,
      enableTaxCalculation: true,
      priceRoundingMethod: 'nearest', // up, down, nearest
      showPricesWithTax: true,
      enablePriceHistory: true
    },
    inventory: {
      enableLowStockAlerts: true,
      lowStockThreshold: 10,
      enableAutoReorder: false,
      autoReorderQuantity: 50,
      enableBarcodeGeneration: true,
      barcodeFormat: 'CODE128',
      enableExpiryTracking: true,
      expiryAlertDays: 30,
      enableBatchTracking: true,
      enableSerialNumbers: false,
      stockValuationMethod: 'FIFO' // FIFO, LIFO, Average
    },
    sales: {
      enableQuotations: true,
      quotationValidityDays: 30,
      enableInvoiceTemplates: true,
      defaultInvoiceTemplate: 'modern',
      enablePaymentTerms: true,
      defaultPaymentTerms: 'net30',
      enableDiscounts: true,
      maxDiscountPercentage: 50,
      enableCreditLimit: true,
      enableSalesCommission: true,
      commissionRate: 5,
      enableReturnPolicy: true,
      returnPolicyDays: 14
    },
    customers: {
      enableCustomerGroups: true,
      enableLoyaltyProgram: true,
      loyaltyPointsRate: 1, // 1 point per EGP
      enableCustomerHistory: true,
      enableCreditManagement: true,
      enableCustomerPortal: true,
      enableSMSNotifications: true,
      enableEmailNotifications: true,
      enableCustomerFeedback: true,
      enableCustomerAnalytics: true,
      customerDataRetentionDays: 2555 // 7 years
    },
    employees: {
      enableRoleBasedAccess: true,
      enableTimeTracking: true,
      enableSalesTargets: true,
      enablePerformanceMetrics: true,
      enableEmployeePortal: true,
      enableShiftManagement: true,
      enableLeaveManagement: true,
      enablePayrollIntegration: false,
      enableEmployeeTraining: true,
      enableEmployeeEvaluation: true,
      maxLoginAttempts: 3,
      sessionTimeout: 30 // minutes
    },
    reports: {
      enableAdvancedReports: true,
      enableCustomReports: true,
      enableScheduledReports: true,
      enableReportExport: true,
      exportFormats: ['PDF', 'Excel', 'CSV'],
      enableReportSharing: true,
      enableDashboardCustomization: true,
      enableRealTimeReports: true,
      reportRetentionDays: 365,
      enableReportNotifications: true
    },
    integrations: {
      enableAPIAccess: true,
      enableWebhooks: true,
      enableThirdPartyIntegrations: true,
      enableAccountingIntegration: false,
      enableECommerceIntegration: false,
      enablePaymentGateways: true,
      enableShippingIntegration: false,
      enableSocialMediaIntegration: true,
      enableCloudSync: true,
      enableMobileSync: true
    },
    security: {
      enableTwoFactorAuth: true,
      enablePasswordPolicy: true,
      minPasswordLength: 8,
      requireSpecialCharacters: true,
      enableSessionManagement: true,
      enableAuditLog: true,
      enableDataEncryption: true,
      enableBackupEncryption: true,
      enableIPWhitelist: false,
      enableBruteForceProtection: true,
      enableSecurityAlerts: true
    },
    notifications: {
      enablePushNotifications: true,
      enableEmailNotifications: true,
      enableSMSNotifications: true,
      enableInAppNotifications: true,
      enableSoundNotifications: true,
      notificationFrequency: 'immediate', // immediate, hourly, daily
      enableNotificationHistory: true,
      enableNotificationCategories: true,
      enableQuietHours: true,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00'
    },
    backup: {
      enableAutoBackup: true,
      backupFrequency: 'daily', // hourly, daily, weekly
      backupRetentionDays: 30,
      enableCloudBackup: true,
      cloudProvider: 'google', // google, aws, azure
      enableLocalBackup: true,
      localBackupPath: '/backups',
      enableBackupNotifications: true,
      enableBackupVerification: true,
      enableIncrementalBackup: true
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const settingSections = [
    {
      id: 'general',
      title: 'الإعدادات العامة',
      icon: '⚙️',
      description: 'إعدادات أساسية للشركة والتطبيق'
    },
    {
      id: 'pricing',
      title: 'إعدادات التسعير',
      icon: '💰',
      description: 'تحكم في استراتيجيات التسعير والخصومات'
    },
    {
      id: 'inventory',
      title: 'إدارة المخزون',
      icon: '📦',
      description: 'إعدادات المخزون والتتبع'
    },
    {
      id: 'sales',
      title: 'إعدادات المبيعات',
      icon: '💼',
      description: 'إدارة عمليات البيع والفواتير'
    },
    {
      id: 'customers',
      title: 'إدارة العملاء',
      icon: '👥',
      description: 'إعدادات العملاء وبرامج الولاء'
    },
    {
      id: 'employees',
      title: 'إدارة الموظفين',
      icon: '👨‍💼',
      description: 'إعدادات الموظفين والصلاحيات'
    },
    {
      id: 'reports',
      title: 'التقارير والتحليلات',
      icon: '📊',
      description: 'إعدادات التقارير والإحصائيات'
    },
    {
      id: 'integrations',
      title: 'التكاملات',
      icon: '🔗',
      description: 'ربط مع الأنظمة الخارجية'
    },
    {
      id: 'security',
      title: 'الأمان والحماية',
      icon: '🔒',
      description: 'إعدادات الأمان وحماية البيانات'
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      icon: '🔔',
      description: 'إدارة جميع أنواع الإشعارات'
    },
    {
      id: 'backup',
      title: 'النسخ الاحتياطي',
      icon: '💾',
      description: 'إعدادات النسخ الاحتياطي والاستعادة'
    }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // محاكاة تحميل الإعدادات من الخادم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // تحميل الإعدادات المحفوظة محلياً
      const savedSettings = localStorage.getItem('sosna_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // محاكاة حفظ الإعدادات على الخادم
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // حفظ الإعدادات محلياً
      localStorage.setItem('sosna_settings', JSON.stringify(settings));
      
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      // إظهار رسالة نجاح
      alert('تم حفظ الإعدادات بنجاح!');
    } catch (error) {
      console.error('خطأ في حفظ الإعدادات:', error);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات للقيم الافتراضية؟')) {
      // إعادة تعيين الإعدادات للقيم الافتراضية
      setSettings({
        // نفس القيم الافتراضية المحددة في البداية
        general: {
          companyName: 'مدينة سوسنا',
          companyLogo: '',
          language: 'ar',
          currency: 'EGP',
          timezone: 'Africa/Cairo',
          dateFormat: 'DD/MM/YYYY',
          numberFormat: 'arabic',
          theme: 'light',
          rtlSupport: true,
          autoSave: true,
          backupFrequency: 'daily'
        },
        // ... باقي الأقسام
      });
      setHasUnsavedChanges(true);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `sosna_settings_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          setHasUnsavedChanges(true);
          alert('تم استيراد الإعدادات بنجاح!');
        } catch (error) {
          alert('خطأ في ملف الإعدادات المستورد');
        }
      };
      reader.readAsText(file);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const getFilteredSections = () => {
    if (!searchQuery.trim()) return settingSections;
    
    return settingSections.filter(section =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderSettingField = (section, key, value, config) => {
    const fieldId = `${section}_${key}`;
    
    switch (config.type) {
      case 'text':
        return (
          <input
            id={fieldId}
            type="text"
            value={value}
            onChange={(e) => updateSetting(section, key, e.target.value)}
            className="setting-input"
            placeholder={config.placeholder}
          />
        );
      
      case 'number':
        return (
          <input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => updateSetting(section, key, parseFloat(e.target.value) || 0)}
            className="setting-input"
            min={config.min}
            max={config.max}
            step={config.step}
          />
        );
      
      case 'select':
        return (
          <select
            id={fieldId}
            value={value}
            onChange={(e) => updateSetting(section, key, e.target.value)}
            className="setting-select"
          >
            {config.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'boolean':
        return (
          <label className="setting-toggle">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateSetting(section, key, e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        );
      
      case 'time':
        return (
          <input
            id={fieldId}
            type="time"
            value={value}
            onChange={(e) => updateSetting(section, key, e.target.value)}
            className="setting-input"
          />
        );
      
      case 'file':
        return (
          <input
            id={fieldId}
            type="file"
            accept={config.accept}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  updateSetting(section, key, event.target.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="setting-file"
          />
        );
      
      default:
        return (
          <input
            id={fieldId}
            type="text"
            value={value}
            onChange={(e) => updateSetting(section, key, e.target.value)}
            className="setting-input"
          />
        );
    }
  };

  const getSettingConfig = (section, key) => {
    const configs = {
      general: {
        companyName: { type: 'text', label: 'اسم الشركة', placeholder: 'أدخل اسم الشركة' },
        companyLogo: { type: 'file', label: 'شعار الشركة', accept: 'image/*' },
        language: { 
          type: 'select', 
          label: 'اللغة', 
          options: [
            { value: 'ar', label: 'العربية' },
            { value: 'en', label: 'English' }
          ]
        },
        currency: {
          type: 'select',
          label: 'العملة',
          options: [
            { value: 'EGP', label: 'جنيه مصري (EGP)' },
            { value: 'USD', label: 'دولار أمريكي (USD)' },
            { value: 'EUR', label: 'يورو (EUR)' },
            { value: 'SAR', label: 'ريال سعودي (SAR)' }
          ]
        },
        timezone: {
          type: 'select',
          label: 'المنطقة الزمنية',
          options: [
            { value: 'Africa/Cairo', label: 'القاهرة (GMT+2)' },
            { value: 'Asia/Riyadh', label: 'الرياض (GMT+3)' },
            { value: 'Asia/Dubai', label: 'دبي (GMT+4)' }
          ]
        },
        dateFormat: {
          type: 'select',
          label: 'تنسيق التاريخ',
          options: [
            { value: 'DD/MM/YYYY', label: 'يوم/شهر/سنة' },
            { value: 'MM/DD/YYYY', label: 'شهر/يوم/سنة' },
            { value: 'YYYY-MM-DD', label: 'سنة-شهر-يوم' }
          ]
        },
        numberFormat: {
          type: 'select',
          label: 'تنسيق الأرقام',
          options: [
            { value: 'arabic', label: 'أرقام عربية (١٢٣)' },
            { value: 'english', label: 'أرقام إنجليزية (123)' }
          ]
        },
        theme: {
          type: 'select',
          label: 'المظهر',
          options: [
            { value: 'light', label: 'فاتح' },
            { value: 'dark', label: 'داكن' },
            { value: 'auto', label: 'تلقائي' }
          ]
        },
        rtlSupport: { type: 'boolean', label: 'دعم الكتابة من اليمين لليسار' },
        autoSave: { type: 'boolean', label: 'الحفظ التلقائي' },
        backupFrequency: {
          type: 'select',
          label: 'تكرار النسخ الاحتياطي',
          options: [
            { value: 'hourly', label: 'كل ساعة' },
            { value: 'daily', label: 'يومياً' },
            { value: 'weekly', label: 'أسبوعياً' }
          ]
        }
      },
      pricing: {
        enableCustomPricing: { type: 'boolean', label: 'تفعيل التسعير المخصص' },
        priceCalculationMethod: {
          type: 'select',
          label: 'طريقة حساب السعر',
          options: [
            { value: 'markup', label: 'هامش ربح على التكلفة' },
            { value: 'margin', label: 'هامش ربح على السعر' },
            { value: 'fixed', label: 'سعر ثابت' }
          ]
        },
        defaultMarkup: { type: 'number', label: 'هامش الربح الافتراضي (%)', min: 0, max: 1000, step: 0.1 },
        enableBulkDiscounts: { type: 'boolean', label: 'تفعيل خصومات الكمية' },
        enableCustomerSpecificPricing: { type: 'boolean', label: 'تفعيل التسعير الخاص بالعميل' },
        enableSeasonalPricing: { type: 'boolean', label: 'تفعيل التسعير الموسمي' },
        taxRate: { type: 'number', label: 'معدل الضريبة (%)', min: 0, max: 100, step: 0.1 },
        enableTaxCalculation: { type: 'boolean', label: 'تفعيل حساب الضريبة' },
        priceRoundingMethod: {
          type: 'select',
          label: 'طريقة تقريب السعر',
          options: [
            { value: 'up', label: 'للأعلى' },
            { value: 'down', label: 'للأسفل' },
            { value: 'nearest', label: 'للأقرب' }
          ]
        },
        showPricesWithTax: { type: 'boolean', label: 'عرض الأسعار شاملة الضريبة' },
        enablePriceHistory: { type: 'boolean', label: 'تفعيل تاريخ الأسعار' }
      },
      // يمكن إضافة باقي الأقسام بنفس الطريقة
    };
    
    return configs[section]?.[key] || { type: 'text', label: key };
  };

  const renderSettingsSection = (sectionId) => {
    const sectionSettings = settings[sectionId];
    if (!sectionSettings) return null;

    return (
      <div className="settings-section">
        {Object.entries(sectionSettings).map(([key, value]) => {
          const config = getSettingConfig(sectionId, key);
          
          return (
            <div key={key} className="setting-field">
              <label htmlFor={`${sectionId}_${key}`} className="setting-label">
                {config.label}
                {config.required && <span className="required">*</span>}
              </label>
              
              {renderSettingField(sectionId, key, value, config)}
              
              {config.description && (
                <div className="setting-description">{config.description}</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ultimate-settings-panel">
      <div className="settings-header">
        <h2>⚙️ الإعدادات الشاملة</h2>
        <p>تحكم كامل في جميع جوانب التطبيق</p>
        
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="البحث في الإعدادات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="action-buttons">
            <button className="action-btn secondary" onClick={exportSettings}>
              📤 تصدير
            </button>
            
            <label className="action-btn secondary">
              📥 استيراد
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                style={{ display: 'none' }}
              />
            </label>
            
            <button className="action-btn danger" onClick={resetSettings}>
              🔄 إعادة تعيين
            </button>
            
            <button 
              className="action-btn primary" 
              onClick={saveSettings}
              disabled={!hasUnsavedChanges || isLoading}
            >
              {isLoading ? '⏳ جاري الحفظ...' : '💾 حفظ التغييرات'}
            </button>
          </div>
        </div>
        
        {lastSaved && (
          <div className="last-saved">
            آخر حفظ: {lastSaved.toLocaleString('ar-EG')}
          </div>
        )}
        
        {hasUnsavedChanges && (
          <div className="unsaved-changes">
            ⚠️ يوجد تغييرات غير محفوظة
          </div>
        )}
      </div>

      <div className="settings-container">
        {/* قائمة الأقسام */}
        <div className="settings-sidebar">
          <div className="sections-list">
            {getFilteredSections().map(section => (
              <div
                key={section.id}
                className={`section-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <div className="section-icon">{section.icon}</div>
                <div className="section-info">
                  <div className="section-title">{section.title}</div>
                  <div className="section-description">{section.description}</div>
                </div>
                {hasUnsavedChanges && (
                  <div className="unsaved-indicator">●</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* محتوى الإعدادات */}
        <div className="settings-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <div className="loading-text">جاري تحميل الإعدادات...</div>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h3>
                  {settingSections.find(s => s.id === activeSection)?.icon}{' '}
                  {settingSections.find(s => s.id === activeSection)?.title}
                </h3>
                <p>{settingSections.find(s => s.id === activeSection)?.description}</p>
              </div>
              
              {renderSettingsSection(activeSection)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UltimateSettingsPanel;

