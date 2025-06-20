// نظام المصادقة البيومترية باستخدام Web Authentication API
class BiometricAuth {
  constructor() {
    this.isSupported = this.checkSupport();
  }

  // فحص دعم المتصفح للمصادقة البيومترية
  checkSupport() {
    return !!(navigator.credentials && 
              navigator.credentials.create && 
              navigator.credentials.get &&
              window.PublicKeyCredential);
  }

  // تسجيل بصمة جديدة
  async registerBiometric(username) {
    if (!this.isSupported) {
      throw new Error('المتصفح لا يدعم المصادقة البيومترية');
    }

    try {
      // إنشاء معرف فريد للمستخدم
      const userId = new TextEncoder().encode(username);
      
      // إعدادات التسجيل
      const publicKeyCredentialCreationOptions = {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: {
          name: "مدينة سوسنا",
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          {
            alg: -7, // ES256
            type: "public-key"
          },
          {
            alg: -257, // RS256
            type: "public-key"
          }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform", // للبصمة المدمجة في الجهاز
          userVerification: "required",
          requireResidentKey: false
        },
        timeout: 60000,
        attestation: "direct"
      };

      // إنشاء المفتاح
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      // حفظ معلومات البصمة محلياً
      const credentialData = {
        id: credential.id,
        rawId: Array.from(new Uint8Array(credential.rawId)),
        type: credential.type,
        username: username,
        registeredAt: new Date().toISOString()
      };

      localStorage.setItem('sosna_biometric_credential', JSON.stringify(credentialData));
      
      return {
        success: true,
        credentialId: credential.id,
        message: 'تم تسجيل البصمة بنجاح'
      };

    } catch (error) {
      console.error('خطأ في تسجيل البصمة:', error);
      
      let errorMessage = 'فشل في تسجيل البصمة';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'تم رفض الإذن للوصول للبصمة';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'الجهاز لا يدعم البصمة';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'خطأ أمني في تسجيل البصمة';
      }
      
      throw new Error(errorMessage);
    }
  }

  // تسجيل الدخول بالبصمة
  async authenticateWithBiometric() {
    if (!this.isSupported) {
      throw new Error('المتصفح لا يدعم المصادقة البيومترية');
    }

    // التحقق من وجود بصمة مسجلة
    const savedCredential = localStorage.getItem('sosna_biometric_credential');
    if (!savedCredential) {
      throw new Error('لا توجد بصمة مسجلة. يرجى تسجيل البصمة أولاً');
    }

    try {
      const credentialData = JSON.parse(savedCredential);
      
      // إعدادات المصادقة
      const publicKeyCredentialRequestOptions = {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        allowCredentials: [{
          id: new Uint8Array(credentialData.rawId),
          type: 'public-key',
          transports: ['internal']
        }],
        userVerification: 'required',
        timeout: 60000
      };

      // طلب المصادقة
      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (assertion) {
        return {
          success: true,
          username: credentialData.username,
          credentialId: assertion.id,
          message: 'تم تسجيل الدخول بالبصمة بنجاح'
        };
      }

    } catch (error) {
      console.error('خطأ في المصادقة بالبصمة:', error);
      
      let errorMessage = 'فشل في المصادقة بالبصمة';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'تم إلغاء المصادقة أو فشلت البصمة';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'خطأ أمني في المصادقة';
      } else if (error.name === 'AbortError') {
        errorMessage = 'تم إلغاء عملية المصادقة';
      }
      
      throw new Error(errorMessage);
    }
  }

  // فحص وجود بصمة مسجلة
  hasBiometricRegistered() {
    const savedCredential = localStorage.getItem('sosna_biometric_credential');
    return !!savedCredential;
  }

  // حذف البصمة المسجلة
  removeBiometric() {
    localStorage.removeItem('sosna_biometric_credential');
    return { success: true, message: 'تم حذف البصمة بنجاح' };
  }

  // فحص إمكانيات الجهاز البيومترية
  async getAvailableAuthenticators() {
    if (!this.isSupported) {
      return [];
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      const authenticators = [];
      
      if (available) {
        authenticators.push({
          type: 'platform',
          name: 'بصمة الإصبع / الوجه',
          icon: 'fingerprint',
          supported: true
        });
      }

      // فحص دعم المصادقة الخارجية (مثل مفاتيح الأمان)
      if (navigator.credentials) {
        authenticators.push({
          type: 'cross-platform',
          name: 'مفتاح الأمان الخارجي',
          icon: 'key',
          supported: true
        });
      }

      return authenticators;
    } catch (error) {
      console.error('خطأ في فحص المصادقات المتاحة:', error);
      return [];
    }
  }

  // تشفير البيانات الحساسة
  async encryptSensitiveData(data, password) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    
    // إنشاء مفتاح من كلمة المرور
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // اشتقاق مفتاح التشفير
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('sosna-salt-2024'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // تشفير البيانات
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      dataBuffer
    );

    return {
      encrypted: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  }

  // فك تشفير البيانات
  async decryptSensitiveData(encryptedData, password) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // إنشاء مفتاح من كلمة المرور
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // اشتقاق مفتاح فك التشفير
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('sosna-salt-2024'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    // فك التشفير
    const decrypted = await crypto.subtle.decrypt(
      { 
        name: 'AES-GCM', 
        iv: new Uint8Array(encryptedData.iv) 
      },
      key,
      new Uint8Array(encryptedData.encrypted)
    );

    return JSON.parse(decoder.decode(decrypted));
  }
}

// إنشاء مثيل واحد للاستخدام في التطبيق
const biometricAuth = new BiometricAuth();

export default biometricAuth;

