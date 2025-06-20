import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  FileText,
  Activity,
  Calendar,
  Clock,
  Star,
  Zap,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = ({ user, addNotification }) => {
  const [stats, setStats] = useState({
    totalSales: 125000,
    totalInvoices: 342,
    totalCustomers: 89,
    totalProducts: 156,
    todaySales: 8500,
    monthlyGrowth: 12.5,
    pendingOrders: 23,
    lowStock: 7
  });

  const [salesData] = useState([
    { name: 'يناير', sales: 65000, invoices: 45 },
    { name: 'فبراير', sales: 78000, invoices: 52 },
    { name: 'مارس', sales: 82000, invoices: 58 },
    { name: 'أبريل', sales: 95000, invoices: 67 },
    { name: 'مايو', sales: 125000, invoices: 78 },
    { name: 'يونيو', sales: 135000, invoices: 85 }
  ]);

  const [productCategories] = useState([
    { name: 'أدوات مطبخ', value: 35, color: '#3b82f6' },
    { name: 'ألومنيوم', value: 28, color: '#10b981' },
    { name: 'خردة', value: 20, color: '#f59e0b' },
    { name: 'أخرى', value: 17, color: '#ef4444' }
  ]);

  const [recentActivities] = useState([
    { id: 1, type: 'sale', message: 'تم إنشاء فاتورة جديدة #1234', time: '5 دقائق', icon: FileText },
    { id: 2, type: 'customer', message: 'عميل جديد: أحمد محمد', time: '15 دقيقة', icon: Users },
    { id: 3, type: 'product', message: 'تم إضافة منتج: طقم أواني', time: '30 دقيقة', icon: Package },
    { id: 4, type: 'payment', message: 'تم استلام دفعة 5000 ج.م', time: '1 ساعة', icon: DollarSign }
  ]);

  useEffect(() => {
    // محاكاة تحديث البيانات في الوقت الفعلي
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todaySales: prev.todaySales + Math.floor(Math.random() * 500),
        totalSales: prev.totalSales + Math.floor(Math.random() * 1000)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center space-x-1 space-x-reverse text-sm ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{change}%</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{title}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="mobile-container space-y-6 pb-6">
      {/* ترحيب شخصي */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 space-x-reverse mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">أهلاً بك، {user?.name || 'المدير'}</h2>
              <p className="text-blue-100">إليك ملخص اليوم</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-blue-100 text-sm">مبيعات اليوم</p>
              <p className="text-2xl font-bold">{stats.todaySales.toLocaleString()} ج.م</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-blue-100 text-sm">الطلبات المعلقة</p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="إجمالي المبيعات"
          value={`${stats.totalSales.toLocaleString()} ج.م`}
          change={stats.monthlyGrowth}
          icon={DollarSign}
          color="from-green-500 to-emerald-600"
          trend="up"
        />
        <StatCard
          title="عدد الفواتير"
          value={stats.totalInvoices}
          change={8.2}
          icon={FileText}
          color="from-blue-500 to-cyan-600"
          trend="up"
        />
        <StatCard
          title="العملاء"
          value={stats.totalCustomers}
          change={15.3}
          icon={Users}
          color="from-purple-500 to-pink-600"
          trend="up"
        />
        <StatCard
          title="المنتجات"
          value={stats.totalProducts}
          change={-2.1}
          icon={Package}
          color="from-orange-500 to-red-600"
          trend="down"
        />
      </div>

      {/* الرسم البياني للمبيعات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">اتجاه المبيعات</h3>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Activity className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">آخر 6 أشهر</span>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none', 
                borderRadius: '12px',
                color: '#fff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#salesGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* توزيع المنتجات */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">توزيع المنتجات</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={productCategories}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {productCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-3">
            {productCategories.map((category, index) => (
              <div key={index} className="flex items-center space-x-3 space-x-reverse">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {category.value}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* النشاطات الأخيرة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">النشاطات الأخيرة</h3>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center space-x-3 space-x-reverse p-3 rounded-xl bg-gray-50 dark:bg-gray-700"
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <activity.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  منذ {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* إجراءات سريعة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
          onClick={() => addNotification('فتح شاشة إنشاء فاتورة جديدة', 'success')}
        >
          <FileText className="w-8 h-8 mb-3" />
          <h4 className="font-bold mb-1">فاتورة جديدة</h4>
          <p className="text-sm text-green-100">إنشاء فاتورة سريعة</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg"
          onClick={() => addNotification('فتح شاشة التقارير', 'info')}
        >
          <Target className="w-8 h-8 mb-3" />
          <h4 className="font-bold mb-1">التقارير</h4>
          <p className="text-sm text-purple-100">عرض التحليلات</p>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Dashboard;

