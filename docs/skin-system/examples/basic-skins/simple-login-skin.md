# 📝 간단한 로그인 스킨 예제

이 예제는 WithCookie WebBuilder 스킨 시스템의 기본 개념을 이해하기 위한 가장 간단한 로그인 스킨 구현입니다.

## 🎯 학습 목표

- ComponentSkinProps 인터페이스 이해
- 기본적인 Props 활용 방법
- 스킨 컴포넌트 구조 파악
- 옵션 시스템 기초 사용법

## 📋 요구사항

- React 17+
- TypeScript (권장)
- CSS3

## 🔧 구현 코드

### 1. 타입 정의

```typescript
// SimpleLoginSkin.types.ts
import { ComponentSkinProps } from '@withcookie/skin-types';

export interface SimpleLoginSkinProps extends ComponentSkinProps {
  data: {
    // 폼 데이터
    formData: {
      user_id: string;
      password: string;
    };
    
    // 상태 정보
    loading: boolean;
    loginError?: string;
    validationErrors: {
      user_id?: string;
      password?: string;
    };
    
    // 테마 정보 (선택적)
    theme?: {
      primaryColor?: string;
      backgroundColor?: string;
    };
  };
  
  actions: {
    // 폼 처리 액션들
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleSignupClick?: () => void;
  };
  
  options: {
    // 사용자 설정 옵션들
    title?: string;
    showSignupLink?: boolean;
    buttonText?: string;
    placeholder?: {
      userId?: string;
      password?: string;
    };
  };
}
```

### 2. 메인 컴포넌트

```typescript
// SimpleLoginSkin.tsx
import React from 'react';
import { SimpleLoginSkinProps } from './SimpleLoginSkin.types';
import './SimpleLoginSkin.css';

const SimpleLoginSkin: React.FC<SimpleLoginSkinProps> = ({
  data,
  actions,
  options,
  mode,
  utils,
  app
}) => {
  // Props에서 데이터 추출
  const {
    formData,
    loading,
    loginError,
    validationErrors,
    theme
  } = data;
  
  const {
    handleChange,
    handleSubmit,
    handleSignupClick
  } = actions;
  
  const {
    title = utils.t('login.title', {}, { defaultValue: '로그인' }),
    showSignupLink = true,
    buttonText = utils.t('login.submit', {}, { defaultValue: '로그인' }),
    placeholder = {}
  } = options;

  // 에디터 모드에서는 상호작용 비활성화
  const isInteractive = mode !== 'editor';
  
  // 테마 스타일 적용
  const themeStyles = {
    '--primary-color': theme?.primaryColor || app?.theme?.colors?.primary || '#007bff',
    '--background-color': theme?.backgroundColor || '#ffffff'
  } as React.CSSProperties;

  return (
    <div className="simple-login-skin" style={themeStyles}>
      {/* 제목 */}
      <h2 className="login-title">{title}</h2>
      
      {/* 에러 메시지 표시 */}
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
        {/* 사용자 ID 입력 */}
        <div className="form-group">
          <label htmlFor="user_id" className="form-label">
            {utils.t('login.userId', {}, { defaultValue: '사용자 ID' })}
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
            placeholder={placeholder.userId || utils.t('login.userIdPlaceholder', {}, { 
              defaultValue: '사용자 ID를 입력하세요' 
            })}
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
        
        {/* 비밀번호 입력 */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            {utils.t('login.password', {}, { defaultValue: '비밀번호' })}
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
            placeholder={placeholder.password || utils.t('login.passwordPlaceholder', {}, { 
              defaultValue: '비밀번호를 입력하세요' 
            })}
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
        
        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={!isInteractive || loading}
          aria-label={loading ? utils.t('login.loggingIn', {}, { 
            defaultValue: '로그인 중...' 
          }) : buttonText}
        >
          {loading && isInteractive ? (
            <>
              <span className="btn-spinner" aria-hidden="true"></span>
              {utils.t('login.loggingIn', {}, { defaultValue: '로그인 중...' })}
            </>
          ) : (
            buttonText
          )}
        </button>
      </form>
      
      {/* 회원가입 링크 */}
      {showSignupLink && handleSignupClick && (
        <div className="signup-section">
          <p className="signup-text">
            {utils.t('login.noAccount', {}, { defaultValue: '계정이 없으신가요?' })}
            {' '}
            <button
              type="button"
              onClick={isInteractive ? handleSignupClick : undefined}
              className="btn btn-link"
              disabled={!isInteractive}
            >
              {utils.t('login.signupLink', {}, { defaultValue: '회원가입' })}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleLoginSkin;
```

### 3. 스타일시트

```css
/* SimpleLoginSkin.css */

/* CSS 커스텀 프로퍼티 정의 */
.simple-login-skin {
  --primary-color: #007bff;
  --background-color: #ffffff;
  --text-color: #333333;
  --error-color: #dc3545;
  --border-color: #ced4da;
  --focus-color: rgba(0, 123, 255, 0.25);
  
  /* 기본 스타일 */
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: var(--text-color);
}

/* 제목 스타일 */
.login-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
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
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: var(--error-color);
}

.alert-icon {
  margin-right: 0.5rem;
}

.alert-message {
  flex: 1;
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

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.875rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  background-color: #ffffff;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--focus-color);
}

.form-input--error {
  border-color: var(--error-color);
}

.form-input--error:focus {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
}

.form-input:disabled {
  background-color: #f8f9fa;
  opacity: 0.6;
  cursor: not-allowed;
}

.form-error {
  margin-top: 0.25rem;
  color: var(--error-color);
  font-size: 0.875rem;
}

/* 버튼 스타일 */
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
  transition: background-color 0.15s ease-in-out, transform 0.1s ease-in-out;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: color-mix(in srgb, var(--primary-color) 85%, black);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-link {
  background: none;
  color: var(--primary-color);
  padding: 0;
  font-size: inherit;
  text-decoration: none;
}

.btn-link:hover:not(:disabled) {
  text-decoration: underline;
}

.btn-block {
  width: 100%;
}

/* 로딩 스피너 */
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
  border-top: 1px solid #e9ecef;
}

.signup-text {
  margin: 0;
  color: #6c757d;
  font-size: 0.875rem;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .simple-login-skin {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.25rem;
  }
  
  .form-input,
  .btn {
    font-size: 16px; /* iOS 줌 방지 */
  }
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  .simple-login-skin {
    --background-color: #2d3748;
    --text-color: #e2e8f0;
    --border-color: #4a5568;
  }
  
  .form-input {
    background-color: #4a5568;
    color: #e2e8f0;
  }
  
  .form-input:disabled {
    background-color: #2d3748;
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .btn,
  .form-input {
    transition: none;
  }
  
  .btn-spinner {
    animation: none;
  }
}

/* 포커스 스타일 개선 */
@media (prefers-reduced-motion: no-preference) {
  .btn:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }
}
```

### 4. 컴포넌트 등록

```typescript
// 내부 스킨으로 등록하는 경우
// src/components/skins/internal/basic/index.ts

import SimpleLoginSkin from './SimpleLoginSkin';

export const basicSkinSet = {
  id: 'basic',
  name: '기본 스킨',
  skins: {
    login: SimpleLoginSkin,
    // 다른 컴포넌트 스킨들...
  }
};
```

```typescript
// 외부 스킨으로 등록하는 경우
// src/index.ts (UMD 번들의 엔트리 포인트)

import React from 'react';
import SimpleLoginSkin from './SimpleLoginSkin';

const CustomSkinFactory = (props) => {
  if (props.data?.componentType === 'login') {
    return React.createElement(SimpleLoginSkin, props);
  }
  
  return React.createElement('div', {
    style: { padding: '20px', color: 'red' }
  }, `지원되지 않는 컴포넌트 타입: ${props.data?.componentType}`);
};

// UMD 전역 변수로 노출
if (typeof window !== 'undefined') {
  window.MyCustomSkin = CustomSkinFactory;
}

export default CustomSkinFactory;
```

## 📝 사용법

### 1. WithCookie 에디터에서 사용

```typescript
// 컴포넌트 설정에서 스킨 선택
const loginComponent = {
  type: 'login',
  skinId: 'basic', // 내부 스킨 사용
  // 또는
  skinId: 'my-custom-skin', // 외부 스킨 사용
  options: {
    title: '우리 서비스에 로그인',
    showSignupLink: true,
    buttonText: '로그인하기',
    placeholder: {
      userId: '이메일 또는 사용자명',
      password: '비밀번호'
    }
  }
};
```

### 2. 프로그래밍 방식으로 사용

```typescript
// React 애플리케이션에서 직접 사용
import SimpleLoginSkin from './SimpleLoginSkin';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 입력 시 에러 초기화
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 기본 유효성 검사
    const errors = {};
    if (!formData.user_id) {
      errors.user_id = '사용자 ID를 입력하세요';
    }
    if (!formData.password) {
      errors.password = '비밀번호를 입력하세요';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setLoginError(null);

    try {
      // API 호출
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다');
      }

      const data = await response.json();
      
      // 성공 시 처리
      console.log('로그인 성공:', data);
      window.location.href = '/dashboard';
      
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    window.location.href = '/signup';
  };

  return (
    <SimpleLoginSkin
      data={{
        formData,
        loading,
        loginError,
        validationErrors
      }}
      actions={{
        handleChange,
        handleSubmit,
        handleSignupClick
      }}
      options={{
        title: '로그인',
        showSignupLink: true,
        buttonText: '로그인'
      }}
      mode="production"
      utils={{
        t: (key, params, options) => options?.defaultValue || key,
        navigate: (path) => window.location.href = path,
        formatCurrency: (amount) => `₩${amount.toLocaleString()}`,
        formatDate: (date) => new Date(date).toLocaleDateString(),
        getAssetUrl: (path) => path,
        cx: (...classes) => classes.filter(Boolean).join(' ')
      }}
    />
  );
};
```

## 🎨 커스터마이징 아이디어

### 1. 테마 변형

```typescript
// 다양한 테마 적용
const themes = {
  blue: {
    primaryColor: '#007bff',
    backgroundColor: '#ffffff'
  },
  dark: {
    primaryColor: '#4dabf7',
    backgroundColor: '#1a1a1a'
  },
  green: {
    primaryColor: '#28a745',
    backgroundColor: '#f8f9fa'
  }
};

// 사용 시 테마 전달
<SimpleLoginSkin
  data={{ ...data, theme: themes.dark }}
  // ...
/>
```

### 2. 추가 옵션 구현

```typescript
// 옵션 확장
interface ExtendedOptions {
  title?: string;
  showSignupLink?: boolean;
  buttonText?: string;
  placeholder?: {
    userId?: string;
    password?: string;
  };
  
  // 새로운 옵션들
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  socialLogin?: {
    enabled: boolean;
    providers: ('google' | 'facebook' | 'twitter')[];
  };
  layout?: 'card' | 'minimal' | 'fullscreen';
}
```

### 3. 애니메이션 추가

```css
/* 등장 애니메이션 */
.simple-login-skin {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 입력 필드 포커스 애니메이션 */
.form-input {
  position: relative;
}

.form-input:focus {
  transform: scale(1.02);
}
```

## 🧪 테스트 예제

### 단위 테스트

```typescript
// SimpleLoginSkin.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SimpleLoginSkin from './SimpleLoginSkin';

const mockProps = {
  data: {
    formData: { user_id: '', password: '' },
    loading: false,
    validationErrors: {}
  },
  actions: {
    handleChange: jest.fn(),
    handleSubmit: jest.fn(),
    handleSignupClick: jest.fn()
  },
  options: {
    title: '로그인',
    showSignupLink: true
  },
  mode: 'production' as const,
  utils: {
    t: (key: string, params?: any, options?: any) => options?.defaultValue || key,
    navigate: jest.fn(),
    formatCurrency: jest.fn(),
    formatDate: jest.fn(),
    getAssetUrl: (path: string) => path,
    cx: (...classes: any[]) => classes.filter(Boolean).join(' ')
  }
};

describe('SimpleLoginSkin', () => {
  it('로그인 폼이 올바르게 렌더링된다', () => {
    render(<SimpleLoginSkin {...mockProps} />);
    
    expect(screen.getByLabelText(/사용자 ID/)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /로그인/ })).toBeInTheDocument();
  });
  
  it('입력값 변경이 올바르게 처리된다', () => {
    render(<SimpleLoginSkin {...mockProps} />);
    
    const userIdInput = screen.getByLabelText(/사용자 ID/);
    fireEvent.change(userIdInput, { target: { value: 'testuser' } });
    
    expect(mockProps.actions.handleChange).toHaveBeenCalled();
  });
  
  it('에디터 모드에서는 상호작용이 비활성화된다', () => {
    const editorProps = { ...mockProps, mode: 'editor' as const };
    render(<SimpleLoginSkin {...editorProps} />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    expect(mockProps.actions.handleSubmit).not.toHaveBeenCalled();
  });
});
```

## 📚 관련 참조

- [ComponentSkinProps 인터페이스](../../reference/props-interface.md)
- [컴포넌트 옵션 시스템](../../reference/component-options.md)
- [내부 스킨 개발 가이드](../../development/internal-skin-development.md)
- [외부 스킨 개발 가이드](../../development/external-skin-development.md)

## 🚀 다음 단계

이 기본 예제를 이해했다면 다음을 시도해보세요:

1. [모던 회원가입 스킨](./modern-signup-skin.md) - 더 복잡한 폼 처리
2. [애니메이션 로그인 스킨](../advanced-skins/animated-login-skin.md) - 시각적 효과 추가
3. [UMD 번들 예제](../external-skins/umd-bundle-example.md) - 외부 스킨으로 배포

---

> **💡 핵심 포인트**: 이 예제는 스킨 시스템의 **기본 구조와 Props 흐름**을 보여줍니다. 실제 프로젝트에서는 더 많은 검증, 에러 처리, 접근성 기능을 추가해야 합니다.