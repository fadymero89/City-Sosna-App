// مكونات أساسية مؤقتة - سيتم تطويرها لاحقاً

import React from 'react';
import { motion } from 'framer-motion';

export const InvoicesScreen = ({ user, addNotification }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mobile-container"
  >
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">شاشة الفواتير</h2>
      <p className="text-gray-600">قريباً... مع ميزات متقدمة</p>
    </div>
  </motion.div>
);

export const ProductsScreen = ({ user, addNotification }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mobile-container"
  >
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">شاشة المنتجات</h2>
      <p className="text-gray-600">قريباً... مع ميزات متقدمة</p>
    </div>
  </motion.div>
);

export const CustomersScreen = ({ user, addNotification }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mobile-container"
  >
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">شاشة العملاء</h2>
      <p className="text-gray-600">قريباً... مع ميزات متقدمة</p>
    </div>
  </motion.div>
);

export const ScrapScreen = ({ user, addNotification }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mobile-container"
  >
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">شاشة الخردة</h2>
      <p className="text-gray-600">قريباً... مع ميزات متقدمة</p>
    </div>
  </motion.div>
);

export const ReportsScreen = ({ user, addNotification }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mobile-container"
  >
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">شاشة التقارير</h2>
      <p className="text-gray-600">قريباً... مع ميزات متقدمة</p>
    </div>
  </motion.div>
);

export const AIAssistant = ({ user, addNotification }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mobile-container"
  >
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">المساعد الذكي</h2>
      <p className="text-gray-600">قريباً... مع ميزات متقدمة</p>
    </div>
  </motion.div>
);

export const SettingsScreen = ({ user, theme, toggleTheme, onLogout, addNotification }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="mobile-container"
  >
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">الإعدادات</h2>
      <p className="text-gray-600">قريباً... مع ميزات متقدمة</p>
      <button 
        onClick={toggleTheme}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
      >
        تغيير الثيم
      </button>
    </div>
  </motion.div>
);

