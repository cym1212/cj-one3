# 🚀 UMD 번들 외부 스킨 예제

이 예제는 WithCookie WebBuilder에서 동적으로 로드할 수 있는 UMD 형태의 외부 스킨을 개발하고 배포하는 전체 과정을 보여줍니다.

## 🎯 학습 목표

- UMD (Universal Module Definition) 번들 생성
- 외부 스킨 프로젝트 구조 이해
- Webpack을 이용한 번들링 설정
- CDN 배포 및 등록 과정
- 동적 로딩 테스트 방법

## 📋 요구사항

- Node.js 16+
- Webpack 5+
- TypeScript
- 웹 서버 (테스트용)

## 🏗️ 프로젝트 구조

```
my-external-skin/
├── src/
│   ├── components/
│   │   ├── LoginSkin/
│   │   │   ├── LoginSkin.tsx
│   │   │   ├── LoginSkin.css
│   │   │   └── index.ts
│   │   ├── SignupSkin/
│   │   │   ├── SignupSkin.tsx
│   │   │   ├── SignupSkin.css
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── variables.css
│   │   └── global.css
│   ├── utils/
│   │   └── helpers.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── dist/                    # 빌드 결과물
├── public/                  # 테스트용 HTML
├── webpack.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 구현 코드

### 1. 프로젝트 초기화

```bash
# 프로젝트 생성
mkdir my-external-skin
cd my-external-skin
npm init -y

# 필수 의존성 설치
npm install react react-dom

# 개발 의존성 설치
npm install -D \
  webpack webpack-cli webpack-dev-server \
  typescript ts-loader \
  css-loader mini-css-extract-plugin \
  html-webpack-plugin \
  @types/react @types/react-dom \
  @withcookie/skin-types
```

### 2. TypeScript 설정

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "es2015"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "declaration": true,
    "outDir": "./dist/types"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

### 3. Webpack 설정

```javascript
// webpack.config.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.ts',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? 'my-external-skin.umd.js' : 'my-external-skin.umd.dev.js',
    library: 'MyExternalSkin',              // 전역 변수명
    libraryTarget: 'umd',                   // UMD 포맷
    globalObject: 'this',                   // Node.js 호환성
    clean: true
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
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[hash][ext]'
        }
      }
    ]
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  
  plugins: [
    ...(isProduction ? [
      new MiniCssExtractPlugin({
        filename: 'my-external-skin.css'
      })
    ] : []),
    
    // 개발용 테스트 HTML
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'test.html'
    })
  ],
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3001,
    hot: true,
    open: '/test.html'
  },
  
  optimization: {
    minimize: isProduction,
    sideEffects: false
  },
  
  performance: {
    hints: isProduction ? 'warning' : false,
    maxAssetSize: 500000,  // 500KB
    maxEntrypointSize: 500000
  }
};
```

### 4. 스킨 컴포넌트 구현

```typescript
// src/components/LoginSkin/LoginSkin.tsx
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';
import './LoginSkin.css';

interface ExternalLoginSkinProps extends ComponentSkinProps {
  data: {
    formData: {
      user_id: string;
      password: string;
    };
    loading: boolean;
    loginError?: string;
    validationErrors: Record<string, string>;
    theme?: {
      primaryColor?: string;
      gradientStart?: string;
      gradientEnd?: string;
    };
  };
  actions: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    handleSignupClick?: () => void;
  };
  options: {
    title?: string;
    subtitle?: string;
    showSignupLink?: boolean;
    animation?: 'fade' | 'slide' | 'bounce';
    layout?: 'card' | 'fullscreen' | 'minimal';
    showLogo?: boolean;
    logoUrl?: string;
  };
}

const ExternalLoginSkin: React.FC<ExternalLoginSkinProps> = ({
  data,
  actions,
  options,
  mode,
  utils,
  app
}) => {
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
    subtitle = '',
    showSignupLink = true,
    animation = 'fade',
    layout = 'card',
    showLogo = true,
    logoUrl = app?.company?.logo || '/default-logo.png'
  } = options;

  const isInteractive = mode !== 'editor';
  
  // 동적 CSS 변수 생성
  const cssVariables = {
    '--primary-color': theme?.primaryColor || '#667eea',
    '--gradient-start': theme?.gradientStart || '#667eea',
    '--gradient-end': theme?.gradientEnd || '#764ba2',
  } as React.CSSProperties;

  return (
    <div 
      className={utils.cx(
        'external-login-skin',
        `external-login-skin--${layout}`,
        `external-login-skin--${animation}`,
        {
          'external-login-skin--loading': loading,
          'external-login-skin--error': !!loginError
        }
      )}
      style={cssVariables}
    >
      {/* 배경 패턴 */}
      <div className="background-pattern" aria-hidden="true">
        <div className="pattern-circle pattern-circle--1"></div>
        <div className="pattern-circle pattern-circle--2"></div>
        <div className="pattern-circle pattern-circle--3"></div>
      </div>
      
      {/* 메인 컨테이너 */}
      <div className="login-container">
        {/* 로고 섹션 */}
        {showLogo && logoUrl && (
          <div className="logo-section">
            <img 
              src={utils.getAssetUrl(logoUrl)} 
              alt={app?.company?.name || 'Logo'} 
              className="logo-image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* 헤더 섹션 */}
        <div className="header-section">
          <h1 className="login-title">{title}</h1>
          {subtitle && (
            <p className="login-subtitle">{subtitle}</p>
          )}
        </div>
        
        {/* 에러 메시지 */}
        {loginError && (
          <div className="error-banner" role="alert">
            <div className="error-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="error-message">{loginError}</span>
          </div>
        )}
        
        {/* 로그인 폼 */}
        <form 
          onSubmit={isInteractive ? handleSubmit : (e) => e.preventDefault()}
          className="login-form"
          noValidate
        >
          {/* 사용자 ID 필드 */}
          <div className="form-field">
            <div className="input-group">
              <div className="input-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 00-11.215 0c-.22.578.254 1.139.872 1.139h9.47z" />
                </svg>
              </div>
              <input
                type="text"
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={isInteractive ? handleChange : undefined}
                className={utils.cx('form-input', {
                  'form-input--error': validationErrors.user_id
                })}
                placeholder={utils.t('login.userIdPlaceholder', {}, { 
                  defaultValue: '사용자 ID 또는 이메일' 
                })}
                disabled={!isInteractive || loading}
                autoComplete="username"
                aria-describedby={validationErrors.user_id ? 'user_id-error' : undefined}
                aria-invalid={!!validationErrors.user_id}
              />
            </div>
            {validationErrors.user_id && (
              <div id="user_id-error" className="field-error" role="alert">
                {validationErrors.user_id}
              </div>
            )}
          </div>
          
          {/* 비밀번호 필드 */}
          <div className="form-field">
            <div className="input-group">
              <div className="input-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4v3H3V4a5 5 0 0110 0v3h-1V4a4 4 0 00-8 0zM7.25 8.25A.75.75 0 018 8v4a.75.75 0 01-1.5 0V8a.75.75 0 01.75-.75z" clipRule="evenodd" />
                  <path d="M3 7a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1H3z" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={isInteractive ? handleChange : undefined}
                className={utils.cx('form-input', {
                  'form-input--error': validationErrors.password
                })}
                placeholder={utils.t('login.passwordPlaceholder', {}, { 
                  defaultValue: '비밀번호' 
                })}
                disabled={!isInteractive || loading}
                autoComplete="current-password"
                aria-describedby={validationErrors.password ? 'password-error' : undefined}
                aria-invalid={!!validationErrors.password}
              />
            </div>
            {validationErrors.password && (
              <div id="password-error" className="field-error" role="alert">
                {validationErrors.password}
              </div>
            )}
          </div>
          
          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="submit-button"
            disabled={!isInteractive || loading}
            aria-label={loading ? utils.t('login.loggingIn', {}, { 
              defaultValue: '로그인 중...' 
            }) : utils.t('login.submit', {}, { defaultValue: '로그인' })}
          >
            <span className="button-content">
              {loading && isInteractive ? (
                <>
                  <div className="loading-spinner" aria-hidden="true"></div>
                  <span>{utils.t('login.loggingIn', {}, { defaultValue: '로그인 중...' })}</span>
                </>
              ) : (
                <>
                  <span>{utils.t('login.submit', {}, { defaultValue: '로그인' })}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 01.5-.5h11.793l-3.147-3.146a.5.5 0 01.708-.708l4 4a.5.5 0 010 .708l-4 4a.5.5 0 01-.708-.708L13.293 8.5H1.5A.5.5 0 011 8z" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>
        
        {/* 회원가입 링크 */}
        {showSignupLink && handleSignupClick && (
          <div className="signup-section">
            <p className="signup-text">
              {utils.t('login.noAccount', {}, { defaultValue: '계정이 없으신가요?' })}
            </p>
            <button
              type="button"
              onClick={isInteractive ? handleSignupClick : undefined}
              className="signup-link"
              disabled={!isInteractive}
            >
              {utils.t('login.signupLink', {}, { defaultValue: '회원가입하기' })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalLoginSkin;
```

### 5. 스타일시트

```css
/* src/components/LoginSkin/LoginSkin.css */

.external-login-skin {
  --primary-color: #667eea;
  --gradient-start: #667eea;
  --gradient-end: #764ba2;
  --error-color: #ef4444;
  --success-color: #10b981;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --border-color: #e5e7eb;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 애니메이션 변형 */
.external-login-skin--fade {
  animation: fadeIn 0.8s ease-out;
}

.external-login-skin--slide {
  animation: slideInUp 0.6s ease-out;
}

.external-login-skin--bounce {
  animation: bounceIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 배경 패턴 */
.background-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.pattern-circle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.pattern-circle--1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 80%;
  animation-delay: 0s;
}

.pattern-circle--2 {
  width: 150px;
  height: 150px;
  top: 70%;
  left: 10%;
  animation-delay: 2s;
}

.pattern-circle--3 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 메인 컨테이너 */
.login-container {
  background: var(--bg-primary);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
  margin: 2rem;
  position: relative;
  z-index: 1;
}

.external-login-skin--minimal .login-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.external-login-skin--fullscreen {
  background: var(--bg-primary);
}

.external-login-skin--fullscreen .login-container {
  background: none;
  box-shadow: none;
  max-width: 500px;
  padding: 2rem;
}

/* 로고 섹션 */
.logo-section {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-image {
  max-height: 60px;
  width: auto;
  object-fit: contain;
}

/* 헤더 섹션 */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

/* 에러 배너 */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-icon {
  color: var(--error-color);
  flex-shrink: 0;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

/* 폼 스타일 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-input--error {
  border-color: var(--error-color);
  background: #fef2f2;
}

.form-input--error:focus {
  border-color: var(--error-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input:disabled {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.field-error {
  color: var(--error-color);
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.field-error::before {
  content: "⚠";
  font-size: 0.75rem;
}

/* 제출 버튼 */
.submit-button {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 회원가입 섹션 */
.signup-section {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.signup-text {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.signup-link {
  background: none;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.75rem 2rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.signup-link:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
  transform: translateY(-1px);
}

.signup-link:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 반응형 디자인 */
@media (max-width: 640px) {
  .external-login-skin {
    padding: 1rem;
  }
  
  .login-container {
    padding: 2rem 1.5rem;
    margin: 1rem;
    border-radius: 16px;
  }
  
  .login-title {
    font-size: 1.75rem;
  }
  
  .form-input,
  .submit-button {
    font-size: 16px; /* iOS 줌 방지 */
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1.5rem 1rem;
  }
  
  .pattern-circle {
    display: none; /* 작은 화면에서 패턴 숨김 */
  }
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  .external-login-skin {
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --bg-primary: #1f2937;
    --bg-secondary: #111827;
    --border-color: #374151;
  }
  
  .form-input {
    background: var(--bg-secondary);
  }
  
  .error-banner {
    background: #1f2937;
    border-color: #374151;
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  .external-login-skin--fade,
  .external-login-skin--slide,
  .external-login-skin--bounce {
    animation: none;
  }
  
  .pattern-circle {
    animation: none;
  }
  
  .submit-button,
  .form-input {
    transition: none;
  }
}

/* 고대비 모드 지원 */
@media (prefers-contrast: high) {
  .external-login-skin {
    --border-color: #000000;
    --text-secondary: #000000;
  }
  
  .form-input {
    border-width: 3px;
  }
  
  .submit-button {
    border: 3px solid #000000;
  }
}
```

### 6. 메인 엔트리 포인트

```typescript
// src/index.ts
import React from 'react';
import { ComponentSkinProps } from '@withcookie/skin-types';

// 스킨 컴포넌트들 import
import ExternalLoginSkin from './components/LoginSkin';
import ExternalSignupSkin from './components/SignupSkin';

// 글로벌 스타일 import
import './styles/global.css';

// 스킨 컴포넌트 매핑
const skinComponents = {
  login: ExternalLoginSkin,
  signup: ExternalSignupSkin,
};

// 메인 스킨 팩토리 함수
const MyExternalSkin = (props: ComponentSkinProps) => {
  const { data, options } = props;
  const componentType = data?.componentType || options?.componentType || 'login';
  
  // 컴포넌트 타입에 따라 적절한 스킨 선택
  const SkinComponent = skinComponents[componentType as keyof typeof skinComponents];
  
  if (!SkinComponent) {
    console.error(`지원되지 않는 컴포넌트 타입: ${componentType}`);
    
    // 에러 폴백 UI
    return React.createElement('div', {
      style: {
        padding: '2rem',
        textAlign: 'center',
        background: '#f8f9fa',
        border: '2px dashed #dee2e6',
        borderRadius: '8px',
        color: '#6c757d'
      }
    }, [
      React.createElement('h3', { key: 'title' }, '지원되지 않는 컴포넌트'),
      React.createElement('p', { key: 'message' }, `컴포넌트 타입: ${componentType}`),
      React.createElement('p', { key: 'supported' }, `지원되는 타입: ${Object.keys(skinComponents).join(', ')}`)
    ]);
  }
  
  return React.createElement(SkinComponent, props);
};

// TypeScript 타입 정의
export interface MyExternalSkinFactory {
  (props: ComponentSkinProps): React.ReactElement;
}

// UMD 환경에서 전역 변수로 노출
if (typeof window !== 'undefined') {
  (window as any).MyExternalSkin = MyExternalSkin;
}

// ES Module 환경에서도 사용 가능
export default MyExternalSkin;

// 개발자를 위한 추가 export
export { ExternalLoginSkin, ExternalSignupSkin };
export * from './types';
```

### 7. 패키지 스크립트

```json
{
  "name": "my-external-skin",
  "version": "1.0.0",
  "description": "WithCookie WebBuilder용 외부 스킨 패키지",
  "main": "dist/my-external-skin.umd.js",
  "types": "dist/types/index.d.ts",
  "files": [
    "dist/**/*"
  ],
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "npm run build:clean && npm run build:prod && npm run build:types",
    "build:clean": "rm -rf dist",
    "build:prod": "NODE_ENV=production webpack --mode production",
    "build:dev": "webpack --mode development",
    "build:types": "tsc --emitDeclarationOnly",
    "serve": "npx http-server dist -p 3002 -c-1",
    "test:bundle": "node scripts/test-bundle.js",
    "validate": "npm run build && npm run test:bundle",
    "prepublishOnly": "npm run validate"
  },
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-dom": ">=17.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "@withcookie/skin-types": "^1.0.0",
    "css-loader": "^6.8.1",
    "html-webpack-plugin": "^5.5.3",
    "mini-css-extract-plugin": "^2.7.6",
    "ts-loader": "^9.4.4",
    "typescript": "^5.2.2",
    "webpack": "^5.88.2",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^4.15.1"
  },
  "keywords": [
    "withcookie",
    "skin",
    "component",
    "react",
    "umd"
  ],
  "author": "Your Name",
  "license": "MIT"
}
```

### 8. 테스트 HTML

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>External Skin Test</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .test-container {
            min-height: 100vh;
            background: #f0f2f5;
        }
        
        .test-controls {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            max-width: 300px;
        }
        
        .control-group {
            margin-bottom: 1rem;
        }
        
        .control-group:last-child {
            margin-bottom: 0;
        }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            font-size: 0.875rem;
        }
        
        select, input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 0.875rem;
        }
        
        button {
            width: 100%;
            padding: 0.5rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
        }
        
        button:hover {
            background: #0056b3;
        }
    </style>
    
    <!-- React 및 ReactDOM CDN -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
</head>
<body>
    <div id="root" class="test-container"></div>
    
    <!-- 테스트 컨트롤 -->
    <div class="test-controls">
        <h3 style="margin-top: 0;">스킨 테스트</h3>
        
        <div class="control-group">
            <label for="layout-select">레이아웃:</label>
            <select id="layout-select">
                <option value="card">Card</option>
                <option value="fullscreen">Fullscreen</option>
                <option value="minimal">Minimal</option>
            </select>
        </div>
        
        <div class="control-group">
            <label for="animation-select">애니메이션:</label>
            <select id="animation-select">
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="bounce">Bounce</option>
            </select>
        </div>
        
        <div class="control-group">
            <label for="primary-color">주요 색상:</label>
            <input type="color" id="primary-color" value="#667eea">
        </div>
        
        <div class="control-group">
            <label for="title-input">제목:</label>
            <input type="text" id="title-input" value="로그인" placeholder="제목을 입력하세요">
        </div>
        
        <div class="control-group">
            <button onclick="toggleError()">에러 토글</button>
        </div>
        
        <div class="control-group">
            <button onclick="toggleLoading()">로딩 토글</button>
        </div>
        
        <div class="control-group">
            <button onclick="reloadSkin()">스킨 새로고침</button>
        </div>
    </div>
    
    <script>
        // 전역 상태
        let currentState = {
            formData: { user_id: '', password: '' },
            loading: false,
            loginError: null,
            validationErrors: {}
        };
        
        let currentOptions = {
            title: '로그인',
            layout: 'card',
            animation: 'fade',
            showSignupLink: true,
            showLogo: true
        };
        
        let currentTheme = {
            primaryColor: '#667eea',
            gradientStart: '#667eea',
            gradientEnd: '#764ba2'
        };
        
        // 유틸리티 함수들
        const utils = {
            t: (key, params, options) => options?.defaultValue || key,
            navigate: (path) => console.log('Navigate to:', path),
            formatCurrency: (amount) => `₩${amount.toLocaleString()}`,
            formatDate: (date) => new Date(date).toLocaleDateString(),
            getAssetUrl: (path) => path,
            cx: (...classes) => classes.filter(Boolean).join(' ')
        };
        
        // 액션 함수들
        const actions = {
            handleChange: (e) => {
                const { name, value } = e.target;
                currentState.formData[name] = value;
                renderSkin();
            },
            handleSubmit: (e) => {
                e.preventDefault();
                console.log('Form submitted:', currentState.formData);
                
                // 간단한 검증
                if (!currentState.formData.user_id) {
                    currentState.validationErrors.user_id = '사용자 ID를 입력하세요';
                    renderSkin();
                    return;
                }
                
                currentState.loading = true;
                currentState.validationErrors = {};
                renderSkin();
                
                // 가상 API 호출
                setTimeout(() => {
                    currentState.loading = false;
                    alert('로그인 성공!');
                    renderSkin();
                }, 2000);
            },
            handleSignupClick: () => {
                alert('회원가입 페이지로 이동');
            }
        };
        
        // 스킨 렌더링 함수
        function renderSkin() {
            const props = {
                data: {
                    ...currentState,
                    theme: currentTheme,
                    componentType: 'login'
                },
                actions: actions,
                options: currentOptions,
                mode: 'production',
                utils: utils,
                app: {
                    company: { name: 'WithCookie', logo: '/logo.png' },
                    theme: { colors: { primary: currentTheme.primaryColor } }
                }
            };
            
            // 스킨이 로드되었는지 확인
            if (window.MyExternalSkin) {
                const skinElement = React.createElement(window.MyExternalSkin, props);
                ReactDOM.render(skinElement, document.getElementById('root'));
            } else {
                document.getElementById('root').innerHTML = '<div style="padding: 2rem; text-align: center;">스킨을 로딩 중...</div>';
            }
        }
        
        // 컨트롤 이벤트 핸들러
        function toggleError() {
            currentState.loginError = currentState.loginError ? null : '잘못된 사용자 ID 또는 비밀번호입니다.';
            renderSkin();
        }
        
        function toggleLoading() {
            currentState.loading = !currentState.loading;
            renderSkin();
        }
        
        function reloadSkin() {
            // 옵션 업데이트
            currentOptions.layout = document.getElementById('layout-select').value;
            currentOptions.animation = document.getElementById('animation-select').value;
            currentOptions.title = document.getElementById('title-input').value;
            currentTheme.primaryColor = document.getElementById('primary-color').value;
            
            renderSkin();
        }
        
        // 컨트롤 이벤트 리스너
        document.getElementById('layout-select').addEventListener('change', reloadSkin);
        document.getElementById('animation-select').addEventListener('change', reloadSkin);
        document.getElementById('primary-color').addEventListener('change', reloadSkin);
        document.getElementById('title-input').addEventListener('input', reloadSkin);
        
        // 초기 렌더링
        renderSkin();
    </script>
</body>
</html>
```

## 🚀 빌드 및 테스트

### 1. 개발 모드 실행

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 http://localhost:3001/test.html 열기
```

### 2. 프로덕션 빌드

```bash
# 프로덕션 빌드 생성
npm run build

# 결과물 확인
ls -la dist/
# my-external-skin.umd.js
# my-external-skin.css
# types/
```

### 3. 번들 테스트

```javascript
// scripts/test-bundle.js
const fs = require('fs');
const path = require('path');

console.log('🧪 UMD 번들 테스트 시작...\n');

// 파일 존재 확인
const distPath = path.join(__dirname, '../dist');
const requiredFiles = [
  'my-external-skin.umd.js',
  'my-external-skin.css'
];

requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    console.log(`✅ ${file} (${sizeKB}KB)`);
  } else {
    console.log(`❌ ${file} 누락`);
    process.exit(1);
  }
});

// UMD 구조 검증
const bundleContent = fs.readFileSync(path.join(distPath, 'my-external-skin.umd.js'), 'utf8');

const checks = [
  {
    name: 'UMD 패턴',
    test: /\(function webpackUniversalModuleDefinition/
  },
  {
    name: '전역 변수',
    test: /MyExternalSkin/
  },
  {
    name: 'React external',
    test: /external.*react/i
  }
];

checks.forEach(check => {
  if (check.test.test(bundleContent)) {
    console.log(`✅ ${check.name} 검증 통과`);
  } else {
    console.log(`❌ ${check.name} 검증 실패`);
    process.exit(1);
  }
});

console.log('\n🎉 모든 테스트 통과!');
```

## 📦 배포 방법

### 1. CDN 배포

```bash
# AWS S3에 업로드 (예시)
aws s3 cp dist/ s3://my-skin-cdn/my-external-skin/v1.0.0/ --recursive --acl public-read

# 버전별 디렉토리 구조
# https://my-skin-cdn.com/my-external-skin/v1.0.0/my-external-skin.umd.js
# https://my-skin-cdn.com/my-external-skin/v1.0.0/my-external-skin.css
```

### 2. WithCookie에 스킨 등록

```bash
# WithCookie API를 통한 스킨 등록
curl -X POST https://api.withcookie.com/skins \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "my-external-skin",
    "name": "My External Skin",
    "description": "커스텀 디자인의 외부 스킨",
    "version": "1.0.0",
    "author": "Your Name",
    "umdUrl": "https://my-skin-cdn.com/my-external-skin/v1.0.0/my-external-skin.umd.js",
    "cssUrls": ["https://my-skin-cdn.com/my-external-skin/v1.0.0/my-external-skin.css"],
    "componentTypes": ["login", "signup"],
    "globalName": "MyExternalSkin",
    "tags": ["authentication", "modern", "animated"]
  }'
```

### 3. 사용자 가이드 작성

```markdown
# My External Skin 사용 가이드

## 설치 방법

1. WithCookie 에디터에서 스킨 라이브러리 열기
2. "my-external-skin" 검색
3. 원하는 컴포넌트에 적용

## 설정 옵션

- **layout**: card, fullscreen, minimal
- **animation**: fade, slide, bounce
- **theme**: 색상 커스터마이징 가능
- **title**: 제목 텍스트 변경

## 지원 컴포넌트

- 로그인 폼
- 회원가입 폼

## 문의사항

이메일: support@example.com
```

## 🎯 핵심 포인트

1. **UMD 포맷**: React를 external로 처리하여 번들 크기 최적화
2. **CSS 분리**: 스타일을 별도 파일로 분리하여 캐싱 효율성 증대  
3. **타입 안전성**: TypeScript로 타입 정의 제공
4. **테스트 환경**: 로컬에서 쉽게 테스트할 수 있는 HTML 제공
5. **에러 처리**: 지원되지 않는 컴포넌트에 대한 적절한 폴백 제공

## 📚 관련 참조

- [외부 스킨 개발 가이드](../../development/external-skin-development.md)
- [ComponentSkinProps 인터페이스](../../reference/props-interface.md)
- [배포 가이드](../deployment/)

---

> **💡 핵심 포인트**: UMD 번들을 통한 외부 스킨 개발은 **독립적인 배포, 런타임 로딩, 버전 관리**를 가능하게 합니다. 적절한 번들 설정과 테스트를 통해 안정적인 외부 스킨을 제공할 수 있습니다.
