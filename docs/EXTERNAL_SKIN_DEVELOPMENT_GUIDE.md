# 외부 스킨 개발 가이드

외부 스킨 개발자를 위한 상세 가이드입니다.

## 스킨 등록 방법

외부 스킨은 전역 변수로 export하면 로더가 자동으로 감지하여 로드합니다.

### 기본 스킨 템플릿

```javascript
// 방법 1: 즉시 export (권장)
(function() {
  // 스킨 컴포넌트 정의
  const SkinComponent = (props) => {
    // 스킨 구현
    return <div>...</div>;
  };
  
  // 전역 변수로 export
  window.WithCookieSkin_YOUR_SKIN_ID = SkinComponent;
})();

// 방법 2: 레지스트리 사용 (선택사항)
(function() {
  const skinId = 'YOUR_SKIN_ID';
  
  const SkinComponent = (props) => {
    return <div>...</div>;
  };
  
  // 레지스트리가 있으면 사용, 없으면 전역 변수
  if (window.WithCookieSkinRegistry) {
    window.WithCookieSkinRegistry.register(skinId, SkinComponent);
  } else {
    window[`WithCookieSkin_${skinId}`] = SkinComponent;
  }
})();
```

### 지원되는 전역 변수 패턴

로더는 다음 패턴의 전역 변수를 자동으로 감지합니다:
- `WithCookieSkin_${skinId}` (권장)
- `WithCookieSkin${skinId}`
- `ExternalSkin${skinId}`
- 서버에서 지정한 globalName

## 스킨 Props 구조

모든 외부 스킨은 다음과 같은 표준 props를 받습니다:

```typescript
interface ComponentSkinProps {
  // 컴포넌트 데이터
  data: {
    // 컴포넌트별 데이터 (예: formData, products, menus 등)
    [key: string]: any;
    
    // 공통 속성
    componentProps?: Record<string, any>;
    viewMode?: 'pc' | 'mobile' | 'tablet';
  };
  
  // 사용자 액션 핸들러
  actions: {
    // 컴포넌트별 액션 (예: handleSubmit, handleChange 등)
    [key: string]: Function;
  };
  
  // 컴포넌트 옵션
  options: Record<string, any>;
  
  // 렌더링 모드
  mode: 'editor' | 'preview';
  
  // 유틸리티 함수
  utils: {
    t: (key: string) => string;          // 번역
    navigate: (path: string) => void;    // 라우팅
    formatCurrency: (amount: number, currency?: string) => string;
    formatDate: (date: Date | string, format?: string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: any[]) => string;   // 클래스명 조합
  };
  
  // 앱 정보
  app: {
    user: User | null;
    company: Company | null;
    currentLanguage: string;
    isUserLoggedIn: boolean;
    theme: Theme;
  };
}
```

## 컴포넌트별 데이터 구조

### Login 컴포넌트
```typescript
data: {
  formData: {
    userId: string;
    password: string;
  };
  validationErrors: {
    userId?: string;
    password?: string;
  };
  loading: boolean;
  loginSuccess: boolean;
  message?: string;
}

actions: {
  handleChange: (e: Event) => void;
  handleSubmit: (e: Event) => void;
  handleSocialLogin: (provider: string) => void;
}
```

### ProductSlider 컴포넌트
```typescript
data: {
  products: Array<{
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    description?: string;
    category?: string;
    stock: number;
    isNew?: boolean;
    isSale?: boolean;
  }>;
  title?: string;
  settings: {
    slidesToShow: number;
    slidesToScroll: number;
    autoplay: boolean;
    autoplaySpeed: number;
    dots: boolean;
    arrows: boolean;
  };
}

actions: {
  handleProductClick: (product: Product) => void;
  handleAddToCart: (product: Product) => void;
}
```

### MainBanner 컴포넌트
```typescript
data: {
  banners: Array<{
    id: string;
    image: string;
    title?: string;
    description?: string;
    link?: string;
    buttonText?: string;
  }>;
  settings: {
    autoplay: boolean;
    autoplaySpeed: number;
    dots: boolean;
    arrows: boolean;
    fade: boolean;
  };
}

actions: {
  handleBannerClick: (banner: Banner) => void;
}
```

## CSS 스타일링

### 스킨별 CSS 스코핑

CSS는 자동으로 스킨 ID로 스코핑됩니다:

```css
/* 외부 스킨 CSS */
.external-skin-wrapper.skin-YOUR_SKIN_ID .your-class {
  /* 스타일 */
}
```

### 버전 관리

CSS 파일은 버전별로 관리되며, 새 버전 배포 시 자동으로 이전 버전이 제거됩니다.

## 성능 최적화

### 1. 로딩 최적화
- CSS와 JS는 병렬로 로드됩니다
- CSS가 먼저 로드되어 스타일 깜빡임을 방지합니다
- 타임아웃은 10초로 설정되어 있습니다

### 2. 캐싱
- 스킨은 버전별로 캐싱됩니다
- API 응답은 5분간 캐싱됩니다
- 로컬 스토리지에 메타데이터가 24시간 저장됩니다

### 3. 중복 로딩 방지
- 싱글톤 패턴으로 같은 스킨의 중복 로딩을 방지합니다
- 여러 컴포넌트가 같은 스킨을 사용해도 한 번만 로드됩니다

## 에러 처리

### Error Boundary

모든 외부 스킨은 Error Boundary로 감싸져 있어 렌더링 에러가 발생해도 전체 앱이 중단되지 않습니다.

```javascript
// 에러 발생 시 자동으로 폴백 UI 표시
<SkinErrorBoundary skinId={skinId}>
  <YourSkinComponent {...props} />
</SkinErrorBoundary>
```

### 로딩 실패 처리

로딩 실패 시 사용자에게 친화적인 에러 메시지가 표시됩니다:
- 스크립트 로드 실패
- 타임아웃 (10초)
- 잘못된 컴포넌트 형식

## 개발 팁

### 1. 개발 환경 설정
```javascript
// 개발 중 로그 확인
console.log('[YourSkin] Props:', props);
console.log('[YourSkin] Data:', props.data);
console.log('[YourSkin] Actions:', props.actions);
```

### 2. TypeScript 지원
```typescript
import type { ComponentSkinProps } from '@withcookie/types';

const YourSkin: React.FC<ComponentSkinProps> = (props) => {
  // TypeScript 자동 완성 지원
};
```

### 3. 테스트
```javascript
// 로컬 테스트를 위한 mock props
const mockProps = {
  data: { /* 테스트 데이터 */ },
  actions: { /* 테스트 액션 */ },
  utils: { /* 테스트 유틸 */ },
  // ...
};
```

## 주의사항

1. **전역 변수 충돌 방지**: 즉시 실행 함수로 감싸서 전역 스코프 오염을 방지하세요
2. **React 버전**: window.React와 window.ReactDOM이 자동으로 제공됩니다
3. **즉시 export**: 스킨은 스크립트 로드 후 즉시 전역 변수로 사용 가능해야 합니다
4. **비동기 로딩**: 스킨 내부에서 비동기 작업 시 컴포넌트 언마운트를 확인하세요
5. **메모리 누수**: 이벤트 리스너나 타이머는 반드시 정리하세요

## 배포 체크리스트

- [ ] 스킨 ID가 서버에서 제공하는 ID와 일치하는가?
- [ ] 전역 변수로 올바르게 export되는가? (예: `window.WithCookieSkin_ID`)
- [ ] 스크립트 로드 후 즉시 사용 가능한가?
- [ ] CSS 클래스가 적절히 스코핑되어 있는가?
- [ ] 에러 처리가 적절히 구현되어 있는가?
- [ ] 불필요한 console.log가 제거되었는가?
- [ ] 프로덕션 빌드가 최적화되어 있는가?

## 문제 해결

### 스킨이 로드되지 않을 때
1. 브라우저 콘솔에서 에러 메시지 확인
2. 네트워크 탭에서 스킨 파일이 정상적으로 로드되는지 확인
3. 전역 변수가 올바르게 설정되었는지 확인:
   ```javascript
   console.log(window.WithCookieSkin_YOUR_SKIN_ID); // 컴포넌트 함수가 출력되어야 함
   ```

### CSS가 적용되지 않을 때
1. CSS 파일 URL이 올바른지 확인
2. CSS 선택자가 `.external-skin-wrapper.skin-YOUR_SKIN_ID`로 시작하는지 확인
3. 다른 CSS와 충돌하지 않는지 확인

### 성능 문제
1. 번들 크기 확인 (권장: < 500KB)
2. 불필요한 의존성 제거
3. 이미지 최적화
4. 코드 스플리팅 적용