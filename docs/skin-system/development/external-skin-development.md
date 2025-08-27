# 🌐 외부 스킨 개발 가이드

## 📋 목차
1. [개발 환경 설정](#개발-환경-설정)
2. [기본 스킨 구조](#기본-스킨-구조)
3. [Props 인터페이스 이해](#props-인터페이스-이해)
4. [스킨 개발 단계별 가이드](#스킨-개발-단계별-가이드)
5. [빌드 및 배포](#빌드-및-배포)
6. [테스트 및 검증](#테스트-및-검증)
7. [모범 사례](#모범-사례)

---

## 개발 환경 설정

### 1. 필수 도구 설치

```bash
# Node.js 및 npm 설치 (Node.js 16+ 권장)
node --version  # v16.0.0 이상
npm --version   # v8.0.0 이상

# 타입스크립트 설치 (선택사항이지만 강력 권장)
npm install -g typescript

# 번들러 설치 (Webpack 또는 Rollup 권장)
npm install -g webpack webpack-cli
# 또는
npm install -g rollup
```

### 2. 스킨 개발 템플릿 다운로드

```bash
# 공식 스킨 개발 템플릿 클론
git clone https://github.com/withcookie/skin-development-template.git my-custom-skin
cd my-custom-skin

# 의존성 설치
npm install

# 개발 서버 시작
npm run dev
```

### 3. WithCookie WebBuilder 타입 정의 설치

```bash
# Props 타입 정의 설치
npm install @withcookie/skin-types --save-dev

# 또는 직접 다운로드
curl -o types.d.ts https://cdn.withcookie.com/skin-types/latest.d.ts
```

---

## 기본 스킨 구조

### 1. 프로젝트 구조

```
my-custom-skin/
├── src/
│   ├── components/           # 스킨 컴포넌트들
│   │   ├── LoginSkin.tsx
│   │   ├── SignupSkin.tsx
│   │   └── index.ts
│   ├── styles/              # 스타일 파일들
│   │   ├── variables.css
│   │   ├── components.css
│   │   └── index.css
│   ├── utils/               # 유틸리티 함수들
│   │   └── helpers.ts
│   └── index.ts             # 메인 엔트리 포인트
├── dist/                    # 빌드 결과물
├── webpack.config.js        # 번들 설정
├── package.json
└── README.md
```

### 2. 메인 엔트리 포인트 (`src/index.ts`)

```typescript
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';

// 개별 스킨 컴포넌트들 import
import LoginSkin from './components/LoginSkin';
import SignupSkin from './components/SignupSkin';

// 스타일 import
import './styles/index.css';

// 스킨 컴포넌트 매핑
const skinComponents = {
  login: LoginSkin,
  signup: SignupSkin,
  // 새 컴포넌트 추가 시 여기에 등록
};

// 메인 스킨 팩토리 함수
const CustomSkinFactory = (props: ComponentSkinProps) => {
  const { data, options } = props;
  const componentType = data.componentType || options.type;
  
  // 컴포넌트 타입에 따라 적절한 스킨 선택
  const SkinComponent = skinComponents[componentType];
  
  if (!SkinComponent) {
    console.error(`지원되지 않는 컴포넌트 타입: ${componentType}`);
    return React.createElement('div', {
      style: { padding: '20px', color: 'red' }
    }, `지원되지 않는 컴포넌트: ${componentType}`);
  }
  
  return React.createElement(SkinComponent, props);
};

// UMD 환경에서 전역 변수로 노출
if (typeof window !== 'undefined') {
  (window as any).MyCustomSkin = CustomSkinFactory;
}

// ES Module 환경에서도 사용 가능
export default CustomSkinFactory;
```

### 3. 개별 스킨 컴포넌트 예시 (`src/components/LoginSkin.tsx`)

```typescript
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';

interface LoginSkinProps extends ComponentSkinProps {
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
    style?: 'minimal' | 'card' | 'fullscreen';
    brandLogo?: string;
  };
}

const LoginSkin: React.FC<LoginSkinProps> = ({
  data,
  actions,
  options,
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
    title = utils.t('login.title'),
    showSignupLink = true,
    style = 'card',
    brandLogo
  } = options;

  // 동적 스타일 생성
  const containerStyle = {
    '--primary-color': theme?.primaryColor || '#007bff',
    '--secondary-color': theme?.secondaryColor || '#6c757d',
  } as React.CSSProperties;

  return (
    <div className={`custom-login-skin custom-login-skin--${style}`} style={containerStyle}>
      {/* 브랜드 로고 */}
      {brandLogo && (
        <div className="brand-section">
          <img src={brandLogo} alt={app.company?.name} className="brand-logo" />
        </div>
      )}
      
      {/* 제목 */}
      <h2 className="login-title">{title}</h2>
      
      {/* 에러 메시지 */}
      {loginError && (
        <div className="alert alert-error" role="alert">
          <span className="error-icon">⚠️</span>
          {loginError}
        </div>
      )}
      
      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        {/* 사용자 ID 필드 */}
        <div className="form-group">
          <label htmlFor="user_id" className="form-label">
            {utils.t('login.userId')}
          </label>
          <input
            type="text"
            id="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className={`form-input ${validationErrors.user_id ? 'error' : ''}`}
            placeholder={utils.t('login.userIdPlaceholder')}
            disabled={loading}
            autoComplete="username"
            aria-describedby={validationErrors.user_id ? 'user_id-error' : undefined}
          />
          {validationErrors.user_id && (
            <div id="user_id-error" className="field-error" role="alert">
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
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${validationErrors.password ? 'error' : ''}`}
            placeholder={utils.t('login.passwordPlaceholder')}
            disabled={loading}
            autoComplete="current-password"
            aria-describedby={validationErrors.password ? 'password-error' : undefined}
          />
          {validationErrors.password && (
            <div id="password-error" className="field-error" role="alert">
              {validationErrors.password}
            </div>
          )}
        </div>
        
        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
          aria-label={loading ? utils.t('login.loggingIn') : utils.t('login.submit')}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true"></span>
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
              onClick={handleSignupClick}
              className="btn btn-link"
            >
              {utils.t('login.signupLink')}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginSkin;
```

---

## Props 인터페이스 이해

### 1. ComponentSkinProps 구조

```typescript
interface ComponentSkinProps {
  data: {
    // 컴포넌트별 동적 데이터
    // 로직 훅에서 전달되는 상태 및 계산된 값들
    [key: string]: any;
  };
  
  actions: {
    // 사용자 상호작용 핸들러들
    // 이벤트 처리 함수들
    [key: string]: Function;
  };
  
  options: {
    // 사용자 설정 가능한 옵션들
    // 에디터에서 편집 가능한 설정값들
    [key: string]: any;
  };
  
  mode: 'editor' | 'preview' | 'production';
  // editor: 편집 모드 (드래그앤드롭, 수정 불가)
  // preview: 미리보기 모드 (기능 동작하지만 실제 효과 없음)
  // production: 실제 운영 모드 (모든 기능 동작)
  
  utils: {
    t: (key: string, params?: object) => string;        // 다국어 번역
    navigate: (path: string) => void;                   // 페이지 이동
    formatCurrency: (amount: number, currency?: string) => string;
    formatDate: (date: Date | string, format?: string) => string;
    getAssetUrl: (path: string) => string;              // 에셋 URL 생성
    cx: (...classes: any[]) => string;                  // 클래스명 조합
  };
  
  app: {
    user: User | null;                    // 현재 로그인 사용자
    company: Company | null;              // 회사 정보
    currentLanguage: string;              // 현재 언어
    isUserLoggedIn: boolean;              // 로그인 상태
    theme: ThemeConfiguration;            // 테마 설정
  };
  
  editor?: {
    // 에디터 모드에서만 제공
    onOptionChange: (key: string, value: any) => void;
    onStyleChange: (styles: CSSProperties) => void;
    isSelected: boolean;
    isDragging: boolean;
  };
}
```

### 2. 컴포넌트별 특화 Props

각 컴포넌트 타입별로 `data`와 `actions` 구조가 다릅니다:

#### 로그인 컴포넌트
```typescript
interface LoginProps extends ComponentSkinProps {
  data: {
    formData: { user_id: string; password: string };
    validationErrors: Record<string, string>;
    loading: boolean;
    loginSuccess: boolean;
    loginError?: string;
    theme: ThemeColors;
  };
  actions: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleSignupClick: () => void;
  };
}
```

#### 회원가입 컴포넌트
```typescript
interface SignupProps extends ComponentSkinProps {
  data: {
    formData: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    };
    validationErrors: Record<string, string>;
    loading: boolean;
    signupSuccess: boolean;
    signupError?: string;
  };
  actions: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleLoginClick: () => void;
  };
}
```

---

## 스킨 개발 단계별 가이드

### 단계 1: 요구사항 분석

```typescript
// 1. 어떤 컴포넌트 타입을 지원할지 결정
const supportedComponents = [
  'login',        // 로그인
  'signup',       // 회원가입
  'profile',      // 프로필
  'dashboard'     // 대시보드
];

// 2. 각 컴포넌트의 옵션 정의
const componentOptions = {
  login: [
    { name: 'title', type: 'text', default: '로그인' },
    { name: 'style', type: 'select', options: ['minimal', 'card', 'fullscreen'], default: 'card' },
    { name: 'showSignupLink', type: 'boolean', default: true },
    { name: 'brandLogo', type: 'image', default: null }
  ],
  // ...
};
```

### 단계 2: 디자인 시스템 구성

```css
/* src/styles/variables.css */
:root {
  /* 색상 변수 */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;
  
  /* 폰트 변수 */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  /* 여백 변수 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* 테두리 반경 */
  --border-radius-sm: 0.25rem;
  --border-radius: 0.375rem;
  --border-radius-lg: 0.5rem;
  
  /* 그림자 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* 다크 모드 지원 */
[data-theme="dark"] {
  --primary-color: #0d6efd;
  --background-color: #1a1a1a;
  --text-color: #ffffff;
  /* ... */
}
```

### 단계 3: 컴포넌트 개발

```typescript
// src/components/BaseComponent.tsx
// 공통 기능을 가진 베이스 컴포넌트
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';

interface BaseComponentProps extends ComponentSkinProps {
  className?: string;
  children?: React.ReactNode;
}

const BaseComponent: React.FC<BaseComponentProps> = ({
  mode,
  options,
  app,
  className = '',
  children
}) => {
  // 에디터 모드에서는 상호작용 비활성화
  const isInteractive = mode !== 'editor';
  
  // 테마 클래스 생성
  const themeClass = app.theme?.mode === 'dark' ? 'theme-dark' : 'theme-light';
  
  // 최종 클래스명 조합
  const finalClassName = `base-component ${themeClass} ${className}`;
  
  return (
    <div 
      className={finalClassName}
      data-interactive={isInteractive}
      data-mode={mode}
    >
      {children}
    </div>
  );
};

export default BaseComponent;
```

### 단계 4: 응답형 디자인 구현

```css
/* src/styles/components.css */
.custom-login-skin {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

/* 태블릿 */
@media (max-width: 768px) {
  .custom-login-skin {
    max-width: 100%;
    padding: var(--spacing-lg);
  }
}

/* 모바일 */
@media (max-width: 480px) {
  .custom-login-skin {
    padding: var(--spacing-md);
  }
  
  .custom-login-skin--fullscreen {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
```

### 단계 5: 접근성 구현

```typescript
// 접근성 고려사항
const AccessibleLoginSkin: React.FC<LoginSkinProps> = (props) => {
  const { data, actions, utils } = props;
  
  return (
    <div role="main" aria-labelledby="login-title">
      <h1 id="login-title">{utils.t('login.title')}</h1>
      
      <form 
        onSubmit={actions.handleSubmit}
        aria-label={utils.t('login.formLabel')}
        noValidate
      >
        <div className="form-group">
          <label htmlFor="user_id" className="form-label">
            {utils.t('login.userId')}
            <span className="required" aria-label="필수입력">*</span>
          </label>
          <input
            type="text"
            id="user_id"
            value={data.formData.user_id}
            onChange={actions.handleChange}
            aria-required="true"
            aria-invalid={!!data.validationErrors.user_id}
            aria-describedby={data.validationErrors.user_id ? 'user_id-error' : undefined}
          />
          {data.validationErrors.user_id && (
            <div 
              id="user_id-error" 
              role="alert" 
              className="field-error"
            >
              {data.validationErrors.user_id}
            </div>
          )}
        </div>
        
        <button 
          type="submit"
          disabled={data.loading}
          aria-label={data.loading ? utils.t('login.loggingIn') : utils.t('login.submit')}
        >
          {data.loading ? (
            <>
              <span 
                className="spinner" 
                role="status" 
                aria-hidden="true"
              ></span>
              <span className="sr-only">{utils.t('login.loggingIn')}</span>
            </>
          ) : (
            utils.t('login.submit')
          )}
        </button>
      </form>
    </div>
  );
};
```

---

## 빌드 및 배포

### 1. Webpack 설정 (`webpack.config.js`)

```javascript
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-custom-skin.umd.js',
    library: 'MyCustomSkin',           // 전역 변수명
    libraryTarget: 'umd',              // UMD 포맷
    globalObject: 'this'               // Node.js 호환성
  },
  
  externals: {
    // React는 WithCookie에서 제공하므로 번들에 포함하지 않음
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }
  },
  
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      }
    ]
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'my-custom-skin.css'
    })
  ],
  
  optimization: {
    minimize: true
  }
};
```

### 2. 빌드 스크립트 (`package.json`)

```json
{
  "name": "my-custom-skin",
  "version": "1.0.0",
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "jest",
    "validate": "npm run typecheck && npm run lint && npm run test",
    "prepublish": "npm run validate && npm run build"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@withcookie/skin-types": "^1.0.0",
    "css-loader": "^6.0.0",
    "mini-css-extract-plugin": "^2.0.0",
    "ts-loader": "^9.0.0",
    "typescript": "^4.5.0",
    "webpack": "^5.0.0",
    "webpack-cli": "^4.0.0"
  },
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  }
}
```

### 3. 배포 과정

```bash
# 1. 유효성 검사
npm run validate

# 2. 프로덕션 빌드
npm run build

# 3. 결과물 확인
ls -la dist/
# my-custom-skin.umd.js
# my-custom-skin.css

# 4. CDN에 업로드 (예: AWS S3)
aws s3 cp dist/ s3://my-skin-cdn/v1.0.0/ --recursive

# 5. 스킨 등록 (WithCookie 시스템에)
curl -X POST https://api.withcookie.com/skins \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "my-custom-skin",
    "name": "My Custom Skin",
    "version": "1.0.0",
    "umdUrl": "https://my-skin-cdn.com/v1.0.0/my-custom-skin.umd.js",
    "cssUrls": ["https://my-skin-cdn.com/v1.0.0/my-custom-skin.css"],
    "componentTypes": ["login", "signup"]
  }'
```

---

## 테스트 및 검증

### 1. 단위 테스트

```typescript
// src/__tests__/LoginSkin.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginSkin from '../components/LoginSkin';

const mockProps = {
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
    style: 'card'
  },
  mode: 'production' as const,
  utils: {
    t: (key: string) => key,
    navigate: jest.fn(),
    formatCurrency: jest.fn(),
    formatDate: jest.fn(),
    getAssetUrl: jest.fn(),
    cx: jest.fn()
  },
  app: {
    user: null,
    company: null,
    currentLanguage: 'ko',
    isUserLoggedIn: false,
    theme: { mode: 'light' }
  }
};

describe('LoginSkin', () => {
  it('로그인 폼이 올바르게 렌더링된다', () => {
    render(<LoginSkin {...mockProps} />);
    
    expect(screen.getByLabelText(/login.userId/)).toBeInTheDocument();
    expect(screen.getByLabelText(/login.password/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login.submit/ })).toBeInTheDocument();
  });
  
  it('입력값 변경이 올바르게 처리된다', () => {
    render(<LoginSkin {...mockProps} />);
    
    const userIdInput = screen.getByLabelText(/login.userId/);
    fireEvent.change(userIdInput, { target: { value: 'testuser' } });
    
    expect(mockProps.actions.handleChange).toHaveBeenCalled();
  });
  
  it('로딩 상태가 올바르게 표시된다', () => {
    const loadingProps = {
      ...mockProps,
      data: { ...mockProps.data, loading: true }
    };
    
    render(<LoginSkin {...loadingProps} />);
    
    expect(screen.getByText(/login.loggingIn/)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### 2. 통합 테스트

```typescript
// src/__tests__/integration.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomSkinFactory from '../index';

describe('CustomSkinFactory Integration', () => {
  it('로그인 컴포넌트 타입에 대해 LoginSkin을 렌더링한다', () => {
    const props = {
      data: { componentType: 'login' },
      // ... 기타 props
    };
    
    render(<CustomSkinFactory {...props} />);
    
    // LoginSkin의 특정 요소가 렌더링되는지 확인
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
  
  it('지원되지 않는 컴포넌트 타입에 대해 에러 메시지를 표시한다', () => {
    const props = {
      data: { componentType: 'unsupported' },
      // ... 기타 props
    };
    
    render(<CustomSkinFactory {...props} />);
    
    expect(screen.getByText(/지원되지 않는 컴포넌트/)).toBeInTheDocument();
  });
});
```

### 3. 시각적 회귀 테스트

```typescript
// src/__tests__/visual.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import puppeteer from 'puppeteer';

expect.extend({ toMatchImageSnapshot });

describe('Visual Regression Tests', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  it('로그인 스킨이 예상된 모습으로 렌더링된다', async () => {
    await page.goto('http://localhost:3000/test/login');
    
    const screenshot = await page.screenshot();
    expect(screenshot).toMatchImageSnapshot({
      threshold: 0.2,
      thresholdType: 'percent'
    });
  });
});
```

---

## 모범 사례

### 1. 성능 최적화

```typescript
// React.memo로 불필요한 리렌더링 방지
const LoginSkin = React.memo<LoginSkinProps>(({
  data,
  actions,
  options,
  utils,
  app
}) => {
  // ...
}, (prevProps, nextProps) => {
  // 얕은 비교로 성능 최적화
  return (
    prevProps.data.loading === nextProps.data.loading &&
    prevProps.data.formData.user_id === nextProps.data.formData.user_id &&
    prevProps.data.formData.password === nextProps.data.formData.password
  );
});

// 비용이 큰 계산은 useMemo로 메모이제이션
const ExpensiveComponent: React.FC = ({ data }) => {
  const processedData = React.useMemo(() => {
    return processLargeDataSet(data);
  }, [data]);
  
  return <div>{processedData}</div>;
};
```

### 2. 에러 처리

```typescript
// 에러 경계 컴포넌트
class SkinErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Skin Error:', error, errorInfo);
    
    // 에러 리포팅 서비스에 전송
    if (window.reportError) {
      window.reportError({
        error: error.message,
        stack: error.stack,
        context: 'skin-rendering',
        skinId: this.props.skinId
      });
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="skin-error-fallback">
          <h3>스킨 렌더링 오류</h3>
          <p>스킨을 불러오는 중 문제가 발생했습니다.</p>
          <button onClick={() => window.location.reload()}>
            페이지 새로고침
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// 사용
const SafeSkinWrapper = ({ children, skinId }) => (
  <SkinErrorBoundary skinId={skinId}>
    {children}
  </SkinErrorBoundary>
);
```

### 3. 다국어 지원

```typescript
// 다국어 키 정의
const translationKeys = {
  login: {
    title: 'login.title',
    userId: 'login.userId',
    password: 'login.password',
    submit: 'login.submit',
    noAccount: 'login.noAccount',
    signupLink: 'login.signupLink'
  }
};

// 컴포넌트에서 사용
const LoginSkin: React.FC<LoginSkinProps> = ({ utils, ...props }) => {
  const { t } = utils;
  
  return (
    <div>
      <h2>{t(translationKeys.login.title)}</h2>
      <label>{t(translationKeys.login.userId)}</label>
      {/* ... */}
    </div>
  );
};
```

### 4. 테마 시스템 활용

```typescript
// 테마 훅 구현
const useTheme = (app: AppData) => {
  return React.useMemo(() => {
    const baseTheme = {
      colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      }
    };
    
    // 앱 테마 설정과 병합
    if (app.theme?.colors) {
      baseTheme.colors = { ...baseTheme.colors, ...app.theme.colors };
    }
    
    return baseTheme;
  }, [app.theme]);
};

// 컴포넌트에서 사용
const ThemedComponent: React.FC<ComponentSkinProps> = ({ app }) => {
  const theme = useTheme(app);
  
  return (
    <div style={{ 
      color: theme.colors.primary,
      padding: theme.spacing.md
    }}>
      {/* 컨텐츠 */}
    </div>
  );
};
```

### 5. 개발 도구 지원

```typescript
// 개발 모드에서만 활성화되는 디버깅 도구
if (process.env.NODE_ENV === 'development') {
  // Props 변화 추적
  const usePropsLogger = (props: any, componentName: string) => {
    React.useEffect(() => {
      console.group(`🎨 ${componentName} Props`);
      console.table(props);
      console.groupEnd();
    }, [props]);
  };
  
  // 렌더링 성능 측정
  const useRenderProfiler = (componentName: string) => {
    React.useEffect(() => {
      const start = performance.now();
      return () => {
        const end = performance.now();
        console.log(`⏱️ ${componentName} rendered in ${end - start}ms`);
      };
    });
  };
}
```

---

## 다음 단계

1. 🔍 **[Props 참조](../reference/props-interface.md)** - 상세한 Props 인터페이스 문서
2. 📦 **[코드 예제](../examples/)** - 실제 동작하는 스킨 예제들
3. 🚀 **[배포 가이드](../deployment/)** - CDN 및 호스팅 옵션

---

> **💡 핵심 포인트**: 외부 스킨 개발은 **표준화된 인터페이스, 성능 최적화, 접근성**을 고려한 체계적인 접근이 필요합니다. WithCookie의 Props 표준을 따르면 기존 시스템과 완벽하게 통합되는 고품질 스킨을 개발할 수 있습니다.