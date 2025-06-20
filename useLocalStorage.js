import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('متزامن');
  const [pendingChanges, setPendingChanges] = useState([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('جاري المزامنة...');
      
      // محاكاة عملية المزامنة
      setTimeout(() => {
        setSyncStatus('متزامن');
        setPendingChanges([]);
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('غير متصل');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addPendingChange = (change) => {
    if (!isOnline) {
      setPendingChanges(prev => [...prev, { ...change, timestamp: Date.now() }]);
      setSyncStatus(`${pendingChanges.length + 1} تغيير معلق`);
    }
  };

  return { isOnline, syncStatus, pendingChanges, addPendingChange };
};

export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage('sosna_theme', 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme, setTheme };
};

