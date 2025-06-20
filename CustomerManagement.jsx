import React, { useState, useEffect } from 'react';
import './CustomerManagement.css';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [regions, setRegions] = useState([
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'الدقهلية',
    'الشرقية',
    'القليوبية',
    'كفر الشيخ',
    'الغربية',
    'المنوفية',
    'البحيرة',
    'الإسماعيلية',
    'بورسعيد',
    'السويس',
    'شمال سيناء',
    'جنوب سيناء',
    'الأقصر',
    'أسوان',
    'أسيوط',
    'سوهاج',
    'قنا',
    'الفيوم',
    'بني سويف',
    'المنيا',
    'الوادي الجديد',
    'مطروح',
    'البحر الأحمر'
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    region: '',
    customerType: 'عادي',
    specialPricing: false,
    discountPercentage: 0,
    notes: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    const savedCustomers = localStorage.getItem('sosna_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // بيانات تجريبية
      const sampleCustomers = [
        {
          id: 1,
          name: 'أحمد محمد علي',
          phone: '01012345678',
          email: 'ahmed@example.com',
          address: 'شارع النيل، المعادي',
          region: 'القاهرة',
          customerType: 'تاجر',
          specialPricing: true,
          discountPercentage: 15,
          notes: 'عميل مميز - دفع نقدي',
          totalPurchases: 125000,
          lastPurchase: '2024-12-15'
        },
        {
          id: 2,
          name: 'فاطمة حسن محمود',
          phone: '01098765432',
          email: 'fatma@example.com',
          address: 'شارع الجمهورية، وسط البلد',
          region: 'الإسكندرية',
          customerType: 'عادي',
          specialPricing: false,
          discountPercentage: 0,
          notes: 'عميل جديد',
          totalPurchases: 45000,
          lastPurchase: '2024-12-18'
        },
        {
          id: 3,
          name: 'محمد عبد الرحمن',
          phone: '01156789012',
          email: 'mohamed@example.com',
          address: 'شارع الهرم، الجيزة',
          region: 'الجيزة',
          customerType: 'تاجر',
          specialPricing: true,
          discountPercentage: 20,
          notes: 'تاجر جملة - كميات كبيرة',
          totalPurchases: 280000,
          lastPurchase: '2024-12-19'
        }
      ];
      setCustomers(sampleCustomers);
      localStorage.setItem('sosna_customers', JSON.stringify(sampleCustomers));
    }
  };

  const saveCustomers = (updatedCustomers) => {
    localStorage.setItem('sosna_customers', JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.region) {
      alert('يرجى ملء الحقول المطلوبة (الاسم، الهاتف، المنطقة)');
      return;
    }

    const customer = {
      ...newCustomer,
      id: Date.now(),
      totalPurchases: 0,
      lastPurchase: null
    };

    const updatedCustomers = [...customers, customer];
    saveCustomers(updatedCustomers);
    
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      region: '',
      customerType: 'عادي',
      specialPricing: false,
      discountPercentage: 0,
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setNewCustomer(customer);
    setShowAddForm(true);
  };

  const handleUpdateCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.region) {
      alert('يرجى ملء الحقول المطلوبة (الاسم، الهاتف، المنطقة)');
      return;
    }

    const updatedCustomers = customers.map(customer =>
      customer.id === editingCustomer.id ? newCustomer : customer
    );
    saveCustomers(updatedCustomers);
    
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      region: '',
      customerType: 'عادي',
      specialPricing: false,
      discountPercentage: 0,
      notes: ''
    });
    setShowAddForm(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      const updatedCustomers = customers.filter(customer => customer.id !== customerId);
      saveCustomers(updatedCustomers);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === '' || customer.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const getCustomersByRegion = () => {
    const regionCounts = {};
    customers.forEach(customer => {
      regionCounts[customer.region] = (regionCounts[customer.region] || 0) + 1;
    });
    return regionCounts;
  };

  return (
    <div className="customer-management">
      <div className="customer-header">
        <h2>إدارة العملاء</h2>
        <button 
          className="add-customer-btn"
          onClick={() => setShowAddForm(true)}
        >
          + إضافة عميل جديد
        </button>
      </div>

      {/* إحصائيات العملاء */}
      <div className="customer-stats">
        <div className="stat-card">
          <h3>إجمالي العملاء</h3>
          <span className="stat-number">{customers.length}</span>
        </div>
        <div className="stat-card">
          <h3>عملاء تجار</h3>
          <span className="stat-number">
            {customers.filter(c => c.customerType === 'تاجر').length}
          </span>
        </div>
        <div className="stat-card">
          <h3>عملاء عاديين</h3>
          <span className="stat-number">
            {customers.filter(c => c.customerType === 'عادي').length}
          </span>
        </div>
        <div className="stat-card">
          <h3>عملاء بأسعار خاصة</h3>
          <span className="stat-number">
            {customers.filter(c => c.specialPricing).length}
          </span>
        </div>
      </div>

      {/* فلاتر البحث */}
      <div className="customer-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="البحث بالاسم، الهاتف، أو البريد الإلكتروني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="region-filter">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="">جميع المناطق</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* إحصائيات المناطق */}
      <div className="regions-stats">
        <h3>توزيع العملاء حسب المناطق</h3>
        <div className="regions-grid">
          {Object.entries(getCustomersByRegion()).map(([region, count]) => (
            <div key={region} className="region-stat">
              <span className="region-name">{region}</span>
              <span className="region-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* قائمة العملاء */}
      <div className="customers-list">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="customer-card">
            <div className="customer-info">
              <div className="customer-main">
                <h3>{customer.name}</h3>
                <span className={`customer-type ${customer.customerType === 'تاجر' ? 'trader' : 'regular'}`}>
                  {customer.customerType}
                </span>
                {customer.specialPricing && (
                  <span className="special-pricing">
                    خصم {customer.discountPercentage}%
                  </span>
                )}
              </div>
              <div className="customer-details">
                <p><strong>الهاتف:</strong> {customer.phone}</p>
                <p><strong>البريد الإلكتروني:</strong> {customer.email || 'غير محدد'}</p>
                <p><strong>العنوان:</strong> {customer.address}</p>
                <p><strong>المنطقة:</strong> {customer.region}</p>
                {customer.notes && <p><strong>ملاحظات:</strong> {customer.notes}</p>}
              </div>
              <div className="customer-stats-info">
                <p><strong>إجمالي المشتريات:</strong> {customer.totalPurchases?.toLocaleString()} ج.م</p>
                <p><strong>آخر شراء:</strong> {customer.lastPurchase || 'لا يوجد'}</p>
              </div>
            </div>
            <div className="customer-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEditCustomer(customer)}
              >
                تعديل
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDeleteCustomer(customer.id)}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* نموذج إضافة/تعديل العميل */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="customer-form">
            <h3>{editingCustomer ? 'تعديل العميل' : 'إضافة عميل جديد'}</h3>
            
            <div className="form-group">
              <label>اسم العميل *</label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                placeholder="أدخل اسم العميل"
              />
            </div>

            <div className="form-group">
              <label>رقم الهاتف *</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                placeholder="01xxxxxxxxx"
              />
            </div>

            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                placeholder="example@email.com"
              />
            </div>

            <div className="form-group">
              <label>العنوان</label>
              <textarea
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                placeholder="أدخل العنوان التفصيلي"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>المنطقة *</label>
              <select
                value={newCustomer.region}
                onChange={(e) => setNewCustomer({...newCustomer, region: e.target.value})}
              >
                <option value="">اختر المنطقة</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>نوع العميل</label>
              <select
                value={newCustomer.customerType}
                onChange={(e) => setNewCustomer({...newCustomer, customerType: e.target.value})}
              >
                <option value="عادي">عادي</option>
                <option value="تاجر">تاجر</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={newCustomer.specialPricing}
                  onChange={(e) => setNewCustomer({...newCustomer, specialPricing: e.target.checked})}
                />
                أسعار خاصة
              </label>
            </div>

            {newCustomer.specialPricing && (
              <div className="form-group">
                <label>نسبة الخصم (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newCustomer.discountPercentage}
                  onChange={(e) => setNewCustomer({...newCustomer, discountPercentage: parseInt(e.target.value) || 0})}
                />
              </div>
            )}

            <div className="form-group">
              <label>ملاحظات</label>
              <textarea
                value={newCustomer.notes}
                onChange={(e) => setNewCustomer({...newCustomer, notes: e.target.value})}
                placeholder="أي ملاحظات إضافية..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button 
                className="save-btn"
                onClick={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
              >
                {editingCustomer ? 'تحديث' : 'إضافة'}
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCustomer(null);
                  setNewCustomer({
                    name: '',
                    phone: '',
                    email: '',
                    address: '',
                    region: '',
                    customerType: 'عادي',
                    specialPricing: false,
                    discountPercentage: 0,
                    notes: ''
                  });
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;

