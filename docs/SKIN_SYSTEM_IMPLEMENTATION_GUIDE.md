# 📚 스킨 시스템 구현 상태 점검 및 작업 가이드 (상세 버전)

## 📁 필수 파일 구조

스킨 시스템을 완전히 구현하려면 다음 파일들이 필요합니다:

```
src/components/module/[Component]/
├── index.tsx                    # 컴포넌트 등록 및 래퍼 (ComponentSkinWrapper 사용)
├── [Component].component.tsx    # 레거시 호환용 (선택사항)
├── [Component]Logic.ts         # 비즈니스 로직 (actions 객체 필수)
├── [Component]Skinnable.tsx    # 스킨 가능 컴포넌트 정의
├── [Component].types.ts        # TypeScript 타입 정의
├── [Component].adapter.ts      # props 변환 로직 (필요시)
├── [Component].css            # 기본 스타일 (선택사항)
├── [Component].editor.tsx      # 에디터 컴포넌트
├── [Component].properties.ts   # 속성 패널 정의
└── skins/
    ├── Basic[Component]Skin.tsx  # 기본 스킨 구현
    └── [OtherSkin]Skin.tsx      # 추가 스킨 (선택사항)
```

## 🔍 체크리스트: 각 컴포넌트 점검 방법

### 1. Logic.ts 파일 점검
```bash
# actions 객체 존재 여부 확인
grep -n "actions:" [Component]Logic.ts

# return 문 구조 확인
grep -A 10 "return {" [Component]Logic.ts
```

**✅ 올바른 구조 예시:**
```typescript
return {
  data: {
    posts: posts,
    loading: loading,
    formData: formData,
    // 기타 상태값들
  },
  actions: {
    handleSubmit,
    handleDelete,
    handleInputChange,
    // 모든 핸들러 함수들
  }
}
```

**❌ 잘못된 구조 예시:**
```typescript
return {
  posts: posts,
  loading: loading,
  handleSubmit,  // actions 객체 없이 직접 반환
  handleDelete
}
```

### 2. component.tsx 파일 점검
```bash
# ComponentSkinWrapper 사용 여부 확인
grep "ComponentSkinWrapper" [Component].component.tsx

# 직접 UI 렌더링 확인 (return 문에 JSX가 있는지)
grep -A 20 "return (" [Component].component.tsx
```

**✅ 올바른 구조 예시:**
```typescript
import ComponentSkinWrapper from '../../skins/ComponentSkinWrapper';
import { [Component]Skinnable } from './[Component]Skinnable';

const [Component]Component = (props) => {
  const componentData = {
    id: props.id,
    type: '[COMPONENT_TYPE]',
    componentProps: props.componentProps,
    // 기타 필요한 데이터
  };
  
  const mode = props.isEditor ? 'editor' : 'production';
  
  return (
    <ComponentSkinWrapper
      component={[Component]Skinnable}
      componentData={componentData}
      mode={mode}
    />
  );
};
```

**❌ 잘못된 구조 예시:**
```typescript
const [Component]Component = (props) => {
  // 로직 처리...
  
  return (
    <div className="component-wrapper">
      <h1>{title}</h1>
      <button onClick={handleClick}>클릭</button>
      {/* 직접 UI 렌더링 */}
    </div>
  );
};
```

### 3. BasicSkin.tsx 파일 점검
```bash
# 파일 크기 비교로 UI 이전 완성도 확인
wc -l [Component].component.tsx
wc -l skins/Basic[Component]Skin.tsx

# props 구조 확인
grep "props:" skins/Basic[Component]Skin.tsx
```

**✅ 올바른 구조 예시:**
```typescript
interface Basic[Component]SkinProps extends ComponentSkinProps {
  // 추가 props 정의 (필요시)
}

const Basic[Component]Skin: React.FC<Basic[Component]SkinProps> = (props) => {
  // props에서 data와 actions 추출
  const {
    data: {
      posts,
      loading,
      currentPage,
      totalPages,
      // 기타 데이터
    },
    actions: {
      handlePageChange,
      handlePostClick,
      handleDelete,
      // 기타 액션
    },
    utils: { t, navigate, formatDate },
    app: { theme, user }
  } = props;
  
  // UI 렌더링
  return (
    <div className="component-container">
      {/* 전체 UI 구현 */}
    </div>
  );
};
```

---

## 🛠️ 구현 가이드: 단계별 작업 방법

### 📝 Step 0: 필수 파일 생성

#### 0-1. types.ts 파일 생성
```typescript
// [Component].types.ts
import { ComponentData, ComponentRenderMode } from '../../../types/component-skin';

// 컴포넌트 Props 정의
export interface [Component]Props {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  componentProps?: {
    title?: string;
    // 컴포넌트별 설정값
  };
  isEditor?: boolean;
  isPreview?: boolean;
  externalSkin?: {
    url: string;
    globalName: string;
    cssUrl?: string;
  } | null;
}

// Logic 반환 타입 정의
export interface [Component]LogicReturn {
  data: {
    // 상태값들
    loading: boolean;
    error: string | null;
    // 기타 데이터
  };
  actions: {
    // 액션 함수들
    handleSubmit: () => void;
    handleChange: (field: string, value: any) => void;
    // 기타 액션
  };
}
```

#### 0-2. Skinnable.tsx 파일 생성
```typescript
// [Component]Skinnable.tsx
import { SkinnableComponent } from '../../../types/component-skin';
import { COMPONENT_TYPES } from '../../../constants';
import { use[Component]Logic } from './[Component]Logic';
import Basic[Component]Skin from './skins/Basic[Component]Skin';

export const [Component]Skinnable: SkinnableComponent = {
  type: COMPONENT_TYPES.[COMPONENT] || '[COMPONENT]',
  name: '[컴포넌트 이름]',
  category: 'content', // 'auth', 'ecommerce', 'member', 'content' 등
  supportsExternalSkins: true,
  options: [],
  defaultSkin: 'basic',
  internalSkins: {
    basic: Basic[Component]Skin as any
  },
  useLogic: use[Component]Logic as any,
  defaultProps: {
    title: '기본 제목',
    // 기타 기본값
  }
};
```

### 📝 Step 1: Logic.ts 파일 수정

#### 1-1. 현재 구조 분석
```typescript
// 현재 핸들러 함수들이 어떻게 정의되어 있는지 확인
const use[Component]Logic = (componentData, mode) => {
  // 상태 정의
  const [posts, setPosts] = useState([]);
  
  // 핸들러 함수들
  const handleSubmit = () => { ... };
  const handleDelete = (id) => { ... };
  
  // 현재 return 구조 확인
  return {
    posts,
    handleSubmit,
    handleDelete
  };
};
```

#### 1-2. actions 객체로 그룹화
```typescript
const use[Component]Logic = (componentData, mode) => {
  // 상태 정의 (변경 없음)
  const [posts, setPosts] = useState([]);
  
  // 핸들러 함수들 (변경 없음)
  const handleSubmit = () => { ... };
  const handleDelete = (id) => { ... };
  const handleInputChange = (e) => { ... };
  
  // return 구조 수정
  return {
    data: {
      // 모든 상태값
      posts,
      loading,
      error,
      formData,
      currentPage,
      totalPages
    },
    actions: {
      // 모든 핸들러 함수
      handleSubmit,
      handleDelete,
      handleInputChange,
      handlePageChange,
      // 기타 모든 함수들
    }
  };
};
```

### 📝 Step 2: index.tsx 파일 생성 (가장 중요!)

#### 2-1. 완전한 index.tsx 구조
```typescript
// index.tsx
import React from 'react';
import [Component]Editor from './[Component].editor';
import [Component]Properties from './[Component].properties';
import { registerComponent, registerSkinnableComponent } from '../registry';
import { [Component]Skinnable } from './[Component]Skinnable';
import ComponentSkinWrapper from '../../skins/ComponentSkinWrapper';
import { COMPONENT_TYPES } from '../../../constants';

// 스킨 가능한 컴포넌트로 등록
registerSkinnableComponent([Component]Skinnable);

// 외부 스킨 지원을 위한 래퍼 컴포넌트
const [Component]Wrapper: React.FC<any> = (props) => {
  const selectedSkin = props.skin || props.componentProps?.skin || 'basic';
  
  return (
    <ComponentSkinWrapper 
      component={[Component]Skinnable}
      componentData={props}
      skinId={selectedSkin}
      mode={props.isPreview ? 'editor' : 'preview'}
      editorProps={props}
    />
  );
};

// 레거시 호환성을 위한 기존 컴포넌트 등록
registerComponent({
  type: COMPONENT_TYPES.[COMPONENT] || '[COMPONENT]',
  component: [Component]Wrapper,
  editorComponent: [Component]Editor,
  properties: [Component]Properties,
  defaultProps: {
    style: {
      // 기본 스타일
    },
    componentProps: {
      skin: 'basic',
      // 기본 설정값
    }
  },
  category: 'content',
  icon: '📄',
  name: '[컴포넌트 이름]',
  skinnable: [Component]Skinnable
});

// 컴포넌트 및 타입 내보내기
export { [Component]Wrapper as [Component]Component };
export { default as [Component]Editor } from './[Component].editor';
export { default as [Component]Properties } from './[Component].properties';
export * from './[Component].types';
```

### 📝 Step 3: component.tsx 파일 수정 (선택사항)

#### 2-1. 기존 코드 백업
```typescript
// 1. 먼저 기존 UI 코드를 주석 처리하여 백업
/*
const [Component]Component = (props) => {
  // 기존 로직...
  
  return (
    <div>
      {/* 기존 UI */}
    </div>
  );
};
*/
```

#### 2-2. 스킨 시스템으로 전환
```typescript
import React from 'react';
import ComponentSkinWrapper from '../../skins/ComponentSkinWrapper';
import { [Component]Skinnable } from './[Component]Skinnable';
import { COMPONENT_TYPES } from '../../../constants';

const [Component]Component: React.FC<[Component]Props> = (props) => {
  // ComponentData 구성
  const componentData = {
    id: props.id || `${COMPONENT_TYPES.[COMPONENT]}-${Date.now()}`,
    type: COMPONENT_TYPES.[COMPONENT],
    componentProps: props.componentProps || {},
    props: props,
    theme: props.theme || {},
    externalSkin: props.externalSkin
  };
  
  // 렌더 모드 결정
  const mode = props.isEditor ? 'editor' : 
               props.isPreview ? 'preview' : 'production';
  
  // 에디터 props (필요한 경우)
  const editorProps = props.isEditor ? {
    isSelected: props.isSelected,
    onSelect: props.onSelect,
    onEdit: props.onEdit,
    onDelete: props.onDelete
  } : undefined;
  
  return (
    <ComponentSkinWrapper
      component={[Component]Skinnable}
      componentData={componentData}
      mode={mode}
      editorProps={editorProps}
    />
  );
};

export default [Component]Component;
```

### 📝 Step 4: BasicSkin.tsx 완성

#### 3-1. 누락된 UI 확인
```typescript
// 1. component.tsx의 백업된 UI 코드 확인
// 2. BasicSkin.tsx의 현재 구현 상태 비교
// 3. 누락된 부분 목록 작성

/* 예시 - Board 컴포넌트의 경우:
   component.tsx에 있지만 BasicSkin에 없는 것들:
   - 페이지네이션 UI
   - 댓글 작성 폼
   - 댓글 목록
   - 에디터 통합
   - 검색 기능
*/
```

#### 3-2. 누락된 UI 이전
```typescript
const BasicBoardSkin: React.FC<BasicBoardSkinProps> = (props) => {
  const {
    data: {
      posts,
      currentPage,
      totalPages,
      comments,
      formData,
      // 모든 필요한 데이터
    },
    actions: {
      handlePageChange,
      handlePostClick,
      handleCommentSubmit,
      handleInputChange,
      // 모든 필요한 액션
    },
    utils: { t, navigate, formatDate, cx },
    app: { theme, user, isUserLoggedIn }
  } = props;
  
  return (
    <div className="board-container">
      {/* 기존 UI */}
      
      {/* 누락된 페이지네이션 추가 */}
      <div className="pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {t('이전')}
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {t('다음')}
        </button>
      </div>
      
      {/* 누락된 댓글 폼 추가 */}
      {isUserLoggedIn && (
        <form onSubmit={handleCommentSubmit}>
          <textarea 
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            placeholder={t('댓글을 입력하세요')}
          />
          <button type="submit">{t('댓글 작성')}</button>
        </form>
      )}
      
      {/* 기타 누락된 UI 요소들 추가 */}
    </div>
  );
};
```

### 📝 Step 5: adapter.ts 파일 생성 (필요시)

#### 5-1. Props 변환이 필요한 경우
```typescript
// [Component].adapter.ts
import { [Component]Props } from './[Component].types';

/**
 * 레거시 props를 새로운 형식으로 변환
 */
export function adapt[Component]Props(props: any): [Component]Props {
  return {
    id: props.id,
    className: props.className || '',
    style: props.style || {},
    componentProps: {
      title: props.title || props.componentProps?.title || '기본 제목',
      // 레거시 props 매핑
      ...props.componentProps
    },
    isEditor: props.isEditor || false,
    isPreview: props.isPreview || false,
    externalSkin: props.externalSkin || null
  };
}
```

#### 4-1. 기본 구조 확인
```typescript
import { SkinnableComponent } from '../../../types/component-skin';
import { COMPONENT_TYPES } from '../../../constants';
import use[Component]Logic from './[Component]Logic';
import Basic[Component]Skin from './skins/Basic[Component]Skin';

export const [Component]Skinnable: SkinnableComponent = {
  type: COMPONENT_TYPES.[COMPONENT],
  name: '[컴포넌트 이름]',
  category: '[카테고리]',  // 'ecommerce', 'auth', 'content' 등
  supportsExternalSkins: true,
  options: [],  // 필요시 옵션 추가
  defaultSkin: 'basic',
  internalSkins: {
    basic: Basic[Component]Skin
  },
  useLogic: use[Component]Logic,
  defaultProps: {
    // 기본 props 정의
  }
};
```

---

## 🔄 마이그레이션 가이드: 기존 컴포넌트를 스킨 시스템으로 전환

### Step 1: 백업 생성
```bash
# 컴포넌트 폴더 백업
cp -r src/components/module/[Component] src/components/module/[Component]_backup
```

### Step 2: 파일 구조 재구성
1. **skins/** 폴더 생성
2. **Basic[Component]Skin.tsx** 파일 생성
3. **[Component]Skinnable.tsx** 파일 생성
4. **index.tsx** 파일 생성
5. **types.ts** 파일 생성

### Step 3: UI 코드 이전
1. **component.tsx**의 JSX를 **Basic[Component]Skin.tsx**로 이동
2. 직접 상태 접근을 **props.data**로 변경
3. 직접 함수 호출을 **props.actions**로 변경
4. 번역 함수를 **props.utils.t**로 변경

### Step 4: Logic 수정
1. return 구조를 **data**와 **actions**로 분리
2. 모든 상태를 **data** 객체에 포함
3. 모든 핸들러를 **actions** 객체에 포함

### Step 5: 테스트 및 검증
1. 모든 기능이 정상 동작하는지 확인
2. 스타일이 올바르게 적용되는지 확인
3. TypeScript 에러가 없는지 확인

## 🚨 주의사항 및 체크포인트

### 1. 데이터 호환성 확인
- Logic.ts의 `data` 객체에 모든 필요한 상태가 포함되어 있는지
- BasicSkin에서 사용하는 모든 데이터가 props.data에 있는지
- actions 객체에 모든 핸들러가 포함되어 있는지

### 2. 타입 안정성
- TypeScript 에러가 없는지 확인
- ComponentSkinProps 인터페이스 상속 확인
- props 구조가 일관되게 사용되는지

### 3. 기능 동작 확인
- 모든 버튼 클릭이 정상 동작하는지
- 폼 제출이 정상 동작하는지
- 페이지 이동이 정상 동작하는지
- Redux 연동이 정상 동작하는지

### 4. 스타일 유지
- 기존 CSS 클래스가 그대로 적용되는지
- 반응형 디자인이 유지되는지
- 테마 적용이 정상 동작하는지

---

## 📊 완성도 측정 기준

### ✅ 완전 구현 (100%)
- Logic.ts에 actions 객체 구현
- component.tsx가 ComponentSkinWrapper 사용
- BasicSkin.tsx에 모든 UI 구현
- 모든 기능 정상 동작

### ⚠️ 부분 구현 (50-99%)
- Logic.ts에 actions 있지만 일부 누락
- component.tsx가 스킨 시스템 미사용
- BasicSkin.tsx에 UI 일부 누락

### ❌ 미구현 (0-49%)
- Logic.ts에 actions 객체 없음
- component.tsx가 직접 UI 렌더링
- BasicSkin.tsx가 기본 틀만 있음

---

## 📊 현재 구현 상태 요약

### ✅ 완전히 구현된 컴포넌트 (실제로는 적음)
- **UserProfile**: index.tsx 사용, ComponentSkinWrapper 적용, 완전한 스킨 시스템
- **MainBanner**, **ProductDetail**, **ProductSlider**: index.tsx에서 ComponentSkinWrapper 사용

### ⚠️ 부분적으로 구현된 컴포넌트 
Logic.ts에 actions는 있지만 스킨 시스템 미사용 또는 불완전:
- Board, Cart, CustomMembershipSignup, Login, MembershipSignup
- OrderHistory, ProductList, Signup, TrendingItems 등

### ❌ 미구현 컴포넌트
Logic.ts에 actions 없고 스킨 시스템 미사용:
- AssetHistory, BenefitSummary, BinaryLegs, CompanyHistory, FAQ
- FixedBgText, ImageSlider, ImageText, RecommendedUsers, UnilevelLegs

## 🎯 완전한 스킨 시스템 구현 체크리스트

### 필수 파일 체크
- [ ] **index.tsx** 파일이 있고 ComponentSkinWrapper를 사용하는가?
- [ ] **[Component]Skinnable.tsx** 파일이 있는가?
- [ ] **[Component]Logic.ts**가 data와 actions 객체를 반환하는가?
- [ ] **skins/Basic[Component]Skin.tsx**가 완전한 UI를 구현하는가?
- [ ] **[Component].types.ts**로 타입이 정의되어 있는가?

### 구현 완성도 체크
- [ ] 모든 UI가 BasicSkin으로 이전되었는가?
- [ ] 모든 상태가 props.data를 통해 접근되는가?
- [ ] 모든 액션이 props.actions를 통해 호출되는가?
- [ ] 외부 스킨 적용이 가능한가?
- [ ] TypeScript 타입이 올바르게 정의되어 있는가?

이 가이드를 따라 각 컴포넌트를 점검하고 수정하시면 됩니다.