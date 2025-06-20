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
import { Switch } from './ui/switch';
import { 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Package, 
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Target,
  Eye,
  Headphones,
  Keyboard,
  Smartphone
} from 'lucide-react';

const EnhancedIntelligentAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [assistantMode, setAssistantMode] = useState('voice'); // voice, text, both
  const [assistantLanguage, setAssistantLanguage] = useState('egyptian');
  const [assistantPersonality, setAssistantPersonality] = useState('professional');
  const [proactiveMode, setProactiveMode] = useState(true);
  const [businessInsights, setBusinessInsights] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [businessAlerts, setBusinessAlerts] = useState([]);
  const [dailyInsights, setDailyInsights] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  // بيانات تجريبية للتنبيهات والرؤى
  useEffect(() => {
    setBusinessAlerts([
      {
        id: 1,
        type: 'warning',
        title: 'انخفاض في المخزون',
        message: 'مخزون مواعين الألومنيوم أقل من الحد الأدنى (5 قطع متبقية)',
        priority: 'high',
        timestamp: new Date().toISOString(),
        action: 'إضافة طلب شراء جديد'
      },
      {
        id: 2,
        type: 'info',
        title: 'عميل جديد مميز',
        message: 'العميل "أحمد التجاري" تجاوزت مشترياته 10,000 ج.م هذا الشهر',
        priority: 'medium',
        timestamp: new Date().toISOString(),
        action: 'تطبيق خصم تاجر'
      },
      {
        id: 3,
        type: 'success',
        title: 'هدف المبيعات',
        message: 'تم تحقيق 85% من هدف المبيعات الشهري',
        priority: 'low',
        timestamp: new Date().toISOString(),
        action: 'مراجعة الأداء'
      }
    ]);

    setDailyInsights([
      {
        id: 1,
        category: 'مبيعات',
        insight: 'أفضل وقت للمبيعات اليوم كان من 2-4 مساءً بنسبة 35% من إجمالي المبيعات',
        recommendation: 'زيادة العروض في هذا التوقيت غداً',
        confidence: 92
      },
      {
        id: 2,
        category: 'عملاء',
        insight: 'العملاء من منطقة مصر الجديدة يفضلون المواعين الألومنيوم بنسبة 78%',
        recommendation: 'التركيز على تسويق منتجات الألومنيوم في هذه المنطقة',
        confidence: 87
      },
      {
        id: 3,
        category: 'مخزون',
        insight: 'معدل دوران المخزون للأطباق البلاستيك أسرع بـ 40% من المتوقع',
        recommendation: 'زيادة كمية الطلب في الشراء القادم',
        confidence: 95
      }
    ]);

    setQuickActions([
      { id: 1, title: 'إضافة فاتورة جديدة', icon: 'receipt', command: 'أضف فاتورة جديدة' },
      { id: 2, title: 'البحث عن عميل', icon: 'search', command: 'ابحث عن عميل' },
      { id: 3, title: 'تقرير المبيعات اليومي', icon: 'chart', command: 'اعرض تقرير المبيعات' },
      { id: 4, title: 'حالة المخزون', icon: 'package', command: 'اعرض حالة المخزون' },
      { id: 5, title: 'المهام المعلقة', icon: 'tasks', command: 'اعرض المهام المعلقة' },
      { id: 6, title: 'التحصيلات المستحقة', icon: 'money', command: 'اعرض التحصيلات المستحقة' }
    ];

    // محادثة تجريبية
    setConversationHistory([
      {
        id: 1,
        type: 'user',
        message: 'إيه حالة المبيعات النهاردة؟',
        timestamp: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 2,
        type: 'assistant',
        message: 'أهلاً يا فندم! المبيعات النهاردة ممتازة الحمد لله. إجمالي المبيعات وصل 8,500 ج.م من 12 فاتورة. أعلى فاتورة كانت 1,200 ج.م للعميل "محمد التجاري". وفيه 3 عملاء جدد اتضافوا النهاردة.',
        timestamp: new Date(Date.now() - 295000).toISOString(),
        insights: ['نمو 15% عن أمس', 'عملاء جدد: 3', 'متوسط الفاتورة: 708 ج.م']
      }
    ]);
  }, []);

  const startListening = () => {
    setIsListening(true);
    // محاكاة بدء الاستماع
    setTimeout(() => {
      setIsListening(false);
      handleVoiceInput("إيه آخر التحديثات في النظام؟");
    }, 3000);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const handleVoiceInput = (voiceText) => {
    const userMessage = {
      id: conversationHistory.length + 1,
      type: 'user',
      message: voiceText,
      timestamp: new Date().toISOString()
    };

    setConversationHistory(prev => [...prev, userMessage]);

    // محاكاة رد المساعد الذكي
    setTimeout(() => {
      const assistantResponse = generateIntelligentResponse(voiceText);
      const assistantMessage = {
        id: conversationHistory.length + 2,
        type: 'assistant',
        message: assistantResponse.message,
        timestamp: new Date().toISOString(),
        insights: assistantResponse.insights,
        actions: assistantResponse.actions
      };

      setConversationHistory(prev => [...prev, assistantMessage]);

      if (assistantMode === 'voice' || assistantMode === 'both') {
        speakResponse(assistantResponse.message);
      }
    }, 1500);
  };

  const handleTextInput = () => {
    if (currentMessage.trim()) {
      handleVoiceInput(currentMessage);
      setCurrentMessage('');
    }
  };

  const speakResponse = (text) => {
    setIsSpeaking(true);
    // محاكاة النطق
    setTimeout(() => {
      setIsSpeaking(false);
    }, 3000);
  };

  const generateIntelligentResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('مبيعات') || input.includes('فواتير')) {
      return {
        message: 'المبيعات النهاردة كويسة جداً يا فندم! إجمالي 8,500 ج.م من 12 فاتورة. أعلى فاتورة 1,200 ج.م. وفيه نمو 15% عن أمس. تحب أشوفلك تفاصيل أكتر؟',
        insights: ['نمو 15% عن أمس', 'متوسط الفاتورة: 708 ج.م', 'أفضل منتج: مواعين ألومنيوم'],
        actions: ['عرض تقرير مفصل', 'مقارنة بالأسبوع الماضي']
      };
    } else if (input.includes('مخزون') || input.includes('منتجات')) {
      return {
        message: 'المخزون عموماً كويس، بس فيه تنبيه مهم! مواعين الألومنيوم باقي منها 5 قطع بس. والأطباق البلاستيك بتتباع بسرعة أكتر من المتوقع. أقترح نطلب كمية جديدة قريب.',
        insights: ['مواعين ألومنيوم: 5 قطع', 'دوران سريع للبلاستيك', 'مخزون آمن: 85%'],
        actions: ['إنشاء طلب شراء', 'تحديث حدود المخزون']
      };
    } else if (input.includes('عملاء') || input.includes('زبائن')) {
      return {
        message: 'العملاء النهاردة كانوا نشطين! 3 عملاء جدد اتضافوا، و"أحمد التجاري" وصل لـ 10,000 ج.م مشتريات الشهر ده. أقترح نديله خصم تاجر. وفيه 5 عملاء لسه مادفعوش المستحقات.',
        insights: ['عملاء جدد: 3', 'عميل مميز جديد', 'مستحقات: 5 عملاء'],
        actions: ['تطبيق خصم تاجر', 'متابعة التحصيلات']
      };
    } else if (input.includes('تحديثات') || input.includes('جديد')) {
      return {
        message: 'آخر التحديثات: تم إضافة 3 فواتير جديدة، عميل واحد دفع مستحقاته، وفيه طلب سلفة من أحمد المبيعات. كمان فيه تنبيه مخزون للمواعين الألومنيوم. كله تحت السيطرة!',
        insights: ['3 فواتير جديدة', 'دفعة مستحقات', 'طلب سلفة معلق'],
        actions: ['مراجعة الفواتير', 'الموافقة على السلفة']
      };
    } else {
      return {
        message: 'أهلاً يا فندم! أنا هنا عشان أساعدك في أي حاجة تخص الشغل. ممكن أساعدك في المبيعات، المخزون، العملاء، أو أي استفسار تاني. إيه اللي تحب تعرفه؟',
        insights: ['مساعد ذكي جاهز', 'دعم شامل متاح'],
        actions: ['عرض الخيارات المتاحة']
      };
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'info': return <Lightbulb className="h-4 w-4 text-blue-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const executeQuickAction = (command) => {
    handleVoiceInput(command);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">المساعد الذكي المتطور</h1>
        <p className="text-gray-600">مساعد ذكي باللهجة المصرية مع رؤى تجارية استباقية ودعم صوتي ونصي</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* واجهة المحادثة الرئيسية */}
        <div className="lg:col-span-2 space-y-6">
          {/* لوحة التحكم السريع */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                الإجراءات السريعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2"
                    onClick={() => executeQuickAction(action.command)}
                  >
                    <Target className="h-5 w-5" />
                    <span className="text-sm text-center">{action.title}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* واجهة المحادثة */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  المحادثة مع المساعد الذكي
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={isListening ? "default" : "secondary"}>
                    {isListening ? "يستمع..." : "جاهز"}
                  </Badge>
                  <Badge variant={isSpeaking ? "default" : "secondary"}>
                    {isSpeaking ? "يتحدث..." : "صامت"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* تاريخ المحادثة */}
              <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
                {conversationHistory.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      {message.insights && (
                        <div className="mt-2 space-y-1">
                          {message.insights.map((insight, index) => (
                            <Badge key={index} variant="outline" className="mr-1 text-xs">
                              {insight}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {message.actions && (
                        <div className="mt-2 space-y-1">
                          {message.actions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="mr-1 text-xs"
                              onClick={() => executeQuickAction(action)}
                            >
                              {action}
                            </Button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString('ar-EG')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* أدوات الإدخال */}
              <div className="space-y-4">
                {(assistantMode === 'voice' || assistantMode === 'both') && (
                  <div className="flex justify-center">
                    <Button
                      size="lg"
                      variant={isListening ? "destructive" : "default"}
                      className="rounded-full w-16 h-16"
                      onClick={isListening ? stopListening : startListening}
                    >
                      {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </Button>
                  </div>
                )}

                {(assistantMode === 'text' || assistantMode === 'both') && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="اكتب رسالتك هنا..."
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTextInput()}
                    />
                    <Button onClick={handleTextInput}>
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* الشريط الجانبي */}
        <div className="space-y-6">
          {/* إعدادات المساعد */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات المساعد
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="assistantMode">وضع التشغيل</Label>
                <Select value={assistantMode} onValueChange={setAssistantMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voice">صوتي فقط</SelectItem>
                    <SelectItem value="text">نصي فقط</SelectItem>
                    <SelectItem value="both">صوتي ونصي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assistantLanguage">اللهجة</Label>
                <Select value={assistantLanguage} onValueChange={setAssistantLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="egyptian">مصرية</SelectItem>
                    <SelectItem value="formal">فصحى</SelectItem>
                    <SelectItem value="gulf">خليجية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assistantPersonality">الشخصية</Label>
                <Select value={assistantPersonality} onValueChange={setAssistantPersonality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">مهنية</SelectItem>
                    <SelectItem value="friendly">ودودة</SelectItem>
                    <SelectItem value="formal">رسمية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="proactiveMode">الوضع الاستباقي</Label>
                <Switch
                  id="proactiveMode"
                  checked={proactiveMode}
                  onCheckedChange={setProactiveMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="businessInsights">الرؤى التجارية</Label>
                <Switch
                  id="businessInsights"
                  checked={businessInsights}
                  onCheckedChange={setBusinessInsights}
                />
              </div>

              <div>
                <Label htmlFor="voiceSpeed">سرعة الصوت: {voiceSpeed}x</Label>
                <input
                  type="range"
                  id="voiceSpeed"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="voiceVolume">مستوى الصوت: {Math.round(voiceVolume * 100)}%</Label>
                <input
                  type="range"
                  id="voiceVolume"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* التنبيهات التجارية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                التنبيهات التجارية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {businessAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                        <Button variant="outline" size="sm" className="mt-2 text-xs">
                          {alert.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* الرؤى اليومية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                الرؤى اليومية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyInsights.map((insight) => (
                  <div key={insight.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{insight.category}</Badge>
                      <span className="text-xs text-blue-600">{insight.confidence}% ثقة</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{insight.insight}</p>
                    <p className="text-xs text-blue-600 font-medium">{insight.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedIntelligentAssistant;

