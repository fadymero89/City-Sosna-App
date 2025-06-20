import React, { useState, useEffect } from 'react';
import './ScrapManagement.css';

const ScrapManagement = () => {
  const [scrapTransactions, setScrapTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'customer', // customer or supplier
    entityId: '',
    entityName: '',
    scrapType: 'ألومنيوم',
    weight: '',
    pricePerKg: 25, // سعر الكيلو الثابت للألومنيوم
    totalValue: 0,
    exchangeType: 'money', // money or goods
    goodsDescription: '',
    notes: ''
  });

  const scrapTypes = ['ألومنيوم', 'نحاس', 'حديد', 'بلاستيك', 'أخرى'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // تحميل بيانات الخردة
    const savedScrap = localStorage.getItem('sosna_scrap_transactions');
    if (savedScrap) {
      setScrapTransactions(JSON.parse(savedScrap));
    } else {
      // بيانات تجريبية
      const sampleScrap = [
        {
          id: 1,
          type: 'customer',
          entityId: 1,
          entityName: 'أحمد محمد علي',
          scrapType: 'ألومنيوم',
          weight: 15.5,
          pricePerKg: 25,
          totalValue: 387.5,
          exchangeType: 'money',
          goodsDescription: '',
          notes: 'خردة نظيفة',
          date: '2024-12-19',
          time: '10:30'
        },
        {
          id: 2,
          type: 'supplier',
          entityId: 1,
          entityName: 'مورد الألومنيوم المحدود',
          scrapType: 'ألومنيوم',
          weight: 50,
          pricePerKg: 25,
          totalValue: 1250,
          exchangeType: 'goods',
          goodsDescription: 'أطقم مواعين جديدة - 10 أطقم',
          notes: 'صفقة تبادل',
          date: '2024-12-18',
          time: '14:15'
        }
      ];
      setScrapTransactions(sampleScrap);
      localStorage.setItem('sosna_scrap_transactions', JSON.stringify(sampleScrap));
    }

    // تحميل بيانات العملاء
    const savedCustomers = localStorage.getItem('sosna_customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    // تحميل بيانات الموردين
    const savedSuppliers = localStorage.getItem('sosna_suppliers');
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
    } else {
      // موردين تجريبيين
      const sampleSuppliers = [
        {
          id: 1,
          name: 'مورد الألومنيوم المحدود',
          phone: '01234567890',
          address: 'المنطقة الصناعية، القاهرة',
          specialization: 'ألومنيوم'
        },
        {
          id: 2,
          name: 'شركة المعادن المتحدة',
          phone: '01098765432',
          address: 'الإسكندرية',
          specialization: 'جميع المعادن'
        }
      ];
      setSuppliers(sampleSuppliers);
      localStorage.setItem('sosna_suppliers', JSON.stringify(sampleSuppliers));
    }
  };

  const saveScrapTransactions = (updatedTransactions) => {
    localStorage.setItem('sosna_scrap_transactions', JSON.stringify(updatedTransactions));
    setScrapTransactions(updatedTransactions);
  };

  const handleAddTransaction = () => {
    if (!newTransaction.entityId || !newTransaction.weight || !newTransaction.scrapType) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const weight = parseFloat(newTransaction.weight);
    const pricePerKg = parseFloat(newTransaction.pricePerKg);
    const totalValue = weight * pricePerKg;

    const transaction = {
      ...newTransaction,
      id: Date.now(),
      weight: weight,
      pricePerKg: pricePerKg,
      totalValue: totalValue,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTransactions = [transaction, ...scrapTransactions];
    saveScrapTransactions(updatedTransactions);

    // تحديث الإدارة المالية إذا كان التبادل نقدي
    if (newTransaction.exchangeType === 'money') {
      const financialTransactions = JSON.parse(localStorage.getItem('sosna_transactions') || '[]');
      const accounts = JSON.parse(localStorage.getItem('sosna_accounts') || '{}');
      
      const financialTransaction = {
        id: Date.now() + 1,
        type: 'expense',
        amount: totalValue,
        source: 'safe',
        description: `شراء خردة ${newTransaction.scrapType} من ${newTransaction.entityName}`,
        category: 'خردة',
        reference: `SCRAP-${Date.now()}`,
        date: transaction.date,
        time: transaction.time
      };

      if (accounts.safe && accounts.safe.balance >= totalValue) {
        accounts.safe.balance -= totalValue;
        financialTransactions.unshift(financialTransaction);
        localStorage.setItem('sosna_transactions', JSON.stringify(financialTransactions));
        localStorage.setItem('sosna_accounts', JSON.stringify(accounts));
      }
    }
    
    setNewTransaction({
      type: 'customer',
      entityId: '',
      entityName: '',
      scrapType: 'ألومنيوم',
      weight: '',
      pricePerKg: 25,
      totalValue: 0,
      exchangeType: 'money',
      goodsDescription: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleEntityChange = (entityId) => {
    const entities = newTransaction.type === 'customer' ? customers : suppliers;
    const entity = entities.find(e => e.id === parseInt(entityId));
    setNewTransaction({
      ...newTransaction,
      entityId: entityId,
      entityName: entity ? entity.name : ''
    });
  };

  const handleWeightChange = (weight) => {
    const totalValue = parseFloat(weight) * parseFloat(newTransaction.pricePerKg) || 0;
    setNewTransaction({
      ...newTransaction,
      weight: weight,
      totalValue: totalValue
    });
  };

  const handlePriceChange = (price) => {
    const totalValue = parseFloat(newTransaction.weight) * parseFloat(price) || 0;
    setNewTransaction({
      ...newTransaction,
      pricePerKg: price,
      totalValue: totalValue
    });
  };

  const getTotalWeight = () => {
    return scrapTransactions.reduce((total, transaction) => total + transaction.weight, 0);
  };

  const getTotalValue = () => {
    return scrapTransactions.reduce((total, transaction) => total + transaction.totalValue, 0);
  };

  const getScrapByType = () => {
    const scrapByType = {};
    scrapTransactions.forEach(transaction => {
      if (!scrapByType[transaction.scrapType]) {
        scrapByType[transaction.scrapType] = { weight: 0, value: 0, count: 0 };
      }
      scrapByType[transaction.scrapType].weight += transaction.weight;
      scrapByType[transaction.scrapType].value += transaction.totalValue;
      scrapByType[transaction.scrapType].count += 1;
    });
    return scrapByType;
  };

  return (
    <div className="scrap-management">
      <div className="scrap-header">
        <h2>إدارة الخردة</h2>
        <button 
          className="add-scrap-btn"
          onClick={() => setShowAddForm(true)}
        >
          + إضافة معاملة خردة
        </button>
      </div>

      {/* إحصائيات الخردة */}
      <div className="scrap-stats">
        <div className="stat-card">
          <h3>إجمالي المعاملات</h3>
          <span className="stat-number">{scrapTransactions.length}</span>
        </div>
        <div className="stat-card">
          <h3>إجمالي الوزن</h3>
          <span className="stat-number">{getTotalWeight().toFixed(2)} كجم</span>
        </div>
        <div className="stat-card">
          <h3>إجمالي القيمة</h3>
          <span className="stat-number">{getTotalValue().toLocaleString()} ج.م</span>
        </div>
        <div className="stat-card">
          <h3>متوسط السعر</h3>
          <span className="stat-number">
            {getTotalWeight() > 0 ? (getTotalValue() / getTotalWeight()).toFixed(2) : 0} ج.م/كجم
          </span>
        </div>
      </div>

      {/* إحصائيات حسب النوع */}
      <div className="scrap-by-type">
        <h3>الخردة حسب النوع</h3>
        <div className="type-stats-grid">
          {Object.entries(getScrapByType()).map(([type, stats]) => (
            <div key={type} className="type-stat-card">
              <h4>{type}</h4>
              <div className="type-details">
                <p><strong>العدد:</strong> {stats.count} معاملة</p>
                <p><strong>الوزن:</strong> {stats.weight.toFixed(2)} كجم</p>
                <p><strong>القيمة:</strong> {stats.value.toLocaleString()} ج.م</p>
                <p><strong>متوسط السعر:</strong> {(stats.value / stats.weight).toFixed(2)} ج.م/كجم</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* قائمة معاملات الخردة */}
      <div className="scrap-transactions">
        <h3>معاملات الخردة</h3>
        <div className="transactions-list">
          {scrapTransactions.map(transaction => (
            <div key={transaction.id} className="scrap-transaction-card">
              <div className="transaction-header">
                <div className="entity-info">
                  <h4>{transaction.entityName}</h4>
                  <span className={`entity-type ${transaction.type}`}>
                    {transaction.type === 'customer' ? 'عميل' : 'مورد'}
                  </span>
                </div>
                <div className="transaction-value">
                  <span className="total-value">{transaction.totalValue.toLocaleString()} ج.م</span>
                  <span className="date-time">{transaction.date} - {transaction.time}</span>
                </div>
              </div>
              
              <div className="transaction-details">
                <div className="scrap-info">
                  <p><strong>نوع الخردة:</strong> {transaction.scrapType}</p>
                  <p><strong>الوزن:</strong> {transaction.weight} كجم</p>
                  <p><strong>السعر:</strong> {transaction.pricePerKg} ج.م/كجم</p>
                </div>
                
                <div className="exchange-info">
                  <p><strong>نوع التبادل:</strong> 
                    <span className={`exchange-type ${transaction.exchangeType}`}>
                      {transaction.exchangeType === 'money' ? 'نقدي' : 'بضاعة'}
                    </span>
                  </p>
                  {transaction.exchangeType === 'goods' && transaction.goodsDescription && (
                    <p><strong>وصف البضاعة:</strong> {transaction.goodsDescription}</p>
                  )}
                  {transaction.notes && (
                    <p><strong>ملاحظات:</strong> {transaction.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نموذج إضافة معاملة خردة */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="scrap-form">
            <h3>إضافة معاملة خردة جديدة</h3>
            
            <div className="form-group">
              <label>نوع المعاملة</label>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value, entityId: '', entityName: ''})}
              >
                <option value="customer">عميل</option>
                <option value="supplier">مورد</option>
              </select>
            </div>

            <div className="form-group">
              <label>{newTransaction.type === 'customer' ? 'العميل' : 'المورد'} *</label>
              <select
                value={newTransaction.entityId}
                onChange={(e) => handleEntityChange(e.target.value)}
              >
                <option value="">اختر {newTransaction.type === 'customer' ? 'العميل' : 'المورد'}</option>
                {(newTransaction.type === 'customer' ? customers : suppliers).map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>نوع الخردة</label>
              <select
                value={newTransaction.scrapType}
                onChange={(e) => setNewTransaction({...newTransaction, scrapType: e.target.value})}
              >
                {scrapTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>الوزن (كجم) *</label>
              <input
                type="number"
                step="0.1"
                value={newTransaction.weight}
                onChange={(e) => handleWeightChange(e.target.value)}
                placeholder="أدخل الوزن"
              />
            </div>

            <div className="form-group">
              <label>السعر لكل كيلو (ج.م)</label>
              <input
                type="number"
                step="0.01"
                value={newTransaction.pricePerKg}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="أدخل السعر"
              />
            </div>

            <div className="form-group">
              <label>إجمالي القيمة</label>
              <input
                type="number"
                value={newTransaction.totalValue.toFixed(2)}
                readOnly
                className="readonly"
              />
            </div>

            <div className="form-group">
              <label>نوع التبادل</label>
              <select
                value={newTransaction.exchangeType}
                onChange={(e) => setNewTransaction({...newTransaction, exchangeType: e.target.value})}
              >
                <option value="money">نقدي</option>
                <option value="goods">بضاعة</option>
              </select>
            </div>

            {newTransaction.exchangeType === 'goods' && (
              <div className="form-group">
                <label>وصف البضاعة</label>
                <textarea
                  value={newTransaction.goodsDescription}
                  onChange={(e) => setNewTransaction({...newTransaction, goodsDescription: e.target.value})}
                  placeholder="أدخل وصف البضاعة المستلمة"
                  rows="3"
                />
              </div>
            )}

            <div className="form-group">
              <label>ملاحظات</label>
              <textarea
                value={newTransaction.notes}
                onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                placeholder="أي ملاحظات إضافية..."
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button 
                className="save-btn"
                onClick={handleAddTransaction}
              >
                إضافة
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setNewTransaction({
                    type: 'customer',
                    entityId: '',
                    entityName: '',
                    scrapType: 'ألومنيوم',
                    weight: '',
                    pricePerKg: 25,
                    totalValue: 0,
                    exchangeType: 'money',
                    goodsDescription: '',
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

export default ScrapManagement;

