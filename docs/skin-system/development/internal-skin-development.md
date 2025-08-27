# 🏠 내부 스킨 개발 가이드

## 📋 목차
1. [내부 스킨 개요](#내부-스킨-개요)
2. [개발 환경 설정](#개발-환경-설정)
3. [스킨 생성 단계](#스킨-생성-단계)
4. [스킨 등록 및 관리](#스킨-등록-및-관리)
5. [고급 기능 구현](#고급-기능-구현)
6. [테스트 및 검증](#테스트-및-검증)
7. [배포 및 관리](#배포-및-관리)

---

## 내부 스킨 개요

### 내부 스킨 vs 외부 스킨

| 특징 | 내부 스킨 | 외부 스킨 |
|------|-----------|-----------|
| **위치** | 프로젝트 내부 | 외부 CDN/서버 |
| **로딩** | 빌드 시 포함 | 런타임 동적 로딩 |
| **번들 크기** | 메인 번들에 포함 | 독립적 |
| **캐싱** | 브라우저 캐시 | 별도 캐싱 시스템 |
| **개발 속도** | 빠름 | 중간 |
| **유연성** | 제한적 | 높음 |
| **보안** | 높음 | 검증 필요 |

### 내부 스킨 사용 시나리오

```typescript
// ✅ 내부 스킨이 적합한 경우
const scenarios = [
  '기본 제공 스킨',
  '회사 표준 디자인 시스템',
  '핵심 비즈니스 컴포넌트',
  '빠른 로딩이 필요한 경우',
  '높은 보안이 요구되는 환경'
];

// ⚠️ 외부 스킨을 고려해야 하는 경우
const externalScenarios = [
  '고객별 커스터마이징',
  '서드파티 개발자 지원',
  '런타임 테마 변경',
  '번들 크기 최적화 필요',
  '독립적 배포 주기'
];
```

---

## 개발 환경 설정

### 1. 프로젝트 구조

```
src/
├── components/
│   └── skins/                    # 스킨 관련 파일들
│       ├── internal/             # 내부 스킨들
│       │   ├── basic/            # 기본 스킨 세트
│       │   │   ├── BasicLoginSkin.tsx
│       │   │   ├── BasicSignupSkin.tsx
│       │   │   └── index.ts
│       │   ├── modern/           # 모던 스킨 세트
│       │   │   ├── ModernLoginSkin.tsx
│       │   │   ├── ModernSignupSkin.tsx
│       │   │   └── index.ts
│       │   └── index.ts          # 전체 내부 스킨 export
│       ├── ComponentSkinWrapper.js
│       ├── ComponentSkinLoader.js
│       └── types.ts              # 스킨 타입 정의
└── styles/
    └── skins/                    # 스킨별 스타일
        ├── basic/
        │   ├── login.css
        │   └── signup.css
        └── modern/
            ├── login.css
            └── signup.css
```

### 2. 타입 정의 설정

```typescript
// src/components/skins/types.ts
import { ComponentSkinProps } from '@withcookie/skin-types';

// 내부 스킨 컴포넌트 타입
export type InternalSkinComponent<T = ComponentSkinProps> = React.FC<T>;

// 스킨 세트 정의
export interface SkinSet {
  id: string;
  name: string;
  description: string;
  skins: {
    [componentType: string]: InternalSkinComponent;
  };
}

// 내부 스킨 등록 인터페이스
export interface InternalSkinRegistry {
  [setId: string]: SkinSet;
}
```

---

## 스킨 생성 단계

### 단계 1: 기본 스킨 컴포넌트 생성

```typescript
// src/components/skins/internal/basic/BasicLoginSkin.tsx
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';
import './BasicLoginSkin.css';

interface BasicLoginSkinProps extends ComponentSkinProps {
  data: {
    formData: {
      user_id: string;
      password: string;
    };
    validationErrors: Record<string, string>;
    loading: boolean;
    loginError?: string;
    theme?: {
      primaryColor?: string;
      secondaryColor?: string;
    };
  };
  actions: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleSignupClick?: () => void;
  };
  options: {
    title?: string;
    showSignupLink?: boolean;
    showRememberMe?: boolean;
    brandLogo?: string;
  };
}

const BasicLoginSkin: React.FC<BasicLoginSkinProps> = ({
  data,
  actions,
  options,
  mode,
  utils,
  app
}) => {
  const {
    formData,
    validationErrors,
    loading,
    loginError,
    theme
  } = data;
  
  const {
    handleChange,
    handleSubmit,
    handleSignupClick
  } = actions;
  
  const {
    title = '로그인',
    showSignupLink = true,
    showRememberMe = false,
    brandLogo
  } = options;

  // 에디터 모드에서는 상호작용 비활성화
  const isInteractive = mode !== 'editor';

  return (
    <div className="basic-login-skin">
      {/* 브랜드 영역 */}
      {brandLogo && (
        <div className="brand-section">
          <img 
            src={utils.getAssetUrl(brandLogo)} 
            alt={app.company?.name || 'Brand Logo'} 
            className="brand-logo"
          />
        </div>
      )}
      
      {/* 제목 */}
      <h2 className="login-title">{title}</h2>
      
      {/* 에러 메시지 */}
      {loginError && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span className="alert-message">{loginError}</span>
        </div>
      )}
      
      {/* 로그인 폼 */}
      <form 
        onSubmit={isInteractive ? handleSubmit : (e) => e.preventDefault()}
        className="login-form"
        noValidate
      >
        {/* 사용자 ID 필드 */}
        <div className="form-group">
          <label htmlFor="user_id" className="form-label">
            {utils.t('login.userId')}
          </label>
          <input
            type="text"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={isInteractive ? handleChange : undefined}
            className={utils.cx('form-input', {
              'form-input--error': validationErrors.user_id
            })}
            placeholder={utils.t('login.userIdPlaceholder')}
            disabled={!isInteractive || loading}
            autoComplete="username"
            aria-describedby={validationErrors.user_id ? 'user_id-error' : undefined}
            aria-invalid={!!validationErrors.user_id}
          />
          {validationErrors.user_id && (
            <div id="user_id-error" className="form-error" role="alert">
              {validationErrors.user_id}
            </div>
          )}
        </div>
        
        {/* 비밀번호 필드 */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            {utils.t('login.password')}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={isInteractive ? handleChange : undefined}
            className={utils.cx('form-input', {
              'form-input--error': validationErrors.password
            })}
            placeholder={utils.t('login.passwordPlaceholder')}
            disabled={!isInteractive || loading}
            autoComplete="current-password"
            aria-describedby={validationErrors.password ? 'password-error' : undefined}
            aria-invalid={!!validationErrors.password}
          />
          {validationErrors.password && (
            <div id="password-error" className="form-error" role="alert">
              {validationErrors.password}
            </div>
          )}
        </div>
        
        {/* 로그인 유지 옵션 */}
        {showRememberMe && (
          <div className="form-group form-group--checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                disabled={!isInteractive}
              />
              <span className="checkbox-text">
                {utils.t('login.rememberMe')}
              </span>
            </label>
          </div>
        )}
        
        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={!isInteractive || loading}
          aria-label={loading ? utils.t('login.loggingIn') : utils.t('login.submit')}
        >
          {loading && isInteractive ? (
            <>
              <span className="btn-spinner" aria-hidden="true"></span>
              {utils.t('login.loggingIn')}
            </>
          ) : (
            utils.t('login.submit')
          )}
        </button>
      </form>
      
      {/* 회원가입 링크 */}
      {showSignupLink && handleSignupClick && (
        <div className="signup-section">
          <p className="signup-text">
            {utils.t('login.noAccount')}
            <button
              type="button"
              onClick={isInteractive ? handleSignupClick : undefined}
              className="btn btn-link"
              disabled={!isInteractive}
            >
              {utils.t('login.signupLink')}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default BasicLoginSkin;
```

### 단계 2: 스킨 스타일 정의

```css
/* src/components/skins/internal/basic/BasicLoginSkin.css */
.basic-login-skin {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 브랜드 영역 */
.brand-section {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  max-height: 60px;
  width: auto;
}

/* 제목 */
.login-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

/* 경고/에러 메시지 */
.alert {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.alert-error {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
}

.alert-icon {
  margin-right: 0.5rem;
}

/* 폼 스타일 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group--checkbox {
  flex-direction: row;
  align-items: center;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-input--error {
  border-color: #dc3545;
}

.form-input--error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-error {
  margin-top: 0.25rem;
  color: #dc3545;
  font-size: 0.875rem;
}

/* 체크박스 */
.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
}

.checkbox-input {
  margin-right: 0.5rem;
}

.checkbox-text {
  font-size: 0.875rem;
}

/* 버튼 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-link {
  background: none;
  color: #007bff;
  padding: 0;
  font-size: inherit;
}

.btn-link:hover:not(:disabled) {
  text-decoration: underline;
}

.btn-block {
  width: 100%;
}

.btn-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 회원가입 섹션 */
.signup-section {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.signup-text {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

/* 반응형 */
@media (max-width: 480px) {
  .basic-login-skin {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.25rem;
  }
}

/* 다크 모드 지원 */
[data-theme="dark"] .basic-login-skin {
  background: #2d3748;
  color: #e2e8f0;
}

[data-theme="dark"] .login-title {
  color: #e2e8f0;
}

[data-theme="dark"] .form-input {
  background: #4a5568;
  border-color: #2d3748;
  color: #e2e8f0;
}

[data-theme="dark"] .form-input:focus {
  border-color: #4299e1;
}
```

### 단계 3: 스킨 세트 구성

```typescript
// src/components/skins/internal/basic/index.ts
import BasicLoginSkin from './BasicLoginSkin';
import BasicSignupSkin from './BasicSignupSkin';
import BasicProfileSkin from './BasicProfileSkin';
import { SkinSet } from '../../types';

export const basicSkinSet: SkinSet = {
  id: 'basic',
  name: '기본 스킨',
  description: '깔끔하고 접근성이 좋은 기본 디자인',
  skins: {
    login: BasicLoginSkin,
    signup: BasicSignupSkin,
    profile: BasicProfileSkin
  }
};

export {
  BasicLoginSkin,
  BasicSignupSkin,
  BasicProfileSkin
};
```

---

## 스킨 등록 및 관리

### 1. 내부 스킨 레지스트리 구성

```typescript
// src/components/skins/internal/index.ts
import { basicSkinSet } from './basic';
import { modernSkinSet } from './modern';
import { minimalSkinSet } from './minimal';
import { InternalSkinRegistry } from '../types';

// 모든 내부 스킨 세트 등록
export const internalSkinRegistry: InternalSkinRegistry = {
  basic: basicSkinSet,
  modern: modernSkinSet,
  minimal: minimalSkinSet
};

// 특정 컴포넌트 타입의 스킨 가져오기
export function getInternalSkin(skinSetId: string, componentType: string) {
  const skinSet = internalSkinRegistry[skinSetId];
  if (!skinSet) {
    console.warn(`내부 스킨 세트를 찾을 수 없습니다: ${skinSetId}`);
    return null;
  }
  
  const skin = skinSet.skins[componentType];
  if (!skin) {
    console.warn(`컴포넌트 타입에 대한 스킨을 찾을 수 없습니다: ${componentType} in ${skinSetId}`);
    return null;
  }
  
  return skin;
}

// 사용 가능한 스킨 세트 목록
export function getAvailableSkinSets() {
  return Object.keys(internalSkinRegistry).map(setId => ({
    id: setId,
    ...internalSkinRegistry[setId]
  }));
}

// 특정 컴포넌트 타입에 사용 가능한 스킨들
export function getAvailableSkinsForComponent(componentType: string) {
  return Object.entries(internalSkinRegistry)
    .filter(([, skinSet]) => skinSet.skins[componentType])
    .map(([setId, skinSet]) => ({
      setId,
      setName: skinSet.name,
      componentType
    }));
}
```

### 2. ComponentSkinWrapper 통합

```typescript
// src/components/skins/ComponentSkinWrapper.js (수정된 부분)
import { getInternalSkin } from './internal';

const ComponentSkinWrapper = memo(function ComponentSkinWrapper({
  component,
  componentData,
  skinId = 'basic',
  mode = 'preview',
  editorProps
}) {
  // ... 기존 로직 ...
  
  // 스킨 컴포넌트 결정
  let SkinComponent;
  
  if (isExternalSkin(selectedSkinId)) {
    // 외부 스킨 로딩
    const ExternalSkin = createExternalSkinWrapper(selectedSkinId);
    SkinComponent = ExternalSkin;
  } else {
    // 내부 스킨 사용
    const [skinSetId, componentType] = selectedSkinId.includes(':') 
      ? selectedSkinId.split(':')
      : [selectedSkinId, component.type];
    
    SkinComponent = getInternalSkin(skinSetId, componentType);
    
    if (!SkinComponent) {
      console.warn(`내부 스킨을 찾을 수 없습니다: ${selectedSkinId}`);
      // 기본 스킨으로 폴백
      SkinComponent = getInternalSkin('basic', componentType) || 
                     component.internalSkins?.basic;
    }
  }
  
  // 스킨이 없으면 기본 렌더링
  if (!SkinComponent) {
    return (
      <div style={{ padding: '20px', border: '1px dashed #ccc' }}>
        <p>스킨을 찾을 수 없습니다: {selectedSkinId}</p>
        <p>컴포넌트: {component.type}</p>
      </div>
    );
  }
  
  return <SkinComponent {...skinProps} />;
});
```

---

## 고급 기능 구현

### 1. 테마별 변형 스킨

```typescript
// src/components/skins/internal/themeable/ThemedLoginSkin.tsx
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';

interface ThemedLoginSkinProps extends ComponentSkinProps {
  // ... 기본 props
  theme?: 'light' | 'dark' | 'colorful' | 'minimal';
}

const ThemedLoginSkin: React.FC<ThemedLoginSkinProps> = ({
  data,
  actions,
  options,
  app,
  theme = 'light',
  ...props
}) => {
  // 테마에 따른 스타일 클래스
  const themeClass = `themed-login-skin--${theme}`;
  
  // 테마별 색상 팔레트
  const themeColors = React.useMemo(() => {
    const themes = {
      light: {
        primary: '#007bff',
        background: '#ffffff',
        text: '#333333'
      },
      dark: {
        primary: '#4dabf7',
        background: '#1a1a1a',
        text: '#ffffff'
      },
      colorful: {
        primary: '#ff6b6b',
        background: '#f8f9fa',
        text: '#495057'
      },
      minimal: {
        primary: '#6c757d',
        background: '#ffffff',
        text: '#212529'
      }
    };
    
    return themes[theme] || themes.light;
  }, [theme]);
  
  // 동적 CSS 변수 설정
  const cssVariables = {
    '--theme-primary': themeColors.primary,
    '--theme-background': themeColors.background,
    '--theme-text': themeColors.text,
  } as React.CSSProperties;
  
  return (
    <div 
      className={`themed-login-skin ${themeClass}`}
      style={cssVariables}
    >
      {/* 테마가 적용된 컨텐츠 */}
      {/* ... */}
    </div>
  );
};

export default ThemedLoginSkin;
```

### 2. 조건부 스킨 렌더링

```typescript
// src/components/skins/internal/adaptive/AdaptiveLoginSkin.tsx
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';
import BasicLoginSkin from '../basic/BasicLoginSkin';
import MobileLoginSkin from '../mobile/MobileLoginSkin';
import TabletLoginSkin from '../tablet/TabletLoginSkin';

const AdaptiveLoginSkin: React.FC<ComponentSkinProps> = (props) => {
  const [deviceType, setDeviceType] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  React.useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);
  
  // 디바이스 타입에 따른 스킨 선택
  switch (deviceType) {
    case 'mobile':
      return <MobileLoginSkin {...props} />;
    case 'tablet':
      return <TabletLoginSkin {...props} />;
    default:
      return <BasicLoginSkin {...props} />;
  }
};

export default AdaptiveLoginSkin;
```

### 3. 스킨 확장 시스템

```typescript
// src/components/skins/internal/enhanced/EnhancedLoginSkin.tsx
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';
import BasicLoginSkin from '../basic/BasicLoginSkin';

interface Enhancement {
  name: string;
  component: React.ComponentType<any>;
  position: 'before' | 'after' | 'replace';
  target?: string;
}

interface EnhancedLoginSkinProps extends ComponentSkinProps {
  enhancements?: Enhancement[];
}

const EnhancedLoginSkin: React.FC<EnhancedLoginSkinProps> = ({
  enhancements = [],
  ...props
}) => {
  // 기본 스킨을 베이스로 사용
  const BaseComponent = BasicLoginSkin;
  
  // Enhancement가 'replace' 타입인 경우 완전히 다른 컴포넌트 사용
  const replaceEnhancement = enhancements.find(e => e.position === 'replace');
  if (replaceEnhancement) {
    const ReplacementComponent = replaceEnhancement.component;
    return <ReplacementComponent {...props} />;
  }
  
  // Before/After Enhancement 적용
  const beforeEnhancements = enhancements.filter(e => e.position === 'before');
  const afterEnhancements = enhancements.filter(e => e.position === 'after');
  
  return (
    <div className="enhanced-login-skin">
      {/* Before Enhancements */}
      {beforeEnhancements.map((enhancement, index) => {
        const EnhancementComponent = enhancement.component;
        return <EnhancementComponent key={`before-${index}`} {...props} />;
      })}
      
      {/* 기본 스킨 */}
      <BaseComponent {...props} />
      
      {/* After Enhancements */}
      {afterEnhancements.map((enhancement, index) => {
        const EnhancementComponent = enhancement.component;
        return <EnhancementComponent key={`after-${index}`} {...props} />;
      })}
    </div>
  );
};

export default EnhancedLoginSkin;
```

---

## 테스트 및 검증

### 1. 스킨 단위 테스트

```typescript
// src/components/skins/internal/basic/__tests__/BasicLoginSkin.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import BasicLoginSkin from '../BasicLoginSkin';
import { ComponentSkinProps } from '@withcookie/skin-types';

const createMockProps = (overrides: Partial<ComponentSkinProps> = {}): ComponentSkinProps => ({
  data: {
    formData: { user_id: '', password: '' },
    validationErrors: {},
    loading: false,
    loginError: null,
    theme: { primaryColor: '#007bff' }
  },
  actions: {
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    handleSignupClick: jest.fn()
  },
  options: {
    title: '로그인',
    showSignupLink: true,
    showRememberMe: false
  },
  mode: 'production',
  utils: {
    t: jest.fn((key: string) => key),
    navigate: jest.fn(),
    formatCurrency: jest.fn(),
    formatDate: jest.fn(),
    getAssetUrl: jest.fn((path: string) => path),
    cx: jest.fn((...args) => args.filter(Boolean).join(' '))
  },
  app: {
    user: null,
    company: null,
    currentLanguage: 'ko',
    isUserLoggedIn: false,
    theme: { mode: 'light' }
  },
  ...overrides
});

describe('BasicLoginSkin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('올바른 구조로 렌더링된다', () => {
    const props = createMockProps();
    render(<BasicLoginSkin {...props} />);
    
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByLabelText(/login\.userId/)).toBeInTheDocument();
    expect(screen.getByLabelText(/login\.password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login\.submit/ })).toBeInTheDocument();
  });
  
  it('에디터 모드에서는 상호작용이 비활성화된다', () => {
    const props = createMockProps({ mode: 'editor' });
    render(<BasicLoginSkin {...props} />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    expect(props.actions.handleSubmit).not.toHaveBeenCalled();
  });
  
  it('로딩 상태를 올바르게 표시한다', () => {
    const props = createMockProps({
      data: {
        ...createMockProps().data,
        loading: true
      }
    });
    
    render(<BasicLoginSkin {...props} />);
    
    expect(screen.getByText(/login\.loggingIn/)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
  
  it('유효성 검사 오류를 표시한다', () => {
    const props = createMockProps({
      data: {
        ...createMockProps().data,
        validationErrors: {
          user_id: '사용자 ID를 입력하세요',
          password: '비밀번호를 입력하세요'
        }
      }
    });
    
    render(<BasicLoginSkin {...props} />);
    
    expect(screen.getByText('사용자 ID를 입력하세요')).toBeInTheDocument();
    expect(screen.getByText('비밀번호를 입력하세요')).toBeInTheDocument();
  });
  
  it('옵션에 따라 조건부 요소들을 렌더링한다', () => {
    const props = createMockProps({
      options: {
        ...createMockProps().options,
        showSignupLink: false,
        showRememberMe: true,
        brandLogo: 'logo.png'
      }
    });
    
    render(<BasicLoginSkin {...props} />);
    
    expect(screen.queryByText(/login\.signupLink/)).not.toBeInTheDocument();
    expect(screen.getByText(/login\.rememberMe/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
```

### 2. 스킨 통합 테스트

```typescript
// src/components/skins/__tests__/integration.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { internalSkinRegistry } from '../internal';
import ComponentSkinWrapper from '../ComponentSkinWrapper';

describe('Internal Skin Integration', () => {
  it('모든 등록된 스킨 세트가 유효하다', () => {
    Object.entries(internalSkinRegistry).forEach(([setId, skinSet]) => {
      expect(skinSet.id).toBe(setId);
      expect(skinSet.name).toBeTruthy();
      expect(typeof skinSet.skins).toBe('object');
      
      Object.entries(skinSet.skins).forEach(([componentType, SkinComponent]) => {
        expect(typeof SkinComponent).toBe('function');
      });
    });
  });
  
  it('ComponentSkinWrapper가 내부 스킨을 올바르게 로드한다', () => {
    const mockComponent = {
      type: 'login',
      useLogic: () => ({
        formData: { user_id: '', password: '' },
        validationErrors: {},
        loading: false,
        actions: {
          handleChange: jest.fn(),
          handleSubmit: jest.fn()
        }
      })
    };
    
    render(
      <ComponentSkinWrapper
        component={mockComponent}
        componentData={{}}
        skinId="basic"
        mode="preview"
      />
    );
    
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});
```

### 3. 접근성 테스트

```typescript
// src/components/skins/__tests__/accessibility.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import BasicLoginSkin from '../internal/basic/BasicLoginSkin';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('BasicLoginSkin이 접근성 기준을 만족한다', async () => {
    const props = createMockProps();
    const { container } = render(<BasicLoginSkin {...props} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('모든 폼 요소에 적절한 라벨이 있다', () => {
    const props = createMockProps();
    render(<BasicLoginSkin {...props} />);
    
    expect(screen.getByLabelText(/login\.userId/)).toBeInTheDocument();
    expect(screen.getByLabelText(/login\.password/)).toBeInTheDocument();
  });
  
  it('에러 상태에서 적절한 ARIA 속성을 가진다', () => {
    const props = createMockProps({
      data: {
        ...createMockProps().data,
        validationErrors: { user_id: 'Error message' }
      }
    });
    
    render(<BasicLoginSkin {...props} />);
    
    const input = screen.getByLabelText(/login\.userId/);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });
});
```

---

## 배포 및 관리

### 1. 스킨 빌드 최적화

```javascript
// webpack.config.js - 스킨 청크 분리
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      cacheGroups: {
        skins: {
          test: /[\\/]components[\\/]skins[\\/]internal[\\/]/,
          name: 'skins',
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
};
```

### 2. 스킨 성능 모니터링

```typescript
// src/components/skins/performance/SkinPerformanceMonitor.tsx
import React from 'react';

interface PerformanceData {
  renderTime: number;
  componentName: string;
  propsSize: number;
}

export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo<P>((props) => {
    const renderStartTime = React.useRef<number>();
    
    React.useLayoutEffect(() => {
      renderStartTime.current = performance.now();
    });
    
    React.useLayoutEffect(() => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        const propsSize = JSON.stringify(props).length;
        
        const performanceData: PerformanceData = {
          renderTime,
          componentName,
          propsSize
        };
        
        // 성능 데이터 수집
        if (process.env.NODE_ENV === 'development') {
          console.log(`🎯 ${componentName} 렌더링 시간: ${renderTime.toFixed(2)}ms`);
        }
        
        // 프로덕션에서는 분석 서비스로 전송
        if (process.env.NODE_ENV === 'production' && window.analytics) {
          window.analytics.track('Skin Performance', performanceData);
        }
      }
    });
    
    return React.createElement(WrappedComponent, props);
  });
};

// 사용 예시
export const MonitoredBasicLoginSkin = withPerformanceMonitoring(
  BasicLoginSkin,
  'BasicLoginSkin'
);
```

### 3. 스킨 버전 관리

```typescript
// src/components/skins/version/SkinVersionManager.ts
interface SkinVersion {
  version: string;
  releaseDate: string;
  breaking: boolean;
  deprecated?: boolean;
  migrationGuide?: string;
}

interface SkinMetadata {
  id: string;
  name: string;
  versions: SkinVersion[];
  currentVersion: string;
  minimumVersion?: string;
}

export class SkinVersionManager {
  private static skinVersions = new Map<string, SkinMetadata>();
  
  public static registerSkinVersion(metadata: SkinMetadata) {
    this.skinVersions.set(metadata.id, metadata);
  }
  
  public static getSkinVersion(skinId: string): SkinMetadata | null {
    return this.skinVersions.get(skinId) || null;
  }
  
  public static isVersionCompatible(skinId: string, requiredVersion: string): boolean {
    const metadata = this.getSkinVersion(skinId);
    if (!metadata) return false;
    
    const current = this.parseVersion(metadata.currentVersion);
    const required = this.parseVersion(requiredVersion);
    
    return current.major >= required.major;
  }
  
  private static parseVersion(version: string) {
    const [major, minor, patch] = version.split('.').map(Number);
    return { major, minor, patch };
  }
}

// 스킨 버전 등록
SkinVersionManager.registerSkinVersion({
  id: 'basic',
  name: '기본 스킨',
  currentVersion: '2.1.0',
  minimumVersion: '2.0.0',
  versions: [
    {
      version: '2.1.0',
      releaseDate: '2024-01-15',
      breaking: false
    },
    {
      version: '2.0.0',
      releaseDate: '2023-12-01',
      breaking: true,
      migrationGuide: '/docs/migration/basic-v2'
    }
  ]
});
```

---

## 다음 단계

1. 🔍 **[Props 참조](../reference/props-interface.md)** - 상세한 Props 인터페이스 문서
2. 📦 **[코드 예제](../examples/)** - 실제 동작하는 스킨 예제들
3. 🚀 **[배포 가이드](../deployment/)** - 운영 환경 배포 전략

---

> **💡 핵심 포인트**: 내부 스킨 개발은 **빠른 개발 속도, 높은 성능, 강력한 타입 안전성**을 제공합니다. 체계적인 구조와 테스트를 통해 안정적이고 확장 가능한 스킨 시스템을 구축할 수 있습니다.