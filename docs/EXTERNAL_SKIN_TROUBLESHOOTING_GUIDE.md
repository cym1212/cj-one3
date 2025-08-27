# 외부 스킨 문제 해결 가이드

회원가입 컴포넌트의 외부 스킨 문제를 해결한 과정을 바탕으로 작성된 가이드입니다. 다른 컴포넌트에서도 동일한 문제가 발생할 수 있습니다.

## 문제 상황

### 1. 초기 문제
- 회원가입 컴포넌트에 권한을 부여했지만 스킨 목록에 표시되지 않음
- 로그인 컴포넌트는 정상 작동하지만 회원가입 컴포넌트만 작동하지 않음

### 2. 발견된 추가 문제들
- 스킨 목록에는 표시되지만 선택해도 디자인이 변경되지 않음
- 외부 스킨에서 키보드 입력이 작동하지 않음

### 3. 상품 슬라이더 컴포넌트 문제
- 외부 스킨이 로드되지만 적용되지 않음
- 로그에서 "Found in direct mappings"로 스킨 시스템을 우회
- 외부 스킨에서 제목과 상품 정보가 표시되지 않음
- 내부 스킨도 함께 외부 스킨으로 변경되는 문제

## 해결 과정

### 단계 1: 스킨 등록 문제 해결

**문제**: `supportsExternalSkins` 속성 누락

**해결 방법**:
```typescript
// src/components/module/Signup/SignupSkinnable.tsx
registerSkinnableComponent({
  type: 'SIGNUP',
  displayName: '회원가입',
  supportsExternalSkins: true, // 이 속성 추가 필요
  // ... 기타 설정
});
```

### 단계 2: 컴포넌트 매핑 우선순위 문제

**문제**: `componentMapping.ts`에서 직접 매핑이 스킨 시스템보다 우선됨

**해결 방법**:
```typescript
// src/components/module/componentMapping.ts
// 다음 라인들을 주석 처리하여 스킨 시스템 사용 강제
// [COMPONENT_TYPES.SIGNUP]: SignupComponent,    // 주석 처리
// SIGNUP: SignupComponent,                      // 주석 처리  
// signup: SignupComponent,                      // 주석 처리
```

### 단계 3: 스킨 정보 손실 문제

**문제**: `createSignupProps` 함수에서 스킨 정보가 누락됨

**해결 방법**:
```typescript
// src/components/module/adapters/componentAdapters.ts
export function createSignupProps(component, viewMode) {
  const baseProps = createBaseComponentProps(component, viewMode);
  
  return {
    ...baseProps,
    componentProps: {
      ...baseProps.componentProps,
      // 기타 props...
      skin: baseProps.componentProps?.skin  // 스킨 정보 보존
    },
    skin: baseProps.skin  // 최상위 스킨 정보도 보존
  };
}
```

### 단계 4: 로직 인터페이스 표준화

**문제**: `useSignupLogic`이 표준 스킨 시스템 인터페이스와 맞지 않음

**해결 방법**:
```typescript
// src/components/module/Signup/SignupLogic.ts
// 변경 전: export const useSignupLogic = (props: any) => { ... }
// 변경 후:
export const useSignupLogic = (componentData: ComponentData, mode: ComponentRenderMode) => {
  // 호환성을 위한 props 변환
  const props = { ...componentData.props, ...componentData.componentProps, ...componentData };
  // ... 기존 로직
};
```

### 단계 5: 스킨 컴포넌트 인터페이스 표준화

**문제**: BasicSignupSkin이 커스텀 인터페이스 사용

**해결 방법**:
```typescript
// src/components/module/Signup/skins/BasicSignupSkin.tsx
// 변경 전: interface CustomSignupSkinProps
// 변경 후:
import { ComponentSkinProps } from '../../../../types/component-skin';

const BasicSignupSkin: React.FC<ComponentSkinProps> = ({ 
  data, 
  actions, 
  options, 
  mode,
  utils 
}) => {
  // ... 구현
};
```

### 단계 6: 에디터 모드 렌더링 우선순위 수정

**문제**: ComponentRenderer에서 SIGNUP 컴포넌트가 에디터 모드에서 스킨 시스템을 우회함

**해결 방법**:
```javascript
// src/components/ComponentRenderer.js
// ModularizedEditorComponent 사용 전에 SIGNUP 예외 처리 추가
if (typeStr === 'SIGNUP') {
  return <ModularizedComponent {...editorProps} />;
}

// 4. 에디터 컴포넌트 사용 (있으면)
if (ModularizedEditorComponent) {
  // ... 기존 로직
}
```

### 단계 7: 런타임 오류 해결

**문제**: `basicFields`와 `formData`가 undefined인 경우 발생하는 오류

**해결 방법**:
```typescript
// BasicSignupSkin.tsx에서 안전한 기본값 설정
const {
  formData = {},
  validationErrors = {},
  loading = false,
  signUpSuccess = false,
  basicFields = {
    userId: true,
    password: true,
    name: true,
    phone: true,
    email: true,
    birthday: true,
    address: true,
    referralCode: true
  },
  varFields = {}
} = data || {};
```

### 단계 8: 키보드 입력 문제 해결

**문제**: 로직 함수의 반환 구조가 ComponentSkinWrapper의 예상과 맞지 않음

**해결 방법**:
```typescript
// SignupLogic.ts에서 반환 구조 수정
// 변경 전:
return {
  data: { formData, validationErrors, ... },
  actions: { handleChange, handleSubmit, ... }
};

// 변경 후:
return {
  // 데이터를 최상위 레벨로 평탄화
  formData,
  validationErrors,
  loading,
  // ...기타 데이터
  
  // actions도 최상위 레벨로
  actions: {
    handleChange,
    handleSubmit,
    handleBlur,
    handleRadioChange,
    handleCheckboxChange
  }
};
```

## 체크리스트

다른 컴포넌트에서 외부 스킨을 활성화할 때 확인해야 할 항목들:

### 1. 스킨 등록 확인
- [ ] `{Component}Skinnable.tsx`에서 `supportsExternalSkins: true` 설정
- [ ] `registerSkinnableComponent` 호출 확인

### 2. 컴포넌트 매핑 확인
- [ ] `componentMapping.ts`에서 해당 컴포넌트 매핑 주석 처리
- [ ] 스킨 시스템이 우선되도록 설정

### 3. Props 어댑터 확인
- [ ] `componentAdapters.ts`에서 스킨 정보 보존 확인
- [ ] `baseProps.skin`과 `baseProps.componentProps?.skin` 전달

### 4. 로직 함수 인터페이스 확인
- [ ] `(componentData: ComponentData, mode: ComponentRenderMode)` 시그니처 사용
- [ ] 호환성을 위한 props 변환 로직 추가

### 5. 스킨 컴포넌트 인터페이스 확인
- [ ] `ComponentSkinProps` 인터페이스 사용
- [ ] `data`, `actions`, `options`, `mode`, `utils` props 구조

### 6. 렌더링 우선순위 확인
- [ ] `ComponentRenderer.js`에서 해당 컴포넌트의 스킨 시스템 우선 설정

### 7. 안전성 확인
- [ ] 모든 props에 기본값 설정
- [ ] undefined/null 체크 추가

### 8. 데이터 흐름 확인
- [ ] 로직 함수 반환 구조가 ComponentSkinWrapper와 호환되는지 확인
- [ ] actions가 최상위 레벨에서 반환되는지 확인

### 9. 조건부 스킨 시스템 사용 (ProductSlider의 경우)
- [ ] 외부 스킨인 경우에만 스킨 시스템 사용하도록 래퍼 구현
- [ ] `isExternalSkin` 함수로 외부 스킨 여부 확인
- [ ] 기본 스킨은 원래 컴포넌트 직접 사용

### 10. 데이터 구조 문서화
- [ ] 실제 사용하는 필드명을 정확히 문서화
- [ ] 외부 스킨 개발자가 참조할 수 있도록 가이드 업데이트

### 11. Props 구조 확인 (Board 컴포넌트의 경우)
- [ ] `componentData`가 undefined인 경우 처리
- [ ] 스킨 ID가 `props.skin`에 직접 있는 경우 처리
- [ ] Preview 모드와 Editor 모드의 props 구조 차이 처리

## 공통 에러 패턴

### 1. "Cannot read properties of undefined"
**원인**: 기본값이 설정되지 않은 props
**해결**: 모든 destructuring에 기본값 추가

### 2. 스킨 목록에 표시되지 않음
**원인**: `supportsExternalSkins: true` 누락
**해결**: Skinnable 컴포넌트에 속성 추가

### 3. 스킨 선택해도 변경되지 않음
**원인**: componentMapping 우선순위 문제 또는 props 어댑터 문제
**해결**: 매핑 제거 및 스킨 정보 보존

### 4. 키보드 입력이 작동하지 않음
**원인**: actions가 제대로 전달되지 않음
**해결**: 로직 함수 반환 구조 수정

### 5. "Found in direct mappings" 로그와 함께 스킨이 적용되지 않음
**원인**: `componentMapping.ts`에 컴포넌트가 직접 매핑되어 있어 스킨 시스템을 우회
**해결**: 
```typescript
// src/components/module/componentMapping.ts
// PRODUCT_SLIDER 예시
// [COMPONENT_TYPES.PRODUCT_SLIDER]: ProductSliderComponent, // 주석 처리
// 'PRODUCT_SLIDER': ProductSliderComponent,                 // 주석 처리
```

### 6. 외부 스킨에서 제목과 상품 정보가 표시되지 않음
**원인**: 외부 스킨이 기대하는 데이터 구조와 실제 전달되는 데이터 구조가 다름
**해결**: 스킨 개발 가이드를 실제 사용하는 데이터 구조로 업데이트
```typescript
// 잘못된 예시 (외부 스킨이 사용하려던 구조)
const name = product.title || product.name;
const stock = product.config?.stock_count ?? product.stock_count;

// 올바른 예시 (실제 데이터 구조)
const name = product.name;  // name 필드만 사용
const stock = product.stock;  // stock 필드 사용
```

### 7. 내부 스킨도 외부 스킨으로 변경되는 문제
**원인**: 모든 컴포넌트가 스킨 시스템을 사용하도록 변경하면 기본 스킨도 스킨 시스템을 통해 렌더링됨
**해결**: 외부 스킨 선택 시에만 스킨 시스템을 사용하도록 조건부 렌더링 구현

```typescript
// src/components/module/ProductSlider/index.tsx
const ProductSliderWrapper: React.FC<any> = (props) => {
  const selectedSkin = props.skin || props.componentProps?.skin || 'basic';
  
  if (isExternalSkin(selectedSkin)) {
    // 외부 스킨인 경우에만 스킨 시스템 사용
    return <ComponentSkinWrapper 
      component={ProductSliderSkinnable}
      componentData={props}
      skinId={selectedSkin}
      mode={props.isPreview ? 'editor' : 'preview'}
      editorProps={props}
    />;
  }
  
  // 기본 스킨인 경우 원래 컴포넌트 사용
  return <ProductSliderComponent {...props} />;
};
```

### 8. Board 컴포넌트에서 외부 스킨이 로드되지 않는 문제
**원인**: `componentData`가 undefined이고 스킨 ID가 `props.skin`에 직접 전달되는 경우
**해결**: props 구조를 확인하고 여러 경로에서 스킨 ID를 체크하도록 수정

```typescript
// src/components/module/Board/index.tsx
// hasSkin 확인 로직 수정
const hasSkin = props.componentData?.props?.skin || props.skin;

// src/components/module/Board/BoardComponentNew.tsx
// componentData가 없을 때 props를 fallback으로 사용
const skinId = componentData?.props?.skin || skin || 'basic';
const finalComponentData = componentData || props;

// ComponentSkinWrapper에 전달
<ComponentSkinWrapper
  component={BoardSkinnable}
  componentData={finalComponentData}
  skinId={skinId}
  mode={mode}
  {...props}
  {...adaptedProps}
/>
```

## 외부 스킨 메뉴/라우팅 연동 문제 해결

### 메뉴 연동 관련 문제

#### 1. 메뉴가 표시되지 않음

**증상**: 웹빌더에서 설정한 메뉴가 외부 스킨에서 보이지 않음

**원인 및 해결**:
```typescript
// ❌ 잘못된 방법
const BadMenuAccess = ({ data }) => {
  const menus = data.menus; // undefined일 수 있음
  
  return (
    <nav>
      {menus.map(menu => <a href={menu.url}>{menu.name}</a>)}
    </nav>
  );
};

// ✅ 올바른 방법
const GoodMenuAccess = ({ data }) => {
  const { menus, globalMenus, mainMenus } = data;
  
  // 우선순위에 따른 메뉴 데이터 선택
  const menusToUse = menus?.length > 0 ? menus : [...(globalMenus || []), ...(mainMenus || [])];
  
  return (
    <nav>
      {menusToUse.map(menu => (
        <a key={menu.id} href={menu.url}>{menu.name}</a>
      ))}
    </nav>
  );
};
```

#### 2. 메뉴 필터링이 작동하지 않음

**증상**: 로그인 상태와 관계없이 모든 메뉴가 표시됨

**해결**:
```typescript
const FilteredMenus = ({ data }) => {
  const { menus, isUserLoggedIn, isAdminLoggedIn, isBusiness } = data;
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  const filteredMenus = menus.filter(menu => {
    // 표시 여부 체크
    if (!menu.visible) return false;
    
    // 로그인 상태별 필터링
    if (menu.is_logged && !isLoggedIn) return false;
    if (menu.is_not_logged && isLoggedIn) return false;
    
    // 사업자 전용 메뉴 필터링
    if (menu.is_business_only && (!isLoggedIn || !isBusiness)) return false;
    
    return true;
  });
  
  return (
    <nav>
      {filteredMenus.map(menu => (
        <a key={menu.id} href={menu.url}>{menu.name}</a>
      ))}
    </nav>
  );
};
```

#### 3. 계층형 메뉴(2차/3차)가 렌더링되지 않음

**증상**: 1차 메뉴만 보이고 하위 메뉴가 표시되지 않음

**해결**:
```typescript
const HierarchicalMenuFix = ({ menu, level = 1 }) => {
  const hasChildren = menu.children && menu.children.length > 0;
  
  return (
    <li className={`nav-item level-${level}`}>
      <a href={menu.url}>{menu.name}</a>
      
      {/* 🎯 하위 메뉴 재귀 렌더링 */}
      {hasChildren && (
        <ul className={`submenu level-${level + 1}`}>
          {menu.children.map(childMenu => (
            <HierarchicalMenuFix 
              key={childMenu.id} 
              menu={childMenu} 
              level={level + 1} 
            />
          ))}
        </ul>
      )}
    </li>
  );
};
```

#### 4. 메뉴 타입(GLOBAL/MAIN) 구분이 안됨

**증상**: 헤더에 모든 메뉴가 표시되거나 원하지 않는 메뉴가 표시됨

**해결**:
```typescript
const TypeBasedMenus = ({ data }) => {
  const allMenus = data.menus || [];
  
  // 타입별 메뉴 분리
  const mainMenus = allMenus.filter(menu => menu.type === 'MAIN');
  const globalMenus = allMenus.filter(menu => menu.type === 'GLOBAL');
  
  return (
    <header>
      {/* 상단 유틸리티 메뉴 (GLOBAL) */}
      <div className="utility-nav">
        {globalMenus.map(menu => (
          <a key={menu.id} href={menu.url}>{menu.name}</a>
        ))}
      </div>
      
      {/* 메인 네비게이션 (MAIN) */}
      <nav className="main-nav">
        {mainMenus.map(menu => (
          <a key={menu.id} href={menu.url}>{menu.name}</a>
        ))}
      </nav>
    </header>
  );
};
```

### 라우팅 연동 관련 문제

#### 1. utils.navigate가 작동하지 않음

**증상**: 메뉴 클릭 시 페이지 이동이 되지 않거나 새로고침됨

**해결**:
```typescript
const NavigationFix = ({ utils }) => {
  const handleMenuClick = (menu, e) => {
    e.preventDefault(); // 🎯 기본 링크 동작 방지
    
    // 외부 링크 처리
    if (menu.url.startsWith('http')) {
      window.open(menu.url, '_blank');
      return;
    }
    
    // 내부 페이지 이동
    utils.navigate(menu.url);
  };
  
  return (
    <a 
      href={menu.url}
      onClick={(e) => handleMenuClick(menu, e)} // 🎯 이벤트 핸들러 필수
    >
      {menu.name}
    </a>
  );
};
```

#### 2. 현재 페이지 활성화 표시가 안됨

**증상**: 현재 페이지의 메뉴에 활성화 스타일이 적용되지 않음

**해결**:
```typescript
const ActiveMenuFix = ({ menu, utils }) => {
  const isActive = (menuUrl) => {
    const currentPath = utils.location.pathname;
    
    // 정확한 매칭
    if (menuUrl === currentPath) return true;
    
    // 동적 라우트 매칭 (/product/:id)
    if (menuUrl.includes(':')) {
      const pattern = menuUrl.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(currentPath);
    }
    
    // 하위 경로 매칭
    if (menuUrl !== '/' && currentPath.startsWith(menuUrl + '/')) {
      return true;
    }
    
    return false;
  };
  
  return (
    <a 
      href={menu.url}
      className={isActive(menu.url) ? 'active' : ''} // 🎯 활성화 클래스
    >
      {menu.name}
    </a>
  );
};
```

#### 3. 쿼리 파라미터가 처리되지 않음

**증상**: URL의 ?search=keyword 같은 쿼리 파라미터를 읽거나 설정할 수 없음

**해결**:
```typescript
const QueryParamsFix = ({ utils }) => {
  // 쿼리 파라미터 읽기
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(utils.location.search);
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };
  
  // 쿼리 파라미터 설정
  const setQueryParam = (key, value) => {
    const searchParams = new URLSearchParams(utils.location.search);
    
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    
    const newUrl = `${utils.location.pathname}?${searchParams.toString()}`;
    utils.navigate(newUrl, { replace: true });
  };
  
  return { getQueryParams, setQueryParam };
};
```

#### 4. 해시 앵커 링크가 작동하지 않음

**증상**: #section 형태의 앵커 링크 클릭 시 스크롤이 되지 않음

**해결**:
```typescript
const AnchorLinkFix = ({ utils }) => {
  const handleAnchorClick = (anchorId, e) => {
    e.preventDefault();
    
    // 해당 엘리먼트로 스크롤
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // URL 해시 업데이트
    const newUrl = `${utils.location.pathname}${utils.location.search}#${anchorId}`;
    utils.navigate(newUrl, { replace: true });
  };
  
  return (
    <a 
      href={`#${anchorId}`}
      onClick={(e) => handleAnchorClick(anchorId, e)}
    >
      섹션으로 이동
    </a>
  );
};
```

### 성능 관련 문제

#### 1. 메뉴 렌더링이 느림

**증상**: 메뉴가 많을 때 페이지 로딩이 느려짐

**해결**:
```typescript
const OptimizedMenus = ({ data }) => {
  // 메뉴 필터링을 useMemo로 최적화
  const filteredMenus = useMemo(() => {
    return data.menus?.filter(menu => {
      if (!menu.visible) return false;
      // 기타 필터링 로직...
      return true;
    }).sort((a, b) => a.order - b.order);
  }, [data.menus, data.isUserLoggedIn, data.isBusiness]);
  
  return (
    <nav>
      {filteredMenus.map(menu => (
        <MenuItem key={menu.id} menu={menu} />
      ))}
    </nav>
  );
};
```

#### 2. 메뉴 상태 변경이 전체 리렌더링을 유발

**증상**: 메뉴 호버나 클릭 시 전체 스킨이 다시 렌더링됨

**해결**:
```typescript
const OptimizedMenuItem = React.memo(({ menu, isActive, onMenuClick }) => {
  return (
    <a 
      href={menu.url}
      className={isActive ? 'active' : ''}
      onClick={(e) => onMenuClick(menu, e)}
    >
      {menu.name}
    </a>
  );
});
```

### 체크리스트

외부 스킨에서 메뉴/라우팅 문제 발생 시 확인사항:

#### 메뉴 표시 문제
- [ ] `data.menus`, `data.globalMenus`, `data.mainMenus` 중 어느 것이 데이터를 가지고 있는지 확인
- [ ] 메뉴 필터링 로직 (`visible`, `is_logged`, `is_not_logged`, `is_business_only`) 구현 확인
- [ ] 메뉴 정렬 (`order` 속성 기반) 구현 확인

#### 계층형 메뉴 문제  
- [ ] `menu.children` 존재 여부 확인
- [ ] 재귀적 렌더링 구현 확인
- [ ] CSS 스타일링 (hover, position 등) 확인

#### 라우팅 문제
- [ ] `e.preventDefault()` 호출 확인
- [ ] `utils.navigate()` 함수 사용 확인
- [ ] 외부 링크와 내부 링크 구분 처리 확인

#### 활성화 표시 문제
- [ ] `utils.location.pathname` 접근 확인
- [ ] 동적 라우트 매칭 로직 구현 확인
- [ ] CSS 활성화 클래스 적용 확인

#### 쿼리 파라미터 문제
- [ ] `URLSearchParams` 사용법 확인
- [ ] `utils.navigate()` 시 replace 옵션 설정 확인

#### 성능 문제
- [ ] `useMemo`, `useCallback` 사용으로 최적화 확인
- [ ] `React.memo` 사용으로 불필요한 리렌더링 방지 확인

## 참고 자료

- [COMPONENT_SKIN_GUIDE.md](./COMPONENT_SKIN_GUIDE.md)
- [EXTERNAL_SKIN_GUIDE.md](./EXTERNAL_SKIN_GUIDE.md)
- [EXTERNAL_SKIN_QUICK_START.md](./EXTERNAL_SKIN_QUICK_START.md)
- [skin-system/development/component-migration.md](./skin-system/development/component-migration.md)