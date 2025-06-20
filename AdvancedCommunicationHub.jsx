import React, { useState, useEffect, useRef } from 'react';
import './AdvancedCommunicationHub.css';

const AdvancedCommunicationHub = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [communicationMode, setCommunicationMode] = useState('text'); // text, voice, video
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [quickReplies, setQuickReplies] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFilters, setChatFilters] = useState('all'); // all, customers, employees, management
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // قائمة جهات الاتصال المتاحة
  const contacts = {
    management: [
      {
        id: 'fady_ishaq',
        name: 'فادي إسحق',
        title: 'المصمم والمطور',
        role: 'designer',
        avatar: '👨‍💻',
        status: 'online',
        lastSeen: 'متاح الآن',
        department: 'التطوير التقني'
      },
      {
        id: 'chairman',
        name: 'رئيس مجلس الإدارة',
        title: 'رئيس مجلس الإدارة',
        role: 'chairman',
        avatar: '👔',
        status: 'online',
        lastSeen: 'متاح الآن',
        department: 'الإدارة العليا'
      }
    ],
    employees: [
      {
        id: 'emp_001',
        name: 'أحمد محمد',
        title: 'مدير المبيعات',
        role: 'employee',
        avatar: '👨‍💼',
        status: 'online',
        lastSeen: 'منذ 5 دقائق',
        department: 'المبيعات'
      },
      {
        id: 'emp_002',
        name: 'فاطمة علي',
        title: 'محاسبة',
        role: 'employee',
        avatar: '👩‍💼',
        status: 'away',
        lastSeen: 'منذ 15 دقيقة',
        department: 'المحاسبة'
      },
      {
        id: 'emp_003',
        name: 'محمود حسن',
        title: 'مسؤول المخزون',
        role: 'employee',
        avatar: '👨‍🔧',
        status: 'offline',
        lastSeen: 'منذ ساعة',
        department: 'المخزون'
      }
    ],
    customers: [
      {
        id: 'cust_001',
        name: 'سارة أحمد',
        title: 'عميل مميز',
        role: 'customer',
        avatar: '👩',
        status: 'online',
        lastSeen: 'متاح الآن',
        department: 'العملاء'
      },
      {
        id: 'cust_002',
        name: 'خالد محمود',
        title: 'عميل جديد',
        role: 'customer',
        avatar: '👨',
        status: 'away',
        lastSeen: 'منذ 10 دقائق',
        department: 'العملاء'
      }
    ]
  };

  // الردود السريعة المقترحة
  const defaultQuickReplies = {
    general: [
      'شكراً لك',
      'سأتابع الموضوع',
      'تم الاستلام',
      'في أقرب وقت',
      'مفهوم تماماً'
    ],
    customer_service: [
      'أهلاً وسهلاً، كيف يمكنني مساعدتك؟',
      'سأقوم بمراجعة طلبك فوراً',
      'شكراً لتواصلك معنا',
      'هل تحتاج مساعدة إضافية؟',
      'تم حل المشكلة بنجاح'
    ],
    management: [
      'تم الاطلاع على التقرير',
      'موافق على الاقتراح',
      'يرجى المتابعة',
      'ممتاز، استمر',
      'سأراجع الأمر'
    ]
  };

  useEffect(() => {
    // محاكاة تحديث حالة المستخدمين المتصلين
    const interval = setInterval(() => {
      updateOnlineUsers();
      generateNotifications();
    }, 30000);

    // تحميل الرسائل المحفوظة
    loadChatHistory();
    
    // إعداد الردود السريعة
    setQuickReplies(defaultQuickReplies.general);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const updateOnlineUsers = () => {
    const allContacts = [...contacts.management, ...contacts.employees, ...contacts.customers];
    const online = allContacts.filter(contact => 
      contact.status === 'online' || Math.random() > 0.7
    );
    setOnlineUsers(online);
  };

  const generateNotifications = () => {
    const newNotifications = [
      {
        id: Date.now(),
        type: 'message',
        title: 'رسالة جديدة',
        content: 'لديك رسالة جديدة من أحمد محمد',
        timestamp: new Date().toLocaleTimeString('ar-EG'),
        read: false
      }
    ];
    
    setNotifications(prev => [...newNotifications, ...prev.slice(0, 9)]);
  };

  const loadChatHistory = () => {
    // محاكاة تحميل سجل المحادثات
    const mockHistory = {
      'fady_ishaq': [
        {
          id: 1,
          sender: 'user',
          content: 'مرحباً فادي، أريد مناقشة تطوير ميزة جديدة',
          timestamp: new Date(Date.now() - 3600000).toLocaleTimeString('ar-EG'),
          type: 'text'
        },
        {
          id: 2,
          sender: 'fady_ishaq',
          content: 'أهلاً وسهلاً! أنا جاهز لمناقشة أي تطوير جديد. ما هي الميزة التي تريد إضافتها؟',
          timestamp: new Date(Date.now() - 3500000).toLocaleTimeString('ar-EG'),
          type: 'text'
        }
      ],
      'chairman': [
        {
          id: 1,
          sender: 'user',
          content: 'تحية طيبة، أريد مراجعة تقرير الأداء الشهري',
          timestamp: new Date(Date.now() - 7200000).toLocaleTimeString('ar-EG'),
          type: 'text'
        }
      ]
    };
    
    setMessages(mockHistory);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectChat = (contactId) => {
    setActiveChat(contactId);
    
    // تحديث الردود السريعة حسب نوع المحادثة
    const contact = getAllContacts().find(c => c.id === contactId);
    if (contact) {
      if (contact.role === 'customer') {
        setQuickReplies(defaultQuickReplies.customer_service);
      } else if (contact.role === 'chairman' || contact.role === 'designer') {
        setQuickReplies(defaultQuickReplies.management);
      } else {
        setQuickReplies(defaultQuickReplies.general);
      }
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message = {
      id: Date.now(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('ar-EG'),
      type: communicationMode,
      attachments: attachments.length > 0 ? [...attachments] : null
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), message]
    }));

    setNewMessage('');
    setAttachments([]);

    // محاكاة رد تلقائي
    setTimeout(() => {
      simulateReply();
    }, 1000 + Math.random() * 2000);
  };

  const simulateReply = () => {
    const contact = getAllContacts().find(c => c.id === activeChat);
    if (!contact) return;

    const replies = {
      'fady_ishaq': [
        'شكراً لك! سأعمل على هذا الطلب فوراً',
        'فكرة ممتازة! دعني أدرس التفاصيل التقنية',
        'تم فهم المطلوب، سأبدأ في التطوير',
        'هذا ممكن تماماً، سأحتاج بعض الوقت للتنفيذ',
        'رائع! سأضيف هذه الميزة في التحديث القادم'
      ],
      'chairman': [
        'شكراً لك على التقرير المفصل',
        'موافق على الاقتراح، يرجى المتابعة',
        'ممتاز، استمر في العمل الجيد',
        'سأراجع الأمر وأعطيك الرد قريباً',
        'تقرير شامل ومفيد، أحسنت'
      ]
    };

    const contactReplies = replies[activeChat] || [
      'شكراً لرسالتك',
      'تم استلام رسالتك وسأرد عليك قريباً',
      'أقدر تواصلك معي'
    ];

    const randomReply = contactReplies[Math.floor(Math.random() * contactReplies.length)];

    const replyMessage = {
      id: Date.now(),
      sender: activeChat,
      content: randomReply,
      timestamp: new Date().toLocaleTimeString('ar-EG'),
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), replyMessage]
    }));
  };

  const sendQuickReply = (reply) => {
    setNewMessage(reply);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const voiceMessage = {
          id: Date.now(),
          name: `تسجيل صوتي ${new Date().toLocaleTimeString('ar-EG')}.wav`,
          size: audioBlob.size,
          type: 'audio/wav',
          url: audioUrl,
          isVoice: true
        };
        
        setAttachments(prev => [...prev, voiceMessage]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('خطأ في بدء التسجيل:', error);
      alert('لا يمكن الوصول للميكروفون');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const getAllContacts = () => {
    return [...contacts.management, ...contacts.employees, ...contacts.customers];
  };

  const getFilteredContacts = () => {
    const allContacts = getAllContacts();
    
    if (chatFilters === 'all') return allContacts;
    if (chatFilters === 'customers') return contacts.customers;
    if (chatFilters === 'employees') return contacts.employees;
    if (chatFilters === 'management') return contacts.management;
    
    return allContacts;
  };

  const getSearchedContacts = () => {
    const filtered = getFilteredContacts();
    
    if (!searchQuery.trim()) return filtered;
    
    return filtered.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4ecdc4';
      case 'away': return '#f39c12';
      case 'offline': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'متاح';
      case 'away': return 'مشغول';
      case 'offline': return 'غير متاح';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="advanced-communication-hub">
      <div className="communication-header">
        <h2>💬 مركز التواصل المتقدم</h2>
        <p>تواصل مع الفريق والعملاء بكل سهولة ومرونة</p>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-text">{onlineUsers.length} متصل</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💬</span>
            <span className="stat-text">{Object.keys(messages).length} محادثة</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🔔</span>
            <span className="stat-text">{notifications.filter(n => !n.read).length} إشعار</span>
          </div>
        </div>
      </div>

      <div className="communication-container">
        {/* قائمة جهات الاتصال */}
        <div className="contacts-sidebar">
          <div className="contacts-header">
            <h3>جهات الاتصال</h3>
            
            {/* البحث والفلترة */}
            <div className="search-filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="البحث في جهات الاتصال..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="search-icon">🔍</span>
              </div>
              
              <div className="filter-tabs">
                <button
                  className={`filter-tab ${chatFilters === 'all' ? 'active' : ''}`}
                  onClick={() => setChatFilters('all')}
                >
                  الكل
                </button>
                <button
                  className={`filter-tab ${chatFilters === 'management' ? 'active' : ''}`}
                  onClick={() => setChatFilters('management')}
                >
                  الإدارة
                </button>
                <button
                  className={`filter-tab ${chatFilters === 'employees' ? 'active' : ''}`}
                  onClick={() => setChatFilters('employees')}
                >
                  الموظفين
                </button>
                <button
                  className={`filter-tab ${chatFilters === 'customers' ? 'active' : ''}`}
                  onClick={() => setChatFilters('customers')}
                >
                  العملاء
                </button>
              </div>
            </div>
          </div>

          <div className="contacts-list">
            {getSearchedContacts().map(contact => (
              <div
                key={contact.id}
                className={`contact-item ${activeChat === contact.id ? 'active' : ''}`}
                onClick={() => selectChat(contact.id)}
              >
                <div className="contact-avatar">
                  <span className="avatar-emoji">{contact.avatar}</span>
                  <div 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(contact.status) }}
                  ></div>
                </div>
                
                <div className="contact-info">
                  <div className="contact-name">{contact.name}</div>
                  <div className="contact-title">{contact.title}</div>
                  <div className="contact-status">
                    {getStatusText(contact.status)} • {contact.lastSeen}
                  </div>
                </div>
                
                {messages[contact.id] && messages[contact.id].length > 0 && (
                  <div className="message-indicator">
                    <span className="message-count">
                      {messages[contact.id].length}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* المستخدمون المتصلون */}
          <div className="online-users">
            <h4>المتصلون الآن ({onlineUsers.length})</h4>
            <div className="online-list">
              {onlineUsers.slice(0, 5).map(user => (
                <div key={user.id} className="online-user">
                  <span className="user-avatar">{user.avatar}</span>
                  <span className="user-name">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* منطقة المحادثة */}
        <div className="chat-area">
          {activeChat ? (
            <>
              {/* رأس المحادثة */}
              <div className="chat-header">
                <div className="chat-contact-info">
                  <span className="chat-avatar">
                    {getAllContacts().find(c => c.id === activeChat)?.avatar}
                  </span>
                  <div className="chat-details">
                    <div className="chat-name">
                      {getAllContacts().find(c => c.id === activeChat)?.name}
                    </div>
                    <div className="chat-status">
                      {getStatusText(getAllContacts().find(c => c.id === activeChat)?.status)} • 
                      {getAllContacts().find(c => c.id === activeChat)?.lastSeen}
                    </div>
                  </div>
                </div>
                
                <div className="chat-actions">
                  <button className="chat-action-btn" title="مكالمة صوتية">
                    📞
                  </button>
                  <button className="chat-action-btn" title="مكالمة فيديو">
                    📹
                  </button>
                  <button className="chat-action-btn" title="معلومات أكثر">
                    ℹ️
                  </button>
                </div>
              </div>

              {/* الرسائل */}
              <div className="messages-container">
                {(messages[activeChat] || []).map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === 'user' ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <div className="message-text">{message.content}</div>
                      
                      {message.attachments && (
                        <div className="message-attachments">
                          {message.attachments.map(attachment => (
                            <div key={attachment.id} className="attachment-item">
                              {attachment.isVoice ? (
                                <div className="voice-attachment">
                                  <span className="voice-icon">🎤</span>
                                  <audio controls src={attachment.url}></audio>
                                </div>
                              ) : attachment.type.startsWith('image/') ? (
                                <img 
                                  src={attachment.url} 
                                  alt={attachment.name}
                                  className="image-attachment"
                                />
                              ) : (
                                <div className="file-attachment">
                                  <span className="file-icon">📎</span>
                                  <span className="file-name">{attachment.name}</span>
                                  <span className="file-size">{formatFileSize(attachment.size)}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="message-time">{message.timestamp}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* الردود السريعة */}
              {quickReplies.length > 0 && (
                <div className="quick-replies">
                  <div className="quick-replies-label">ردود سريعة:</div>
                  <div className="quick-replies-list">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        className="quick-reply-btn"
                        onClick={() => sendQuickReply(reply)}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* المرفقات المعلقة */}
              {attachments.length > 0 && (
                <div className="pending-attachments">
                  <div className="attachments-label">المرفقات:</div>
                  <div className="attachments-list">
                    {attachments.map(attachment => (
                      <div key={attachment.id} className="pending-attachment">
                        <span className="attachment-name">{attachment.name}</span>
                        <button
                          className="remove-attachment"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* منطقة الكتابة */}
              <div className="message-input-area">
                <div className="input-tools">
                  <button
                    className="tool-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="إرفاق ملف"
                  >
                    📎
                  </button>
                  
                  <button
                    className={`tool-btn ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    title={isRecording ? 'إيقاف التسجيل' : 'تسجيل صوتي'}
                  >
                    🎤
                  </button>
                  
                  <button
                    className="tool-btn"
                    onClick={() => setCommunicationMode(communicationMode === 'text' ? 'voice' : 'text')}
                    title="تبديل وضع التواصل"
                  >
                    {communicationMode === 'text' ? '💬' : '🗣️'}
                  </button>
                </div>

                <div className="message-input">
                  <input
                    type="text"
                    placeholder="اكتب رسالتك هنا..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  
                  <button
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <span className="no-chat-icon">💬</span>
                <h3>اختر محادثة للبدء</h3>
                <p>اختر أحد جهات الاتصال من القائمة لبدء المحادثة</p>
              </div>
            </div>
          )}
        </div>

        {/* لوحة الإشعارات */}
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>الإشعارات</h3>
            <button 
              className="clear-notifications"
              onClick={() => setNotifications([])}
            >
              مسح الكل
            </button>
          </div>
          
          <div className="notifications-list">
            {notifications.slice(0, 10).map(notification => (
              <div
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              >
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-text">{notification.content}</div>
                  <div className="notification-time">{notification.timestamp}</div>
                </div>
                {!notification.read && <div className="unread-indicator"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* عناصر مخفية */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="*/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default AdvancedCommunicationHub;

