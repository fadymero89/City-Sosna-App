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
  ShoppingCart, 
  Package, 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const PurchaseManagement = () => {
  const [activeTab, setActiveTab] = useState('purchases');
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);

  // بيانات تجريبية للمشتريات
  useEffect(() => {
    setPurchases([
      {
        id: 1,
        invoiceNumber: 'PUR-001',
        supplier: 'شركة الألومنيوم المصرية',
        date: '2024-06-15',
        totalAmount: 15000,
        paidAmount: 10000,
        remainingAmount: 5000,
        status: 'partial',
        paymentMethod: 'bank',
        items: [
          { name: 'ألومنيوم خام', quantity: 100, unit: 'كيلو', price: 120, total: 12000 },
          { name: 'مواعين ألومنيوم', quantity: 50, unit: 'طقم', price: 60, total: 3000 }
        ]
      },
      {
        id: 2,
        invoiceNumber: 'PUR-002',
        supplier: 'مصنع النور للأدوات المنزلية',
        date: '2024-06-18',
        totalAmount: 8500,
        paidAmount: 8500,
        remainingAmount: 0,
        status: 'paid',
        paymentMethod: 'cash',
        items: [
          { name: 'أطباق بلاستيك', quantity: 200, unit: 'قطعة', price: 25, total: 5000 },
          { name: 'أكواب زجاج', quantity: 100, unit: 'قطعة', price: 35, total: 3500 }
        ]
      }
    ]);

    setSuppliers([
      {
        id: 1,
        name: 'شركة الألومنيوم المصرية',
        contactPerson: 'أحمد محمد',
        phone: '01234567890',
        address: 'القاهرة - مصر الجديدة',
        email: 'info@aluminum-egypt.com',
        totalPurchases: 45000,
        outstandingBalance: 5000,
        rating: 4.5,
        category: 'ألومنيوم'
      },
      {
        id: 2,
        name: 'مصنع النور للأدوات المنزلية',
        contactPerson: 'فاطمة أحمد',
        phone: '01098765432',
        address: 'الإسكندرية - سموحة',
        email: 'sales@alnour-factory.com',
        totalPurchases: 32000,
        outstandingBalance: 0,
        rating: 4.8,
        category: 'أدوات منزلية'
      }
    ]);
  }, []);

  const [newPurchase, setNewPurchase] = useState({
    supplier: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    notes: '',
    items: [{ name: '', quantity: '', unit: 'قطعة', price: '', total: 0 }]
  });

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    address: '',
    email: '',
    category: '',
    notes: ''
  });

  const addItemToPurchase = () => {
    setNewPurchase(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '', unit: 'قطعة', price: '', total: 0 }]
    }));
  };

  const updatePurchaseItem = (index, field, value) => {
    const updatedItems = [...newPurchase.items];
    updatedItems[index][field] = value;
    
    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(updatedItems[index].quantity) || 0;
      const price = parseFloat(updatedItems[index].price) || 0;
      updatedItems[index].total = quantity * price;
    }
    
    setNewPurchase(prev => ({ ...prev, items: updatedItems }));
  };

  const removePurchaseItem = (index) => {
    if (newPurchase.items.length > 1) {
      setNewPurchase(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculatePurchaseTotal = () => {
    return newPurchase.items.reduce((total, item) => total + (item.total || 0), 0);
  };

  const handleSavePurchase = () => {
    const purchaseData = {
      ...newPurchase,
      id: purchases.length + 1,
      totalAmount: calculatePurchaseTotal(),
      paidAmount: 0,
      remainingAmount: calculatePurchaseTotal(),
      status: 'pending'
    };
    
    setPurchases(prev => [...prev, purchaseData]);
    setNewPurchase({
      supplier: '',
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      notes: '',
      items: [{ name: '', quantity: '', unit: 'قطعة', price: '', total: 0 }]
    });
    setShowAddPurchase(false);
  };

  const handleSaveSupplier = () => {
    const supplierData = {
      ...newSupplier,
      id: suppliers.length + 1,
      totalPurchases: 0,
      outstandingBalance: 0,
      rating: 0
    };
    
    setSuppliers(prev => [...prev, supplierData]);
    setNewSupplier({
      name: '',
      contactPerson: '',
      phone: '',
      address: '',
      email: '',
      category: '',
      notes: ''
    });
    setShowAddSupplier(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'معلق', variant: 'secondary' },
      partial: { label: 'مدفوع جزئياً', variant: 'default' },
      paid: { label: 'مدفوع', variant: 'default' },
      overdue: { label: 'متأخر', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || purchase.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المشتريات والموردين</h1>
        <p className="text-gray-600">إدارة شاملة للمشتريات والموردين مع تتبع المدفوعات والمخزون</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي المشتريات</p>
                <p className="text-2xl font-bold text-blue-600">77,500 ج.م</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">المبالغ المستحقة</p>
                <p className="text-2xl font-bold text-red-600">5,000 ج.م</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">عدد الموردين</p>
                <p className="text-2xl font-bold text-green-600">{suppliers.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">مشتريات هذا الشهر</p>
                <p className="text-2xl font-bold text-purple-600">23,500 ج.م</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="purchases">المشتريات</TabsTrigger>
          <TabsTrigger value="suppliers">الموردين</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  قائمة المشتريات
                </CardTitle>
                <Dialog open={showAddPurchase} onOpenChange={setShowAddPurchase}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة مشترى جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة مشترى جديد</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="supplier">المورد</Label>
                          <Select value={newPurchase.supplier} onValueChange={(value) => setNewPurchase(prev => ({ ...prev, supplier: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المورد" />
                            </SelectTrigger>
                            <SelectContent>
                              {suppliers.map(supplier => (
                                <SelectItem key={supplier.id} value={supplier.name}>
                                  {supplier.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="invoiceNumber">رقم الفاتورة</Label>
                          <Input
                            id="invoiceNumber"
                            value={newPurchase.invoiceNumber}
                            onChange={(e) => setNewPurchase(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                            placeholder="رقم الفاتورة"
                          />
                        </div>

                        <div>
                          <Label htmlFor="date">تاريخ الشراء</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newPurchase.date}
                            onChange={(e) => setNewPurchase(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                          <Select value={newPurchase.paymentMethod} onValueChange={(value) => setNewPurchase(prev => ({ ...prev, paymentMethod: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">نقدي - خزنة</SelectItem>
                              <SelectItem value="bank">بنك</SelectItem>
                              <SelectItem value="wallet">محفظة إلكترونية</SelectItem>
                              <SelectItem value="credit">آجل</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label>الأصناف</Label>
                        <div className="space-y-2">
                          {newPurchase.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-6 gap-2 items-end">
                              <div>
                                <Input
                                  placeholder="اسم الصنف"
                                  value={item.name}
                                  onChange={(e) => updatePurchaseItem(index, 'name', e.target.value)}
                                />
                              </div>
                              <div>
                                <Input
                                  type="number"
                                  placeholder="الكمية"
                                  value={item.quantity}
                                  onChange={(e) => updatePurchaseItem(index, 'quantity', e.target.value)}
                                />
                              </div>
                              <div>
                                <Select value={item.unit} onValueChange={(value) => updatePurchaseItem(index, 'unit', value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="قطعة">قطعة</SelectItem>
                                    <SelectItem value="كيلو">كيلو</SelectItem>
                                    <SelectItem value="طقم">طقم</SelectItem>
                                    <SelectItem value="عبوة">عبوة</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Input
                                  type="number"
                                  placeholder="السعر"
                                  value={item.price}
                                  onChange={(e) => updatePurchaseItem(index, 'price', e.target.value)}
                                />
                              </div>
                              <div>
                                <Input
                                  value={item.total.toFixed(2)}
                                  readOnly
                                  className="bg-gray-100"
                                />
                              </div>
                              <div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removePurchaseItem(index)}
                                  disabled={newPurchase.items.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addItemToPurchase}
                          className="mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          إضافة صنف
                        </Button>
                      </div>

                      <div>
                        <Label htmlFor="notes">ملاحظات</Label>
                        <Textarea
                          id="notes"
                          value={newPurchase.notes}
                          onChange={(e) => setNewPurchase(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="ملاحظات إضافية"
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center text-lg font-bold">
                          <span>الإجمالي:</span>
                          <span>{calculatePurchaseTotal().toFixed(2)} ج.م</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddPurchase(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSavePurchase}>
                          حفظ المشترى
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="البحث في المشتريات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="pending">معلق</SelectItem>
                    <SelectItem value="partial">مدفوع جزئياً</SelectItem>
                    <SelectItem value="paid">مدفوع</SelectItem>
                    <SelectItem value="overdue">متأخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم الفاتورة</TableHead>
                      <TableHead>المورد</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المبلغ الإجمالي</TableHead>
                      <TableHead>المدفوع</TableHead>
                      <TableHead>المتبقي</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.invoiceNumber}</TableCell>
                        <TableCell>{purchase.supplier}</TableCell>
                        <TableCell>{purchase.date}</TableCell>
                        <TableCell>{purchase.totalAmount.toLocaleString()} ج.م</TableCell>
                        <TableCell>{purchase.paidAmount.toLocaleString()} ج.م</TableCell>
                        <TableCell>{purchase.remainingAmount.toLocaleString()} ج.م</TableCell>
                        <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
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

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  قائمة الموردين
                </CardTitle>
                <Dialog open={showAddSupplier} onOpenChange={setShowAddSupplier}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة مورد جديد
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة مورد جديد</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="supplierName">اسم المورد</Label>
                          <Input
                            id="supplierName"
                            value={newSupplier.name}
                            onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="اسم المورد"
                          />
                        </div>

                        <div>
                          <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                          <Input
                            id="contactPerson"
                            value={newSupplier.contactPerson}
                            onChange={(e) => setNewSupplier(prev => ({ ...prev, contactPerson: e.target.value }))}
                            placeholder="اسم الشخص المسؤول"
                          />
                        </div>

                        <div>
                          <Label htmlFor="supplierPhone">رقم الهاتف</Label>
                          <Input
                            id="supplierPhone"
                            value={newSupplier.phone}
                            onChange={(e) => setNewSupplier(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="رقم الهاتف"
                          />
                        </div>

                        <div>
                          <Label htmlFor="supplierEmail">البريد الإلكتروني</Label>
                          <Input
                            id="supplierEmail"
                            type="email"
                            value={newSupplier.email}
                            onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="البريد الإلكتروني"
                          />
                        </div>

                        <div>
                          <Label htmlFor="supplierCategory">فئة المورد</Label>
                          <Select value={newSupplier.category} onValueChange={(value) => setNewSupplier(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الفئة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ألومنيوم">ألومنيوم</SelectItem>
                              <SelectItem value="أدوات منزلية">أدوات منزلية</SelectItem>
                              <SelectItem value="بلاستيك">بلاستيك</SelectItem>
                              <SelectItem value="زجاج">زجاج</SelectItem>
                              <SelectItem value="معادن">معادن</SelectItem>
                              <SelectItem value="أخرى">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="supplierAddress">العنوان</Label>
                        <Textarea
                          id="supplierAddress"
                          value={newSupplier.address}
                          onChange={(e) => setNewSupplier(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="العنوان الكامل"
                        />
                      </div>

                      <div>
                        <Label htmlFor="supplierNotes">ملاحظات</Label>
                        <Textarea
                          id="supplierNotes"
                          value={newSupplier.notes}
                          onChange={(e) => setNewSupplier(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="ملاحظات إضافية"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddSupplier(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSaveSupplier}>
                          حفظ المورد
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="البحث في الموردين..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSuppliers.map((supplier) => (
                  <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{supplier.name}</h3>
                          <Badge variant="outline">{supplier.category}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>المسؤول:</strong> {supplier.contactPerson}</p>
                          <p><strong>الهاتف:</strong> {supplier.phone}</p>
                          <p><strong>العنوان:</strong> {supplier.address}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-blue-50 p-2 rounded">
                            <p className="text-blue-600 font-medium">إجمالي المشتريات</p>
                            <p className="font-bold">{supplier.totalPurchases.toLocaleString()} ج.م</p>
                          </div>
                          <div className="bg-red-50 p-2 rounded">
                            <p className="text-red-600 font-medium">المستحق</p>
                            <p className="font-bold">{supplier.outstandingBalance.toLocaleString()} ج.م</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm">{supplier.rating}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseManagement;

