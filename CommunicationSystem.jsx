// نظام الاتصال المتكامل بين الموظفين والعملاء
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, PhoneCall, PhoneOff, Mic, MicOff, Video, VideoOff, 
  MessageCircle, Send, Paperclip, Download, Play, Pause, 
  Volume2, VolumeX, Users, Clock, Shield, Eye, EyeOff,
  FileText, Image, Camera, Headphones, Settings
} from 'lucide-react';

const CommunicationSystem = ({ user, addNotification }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [callHistory, setCallHistory] = useState([]);
  const [recordings, setRecordings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [showRecordings, setShowRecordings] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [recordingPermission, setRecordingPermission] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const callTimerRef = useRef(null);
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // تحميل جهات الاتصال
    loadContacts();
    
    // تحميل سجل المكالمات
    loadCallHistory();
    
    // تحميل التسجيلات (للمدير فقط)
    if (user.role === 'manager' || user.role === 'admin') {
      loadRecordings();
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [user]);

  const loadContacts = () => {
    // محاكاة تحميل جهات الاتصال
    const mockContacts = [
      { id: 1, name: 'أحمد محمد', type: 'customer', phone: '01012345678', status: 'online' },
      { id: 2, name: 'فاطمة علي', type: 'customer', phone: '01098765432', status: 'offline' },
      { id: 3, name: 'محمد سعد', type: 'employee', phone: '01055555555', status: 'online' },
      { id: 4, name: 'نورا حسن', type: 'employee', phone: '01066666666', status: 'busy' },
    ];
    setContacts(mockContacts);
  };

  const loadCallHistory = () => {
    // محاكاة تحميل سجل المكالمات
    const mockHistory = [
      {
        id: 1,
        contactName: 'أحمد محمد',
        type: 'incoming',
        duration: 180,
        timestamp: new Date(Date.now() - 3600000),
        recorded: true,
        recordingId: 'rec_001'
      },
      {
        id: 2,
        contactName: 'فاطمة علي',
        type: 'outgoing',
        duration: 95,
        timestamp: new Date(Date.now() - 7200000),
        recorded: true,
        recordingId: 'rec_002'
      }
    ];
    setCallHistory(mockHistory);
  };

  const loadRecordings = () => {
    // محاكاة تحميل التسجيلات (للمدير فقط)
    const mockRecordings = [
      {
        id: 'rec_001',
        contactName: 'أحمد محمد',
        employeeName: user.name,
        duration: 180,
        timestamp: new Date(Date.now() - 3600000),
        size: '2.1 MB',
        transcription: 'العميل يسأل عن أسعار الأطقم الجديدة...',
        isConfidential: true
      },
      {
        id: 'rec_002',
        contactName: 'فاطمة علي',
        employeeName: user.name,
        duration: 95,
        timestamp: new Date(Date.now() - 7200000),
        size: '1.4 MB',
        transcription: 'استفسار عن موعد التسليم...',
        isConfidential: true
      }
    ];
    setRecordings(mockRecordings);
  };

  const startCall = async (contact) => {
    try {
      // طلب إذن الوصول للميكروفون والكاميرا
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: isVideoEnabled 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCallActive(true);
      setActiveChat(contact);
      
      // بدء عداد المكالمة
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // بدء التسجيل التلقائي
      if (user.role === 'manager' || user.role === 'admin') {
        startRecording(stream);
      }

      addNotification(`بدء مكالمة مع ${contact.name}`, 'info');
    } catch (error) {
      addNotification('فشل في بدء المكالمة. تحقق من أذونات الميكروفون', 'error');
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }

    // إيقاف التسجيل
    if (isRecording) {
      stopRecording();
    }

    // إضافة المكالمة لسجل المكالمات
    const newCall = {
      id: Date.now(),
      contactName: activeChat?.name,
      type: 'outgoing',
      duration: callDuration,
      timestamp: new Date(),
      recorded: isRecording,
      recordingId: isRecording ? `rec_${Date.now()}` : null
    };

    setCallHistory(prev => [newCall, ...prev]);
    setActiveChat(null);
    
    addNotification('تم إنهاء المكالمة', 'info');
  };

  const startRecording = async (stream) => {
    try {
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // حفظ التسجيل
        const newRecording = {
          id: `rec_${Date.now()}`,
          contactName: activeChat?.name,
          employeeName: user.name,
          duration: callDuration,
          timestamp: new Date(),
          audioUrl: audioUrl,
          size: `${(audioBlob.size / 1024 / 1024).toFixed(1)} MB`,
          transcription: 'جاري معالجة النص...',
          isConfidential: true
        };

        setRecordings(prev => [newRecording, ...prev]);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      addNotification('بدء تسجيل المكالمة', 'success');
    } catch (error) {
      addNotification('فشل في بدء التسجيل', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      addNotification('تم إيقاف التسجيل', 'info');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    addNotification(isMuted ? 'تم إلغاء كتم الصوت' : 'تم كتم الصوت', 'info');
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    addNotification(isVideoEnabled ? 'تم إيقاف الفيديو' : 'تم تشغيل الفيديو', 'info');
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: user.name,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    addNotification(`تم إرسال رسالة إلى ${activeChat.name}`, 'success');
  };

  const requestRecordingPermission = async (recordingId) => {
    // طلب إذن من المدير لرؤية التسجيل
    addNotification('تم إرسال طلب للمدير لعرض التسجيل', 'info');
    
    // محاكاة موافقة المدير (في التطبيق الحقيقي سيكون هناك نظام إشعارات)
    setTimeout(() => {
      setRecordingPermission(true);
      addNotification('تم الموافقة على عرض التسجيل', 'success');
    }, 3000);
  };

  const playRecording = (recording) => {
    if (user.role !== 'manager' && user.role !== 'admin' && !recordingPermission) {
      requestRecordingPermission(recording.id);
      return;
    }

    setSelectedRecording(recording);
    setIsPlayingRecording(true);
    addNotification(`تشغيل تسجيل مكالمة ${recording.contactName}`, 'info');
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="communication-system">
      {/* واجهة المكالمة النشطة */}
      <AnimatePresence>
        {isCallActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex flex-col"
          >
            {/* معلومات المكالمة */}
            <div className="flex-1 flex flex-col items-center justify-center text-white">
              <div className="text-center mb-8">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl font-bold">
                    {activeChat?.name?.charAt(0) || 'م'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{activeChat?.name}</h2>
                <p className="text-white/70">{formatDuration(callDuration)}</p>
                {isRecording && (
                  <div className="flex items-center justify-center mt-2 text-red-400">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                    <span className="text-sm">جاري التسجيل</span>
                  </div>
                )}
              </div>

              {/* فيديو المكالمة */}
              {isVideoEnabled && (
                <div className="relative mb-8">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-64 h-48 bg-gray-800 rounded-lg"
                  />
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    className="absolute top-4 right-4 w-16 h-12 bg-gray-700 rounded border-2 border-white"
                  />
                </div>
              )}
            </div>

            {/* أزرار التحكم */}
            <div className="p-6">
              <div className="flex items-center justify-center space-x-6 space-x-reverse">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    isMuted ? 'bg-red-500' : 'bg-white/20'
                  }`}
                >
                  {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={endCall}
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleVideo}
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    isVideoEnabled ? 'bg-blue-500' : 'bg-white/20'
                  }`}
                >
                  {isVideoEnabled ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* قائمة جهات الاتصال */}
      <div className="contacts-list bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">جهات الاتصال</h3>
        <div className="space-y-3">
          {contacts.map((contact) => (
            <motion.div
              key={contact.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(contact.status)} rounded-full border-2 border-white`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {contact.type === 'customer' ? 'عميل' : 'موظف'} • {contact.phone}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startCall(contact)}
                  className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Phone className="w-5 h-5 text-white" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveChat(contact)}
                  className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* سجل المكالمات */}
      <div className="call-history bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">سجل المكالمات</h3>
        <div className="space-y-3">
          {callHistory.map((call) => (
            <div key={call.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  call.type === 'incoming' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{call.contactName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDuration(call.duration)} • {call.timestamp.toLocaleTimeString('ar-EG')}
                  </p>
                </div>
              </div>
              
              {call.recorded && (user.role === 'manager' || user.role === 'admin') && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => playRecording(recordings.find(r => r.id === call.recordingId))}
                  className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <Headphones className="w-5 h-5 text-white" />
                </motion.button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* التسجيلات (للمدير فقط) */}
      {(user.role === 'manager' || user.role === 'admin') && (
        <div className="recordings bg-white dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">التسجيلات السرية</h3>
            <div className="flex items-center text-red-500 text-sm">
              <Shield className="w-4 h-4 mr-1" />
              <span>سري للغاية</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {recordings.map((recording) => (
              <div key={recording.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{recording.contactName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      موظف: {recording.employeeName} • {formatDuration(recording.duration)} • {recording.size}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => playRecording(recording)}
                      className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 text-white" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>
                
                {recording.transcription && (
                  <div className="mt-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded text-sm text-gray-700 dark:text-gray-300">
                    <strong>النص المستخرج:</strong> {recording.transcription}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* واجهة الدردشة */}
      {activeChat && !isCallActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
        >
          {/* هيدر الدردشة */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {activeChat.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{activeChat.name}</p>
                  <p className="text-sm text-green-500">متصل الآن</p>
                </div>
              </div>
              
              <button
                onClick={() => setActiveChat(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
          </div>

          {/* منطقة الرسائل */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === user.name ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === user.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('ar-EG')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* منطقة إدخال الرسالة */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 space-x-reverse">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="اكتب رسالة..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"
              >
                <Send className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CommunicationSystem;

