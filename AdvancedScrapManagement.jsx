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
  Recycle, 
  Scale, 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Calculator,
  Package,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdvancedScrapManagement = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [scrapTransactions, setScrapTransactions] = useState([]);
  const [scrapTypes, setScrapTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddScrapType, setShowAddScrapType] = useState(false);

  // بيانات تجريبية لأنواع الخردة
  useEffect(() => {
    setScrapTypes([
      {
        id: 1,
        name: 'ألومنيوم خردة',
        category: 'معادن',
        currentPrice: 45,
        unit: 'كيلو',
        description: 'خردة ألومنيوم نظيفة',
        minQuantity: 5,
        maxQuantity: 1000,
        isActive: true
      },
      {
        id: 2,
        name: 'نحاس خردة',
        category: 'معادن',
        currentPrice: 120,
        unit: 'كيلو',
        description: 'خردة نحاس عالية الجودة',
        minQuantity: 1,
        maxQuantity: 500,
        isActive: true
      },
      {
        id: 3,
        name: 'حديد خردة',
        category: 'معادن',
        currentPrice: 8,
        unit: 'كيلو',
        description: 'خردة حديد مختلطة',
        minQuantity: 10,
        maxQuantity: 2000,
        isActive: true
      },
      {
        id: 4,
        name: 'بلاستيك مختلط',
        category: 'بلاستيك',
        currentPrice: 3,
        unit: 'كيلو',
        description: 'خردة بلاستيك متنوعة',
        minQuantity: 5,
        maxQuantity: 500,
        isActive: true
      }
    ]);

    setScrapTransactions([
      {
        id: 1,
        transactionNumber: 'SCR-001',
        type: 'purchase', // شراء خردة
        customerSupplier: 'أحمد محمد علي',
        customerType: 'customer',
        date: '2024-06-15',
        scrapType: 'ألومنيوم خردة',
        quantity: 25,
        unit: 'كيلو',
        pricePerUnit: 45,
        totalValue: 1125,
        exchangeType: 'cash', // نقدي
        paymentMethod: 'cash',
        status: 'completed',
        notes: 'خردة ألومنيوم نظيفة من العميل',
        weighingSlip: 'WS-001'
      },
      {
        id: 2,
        transactionNumber: 'SCR-002',
        type: 'exchange', // مقايضة
        customerSupplier: 'فاطمة أحمد',
        customerType: 'customer',
        date: '2024-06-16',
        scrapType: 'نحاس خردة',
        quantity: 8,
        unit: 'كيلو',
        pricePerUnit: 120,
        totalValue: 960,
        exchangeType: 'products', // مقابل بضاعة
        exchangedProducts: [
          { name: 'طقم مواعين ألومنيوم', quantity: 2, price: 400, total: 800 },
          { name: 'مقلاة ألومنيوم', quantity: 1, price: 160, total: 160 }
        ],
        exchangeBalance: 0, // متوازن
        status: 'completed',
        notes: 'مقايضة خردة نحاس مقابل مواعين',
        weighingSlip: 'WS-002'
      },
      {
        id: 3,
        transactionNumber: 'SCR-003',
        type: 'sale', // بيع خردة
        customerSupplier: 'شركة إعادة التدوير المصرية',
        customerType: 'supplier',
        date: '2024-06-18',
        scrapType: 'حديد خردة',
        quantity: 150,
        unit: 'كيلو',
        pricePerUnit: 8,
        totalValue: 1200,
        exchangeType: 'cash',
        paymentMethod: 'bank',
        status: 'pending',
        notes: 'بيع خردة حديد لشركة إعادة التدوير',
        weighingSlip: 'WS-003'
      }
    ]);
  }, []);

  const [newTransaction, setNewTransaction] = useState({
    type: 'purchase',
    customerSupplier: '',
    customerType: 'customer',
    date: new Date().toISOString().split('T')[0],
    scrapType: '',
    quantity: '',
    unit: 'كيلو',
    pricePerUnit: '',
    exchangeType: 'cash',
    paymentMethod: 'cash',
    notes: '',
    exchangedProducts: []
  });

  const [newScrapType, setNewScrapType] = useState({
    name: '',
    category: '',
    currentPrice: '',
    unit: 'كيلو',
    description: '',
    minQuantity: '',
    maxQuantity: '',
    isActive: true
  });

  const calculateTransactionTotal = () => {
    const quantity = parseFloat(newTransaction.quantity) || 0;
    const price = parseFloat(newTransaction.pricePerUnit) || 0;
    return quantity * price;
  };

  const addExchangedProduct = () => {
    setNewTransaction(prev => ({
      ...prev,
      exchangedProducts: [...prev.exchangedProducts, { name: '', quantity: '', price: '', total: 0 }]
    }));
  };

  const updateExchangedProduct = (index, field, value) => {
    const updatedProducts = [...newTransaction.exchangedProducts];
    updatedProducts[index][field] = value;
    
    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(updatedProducts[index].quantity) || 0;
      const price = parseFloat(updatedProducts[index].price) || 0;
      updatedProducts[index].total = quantity * price;
    }
    
    setNewTransaction(prev => ({ ...prev, exchangedProducts: updatedProducts }));
  };

  const removeExchangedProduct = (index) => {
    setNewTransaction(prev => ({
      ...prev,
      exchangedProducts: prev.exchangedProducts.filter((_, i) => i !== index)
    }));
  };

  const calculateExchangeTotal = () => {
    return newTransaction.exchangedProducts.reduce((total, product) => total + (product.total || 0), 0);
  };

  const calculateExchangeBalance = () => {
    const scrapValue = calculateTransactionTotal();
    const productsValue = calculateExchangeTotal();
    return scrapValue - productsValue;
  };

  const handleSaveTransaction = () => {
    const transactionData = {
      ...newTransaction,
      id: scrapTransactions.length + 1,
      transactionNumber: `SCR-${String(scrapTransactions.length + 1).padStart(3, '0')}`,
      totalValue: calculateTransactionTotal(),
      exchangeBalance: newTransaction.exchangeType === 'products' ? calculateExchangeBalance() : 0,
      status: 'completed',
      weighingSlip: `WS-${String(scrapTransactions.length + 1).padStart(3, '0')}`
    };
    
    setScrapTransactions(prev => [...prev, transactionData]);
    setNewTransaction({
      type: 'purchase',
      customerSupplier: '',
      customerType: 'customer',
      date: new Date().toISOString().split('T')[0],
      scrapType: '',
      quantity: '',
      unit: 'كيلو',
      pricePerUnit: '',
      exchangeType: 'cash',
      paymentMethod: 'cash',
      notes: '',
      exchangedProducts: []
    });
    setShowAddTransaction(false);
  };

  const handleSaveScrapType = () => {
    const scrapTypeData = {
      ...newScrapType,
      id: scrapTypes.length + 1,
      currentPrice: parseFloat(newScrapType.currentPrice),
      minQuantity: parseFloat(newScrapType.minQuantity),
      maxQuantity: parseFloat(newScrapType.maxQuantity)
    };
    
    setScrapTypes(prev => [...prev, scrapTypeData]);
    setNewScrapType({
      name: '',
      category: '',
      currentPrice: '',
      unit: 'كيلو',
      description: '',
      minQuantity: '',
      maxQuantity: '',
      isActive: true
    });
    setShowAddScrapType(false);
  };

  const getTransactionTypeBadge = (type) => {
    const typeConfig = {
      purchase: { label: 'شراء خردة', variant: 'default', color: 'bg-blue-100 text-blue-800' },
      sale: { label: 'بيع خردة', variant: 'secondary', color: 'bg-green-100 text-green-800' },
      exchange: { label: 'مقايضة', variant: 'outline', color: 'bg-purple-100 text-purple-800' }
    };
    
    const config = typeConfig[type] || typeConfig.purchase;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: 'مكتمل', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
      pending: { label: 'معلق', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'ملغي', icon: AlertCircle, color: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredTransactions = scrapTransactions.filter(transaction => {
    const matchesSearch = transaction.customerSupplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.scrapType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredScrapTypes = scrapTypes.filter(scrapType =>
    scrapType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scrapType.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // حساب الإحصائيات
  const totalScrapValue = scrapTransactions.reduce((total, transaction) => {
    if (transaction.type === 'purchase') return total + transaction.totalValue;
    return total;
  }, 0);

  const totalScrapSold = scrapTransactions.reduce((total, transaction) => {
    if (transaction.type === 'sale') return total + transaction.totalValue;
    return total;
  }, 0);

  const totalExchangeValue = scrapTransactions.reduce((total, transaction) => {
    if (transaction.type === 'exchange') return total + transaction.totalValue;
    return total;
  }, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الخردة المتقدمة</h1>
        <p className="text-gray-600">نظام شامل لإدارة خردة الألومنيوم والمعادن مع دعم المقايضة والتبادل</p>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي شراء الخردة</p>
                <p className="text-2xl font-bold text-blue-600">{totalScrapValue.toLocaleString()} ج.م</p>
              </div>
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي بيع الخردة</p>
                <p className="text-2xl font-bold text-green-600">{totalScrapSold.toLocaleString()} ج.م</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">قيمة المقايضات</p>
                <p className="text-2xl font-bold text-purple-600">{totalExchangeValue.toLocaleString()} ج.م</p>
              </div>
              <Recycle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">أنواع الخردة</p>
                <p className="text-2xl font-bold text-orange-600">{scrapTypes.length}</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">معاملات الخردة</TabsTrigger>
          <TabsTrigger value="types">أنواع الخردة</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="h-5 w-5" />
                  معاملات الخردة
                </CardTitle>
                <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة معاملة خردة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة معاملة خردة جديدة</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="transactionType">نوع المعاملة</Label>
                          <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="purchase">شراء خردة</SelectItem>
                              <SelectItem value="sale">بيع خردة</SelectItem>
                              <SelectItem value="exchange">مقايضة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="customerType">نوع الطرف</Label>
                          <Select value={newTransaction.customerType} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, customerType: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">عميل</SelectItem>
                              <SelectItem value="supplier">مورد</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="customerSupplier">اسم العميل/المورد</Label>
                          <Input
                            id="customerSupplier"
                            value={newTransaction.customerSupplier}
                            onChange={(e) => setNewTransaction(prev => ({ ...prev, customerSupplier: e.target.value }))}
                            placeholder="اسم العميل أو المورد"
                          />
                        </div>

                        <div>
                          <Label htmlFor="transactionDate">تاريخ المعاملة</Label>
                          <Input
                            id="transactionDate"
                            type="date"
                            value={newTransaction.date}
                            onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label htmlFor="scrapType">نوع الخردة</Label>
                          <Select value={newTransaction.scrapType} onValueChange={(value) => {
                            const selectedType = scrapTypes.find(type => type.name === value);
                            setNewTransaction(prev => ({ 
                              ...prev, 
                              scrapType: value,
                              pricePerUnit: selectedType ? selectedType.currentPrice.toString() : '',
                              unit: selectedType ? selectedType.unit : 'كيلو'
                            }));
                          }}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع الخردة" />
                            </SelectTrigger>
                            <SelectContent>
                              {scrapTypes.map(type => (
                                <SelectItem key={type.id} value={type.name}>
                                  {type.name} - {type.currentPrice} ج.م/{type.unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="quantity">الكمية</Label>
                          <Input
                            id="quantity"
                            type="number"
                            value={newTransaction.quantity}
                            onChange={(e) => setNewTransaction(prev => ({ ...prev, quantity: e.target.value }))}
                            placeholder="الكمية"
                          />
                        </div>

                        <div>
                          <Label htmlFor="pricePerUnit">السعر لكل وحدة</Label>
                          <Input
                            id="pricePerUnit"
                            type="number"
                            value={newTransaction.pricePerUnit}
                            onChange={(e) => setNewTransaction(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                            placeholder="السعر لكل وحدة"
                          />
                        </div>

                        <div>
                          <Label htmlFor="exchangeType">نوع التبادل</Label>
                          <Select value={newTransaction.exchangeType} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, exchangeType: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">نقدي</SelectItem>
                              <SelectItem value="products">مقابل بضاعة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {newTransaction.exchangeType === 'cash' && (
                          <div>
                            <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                            <Select value={newTransaction.paymentMethod} onValueChange={(value) => setNewTransaction(prev => ({ ...prev, paymentMethod: value }))}>
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
                        )}
                      </div>

                      {newTransaction.exchangeType === 'products' && (
                        <div>
                          <Label>البضائع المتبادلة</Label>
                          <div className="space-y-2">
                            {newTransaction.exchangedProducts.map((product, index) => (
                              <div key={index} className="grid grid-cols-5 gap-2 items-end">
                                <div>
                                  <Input
                                    placeholder="اسم المنتج"
                                    value={product.name}
                                    onChange={(e) => updateExchangedProduct(index, 'name', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    placeholder="الكمية"
                                    value={product.quantity}
                                    onChange={(e) => updateExchangedProduct(index, 'quantity', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    placeholder="السعر"
                                    value={product.price}
                                    onChange={(e) => updateExchangedProduct(index, 'price', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Input
                                    value={product.total.toFixed(2)}
                                    readOnly
                                    className="bg-gray-100"
                                  />
                                </div>
                                <div>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeExchangedProduct(index)}
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
                            onClick={addExchangedProduct}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            إضافة منتج
                          </Button>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="notes">ملاحظات</Label>
                        <Textarea
                          id="notes"
                          value={newTransaction.notes}
                          onChange={(e) => setNewTransaction(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="ملاحظات إضافية"
                        />
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">قيمة الخردة:</span>
                          <span className="font-bold">{calculateTransactionTotal().toFixed(2)} ج.م</span>
                        </div>
                        {newTransaction.exchangeType === 'products' && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="font-medium">قيمة البضائع:</span>
                              <span className="font-bold">{calculateExchangeTotal().toFixed(2)} ج.م</span>
                            </div>
                            <div className="flex justify-between items-center text-lg">
                              <span className="font-bold">الرصيد:</span>
                              <span className={`font-bold ${calculateExchangeBalance() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {calculateExchangeBalance().toFixed(2)} ج.م
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddTransaction(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSaveTransaction}>
                          حفظ المعاملة
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
                      placeholder="البحث في معاملات الخردة..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الأنواع</SelectItem>
                    <SelectItem value="purchase">شراء خردة</SelectItem>
                    <SelectItem value="sale">بيع خردة</SelectItem>
                    <SelectItem value="exchange">مقايضة</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                    <SelectItem value="pending">معلق</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>رقم المعاملة</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>العميل/المورد</TableHead>
                      <TableHead>نوع الخردة</TableHead>
                      <TableHead>الكمية</TableHead>
                      <TableHead>القيمة</TableHead>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.transactionNumber}</TableCell>
                        <TableCell>{getTransactionTypeBadge(transaction.type)}</TableCell>
                        <TableCell>{transaction.customerSupplier}</TableCell>
                        <TableCell>{transaction.scrapType}</TableCell>
                        <TableCell>{transaction.quantity} {transaction.unit}</TableCell>
                        <TableCell>{transaction.totalValue.toLocaleString()} ج.م</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
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

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  أنواع الخردة
                </CardTitle>
                <Dialog open={showAddScrapType} onOpenChange={setShowAddScrapType}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      إضافة نوع خردة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>إضافة نوع خردة جديد</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="scrapName">اسم نوع الخردة</Label>
                          <Input
                            id="scrapName"
                            value={newScrapType.name}
                            onChange={(e) => setNewScrapType(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="اسم نوع الخردة"
                          />
                        </div>

                        <div>
                          <Label htmlFor="scrapCategory">الفئة</Label>
                          <Select value={newScrapType.category} onValueChange={(value) => setNewScrapType(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر الفئة" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="معادن">معادن</SelectItem>
                              <SelectItem value="بلاستيك">بلاستيك</SelectItem>
                              <SelectItem value="ورق">ورق</SelectItem>
                              <SelectItem value="زجاج">زجاج</SelectItem>
                              <SelectItem value="أخرى">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="currentPrice">السعر الحالي</Label>
                          <Input
                            id="currentPrice"
                            type="number"
                            value={newScrapType.currentPrice}
                            onChange={(e) => setNewScrapType(prev => ({ ...prev, currentPrice: e.target.value }))}
                            placeholder="السعر الحالي"
                          />
                        </div>

                        <div>
                          <Label htmlFor="unit">الوحدة</Label>
                          <Select value={newScrapType.unit} onValueChange={(value) => setNewScrapType(prev => ({ ...prev, unit: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="كيلو">كيلو</SelectItem>
                              <SelectItem value="طن">طن</SelectItem>
                              <SelectItem value="قطعة">قطعة</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="minQuantity">الحد الأدنى للكمية</Label>
                          <Input
                            id="minQuantity"
                            type="number"
                            value={newScrapType.minQuantity}
                            onChange={(e) => setNewScrapType(prev => ({ ...prev, minQuantity: e.target.value }))}
                            placeholder="الحد الأدنى"
                          />
                        </div>

                        <div>
                          <Label htmlFor="maxQuantity">الحد الأقصى للكمية</Label>
                          <Input
                            id="maxQuantity"
                            type="number"
                            value={newScrapType.maxQuantity}
                            onChange={(e) => setNewScrapType(prev => ({ ...prev, maxQuantity: e.target.value }))}
                            placeholder="الحد الأقصى"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">الوصف</Label>
                        <Textarea
                          id="description"
                          value={newScrapType.description}
                          onChange={(e) => setNewScrapType(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="وصف نوع الخردة"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowAddScrapType(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSaveScrapType}>
                          حفظ نوع الخردة
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
                      placeholder="البحث في أنواع الخردة..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredScrapTypes.map((scrapType) => (
                  <Card key={scrapType.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">{scrapType.name}</h3>
                          <Badge variant="outline">{scrapType.category}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>{scrapType.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-green-50 p-2 rounded">
                            <p className="text-green-600 font-medium">السعر الحالي</p>
                            <p className="font-bold">{scrapType.currentPrice} ج.م/{scrapType.unit}</p>
                          </div>
                          <div className="bg-blue-50 p-2 rounded">
                            <p className="text-blue-600 font-medium">الكمية المسموحة</p>
                            <p className="font-bold">{scrapType.minQuantity} - {scrapType.maxQuantity} {scrapType.unit}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <Badge variant={scrapType.isActive ? "default" : "secondary"}>
                            {scrapType.isActive ? "نشط" : "غير نشط"}
                          </Badge>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calculator className="h-4 w-4" />
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

export default AdvancedScrapManagement;

