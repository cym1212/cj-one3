# 🎨 WithCookie WebBuilder 스킨 시스템

WithCookie WebBuilder의 강력하고 유연한 스킨 시스템에 오신 것을 환영합니다. 이 시스템을 통해 로직과 UI를 완전히 분리하여 무한한 디자인 가능성을 제공합니다.

## 📋 목차

### 🏗️ [아키텍처](./architecture/)
- [시스템 개요](./architecture/system-overview.md) - 전체 스킨 시스템 구조 이해
- [데이터 흐름](./architecture/data-flow.md) - Props 전달 및 상태 관리
- [로딩 메커니즘](./architecture/loading-mechanism.md) - 외부 스킨 동적 로딩
- [보안 및 성능](./architecture/security-performance.md) - 운영 환경 고려사항

### 💻 [개발 가이드](./development/)
- [컴포넌트 마이그레이션](./development/component-migration.md) - 기존 컴포넌트 스킨 시스템 적용
- [외부 스킨 개발](./development/external-skin-development.md) - 외부 개발자 완전 가이드
- [테스트 및 디버깅](./development/testing-debugging.md) - 품질 보증 방법
- [고급 패턴](./development/advanced-patterns.md) - 전문가 수준 개발 기법

### 🚀 [배포 및 호스팅](./deployment/)
- [호스팅 옵션](./deployment/hosting-options.md) - GitHub Pages, AWS S3, CDN 등
- [CDN 설정](./deployment/cdn-setup.md) - 전세계 배포 최적화
- [버전 관리](./deployment/version-management.md) - 안전한 업데이트 전략

### ⚙️ [운영 관리](./operations/)
- [스킨 등록 관리](./operations/skin-registration.md) - 내부 팀 운영 가이드
- [모니터링](./operations/monitoring.md) - 성능 및 오류 추적
- [문제 해결](./operations/troubleshooting.md) - 운영 중 이슈 대응

### 📚 [API 참조](./reference/)
- [컴포넌트 스킨 Props](./reference/component-skin-props.md) - 개별 컴포넌트 스킨 인터페이스
- [외부 레이아웃 Props](./reference/external-layout-props.md) - 전체 레이아웃 스킨 인터페이스
- [유틸리티 함수](./reference/utility-functions.md) - 제공되는 헬퍼 함수들
- [테마 시스템](./reference/theme-system.md) - 색상 및 스타일 시스템

### 💡 [예제 및 템플릿](./examples/)
- [기본 로그인 스킨](./examples/basic-login-skin/) - 시작하기 좋은 기본 예제
- [글래스모피즘 스킨](./examples/glassmorphism-skin/) - 모던한 디자인 예제
- [비즈니스 레이아웃](./examples/business-layout/) - 기업용 레이아웃 예제
- [모바일 최적화](./examples/mobile-optimized/) - 반응형 디자인 예제

### 🔄 [마이그레이션](./migration/)
- [레거시 호환성](./migration/legacy-compatibility.md) - 기존 시스템과의 호환
- [업그레이드 경로](./migration/upgrade-path.md) - 점진적 마이그레이션
- [주요 변경사항](./migration/breaking-changes.md) - 버전별 변경 내용

---

## 🚀 빠른 시작

### 1️⃣ 외부 스킨 개발하기 (5분)
```bash
# 템플릿 복사
cp -r external-skin-template my-custom-skin
cd my-custom-skin

# 개발 시작
npm install && npm run dev
```

### 2️⃣ 기존 컴포넌트에 스킨 시스템 적용하기
```typescript
// 1. 로직 분리
export const useSignupLogic = (componentData, mode) => {
  // 비즈니스 로직만
  return { data, actions };
};

// 2. 기본 스킨 생성
export const BasicSignupSkin = ({ data, actions, options, utils }) => {
  // UI만 담당
  return <form>...</form>;
};

// 3. 스킨 정의
export const SignupSkinnable = {
  type: 'signup',
  useLogic: useSignupLogic,
  internalSkins: { basic: BasicSignupSkin },
  supportsExternalSkins: true
};
```

### 3️⃣ 스킨 등록 및 사용
```typescript
// 외부 스킨 등록
registerComponentSkin({
  id: 'my-custom-signup',
  name: '나의 커스텀 회원가입',
  componentTypes: ['signup'],
  umdUrl: 'https://cdn.example.com/my-signup-skin.umd.js',
  globalName: 'MyCustomSignupSkin'
});

// 컴포넌트에서 스킨 선택
<ComponentRenderer 
  component={signupComponent}
  skinId="my-custom-signup"
/>
```

---

## 🎯 주요 특징

### ✨ **완전한 UI/로직 분리**
- 비즈니스 로직은 재사용, UI는 자유롭게 커스터마이징
- 기존 기능을 그대로 유지하면서 디자인만 변경 가능

### 🔧 **개발자 친화적**
- TypeScript 타입 안전성
- 실시간 핫 리로드 개발 환경
- 상세한 문서 및 예제 제공

### 🚀 **프로덕션 준비됨**
- 자동 에러 처리 및 폴백
- 성능 최적화된 동적 로딩
- 캐싱 및 CDN 지원

### 🌐 **확장 가능한 아키텍처**
- 플러그인 방식으로 새 컴포넌트 쉽게 추가
- 표준화된 인터페이스로 일관성 보장
- 미래 확장을 고려한 설계

---

## 💡 사용 사례

### 🏢 **기업 브랜딩**
- 회사 CI/CD에 맞는 일관된 디자인 시스템 구축
- 브랜드 가이드라인을 반영한 커스텀 컴포넌트

### 🛍️ **업종별 특화**
- 쇼핑몰: 상품 중심의 깔끔한 디자인
- 금융: 신뢰감 있는 안정적인 디자인
- 게임: 역동적이고 화려한 디자인

### 📱 **플랫폼별 최적화**
- 모바일 우선 반응형 디자인
- PWA 및 네이티브 앱 스타일
- 접근성을 고려한 유니버셜 디자인

### 🎨 **디자인 트렌드 대응**
- 글래스모피즘, 뉴모피즘 등 최신 트렌드 적용
- 다크 모드, 라이트 모드 자동 전환
- 사용자 개인화 설정 지원

---

## 🤝 커뮤니티 및 지원

### 📞 **지원 채널**
- 기술 문의: [GitHub Issues](https://github.com/withcookie/webbuilder/issues)
- 커뮤니티: [Discord 채널](https://discord.gg/withcookie)
- 문서 개선: [Documentation PR](https://github.com/withcookie/webbuilder/pulls)

### 🏆 **기여하기**
- 새로운 스킨 예제 제출
- 문서 번역 및 개선
- 버그 리포트 및 기능 제안

### 📈 **로드맵**
- ✅ 로그인 컴포넌트 (완료)
- 🔄 회원가입, 상품목록 (진행중)
- 📋 장바구니, 결제 (계획중)
- 🎯 드래그앤드롭 스킨 에디터 (미래)

---

## 📊 통계

- **지원 컴포넌트**: 1개 (로그인) → 20개+ (목표)
- **외부 스킨**: 무제한 지원
- **개발 시간**: 5분만에 첫 스킨 제작 가능
- **호환성**: 기존 시스템과 100% 호환

---

**💎 WithCookie WebBuilder 스킨 시스템으로 상상하는 모든 디자인을 현실로 만들어보세요!**

> 다음 단계: [시스템 개요](./architecture/system-overview.md)에서 전체 아키텍처를 자세히 알아보세요.