# 📚 외부 스킨 시스템 가이드

> 이 문서는 웹빌더의 외부 스킨 시스템을 처음 접하는 개발자도 쉽게 이해할 수 있도록 작성되었습니다.

## 📋 목차

1. [개요](#개요)
2. [핵심 개념](#핵심-개념)
3. [동작 원리](#동작-원리)
4. [ComponentSkinProps 인터페이스](#componentskinprops-인터페이스)
5. [외부 스킨 개발하기](#외부-스킨-개발하기)
6. [외부 스킨 적용 방법](#외부-스킨-적용-방법)
7. [생명주기](#생명주기)
8. [디버깅 가이드](#디버깅-가이드)
9. [베스트 프랙티스](#베스트-프랙티스)
10. [버전 호환성](#버전-호환성)
11. [보안 고려사항](#보안-고려사항)

---

## 🎯 개요

### 스킨 시스템이란?

웹빌더의 스킨 시스템은 **컴포넌트의 비즈니스 로직과 UI를 분리**하여, 동일한 기능을 다양한 디자인으로 표현할 수 있게 해주는 시스템입니다.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   컴포넌트      │     │   스킨 A        │     │   스킨 B        │
│  (비즈니스 로직) │ ──> │   (UI 디자인)    │ OR  │   (UI 디자인)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 왜 스킨 시스템을 사용하나요?

1. **재사용성**: 하나의 로직으로 여러 디자인 적용 가능
2. **유지보수**: 로직과 UI가 분리되어 관리가 쉬움
3. **확장성**: 새로운 디자인을 쉽게 추가 가능
4. **협업**: 개발자와 디자이너가 독립적으로 작업 가능

---

## 🔑 핵심 개념

### 1. 컴포넌트 (Component)
- **역할**: 비즈니스 로직 담당
- **예시**: 로그인 폼의 유효성 검사, API 호출 등

### 2. 스킨 (Skin)
- **역할**: UI 렌더링 담당
- **예시**: 버튼 스타일, 레이아웃, 애니메이션 등

### 3. data와 actions
- **data**: 컴포넌트의 상태값 (예: 로딩 중, 에러 메시지 등)
- **actions**: 사용자 상호작용 핸들러 (예: 클릭, 입력 등)

---

## ⚙️ 동작 원리

### 전체 플로우

```
사용자가 컴포넌트 추가
        ↓
컴포넌트 로직 실행 (useLogic)
        ↓
data와 actions 생성
        ↓
ComponentSkinWrapper가 props 준비
        ↓
선택된 스킨에 props 전달
        ↓
스킨이 UI 렌더링
```

### 코드로 보는 동작 원리

```javascript
// 1. 컴포넌트 로직에서 data와 actions 반환
const useLoginLogic = (componentData, mode) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    setIsLoading(true);
    // API 호출 등...
  };
  
  return {
    data: {
      username,
      password,
      isLoading
    },
    actions: {
      onUsernameChange: setUsername,
      onPasswordChange: setPassword,
      onSubmit: handleSubmit
    }
  };
};

// 2. 스킨에서 받아서 UI 렌더링
const LoginSkin = ({ data, actions }) => {
  return (
    <form onSubmit={actions.onSubmit}>
      <input 
        value={data.username}
        onChange={e => actions.onUsernameChange(e.target.value)}
      />
      <button disabled={data.isLoading}>
        {data.isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
};
```

---

## 📦 ComponentSkinProps 인터페이스

모든 스킨이 받는 표준 props 구조입니다:

```typescript
interface ComponentSkinProps {
  // 1. 컴포넌트 데이터
  data: {
    // 컴포넌트 로직에서 제공하는 모든 상태값
    // 예: isLoading, errorMessage, items 등
    [key: string]: any;
  };
  
  // 2. 액션 (이벤트 핸들러)
  actions: {
    // 컴포넌트 로직에서 제공하는 모든 함수
    // 예: onSubmit, onChange, onDelete 등
    [key: string]: (...args: any[]) => any;
  };
  
  // 3. 설정 옵션
  options: {
    // 웹빌더에서 설정한 컴포넌트 옵션
    // 예: showTitle, itemsPerPage 등
    [key: string]: any;
  };
  
  // 4. 렌더 모드
  mode: 'editor' | 'preview' | 'production';
  
  // 5. 유틸리티 함수들
  utils: {
    t: (key: string) => string;              // 번역
    navigate: (path: string) => void;        // 페이지 이동
    formatCurrency: (amount: number) => string; // 통화 포맷
    formatDate: (date: Date) => string;      // 날짜 포맷
    getAssetUrl: (path: string) => string;   // 에셋 URL
    cx: (...classes: string[]) => string;    // 클래스명 조합
  };
  
  // 6. 앱 전역 데이터 (선택사항)
  app?: {
    user?: any;           // 로그인한 사용자 정보
    company?: any;        // 회사 정보
    currentLanguage?: string; // 현재 언어
    theme?: any;          // 테마 설정
  };
  
  // 7. 에디터 전용 (에디터 모드에서만)
  editor?: {
    isSelected: boolean;      // 선택됨 여부
    onSelect: () => void;     // 선택 핸들러
    onEdit: () => void;       // 편집 핸들러
    onDelete: () => void;     // 삭제 핸들러
    dragHandleProps?: any;    // 드래그 속성
  };
}
```

### 각 속성 활용 예시

```javascript
const MySkin = ({ data, actions, utils, mode, app }) => {
  // 1. data 사용
  if (data.isLoading) {
    return <div>로딩 중...</div>;
  }
  
  // 2. actions 사용
  const handleClick = () => {
    actions.onButtonClick();
  };
  
  // 3. utils 사용
  const price = utils.formatCurrency(1000); // "₩1,000"
  const greeting = utils.t('welcome'); // 다국어 지원
  
  // 4. mode별 처리
  if (mode === 'editor') {
    // 에디터에서만 보이는 UI
    return <div className="editor-preview">...</div>;
  }
  
  // 5. app 데이터 사용
  if (app?.user) {
    return <div>안녕하세요, {app.user.name}님!</div>;
  }
};
```

---

## 🛠️ 외부 스킨 개발하기

### 1. 프로젝트 구조

```
my-custom-skin/
├── src/
│   ├── index.js          # 진입점
│   ├── LoginSkin.js      # 로그인 스킨
│   └── styles.css        # 스타일
├── dist/
│   ├── bundle.js         # 빌드된 UMD 번들
│   └── styles.css        # 빌드된 CSS
└── package.json
```

### 2. 스킨 컴포넌트 작성

```javascript
// src/LoginSkin.js
import React from 'react';

const LoginSkin = ({ data, actions, utils, mode }) => {
  // 에디터 모드 처리
  if (mode === 'editor') {
    return (
      <div className="login-preview">
        <p>로그인 스킨 미리보기</p>
      </div>
    );
  }
  
  return (
    <div className="custom-login-container">
      <h2>{utils.t('login.title')}</h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        actions.onSubmit();
      }}>
        <input
          type="text"
          placeholder={utils.t('login.username')}
          value={data.username || ''}
          onChange={(e) => actions.onUsernameChange(e.target.value)}
          disabled={data.isLoading}
        />
        
        <input
          type="password"
          placeholder={utils.t('login.password')}
          value={data.password || ''}
          onChange={(e) => actions.onPasswordChange(e.target.value)}
          disabled={data.isLoading}
        />
        
        {data.errorMessage && (
          <div className="error-message">{data.errorMessage}</div>
        )}
        
        <button type="submit" disabled={data.isLoading}>
          {data.isLoading ? utils.t('login.loading') : utils.t('login.submit')}
        </button>
      </form>
    </div>
  );
};

export default LoginSkin;
```

### 3. UMD 번들 생성

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: 'MyCustomSkins',  // 전역 변수명
    libraryTarget: 'umd'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  }
};
```

---

## 📥 외부 스킨 적용 방법

### 1. 스킨 등록 (코드로)

```javascript
import { registerComponentSkin } from '@withcookie/webbuilder';

registerComponentSkin({
  id: 'my-custom-login',
  name: 'My Custom Login Skin',
  componentTypes: ['login'],  // 지원하는 컴포넌트 타입
  umdUrl: 'https://cdn.example.com/my-skin/bundle.js',
  globalName: 'MyCustomSkins',
  cssUrls: ['https://cdn.example.com/my-skin/styles.css'],
  preview: 'https://cdn.example.com/my-skin/preview.png',
  description: '모던한 로그인 스킨',
  version: '1.0.0',
  author: 'Your Name'
});
```

### 2. 웹빌더 UI에서 선택

1. 컴포넌트 선택
2. 속성 패널에서 "스킨" 드롭다운 클릭
3. 등록된 외부 스킨 선택

---

## 🔄 생명주기

### 1. 스킨 로딩 과정

```
스킨 선택
    ↓
CSS 파일 로드 (있는 경우)
    ↓
UMD 번들 로드
    ↓
전역 객체에서 컴포넌트 추출
    ↓
React 컴포넌트로 렌더링
```

### 2. 업데이트 사이클

```javascript
// 웹빌더에서 속성 변경
사용자가 속성 패널에서 값 변경
    ↓
컴포넌트 로직 재실행
    ↓
새로운 data/actions 생성
    ↓
스킨 리렌더링
```

---

## 🐛 디버깅 가이드

### 1. 콘솔 로그 활용

```javascript
const MySkin = ({ data, actions }) => {
  // 개발 중 디버깅
  console.log('Skin received data:', data);
  console.log('Available actions:', Object.keys(actions));
  
  return <div>...</div>;
};
```

### 2. React DevTools 활용

1. Chrome/Firefox React DevTools 설치
2. Components 탭에서 스킨 컴포넌트 찾기
3. Props 확인하여 전달된 데이터 검증

### 3. 일반적인 문제 해결

#### 문제: 스킨이 로드되지 않음
```javascript
// 해결 방법:
// 1. 네트워크 탭에서 UMD 파일 로드 확인
// 2. 콘솔에서 전역 변수 확인
console.log(window.MyCustomSkins); // undefined면 로드 실패

// 3. CORS 에러 확인 - CDN 설정 필요
```

#### 문제: data가 undefined
```javascript
// 안전한 처리
const MySkin = ({ data = {} }) => {
  const username = data.username || '';  // 기본값 설정
  return <input value={username} />;
};
```

---

## ✨ 베스트 프랙티스

### 1. 타입 안전성

```typescript
// 타입 정의
interface LoginSkinData {
  username: string;
  password: string;
  isLoading: boolean;
  errorMessage?: string;
}

interface LoginSkinActions {
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
}

const LoginSkin: React.FC<ComponentSkinProps> = ({ data, actions }) => {
  const typedData = data as LoginSkinData;
  const typedActions = actions as LoginSkinActions;
  // ...
};
```

### 2. 성능 최적화

```javascript
import React, { memo, useCallback } from 'react';

// 메모이제이션으로 불필요한 리렌더링 방지
const MySkin = memo(({ data, actions }) => {
  // 콜백 메모이제이션
  const handleClick = useCallback(() => {
    actions.onClick();
  }, [actions.onClick]);
  
  return <button onClick={handleClick}>클릭</button>;
});
```

### 3. 반응형 디자인

```javascript
const MySkin = ({ data, utils }) => {
  const isMobile = data.viewMode === 'mobile';
  
  return (
    <div className={utils.cx(
      'my-skin',
      isMobile && 'my-skin--mobile'
    )}>
      {/* 모바일/데스크톱별 레이아웃 */}
    </div>
  );
};
```

### 4. 에러 처리

```javascript
const MySkin = ({ data, actions }) => {
  try {
    return (
      <div>
        {data.items.map(item => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Skin render error:', error);
    return <div>렌더링 중 오류가 발생했습니다.</div>;
  }
};
```

---

## 🔄 버전 호환성

### 버전 관리 전략

```javascript
// 스킨 설정에 버전 명시
{
  id: 'my-skin',
  version: '1.2.0',
  minComponentVersion: '2.0.0',  // 최소 요구 컴포넌트 버전
}
```

### 하위 호환성 유지

```javascript
const MySkin = ({ data }) => {
  // 새 속성과 구 속성 모두 지원
  const title = data.title || data.legacyTitle || '기본 제목';
  
  // 조건부 기능
  const supportsNewFeature = data.version >= '2.0.0';
  
  return (
    <div>
      <h1>{title}</h1>
      {supportsNewFeature && <NewFeature />}
    </div>
  );
};
```

---

## 🔒 보안 고려사항

### 1. XSS 방지

```javascript
// 위험: dangerouslySetInnerHTML 사용 시 주의
const MySkin = ({ data }) => {
  // ❌ 위험한 방법
  return <div dangerouslySetInnerHTML={{ __html: data.content }} />;
  
  // ✅ 안전한 방법
  return <div>{data.content}</div>;
};
```

### 2. 사용자 입력 검증

```javascript
const MySkin = ({ data, actions }) => {
  const handleSubmit = () => {
    // 클라이언트 측 검증
    if (!data.email || !data.email.includes('@')) {
      alert('올바른 이메일을 입력하세요');
      return;
    }
    actions.onSubmit();
  };
};
```

### 3. 민감한 정보 보호

```javascript
const MySkin = ({ app }) => {
  // 민감한 정보는 로그에 남기지 않기
  console.log('User logged in:', app.user?.id); // ✅
  // console.log('User data:', app.user); // ❌ 전체 정보 노출
};
```

### 4. CORS 설정

```
# CDN 서버 CORS 헤더 설정
Access-Control-Allow-Origin: https://your-domain.com
Access-Control-Allow-Methods: GET, OPTIONS
```

---

## 📚 다음 단계

1. **예제 프로젝트**: [GitHub 예제 저장소](https://github.com/example/skin-examples)
2. **컴포넌트별 API 문서**: 각 컴포넌트의 data/actions 명세
3. **디자인 시스템 통합**: Material-UI, Ant Design 등과 통합하기

---

## 🤝 도움말

질문이나 문제가 있으신가요?

- **문서**: [웹빌더 개발자 문서](https://docs.webbuilder.com)
- **커뮤니티**: [개발자 포럼](https://forum.webbuilder.com)
- **지원**: support@webbuilder.com

---

*이 문서는 웹빌더 v2.0 기준으로 작성되었습니다.*