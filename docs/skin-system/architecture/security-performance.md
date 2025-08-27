# 🔒 보안 및 성능 고려사항

## 📋 목차
1. [보안 아키텍처](#보안-아키텍처)
2. [외부 코드 실행 보안](#외부-코드-실행-보안)
3. [성능 최적화 전략](#성능-최적화-전략)
4. [모니터링 및 관찰성](#모니터링-및-관찰성)
5. [운영 환경 구성](#운영-환경-구성)

---

## 보안 아키텍처

### 1. 신뢰할 수 있는 스킨 소스 관리

```typescript
// 신뢰할 수 있는 도메인 화이트리스트
export class TrustedSkinSources {
  private static trustedDomains = new Set([
    'cdn.withcookie.com',           // 공식 CDN
    'skins.withcookie.com',         // 스킨 전용 서브도메인
    'trusted-partner.com',          // 검증된 파트너
    'company-internal.cdn.com'      // 기업 내부 CDN
  ]);
  
  private static trustedPublishers = new Set([
    'withcookie-team',              // 공식 팀
    'verified-partner-a',           // 검증된 파트너 A
    'enterprise-client-x'           // 엔터프라이즈 클라이언트
  ]);
  
  // 스킨 URL 유효성 검증
  public static validateSkinSource(url: string, publisher?: string): boolean {
    try {
      const urlObj = new URL(url);
      
      // 1. HTTPS 강제
      if (urlObj.protocol !== 'https:') {
        console.error('❌ HTTP 스킨 URL은 허용되지 않습니다:', url);
        return false;
      }
      
      // 2. 도메인 화이트리스트 검증
      const domain = urlObj.hostname;
      const isDomainTrusted = Array.from(this.trustedDomains).some(trusted => 
        domain === trusted || domain.endsWith('.' + trusted)
      );
      
      if (!isDomainTrusted) {
        console.error('❌ 신뢰할 수 없는 도메인:', domain);
        return false;
      }
      
      // 3. 발행자 검증 (선택적)
      if (publisher && !this.trustedPublishers.has(publisher)) {
        console.warn('⚠️ 검증되지 않은 발행자:', publisher);
        // 경고만 표시하고 로딩은 허용 (선택적 정책)
      }
      
      return true;
    } catch (error) {
      console.error('❌ 스킨 URL 파싱 실패:', error);
      return false;
    }
  }
  
  // 새 신뢰 도메인 추가 (관리자 권한 필요)
  public static addTrustedDomain(domain: string, adminKey: string): boolean {
    if (!this.verifyAdminKey(adminKey)) {
      console.error('❌ 관리자 권한이 필요합니다');
      return false;
    }
    
    this.trustedDomains.add(domain);
    console.log('✅ 신뢰 도메인 추가:', domain);
    return true;
  }
  
  private static verifyAdminKey(key: string): boolean {
    // 실제 구현에서는 암호화된 키 검증 로직 사용
    return key === process.env.SKIN_ADMIN_KEY;
  }
}
```

### 2. Content Security Policy (CSP) 구성

```typescript
// CSP 헤더 동적 생성
export class CSPManager {
  private static basePolicies = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'",  // React 인라인 스크립트용 (최소화 권장)
      "'unsafe-eval'",    // 동적 UMD 로딩용 (격리 환경에서만)
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",  // 동적 스타일 적용용
      'fonts.googleapis.com'
    ],
    'img-src': [
      "'self'",
      'data:',
      'https:'  // 외부 이미지 허용
    ],
    'font-src': [
      "'self'",
      'fonts.gstatic.com',
      'data:'
    ]
  };
  
  // 신뢰할 수 있는 스킨 도메인을 CSP에 추가
  public static generateCSPForSkins(): string {
    const policies = { ...this.basePolicies };
    
    // 신뢰할 수 있는 스킨 도메인을 script-src에 추가
    const trustedDomains = Array.from(TrustedSkinSources.getTrustedDomains());
    policies['script-src'].push(...trustedDomains);
    policies['style-src'].push(...trustedDomains);
    
    // CSP 문자열 생성
    return Object.entries(policies)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');
  }
  
  // 페이지별 CSP 적용
  public static applySkinCSP(): void {
    const cspHeader = this.generateCSPForSkins();
    
    // 런타임에 CSP 메타 태그 추가
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspHeader;
    document.head.appendChild(meta);
    
    console.log('🛡️ 스킨용 CSP 적용:', cspHeader);
  }
}
```

### 3. 스킨 무결성 검증

```typescript
// 스킨 파일 무결성 검증
export class SkinIntegrityValidator {
  // 스킨 등록 시 해시 값 포함
  public static async registerSkinWithIntegrity(config: ComponentSkinConfig & {
    umdHash?: string;    // UMD 파일 SHA-256 해시
    cssHashes?: string[]; // CSS 파일들의 해시
  }) {
    // 기본 등록 과정
    const registrationResult = await registerComponentSkin(config);
    
    // 무결성 정보 저장
    if (config.umdHash || config.cssHashes) {
      this.storeIntegrityData(config.id, {
        umdHash: config.umdHash,
        cssHashes: config.cssHashes,
        timestamp: Date.now()
      });
    }
    
    return registrationResult;
  }
  
  // 스킨 로딩 시 무결성 검증
  public static async validateSkinIntegrity(skinId: string, fileContent: string, fileType: 'umd' | 'css'): Promise<boolean> {
    const integrityData = this.getIntegrityData(skinId);
    if (!integrityData) {
      console.warn('⚠️ 무결성 검증 데이터 없음:', skinId);
      return true; // 검증 데이터가 없으면 통과 (선택적 정책)
    }
    
    const expectedHash = fileType === 'umd' 
      ? integrityData.umdHash 
      : integrityData.cssHashes?.[0]; // 간단화된 예제
    
    if (!expectedHash) {
      return true;
    }
    
    const actualHash = await this.calculateSHA256(fileContent);
    const isValid = actualHash === expectedHash;
    
    if (!isValid) {
      console.error('❌ 스킨 무결성 검증 실패:', {
        skinId,
        fileType,
        expected: expectedHash,
        actual: actualHash
      });
    } else {
      console.log('✅ 스킨 무결성 검증 성공:', skinId);
    }
    
    return isValid;
  }
  
  private static async calculateSHA256(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  private static storeIntegrityData(skinId: string, data: any): void {
    const key = `skin_integrity_${skinId}`;
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  private static getIntegrityData(skinId: string): any {
    const key = `skin_integrity_${skinId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }
}
```

---

## 외부 코드 실행 보안

### 1. 샌드박스 실행 환경

```typescript
// 격리된 환경에서 스킨 실행
export class SkinSandbox {
  private static sandboxedGlobals = new Map<string, any>();
  
  // 안전한 전역 객체 제공
  public static createSafeGlobals(skinId: string): any {
    const safeGlobals = {
      // 안전한 내장 객체들
      Array,
      Object,
      String,
      Number,
      Boolean,
      Date,
      Math,
      JSON,
      
      // React 관련 (필수)
      React: window.React,
      ReactDOM: window.ReactDOM,
      
      // 제한된 DOM 접근
      document: {
        createElement: document.createElement.bind(document),
        createTextNode: document.createTextNode.bind(document),
        // 직접적인 DOM 조작은 제한
      },
      
      // 안전한 console (로그 수집용)
      console: {
        log: (...args: any[]) => console.log(`[${skinId}]`, ...args),
        warn: (...args: any[]) => console.warn(`[${skinId}]`, ...args),
        error: (...args: any[]) => console.error(`[${skinId}]`, ...args),
      },
      
      // 네트워크 요청 제한
      fetch: this.createRestrictedFetch(skinId),
      
      // 스토리지 접근 제한
      localStorage: this.createRestrictedStorage(skinId),
      sessionStorage: this.createRestrictedStorage(skinId),
    };
    
    this.sandboxedGlobals.set(skinId, safeGlobals);
    return safeGlobals;
  }
  
  // 제한된 fetch 함수
  private static createRestrictedFetch(skinId: string) {
    return async (url: string, options?: RequestInit) => {
      // 허용된 도메인으로만 요청 제한
      if (!TrustedSkinSources.validateSkinSource(url)) {
        throw new Error(`비허용 도메인으로의 요청: ${url}`);
      }
      
      // 요청 로깅
      console.log(`🌐 [${skinId}] 네트워크 요청:`, url);
      
      // 제한된 옵션으로 요청
      const restrictedOptions = {
        ...options,
        credentials: 'omit', // 쿠키 전송 방지
        mode: 'cors'
      };
      
      return fetch(url, restrictedOptions);
    };
  }
  
  // 제한된 스토리지 접근
  private static createRestrictedStorage(skinId: string) {
    const prefix = `skin_${skinId}_`;
    
    return {
      getItem: (key: string) => {
        return localStorage.getItem(prefix + key);
      },
      setItem: (key: string, value: string) => {
        // 스킨별 네임스페이스 적용
        return localStorage.setItem(prefix + key, value);
      },
      removeItem: (key: string) => {
        return localStorage.removeItem(prefix + key);
      },
      clear: () => {
        // 해당 스킨의 데이터만 삭제
        Object.keys(localStorage)
          .filter(key => key.startsWith(prefix))
          .forEach(key => localStorage.removeItem(key));
      }
    };
  }
}
```

### 2. 권한 기반 접근 제어

```typescript
// 스킨별 권한 관리
export class SkinPermissionManager {
  private static permissions = new Map<string, Set<string>>();
  
  // 권한 상수 정의
  public static readonly PERMISSIONS = {
    NETWORK_ACCESS: 'network_access',      // 네트워크 요청
    LOCAL_STORAGE: 'local_storage',        // 로컬 스토리지 접근
    NOTIFICATION: 'notification',          // 브라우저 알림
    GEOLOCATION: 'geolocation',           // 위치 정보
    CAMERA: 'camera',                     // 카메라 접근
    MICROPHONE: 'microphone',             // 마이크 접근
    FULLSCREEN: 'fullscreen',             // 전체화면
    CLIPBOARD: 'clipboard'                // 클립보드 접근
  };
  
  // 스킨 권한 설정
  public static setPermissions(skinId: string, permissions: string[]): void {
    this.permissions.set(skinId, new Set(permissions));
    console.log(`🔐 스킨 권한 설정 [${skinId}]:`, permissions);
  }
  
  // 권한 확인
  public static hasPermission(skinId: string, permission: string): boolean {
    const skinPermissions = this.permissions.get(skinId);
    return skinPermissions?.has(permission) || false;
  }
  
  // 권한이 필요한 API 래핑
  public static createPermissionAwareAPI(skinId: string) {
    return {
      // 지오로케이션 API
      getCurrentPosition: (successCallback: any, errorCallback?: any) => {
        if (!this.hasPermission(skinId, this.PERMISSIONS.GEOLOCATION)) {
          console.error(`❌ [${skinId}] 위치 정보 권한 없음`);
          errorCallback?.(new Error('권한 없음'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      },
      
      // 알림 API
      showNotification: (title: string, options?: NotificationOptions) => {
        if (!this.hasPermission(skinId, this.PERMISSIONS.NOTIFICATION)) {
          console.error(`❌ [${skinId}] 알림 권한 없음`);
          return Promise.reject(new Error('권한 없음'));
        }
        
        return new Notification(title, options);
      },
      
      // 클립보드 API
      writeToClipboard: async (text: string) => {
        if (!this.hasPermission(skinId, this.PERMISSIONS.CLIPBOARD)) {
          console.error(`❌ [${skinId}] 클립보드 권한 없음`);
          throw new Error('권한 없음');
        }
        
        return navigator.clipboard.writeText(text);
      }
    };
  }
}
```

### 3. 런타임 보안 모니터링

```typescript
// 실시간 보안 위협 감지
export class SecurityMonitor {
  private static suspiciousActivities: Array<{
    skinId: string;
    activity: string;
    timestamp: number;
    details: any;
  }> = [];
  
  // 의심스러운 활동 패턴 감지
  public static monitorSkinBehavior(skinId: string): void {
    // DOM 조작 감지
    this.monitorDOMManipulation(skinId);
    
    // 네트워크 요청 감지
    this.monitorNetworkActivity(skinId);
    
    // 에러 패턴 감지
    this.monitorErrorPatterns(skinId);
  }
  
  private static monitorDOMManipulation(skinId: string): void {
    const originalCreateElement = document.createElement;
    
    document.createElement = function(tagName: string, options?: any) {
      // 의심스러운 태그 생성 감지
      const suspiciousTags = ['script', 'iframe', 'embed', 'object'];
      if (suspiciousTags.includes(tagName.toLowerCase())) {
        SecurityMonitor.reportSuspiciousActivity(skinId, 'DOM_MANIPULATION', {
          tagName,
          stackTrace: new Error().stack
        });
      }
      
      return originalCreateElement.call(this, tagName, options);
    };
  }
  
  private static monitorNetworkActivity(skinId: string): void {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input.toString();
      
      // 의심스러운 도메인으로의 요청 감지
      if (!TrustedSkinSources.validateSkinSource(url)) {
        SecurityMonitor.reportSuspiciousActivity(skinId, 'UNTRUSTED_NETWORK_REQUEST', {
          url,
          method: init?.method || 'GET'
        });
      }
      
      return originalFetch.call(this, input, init);
    };
  }
  
  private static monitorErrorPatterns(skinId: string): void {
    window.addEventListener('error', (event) => {
      // 스킨 관련 에러 패턴 분석
      if (event.filename?.includes(skinId) || event.error?.stack?.includes(skinId)) {
        const errorFrequency = this.getErrorFrequency(skinId);
        
        if (errorFrequency > 10) { // 10번 이상 에러 발생
          this.reportSuspiciousActivity(skinId, 'HIGH_ERROR_RATE', {
            errorCount: errorFrequency,
            latestError: event.error?.message
          });
        }
      }
    });
  }
  
  private static reportSuspiciousActivity(skinId: string, activity: string, details: any): void {
    const report = {
      skinId,
      activity,
      timestamp: Date.now(),
      details
    };
    
    this.suspiciousActivities.push(report);
    
    console.warn('🚨 의심스러운 스킨 활동 감지:', report);
    
    // 심각한 활동의 경우 스킨 비활성화
    if (this.isCriticalActivity(activity)) {
      this.disableSkin(skinId);
    }
    
    // 보안 팀에 알림 전송
    this.notifySecurityTeam(report);
  }
  
  private static isCriticalActivity(activity: string): boolean {
    const criticalActivities = [
      'DOM_MANIPULATION',
      'UNTRUSTED_NETWORK_REQUEST',
      'PRIVILEGE_ESCALATION'
    ];
    
    return criticalActivities.includes(activity);
  }
  
  private static disableSkin(skinId: string): void {
    console.error(`🛑 보안 위협으로 인한 스킨 비활성화: ${skinId}`);
    
    // 스킨 등록 해제
    componentSkins.delete(skinId);
    
    // 사용자에게 알림
    alert(`보안상의 이유로 스킨 "${skinId}"가 비활성화되었습니다.`);
  }
  
  private static notifySecurityTeam(report: any): void {
    // 실제 보안 팀 알림 시스템 연동
    fetch('/api/security/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    }).catch(err => console.error('보안 알림 전송 실패:', err));
  }
  
  private static getErrorFrequency(skinId: string): number {
    const recentErrors = this.suspiciousActivities.filter(
      activity => activity.skinId === skinId && 
                  activity.activity === 'ERROR' &&
                  Date.now() - activity.timestamp < 60000 // 최근 1분
    );
    
    return recentErrors.length;
  }
}
```

---

## 성능 최적화 전략

### 1. 번들 분석 및 최적화

```typescript
// 스킨 번들 성능 분석
export class SkinPerformanceAnalyzer {
  private static performanceData = new Map<string, any>();
  
  // 번들 크기 및 로딩 시간 분석
  public static async analyzeSkinPerformance(skinId: string): Promise<any> {
    const startTime = performance.now();
    const config = componentSkins.get(skinId);
    
    if (!config) {
      throw new Error(`스킨을 찾을 수 없습니다: ${skinId}`);
    }
    
    const analysis = {
      skinId,
      startTime,
      bundleSizes: {},
      loadingTimes: {},
      networkMetrics: {},
      renderingMetrics: {}
    };
    
    try {
      // 1. 번들 크기 분석
      analysis.bundleSizes = await this.analyzeBundleSize(config);
      
      // 2. 네트워크 성능 분석
      analysis.networkMetrics = await this.analyzeNetworkPerformance(config);
      
      // 3. 로딩 시간 측정
      const loadStartTime = performance.now();
      await loadComponentSkin(skinId);
      analysis.loadingTimes.total = performance.now() - loadStartTime;
      
      // 4. 렌더링 성능 측정
      analysis.renderingMetrics = await this.analyzeRenderingPerformance(skinId);
      
      // 5. 최적화 제안 생성
      analysis.optimizationSuggestions = this.generateOptimizationSuggestions(analysis);
      
      this.performanceData.set(skinId, analysis);
      return analysis;
      
    } catch (error) {
      analysis.error = error.message;
      return analysis;
    }
  }
  
  private static async analyzeBundleSize(config: any): Promise<any> {
    const sizes = {
      umd: 0,
      css: 0,
      total: 0
    };
    
    // UMD 번들 크기
    try {
      const umdResponse = await fetch(config.umdUrl, { method: 'HEAD' });
      sizes.umd = parseInt(umdResponse.headers.get('content-length') || '0');
    } catch (error) {
      console.warn('UMD 번들 크기 확인 실패:', error);
    }
    
    // CSS 파일 크기들
    if (config.cssUrls) {
      for (const cssUrl of config.cssUrls) {
        try {
          const cssResponse = await fetch(cssUrl, { method: 'HEAD' });
          const cssSize = parseInt(cssResponse.headers.get('content-length') || '0');
          sizes.css += cssSize;
        } catch (error) {
          console.warn('CSS 파일 크기 확인 실패:', error);
        }
      }
    }
    
    sizes.total = sizes.umd + sizes.css;
    
    return {
      ...sizes,
      formattedSizes: {
        umd: this.formatBytes(sizes.umd),
        css: this.formatBytes(sizes.css),
        total: this.formatBytes(sizes.total)
      }
    };
  }
  
  private static async analyzeNetworkPerformance(config: any): Promise<any> {
    const networkMetrics = {
      latency: 0,
      downloadSpeed: 0,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown'
    };
    
    // 네트워크 레이턴시 측정
    const latencyStart = performance.now();
    try {
      await fetch(config.umdUrl, { method: 'HEAD' });
      networkMetrics.latency = performance.now() - latencyStart;
    } catch (error) {
      console.warn('네트워크 레이턴시 측정 실패:', error);
    }
    
    return networkMetrics;
  }
  
  private static async analyzeRenderingPerformance(skinId: string): Promise<any> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const skinEntries = entries.filter(entry => 
          entry.name.includes(skinId) || 
          entry.name.includes('skin')
        );
        
        resolve({
          renderingTime: skinEntries.reduce((sum, entry) => sum + entry.duration, 0),
          entryCount: skinEntries.length,
          entries: skinEntries.map(entry => ({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          }))
        });
        
        observer.disconnect();
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation'] });
      
      // 5초 후 타임아웃
      setTimeout(() => {
        observer.disconnect();
        resolve({ timeout: true });
      }, 5000);
    });
  }
  
  private static generateOptimizationSuggestions(analysis: any): string[] {
    const suggestions = [];
    
    // 번들 크기 최적화 제안
    if (analysis.bundleSizes.total > 500 * 1024) { // 500KB 이상
      suggestions.push('번들 크기가 큽니다. 코드 분할을 고려하세요.');
    }
    
    if (analysis.bundleSizes.umd > 300 * 1024) { // 300KB 이상
      suggestions.push('UMD 번들이 큽니다. tree-shaking을 적용하세요.');
    }
    
    // 로딩 시간 최적화 제안
    if (analysis.loadingTimes.total > 3000) { // 3초 이상
      suggestions.push('로딩 시간이 깁니다. CDN 사용을 고려하세요.');
    }
    
    // 네트워크 최적화 제안
    if (analysis.networkMetrics.latency > 1000) { // 1초 이상
      suggestions.push('네트워크 레이턴시가 높습니다. 지역별 CDN을 고려하세요.');
    }
    
    return suggestions;
  }
  
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
```

### 2. 메모리 관리 최적화

```typescript
// 메모리 누수 방지 및 관리
export class SkinMemoryManager {
  private static skinInstances = new Map<string, WeakRef<any>>();
  private static memoryUsage = new Map<string, number>();
  
  // 스킨 인스턴스 등록
  public static registerSkinInstance(skinId: string, instance: any): void {
    this.skinInstances.set(skinId, new WeakRef(instance));
    this.trackMemoryUsage(skinId);
  }
  
  // 메모리 사용량 추적
  private static trackMemoryUsage(skinId: string): void {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      this.memoryUsage.set(skinId, memInfo.usedJSHeapSize);
    }
  }
  
  // 스킨 인스턴스 정리
  public static cleanupSkinInstance(skinId: string): void {
    const instanceRef = this.skinInstances.get(skinId);
    if (instanceRef) {
      const instance = instanceRef.deref();
      if (instance) {
        // 리스너 정리
        this.removeEventListeners(instance);
        
        // 타이머 정리
        this.clearTimers(instance);
        
        // 구독 정리
        this.unsubscribeAll(instance);
      }
    }
    
    this.skinInstances.delete(skinId);
    this.memoryUsage.delete(skinId);
  }
  
  // 주기적 메모리 정리
  public static periodicCleanup(): void {
    // 가비지 컬렉션된 인스턴스 정리
    for (const [skinId, instanceRef] of this.skinInstances) {
      if (!instanceRef.deref()) {
        this.skinInstances.delete(skinId);
        this.memoryUsage.delete(skinId);
      }
    }
    
    // 메모리 사용량 체크
    this.checkMemoryUsage();
  }
  
  private static checkMemoryUsage(): void {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const usagePercent = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
      
      if (usagePercent > 80) { // 80% 이상 사용 시
        console.warn('⚠️ 높은 메모리 사용량 감지:', usagePercent.toFixed(2) + '%');
        this.forceGarbageCollection();
      }
    }
  }
  
  private static forceGarbageCollection(): void {
    // 사용하지 않는 스킨 인스턴스 강제 정리
    const currentTime = Date.now();
    const CLEANUP_THRESHOLD = 5 * 60 * 1000; // 5분
    
    for (const [skinId, instanceRef] of this.skinInstances) {
      const instance = instanceRef.deref();
      if (instance && instance.lastUsed && 
          currentTime - instance.lastUsed > CLEANUP_THRESHOLD) {
        console.log('🧹 오래된 스킨 인스턴스 정리:', skinId);
        this.cleanupSkinInstance(skinId);
      }
    }
  }
  
  private static removeEventListeners(instance: any): void {
    // 인스턴스에 등록된 이벤트 리스너 정리
    if (instance._eventListeners) {
      instance._eventListeners.forEach((listener: any) => {
        listener.target.removeEventListener(listener.event, listener.handler);
      });
      instance._eventListeners = [];
    }
  }
  
  private static clearTimers(instance: any): void {
    // 인스턴스에 등록된 타이머 정리
    if (instance._timers) {
      instance._timers.forEach((timerId: number) => {
        clearTimeout(timerId);
        clearInterval(timerId);
      });
      instance._timers = [];
    }
  }
  
  private static unsubscribeAll(instance: any): void {
    // 인스턴스의 모든 구독 정리
    if (instance._subscriptions) {
      instance._subscriptions.forEach((subscription: any) => {
        if (typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe();
        }
      });
      instance._subscriptions = [];
    }
  }
}

// 메모리 정리 스케줄러
setInterval(() => {
  SkinMemoryManager.periodicCleanup();
}, 60000); // 1분마다 실행
```

---

## 모니터링 및 관찰성

### 1. 실시간 성능 모니터링

```typescript
// 스킨 성능 실시간 모니터링
export class SkinPerformanceMonitor {
  private static metrics = new Map<string, any>();
  private static observers = new Set<PerformanceObserver>();
  
  // 모니터링 시작
  public static startMonitoring(): void {
    this.setupPerformanceObservers();
    this.setupErrorTracking();
    this.setupUserInteractionTracking();
  }
  
  private static setupPerformanceObservers(): void {
    // 로딩 성능 관찰
    const loadingObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name.includes('skin') || entry.name.includes('umd')) {
          this.recordMetric('loading', {
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            timestamp: Date.now()
          });
        }
      });
    });
    
    loadingObserver.observe({ entryTypes: ['resource'] });
    this.observers.add(loadingObserver);
    
    // 렌더링 성능 관찰
    const renderObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.recordMetric('rendering', {
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime,
          timestamp: Date.now()
        });
      });
    });
    
    renderObserver.observe({ entryTypes: ['measure'] });
    this.observers.add(renderObserver);
  }
  
  private static setupErrorTracking(): void {
    // 전역 에러 추적
    window.addEventListener('error', (event) => {
      if (this.isSkinRelatedError(event)) {
        this.recordMetric('error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
          timestamp: Date.now()
        });
      }
    });
    
    // Promise 거부 추적
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isSkinRelatedError(event)) {
        this.recordMetric('unhandled_rejection', {
          reason: event.reason,
          promise: event.promise,
          timestamp: Date.now()
        });
      }
    });
  }
  
  private static setupUserInteractionTracking(): void {
    // 사용자 상호작용 성능 측정
    ['click', 'input', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        const target = event.target as Element;
        if (target && this.isSkinElement(target)) {
          performance.mark(`skin-interaction-${eventType}-start`);
          
          requestAnimationFrame(() => {
            performance.mark(`skin-interaction-${eventType}-end`);
            performance.measure(
              `skin-interaction-${eventType}`,
              `skin-interaction-${eventType}-start`,
              `skin-interaction-${eventType}-end`
            );
          });
        }
      });
    });
  }
  
  private static isSkinRelatedError(event: any): boolean {
    const errorSources = [
      event.filename || '',
      event.error?.stack || '',
      event.reason?.stack || ''
    ].join(' ');
    
    return errorSources.includes('skin') || 
           errorSources.includes('umd') ||
           errorSources.includes('external');
  }
  
  private static isSkinElement(element: Element): boolean {
    return element.closest('[data-skin-id]') !== null ||
           element.classList.contains('skin-component') ||
           element.id.includes('skin');
  }
  
  private static recordMetric(type: string, data: any): void {
    const key = `${type}_${Date.now()}`;
    this.metrics.set(key, { type, ...data });
    
    // 실시간 알림이 필요한 메트릭 처리
    if (this.isAlertWorthy(type, data)) {
      this.sendAlert(type, data);
    }
    
    // 메트릭 저장소 크기 제한 (최근 1000개만 유지)
    if (this.metrics.size > 1000) {
      const oldestKey = this.metrics.keys().next().value;
      this.metrics.delete(oldestKey);
    }
  }
  
  private static isAlertWorthy(type: string, data: any): boolean {
    switch (type) {
      case 'loading':
        return data.duration > 5000; // 5초 이상 로딩
      case 'rendering':
        return data.duration > 100; // 100ms 이상 렌더링
      case 'error':
        return true; // 모든 에러는 알림
      default:
        return false;
    }
  }
  
  private static sendAlert(type: string, data: any): void {
    console.warn(`🚨 성능 알림 [${type}]:`, data);
    
    // 실제 알림 시스템으로 전송
    fetch('/api/performance/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data, timestamp: Date.now() })
    }).catch(err => console.error('알림 전송 실패:', err));
  }
  
  // 메트릭 리포트 생성
  public static generateReport(): any {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    const recentMetrics = Array.from(this.metrics.values())
      .filter(metric => metric.timestamp > oneHourAgo);
    
    const report = {
      timeRange: { from: oneHourAgo, to: now },
      totalMetrics: recentMetrics.length,
      byType: {},
      summary: {}
    };
    
    // 타입별 그룹화
    recentMetrics.forEach(metric => {
      if (!report.byType[metric.type]) {
        report.byType[metric.type] = [];
      }
      report.byType[metric.type].push(metric);
    });
    
    // 요약 통계 생성
    Object.keys(report.byType).forEach(type => {
      const metrics = report.byType[type];
      report.summary[type] = {
        count: metrics.length,
        avgDuration: this.calculateAverage(metrics, 'duration'),
        maxDuration: Math.max(...metrics.map(m => m.duration || 0)),
        minDuration: Math.min(...metrics.map(m => m.duration || 0))
      };
    });
    
    return report;
  }
  
  private static calculateAverage(metrics: any[], field: string): number {
    const values = metrics.map(m => m[field]).filter(v => typeof v === 'number');
    return values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
  }
}
```

### 2. 로그 수집 및 분석

```typescript
// 구조화된 로그 수집 시스템
export class SkinLogCollector {
  private static logs: Array<{
    level: string;
    message: string;
    skinId?: string;
    timestamp: number;
    context: any;
  }> = [];
  
  private static logLevels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  };
  
  private static currentLogLevel = this.logLevels.INFO;
  
  // 구조화된 로그 기록
  public static log(level: keyof typeof SkinLogCollector.logLevels, message: string, context: any = {}): void {
    if (this.logLevels[level] > this.currentLogLevel) {
      return; // 현재 로그 레벨보다 낮은 우선순위는 무시
    }
    
    const logEntry = {
      level,
      message,
      skinId: context.skinId,
      timestamp: Date.now(),
      context: {
        ...context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.getSessionId()
      }
    };
    
    this.logs.push(logEntry);
    
    // 콘솔 출력
    const consoleFn = console[level.toLowerCase()] || console.log;
    consoleFn(`[SKIN-${level}]`, message, context);
    
    // 로그 스토리지 크기 제한
    if (this.logs.length > 5000) {
      this.logs.splice(0, 1000); // 오래된 로그 1000개 제거
    }
    
    // 중요한 로그는 즉시 전송
    if (level === 'ERROR') {
      this.sendLogsToServer([logEntry]);
    }
  }
  
  // 배치로 로그 전송
  public static flushLogs(): void {
    if (this.logs.length === 0) return;
    
    const logsToSend = [...this.logs];
    this.logs = []; // 로그 버퍼 클리어
    
    this.sendLogsToServer(logsToSend);
  }
  
  private static sendLogsToServer(logs: any[]): void {
    fetch('/api/logs/skin-system', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': this.getSessionId()
      },
      body: JSON.stringify({ logs, timestamp: Date.now() })
    }).catch(err => {
      console.error('로그 전송 실패:', err);
      // 전송 실패한 로그는 로컬 스토리지에 백업
      this.backupLogsToStorage(logs);
    });
  }
  
  private static backupLogsToStorage(logs: any[]): void {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('skin_logs_backup') || '[]');
      const mergedLogs = [...existingLogs, ...logs].slice(-1000); // 최대 1000개 유지
      localStorage.setItem('skin_logs_backup', JSON.stringify(mergedLogs));
    } catch (error) {
      console.error('로그 백업 실패:', error);
    }
  }
  
  private static getSessionId(): string {
    let sessionId = sessionStorage.getItem('skin_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('skin_session_id', sessionId);
    }
    return sessionId;
  }
  
  // 로그 분석 및 인사이트 생성
  public static analyzeLogPatterns(): any {
    const analysis = {
      errorFrequency: new Map<string, number>(),
      errorPatterns: [],
      performanceInsights: [],
      securityAlerts: []
    };
    
    this.logs.forEach(log => {
      // 에러 빈도 분석
      if (log.level === 'ERROR') {
        const errorKey = `${log.skinId || 'unknown'}-${log.message}`;
        analysis.errorFrequency.set(errorKey, (analysis.errorFrequency.get(errorKey) || 0) + 1);
      }
      
      // 보안 관련 로그 감지
      if (this.isSecurityRelated(log)) {
        analysis.securityAlerts.push(log);
      }
      
      // 성능 관련 인사이트
      if (this.isPerformanceRelated(log)) {
        analysis.performanceInsights.push(log);
      }
    });
    
    return analysis;
  }
  
  private static isSecurityRelated(log: any): boolean {
    const securityKeywords = ['unauthorized', 'permission', 'security', 'attack', 'malicious'];
    const content = (log.message + JSON.stringify(log.context)).toLowerCase();
    return securityKeywords.some(keyword => content.includes(keyword));
  }
  
  private static isPerformanceRelated(log: any): boolean {
    const performanceKeywords = ['slow', 'timeout', 'memory', 'performance', 'lag'];
    const content = (log.message + JSON.stringify(log.context)).toLowerCase();
    return performanceKeywords.some(keyword => content.includes(keyword));
  }
}

// 주기적 로그 플러시
setInterval(() => {
  SkinLogCollector.flushLogs();
}, 30000); // 30초마다 실행

// 페이지 언로드 시 로그 플러시
window.addEventListener('beforeunload', () => {
  SkinLogCollector.flushLogs();
});
```

---

## 운영 환경 구성

### 1. 프로덕션 환경 설정

```typescript
// 프로덕션 환경별 구성
export class ProductionConfig {
  public static configure(): void {
    // 1. 보안 설정 적용
    this.applySecuritySettings();
    
    // 2. 성능 최적화 활성화
    this.enablePerformanceOptimizations();
    
    // 3. 모니터링 시작
    this.startMonitoring();
    
    // 4. 에러 리포팅 설정
    this.setupErrorReporting();
  }
  
  private static applySecuritySettings(): void {
    // CSP 적용
    CSPManager.applySkinCSP();
    
    // 보안 모니터링 시작
    SecurityMonitor.monitorSkinBehavior('*');
    
    // 신뢰할 수 있는 소스만 허용
    TrustedSkinSources.addTrustedDomain('production-cdn.withcookie.com', process.env.SKIN_ADMIN_KEY!);
  }
  
  private static enablePerformanceOptimizations(): void {
    // 스마트 프리로딩 활성화
    skinPreloader.enableSmartPreloading();
    
    // 메모리 관리 시작
    SkinMemoryManager.periodicCleanup();
    
    // 적응적 로딩 최적화 활성화
    adaptiveOptimizer.enable();
  }
  
  private static startMonitoring(): void {
    // 성능 모니터링 시작
    SkinPerformanceMonitor.startMonitoring();
    
    // 로그 수집 레벨 설정
    SkinLogCollector.setLogLevel('WARN'); // 프로덕션에서는 WARN 이상만
  }
  
  private static setupErrorReporting(): void {
    // 전역 에러 핸들러
    window.addEventListener('error', (event) => {
      if (SecurityMonitor.isSkinRelatedError(event)) {
        SkinLogCollector.log('ERROR', 'Unhandled error in skin system', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          stack: event.error?.stack
        });
      }
    });
    
    // Promise 거부 핸들러
    window.addEventListener('unhandledrejection', (event) => {
      SkinLogCollector.log('ERROR', 'Unhandled promise rejection in skin system', {
        reason: event.reason,
        stack: event.reason?.stack
      });
    });
  }
}

// 환경별 자동 구성
if (process.env.NODE_ENV === 'production') {
  ProductionConfig.configure();
}
```

### 2. 헬스 체크 및 진단

```typescript
// 시스템 헬스 체크
export class SkinSystemHealthCheck {
  public static async performHealthCheck(): Promise<any> {
    const results = {
      timestamp: Date.now(),
      status: 'healthy',
      checks: {
        skinRegistry: await this.checkSkinRegistry(),
        loadingSystem: await this.checkLoadingSystem(),
        security: await this.checkSecurity(),
        performance: await this.checkPerformance(),
        memory: await this.checkMemory()
      },
      recommendations: []
    };
    
    // 전체 상태 평가
    const failedChecks = Object.values(results.checks).filter(check => !check.healthy);
    if (failedChecks.length > 0) {
      results.status = failedChecks.length > 2 ? 'critical' : 'warning';
    }
    
    // 권장사항 생성
    results.recommendations = this.generateRecommendations(results.checks);
    
    return results;
  }
  
  private static async checkSkinRegistry(): Promise<any> {
    const check = {
      name: 'Skin Registry',
      healthy: true,
      details: {},
      issues: []
    };
    
    try {
      const allSkins = getAllComponentSkins();
      check.details.totalSkins = allSkins.length;
      check.details.loadedSkins = allSkins.filter(skin => skin.loaded).length;
      check.details.errorSkins = allSkins.filter(skin => skin.error).length;
      
      if (check.details.errorSkins > 0) {
        check.healthy = false;
        check.issues.push(`${check.details.errorSkins}개 스킨에 오류가 있습니다`);
      }
      
    } catch (error) {
      check.healthy = false;
      check.issues.push(`스킨 레지스트리 접근 실패: ${error.message}`);
    }
    
    return check;
  }
  
  private static async checkLoadingSystem(): Promise<any> {
    const check = {
      name: 'Loading System',
      healthy: true,
      details: {},
      issues: []
    };
    
    try {
      // 테스트 스킨 로딩 시도
      const testLoadTime = await this.measureTestSkinLoad();
      check.details.testLoadTime = testLoadTime;
      
      if (testLoadTime > 5000) { // 5초 이상
        check.healthy = false;
        check.issues.push('스킨 로딩 시간이 너무 깁니다');
      }
      
      // 캐시 상태 확인
      const cacheStats = getCacheStats();
      check.details.cacheHitRate = cacheStats.hitRate;
      
      if (parseFloat(cacheStats.hitRate) < 70) { // 70% 미만
        check.issues.push('캐시 히트율이 낮습니다');
      }
      
    } catch (error) {
      check.healthy = false;
      check.issues.push(`로딩 시스템 테스트 실패: ${error.message}`);
    }
    
    return check;
  }
  
  private static async checkSecurity(): Promise<any> {
    const check = {
      name: 'Security',
      healthy: true,
      details: {},
      issues: []
    };
    
    // 최근 보안 알림 확인
    const recentAlerts = SecurityMonitor.getRecentAlerts();
    check.details.securityAlerts = recentAlerts.length;
    
    if (recentAlerts.length > 5) { // 5개 이상
      check.healthy = false;
      check.issues.push('최근 보안 알림이 많습니다');
    }
    
    // CSP 상태 확인
    const cspEnabled = this.isCSPEnabled();
    check.details.cspEnabled = cspEnabled;
    
    if (!cspEnabled) {
      check.issues.push('CSP가 활성화되지 않았습니다');
    }
    
    return check;
  }
  
  private static async checkPerformance(): Promise<any> {
    const check = {
      name: 'Performance',
      healthy: true,
      details: {},
      issues: []
    };
    
    // 성능 메트릭 확인
    const performanceReport = SkinPerformanceMonitor.generateReport();
    check.details.performanceMetrics = performanceReport.summary;
    
    // 평균 렌더링 시간 확인
    const avgRenderTime = performanceReport.summary.rendering?.avgDuration || 0;
    if (avgRenderTime > 100) { // 100ms 이상
      check.healthy = false;
      check.issues.push('평균 렌더링 시간이 깁니다');
    }
    
    return check;
  }
  
  private static async checkMemory(): Promise<any> {
    const check = {
      name: 'Memory',
      healthy: true,
      details: {},
      issues: []
    };
    
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const usagePercent = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
      
      check.details.memoryUsage = usagePercent.toFixed(2) + '%';
      
      if (usagePercent > 80) { // 80% 이상
        check.healthy = false;
        check.issues.push('메모리 사용량이 높습니다');
      }
    }
    
    return check;
  }
  
  private static generateRecommendations(checks: any): string[] {
    const recommendations = [];
    
    Object.values(checks).forEach((check: any) => {
      if (!check.healthy) {
        switch (check.name) {
          case 'Loading System':
            recommendations.push('CDN 사용을 고려하거나 스킨 번들 크기를 최적화하세요');
            break;
          case 'Security':
            recommendations.push('보안 정책을 검토하고 의심스러운 활동을 조사하세요');
            break;
          case 'Performance':
            recommendations.push('성능 프로파일링을 수행하고 병목 지점을 최적화하세요');
            break;
          case 'Memory':
            recommendations.push('메모리 누수를 확인하고 정리되지 않은 리소스를 해제하세요');
            break;
        }
      }
    });
    
    return recommendations;
  }
  
  private static async measureTestSkinLoad(): Promise<number> {
    // 간단한 테스트 스킨 로딩 시간 측정
    const start = performance.now();
    try {
      // 기본 스킨이나 테스트용 스킨 로딩
      await Promise.race([
        loadComponentSkin('basic-test-skin'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
      ]);
    } catch (error) {
      // 테스트 목적이므로 에러는 무시
    }
    return performance.now() - start;
  }
  
  private static isCSPEnabled(): boolean {
    const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    return metaTags.length > 0;
  }
}

// 주기적 헬스 체크 실행
setInterval(async () => {
  const healthCheck = await SkinSystemHealthCheck.performHealthCheck();
  
  if (healthCheck.status !== 'healthy') {
    console.warn('🏥 스킨 시스템 헬스 체크 경고:', healthCheck);
    
    // 관리자에게 알림 전송
    fetch('/api/health/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(healthCheck)
    }).catch(err => console.error('헬스 체크 알림 전송 실패:', err));
  }
}, 5 * 60 * 1000); // 5분마다 실행
```

---

## 다음 단계

다음 섹션에서는 실제 개발 과정과 운영 가이드를 다룹니다:

1. 💻 **[개발 가이드](../development/)** - 실제 스킨 개발 과정
2. 🚀 **[배포 및 호스팅](../deployment/)** - 운영 환경 구성
3. ⚙️ **[운영 관리](../operations/)** - 지속적인 운영 방법

---

> **💡 핵심 포인트**: 보안과 성능은 스킨 시스템의 핵심 요소입니다. 신뢰할 수 있는 소스 관리, 런타임 보안 모니터링, 성능 최적화, 그리고 지속적인 관찰성을 통해 안정적이고 빠른 사용자 경험을 제공할 수 있습니다.