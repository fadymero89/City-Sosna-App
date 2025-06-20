import React, { useState, useEffect } from 'react';
import './FinancialManagement.css';

const FinancialManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState({
    safe: { name: 'الخزنة', balance: 50000 },
    bank: { name: 'البنك', balance: 150000 },
    wallet: { name: 'المحفظة الإلكترونية', balance: 25000 }
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'income',
    amount: '',
    source: 'safe',
    description: '',
    category: '',
    reference: ''
  });
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const categories = {
    income: ['مبيعات', 'خردة', 'أخرى'],
    expense: ['مشتريات', 'مرتبات', 'إيجار', 'كهرباء', 'مياه', 'صيانة', 'مواصلات', 'أخرى']
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const savedTransactions = localStorage.getItem('sosna_transactions');
    const savedAccounts = localStorage.getItem('sosna_accounts');
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      // بيانات تجريبية
      const sampleTransactions = [
        {
          id: 1,
          type: 'income',
          amount: 15000,
          source: 'safe',
          description: 'بيع أدوات منزلية - فاتورة رقم 001',
          category: 'مبيعات',
          reference: 'INV-001',
          date: '2024-12-19',
          time: '10:30'
        },
        {
          id: 2,
          type: 'expense',
          amount: 5000,
          source: 'bank',
          description: 'شراء بضاعة جديدة',
          category: 'مشتريات',
          reference: 'PUR-001',
          date: '2024-12-18',
          time: '14:15'
        },
        {
          id: 3,
          type: 'income',
          amount: 2500,
          source: 'wallet',
          description: 'بيع خردة ألومنيوم',
          category: 'خردة',
          reference: 'SCRAP-001',
          date: '2024-12-17',
          time: '16:45'
        }
      ];
      setTransactions(sampleTransactions);
      localStorage.setItem('sosna_transactions', JSON.stringify(sampleTransactions));
    }

    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }
  };

  const saveData = (updatedTransactions, updatedAccounts) => {
    localStorage.setItem('sosna_transactions', JSON.stringify(updatedTransactions));
    localStorage.setItem('sosna_accounts', JSON.stringify(updatedAccounts));
    setTransactions(updatedTransactions);
    setAccounts(updatedAccounts);
  };

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    const transaction = {
      ...newTransaction,
      id: Date.now(),
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    // تحديث رصيد الحساب
    const updatedAccounts = { ...accounts };
    if (newTransaction.type === 'income') {
      updatedAccounts[newTransaction.source].balance += amount;
    } else {
      if (updatedAccounts[newTransaction.source].balance >= amount) {
        updatedAccounts[newTransaction.source].balance -= amount;
      } else {
        alert('الرصيد غير كافي في هذا الحساب');
        return;
      }
    }

    const updatedTransactions = [transaction, ...transactions];
    saveData(updatedTransactions, updatedAccounts);
    
    setNewTransaction({
      type: 'income',
      amount: '',
      source: 'safe',
      description: '',
      category: '',
      reference: ''
    });
    setShowAddForm(false);
  };

  const handleTransfer = (fromSource, toSource, amount) => {
    if (accounts[fromSource].balance >= amount) {
      const updatedAccounts = { ...accounts };
      updatedAccounts[fromSource].balance -= amount;
      updatedAccounts[toSource].balance += amount;

      const transferOut = {
        id: Date.now(),
        type: 'expense',
        amount: amount,
        source: fromSource,
        description: `تحويل إلى ${updatedAccounts[toSource].name}`,
        category: 'تحويل',
        reference: `TRANSFER-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      const transferIn = {
        id: Date.now() + 1,
        type: 'income',
        amount: amount,
        source: toSource,
        description: `تحويل من ${updatedAccounts[fromSource].name}`,
        category: 'تحويل',
        reference: `TRANSFER-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      const updatedTransactions = [transferIn, transferOut, ...transactions];
      saveData(updatedTransactions, updatedAccounts);
    } else {
      alert('الرصيد غير كافي للتحويل');
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesDate = dateFilter === '' || transaction.date === dateFilter;
    const matchesType = typeFilter === '' || transaction.type === typeFilter;
    const matchesSource = sourceFilter === '' || transaction.source === sourceFilter;
    return matchesDate && matchesType && matchesSource;
  });

  const getTotalBalance = () => {
    return Object.values(accounts).reduce((total, account) => total + account.balance, 0);
  };

  const getTotalIncome = () => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  };

  const getTotalExpense = () => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  };

  return (
    <div className="financial-management">
      <div className="financial-header">
        <h2>الإدارة المالية</h2>
        <button 
          className="add-transaction-btn"
          onClick={() => setShowAddForm(true)}
        >
          + إضافة معاملة جديدة
        </button>
      </div>

      {/* أرصدة الحسابات */}
      <div className="accounts-section">
        <h3>أرصدة الحسابات</h3>
        <div className="accounts-grid">
          {Object.entries(accounts).map(([key, account]) => (
            <div key={key} className="account-card">
              <h4>{account.name}</h4>
              <span className="balance">{account.balance.toLocaleString()} ج.م</span>
              <div className="account-actions">
                <button 
                  className="transfer-btn"
                  onClick={() => {
                    const amount = prompt('أدخل المبلغ المراد تحويله:');
                    const target = prompt('إلى أين؟ (safe/bank/wallet)');
                    if (amount && target && target !== key) {
                      handleTransfer(key, target, parseFloat(amount));
                    }
                  }}
                >
                  تحويل
                </button>
              </div>
            </div>
          ))}
          <div className="account-card total">
            <h4>إجمالي الأرصدة</h4>
            <span className="balance total-balance">{getTotalBalance().toLocaleString()} ج.م</span>
          </div>
        </div>
      </div>

      {/* إحصائيات مالية */}
      <div className="financial-stats">
        <div className="stat-card income">
          <h3>إجمالي الإيرادات</h3>
          <span className="stat-number">{getTotalIncome().toLocaleString()} ج.م</span>
        </div>
        <div className="stat-card expense">
          <h3>إجمالي المصروفات</h3>
          <span className="stat-number">{getTotalExpense().toLocaleString()} ج.م</span>
        </div>
        <div className="stat-card profit">
          <h3>صافي الربح</h3>
          <span className="stat-number">{(getTotalIncome() - getTotalExpense()).toLocaleString()} ج.م</span>
        </div>
      </div>

      {/* فلاتر المعاملات */}
      <div className="transaction-filters">
        <div className="filter-group">
          <label>التاريخ:</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>النوع:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">الكل</option>
            <option value="income">إيراد</option>
            <option value="expense">مصروف</option>
          </select>
        </div>
        <div className="filter-group">
          <label>المصدر:</label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">الكل</option>
            <option value="safe">الخزنة</option>
            <option value="bank">البنك</option>
            <option value="wallet">المحفظة الإلكترونية</option>
          </select>
        </div>
        <button 
          className="clear-filters-btn"
          onClick={() => {
            setDateFilter('');
            setTypeFilter('');
            setSourceFilter('');
          }}
        >
          مسح الفلاتر
        </button>
      </div>

      {/* قائمة المعاملات */}
      <div className="transactions-section">
        <h3>المعاملات المالية ({filteredTransactions.length})</h3>
        <div className="transactions-list">
          {filteredTransactions.map(transaction => (
            <div key={transaction.id} className={`transaction-card ${transaction.type}`}>
              <div className="transaction-info">
                <div className="transaction-header">
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type === 'income' ? 'إيراد' : 'مصروف'}
                  </span>
                  <span className="transaction-amount">
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} ج.م
                  </span>
                </div>
                <div className="transaction-details">
                  <p><strong>الوصف:</strong> {transaction.description}</p>
                  <p><strong>المصدر:</strong> {accounts[transaction.source].name}</p>
                  <p><strong>الفئة:</strong> {transaction.category}</p>
                  {transaction.reference && (
                    <p><strong>المرجع:</strong> {transaction.reference}</p>
                  )}
                  <p><strong>التاريخ:</strong> {transaction.date} - {transaction.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نموذج إضافة معاملة */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="transaction-form">
            <h3>إضافة معاملة جديدة</h3>
            
            <div className="form-group">
              <label>نوع المعاملة</label>
              <select
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value, category: ''})}
              >
                <option value="income">إيراد</option>
                <option value="expense">مصروف</option>
              </select>
            </div>

            <div className="form-group">
              <label>المبلغ *</label>
              <input
                type="number"
                step="0.01"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                placeholder="أدخل المبلغ"
              />
            </div>

            <div className="form-group">
              <label>المصدر</label>
              <select
                value={newTransaction.source}
                onChange={(e) => setNewTransaction({...newTransaction, source: e.target.value})}
              >
                <option value="safe">الخزنة</option>
                <option value="bank">البنك</option>
                <option value="wallet">المحفظة الإلكترونية</option>
              </select>
            </div>

            <div className="form-group">
              <label>الفئة</label>
              <select
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
              >
                <option value="">اختر الفئة</option>
                {categories[newTransaction.type].map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>الوصف *</label>
              <textarea
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                placeholder="أدخل وصف المعاملة"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>المرجع</label>
              <input
                type="text"
                value={newTransaction.reference}
                onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                placeholder="رقم الفاتورة أو المرجع"
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
                    type: 'income',
                    amount: '',
                    source: 'safe',
                    description: '',
                    category: '',
                    reference: ''
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

export default FinancialManagement;

