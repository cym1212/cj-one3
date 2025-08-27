# 📋 Props 인터페이스 참조

## 📋 목차
1. [ComponentSkinProps](#componentskinprops)
2. [ExternalSkinProps](#externalskinprops)
3. [타입별 특화 Props](#타입별-특화-props)
4. [유틸리티 함수](#유틸리티-함수)
5. [앱 데이터 구조](#앱-데이터-구조)
6. [에디터 Props](#에디터-props)

---

## ComponentSkinProps

개별 컴포넌트 스킨에 전달되는 기본 Props 인터페이스입니다.

### 기본 구조

```typescript
interface ComponentSkinProps {
  /** 컴포넌트 데이터 및 상태 */
  data: ComponentData;
  
  /** 사용자 상호작용 핸들러 함수들 */
  actions: ComponentActions;
  
  /** 사용자 설정 가능한 옵션들 */
  options: ComponentOptions;
  
  /** 렌더링 모드 */
  mode: ComponentRenderMode;
  
  /** 유틸리티 함수들 */
  utils: UtilityFunctions;
  
  /** 전역 앱 데이터 (선택적) */
  app?: GlobalAppData;
  
  /** 에디터 관련 Props (에디터 모드에서만) */
  editor?: EditorProps;
}
```

### data: ComponentData

```typescript
interface ComponentData {
  /** 컴포넌트 식별자 */
  componentId?: string;
  
  /** 컴포넌트 타입 */
  componentType?: string;
  
  /** 동적 상태 데이터 (컴포넌트별로 다름) */
  [key: string]: any;
}
```

**일반적인 data 필드들:**

| 필드명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| `loading` | `boolean` | 로딩 상태 | `true`, `false` |
| `error` | `string \| null` | 에러 메시지 | `"로그인에 실패했습니다"` |
| `success` | `boolean` | 성공 상태 | `true`, `false` |
| `formData` | `object` | 폼 입력 데이터 | `{ username: "user1" }` |
| `validationErrors` | `Record<string, string>` | 유효성 검사 오류 | `{ email: "이메일 형식이 잘못되었습니다" }` |
| `items` | `array` | 목록 데이터 | `[{ id: 1, name: "Item 1" }]` |
| `currentPage` | `number` | 현재 페이지 | `1`, `2`, `3` |
| `totalItems` | `number` | 전체 아이템 수 | `150` |
| `theme` | `ThemeData` | 테마 정보 | `{ primaryColor: "#007bff" }` |

### actions: ComponentActions

```typescript
interface ComponentActions {
  /** 사용자 상호작용 핸들러들 */
  [actionName: string]: Function;
}
```

**일반적인 actions:**

| 액션명 | 시그니처 | 설명 | 예시 |
|--------|----------|------|------|
| `handleSubmit` | `(e: FormEvent) => void` | 폼 제출 | 로그인, 회원가입 |
| `handleChange` | `(e: ChangeEvent) => void` | 입력 변경 | 텍스트 필드 |
| `handleClick` | `(e: MouseEvent) => void` | 클릭 이벤트 | 버튼, 링크 |
| `handlePageChange` | `(page: number) => void` | 페이지 변경 | 페이지네이션 |
| `handleSort` | `(column: string) => void` | 정렬 변경 | 테이블 |
| `handleFilter` | `(filters: object) => void` | 필터 적용 | 검색, 필터링 |
| `handleDelete` | `(id: string) => void` | 삭제 액션 | 리스트 아이템 |
| `handleEdit` | `(id: string) => void` | 편집 액션 | 프로필, 설정 |

### options: ComponentOptions

```typescript
interface ComponentOptions {
  /** 사용자 설정 가능한 옵션들 */
  [optionName: string]: any;
}
```

**일반적인 options:**

| 옵션명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `title` | `string` | `""` | 컴포넌트 제목 |
| `subtitle` | `string` | `""` | 부제목 |
| `placeholder` | `string` | `""` | 입력 필드 플레이스홀더 |
| `buttonText` | `string` | `"확인"` | 버튼 텍스트 |
| `showHeader` | `boolean` | `true` | 헤더 표시 여부 |
| `showFooter` | `boolean` | `true` | 푸터 표시 여부 |
| `allowMultiple` | `boolean` | `false` | 다중 선택 허용 |
| `maxItems` | `number` | `10` | 최대 아이템 수 |
| `sortBy` | `string` | `"name"` | 기본 정렬 기준 |
| `theme` | `string` | `"default"` | 테마 이름 |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | 크기 |
| `variant` | `string` | `"default"` | 스타일 변형 |

### mode: ComponentRenderMode

```typescript
type ComponentRenderMode = 'editor' | 'preview' | 'production';
```

| 모드 | 설명 | 상호작용 | 데이터 저장 |
|------|------|----------|-------------|
| `editor` | 에디터에서 편집 중 | ❌ 비활성화 | ❌ 무시 |
| `preview` | 미리보기 모드 | ✅ 활성화 | ❌ 무시 |
| `production` | 실제 운영 모드 | ✅ 활성화 | ✅ 저장 |

---

## ExternalSkinProps

외부 레이아웃 스킨에 전달되는 Props 인터페이스입니다.

### 기본 구조

```typescript
interface ExternalSkinProps {
  /** 전역 애플리케이션 데이터 */
  data: GlobalApplicationData;
  
  /** 전역 액션 함수들 */
  actions: GlobalActions;
  
  /** 유틸리티 함수들 */
  utils: UtilityFunctions;
  
  /** 레이아웃 설정 및 컨텐츠 */
  layout: LayoutConfiguration;
  
  /** 테마 설정 */
  theme?: ThemeConfiguration;
}
```

### data: GlobalApplicationData

```typescript
interface GlobalApplicationData {
  /** 사용자 정보 */
  user: User | null;
  
  /** 회사/조직 정보 */
  company: Company | null;
  
  /** WithCookie 플랫폼 데이터 */
  withcookieData: WithcookieData;
  
  /** 메뉴 구조 */
  menus: Menu[];
  globalMenus: Menu[];
  mainMenus: Menu[];
  
  /** 자산 및 거래 데이터 */
  assetBalances: AssetBalance[];
  transactions: Transaction[];
  
  /** 장바구니 아이템 */
  cartItems: CartItem[];
  
  /** 인증 상태 */
  isUserLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  
  /** 다국어 설정 */
  currentLanguage: string;
  translations: TranslationData;
}
```

#### User 인터페이스

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  roles: string[];
  permissions: string[];
  preferences: UserPreferences;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  timezone: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}
```

#### Company 인터페이스

```typescript
interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  domain?: string;
  industry?: string;
  settings: CompanySettings;
  branding: BrandingSettings;
  createdAt: string;
  updatedAt: string;
}

interface CompanySettings {
  allowUserRegistration: boolean;
  requireEmailVerification: boolean;
  maxUsersPerCompany: number;
  features: string[];
}

interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  customCSS?: string;
}
```

#### Menu 인터페이스

```typescript
interface Menu {
  id: string;
  name: string;
  path: string;
  icon?: string;
  type: 'global' | 'main' | 'footer';
  order: number;
  parentId?: string;
  children?: Menu[];
  permissions?: string[];
  isActive: boolean;
  isVisible: boolean;
}
```

### actions: GlobalActions

```typescript
interface GlobalActions {
  /** 인증 관련 액션 */
  onLogin: (credentials: LoginCredentials) => Promise<AuthResult>;
  onLogout: () => void;
  onCheckAuth: () => Promise<AuthStatus>;
  
  /** 데이터 페칭 액션 */
  onFetchBalances: () => Promise<AssetBalance[]>;
  onFetchTransactions: (params: TransactionParams) => Promise<Transaction[]>;
  onFetchMenus: () => Promise<Menu[]>;
  
  /** 상태 업데이트 액션 */
  onUpdateCart: (item: CartItem) => void;
  onUpdateProfile: (profileData: Partial<User>) => Promise<User>;
  onChangeLanguage: (language: string) => void;
  onChangeTheme: (theme: 'light' | 'dark' | 'auto') => void;
  
  /** 네비게이션 액션 */
  onNavigate: (path: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
}
```

### layout: LayoutConfiguration

```typescript
interface LayoutConfiguration {
  /** 페이지 컨텐츠 (가장 중요) */
  children: React.ReactNode;
  
  /** 현재 활성 메뉴 ID */
  currentMenuId?: string;
  
  /** 브레드크럼 */
  breadcrumbs: Breadcrumb[];
  
  /** 페이지 제목 */
  pageTitle: string;
  
  /** 레이아웃 표시 옵션 */
  showHeader: boolean;
  showFooter: boolean;
  showSidebar: boolean;
  showBreadcrumbs: boolean;
  
  /** CSS 클래스 */
  containerClass?: string;
  contentClass?: string;
  headerClass?: string;
  footerClass?: string;
  
  /** 메타 데이터 */
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
}

interface Breadcrumb {
  label: string;
  path?: string;
  icon?: string;
  isActive: boolean;
}
```

---

## 타입별 특화 Props

### 로그인 컴포넌트

```typescript
interface LoginComponentProps extends ComponentSkinProps {
  data: {
    formData: {
      user_id: string;
      password: string;
      rememberMe?: boolean;
    };
    validationErrors: {
      user_id?: string;
      password?: string;
      submit?: string;
    };
    loading: boolean;
    loginSuccess: boolean;
    loginError?: string;
    theme: ThemeColors;
    redirectUrl?: string;
  };
  actions: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleSignupClick: () => void;
    handleForgotPassword: () => void;
    handleRememberMeChange: (checked: boolean) => void;
  };
  options: {
    title?: string;
    showSignupLink?: boolean;
    showForgotPassword?: boolean;
    showRememberMe?: boolean;
    brandLogo?: string;
    backgroundImage?: string;
    style?: 'minimal' | 'card' | 'fullscreen';
  };
}
```

### 회원가입 컴포넌트

```typescript
interface SignupComponentProps extends ComponentSkinProps {
  data: {
    formData: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
      firstName?: string;
      lastName?: string;
      agreeToTerms: boolean;
      agreeToMarketing?: boolean;
    };
    validationErrors: Record<string, string>;
    loading: boolean;
    signupSuccess: boolean;
    signupError?: string;
    passwordStrength: {
      score: number;
      feedback: string[];
    };
  };
  actions: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleLoginClick: () => void;
    handleTermsClick: () => void;
    handlePasswordCheck: (password: string) => void;
  };
  options: {
    title?: string;
    subtitle?: string;
    showLoginLink?: boolean;
    requireFirstName?: boolean;
    requireLastName?: boolean;
    showMarketingConsent?: boolean;
    passwordMinLength?: number;
    enablePasswordStrength?: boolean;
  };
}
```

### 프로필 컴포넌트

```typescript
interface ProfileComponentProps extends ComponentSkinProps {
  data: {
    userProfile: {
      id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      profileImage?: string;
      bio?: string;
      website?: string;
      location?: string;
      birthDate?: string;
      phoneNumber?: string;
    };
    isEditing: boolean;
    editableFields: {
      [fieldName: string]: any;
    };
    validationErrors: Record<string, string>;
    loading: boolean;
    saveSuccess: boolean;
    saveError?: string;
    uploadProgress?: number;
  };
  actions: {
    handleEdit: () => void;
    handleCancel: () => void;
    handleSave: () => void;
    handleFieldChange: (field: string, value: any) => void;
    handleImageUpload: (file: File) => void;
    handleImageRemove: () => void;
  };
  options: {
    allowImageUpload?: boolean;
    maxImageSize?: number;
    editableFields?: string[];
    showSocialLinks?: boolean;
    showBio?: boolean;
    dateFormat?: string;
  };
}
```

### 대시보드 컴포넌트

```typescript
interface DashboardComponentProps extends ComponentSkinProps {
  data: {
    widgets: DashboardWidget[];
    layout: DashboardLayout;
    metrics: {
      totalUsers: number;
      activeUsers: number;
      revenue: number;
      growth: number;
    };
    chartData: {
      labels: string[];
      datasets: ChartDataset[];
    };
    notifications: Notification[];
    loading: boolean;
    lastUpdated: string;
  };
  actions: {
    onWidgetReorder: (widgets: DashboardWidget[]) => void;
    onWidgetResize: (widgetId: string, size: WidgetSize) => void;
    onWidgetRemove: (widgetId: string) => void;
    onWidgetAdd: (widget: DashboardWidget) => void;
    onRefresh: () => void;
    onNotificationRead: (notificationId: string) => void;
  };
  options: {
    allowWidgetReorder?: boolean;
    allowWidgetResize?: boolean;
    showNotifications?: boolean;
    refreshInterval?: number;
    defaultLayout?: 'grid' | 'masonry' | 'flex';
  };
}

interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: WidgetConfig;
  data?: any;
}
```

---

## 유틸리티 함수

### UtilityFunctions 인터페이스

```typescript
interface UtilityFunctions {
  /** 다국어 번역 함수 */
  t: TranslationFunction;
  
  /** 페이지 네비게이션 */
  navigate: NavigationFunction;
  
  /** 포맷팅 함수들 */
  formatCurrency: CurrencyFormatter;
  formatDate: DateFormatter;
  formatNumber: NumberFormatter;
  
  /** 에셋 및 URL 관련 */
  getAssetUrl: AssetUrlGenerator;
  
  /** CSS 클래스 조합 */
  cx: ClassNameFunction;
  
  /** 유효성 검사 */
  validate: ValidationFunction;
  
  /** 로컬 스토리지 */
  storage: StorageUtils;
}
```

### 세부 함수 시그니처

#### 번역 함수
```typescript
type TranslationFunction = (
  key: string,
  params?: Record<string, any>,
  options?: {
    defaultValue?: string;
    interpolation?: boolean;
    escapeValue?: boolean;
  }
) => string;

// 사용 예시
utils.t('login.welcome', { name: 'John' });
// → "환영합니다, John님!"

utils.t('items.count', { count: 5 });
// → "5개 아이템"
```

#### 네비게이션 함수
```typescript
type NavigationFunction = (
  path: string,
  options?: {
    replace?: boolean;
    state?: any;
    search?: string;
    hash?: string;
  }
) => void;

// 사용 예시
utils.navigate('/profile');
utils.navigate('/users', { replace: true });
utils.navigate('/search', { search: '?q=test' });
```

#### 포맷팅 함수들
```typescript
type CurrencyFormatter = (
  amount: number,
  currency?: string,
  options?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
) => string;

type DateFormatter = (
  date: Date | string | number,
  format?: string,
  options?: {
    locale?: string;
    timezone?: string;
  }
) => string;

type NumberFormatter = (
  number: number,
  options?: {
    style?: 'decimal' | 'percent';
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
) => string;

// 사용 예시
utils.formatCurrency(1234.56, 'KRW');
// → "₩1,235"

utils.formatDate('2024-01-15', 'YYYY년 MM월 DD일');
// → "2024년 01월 15일"

utils.formatNumber(0.1234, { style: 'percent' });
// → "12.34%"
```

#### 클래스명 조합 함수
```typescript
type ClassNameFunction = (...classes: Array<
  string | 
  Record<string, boolean> | 
  Array<string | Record<string, boolean>> |
  undefined |
  null |
  false
>) => string;

// 사용 예시
utils.cx('btn', 'btn-primary');
// → "btn btn-primary"

utils.cx('btn', { 
  'btn-large': size === 'large',
  'btn-disabled': disabled 
});
// → "btn btn-large" (if size === 'large' && !disabled)

utils.cx(['btn', 'btn-primary'], { 'active': isActive });
// → "btn btn-primary active" (if isActive)
```

#### 유효성 검사 함수
```typescript
interface ValidationFunction {
  email: (email: string) => boolean;
  password: (password: string, options?: PasswordOptions) => ValidationResult;
  required: (value: any) => boolean;
  minLength: (value: string, min: number) => boolean;
  maxLength: (value: string, max: number) => boolean;
  pattern: (value: string, pattern: RegExp) => boolean;
  custom: (value: any, validator: Function) => ValidationResult;
}

interface PasswordOptions {
  minLength?: number;
  requireNumbers?: boolean;
  requireSymbols?: boolean;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  score?: number;
}

// 사용 예시
utils.validate.email('user@example.com');
// → true

utils.validate.password('MyPassword123!', {
  minLength: 8,
  requireNumbers: true,
  requireSymbols: true
});
// → { isValid: true, errors: [], score: 4 }
```

#### 스토리지 유틸리티
```typescript
interface StorageUtils {
  get: <T = any>(key: string, defaultValue?: T) => T;
  set: (key: string, value: any, options?: StorageOptions) => void;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
}

interface StorageOptions {
  expiry?: number; // milliseconds
  encrypt?: boolean;
}

// 사용 예시
utils.storage.set('user-preferences', { theme: 'dark' });
utils.storage.get('user-preferences', { theme: 'light' });
// → { theme: 'dark' }

utils.storage.set('session-data', data, { expiry: 3600000 }); // 1시간
```

---

## 앱 데이터 구조

### GlobalAppData 인터페이스

```typescript
interface GlobalAppData {
  /** 현재 사용자 */
  user: User | null;
  
  /** 회사 정보 */
  company: Company | null;
  
  /** 현재 언어 */
  currentLanguage: string;
  
  /** 로그인 상태 */
  isUserLoggedIn: boolean;
  
  /** 테마 설정 */
  theme: ThemeConfiguration;
  
  /** 권한 정보 */
  permissions: string[];
  
  /** 기능 플래그 */
  features: FeatureFlags;
  
  /** 환경 정보 */
  environment: EnvironmentInfo;
}
```

### ThemeConfiguration

```typescript
interface ThemeConfiguration {
  mode: 'light' | 'dark' | 'auto';
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    base: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    base: string;
    lg: string;
  };
}
```

### FeatureFlags

```typescript
interface FeatureFlags {
  /** 새로운 UI 기능 */
  newDashboard: boolean;
  
  /** 베타 기능들 */
  betaFeatures: boolean;
  
  /** A/B 테스트 변형 */
  experimentVariant: string;
  
  /** 외부 통합 기능 */
  externalIntegrations: boolean;
  
  /** 고급 분석 기능 */
  advancedAnalytics: boolean;
  
  /** 사용자 정의 플래그들 */
  [customFlag: string]: boolean | string | number;
}
```

---

## 에디터 Props

에디터 모드에서만 제공되는 추가 Props입니다.

### EditorProps 인터페이스

```typescript
interface EditorProps {
  /** 옵션 변경 핸들러 */
  onOptionChange: OptionChangeHandler;
  
  /** 스타일 변경 핸들러 */
  onStyleChange: StyleChangeHandler;
  
  /** 컴포넌트 상태 */
  isSelected: boolean;
  isDragging: boolean;
  isResizing: boolean;
  
  /** 편집 도구들 */
  tools: EditorTools;
  
  /** 에디터 설정 */
  settings: EditorSettings;
}
```

### 핸들러 함수들

```typescript
type OptionChangeHandler = (
  key: string,
  value: any,
  options?: {
    debounce?: number;
    validate?: boolean;
    persist?: boolean;
  }
) => void;

type StyleChangeHandler = (
  styles: React.CSSProperties,
  options?: {
    merge?: boolean;
    important?: boolean;
  }
) => void;

// 사용 예시
editor.onOptionChange('title', '새로운 제목');
editor.onOptionChange('showHeader', false, { persist: true });

editor.onStyleChange({ 
  backgroundColor: '#f0f0f0',
  padding: '20px' 
});
```

### EditorTools

```typescript
interface EditorTools {
  /** 실행 취소/재실행 */
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  /** 복사/붙여넣기 */
  copy: () => void;
  paste: () => void;
  duplicate: () => void;
  
  /** 컴포넌트 조작 */
  move: (direction: 'up' | 'down' | 'left' | 'right') => void;
  resize: (size: { width?: number; height?: number }) => void;
  delete: () => void;
  
  /** 스타일 도구 */
  getComputedStyles: () => React.CSSProperties;
  applyPreset: (presetName: string) => void;
  
  /** 미리보기 */
  preview: () => void;
  
  /** 저장 */
  save: () => Promise<void>;
  autoSave: boolean;
}
```

### EditorSettings

```typescript
interface EditorSettings {
  /** 그리드 설정 */
  grid: {
    enabled: boolean;
    size: number;
    snapToGrid: boolean;
  };
  
  /** 가이드라인 */
  guidelines: {
    enabled: boolean;
    showMargins: boolean;
    showPadding: boolean;
  };
  
  /** 반응형 미리보기 */
  responsive: {
    currentBreakpoint: 'mobile' | 'tablet' | 'desktop';
    showBreakpointIndicator: boolean;
  };
  
  /** 에디터 테마 */
  theme: 'light' | 'dark';
  
  /** 개발자 도구 */
  devMode: boolean;
  showPropsInspector: boolean;
  showPerformanceMetrics: boolean;
}
```

---

## 사용 예시

### 기본 스킨 컴포넌트

```typescript
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';

const MyCustomSkin: React.FC<ComponentSkinProps> = ({
  data,
  actions,
  options,
  mode,
  utils,
  app,
  editor
}) => {
  // 에디터 모드 체크
  const isEditing = mode === 'editor';
  
  // 옵션 기본값 설정
  const {
    title = utils.t('default.title'),
    showHeader = true,
    variant = 'default'
  } = options;
  
  // 로딩 상태 처리
  if (data.loading) {
    return (
      <div className="loading-container">
        <span className="spinner" />
        {utils.t('common.loading')}
      </div>
    );
  }
  
  // 에러 상태 처리
  if (data.error) {
    return (
      <div className="error-container" role="alert">
        <span className="error-icon">⚠️</span>
        {data.error}
      </div>
    );
  }
  
  return (
    <div 
      className={utils.cx('my-custom-skin', `variant-${variant}`, {
        'is-editing': isEditing,
        'is-selected': editor?.isSelected
      })}
      style={{
        '--primary-color': app?.theme?.colors?.primary || '#007bff'
      } as React.CSSProperties}
    >
      {showHeader && (
        <header className="skin-header">
          <h2>{title}</h2>
        </header>
      )}
      
      <main className="skin-content">
        {/* 컨텐츠 렌더링 */}
        {data.items?.map((item, index) => (
          <div key={item.id || index} className="skin-item">
            {item.name}
          </div>
        ))}
      </main>
      
      {!isEditing && (
        <footer className="skin-footer">
          <button 
            onClick={actions.handleRefresh}
            disabled={data.loading}
          >
            {utils.t('common.refresh')}
          </button>
        </footer>
      )}
    </div>
  );
};

export default MyCustomSkin;
```

### TypeScript 타입 가드

```typescript
// Props 타입 체크 헬퍼 함수들
export function isLoginProps(props: ComponentSkinProps): props is LoginComponentProps {
  return 'formData' in props.data && 'user_id' in props.data.formData;
}

export function isSignupProps(props: ComponentSkinProps): props is SignupComponentProps {
  return 'formData' in props.data && 'username' in props.data.formData;
}

export function hasAction<T extends keyof ComponentActions>(
  props: ComponentSkinProps,
  actionName: T
): props is ComponentSkinProps & { actions: Record<T, Function> } {
  return actionName in props.actions && typeof props.actions[actionName] === 'function';
}

// 사용 예시
const MyAdaptiveSkin: React.FC<ComponentSkinProps> = (props) => {
  if (isLoginProps(props)) {
    // 이제 props.data.formData.user_id 접근 가능
    return <LoginSkin {...props} />;
  }
  
  if (isSignupProps(props)) {
    // 이제 props.data.formData.username 접근 가능
    return <SignupSkin {...props} />;
  }
  
  return <GenericSkin {...props} />;
};
```

---

## 다음 단계

1. 📦 **[코드 예제](../examples/)** - 실제 동작하는 스킨 예제들
2. 🚀 **[배포 가이드](../deployment/)** - CDN 및 호스팅 옵션
3. ⚙️ **[운영 가이드](../operations/)** - 모니터링 및 관리

---

> **💡 핵심 포인트**: Props 인터페이스를 정확히 이해하고 활용하면 **타입 안전성, 개발 효율성, 코드 품질**을 모두 향상시킬 수 있습니다. TypeScript와 함께 사용하면 컴파일 타임에 오류를 방지하고 IDE의 자동완성 기능을 최대한 활용할 수 있습니다.