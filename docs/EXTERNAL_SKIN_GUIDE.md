# 🎨 Withcookie 외부 스킨 제작 가이드

이 가이드는 React를 처음 접하는 개발자도 쉽게 외부 스킨을 만들고 등록할 수 있도록 작성되었습니다.

## 📋 목차
1. [준비물](#준비물)
2. [스킨이란?](#스킨이란)
3. [Step 1: 개발 환경 설정](#step-1-개발-환경-설정)
4. [Step 2: 스킨 프로젝트 생성](#step-2-스킨-프로젝트-생성)
5. [Step 3: 스킨 개발하기](#step-3-스킨-개발하기)
6. [Step 4: 스킨 빌드하기](#step-4-스킨-빌드하기)
7. [Step 5: 스킨 배포하기](#step-5-스킨-배포하기)
8. [Step 6: 스킨 등록하기](#step-6-스킨-등록하기)
9. [문제 해결](#문제-해결)
10. [참고 자료](#참고-자료)

---

## 준비물

### 필수 프로그램 설치
1. **Node.js** (버전 14 이상)
   - 다운로드: https://nodejs.org/
   - LTS 버전 권장
   - 설치 확인: 터미널에서 `node --version`

2. **코드 에디터**
   - Visual Studio Code 추천: https://code.visualstudio.com/
   - 다른 에디터도 가능 (Sublime Text, Atom 등)

3. **Git** (선택사항)
   - 버전 관리용
   - 다운로드: https://git-scm.com/

---

## 스킨이란?

스킨은 웹사이트의 **겉모습(디자인)**을 담당하는 템플릿입니다.
- 헤더 (상단 메뉴)
- 푸터 (하단 정보)
- 사이드바 (선택사항)
- 전체적인 색상과 스타일

**UMD**는 Universal Module Definition의 약자로, 어디서든 사용할 수 있는 JavaScript 모듈 형식입니다.

### 🚨 매우 중요: 전역 변수명 규칙

외부 스킨이 웹빌더에서 정상 작동하려면 **반드시** 다음 규칙을 따라야 합니다:

1. **전역 변수명 형식**: `WithCookieSkin_[스킨ID]_[버전]`
   - 스킨 ID: 어드민에서 스킨 등록 시 자동 부여 (예: 25)
   - 버전: 점(.)을 언더스코어(_)로 변경 (예: 1.0.6 → 1_0_6)
   - **완성 예시**: `WithCookieSkin_25_1_0_6`

2. **세 곳 모두 동일해야 함**:
   - webpack.config.js의 `library`
   - src/index.tsx의 `window.WithCookieSkin_*`
   - 등록 시 `globalName`

⚠️ 이 규칙을 지키지 않으면 "No suitable global variable found" 에러가 발생합니다!

---

## Step 1: 개발 환경 설정

### 1.1 터미널 열기
- **Windows**: 시작 메뉴 → "cmd" 또는 "PowerShell" 검색
- **Mac**: Spotlight(⌘+Space) → "Terminal" 검색

### 1.2 작업 폴더 만들기
```bash
# 바탕화면에 작업 폴더 만들기
cd Desktop
mkdir my-skins
cd my-skins
```

### 1.3 템플릿 다운로드
```bash
# Git이 있는 경우
git clone https://github.com/your-repo/external-skin-template.git my-first-skin

# Git이 없는 경우: 수동으로 다운로드
# 1. external-skin-template 폴더를 ZIP으로 다운로드
# 2. my-skins 폴더에 압축 해제
# 3. 폴더명을 'my-first-skin'으로 변경
```

---

## Step 2: 스킨 프로젝트 생성

### 2.1 프로젝트 폴더로 이동
```bash
cd my-first-skin
```

### 2.2 필요한 패키지 설치
```bash
npm install
```
⏱️ 약 2-5분 소요됩니다. 커피 한 잔 하고 오세요!

### 2.3 개발 서버 실행
```bash
npm run dev
```
✅ 브라우저가 자동으로 열리고 http://localhost:3001 에서 스킨을 볼 수 있습니다.

---

## Step 3: 스킨 개발하기

### 3.1 기본 구조 이해하기

```
my-first-skin/
├── src/
│   ├── index.tsx          # 🎯 메인 스킨 파일 (가장 중요!)
│   ├── components/        # 📦 부품들 (헤더, 푸터 등)
│   │   ├── Header.tsx     # 상단 메뉴
│   │   ├── Footer.tsx     # 하단 정보
│   │   └── Sidebar.tsx    # 옆 메뉴
│   └── styles/
│       └── main.scss      # 🎨 디자인 파일
└── package.json           # 📋 프로젝트 설정
```

### ⚠️ 3.2 중요: Props 인터페이스 이해하기

외부 스킨은 메인 프로젝트와 **정해진 규칙(인터페이스)**으로 소통합니다.

#### ❌ 잘못된 방법 (독립적인 인터페이스)
```typescript
// 이렇게 하면 안 됩니다!
interface MyCustomProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const MySkin = ({ children, showSidebar }) => { ... }
```

#### ✅ 올바른 방법 (ExternalSkinProps 사용)
```typescript
import { ExternalSkinProps } from './types/skin-props';

const MySkin: React.FC<ExternalSkinProps> = ({
  data,      // 사용자, 메뉴, 회사 정보 등
  actions,   // 로그인, 로그아웃 등의 함수
  utils,     // 네비게이션, 번역 등의 유틸리티
  layout,    // ⭐ children이 여기 안에 있습니다!
  theme      // 색상 설정
}) => {
  // layout 객체에서 필요한 것들 꺼내기
  const { children, showSidebar, showHeader, showFooter } = layout;
  
  return (
    <div>
      {showHeader && <Header />}
      {children}  {/* ❌ 아님 */}
      {layout.children}  {/* ✅ 맞음 */}
      {showFooter && <Footer />}
    </div>
  );
};
```

💡 **핵심**: 템플릿에 이미 올바른 구조가 있으니 수정하지 마세요!

### 3.3 스킨 이름 변경하기

#### 1) package.json 수정
```json
{
  "name": "my-awesome-skin",  // ← 여기를 원하는 이름으로
  "version": "1.0.0",
  ...
}
```

#### 2) webpack.config.js 수정
```javascript
output: {
  filename: 'my-awesome-skin.umd.js',  // ← 파일명 변경
  library: 'MyAwesomeSkin',            // ← 전역 변수명 (띄어쓰기 없이!)
  ...
}
```

#### 3) src/index.tsx 수정
```typescript
// 맨 아래쪽에서 찾기
if (typeof window !== 'undefined') {
  window.WithCookieSkin_[스킨ID]_[버전] = MyCustomSkin;  // ← webpack.config.js의 library와 동일하게
  // 예시: window.WithCookieSkin_25_1_0_6 = MyCustomSkin;
}
```

### 3.4 색상 변경하기

`src/styles/main.scss` 파일을 열어서:

```scss
:root {
  // 주요 색상들
  --primary-color: #007bff;    // 메인 색상 (파란색)
  --secondary-color: #6c757d;  // 보조 색상 (회색)
  --danger-color: #dc3545;     // 경고 색상 (빨간색)
  --success-color: #28a745;    // 성공 색상 (초록색)
  
  // 원하는 색상으로 변경하세요!
  // 예: --primary-color: #ff6b6b;  // 분홍색
}
```

💡 **색상 선택 도구**: https://colorhunt.co/

### 3.5 로고 변경하기

`src/components/Header.tsx` 파일에서:

```typescript
<img src="/logo.png" alt="Logo" className="header-logo" />
// ↓ 변경
<img src="https://내사이트.com/my-logo.png" alt="My Logo" className="header-logo" />
```

### 3.6 메뉴 스타일 변경하기

`src/styles/main.scss`에서 헤더 스타일 수정:

```scss
.custom-skin-header {
  background: white;           // 배경색
  height: 80px;               // 높이
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);  // 그림자
}
```

### 📍 3.7 컨텐츠 영역 지정하기 (필수!)

스킨에서 **가장 중요한 부분**은 페이지 컨텐츠가 들어갈 위치를 지정하는 것입니다.

`src/index.tsx` 파일에서:

```typescript
return (
  <div className="custom-skin-container">
    <Header />
    
    <main className="custom-skin-content">
      {layout.children}  {/* 🎯 여기에 페이지 내용이 들어갑니다! */}
    </main>
    
    <Footer />
  </div>
);
```

⚠️ **절대 주의사항**:
- ❌ `{children}` - 직접 props에서 받지 마세요
- ✅ `{layout.children}` - layout 객체에서 가져오세요

만약 `{layout.children}`을 빠뜨리면:
- 페이지 내용이 표시되지 않습니다
- 빈 스킨만 보입니다

#### 시각적 구조:
```
┌─────────────────────────────────┐
│         Header                  │
├─────────┬───────────────────────┤
│ Sidebar │ {layout.children}     │ ← 페이지 내용이 여기 표시됨!
│(선택)   │                       │
│         │                       │
└─────────┴───────────────────────┘
│         Footer                  │
└─────────────────────────────────┘
```

### 🔗 3.8 웹빌더 메뉴와 라우팅 연동하기 (필수!)

외부 스킨이 **flone처럼 웹빌더에서 설정한 메뉴들과 라우팅을 완전히 연동**하려면 다음과 같이 구현해야 합니다.

#### 3.8.1 메뉴 데이터 구조 이해하기

웹빌더에서 설정한 메뉴는 props를 통해 다음과 같은 구조로 전달됩니다:

```typescript
// 메뉴 객체 구조
interface Menu {
  id: string;
  name: string;           // 표시될 메뉴명
  url: string;            // 이동할 경로
  order: number;          // 정렬 순서
  visible: boolean;       // 표시 여부
  is_logged: boolean;     // 로그인 필요 메뉴
  is_not_logged: boolean; // 비로그인 전용 메뉴
  is_business_only: boolean; // 사업자 전용 메뉴
  type: 'GLOBAL' | 'MAIN'; // 메뉴 타입
  children?: Menu[];      // 하위 메뉴 (2차 메뉴)
  menuAction?: string;    // 특수 액션 ('logout', 'login' 등)
}
```

#### 3.8.2 완전한 메뉴 네비게이션 구현

```typescript
import { ExternalSkinProps } from './types/skin-props';

const NavigationMenu = ({ data, utils }: ExternalSkinProps) => {
  const { 
    menus,           // 전체 메뉴 배열
    globalMenus,     // 글로벌 메뉴
    mainMenus,       // 메인 메뉴
    isUserLoggedIn, 
    isAdminLoggedIn,
    isBusiness 
  } = data;
  
  const { navigate, location } = utils;
  
  // 로그인 상태 통합
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  // 메뉴 클릭 핸들러
  const handleMenuClick = (menu: Menu, e: React.MouseEvent) => {
    e.preventDefault();
    
    // 특수 액션 처리
    if (menu.menuAction) {
      switch (menu.menuAction) {
        case 'logout':
          data.actions?.onLogout?.();
          return;
        case 'login':
          navigate('/login');
          return;
        default:
          console.log('Unknown menu action:', menu.menuAction);
      }
    }
    
    // 외부 링크 처리
    if (menu.url.startsWith('http://') || menu.url.startsWith('https://')) {
      window.open(menu.url, '_blank');
      return;
    }
    
    // 내부 페이지 이동
    navigate(menu.url);
  };
  
  // 메뉴 필터링 로직 (flone과 동일)
  const getFilteredMenus = (menuList: Menu[]) => {
    return menuList
      .filter(menu => {
        // 표시 여부 체크
        if (!menu.visible) return false;
        
        // 로그인 상태별 필터링
        if (menu.is_logged && !isLoggedIn) return false;
        if (menu.is_not_logged && isLoggedIn) return false;
        
        // 사업자 전용 메뉴 필터링
        if (menu.is_business_only && (!isLoggedIn || !isBusiness)) return false;
        
        return true;
      })
      .sort((a, b) => a.order - b.order); // 순서대로 정렬
  };
  
  // 현재 페이지 활성화 체크
  const isActiveMenu = (menu: Menu) => {
    const currentPath = location.pathname;
    
    // 정확히 일치하는 경우
    if (menu.url === currentPath) return true;
    
    // 동적 라우트 매칭 (예: /product/:id)
    if (menu.url.includes(':')) {
      const pattern = menu.url.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(currentPath);
    }
    
    // 하위 경로 매칭 (예: /shop 메뉴가 /shop/products에서도 활성화)
    if (currentPath.startsWith(menu.url + '/')) return true;
    
    return false;
  };
  
  // 메뉴 렌더링 함수
  const renderMenu = (menu: Menu) => (
    <li key={menu.id} className={`nav-item ${isActiveMenu(menu) ? 'active' : ''}`}>
      <a
        href={menu.url}
        className="nav-link"
        onClick={(e) => handleMenuClick(menu, e)}
      >
        {menu.name}
      </a>
      
      {/* 2차 메뉴 (서브메뉴) 처리 */}
      {menu.children && menu.children.length > 0 && (
        <ul className="sub-menu">
          {getFilteredMenus(menu.children).map(subMenu => renderMenu(subMenu))}
        </ul>
      )}
    </li>
  );
  
  // 사용할 메뉴 데이터 결정 (우선순위: menus > globalMenus + mainMenus)
  const menusToUse = menus?.length > 0 ? menus : [...(globalMenus || []), ...(mainMenus || [])];
  const filteredMenus = getFilteredMenus(menusToUse);
  
  return (
    <nav className="main-navigation">
      <ul className="nav-menu">
        {filteredMenus.map(menu => renderMenu(menu))}
      </ul>
    </nav>
  );
};
```

#### 3.8.3 스킨에서 메뉴 네비게이션 사용하기

```typescript
const MySkin: React.FC<ExternalSkinProps> = (props) => {
  const { layout } = props;
  
  return (
    <div className="custom-skin-container">
      <header className="custom-skin-header">
        <div className="container">
          <div className="logo">
            {/* 로고 영역 */}
          </div>
          
          {/* 🎯 웹빌더 연동 메뉴 */}
          <NavigationMenu {...props} />
          
          <div className="header-actions">
            {/* 로그인/카트 등 액션 버튼 */}
          </div>
        </div>
      </header>
      
      <main className="custom-skin-content">
        {layout.children}
      </main>
      
      <footer className="custom-skin-footer">
        {/* 푸터 내용 */}
      </footer>
    </div>
  );
};
```

#### 3.8.4 고급 기능들

**현재 페이지 브레드크럼 표시:**
```typescript
const Breadcrumb = ({ data, utils }: ExternalSkinProps) => {
  const { layout } = data;
  const breadcrumbs = layout.breadcrumbs || [];
  
  return (
    <nav className="breadcrumb">
      {breadcrumbs.map((crumb, index) => (
        <span key={index}>
          {index > 0 && <span className="separator"> / </span>}
          {crumb.url ? (
            <a onClick={() => utils.navigate(crumb.url)}>{crumb.name}</a>
          ) : (
            <span>{crumb.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
};
```

**동적 페이지 제목 설정:**
```typescript
useEffect(() => {
  if (layout.pageTitle) {
    document.title = layout.pageTitle;
  }
}, [layout.pageTitle]);
```

**URL 파라미터 활용:**
```typescript
// utils.params를 통해 URL 파라미터 접근
const ProductDetail = ({ utils }: ExternalSkinProps) => {
  const productId = utils.params.id; // /product/:id에서 id 값
  
  return <div>상품 ID: {productId}</div>;
};
```

#### 💡 **핵심 포인트**

1. **메뉴 우선순위**: `menus` → `globalMenus + mainMenus` 순으로 사용
2. **필터링 로직**: 로그인 상태, 사업자 여부, 표시 설정에 따라 메뉴 필터링
3. **라우팅 연동**: `utils.navigate()` 함수로 페이지 이동
4. **현재 페이지 표시**: `utils.location.pathname`으로 활성 메뉴 표시
5. **특수 액션**: `menuAction`으로 로그인/로그아웃 등 특수 기능 처리

### 🏗️ 3.9 계층형 메뉴 (다중 레벨) 완전 구현

웹빌더에서 설정한 **2차, 3차 메뉴까지 완벽하게 지원**하는 고급 구현 방법입니다.

#### 3.9.1 다중 레벨 메뉴 데이터 구조

```typescript
interface HierarchicalMenu {
  id: string;
  name: string;
  url: string;
  order: number;
  visible: boolean;
  level: number;          // 메뉴 레벨 (1, 2, 3...)
  parentId?: string;      // 부모 메뉴 ID
  children?: HierarchicalMenu[];  // 하위 메뉴들
  
  // flone과 동일한 필터링 속성들
  is_logged: boolean;
  is_not_logged: boolean;
  is_business_only: boolean;
  type: 'GLOBAL' | 'MAIN';
  menuAction?: string;
}
```

#### 3.9.2 완전한 계층형 메뉴 컴포넌트

```typescript
const HierarchicalNavigation = ({ data, utils, actions }: ExternalSkinProps) => {
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const { menus, globalMenus, mainMenus, isUserLoggedIn, isAdminLoggedIn, isBusiness } = data;
  const { navigate, location } = utils;
  
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  // 메뉴 트리 구조 생성
  const buildMenuTree = (menuList: HierarchicalMenu[]) => {
    const filtered = menuList.filter(menu => {
      if (!menu.visible) return false;
      if (menu.is_logged && !isLoggedIn) return false;
      if (menu.is_not_logged && isLoggedIn) return false;
      if (menu.is_business_only && (!isLoggedIn || !isBusiness)) return false;
      return true;
    });
    
    // 1차 메뉴들 (부모가 없는 메뉴)
    const rootMenus = filtered.filter(menu => !menu.parentId);
    
    // 각 1차 메뉴에 하위 메뉴들 연결
    const buildChildren = (parentMenu: HierarchicalMenu): HierarchicalMenu => {
      const children = filtered
        .filter(menu => menu.parentId === parentMenu.id)
        .sort((a, b) => a.order - b.order)
        .map(child => buildChildren(child)); // 재귀적으로 하위 메뉴 구성
      
      return {
        ...parentMenu,
        children: children.length > 0 ? children : undefined
      };
    };
    
    return rootMenus
      .sort((a, b) => a.order - b.order)
      .map(menu => buildChildren(menu));
  };
  
  // 서브메뉴 토글 처리
  const toggleSubmenu = (menuId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newOpenSubmenus = new Set(openSubmenus);
    if (newOpenSubmenus.has(menuId)) {
      newOpenSubmenus.delete(menuId);
    } else {
      newOpenSubmenus.add(menuId);
    }
    setOpenSubmenus(newOpenSubmenus);
  };
  
  // 현재 페이지 활성화 체크 (상위 메뉴도 포함)
  const isActiveMenuPath = (menu: HierarchicalMenu): boolean => {
    const currentPath = location.pathname;
    
    // 자신이 활성화된 경우
    if (menu.url === currentPath) return true;
    
    // 동적 라우트 매칭
    if (menu.url.includes(':')) {
      const pattern = menu.url.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(currentPath)) return true;
    }
    
    // 하위 경로 매칭
    if (menu.url !== '/' && currentPath.startsWith(menu.url + '/')) return true;
    
    // 하위 메뉴 중 활성화된 것이 있는지 체크
    if (menu.children) {
      return menu.children.some(child => isActiveMenuPath(child));
    }
    
    return false;
  };
  
  // 메뉴 클릭 핸들러
  const handleMenuClick = (menu: HierarchicalMenu, e: React.MouseEvent) => {
    // 하위 메뉴가 있으면 토글만 하고 이동하지 않음
    if (menu.children && menu.children.length > 0) {
      toggleSubmenu(menu.id, e);
      return;
    }
    
    e.preventDefault();
    
    // 특수 액션 처리
    if (menu.menuAction) {
      switch (menu.menuAction) {
        case 'logout':
          actions?.onLogout?.();
          return;
        case 'login':
          navigate('/login');
          return;
        default:
          console.log('Unknown menu action:', menu.menuAction);
      }
    }
    
    // 외부 링크
    if (menu.url.startsWith('http://') || menu.url.startsWith('https://')) {
      window.open(menu.url, '_blank');
      return;
    }
    
    // 내부 페이지 이동
    navigate(menu.url);
  };
  
  // 다중 레벨 메뉴 렌더링 (재귀)
  const renderMenuItem = (menu: HierarchicalMenu, level: number = 1): React.ReactNode => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isOpen = openSubmenus.has(menu.id);
    const isActive = isActiveMenuPath(menu);
    
    return (
      <li 
        key={menu.id} 
        className={`
          nav-item 
          level-${level}
          ${isActive ? 'active' : ''} 
          ${hasChildren ? 'has-children' : ''}
          ${isOpen ? 'open' : ''}
        `}
      >
        <a
          href={menu.url}
          className="nav-link"
          onClick={(e) => handleMenuClick(menu, e)}
          data-level={level}
        >
          <span className="menu-text">{menu.name}</span>
          {hasChildren && (
            <span className={`submenu-arrow ${isOpen ? 'open' : ''}`}>
              <i className="arrow-icon" />
            </span>
          )}
        </a>
        
        {/* 하위 메뉴 렌더링 */}
        {hasChildren && (
          <ul className={`submenu level-${level + 1} ${isOpen ? 'open' : ''}`}>
            {menu.children!.map(childMenu => renderMenuItem(childMenu, level + 1))}
          </ul>
        )}
      </li>
    );
  };
  
  // 메뉴 데이터 가져오기 및 트리 구성
  const allMenus = menus?.length > 0 ? menus : [...(globalMenus || []), ...(mainMenus || [])];
  const menuTree = buildMenuTree(allMenus);
  
  return (
    <nav className="hierarchical-navigation">
      <ul className="nav-menu level-1">
        {menuTree.map(menu => renderMenuItem(menu, 1))}
      </ul>
    </nav>
  );
};
```

#### 3.9.3 계층형 메뉴 스타일링

```scss
.hierarchical-navigation {
  .nav-menu {
    list-style: none;
    margin: 0;
    padding: 0;
    
    // 1차 메뉴
    &.level-1 {
      display: flex;
      
      > .nav-item {
        position: relative;
        
        > .nav-link {
          display: flex;
          align-items: center;
          padding: 15px 20px;
          text-decoration: none;
          color: #333;
          transition: all 0.3s ease;
          
          &:hover {
            background: #f8f9fa;
            color: var(--primary-color);
          }
        }
        
        &.active > .nav-link {
          color: var(--primary-color);
          background: #f8f9fa;
        }
        
        // 하위 메뉴가 있는 경우
        &.has-children {
          .submenu-arrow {
            margin-left: 8px;
            transition: transform 0.3s ease;
            
            &.open {
              transform: rotate(180deg);
            }
          }
          
          // 호버 시 서브메뉴 표시
          &:hover .submenu.level-2 {
            display: block;
          }
        }
      }
    }
  }
  
  // 서브메뉴 공통 스타일
  .submenu {
    display: none;
    position: absolute;
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    min-width: 200px;
    z-index: 1000;
    
    &.open {
      display: block;
    }
    
    .nav-item {
      border-bottom: 1px solid #eee;
      
      &:last-child {
        border-bottom: none;
      }
      
      .nav-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        color: #555;
        text-decoration: none;
        transition: all 0.3s ease;
        
        &:hover {
          background: #f8f9fa;
          color: var(--primary-color);
        }
      }
      
      &.active > .nav-link {
        color: var(--primary-color);
        background: #f0f8ff;
      }
    }
    
    // 2차 메뉴 위치
    &.level-2 {
      top: 100%;
      left: 0;
    }
    
    // 3차 메뉴 위치 (우측으로 확장)
    &.level-3 {
      top: 0;
      left: 100%;
    }
    
    // 4차 이상 메뉴도 동일한 패턴
    &.level-4,
    &.level-5 {
      top: 0;
      left: 100%;
    }
  }
  
  // 모바일 대응
  @media (max-width: 768px) {
    .nav-menu.level-1 {
      flex-direction: column;
    }
    
    .submenu {
      position: static;
      box-shadow: none;
      background: #f8f9fa;
      margin-left: 20px;
      
      &.level-2,
      &.level-3,
      &.level-4 {
        top: auto;
        left: auto;
      }
    }
  }
}
```

#### 3.9.4 메가메뉴 지원 (선택사항)

대형 사이트를 위한 메가메뉴 구현:

```typescript
const MegaMenuItem = ({ menu, data, utils }: { menu: HierarchicalMenu } & ExternalSkinProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 메가메뉴 판단 (하위 메뉴가 많은 경우)
  const isMegaMenu = menu.children && menu.children.length > 6;
  
  if (!isMegaMenu) {
    return renderMenuItem(menu, 1); // 일반 메뉴로 처리
  }
  
  // 메가메뉴 컬럼으로 그룹화
  const columnSize = Math.ceil(menu.children!.length / 3);
  const columns = [];
  for (let i = 0; i < menu.children!.length; i += columnSize) {
    columns.push(menu.children!.slice(i, i + columnSize));
  }
  
  return (
    <li 
      className="nav-item mega-menu"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a href={menu.url} className="nav-link">
        {menu.name}
        <i className="mega-arrow" />
      </a>
      
      {isOpen && (
        <div className="mega-dropdown">
          <div className="mega-content">
            {columns.map((column, index) => (
              <div key={index} className="mega-column">
                <ul>
                  {column.map(item => (
                    <li key={item.id}>
                      <a href={item.url} onClick={(e) => handleMenuClick(item, e)}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
};
```

### 🎯 3.10 메뉴 타입별 배치 전략 (GLOBAL vs MAIN)

웹빌더에서 설정한 메뉴는 **타입에 따라 다른 위치에 배치**되어야 합니다.

#### 3.10.1 메뉴 타입 이해하기

```typescript
interface MenuType {
  type: 'GLOBAL' | 'MAIN';
  // GLOBAL: 전역 메뉴 (로고 옆, 유틸리티 메뉴 등)
  // MAIN: 주 메뉴 (메인 네비게이션)
}

// 실제 메뉴 데이터 예시
const menuData = [
  { id: '1', name: '로그인', type: 'GLOBAL', url: '/login' },
  { id: '2', name: '회원가입', type: 'GLOBAL', url: '/signup' },
  { id: '3', name: '홈', type: 'MAIN', url: '/' },
  { id: '4', name: '상품', type: 'MAIN', url: '/products' },
  { id: '5', name: '고객지원', type: 'MAIN', url: '/support' }
];
```

#### 3.10.2 타입별 메뉴 분리 컴포넌트

```typescript
const SmartMenuSystem = ({ data, utils, actions }: ExternalSkinProps) => {
  const { menus, globalMenus, mainMenus, isUserLoggedIn, isAdminLoggedIn, isBusiness } = data;
  const { navigate, location } = utils;
  
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  // 메뉴 데이터 통합
  const allMenus = menus?.length > 0 ? menus : [...(globalMenus || []), ...(mainMenus || [])];
  
  // 타입별 메뉴 분리 함수
  const getMenusByType = (menuType: 'GLOBAL' | 'MAIN') => {
    return allMenus
      .filter(menu => {
        // 타입 필터링
        if (menu.type !== menuType) return false;
        
        // 기본 필터링
        if (!menu.visible) return false;
        if (menu.is_logged && !isLoggedIn) return false;
        if (menu.is_not_logged && isLoggedIn) return false;
        if (menu.is_business_only && (!isLoggedIn || !isBusiness)) return false;
        
        return true;
      })
      .sort((a, b) => a.order - b.order);
  };
  
  // 글로벌 메뉴 (헤더 우측)
  const GlobalMenus = () => {
    const globalMenuItems = getMenusByType('GLOBAL');
    
    return (
      <div className="global-menus">
        {globalMenuItems.map(menu => (
          <a
            key={menu.id}
            href={menu.url}
            className={`global-menu-item ${location.pathname === menu.url ? 'active' : ''}`}
            onClick={(e) => handleMenuClick(menu, e)}
          >
            {menu.name}
          </a>
        ))}
      </div>
    );
  };
  
  // 메인 메뉴 (헤더 중앙)
  const MainMenus = () => {
    const mainMenuItems = getMenusByType('MAIN');
    
    return (
      <nav className="main-menus">
        <ul className="main-menu-list">
          {mainMenuItems.map(menu => (
            <li key={menu.id} className={`main-menu-item ${isActiveMenuPath(menu) ? 'active' : ''}`}>
              <a
                href={menu.url}
                className="main-menu-link"
                onClick={(e) => handleMenuClick(menu, e)}
              >
                {menu.name}
              </a>
              
              {/* 2차 메뉴가 있는 경우 */}
              {menu.children && menu.children.length > 0 && (
                <ul className="sub-menu">
                  {menu.children.map(subMenu => (
                    <li key={subMenu.id}>
                      <a
                        href={subMenu.url}
                        onClick={(e) => handleMenuClick(subMenu, e)}
                      >
                        {subMenu.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  
  return { GlobalMenus, MainMenus };
};
```

#### 3.10.3 헤더 레이아웃에 타입별 메뉴 배치

```typescript
const SmartHeader = ({ data, utils, actions }: ExternalSkinProps) => {
  const { withcookieData, user, cartItems, companyIsUse } = data;
  const { GlobalMenus, MainMenus } = SmartMenuSystem({ data, utils, actions });
  
  // 로고 정보
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  const companyName = withcookieData?.skin?.extra?.company_name || '회사명';
  
  // 쇼핑카트 표시 여부
  const showCart = withcookieData?.skin?.company?.useShop && companyIsUse;
  const cartCount = cartItems?.length || 0;
  
  return (
    <header className="smart-header">
      {/* 상단 유틸리티 바 (GLOBAL 메뉴) */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-left">
            <span>환영합니다! {user?.name ? `${user.name}님` : '고객님'}</span>
          </div>
          
          <div className="header-top-right">
            <GlobalMenus />
          </div>
        </div>
      </div>
      
      {/* 메인 헤더 (로고 + MAIN 메뉴 + 액션) */}
      <div className="header-main">
        <div className="container">
          {/* 로고 영역 */}
          <div className="logo-area">
            <a href="/" onClick={(e) => { e.preventDefault(); utils.navigate('/'); }}>
              <img 
                src={logoUrl}
                alt={companyName}
                onError={(e) => {
                  e.currentTarget.src = '/assets_flone/img/logo/logo.png';
                }}
              />
            </a>
          </div>
          
          {/* 메인 네비게이션 (MAIN 메뉴만) */}
          <MainMenus />
          
          {/* 헤더 액션 영역 */}
          <div className="header-actions">
            {/* 검색 버튼 */}
            <button className="search-toggle">
              <i className="search-icon" />
            </button>
            
            {/* 쇼핑카트 */}
            {showCart && (
              <button 
                className="cart-button"
                onClick={() => utils.navigate('/cart')}
              >
                <i className="cart-icon" />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
            )}
            
            {/* 사용자 메뉴 */}
            <div className="user-menu">
              {data.isUserLoggedIn ? (
                <div className="user-dropdown">
                  <button className="user-toggle">
                    <img src={user?.avatar || '/default-avatar.png'} alt="프로필" />
                    <span>{user?.name}</span>
                  </button>
                  <ul className="user-dropdown-menu">
                    <li><a href="/mypage">마이페이지</a></li>
                    <li><a href="/orders">주문내역</a></li>
                    <li><button onClick={actions?.onLogout}>로그아웃</button></li>
                  </ul>
                </div>
              ) : (
                <button 
                  className="login-button"
                  onClick={() => utils.navigate('/login')}
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
```

#### 3.10.4 사이드바에 전체 메뉴 표시

```typescript
const SmartSidebar = ({ data, utils, actions, isOpen, onClose }: ExternalSkinProps & { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const { menus, globalMenus, mainMenus } = data;
  
  // 전체 메뉴 (타입 구분 없이)
  const allMenus = menus?.length > 0 ? menus : [...(globalMenus || []), ...(mainMenus || [])];
  const filteredMenus = allMenus.filter(menu => {
    if (!menu.visible) return false;
    if (menu.is_logged && !data.isUserLoggedIn && !data.isAdminLoggedIn) return false;
    if (menu.is_not_logged && (data.isUserLoggedIn || data.isAdminLoggedIn)) return false;
    return true;
  }).sort((a, b) => a.order - b.order);
  
  // 타입별 그룹화
  const menuGroups = {
    main: filteredMenus.filter(menu => menu.type === 'MAIN'),
    global: filteredMenus.filter(menu => menu.type === 'GLOBAL'),
    others: filteredMenus.filter(menu => !menu.type || (menu.type !== 'MAIN' && menu.type !== 'GLOBAL'))
  };
  
  return (
    <div className={`smart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>전체 메뉴</h3>
        <button className="close-button" onClick={onClose}>
          <i className="close-icon" />
        </button>
      </div>
      
      <div className="sidebar-content">
        {/* 메인 메뉴 섹션 */}
        {menuGroups.main.length > 0 && (
          <div className="menu-section">
            <h4 className="section-title">주요 메뉴</h4>
            <ul className="menu-list">
              {menuGroups.main.map(menu => (
                <li key={menu.id} className="menu-item">
                  <a
                    href={menu.url}
                    onClick={(e) => {
                      handleMenuClick(menu, e);
                      onClose();
                    }}
                  >
                    {menu.name}
                  </a>
                  
                  {/* 하위 메뉴 */}
                  {menu.children && menu.children.length > 0 && (
                    <ul className="sub-menu-list">
                      {menu.children.map(subMenu => (
                        <li key={subMenu.id}>
                          <a
                            href={subMenu.url}
                            onClick={(e) => {
                              handleMenuClick(subMenu, e);
                              onClose();
                            }}
                          >
                            {subMenu.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 글로벌 메뉴 섹션 */}
        {menuGroups.global.length > 0 && (
          <div className="menu-section">
            <h4 className="section-title">빠른 메뉴</h4>
            <ul className="menu-list">
              {menuGroups.global.map(menu => (
                <li key={menu.id} className="menu-item">
                  <a
                    href={menu.url}
                    onClick={(e) => {
                      handleMenuClick(menu, e);
                      onClose();
                    }}
                  >
                    {menu.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* 사이드바 오버레이 */}
      <div className="sidebar-overlay" onClick={onClose} />
    </div>
  );
};
```

#### 3.10.5 스타일링 (타입별 메뉴)

```scss
.smart-header {
  // 상단 유틸리티 바
  .header-top {
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    padding: 8px 0;
    font-size: 14px;
    
    .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .global-menus {
      display: flex;
      gap: 15px;
      
      .global-menu-item {
        color: #6c757d;
        text-decoration: none;
        transition: color 0.3s;
        
        &:hover,
        &.active {
          color: var(--primary-color);
        }
      }
    }
  }
  
  // 메인 헤더
  .header-main {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
    }
    
    .logo-area img {
      max-height: 50px;
    }
    
    .main-menus {
      flex: 1;
      margin: 0 40px;
      
      .main-menu-list {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        justify-content: center;
        
        .main-menu-item {
          position: relative;
          margin: 0 20px;
          
          .main-menu-link {
            display: block;
            padding: 15px 0;
            color: #333;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
            
            &:hover {
              color: var(--primary-color);
            }
          }
          
          &.active > .main-menu-link {
            color: var(--primary-color);
          }
          
          // 2차 메뉴
          .sub-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            min-width: 180px;
            z-index: 1000;
            
            li {
              border-bottom: 1px solid #eee;
              
              &:last-child {
                border-bottom: none;
              }
              
              a {
                display: block;
                padding: 12px 16px;
                color: #555;
                text-decoration: none;
                
                &:hover {
                  background: #f8f9fa;
                  color: var(--primary-color);
                }
              }
            }
          }
          
          &:hover .sub-menu {
            display: block;
          }
        }
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
      
      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        
        &:hover {
          color: var(--primary-color);
        }
      }
      
      .cart-button {
        position: relative;
        
        .cart-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  
  // 모바일 대응
  @media (max-width: 768px) {
    .header-top {
      display: none; // 모바일에서는 상단 바 숨김
    }
    
    .header-main .main-menus {
      display: none; // 모바일에서는 햄버거 메뉴로 대체
    }
  }
}
```

### 🚀 3.11 라우터 고급 기능 (쿼리 파라미터, 해시, 상태)

웹빌더에서 **고급 라우팅 기능**을 완전히 지원하는 방법입니다.

#### 3.11.1 쿼리 파라미터 처리

```typescript
const AdvancedRouting = ({ utils }: { utils: any }) => {
  const { location, navigate, params } = utils;
  
  // 쿼리 파라미터 파싱
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const queryParams: Record<string, string> = {};
    
    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    
    return queryParams;
  };
  
  // 쿼리 파라미터 설정
  const setQueryParams = (newParams: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams(location.search);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        searchParams.delete(key);
      } else {
        searchParams.set(key, String(value));
      }
    });
    
    const newSearch = searchParams.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}${location.hash}`;
    navigate(newUrl, { replace: true });
  };
  
  // URL 파라미터 + 쿼리 파라미터 통합 접근
  const getAllParams = () => {
    return {
      ...params,        // URL 파라미터 (/product/:id)
      ...getQueryParams() // 쿼리 파라미터 (?category=electronics&sort=price)
    };
  };
  
  return { getQueryParams, setQueryParams, getAllParams };
};
```

#### 3.11.2 상품 목록 페이지 예제 (필터링 + 페이징)

```typescript
const ProductListWithFilters = ({ data, utils }: ExternalSkinProps) => {
  const { getQueryParams, setQueryParams } = AdvancedRouting({ utils });
  const queryParams = getQueryParams();
  
  // 현재 필터 상태
  const currentFilters = {
    category: queryParams.category || 'all',
    sort: queryParams.sort || 'name',
    page: parseInt(queryParams.page || '1'),
    search: queryParams.search || ''
  };
  
  // 필터 변경 핸들러
  const handleFilterChange = (filterType: string, value: string | number) => {
    const newParams = {
      ...queryParams,
      [filterType]: value,
      page: filterType !== 'page' ? 1 : value // 필터 변경 시 첫 페이지로
    };
    
    setQueryParams(newParams);
  };
  
  // 검색 핸들러
  const handleSearch = (searchTerm: string) => {
    setQueryParams({
      ...queryParams,
      search: searchTerm,
      page: 1
    });
  };
  
  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    setQueryParams({
      ...queryParams,
      page: newPage
    });
  };
  
  return (
    <div className="product-list-page">
      {/* 검색 바 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="상품 검색..."
          defaultValue={currentFilters.search}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch(e.currentTarget.value);
            }
          }}
        />
      </div>
      
      {/* 필터 메뉴 */}
      <div className="filters">
        <select
          value={currentFilters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="all">전체 카테고리</option>
          <option value="electronics">전자제품</option>
          <option value="clothing">의류</option>
          <option value="books">도서</option>
        </select>
        
        <select
          value={currentFilters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="name">이름순</option>
          <option value="price-low">가격 낮은순</option>
          <option value="price-high">가격 높은순</option>
          <option value="date">최신순</option>
        </select>
      </div>
      
      {/* 상품 목록 */}
      <div className="products">
        {/* 실제 상품 데이터는 API에서 currentFilters를 기반으로 가져옴 */}
        <p>
          현재 필터: 카테고리={currentFilters.category}, 
          정렬={currentFilters.sort}, 
          페이지={currentFilters.page}
          {currentFilters.search && `, 검색="${currentFilters.search}"`}
        </p>
      </div>
      
      {/* 페이지네이션 */}
      <div className="pagination">
        {[1, 2, 3, 4, 5].map(page => (
          <button
            key={page}
            className={currentFilters.page === page ? 'active' : ''}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};
```

#### 3.11.3 해시 라우팅 및 앵커 처리

```typescript
const HashAndAnchorHandling = ({ utils }: { utils: any }) => {
  const { location, navigate } = utils;
  
  // 해시 변경 감지
  useEffect(() => {
    const handleHashChange = () => {
      const hash = location.hash;
      if (hash) {
        // 해시에 해당하는 엘리먼트로 스크롤
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    };
    
    // 초기 로드 시 해시 처리
    handleHashChange();
    
    // 해시 변경 이벤트 리스너
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location.hash]);
  
  // 앵커 링크로 이동
  const scrollToSection = (sectionId: string) => {
    const newUrl = `${location.pathname}${location.search}#${sectionId}`;
    navigate(newUrl, { replace: true });
  };
  
  // 같은 페이지 내 앵커 메뉴
  const AnchorMenu = () => {
    const sections = [
      { id: 'overview', name: '개요' },
      { id: 'features', name: '기능' },
      { id: 'pricing', name: '가격' },
      { id: 'contact', name: '문의' }
    ];
    
    return (
      <nav className="anchor-menu">
        {sections.map(section => (
          <button
            key={section.id}
            className={location.hash === `#${section.id}` ? 'active' : ''}
            onClick={() => scrollToSection(section.id)}
          >
            {section.name}
          </button>
        ))}
      </nav>
    );
  };
  
  return { scrollToSection, AnchorMenu };
};
```

#### 3.11.4 히스토리 상태 관리

```typescript
const HistoryStateManagement = ({ utils }: { utils: any }) => {
  const { navigate, location } = utils;
  
  // 상태와 함께 네비게이션
  const navigateWithState = (url: string, state: any) => {
    navigate(url, { 
      state,
      replace: false 
    });
  };
  
  // 뒤로 가기 버튼 처리
  const handleBackButton = () => {
    window.history.back();
  };
  
  // 앞으로 가기 버튼 처리
  const handleForwardButton = () => {
    window.history.forward();
  };
  
  // 모달/팝업과 히스토리 연동
  const ModalWithHistory = ({ isOpen, onClose, children }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) => {
    useEffect(() => {
      if (isOpen) {
        // 모달 열릴 때 히스토리에 상태 추가
        const currentUrl = `${location.pathname}${location.search}${location.hash}`;
        navigateWithState(currentUrl, { modalOpen: true });
        
        // 뒤로 가기 이벤트 리스너
        const handlePopState = (event: PopStateEvent) => {
          if (!event.state?.modalOpen) {
            onClose();
          }
        };
        
        window.addEventListener('popstate', handlePopState);
        
        return () => {
          window.removeEventListener('popstate', handlePopState);
        };
      }
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={onClose}>×</button>
          {children}
        </div>
      </div>
    );
  };
  
  return { 
    navigateWithState, 
    handleBackButton, 
    handleForwardButton, 
    ModalWithHistory 
  };
};
```

#### 3.11.5 고급 메뉴 라우팅 (동적 + 쿼리 파라미터)

```typescript
const AdvancedMenuRouting = ({ data, utils, actions }: ExternalSkinProps) => {
  const { navigate, location, params } = utils;
  const { getQueryParams, setQueryParams } = AdvancedRouting({ utils });
  
  // 고급 메뉴 클릭 핸들러
  const handleAdvancedMenuClick = (menu: any, e: React.MouseEvent) => {
    e.preventDefault();
    
    // 메뉴 URL 분석
    const menuUrl = menu.url;
    
    // 1. 쿼리 파라미터가 포함된 URL
    if (menuUrl.includes('?')) {
      navigate(menuUrl);
      return;
    }
    
    // 2. 앵커 링크
    if (menuUrl.startsWith('#')) {
      const element = document.getElementById(menuUrl.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    // 3. 동적 라우트 with 현재 파라미터 유지
    if (menuUrl.includes(':')) {
      let finalUrl = menuUrl;
      
      // URL 파라미터 치환
      Object.entries(params).forEach(([key, value]) => {
        finalUrl = finalUrl.replace(`:${key}`, value as string);
      });
      
      // 현재 쿼리 파라미터 유지 (menu에 preserveQuery: true가 있는 경우)
      if (menu.preserveQuery && location.search) {
        finalUrl += location.search;
      }
      
      navigate(finalUrl);
      return;
    }
    
    // 4. 특수 액션 with 파라미터
    if (menu.menuAction) {
      const currentParams = getQueryParams();
      
      switch (menu.menuAction) {
        case 'filter':
          setQueryParams({
            ...currentParams,
            filter: menu.filterValue || 'all',
            page: 1
          });
          break;
          
        case 'sort':
          setQueryParams({
            ...currentParams,
            sort: menu.sortValue || 'name',
            page: 1
          });
          break;
          
        case 'search':
          setQueryParams({
            ...currentParams,
            search: menu.searchTerm || '',
            page: 1
          });
          break;
          
        default:
          // 기본 액션 처리 (로그인/로그아웃 등)
          if (menu.menuAction === 'logout') {
            actions?.onLogout?.();
          }
      }
      return;
    }
    
    // 5. 일반 네비게이션
    navigate(menuUrl);
  };
  
  // 동적 메뉴 생성 (현재 페이지 컨텍스트 기반)
  const generateContextMenus = () => {
    const currentPath = location.pathname;
    const contextMenus = [];
    
    // 상품 상세 페이지인 경우
    if (currentPath.includes('/product/') && params.id) {
      contextMenus.push(
        { id: 'reviews', name: '리뷰', url: `#reviews` },
        { id: 'related', name: '관련상품', url: `#related-products` },
        { id: 'qna', name: 'Q&A', url: `#qna` }
      );
    }
    
    // 카테고리 페이지인 경우
    if (currentPath.includes('/category/')) {
      contextMenus.push(
        { id: 'filter-new', name: '신상품', menuAction: 'filter', filterValue: 'new' },
        { id: 'filter-sale', name: '할인상품', menuAction: 'filter', filterValue: 'sale' },
        { id: 'sort-price', name: '가격순', menuAction: 'sort', sortValue: 'price' }
      );
    }
    
    return contextMenus;
  };
  
  const contextMenus = generateContextMenus();
  
  return (
    <div className="advanced-menu-system">
      {/* 기본 메뉴 */}
      <nav className="main-nav">
        {/* 기존 메뉴 렌더링 로직 */}
      </nav>
      
      {/* 컨텍스트 메뉴 */}
      {contextMenus.length > 0 && (
        <nav className="context-nav">
          <h4>페이지 메뉴</h4>
          {contextMenus.map(menu => (
            <button
              key={menu.id}
              onClick={(e) => handleAdvancedMenuClick(menu, e)}
              className="context-menu-item"
            >
              {menu.name}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};
```

#### 3.11.6 SEO 친화적 URL 처리

```typescript
const SEOFriendlyRouting = ({ utils }: { utils: any }) => {
  const { navigate, location } = utils;
  
  // 슬러그 생성 (한글 → 영문 URL)
  const createSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '') // 한글 제거
      .replace(/[^a-z0-9 -]/g, '') // 특수문자 제거
      .replace(/\s+/g, '-') // 공백을 하이픈으로
      .replace(/-+/g, '-') // 연속 하이픈 제거
      .trim('-');
  };
  
  // 상품명으로 SEO URL 생성
  const createProductUrl = (productId: string, productName: string) => {
    const slug = createSlug(productName);
    return `/product/${productId}/${slug}`;
  };
  
  // 카테고리 URL 생성
  const createCategoryUrl = (categoryId: string, categoryName: string) => {
    const slug = createSlug(categoryName);
    return `/category/${categoryId}/${slug}`;
  };
  
  // Canonical URL 설정
  const setCanonicalUrl = (url: string) => {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  };
  
  // Open Graph 메타 태그 설정
  const setOGTags = (data: {
    title: string;
    description: string;
    image?: string;
    url?: string;
  }) => {
    const tags = {
      'og:title': data.title,
      'og:description': data.description,
      'og:image': data.image || '',
      'og:url': data.url || window.location.href
    };
    
    Object.entries(tags).forEach(([property, content]) => {
      if (!content) return;
      
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });
  };
  
  return { 
    createSlug, 
    createProductUrl, 
    createCategoryUrl, 
    setCanonicalUrl, 
    setOGTags 
  };
};
```

이렇게 구현하면 **flone을 뛰어넘는 고급 라우팅 기능**까지 외부 스킨에서 사용할 수 있습니다!

---

## Step 4: 스킨 빌드하기

### 4.1 개발 서버 중지
터미널에서 `Ctrl + C` (Mac은 `Cmd + C`)

### 4.2 프로덕션 빌드 실행
```bash
npm run build
```

### 4.3 빌드 결과 확인
```
dist/
├── my-awesome-skin.umd.js    # ✅ JavaScript 파일
└── my-awesome-skin.css       # ✅ CSS 파일
```

🎉 축하합니다! 스킨이 빌드되었습니다!

---

## Step 5: 스킨 배포하기

### 방법 1: GitHub Pages 사용 (무료, 추천!)

#### 1) GitHub 계정 만들기
https://github.com 에서 무료 가입

#### 2) 새 저장소(Repository) 만들기
- Repository name: `my-awesome-skin`
- Public 선택
- Create repository 클릭

#### 3) 파일 업로드
```bash
# Git 초기화
git init
git add .
git commit -m "My first skin"

# GitHub에 연결 (your-username을 본인 것으로 변경)
git remote add origin https://github.com/your-username/my-awesome-skin.git
git push -u origin main
```

#### 4) GitHub Pages 활성화
1. GitHub 저장소 → Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, 폴더: /root
4. Save

#### 5) 배포 URL 확인
약 5분 후:
- JS: `https://your-username.github.io/my-awesome-skin/dist/my-awesome-skin.umd.js`
- CSS: `https://your-username.github.io/my-awesome-skin/dist/my-awesome-skin.css`

### 방법 2: Netlify 사용 (더 쉬움!)

#### 1) Netlify 가입
https://www.netlify.com 에서 GitHub으로 가입

#### 2) dist 폴더 드래그 앤 드롭
1. Netlify 대시보드에서 dist 폴더를 드래그
2. 자동으로 URL 생성됨

#### 3) URL 확인
- JS: `https://amazing-site-name.netlify.app/my-awesome-skin.umd.js`
- CSS: `https://amazing-site-name.netlify.app/my-awesome-skin.css`

### 방법 3: 로컬 테스트 (개발용)

메인 프로젝트의 `public` 폴더에 복사:
```bash
cp dist/my-awesome-skin.umd.js ../withcookie_webbuilder/public/
cp dist/my-awesome-skin.css ../withcookie_webbuilder/public/
```

---

## Step 6: 스킨 등록하기

### 6.1 메인 프로젝트에서 스킨 등록

`withcookie_webbuilder` 프로젝트의 아무 초기화 파일에 추가:

```javascript
import { registerExternalLayout } from './layouts/ExternalLayoutLoader';

// 스킨 등록
registerExternalLayout({
  id: 'my-awesome-skin',           // 고유 ID
  name: '나의 멋진 스킨',            // 표시될 이름
  description: '깔끔하고 모던한 디자인',  // 설명
  version: '1.0.0',                // 버전
  author: '홍길동',                 // 제작자
  
  // 🔴 중요: 실제 배포된 URL로 변경하세요!
  umdUrl: 'https://your-username.github.io/my-awesome-skin/dist/my-awesome-skin.umd.js',
  cssUrls: ['https://your-username.github.io/my-awesome-skin/dist/my-awesome-skin.css'],
  
  // 🔴 중요: webpack.config.js의 library와 동일해야 함!
  globalName: 'WithCookieSkin_[스킨ID]_[버전]'  // 실제 스킨 ID와 버전으로 변경!
  // 예시: globalName: 'WithCookieSkin_25_1_0_6'
});
```

### 6.2 개발 중 테스트

개발 서버가 실행 중일 때:

```javascript
// 개발용 등록 (localhost)
if (process.env.NODE_ENV === 'development') {
  registerExternalLayout({
    id: 'dev-skin',
    name: '개발 중인 스킨',
    umdUrl: 'http://localhost:3001/my-awesome-skin.umd.js',
    cssUrls: ['http://localhost:3001/my-awesome-skin.css'],
    globalName: 'WithCookieSkin_[스킨ID]_[버전]'  // 실제 값으로 변경
  });
}
```

### 6.3 스킨 사용하기

1. 웹빌더 실행
2. 레이아웃 선택 드롭다운 클릭
3. "나의 멋진 스킨" 선택
4. ✨ 완료!

---

## 문제 해결

### ❌ "Module not found" 에러
```bash
npm install  # 패키지 재설치
```

### ❌ 스킨이 로드되지 않음
1. 브라우저 개발자 도구 열기 (F12)
2. Console 탭에서 에러 확인
3. Network 탭에서 파일이 제대로 로드되는지 확인

### ❌ CORS 에러
로컬 파일을 직접 열면 발생. 해결방법:
- 개발 서버 사용 (`npm run dev`)
- 실제 웹서버에 배포

### ❌ "MyAwesomeSkin is not defined" 에러
`globalName`이 일치하는지 확인:
- webpack.config.js의 `library`
- src/index.tsx의 `window.WithCookieSkin_[스킨ID]_[버전]`
- 등록할 때의 `globalName`

모두 동일한 형식(`WithCookieSkin_[스킨ID]_[버전]`)이어야 합니다!

세 곳 모두 동일해야 합니다!

### ❌ 페이지 내용이 표시되지 않음
1. `{layout.children}`이 있는지 확인
2. `{children}`이 아닌 `{layout.children}` 사용하는지 확인
3. main 태그나 content 영역 안에 있는지 확인

### ❌ "Cannot read property 'children' of undefined"
props 구조가 잘못됨. ExternalSkinProps 인터페이스 사용 확인:
```typescript
// ❌ 잘못됨
const MySkin = ({ children }) => ...

// ✅ 올바름
const MySkin: React.FC<ExternalSkinProps> = ({ layout }) => ...
```

---

## 🎯 체크리스트

- [ ] Node.js 설치됨
- [ ] 템플릿 다운로드함
- [ ] `npm install` 실행함
- [ ] `npm run dev`로 개발 서버 확인함
- [ ] 스킨 이름 3곳 모두 변경함
- [ ] 색상 변경함
- [ ] `npm run build` 실행함
- [ ] dist 폴더에 파일 2개 생성됨
- [ ] 파일을 웹에 업로드함
- [ ] URL을 복사함
- [ ] 메인 프로젝트에 등록함
- [ ] 레이아웃 선택기에서 확인함
- [ ] `{layout.children}` 추가함 (페이지 내용 표시 위치)
- [ ] ExternalSkinProps 인터페이스 사용함

---

## 다음 단계

1. **반응형 디자인 추가**
   ```scss
   @media (max-width: 768px) {
     // 모바일 스타일
   }
   ```

2. **애니메이션 추가**
   ```scss
   .header {
     transition: all 0.3s ease;
   }
   ```

3. **다크 모드 지원**
   ```scss
   [data-theme="dark"] {
     --primary-color: #ffffff;
     --background-color: #1a1a1a;
   }
   ```

---

## 도움말

### 유용한 링크
- React 기초: https://react.dev/learn
- CSS 색상: https://htmlcolorcodes.com/
- 무료 아이콘: https://fontawesome.com/

### 커뮤니티
- 질문하기: [GitHub Issues](https://github.com/your-repo/issues)
- 예제 스킨: [Examples](https://github.com/your-repo/examples)

---

## 🚀 고급 기능

### API 기반 스킨 등록

수동 등록 외에도 API를 통해 자동으로 스킨을 로드할 수 있습니다:

```javascript
// 숫자 ID로 자동 로드 (CDN에서 가져옴)
const layoutId = 'external-123'; // 123은 스킨 ID

// 자동으로 다음 URL에서 로드:
// https://cdn.withcookie-refrigerator.com/skins/123/skin.umd.js
// https://cdn.withcookie-refrigerator.com/skins/123/skin.css
```

### 메뉴 데이터 활용

#### 메뉴 URL 우선순위
메뉴 URL은 여러 속성을 가질 수 있으며, 다음 우선순위로 사용됩니다:
```javascript
const menuUrl = menu.url || menu.path || menu.link || '#';
```

#### navigation 데이터 활용
`data.navigation`은 이미 계층 구조로 변환된 메뉴 데이터입니다:

```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data }) => {
  const { navigation } = data; // 바로 사용 가능한 계층형 메뉴
  
  return (
    <nav>
      {navigation.map(item => (
        <li key={item.id}>
          <a onClick={item.onClick}>{item.label}</a>
          {item.children && (
            <ul>
              {item.children.map(child => (
                <li key={child.id}>
                  <a onClick={child.onClick}>{child.label}</a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </nav>
  );
};
```

### 고급 메뉴 속성

메뉴 객체는 다음과 같은 고급 속성들을 포함합니다:

```typescript
interface AdvancedMenu {
  // 기본 속성
  id: string;
  name: string;
  url: string;
  
  // 고급 속성
  is_business_only: boolean;  // 사업자 전용 메뉴
  level: number;             // 메뉴 계층 레벨 (1, 2, 3...)
  parentId?: string;         // 부모 메뉴 ID
  menuAction?: string;       // 특수 액션 ('logout', 'login' 등)
  
  // URL 대체 속성
  path?: string;             // url 대신 사용 가능
  link?: string;             // url, path 대신 사용 가능
  externalLink?: string;     // 외부 링크
}
```

### B2B 기능 구현

`isBusiness`와 `companyIsUse` 속성을 활용한 B2B 전용 기능:

```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data }) => {
  const { isBusiness, companyIsUse, withcookieData } = data;
  
  // 쇼핑몰 기능 활성화 체크
  const useShop = withcookieData?.skin?.company?.useShop && companyIsUse;
  
  return (
    <div>
      {/* B2B 전용 메뉴 */}
      {isBusiness && (
        <nav className="business-menu">
          <a href="/business/dashboard">비즈니스 대시보드</a>
          <a href="/business/analytics">분석</a>
        </nav>
      )}
      
      {/* 쇼핑몰 기능 */}
      {useShop && (
        <div className="shop-features">
          <CartButton />
          <ProductSearch />
        </div>
      )}
    </div>
  );
};
```

### React Router 자동 통합

외부 스킨의 모든 `<a>` 태그 클릭은 자동으로 React Router로 처리됩니다:

```typescript
// 자동으로 처리됨 - 별도 설정 불필요
<a href="/products">상품</a>

// 수동으로 navigate 사용도 가능
<button onClick={() => utils.navigate('/products')}>
  상품 보기
</button>

// 전역 함수로도 사용 가능
window.withcookieNavigate('/products');
```

### 전역 변수 충돌 방지

레지스트리 스킨의 경우 자동으로 전역 변수를 정리하고 통일된 이름으로 재할당합니다:

```javascript
// 원본 스킨이 'ModernSkin'으로 export 되어도
// 자동으로 'ExternalSkin123' 형식으로 변환됨

// webpack.config.js
output: {
  library: 'ModernSkin' // 원본 이름
}

// 로더가 자동으로 처리
window.ExternalSkin123 = ModernSkin; // 충돌 방지
```

### 성능 최적화

#### 빠른 로딩 전략
- 20ms 이내 로딩 시 로딩 메시지를 표시하지 않음
- CSS 로딩 실패 시에도 컴포넌트는 계속 로드

```typescript
// ExternalLayoutLoader 내부 동작
const loadingTimer = setTimeout(() => {
  if (loading) {
    setShowLoading(true); // 20ms 후에만 표시
  }
}, 20);
```

#### 캐시 전략
- 일반 외부 스킨: 캐싱 활성화
- 레지스트리 스킨: 캐시 무효화 (항상 최신 버전)

### 디버깅 팁

개발 중 콘솔에서 다음 정보를 확인할 수 있습니다:

```javascript
// 스킨 로딩 과정
console.log('🚀 UMD 스크립트 로드 시작:', url);
console.log('🎯 예상 전역 변수명:', globalName);
console.log('✅ 컴포넌트 발견:', foundComponent);

// 메뉴 데이터 확인
console.log('🔍 최종 메뉴 데이터:', menus);
console.log('🔍 navigation 구조:', navigation);
```

### CORS 문제 해결

CORS 에러 발생 시 자동으로 재시도합니다:

```javascript
// 1차 시도: CORS 헤더 포함
script.crossOrigin = 'anonymous';

// 실패 시 2차 시도: CORS 헤더 없이
fallbackScript.src = url;
```

### 회사별 특수 처리

특정 회사를 위한 동적 스타일 주입 예시:

```typescript
useEffect(() => {
  const companyId = withcookieData?.company?.id;
  if (companyId === 27) {
    // 특수 스타일 주입
    const style = document.createElement('style');
    style.innerHTML = `
      .submenu { 
        z-index: 9999 !important; 
      }
    `;
    document.head.appendChild(style);
  }
}, [withcookieData]);
```

---

## 🧩 컴포넌트 스킨 시스템

레이아웃 스킨 외에도 개별 컴포넌트 레벨에서 스킨을 적용할 수 있습니다:

```javascript
// 컴포넌트 스킨 등록
import { registerComponentSkin } from './components/skins/ComponentSkinLoader';

registerComponentSkin({
  componentType: 'ProductCard',
  skinId: 'modern-card',
  umdUrl: 'https://example.com/modern-card.umd.js',
  cssUrl: 'https://example.com/modern-card.css'
});
```

---

🎉 **축하합니다!** 이제 여러분도 고급 스킨 개발자입니다!

문제가 있거나 도움이 필요하면 언제든지 문의하세요.




⏺ 외부 스킨에 전달되는 데이터는 크게 4개 카테고리로 구성되어 있습니다:

  1. Data Props - 데이터

  - user: 사용자 정보 (id, name, email, avatar 등)
  - company: 회사 정보 (id, name, logo, settings 등)
  - withcookieData: 전체 시스템 데이터
  - menus: 전체 메뉴 목록
  - globalMenus: 글로벌 메뉴 목록
  - mainMenus: 메인 메뉴 목록
  - navigation: 계층 구조로 변환된 통합 메뉴 데이터 (바로 사용 가능)
  - assetBalances: 자산 잔액 정보
  - transactions: 거래 내역
  - cartItems: 장바구니 아이템
  - isUserLoggedIn: 사용자 로그인 상태
  - isAdminLoggedIn: 관리자 로그인 상태
  - isBusiness: 사업자 여부 (B2B 기능용)
  - companyIsUse: 회사 기능 활성화 여부
  - currentLanguage: 현재 언어 (KR, EN 등)
  - translations: 번역 사전

  2. Actions - 액션 함수들

  - onLogin: 로그인 처리
  - onLogout: 로그아웃 처리
  - onCheckAuth: 인증 상태 확인
  - onFetchBalances: 잔액 정보 가져오기
  - onFetchTransactions: 거래 내역 가져오기
  - onFetchCartItems: 장바구니 아이템 가져오기
  - onFetchMenus: 메뉴 정보 가져오기
  - onFetchWithcookieData: 전체 데이터 가져오기
  - onUpdateCart: 장바구니 업데이트
  - onChangeLanguage: 언어 변경

  3. Utils - 유틸리티

  - navigate: 페이지 이동 함수
  - location: 현재 위치 정보 (pathname, search, hash, state)
  - params: URL 파라미터
  - t: 번역 함수
  - formatCurrency: 통화 포맷 함수
  - formatDate: 날짜 포맷 함수

  4. Layout & Theme - 레이아웃과 테마

  - layout.children: 페이지 컨텐츠
  - layout.currentMenuId: 현재 메뉴 ID
  - layout.breadcrumbs: 브레드크럼 정보
  - layout.pageTitle: 페이지 제목
  - layout.showHeader/Footer/Sidebar: 헤더/푸터/사이드바 표시 여부
  - theme: 색상, 폰트, 간격, 브레이크포인트 등 테마 설정

  외부 스킨은 이 모든 데이터와 함수들을 props로 받아서 사용할 수 있습니다.