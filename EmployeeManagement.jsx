// نظام إدارة الموظفين من الإدارة فقط
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Edit, Trash2, Eye, EyeOff, Shield, 
  UserCheck, UserX, Search, Filter, Download, Upload,
  Phone, Mail, MapPin, Calendar, Briefcase, Award,
  Settings, Save, X, Check, AlertTriangle
} from 'lucide-react';

const EmployeeManagement = ({ user, addNotification }) => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@sosna.com',
      phone: '01123456789',
      position: 'مدير مبيعات',
      department: 'المبيعات',
      permissions: ['invoices', 'customers', 'products'],
      isActive: true,
      joinDate: '2024-01-15',
      salary: 5000,
      address: 'القاهرة، مصر'
    },
    {
      id: 2,
      name: 'فاطمة علي',
      email: 'fatma@sosna.com',
      phone: '01234567890',
      position: 'محاسبة',
      department: 'المالية',
      permissions: ['invoices', 'reports'],
      isActive: true,
      joinDate: '2024-02-01',
      salary: 4500,
      address: 'الجيزة، مصر'
    }
  ]);

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    'المبيعات',
    'المالية', 
    'المخازن',
    'خدمة العملاء',
    'الإدارة'
  ];

  const availablePermissions = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: '📊' },
    { id: 'invoices', name: 'الفواتير', icon: '🧾' },
    { id: 'products', name: 'المنتجات', icon: '📦' },
    { id: 'customers', name: 'العملاء', icon: '👥' },
    { id: 'reports', name: 'التقارير', icon: '📈' },
    { id: 'settings', name: 'الإعدادات', icon: '⚙️' },
    { id: 'employees', name: 'إدارة الموظفين', icon: '👨‍💼' }
  ];

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    permissions: [],
    salary: '',
    address: '',
    password: ''
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone) {
      addNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    const employee = {
      id: Date.now(),
      ...newEmployee,
      isActive: true,
      joinDate: new Date().toISOString().split('T')[0]
    };

    setEmployees(prev => [...prev, employee]);
    setNewEmployee({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      permissions: [],
      salary: '',
      address: '',
      password: ''
    });
    setShowAddEmployee(false);
    addNotification('تم إضافة الموظف بنجاح', 'success');
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee({ ...employee });
  };

  const handleUpdateEmployee = () => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === editingEmployee.id ? editingEmployee : emp
      )
    );
    setEditingEmployee(null);
    addNotification('تم تحديث بيانات الموظف بنجاح', 'success');
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      addNotification('تم حذف الموظف بنجاح', 'success');
    }
  };

  const toggleEmployeeStatus = (employeeId) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === employeeId
          ? { ...emp, isActive: !emp.isActive }
          : emp
      )
    );
    addNotification('تم تحديث حالة الموظف', 'success');
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.phone.includes(searchQuery);
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const renderEmployeeCard = (employee) => (
    <motion.div
      key={employee.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{employee.name}</h3>
            <p className="text-sm text-gray-600">{employee.position}</p>
            <p className="text-xs text-gray-500">{employee.department}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            employee.isActive 
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {employee.isActive ? 'نشط' : 'معطل'}
          </span>
          
          <button
            onClick={() => toggleEmployeeStatus(employee.id)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {employee.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          {employee.email}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          {employee.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          {employee.address}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          انضم في {employee.joinDate}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2">الصلاحيات:</p>
        <div className="flex flex-wrap gap-1">
          {employee.permissions.map(permission => {
            const perm = availablePermissions.find(p => p.id === permission);
            return perm ? (
              <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {perm.icon} {perm.name}
              </span>
            ) : null;
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-semibold text-green-600">
          {employee.salary ? `${employee.salary.toLocaleString()} ج.م` : 'غير محدد'}
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditEmployee(employee)}
            className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteEmployee(employee.id)}
            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderAddEmployeeModal = () => (
    <AnimatePresence>
      {showAddEmployee && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddEmployee(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">إضافة موظف جديد</h2>
                <button
                  onClick={() => setShowAddEmployee(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@sosna.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="01xxxxxxxxx"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنصب
                  </label>
                  <input
                    type="text"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثل: مدير مبيعات"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القسم
                  </label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر القسم</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الراتب (ج.م)
                  </label>
                  <input
                    type="number"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={newEmployee.address}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="العنوان الكامل"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    كلمة المرور *
                  </label>
                  <input
                    type="password"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="كلمة مرور قوية"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  الصلاحيات
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availablePermissions.map(permission => (
                    <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newEmployee.permissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewEmployee(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, permission.id]
                            }));
                          } else {
                            setNewEmployee(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission.id)
                            }));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {permission.icon} {permission.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowAddEmployee(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleAddEmployee}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إضافة الموظف
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // التحقق من صلاحية المستخدم
  if (user.type !== 'admin' && !user.permissions?.includes('employees')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">غير مصرح</h3>
          <p className="text-gray-400">ليس لديك صلاحية للوصول إلى إدارة الموظفين</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* الهيدر */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الموظفين</h1>
          <p className="text-gray-600">إدارة حسابات وصلاحيات الموظفين</p>
        </div>
        
        <button
          onClick={() => setShowAddEmployee(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة موظف
        </button>
      </div>

      {/* أدوات البحث والفلترة */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث في الموظفين..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">جميع الأقسام</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">إجمالي الموظفين</p>
              <p className="text-xl font-bold text-gray-800">{employees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">الموظفين النشطين</p>
              <p className="text-xl font-bold text-gray-800">
                {employees.filter(emp => emp.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">الموظفين المعطلين</p>
              <p className="text-xl font-bold text-gray-800">
                {employees.filter(emp => !emp.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">الأقسام</p>
              <p className="text-xl font-bold text-gray-800">{departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة الموظفين */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredEmployees.map(renderEmployeeCard)}
        </AnimatePresence>
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500 mb-2">لا توجد موظفين</h3>
          <p className="text-gray-400">جرب تغيير معايير البحث أو أضف موظف جديد</p>
        </div>
      )}

      {/* مودال إضافة موظف */}
      {renderAddEmployeeModal()}

      {/* مودال تعديل موظف */}
      <AnimatePresence>
        {editingEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">تعديل بيانات الموظف</h2>
                  <button
                    onClick={() => setEditingEmployee(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={editingEmployee.name}
                      onChange={(e) => setEditingEmployee(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={editingEmployee.email}
                      onChange={(e) => setEditingEmployee(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={editingEmployee.phone}
                      onChange={(e) => setEditingEmployee(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المنصب
                    </label>
                    <input
                      type="text"
                      value={editingEmployee.position}
                      onChange={(e) => setEditingEmployee(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      القسم
                    </label>
                    <select
                      value={editingEmployee.department}
                      onChange={(e) => setEditingEmployee(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الراتب (ج.م)
                    </label>
                    <input
                      type="number"
                      value={editingEmployee.salary}
                      onChange={(e) => setEditingEmployee(prev => ({ ...prev, salary: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      value={editingEmployee.address}
                      onChange={(e) => setEditingEmployee(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    الصلاحيات
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availablePermissions.map(permission => (
                      <label key={permission.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingEmployee.permissions.includes(permission.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingEmployee(prev => ({
                                ...prev,
                                permissions: [...prev.permissions, permission.id]
                              }));
                            } else {
                              setEditingEmployee(prev => ({
                                ...prev,
                                permissions: prev.permissions.filter(p => p !== permission.id)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {permission.icon} {permission.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setEditingEmployee(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleUpdateEmployee}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeManagement;

