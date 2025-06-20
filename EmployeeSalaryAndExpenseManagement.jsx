import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Calculator,
  CreditCard,
  Wallet,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  PiggyBank,
  Receipt
} from 'lucide-react';

const EmployeeSalaryAndExpenseManagement = () => {
  const [activeTab, setActiveTab] = useState('salaries');
  const [employees, setEmployees] = useState([]);
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddAdvance, setShowAddAdvance] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  // بيانات تجريبية للموظفين
  useEffect(() => {
    setEmployees([
      {
        id: 1,
        name: 'أحمد محمد علي',
        position: 'مندوب مبيعات',
        department: 'المبيعات',
        baseSalary: 5000,
        commissionRate: 2, // نسبة العمولة %
        phone: '01234567890',
        hireDate: '2024-01-15',
        isActive: true
      },
      {
        id: 2,
        name: 'فاطمة أحمد حسن',
        position: 'محاسبة',
        department: 'المحاسبة',
        baseSalary: 4500,
        commissionRate: 0,
        phone: '01098765432',
        hireDate: '2024-02-01',
        isActive: true
      },
      {
        id: 3,
        name: 'محمد عبد الرحمن',
        position: 'عامل مخزن',
        department: 'المخزن',
        baseSalary: 3500,
        commissionRate: 0,
        phone: '01156789012',
        hireDate: '2024-03-10',
        isActive: true
      }
    ]);

    setSalaryRecords([
      {
        id: 1,
        employeeId: 1,
        employeeName: 'أحمد محمد علي',
        month: '2024-06',
        baseSalary: 5000,
        commission: 300,
        bonus: 200,
        deductions: 100,
        advances: 500,
        netSalary: 4900,
        status: 'paid',
        paymentDate: '2024-06-30',
        paymentMethod: 'bank',
        notes: 'راتب شهر يونيو مع عمولة مبيعات'
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'فاطمة أحمد حسن',
        month: '2024-06',
        baseSalary: 4500,
        commission: 0,
        bonus: 150,
        deductions: 50,
        advances: 0,
        netSalary: 4600,
        status: 'pending',
        paymentDate: null,
        paymentMethod: 'cash',
        notes: 'راتب شهر يونيو'
      }
    ]);

    setDailyExpenses([
      {
        id: 1,
        employeeId: 1,
        employeeName: 'أحمد محمد علي',
        date: '2024-06-19',
        expenseType: 'مواصلات',
        amount: 50,
        description: 'مواصلات زيارة عملاء',
        receiptNumber: 'REC-001',
        status: 'approved',
        approvedBy: 'مجدي عزيز أبو عبدو',
        approvalDate: '2024-06-19'
      },
      {
        id: 2,
        employeeId: 1,
        employeeName: 'أحمد محمد علي',
        date: '2024-06-18',
        expenseType: 'وجبات',
        amount: 75,
        description: 'وجبة غداء مع عميل',
        receiptNumber: 'REC-002',
        status: 'pending',
        approvedBy: null,
        approvalDate: null
      },
      {
        id: 3,
        employeeId: 3,
        employeeName: 'محمد عبد الرحمن',
        date: '2024-06-19',
        expenseType: 'أدوات',
        amount: 120,
        description: 'أدوات تنظيف المخزن',
        receiptNumber: 'REC-003',
        status: 'approved',
        approvedBy: 'مجدي عزيز أبو عبدو',
        approvalDate: '2024-06-19'
      }
    ]);

    setAdvances([
      {
        id: 1,
        employeeId: 1,
        employeeName: 'أحمد محمد علي',
        requestDate: '2024-06-10',
        amount: 500,
        reason: 'ظروف طارئة',
        status: 'approved',
        approvedBy: 'مجدي عزيز أبو عبدو',
        approvalDate: '2024-06-10',
        paymentDate: '2024-06-10',
        paymentMethod: 'cash',
        deductionPlan: 'monthly', // شهري
        deductionAmount: 250,
        remainingAmount: 250,
        notes: 'سلفة طارئة - تخصم على دفعتين'
      },
      {
        id: 2,
        employeeId: 2,
        employeeName: 'فاطمة أحمد حسن',
        requestDate: '2024-06-15',
        amount: 800,
        reason: 'مصاريف تعليم الأطفال',
        status: 'pending',
        approvedBy: null,
        approvalDate: null,
        paymentDate: null,
        paymentMethod: null,
        deductionPlan: 'monthly',
        deductionAmount: 200,
        remainingAmount: 800,
        notes: 'طلب سلفة لمصاريف المدرسة'
      }
    ]);

    setTasks([
      {
        id: 1,
        employeeId: 1,
        employeeName: 'أحمد محمد علي',
        taskTitle: 'زيارة عملاء المنطقة الشرقية',
        description: 'زيارة 5 عملاء في المنطقة الشرقية وتحصيل المستحقات',
        assignedDate: '2024-06-18',
        dueDate: '2024-06-20',
        priority: 'high',
        status: 'in_progress',
        assignedBy: 'مجدي عزيز أبو عبدو',
        completionDate: null,
        completionNotes: null,
        reward: 100
      },
      {
        id: 2,
        employeeId: 3,
        employeeName: 'محمد عبد الرحمن',
        taskTitle: 'جرد المخزن الشهري',
        description: 'إجراء جرد شامل للمخزن وتحديث الكميات',
        assignedDate: '2024-06-15',
        dueDate: '2024-06-25',
        priority: 'medium',
        status: 'completed',
        assignedBy: 'مجدي عزيز أبو عبدو',
        completionDate: '2024-06-19',
        completionNotes: 'تم الجرد بنجاح وتحديث النظام',
        reward: 150
      }
    ]);
  }, []);

  const [newSalary, setNewSalary] = useState({
    employeeId: '',
    month: new Date().toISOString().slice(0, 7),
    baseSalary: '',
    commission: '',
    bonus: '',
    deductions: '',
    advances: '',
    paymentMethod: 'bank',
    notes: ''
  });

  const [newExpense, setNewExpense] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    expenseType: '',
    amount: '',
    description: '',
    receiptNumber: ''
  });

  const [newAdvance, setNewAdvance] = useState({
    employeeId: '',
    amount: '',
    reason: '',
    deductionPlan: 'monthly',
    deductionAmount: '',
    notes: ''
  });

  const [newTask, setNewTask] = useState({
    employeeId: '',
    taskTitle: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    reward: ''
  });

  const calculateNetSalary = () => {
    const base = parseFloat(newSalary.baseSalary) || 0;
    const commission = parseFloat(newSalary.commission) || 0;
    const bonus = parseFloat(newSalary.bonus) || 0;
    const deductions = parseFloat(newSalary.deductions) || 0;
    const advances = parseFloat(newSalary.advances) || 0;
    
    return base + commission + bonus - deductions - advances;
  };

  const handleSaveSalary = () => {
    const employee = employees.find(emp => emp.id === parseInt(newSalary.employeeId));
    const salaryData = {
      ...newSalary,
      id: salaryRecords.length + 1,
      employeeName: employee?.name || '',
      baseSalary: parseFloat(newSalary.baseSalary),
      commission: parseFloat(newSalary.commission) || 0,
      bonus: parseFloat(newSalary.bonus) || 0,
      deductions: parseFloat(newSalary.deductions) || 0,
      advances: parseFloat(newSalary.advances) || 0,
      netSalary: calculateNetSalary(),
      status: 'pending',
      paymentDate: null
    };
    
    setSalaryRecords(prev => [...prev, salaryData]);
    setNewSalary({
      employeeId: '',
      month: new Date().toISOString().slice(0, 7),
      baseSalary: '',
      commission: '',
      bonus: '',
      deductions: '',
      advances: '',
      paymentMethod: 'bank',
      notes: ''
    });
    setShowAddSalary(false);
  };

  const handleSaveExpense = () => {
    const employee = employees.find(emp => emp.id === parseInt(newExpense.employeeId));
    const expenseData = {
      ...newExpense,
      id: dailyExpenses.length + 1,
      employeeName: employee?.name || '',
      amount: parseFloat(newExpense.amount),
      status: 'pending',
      approvedBy: null,
      approvalDate: null
    };
    
    setDailyExpenses(prev => [...prev, expenseData]);
    setNewExpense({
      employeeId: '',
      date: new Date().toISOString().split('T')[0],
      expenseType: '',
      amount: '',
      description: '',
      receiptNumber: ''
    });
    setShowAddExpense(false);
  };

  const handleSaveAdvance = () => {
    const employee = employees.find(emp => emp.id === parseInt(newAdvance.employeeId));
    const advanceData = {
      ...newAdvance,
      id: advances.length + 1,
      employeeName: employee?.name || '',
      requestDate: new Date().toISOString().split('T')[0],
      amount: parseFloat(newAdvance.amount),
      deductionAmount: parseFloat(newAdvance.deductionAmount),
      remainingAmount: parseFloat(newAdvance.amount),
      status: 'pending',
      approvedBy: null,
      approvalDate: null,
      paymentDate: null,
      paymentMethod: null
    };
    
    setAdvances(prev => [...prev, advanceData]);
    setNewAdvance({
      employeeId: '',
      amount: '',
      reason: '',
      deductionPlan: 'monthly',
      deductionAmount: '',
      notes: ''
    });
    setShowAddAdvance(false);
  };

  const handleSaveTask = () => {
    const employee = employees.find(emp => emp.id === parseInt(newTask.employeeId));
    const taskData = {
      ...newTask,
      id: tasks.length + 1,
      employeeName: employee?.name || '',
      assignedDate: new Date().toISOString().split('T')[0],
      reward: parseFloat(newTask.reward) || 0,
      status: 'pending',
      assignedBy: 'مجدي عزيز أبو عبدو',
      completionDate: null,
      completionNotes: null
    };
    
    setTasks(prev => [...prev, taskData]);
    setNewTask({
      employeeId: '',
      taskTitle: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      reward: ''
    });
    setShowAddTask(false);
  };

  const getStatusBadge = (status, type = 'general') => {
    const statusConfigs = {
      general: {
        pending: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
        approved: { label: 'موافق عليه', color: 'bg-green-100 text-green-800' },
        rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800' },
        paid: { label: 'مدفوع', color: 'bg-blue-100 text-blue-800' }
      },
      task: {
        pending: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
        in_progress: { label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800' },
        completed: { label: 'مكتمل', color: 'bg-green-100 text-green-800' },
        cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800' }
      }
    };
    
    const config = statusConfigs[type][status] || statusConfigs.general.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: { label: 'منخفضة', color: 'bg-gray-100 text-gray-800' },
      medium: { label: 'متوسطة', color: 'bg-blue-100 text-blue-800' },
      high: { label: 'عالية', color: 'bg-red-100 text-red-800' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // حساب الإحصائيات
  const totalSalariesThisMonth = salaryRecords
    .filter(record => record.month === new Date().toISOString().slice(0, 7))
    .reduce((total, record) => total + record.netSalary, 0);

  const totalExpensesThisMonth = dailyExpenses
    .filter(expense => expense.date.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((total, expense) => total + expense.amount, 0);

  const totalAdvancesThisMonth = advances
    .filter(advance => advance.requestDate.startsWith(new Date().toISOString().slice(0, 7)))
    .reduce((total, advance) => total + advance.amount, 0);

  const pendingTasks = tasks.filter(task => task.status === 'pending' || task.status === 'in_progress').length;

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المرتبات والمصاريف اليومية</h1>
        <p className="text-gray-600">نظام شامل لإدارة مرتبات الموظفين والمصاريف اليومية والسلف والمهام</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مرتبات هذا الشهر</p>
                <p className="text-2xl font-bold text-blue-600">{totalSalariesThisMonth.toLocaleString()} ج.م</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مصاريف هذا الشهر</p>
                <p className="text-2xl font-bold text-green-600">{totalExpensesThisMonth.toLocaleString()} ج.م</p>
              </div>
              <Receipt className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">سلف هذا الشهر</p>
                <p className="text-2xl font-bold text-orange-600">{totalAdvancesThisMonth.toLocaleString()} ج.م</p>
              </div>
              <PiggyBank className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المهام المعلقة</p>
                <p className="text-2xl font-bold text-purple-600">{pendingTasks}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="salaries">المرتبات</TabsTrigger>
          <TabsTrigger value="expenses">المصاريف اليومية</TabsTrigger>
          <TabsTrigger value="advances">السلف</TabsTrigger>
          <TabsTrigger value="tasks">المهام</TabsTrigger>
        </TabsList>

        <TabsContent value="salaries" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  سجل المرتبات
                </CardTitle>
                <Dialog open={showAddSalary} onOpenChange={setShowAddSalary}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة راتب
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة راتب جديد</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="employee">الموظف</Label>
                          <Select value={newSalary.employeeId} onValueChange={(value) => {
                            const employee = employees.find(emp => emp.id === parseInt(value));
                            setNewSalary(prev => ({ 
                              ...prev, 
                              employeeId: value,
                              baseSalary: employee ? employee.baseSalary.toString() : ''
                            }));
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الموظف" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map(employee => (
                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                  {employee.name} - {employee.position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="month">الشهر</Label>
                          <Input
                            id="month"
                            type="month"
                            value={newSalary.month}
                            onChange={(e) => setNewSalary(prev => ({ ...prev, month: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="baseSalary">الراتب الأساسي</Label>
                          <Input
                            id="baseSalary"
                            type="number"
                            value={newSalary.baseSalary}
                            onChange={(e) => setNewSalary(prev => ({ ...prev, baseSalary: e.target.value }))}
                            placeholder="الراتب الأساسي"
                          />
                        </div>

                        <div>
                          <Label htmlFor="commission">العمولة</Label>
                          <Input
                            id="commission"
                            type="number"
                            value={newSalary.commission}
                            onChange={(e) => setNewSalary(prev => ({ ...prev, commission: e.target.value }))}
                            placeholder="العمولة"
                          />
                        </div>

                        <div>
                          <Label htmlFor="bonus">المكافآت</Label>
                          <Input
                            id="bonus"
                            type="number"
                            value={newSalary.bonus}
                            onChange={(e) => setNewSalary(prev => ({ ...prev, bonus: e.target.value }))}
                            placeholder="المكافآت"
                          />
                        </div>

                        <div>
                          <Label htmlFor="deductions">الخصومات</Label>
                          <Input
                            id="deductions"
                            type="number"
                            value={newSalary.deductions}
                            onChange={(e) => setNewSalary(prev => ({ ...prev, deductions: e.target.value }))}
                            placeholder="الخصومات"
                          />
                        </div>

                        <div>
                          <Label htmlFor="advances">السلف المخصومة</Label>
                          <Input
                            id="advances"
                            type="number"
                            value={newSalary.advances}
                            onChange={(e) => setNewSalary(prev => ({ ...prev, advances: e.target.value }))}
                            placeholder="السلف المخصومة"
                          />
                        </div>

                        <div>
                          <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                          <Select value={newSalary.paymentMethod} onValueChange={(value) => setNewSalary(prev => ({ ...prev, paymentMethod: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">نقدي - خزنة</SelectItem>
                              <SelectItem value="bank">بنك</SelectItem>
                              <SelectItem value="wallet">محفظة إلكترونية</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notes">ملاحظات</Label>
                        <Textarea
                          id="notes"
                          value={newSalary.notes}
                          onChange={(e) => setNewSalary(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="ملاحظات إضافية"
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>صافي الراتب:</span>
                          <span className="text-green-600">{calculateNetSalary().toFixed(2)} ج.م</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddSalary(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSaveSalary}>
                          حفظ الراتب
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الموظف</TableHead>
                      <TableHead>الشهر</TableHead>
                      <TableHead>الراتب الأساسي</TableHead>
                      <TableHead>العمولة</TableHead>
                      <TableHead>المكافآت</TableHead>
                      <TableHead>الخصومات</TableHead>
                      <TableHead>صافي الراتب</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaryRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                        <TableCell>{record.month}</TableCell>
                        <TableCell>{record.baseSalary.toLocaleString()} ج.م</TableCell>
                        <TableCell>{record.commission.toLocaleString()} ج.م</TableCell>
                        <TableCell>{record.bonus.toLocaleString()} ج.م</TableCell>
                        <TableCell>{(record.deductions + record.advances).toLocaleString()} ج.م</TableCell>
                        <TableCell className="font-bold text-green-600">{record.netSalary.toLocaleString()} ج.م</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  المصاريف اليومية
                </CardTitle>
                <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة مصروف
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة مصروف يومي</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expenseEmployee">الموظف</Label>
                          <Select value={newExpense.employeeId} onValueChange={(value) => setNewExpense(prev => ({ ...prev, employeeId: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الموظف" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map(employee => (
                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                  {employee.name} - {employee.position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="expenseDate">التاريخ</Label>
                          <Input
                            id="expenseDate"
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="expenseType">نوع المصروف</Label>
                          <Select value={newExpense.expenseType} onValueChange={(value) => setNewExpense(prev => ({ ...prev, expenseType: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع المصروف" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="مواصلات">مواصلات</SelectItem>
                              <SelectItem value="وجبات">وجبات</SelectItem>
                              <SelectItem value="أدوات">أدوات</SelectItem>
                              <SelectItem value="اتصالات">اتصالات</SelectItem>
                              <SelectItem value="صيانة">صيانة</SelectItem>
                              <SelectItem value="أخرى">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="expenseAmount">المبلغ</Label>
                          <Input
                            id="expenseAmount"
                            type="number"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="المبلغ"
                          />
                        </div>

                        <div>
                          <Label htmlFor="receiptNumber">رقم الإيصال</Label>
                          <Input
                            id="receiptNumber"
                            value={newExpense.receiptNumber}
                            onChange={(e) => setNewExpense(prev => ({ ...prev, receiptNumber: e.target.value }))}
                            placeholder="رقم الإيصال"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="expenseDescription">الوصف</Label>
                        <Textarea
                          id="expenseDescription"
                          value={newExpense.description}
                          onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="وصف تفصيلي للمصروف"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddExpense(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSaveExpense}>
                          حفظ المصروف
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الموظف</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الوصف</TableHead>
                      <TableHead>رقم الإيصال</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.employeeName}</TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.expenseType}</TableCell>
                        <TableCell>{expense.amount.toLocaleString()} ج.م</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.receiptNumber}</TableCell>
                        <TableCell>{getStatusBadge(expense.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advances" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  السلف
                </CardTitle>
                <Dialog open={showAddAdvance} onOpenChange={setShowAddAdvance}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة سلفة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة طلب سلفة</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="advanceEmployee">الموظف</Label>
                          <Select value={newAdvance.employeeId} onValueChange={(value) => setNewAdvance(prev => ({ ...prev, employeeId: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الموظف" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map(employee => (
                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                  {employee.name} - {employee.position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="advanceAmount">مبلغ السلفة</Label>
                          <Input
                            id="advanceAmount"
                            type="number"
                            value={newAdvance.amount}
                            onChange={(e) => setNewAdvance(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="مبلغ السلفة"
                          />
                        </div>

                        <div>
                          <Label htmlFor="deductionPlan">خطة الخصم</Label>
                          <Select value={newAdvance.deductionPlan} onValueChange={(value) => setNewAdvance(prev => ({ ...prev, deductionPlan: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">شهري</SelectItem>
                              <SelectItem value="weekly">أسبوعي</SelectItem>
                              <SelectItem value="lump_sum">دفعة واحدة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="deductionAmount">مبلغ الخصم</Label>
                          <Input
                            id="deductionAmount"
                            type="number"
                            value={newAdvance.deductionAmount}
                            onChange={(e) => setNewAdvance(prev => ({ ...prev, deductionAmount: e.target.value }))}
                            placeholder="مبلغ الخصم"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="advanceReason">سبب السلفة</Label>
                        <Textarea
                          id="advanceReason"
                          value={newAdvance.reason}
                          onChange={(e) => setNewAdvance(prev => ({ ...prev, reason: e.target.value }))}
                          placeholder="سبب طلب السلفة"
                        />
                      </div>

                      <div>
                        <Label htmlFor="advanceNotes">ملاحظات</Label>
                        <Textarea
                          id="advanceNotes"
                          value={newAdvance.notes}
                          onChange={(e) => setNewAdvance(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="ملاحظات إضافية"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddAdvance(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSaveAdvance}>
                          حفظ طلب السلفة
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الموظف</TableHead>
                      <TableHead>تاريخ الطلب</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>السبب</TableHead>
                      <TableHead>المتبقي</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {advances.map((advance) => (
                      <TableRow key={advance.id}>
                        <TableCell className="font-medium">{advance.employeeName}</TableCell>
                        <TableCell>{advance.requestDate}</TableCell>
                        <TableCell>{advance.amount.toLocaleString()} ج.م</TableCell>
                        <TableCell>{advance.reason}</TableCell>
                        <TableCell>{advance.remainingAmount.toLocaleString()} ج.م</TableCell>
                        <TableCell>{getStatusBadge(advance.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  المهام
                </CardTitle>
                <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة مهمة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة مهمة جديدة</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="taskEmployee">الموظف</Label>
                          <Select value={newTask.employeeId} onValueChange={(value) => setNewTask(prev => ({ ...prev, employeeId: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الموظف" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map(employee => (
                                <SelectItem key={employee.id} value={employee.id.toString()}>
                                  {employee.name} - {employee.position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="taskTitle">عنوان المهمة</Label>
                          <Input
                            id="taskTitle"
                            value={newTask.taskTitle}
                            onChange={(e) => setNewTask(prev => ({ ...prev, taskTitle: e.target.value }))}
                            placeholder="عنوان المهمة"
                          />
                        </div>

                        <div>
                          <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="priority">الأولوية</Label>
                          <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">منخفضة</SelectItem>
                              <SelectItem value="medium">متوسطة</SelectItem>
                              <SelectItem value="high">عالية</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="reward">المكافأة</Label>
                          <Input
                            id="reward"
                            type="number"
                            value={newTask.reward}
                            onChange={(e) => setNewTask(prev => ({ ...prev, reward: e.target.value }))}
                            placeholder="مكافأة إنجاز المهمة"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="taskDescription">وصف المهمة</Label>
                        <Textarea
                          id="taskDescription"
                          value={newTask.description}
                          onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="وصف تفصيلي للمهمة"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddTask(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSaveTask}>
                          حفظ المهمة
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الموظف</TableHead>
                      <TableHead>عنوان المهمة</TableHead>
                      <TableHead>تاريخ الاستحقاق</TableHead>
                      <TableHead>الأولوية</TableHead>
                      <TableHead>المكافأة</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.employeeName}</TableCell>
                        <TableCell>{task.taskTitle}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>{task.reward.toLocaleString()} ج.م</TableCell>
                        <TableCell>{getStatusBadge(task.status, 'task')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeSalaryAndExpenseManagement;

