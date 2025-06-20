// نظام التواصل المباشر مع الإدارة
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Mail, 
  Send, 
  Paperclip, 
  Mic, 
  Camera,
  User,
  Crown,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Heart,
  Zap
} from 'lucide-react';

const DirectCommunication = ({ user, addNotification }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeContact, setActiveContact] = useState(null);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [communicationType, setCommunicationType] = useState('message');
  
  const fileInputRef = useRef(null);

  // جهات الاتصال المباشر
  const directContacts = [
    {
      id: 'designer',
      name: 'المصمم',
      title: 'مصمم النظام',
      avatar: '🎨',
      icon: User,
      color: 'from-blue-500 to-purple-500',
      status: 'متاح',
      responseTime: '5 دقائق',
      specialties: ['تصميم الواجهات', 'تجربة المستخدم', 'الدعم التقني']
    },
    {
      id: 'chairman',
      name: 'رئيس مجلس الإدارة',
      title: 'الرئيس التنفيذي',
      avatar: '👑',
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      status: 'مشغول',
      responseTime: '30 دقيقة',
      specialties: ['القرارات الاستراتيجية', 'التطوير', 'الشراكات']
    },
    {
      id: 'support',
      name: 'الدعم التقني',
      title: 'فريق الدعم',
      avatar: '🛠️',
      icon: Shield,
      color: 'from-green-500 to-teal-500',
      status: 'متاح 24/7',
      responseTime: 'فوري',
      specialties: ['حل المشاكل', 'التدريب', 'الصيانة']
    }
  ];

  // أنواع التواصل
  const communicationTypes = [
    { id: 'message', name: 'رسالة', icon: MessageSquare },
    { id: 'voice', name: 'صوتية', icon: Mic },
    { id: 'video', name: 'مرئية', icon: Video },
    { id: 'email', name: 'إيميل', icon: Mail }
  ];

  // رسائل سريعة مقترحة
  const quickMessages = [
    'أحتاج مساعدة في استخدام النظام',
    'لدي اقتراح لتحسين التطبيق',
    'أواجه مشكلة تقنية',
    'أريد طلب ميزة جديدة',
    'شكراً لكم على الدعم الممتاز',
    'أحتاج تدريب على النظام'
  ];

  const handleSendMessage = () => {
    if (!message.trim() || !activeContact) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      type: communicationType
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // محاكاة رد تلقائي
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: `شكراً لتواصلك معنا. تم استلام رسالتك وسنرد عليك خلال ${activeContact.responseTime}.`,
        sender: activeContact.id,
        timestamp: new Date(),
        type: 'message'
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);

    addNotification(`تم إرسال الرسالة إلى ${activeContact.name}`, 'success');
  };

  const handleQuickMessage = (quickMsg) => {
    setMessage(quickMsg);
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      addNotification('بدء تسجيل الرسالة الصوتية...', 'info');
    } else {
      addNotification('تم إنهاء التسجيل وإرسال الرسالة', 'success');
    }
  };

  const startVideoCall = () => {
    addNotification(`جاري الاتصال بـ ${activeContact.name}...`, 'info');
    setTimeout(() => {
      addNotification('تم بدء المكالمة المرئية', 'success');
    }, 2000);
  };

  const renderContactCard = (contact) => (
    <motion.div
      key={contact.id}
      className={`p-4 rounded-xl bg-gradient-to-r ${contact.color} text-white cursor-pointer`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveContact(contact)}
    >
      <div className="flex items-center space-x-3 space-x-reverse mb-3">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
          {contact.avatar}
        </div>
        <div className="flex-1">
          <h3 className="font-bold">{contact.name}</h3>
          <p className="text-sm opacity-90">{contact.title}</p>
        </div>
        <contact.icon className="w-6 h-6" />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className={`w-2 h-2 rounded-full ${
            contact.status === 'متاح' ? 'bg-green-300' : 
            contact.status === 'متاح 24/7' ? 'bg-blue-300' : 'bg-yellow-300'
          }`} />
          <span>{contact.status}</span>
        </div>
        <div className="flex items-center space-x-1 space-x-reverse">
          <Clock className="w-3 h-3" />
          <span>{contact.responseTime}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <div className="flex flex-wrap gap-1">
          {contact.specialties.slice(0, 2).map((specialty, index) => (
            <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {specialty}
            </span>
          ))}
          {contact.specialties.length > 2 && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              +{contact.specialties.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderChatInterface = () => (
    <div className="flex flex-col h-full">
      {/* رأس المحادثة */}
      <div className={`p-4 bg-gradient-to-r ${activeContact.color} text-white rounded-t-3xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setActiveContact(null)}
              className="p-2 bg-white/20 rounded-full"
            >
              ←
            </button>
            <div className="text-2xl">{activeContact.avatar}</div>
            <div>
              <h3 className="font-bold">{activeContact.name}</h3>
              <p className="text-sm opacity-90">{activeContact.status}</p>
            </div>
          </div>
          <div className="flex space-x-2 space-x-reverse">
            <button
              onClick={startVideoCall}
              className="p-2 bg-white/20 rounded-full"
            >
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/20 rounded-full">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-60">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>ابدأ محادثة مع {activeContact.name}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString('ar-EG', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* الرسائل السريعة */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2">
          {quickMessages.map((quickMsg, index) => (
            <button
              key={index}
              onClick={() => handleQuickMessage(quickMsg)}
              className="flex-shrink-0 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {quickMsg}
            </button>
          ))}
        </div>
      </div>

      {/* منطقة الكتابة */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-600">
        {/* أنواع التواصل */}
        <div className="flex space-x-2 space-x-reverse mb-3">
          {communicationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setCommunicationType(type.id)}
              className={`p-2 rounded-lg ${
                communicationType === type.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <type.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={handleFileAttach}
            className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full"
          >
            <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </div>

          <button
            onClick={handleVoiceRecord}
            className={`p-2 rounded-full ${
              isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-full"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files[0]) {
            addNotification('تم إرفاق الملف بنجاح', 'success');
          }
        }}
      />
    </div>
  );

  return (
    <>
      {/* زر التواصل المباشر */}
      <motion.button
        className="fixed bottom-52 left-4 w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(!isVisible)}
      >
        <MessageSquare className="w-6 h-6 text-white" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Heart className="w-2 h-2 text-white" />
        </motion.div>
      </motion.button>

      {/* واجهة التواصل */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-md h-[80vh] overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              {!activeContact ? (
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      التواصل المباشر
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      تواصل مباشرة مع فريق الإدارة والدعم
                    </p>
                  </div>

                  <div className="space-y-4">
                    {directContacts.map(renderContactCard)}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <Star className="w-5 h-5 text-blue-500" />
                      <span className="font-semibold text-blue-800 dark:text-blue-200">
                        نصائح للتواصل الفعال
                      </span>
                    </div>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• كن واضحاً ومحدداً في رسالتك</li>
                      <li>• أرفق لقطات شاشة إذا كانت مشكلة تقنية</li>
                      <li>• اذكر رقم حسابك أو معلومات التعريف</li>
                    </ul>
                  </div>
                </div>
              ) : (
                renderChatInterface()
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DirectCommunication;

