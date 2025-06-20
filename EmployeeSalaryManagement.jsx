import React, { useState, useEffect } from 'react';
import './EmployeeSalaryManagement.css';

const EmployeeSalaryManagement = () => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'أحمد محمد',
      position: 'مندوب مبيعات',
      basicSalary: 3000,
      commission: 150,
      bonus: 200,
      deductions: 50,
      advances: 300,
      netSalary: 3000,
      paymentStatus: 'مدفوع',
      paymentDate: '2024-12-01'
    },
    {
      id: 2,
      name: 'فاطمة أحمد',
      position: 'محاسبة',
      basicSalary: 3500,
      commission: 0,
      bonus: 300,
      deductions: 100,
      advances: 500,
      netSalary: 3200,
      paymentStatus: 'معلق',
      paymentDate: null
    }
  ]);

  const [dailyExpenses, setDailyExpenses] = useState([
    {
      id: 1,
      date: '2024-12-19',
      description: 'فاتورة كهرباء',
      amount: 250,
      category: 'مرافق',
      approvedBy: 'فادي إسحق',
      status: 'مدفوع'
    },
    {
      id: 2,
      date: '2024-12-19',
      description: 'وقود السيارة',
      amount: 150,
      category: 'مواصلات',
      approvedBy: 'فادي إسحق',
      status: 'معلق'
    }
  ]);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'أحمد محمد',
      task: 'زيارة عملاء المنطقة الشرقية',
      priority: 'عالية',
      dueDate: '2024-12-20',
      status: 'قيد التنفيذ',
      progress: 60
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'فاطمة أحمد',
      task: 'إعداد تقرير المبيعات الشهري',
      priority: 'متوسطة',
      dueDate: '2024-12-22',
      status: 'جديد',
      progress: 0
    }
  ]);

  const [advances, setAdvances] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'أحمد محمد',
      amount: 300,
      reason: 'ظروف طارئة',
      requestDate: '2024-12-15',
      approvalDate: '2024-12-16',
      status: 'موافق عليه',
      repaymentPlan: 'خصم من الراتب على 3 أشهر'
    }
  ]);

  const [activeTab, setActiveTab] = useState('salaries');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // حساب الراتب الصافي
  const calculateNetSalary = (employee) => {
    return employee.basicSalary + employee.commission + employee.bonus - employee.deductions - employee.advances;
  };

  // إضافة مصروف جديد
  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...expense,
      status: 'معلق'
    };
    setDailyExpenses([...dailyExpenses, newExpense]);
  };

  // إضافة مهمة جديدة
  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      status: 'جديد',
      progress: 0
    };
    setTasks([...tasks, newTask]);
  };

  // إضافة سلفة جديدة
  const addAdvance = (advance) => {
    const newAdvance = {
      id: Date.now(),
      ...advance,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'قيد المراجعة'
    };
    setAdvances([...advances, newAdvance]);
  };

  // تحديث حالة المهمة
  const updateTaskStatus = (taskId, status, progress) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status, progress } : task
    ));
  };

  // موافقة على السلفة
  const approveAdvance = (advanceId) => {
    setAdvances(advances.map(advance => 
      advance.id === advanceId ? { 
        ...advance, 
        status: 'موافق عليه',
        approvalDate: new Date().toISOString().split('T')[0]
      } : advance
    ));
  };

  return (
    <div className="employee-salary-management">
      <div className="header">
        <h1>إدارة المرتبات والمصاريف والمهام</h1>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => {
              setModalType('expense');
              setShowModal(true);
            }}
          >
            إضافة مصروف
          </button>
          <button 
            className="btn-primary"
            onClick={() => {
              setModalType('task');
              setShowModal(true);
            }}
          >
            إضافة مهمة
          </button>
          <button 
            className="btn-primary"
            onClick={() => {
              setModalType('advance');
              setShowModal(true);
            }}
          >
            طلب سلفة
          </button>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'salaries' ? 'active' : ''}`}
          onClick={() => setActiveTab('salaries')}
        >
          المرتبات
        </button>
        <button 
          className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          المصاريف اليومية
        </button>
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          المهام
        </button>
        <button 
          className={`tab ${activeTab === 'advances' ? 'active' : ''}`}
          onClick={() => setActiveTab('advances')}
        >
          السلف
        </button>
      </div>

      {activeTab === 'salaries' && (
        <div className="salaries-section">
          <h2>إدارة المرتبات</h2>
          <div className="salary-summary">
            <div className="summary-card">
              <h3>إجمالي المرتبات</h3>
              <p>{employees.reduce((sum, emp) => sum + calculateNetSalary(emp), 0)} جنيه</p>
            </div>
            <div className="summary-card">
              <h3>المرتبات المدفوعة</h3>
              <p>{employees.filter(emp => emp.paymentStatus === 'مدفوع').length}</p>
            </div>
            <div className="summary-card">
              <h3>المرتبات المعلقة</h3>
              <p>{employees.filter(emp => emp.paymentStatus === 'معلق').length}</p>
            </div>
          </div>

          <div className="employees-table">
            <table>
              <thead>
                <tr>
                  <th>الموظف</th>
                  <th>المنصب</th>
                  <th>الراتب الأساسي</th>
                  <th>العمولة</th>
                  <th>المكافآت</th>
                  <th>الخصومات</th>
                  <th>السلف</th>
                  <th>الراتب الصافي</th>
                  <th>حالة الدفع</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.position}</td>
                    <td>{employee.basicSalary} جنيه</td>
                    <td>{employee.commission} جنيه</td>
                    <td>{employee.bonus} جنيه</td>
                    <td>{employee.deductions} جنيه</td>
                    <td>{employee.advances} جنيه</td>
                    <td>{calculateNetSalary(employee)} جنيه</td>
                    <td>
                      <span className={`status ${employee.paymentStatus === 'مدفوع' ? 'paid' : 'pending'}`}>
                        {employee.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <button className="btn-action">تعديل</button>
                      <button className="btn-action">دفع</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="expenses-section">
          <h2>المصاريف اليومية</h2>
          <div className="expenses-summary">
            <div className="summary-card">
              <h3>إجمالي المصاريف اليوم</h3>
              <p>{dailyExpenses
                .filter(exp => exp.date === new Date().toISOString().split('T')[0])
                .reduce((sum, exp) => sum + exp.amount, 0)} جنيه</p>
            </div>
            <div className="summary-card">
              <h3>المصاريف المعلقة</h3>
              <p>{dailyExpenses.filter(exp => exp.status === 'معلق').length}</p>
            </div>
          </div>

          <div className="expenses-table">
            <table>
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>الوصف</th>
                  <th>المبلغ</th>
                  <th>الفئة</th>
                  <th>موافقة من</th>
                  <th>الحالة</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {dailyExpenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>{expense.description}</td>
                    <td>{expense.amount} جنيه</td>
                    <td>{expense.category}</td>
                    <td>{expense.approvedBy}</td>
                    <td>
                      <span className={`status ${expense.status === 'مدفوع' ? 'paid' : 'pending'}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-action">تعديل</button>
                      <button className="btn-action">موافقة</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="tasks-section">
          <h2>إدارة المهام</h2>
          <div className="tasks-summary">
            <div className="summary-card">
              <h3>المهام النشطة</h3>
              <p>{tasks.filter(task => task.status !== 'مكتمل').length}</p>
            </div>
            <div className="summary-card">
              <h3>المهام المكتملة</h3>
              <p>{tasks.filter(task => task.status === 'مكتمل').length}</p>
            </div>
            <div className="summary-card">
              <h3>المهام المتأخرة</h3>
              <p>{tasks.filter(task => 
                new Date(task.dueDate) < new Date() && task.status !== 'مكتمل'
              ).length}</p>
            </div>
          </div>

          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <h3>{task.task}</h3>
                  <span className={`priority ${task.priority}`}>{task.priority}</span>
                </div>
                <div className="task-details">
                  <p><strong>الموظف:</strong> {task.employeeName}</p>
                  <p><strong>موعد الانتهاء:</strong> {task.dueDate}</p>
                  <p><strong>الحالة:</strong> {task.status}</p>
                </div>
                <div className="task-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <span>{task.progress}%</span>
                </div>
                <div className="task-actions">
                  <button 
                    className="btn-action"
                    onClick={() => updateTaskStatus(task.id, 'قيد التنفيذ', task.progress + 25)}
                  >
                    تحديث التقدم
                  </button>
                  <button 
                    className="btn-action"
                    onClick={() => updateTaskStatus(task.id, 'مكتمل', 100)}
                  >
                    إكمال
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'advances' && (
        <div className="advances-section">
          <h2>إدارة السلف</h2>
          <div className="advances-summary">
            <div className="summary-card">
              <h3>إجمالي السلف المعلقة</h3>
              <p>{advances
                .filter(adv => adv.status === 'قيد المراجعة')
                .reduce((sum, adv) => sum + adv.amount, 0)} جنيه</p>
            </div>
            <div className="summary-card">
              <h3>السلف الموافق عليها</h3>
              <p>{advances.filter(adv => adv.status === 'موافق عليه').length}</p>
            </div>
          </div>

          <div className="advances-table">
            <table>
              <thead>
                <tr>
                  <th>الموظف</th>
                  <th>المبلغ</th>
                  <th>السبب</th>
                  <th>تاريخ الطلب</th>
                  <th>تاريخ الموافقة</th>
                  <th>الحالة</th>
                  <th>خطة السداد</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {advances.map(advance => (
                  <tr key={advance.id}>
                    <td>{advance.employeeName}</td>
                    <td>{advance.amount} جنيه</td>
                    <td>{advance.reason}</td>
                    <td>{advance.requestDate}</td>
                    <td>{advance.approvalDate || '-'}</td>
                    <td>
                      <span className={`status ${
                        advance.status === 'موافق عليه' ? 'approved' : 
                        advance.status === 'مرفوض' ? 'rejected' : 'pending'
                      }`}>
                        {advance.status}
                      </span>
                    </td>
                    <td>{advance.repaymentPlan || '-'}</td>
                    <td>
                      {advance.status === 'قيد المراجعة' && (
                        <>
                          <button 
                            className="btn-action approve"
                            onClick={() => approveAdvance(advance.id)}
                          >
                            موافقة
                          </button>
                          <button className="btn-action reject">رفض</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal للإضافة */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {modalType === 'expense' && 'إضافة مصروف جديد'}
                {modalType === 'task' && 'إضافة مهمة جديدة'}
                {modalType === 'advance' && 'طلب سلفة جديدة'}
              </h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {modalType === 'expense' && (
                <ExpenseForm 
                  onSubmit={(expense) => {
                    addExpense(expense);
                    setShowModal(false);
                  }}
                />
              )}
              {modalType === 'task' && (
                <TaskForm 
                  employees={employees}
                  onSubmit={(task) => {
                    addTask(task);
                    setShowModal(false);
                  }}
                />
              )}
              {modalType === 'advance' && (
                <AdvanceForm 
                  employees={employees}
                  onSubmit={(advance) => {
                    addAdvance(advance);
                    setShowModal(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// نموذج إضافة مصروف
const ExpenseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    approvedBy: 'فادي إسحق'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <div className="form-group">
        <label>وصف المصروف</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>المبلغ</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>الفئة</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
          required
        >
          <option value="">اختر الفئة</option>
          <option value="مرافق">مرافق</option>
          <option value="مواصلات">مواصلات</option>
          <option value="مكتبية">مكتبية</option>
          <option value="صيانة">صيانة</option>
          <option value="أخرى">أخرى</option>
        </select>
      </div>
      <button type="submit" className="btn-primary">إضافة المصروف</button>
    </form>
  );
};

// نموذج إضافة مهمة
const TaskForm = ({ employees, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    task: '',
    priority: 'متوسطة',
    dueDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const employee = employees.find(emp => emp.id === parseInt(formData.employeeId));
    onSubmit({
      ...formData,
      employeeId: parseInt(formData.employeeId),
      employeeName: employee.name
    });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label>الموظف</label>
        <select
          value={formData.employeeId}
          onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
          required
        >
          <option value="">اختر الموظف</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>وصف المهمة</label>
        <textarea
          value={formData.task}
          onChange={(e) => setFormData({...formData, task: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>الأولوية</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({...formData, priority: e.target.value})}
        >
          <option value="منخفضة">منخفضة</option>
          <option value="متوسطة">متوسطة</option>
          <option value="عالية">عالية</option>
          <option value="عاجلة">عاجلة</option>
        </select>
      </div>
      <div className="form-group">
        <label>موعد الانتهاء</label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          required
        />
      </div>
      <button type="submit" className="btn-primary">إضافة المهمة</button>
    </form>
  );
};

// نموذج طلب سلفة
const AdvanceForm = ({ employees, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    amount: '',
    reason: '',
    repaymentPlan: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const employee = employees.find(emp => emp.id === parseInt(formData.employeeId));
    onSubmit({
      ...formData,
      employeeId: parseInt(formData.employeeId),
      employeeName: employee.name,
      amount: parseFloat(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="advance-form">
      <div className="form-group">
        <label>الموظف</label>
        <select
          value={formData.employeeId}
          onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
          required
        >
          <option value="">اختر الموظف</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>مبلغ السلفة</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>سبب السلفة</label>
        <textarea
          value={formData.reason}
          onChange={(e) => setFormData({...formData, reason: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label>خطة السداد</label>
        <input
          type="text"
          value={formData.repaymentPlan}
          onChange={(e) => setFormData({...formData, repaymentPlan: e.target.value})}
          placeholder="مثال: خصم من الراتب على 3 أشهر"
        />
      </div>
      <button type="submit" className="btn-primary">تقديم طلب السلفة</button>
    </form>
  );
};

export default EmployeeSalaryManagement;

