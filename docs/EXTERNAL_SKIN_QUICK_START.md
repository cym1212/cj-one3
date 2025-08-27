# 🚀 외부 스킨 빠른 시작 가이드

5분 안에 첫 스킨 만들기!

## 1️⃣ 설치 및 시작 (2분)

```bash
# 템플릿 복사
cp -r external-skin-template my-skin
cd my-skin

# 패키지 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 http://localhost:3001 확인

## 2️⃣ 스킨 이름 변경 (1분)

### 3곳 수정:

1. **package.json**
```json
"name": "my-skin"
```

2. **webpack.config.js**
```javascript
output: {
  filename: 'my-skin.umd.js',
  library: 'MySkin',  // 띄어쓰기 없이!
}
```

3. **src/index.tsx** (맨 아래)
```typescript
window.MySkin = MyCustomSkin;
```

## 3️⃣ 빌드 (30초)

```bash
npm run build
```

결과물:
- `dist/my-skin.umd.js`
- `dist/my-skin.css`

## 4️⃣ 테스트 등록 (1분)

메인 프로젝트에서:

```javascript
// 로컬 테스트용
registerExternalLayout({
  id: 'my-skin',
  name: 'My Skin',
  umdUrl: 'http://localhost:3001/my-skin.umd.js',
  cssUrls: ['http://localhost:3001/my-skin.css'],
  globalName: 'MySkin'  // webpack의 library와 동일!
});
```

## 5️⃣ 배포 (30초)

### GitHub Pages 최단 경로:
1. GitHub에 저장소 생성
2. dist 폴더 내용을 gh-pages 브랜치에 푸시
3. Settings → Pages 활성화

### 또는 public 폴더 사용:
```bash
cp dist/* ../withcookie_webbuilder/public/skins/
```

## ⚡ 핵심 체크포인트

✅ **이름 3곳 동일?**
- webpack.config.js: `library: 'MySkin'`
- src/index.tsx: `window.MySkin`
- 등록할 때: `globalName: 'MySkin'`

✅ **개발 서버 실행 중?**
- `npm run dev` 상태 유지

✅ **빌드 파일 2개?**
- .umd.js 파일
- .css 파일

✅ **layout.children 있나?**
- 페이지 내용이 표시될 곳
- `{children}` ❌ → `{layout.children}` ✅

✅ **ExternalSkinProps 사용?**
- 독립적인 인터페이스 ❌
- ExternalSkinProps ✅

## 🔧 자주 쓰는 명령어

```bash
npm run dev    # 개발 서버 (http://localhost:3001)
npm run build  # 프로덕션 빌드
npm run clean  # dist 폴더 삭제
```

## 🔗 웹빌더 메뉴와 라우팅 연동하기

### 빠른 메뉴 네비게이션 구현

```typescript
const QuickNavigation = ({ data, utils }) => {
  const { menus, globalMenus, mainMenus, isUserLoggedIn, isAdminLoggedIn, isBusiness } = data;
  const { navigate, location } = utils;
  
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  // 메뉴 데이터 우선순위 처리
  const menusToUse = menus?.length > 0 ? menus : [...(globalMenus || []), ...(mainMenus || [])];
  
  // 메뉴 필터링 + 정렬
  const visibleMenus = menusToUse
    .filter(menu => {
      if (!menu.visible) return false;
      if (menu.is_logged && !isLoggedIn) return false;
      if (menu.is_not_logged && isLoggedIn) return false;
      if (menu.is_business_only && (!isLoggedIn || !isBusiness)) return false;
      return true;
    })
    .sort((a, b) => a.order - b.order);
  
  // 메뉴 클릭 처리
  const handleClick = (menu, e) => {
    e.preventDefault();
    
    if (menu.menuAction === 'logout') {
      data.actions?.onLogout?.();
    } else if (menu.url.startsWith('http')) {
      window.open(menu.url, '_blank');
    } else {
      navigate(menu.url);
    }
  };
  
  return (
    <nav>
      {visibleMenus.map(menu => (
        <a 
          key={menu.id}
          href={menu.url}
          className={location.pathname === menu.url ? 'active' : ''}
          onClick={(e) => handleClick(menu, e)}
        >
          {menu.name}
        </a>
      ))}
    </nav>
  );
};
```

### 완전한 스킨 예제 (메뉴 연동 포함)

```typescript
const MySkin = ({ data, actions, utils, layout, theme }) => {
  const { isUserLoggedIn, user, withcookieData } = data;
  
  // 로고 URL
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  
  return (
    <div className="skin-container">
      <header className="skin-header">
        <div className="container">
          <img src={logoUrl} alt="Logo" className="logo" />
          
          {/* 🎯 웹빌더 메뉴 연동 */}
          <QuickNavigation data={data} utils={utils} />
          
          <div className="user-area">
            {isUserLoggedIn ? (
              <>
                <span>안녕하세요, {user?.name}님</span>
                <button onClick={actions.onLogout}>로그아웃</button>
              </>
            ) : (
              <button onClick={() => utils.navigate('/login')}>로그인</button>
            )}
          </div>
        </div>
      </header>
      
      <main>{layout.children}</main>
      
      <footer className="skin-footer">
        <p>&copy; 2024 My Website</p>
      </footer>
    </div>
  );
};

// UMD 글로벌 등록
window.MySkin = MySkin;
```

### 헤더 주 메뉴 + 사이드바 전체 메뉴 구조

```typescript
const HeaderMainMenuOnly = ({ data, utils }) => {
  const { menus, globalMenus, mainMenus } = data;
  const allMenus = menus?.length > 0 ? menus : [...(globalMenus || []), ...(mainMenus || [])];
  
  // MAIN 타입 메뉴만 헤더에 표시
  const headerMenus = allMenus.filter(menu => 
    menu.visible && 
    menu.type === 'MAIN' && 
    (!menu.is_logged || data.isUserLoggedIn || data.isAdminLoggedIn)
  ).sort((a, b) => a.order - b.order);
  
  return (
    <nav className="header-main-nav">
      {headerMenus.map(menu => (
        <a 
          key={menu.id}
          href={menu.url}
          className={utils.location.pathname === menu.url ? 'active' : ''}
          onClick={(e) => {
            e.preventDefault();
            utils.navigate(menu.url);
          }}
        >
          {menu.name}
        </a>
      ))}
    </nav>
  );
};

const SidebarAllMenus = ({ data, utils, isOpen, onClose }) => {
  const { menus, globalMenus, mainMenus } = data;
  const allMenus = menus?.length > 0 ? menus : [...(globalMenus || []), ...(mainMenus || [])];
  
  // 전체 메뉴 (타입 구분 없이)
  const visibleMenus = allMenus.filter(menu => 
    menu.visible &&
    (!menu.is_logged || data.isUserLoggedIn || data.isAdminLoggedIn)
  ).sort((a, b) => a.order - b.order);
  
  // 타입별 그룹화
  const menuGroups = {
    main: visibleMenus.filter(menu => menu.type === 'MAIN'),
    global: visibleMenus.filter(menu => menu.type === 'GLOBAL'),
    others: visibleMenus.filter(menu => !menu.type)
  };
  
  return (
    <div className={`sidebar-menu ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>전체 메뉴</h3>
        <button onClick={onClose}>×</button>
      </div>
      
      <div className="sidebar-content">
        {/* 주요 메뉴 */}
        {menuGroups.main.length > 0 && (
          <div className="menu-group">
            <h4>주요 메뉴</h4>
            {menuGroups.main.map(menu => (
              <div key={menu.id} className="menu-item">
                <a 
                  href={menu.url}
                  onClick={(e) => {
                    e.preventDefault();
                    utils.navigate(menu.url);
                    onClose();
                  }}
                >
                  {menu.name}
                </a>
                
                {/* 하위 메뉴 표시 */}
                {menu.children && menu.children.length > 0 && (
                  <div className="sub-menu">
                    {menu.children.map(subMenu => (
                      <a 
                        key={subMenu.id}
                        href={subMenu.url}
                        onClick={(e) => {
                          e.preventDefault();
                          utils.navigate(subMenu.url);
                          onClose();
                        }}
                      >
                        {subMenu.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* 빠른 메뉴 */}
        {menuGroups.global.length > 0 && (
          <div className="menu-group">
            <h4>빠른 메뉴</h4>
            {menuGroups.global.map(menu => (
              <a 
                key={menu.id}
                href={menu.url}
                onClick={(e) => {
                  e.preventDefault();
                  utils.navigate(menu.url);
                  onClose();
                }}
              >
                {menu.name}
              </a>
            ))}
          </div>
        )}
      </div>
      
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
    </div>
  );
};

// 완전한 통합 스킨
const SmartLayoutSkin = ({ data, actions, utils, layout, theme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { withcookieData, isUserLoggedIn, user } = data;
  
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  
  return (
    <div className="smart-layout">
      <header className="smart-header">
        <div className="container">
          {/* 로고 */}
          <div className="logo">
            <img src={logoUrl} alt="Logo" />
          </div>
          
          {/* 헤더 주 메뉴 (MAIN 타입만) */}
          <HeaderMainMenuOnly data={data} utils={utils} />
          
          {/* 헤더 액션 */}
          <div className="header-actions">
            {isUserLoggedIn ? (
              <div className="user-info">
                <span>{user?.name}님</span>
                <button onClick={actions.onLogout}>로그아웃</button>
              </div>
            ) : (
              <button onClick={() => utils.navigate('/login')}>로그인</button>
            )}
            
            {/* 햄버거 메뉴 (전체 메뉴) */}
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>
      
      {/* 사이드바 전체 메뉴 */}
      <SidebarAllMenus 
        data={data} 
        utils={utils} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main>{layout.children}</main>
      
      <footer>
        <p>&copy; 2024 My Website</p>
      </footer>
    </div>
  );
};

window.SmartLayoutSkin = SmartLayoutSkin;
```

### CSS 스타일링

```scss
.smart-layout {
  .smart-header {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .logo img {
      max-height: 50px;
    }
    
    .header-main-nav {
      display: flex;
      gap: 30px;
      
      a {
        color: #333;
        text-decoration: none;
        font-weight: 500;
        
        &:hover, &.active {
          color: var(--primary-color);
        }
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .menu-toggle {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  
  .sidebar-menu {
    position: fixed;
    top: 0;
    right: -350px;
    width: 350px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 8px rgba(0,0,0,0.1);
    transition: right 0.3s ease;
    z-index: 1000;
    
    &.open {
      right: 0;
    }
    
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
      
      button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
      }
    }
    
    .sidebar-content {
      padding: 20px;
      
      .menu-group {
        margin-bottom: 30px;
        
        h4 {
          color: #666;
          margin-bottom: 15px;
          font-size: 14px;
          text-transform: uppercase;
        }
        
        .menu-item {
          margin-bottom: 10px;
          
          > a {
            display: block;
            padding: 12px 0;
            color: #333;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid #f0f0f0;
            
            &:hover {
              color: var(--primary-color);
            }
          }
          
          .sub-menu {
            margin-left: 20px;
            margin-top: 10px;
            
            a {
              display: block;
              padding: 8px 0;
              color: #666;
              text-decoration: none;
              font-size: 14px;
              
              &:hover {
                color: var(--primary-color);
              }
            }
          }
        }
      }
    }
  }
  
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 999;
  }
  
  // 모바일 대응
  @media (max-width: 768px) {
    .smart-header {
      .header-main-nav {
        display: none; // 모바일에서는 숨김
      }
    }
  }
}
```

## 🔐 로그인 상태별 메뉴 구현

### 로그인 여부 판별 방법
스킨에서 사용할 수 있는 인증 관련 데이터:
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, actions }) => {
  const { 
    isUserLoggedIn,     // 일반 사용자 로그인 여부
    isAdminLoggedIn,    // 관리자 로그인 여부  
    user               // 사용자 정보 (id, name, email, avatar)
  } = data;
  
  const { onLogin, onLogout, onCheckAuth } = actions;
  
  // 전체 로그인 상태 확인
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
};
```

### 로그인 상태별 조건부 메뉴
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, actions, utils }) => {
  const { isUserLoggedIn, isAdminLoggedIn, user } = data;
  const { onLogout } = actions;
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  return (
    <nav className="main-navigation">
      <ul className="nav-primary">
        {/* 항상 표시되는 메뉴 */}
        <li><a href="/">홈</a></li>
        <li><a href="/products">상품</a></li>
        
        {/* 로그인 시에만 표시 */}
        {isLoggedIn && (
          <>
            <li><a href="/mypage">마이페이지</a></li>
            <li><a href="/orders">주문내역</a></li>
            <li><a href="/wishlist">위시리스트</a></li>
          </>
        )}
        
        {/* 비로그인 시에만 표시 */}
        {!isLoggedIn && (
          <>
            <li><a href="/login">로그인</a></li>
            <li><a href="/register">회원가입</a></li>
          </>
        )}
        
        {/* 관리자 전용 메뉴 */}
        {isAdminLoggedIn && (
          <li><a href="/admin">관리자 페이지</a></li>
        )}
      </ul>
      
      {/* 사용자 정보 영역 */}
      {isLoggedIn && (
        <div className="user-info">
          <img src={user?.avatar || '/default-avatar.png'} alt="프로필" />
          <span>{user?.name}</span>
          <button onClick={onLogout}>로그아웃</button>
        </div>
      )}
    </nav>
  );
};
```

### 메뉴 데이터 기반 자동 필터링
메뉴 객체의 `is_logged`, `is_not_logged` 속성 활용:
```typescript
const renderMenus = (menus: any[]) => {
  const filteredMenus = menus.filter(menu => {
    // 로그인 필요 메뉴 체크
    if (menu.is_logged && !isLoggedIn) return false;
    // 비로그인 전용 메뉴 체크  
    if (menu.is_not_logged && isLoggedIn) return false;
    return menu.visible;
  });
  
  return filteredMenus.map(menu => (
    <li key={menu.id}>
      <a href={menu.url}>{menu.name}</a>
    </li>
  ));
};
```

## 🏢 비즈니스 전용 메뉴 구현

### isBusiness + 로그인 조건부 메뉴 표시
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, actions, utils, layout, theme }) => {
  const { isBusiness, isUserLoggedIn, isAdminLoggedIn, user } = data;
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  return (
    <div>
      <nav className="main-navigation">
        <ul className="nav-primary">
          {/* 일반 메뉴 */}
          <li><a href="/">홈</a></li>
          <li><a href="/products">상품</a></li>
          
          {/* 비즈니스 + 로그인 조건부 메뉴 */}
          {isBusiness && isLoggedIn && (
            <>
              <li className="business-menu">
                <a href="/business/dashboard">비즈니스 대시보드</a>
                {/* 2차 메뉴 */}
                <ul className="nav-secondary">
                  <li><a href="/business/analytics">분석</a></li>
                  <li><a href="/business/reports">리포트</a></li>
                  <li><a href="/business/settings">설정</a></li>
                </ul>
              </li>
              <li className="business-menu">
                <a href="/business/management">관리</a>
                <ul className="nav-secondary">
                  <li><a href="/business/users">사용자 관리</a></li>
                  <li><a href="/business/roles">권한 관리</a></li>
                </ul>
              </li>
            </>
          )}
          
          {/* 비즈니스인데 로그인 안 한 경우 */}
          {isBusiness && !isLoggedIn && (
            <li>
              <a href="/business/login">비즈니스 로그인</a>
            </li>
          )}
        </ul>
      </nav>
      
      <main>{layout.children}</main>
    </div>
  );
};
```

### 2차 메뉴 스타일링
```scss
.business-menu {
  position: relative;
  
  &:hover .nav-secondary {
    display: block;
  }
}

.nav-secondary {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  min-width: 200px;
  z-index: 1000;
  
  li {
    border-bottom: 1px solid #eee;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  a {
    display: block;
    padding: 12px 16px;
    color: #333;
    text-decoration: none;
    
    &:hover {
      background: #f5f5f5;
    }
  }
}
```

## 🏢 사이트 정보 및 브랜딩 구현

### 로고 이미지 사용법
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data }) => {
  const { withcookieData, isUserLoggedIn, user } = data;
  
  // 기본 로고 URL 가져오기
  const defaultLogoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  
  // 회사별 로그인 상태에 따른 로고 (고급)
  const companySettings = withcookieData?.skin?.company?.companySettingJson;
  let logoUrl = defaultLogoUrl;
  
  if (companySettings && typeof companySettings === 'object') {
    if (isUserLoggedIn && companySettings.logo_url_logged) {
      logoUrl = companySettings.logo_url_logged;
    } else if (!isUserLoggedIn && companySettings.logo_url_nonlogged) {
      logoUrl = companySettings.logo_url_nonlogged;
    }
  }
  
  const companyName = withcookieData?.skin?.extra?.company_name || '회사명';
  
  return (
    <header>
      <div className="logo">
        <img 
          src={logoUrl}
          alt={companyName}
          onError={(e) => {
            e.currentTarget.src = '/assets_flone/img/logo/logo.png';
          }}
        />
      </div>
    </header>
  );
};
```

### 푸터 정보 구성
```typescript
const Footer: React.FC<{ data: any }> = ({ data }) => {
  const { withcookieData } = data;
  
  // 회사 정보
  const companyInfo = {
    name: withcookieData?.skin?.extra?.company_name,
    address: withcookieData?.skin?.address,
    phone: withcookieData?.skin?.phone,
    email: withcookieData?.skin?.email,
    owner: withcookieData?.skin?.owner,
    businessNumber: withcookieData?.skin?.businessNumber,
    mailOrderCert: withcookieData?.skin?.mailOrderBusinessCertificate
  };
  
  // SNS 링크
  const snsLinks = withcookieData?.skin?.extra?.sns_banner || [
    { url: '#', text: 'Facebook', style: 'facebook' },
    { url: '#', text: 'Twitter', style: 'twitter' },
    { url: '#', text: 'Instagram', style: 'instagram' }
  ];
  
  // 로고
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  
  return (
    <footer className="footer-area">
      <div className="footer-top">
        <div className="container">
          <div className="row">
            {/* 회사 정보 */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <img 
                  src={logoUrl} 
                  alt={companyInfo.name}
                  style={{ maxHeight: '70px', marginBottom: '20px' }}
                />
                <div className="company-info">
                  <p><strong>{companyInfo.name}</strong></p>
                  {companyInfo.address && <p>주소: {companyInfo.address}</p>}
                  {companyInfo.phone && <p>전화: {companyInfo.phone}</p>}
                  {companyInfo.email && <p>이메일: {companyInfo.email}</p>}
                  {companyInfo.owner && <p>대표: {companyInfo.owner}</p>}
                  {companyInfo.businessNumber && <p>사업자등록번호: {companyInfo.businessNumber}</p>}
                  {companyInfo.mailOrderCert && <p>통신판매업신고번호: {companyInfo.mailOrderCert}</p>}
                </div>
              </div>
            </div>
            
            {/* SNS 링크 */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-widget">
                <h4>소셜 미디어</h4>
                <div className="social-links">
                  {snsLinks.map((sns, index) => (
                    <a 
                      key={index}
                      href={sns.url}
                      className={`social-link ${sns.style}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sns.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 저작권 */}
            <div className="col-lg-4 col-md-12">
              <div className="footer-widget">
                <p className="copyright">
                  © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

### 테마 색상 시스템
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data }) => {
  const { withcookieData } = data;
  
  // 테마 색상 가져오기
  const theme = withcookieData?.skin?.theme || {};
  const colorSet = theme?.colorset || {};
  
  const colors = {
    primary: colorSet?.primary || "#181B42",
    secondary: colorSet?.secondary || "#313AB9", 
    tertiary: colorSet?.tertiary || ""
  };
  
  // CSS 변수 동적 설정
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    if (colors.tertiary) {
      root.style.setProperty('--tertiary-color', colors.tertiary);
    }
  }, [colors]);
  
  return (
    <div style={{ '--theme-primary': colors.primary } as React.CSSProperties}>
      {/* 컴포넌트 내용 */}
    </div>
  );
};
```

### SEO 메타 정보 활용
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data }) => {
  const { withcookieData } = data;
  
  const seoData = {
    title: withcookieData?.skin?.headTitle,
    description: withcookieData?.skin?.headDescription,
    keywords: withcookieData?.skin?.headKeywords,
    ogImage: withcookieData?.skin?.headOgImage
  };
  
  useEffect(() => {
    // 동적 메타 태그 설정
    if (seoData.title) {
      document.title = seoData.title;
    }
    
    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    if (seoData.description) setMetaTag('description', seoData.description);
    if (seoData.keywords) setMetaTag('keywords', seoData.keywords);
    if (seoData.ogImage) setMetaTag('og:image', seoData.ogImage);
  }, [seoData]);
};
```

### 쇼핑몰 기능 통합
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, actions }) => {
  const { cartItems, companyIsUse, withcookieData } = data;
  
  // 쇼핑몰 기능 사용 여부
  const useShop = withcookieData?.skin?.company?.useShop && companyIsUse;
  const cartCount = cartItems?.length || 0;
  
  return (
    <header>
      {/* 일반 메뉴 */}
      <nav>...</nav>
      
      {/* 쇼핑몰 기능이 활성화된 경우에만 표시 */}
      {useShop && (
        <div className="header-actions">
          <button className="cart-trigger">
            <i className="cart-icon" />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
```

### 다국어 지원
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data, utils }) => {
  const { currentLanguage, translations } = data;
  
  // 번역 함수
  const t = (key: string) => {
    return translations?.[key] || key;
  };
  
  return (
    <nav>
      <a href="/">{t('home')}</a>
      <a href="/products">{t('products')}</a>
      <a href="/contact">{t('contact')}</a>
      
      {/* 언어 선택기 */}
      <div className="language-selector">
        <select 
          value={currentLanguage} 
          onChange={(e) => utils.changeLanguage(e.target.value)}
        >
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </div>
    </nav>
  );
};
```

## 🎨 빠른 커스터마이징

### 색상 변경 (src/styles/main.scss)
```scss
:root {
  --primary-color: #ff6b6b;    // 빨간색
  --secondary-color: #4ecdc4;  // 청록색
}
```

### 헤더 높이 변경
```scss
.custom-skin-header {
  height: 80px;  // 원하는 높이
}
```

### 폰트 변경
```scss
:root {
  --font-family: 'Noto Sans KR', sans-serif;
}
```

## 🚨 문제 해결 1초 진단

| 증상 | 원인 | 해결 |
|------|------|------|
| 스킨이 안 보임 | URL 틀림 | Network 탭에서 404 확인 |
| "not defined" 에러 | globalName 불일치 | 3곳 이름 확인 |
| 스타일 안 먹힘 | CSS 미로드 | cssUrls 경로 확인 |
| CORS 에러 | 로컬 파일 직접 열기 | 서버 통해서 접근 |
| 페이지 내용 안 보임 | children 위치 틀림 | `{layout.children}` 확인 |
| "undefined" 에러 | props 구조 틀림 | ExternalSkinProps 사용 |

## 📋 완전한 데이터 활용 체크리스트

### ✅ 기본 구조
```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ 
  data, 
  actions, 
  utils, 
  layout, 
  theme 
}) => {
  // 1. ✅ 필수 데이터 구조분해
  const {
    // 인증 관련
    isUserLoggedIn,
    isAdminLoggedIn, 
    user,
    
    // 사이트 데이터
    withcookieData,
    
    // 메뉴 데이터
    menus,
    globalMenus,
    mainMenus,
    
    // 쇼핑 데이터 
    cartItems,
    companyIsUse,
    
    // 다국어
    currentLanguage,
    translations,
    
    // 비즈니스
    isBusiness
  } = data;
  
  // 2. ✅ 로고 URL 처리
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  
  // 3. ✅ 테마 색상 설정
  const colors = {
    primary: withcookieData?.skin?.theme?.colorset?.primary || "#181B42",
    secondary: withcookieData?.skin?.theme?.colorset?.secondary || "#313AB9",
    tertiary: withcookieData?.skin?.theme?.colorset?.tertiary || ""
  };
  
  // 4. ✅ 회사 정보
  const companyInfo = {
    name: withcookieData?.skin?.extra?.company_name,
    address: withcookieData?.skin?.address,
    phone: withcookieData?.skin?.phone,
    email: withcookieData?.skin?.email,
    owner: withcookieData?.skin?.owner,
    businessNumber: withcookieData?.skin?.businessNumber,
    mailOrderCert: withcookieData?.skin?.mailOrderBusinessCertificate
  };
  
  // 5. ✅ 쇼핑몰 기능 체크
  const useShop = withcookieData?.skin?.company?.useShop && companyIsUse;
  
  // 6. ✅ 번역 함수
  const t = (key: string) => translations?.[key] || key;
  
  // 7. ✅ 로그인 상태 통합
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  return (
    <div>
      {layout.showHeader && (
        <Header 
          logoUrl={logoUrl}
          companyName={companyInfo.name}
          menus={menus}
          isLoggedIn={isLoggedIn}
          user={user}
          cartItems={cartItems}
          useShop={useShop}
          translations={t}
          onLogout={actions.onLogout}
        />
      )}
      
      {/* ✅ 컨텐츠 영역 */}
      <main>
        {layout.children}
      </main>
      
      {layout.showFooter && (
        <Footer 
          logoUrl={logoUrl}
          companyInfo={companyInfo}
          snsLinks={withcookieData?.skin?.extra?.sns_banner}
          translations={t}
        />
      )}
    </div>
  );
};

// ✅ UMD export
window.MySkin = MySkin;
```

### 🔍 데이터 활용 필수 항목

| 항목 | 데이터 경로 | 필수도 | 설명 |
|------|-------------|--------|------|
| **로고 이미지** | `withcookieData.skin.theme.main_logo_url` | ⭐⭐⭐ | 기본 로고, 에러 핸들링 필수 |
| **회사명** | `withcookieData.skin.extra.company_name` | ⭐⭐⭐ | 브랜딩의 핵심 |
| **테마 색상** | `withcookieData.skin.theme.colorset` | ⭐⭐⭐ | primary, secondary, tertiary |
| **로그인 상태** | `isUserLoggedIn`, `isAdminLoggedIn` | ⭐⭐⭐ | 메뉴 조건부 표시 |
| **사용자 정보** | `user` (id, name, email, avatar) | ⭐⭐ | 로그인 시 표시 |
| **메뉴 데이터** | `menus`, `mainMenus`, `globalMenus` | ⭐⭐⭐ | 네비게이션 구성 |
| **회사 정보** | `withcookieData.skin.address/phone/email` | ⭐⭐ | 푸터 정보 |
| **쇼핑카트** | `cartItems`, `companyIsUse` | ⭐⭐ | 쇼핑몰 기능 |
| **다국어** | `currentLanguage`, `translations` | ⭐ | 국제화 지원 |
| **SNS 링크** | `withcookieData.skin.extra.sns_banner` | ⭐ | 소셜 미디어 |
| **SEO 정보** | `withcookieData.skin.headTitle/Description` | ⭐ | 검색엔진 최적화 |
| **비즈니스 여부** | `isBusiness` | ⭐ | B2B 기능 |

### 🚨 놓치기 쉬운 중요 사항

1. **로고 에러 핸들링**
   ```typescript
   <img 
     src={logoUrl}
     onError={(e) => {
       e.currentTarget.src = '/assets_flone/img/logo/logo.png';
     }}
   />
   ```

2. **메뉴 필터링 로직**
   ```typescript
   const visibleMenus = menus.filter(menu => {
     if (menu.is_logged && !isLoggedIn) return false;
     if (menu.is_not_logged && isLoggedIn) return false;
     return menu.visible;
   });
   ```

3. **CSS 변수 동적 설정**
   ```typescript
   useEffect(() => {
     document.documentElement.style.setProperty('--primary-color', colors.primary);
   }, [colors]);
   ```

4. **회사별 로고 분기 처리**
   ```typescript
   const companySettings = withcookieData?.skin?.company?.companySettingJson;
   if (companySettings?.logo_url_logged && isLoggedIn) {
     logoUrl = companySettings.logo_url_logged;
   }
   ```

### 📱 반응형 고려사항

- **로고 크기**: 모바일 70px, 데스크톱 90px
- **메뉴 토글**: 모바일에서 햄버거 메뉴 필요
- **카트 표시**: 모바일에서 간소화된 아이콘
- **푸터 레이아웃**: 모바일에서 세로 정렬

## 🎯 완전한 실전 예제 - flone 수준 메뉴 구현

### 고급 네비게이션 컴포넌트

```typescript
import { useState, useEffect } from 'react';

const AdvancedNavigation = ({ data, utils, actions }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { menus, globalMenus, mainMenus, isUserLoggedIn, isAdminLoggedIn, isBusiness, user } = data;
  const { navigate, location } = utils;
  
  const isLoggedIn = isUserLoggedIn || isAdminLoggedIn;
  
  // 메뉴 데이터 통합 및 필터링
  const getAllMenus = () => {
    const allMenus = menus?.length > 0 ? menus : [...(globalMenus || []), ...(mainMenus || [])];
    
    return allMenus
      .filter(menu => {
        if (!menu.visible) return false;
        if (menu.is_logged && !isLoggedIn) return false;
        if (menu.is_not_logged && isLoggedIn) return false;
        if (menu.is_business_only && (!isLoggedIn || !isBusiness)) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  };
  
  // 현재 페이지 활성화 체크 (고급 매칭)
  const isActiveMenu = (menu) => {
    const currentPath = location.pathname;
    
    // 정확 매칭
    if (menu.url === currentPath) return true;
    
    // 동적 라우트 매칭 (/product/:id)
    if (menu.url.includes(':')) {
      const pattern = menu.url.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(currentPath);
    }
    
    // 하위 경로 매칭
    if (menu.url !== '/' && currentPath.startsWith(menu.url + '/')) return true;
    
    return false;
  };
  
  // 메뉴 클릭 핸들러 (고급 기능)
  const handleMenuClick = (menu, e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // 모바일 메뉴 닫기
    
    // 특수 액션 처리
    if (menu.menuAction) {
      switch (menu.menuAction) {
        case 'logout':
          actions?.onLogout?.();
          return;
        case 'login':
          navigate('/login');
          return;
        case 'mypage':
          navigate('/mypage');
          return;
        case 'cart':
          navigate('/cart');
          return;
        default:
          console.log('Unknown menu action:', menu.menuAction);
      }
    }
    
    // 외부 링크
    if (menu.url.startsWith('http://') || menu.url.startsWith('https://')) {
      window.open(menu.url, menu.target || '_blank');
      return;
    }
    
    // 앵커 링크 (#section)
    if (menu.url.startsWith('#')) {
      const element = document.getElementById(menu.url.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    // 일반 페이지 이동
    navigate(menu.url);
  };
  
  // 서브메뉴 렌더링
  const renderSubMenu = (children) => (
    <ul className="sub-menu">
      {children.filter(submenu => submenu.visible).map(submenu => (
        <li key={submenu.id}>
          <a
            href={submenu.url}
            className={isActiveMenu(submenu) ? 'active' : ''}
            onClick={(e) => handleMenuClick(submenu, e)}
          >
            {submenu.name}
          </a>
        </li>
      ))}
    </ul>
  );
  
  // 메인 메뉴 렌더링
  const renderMainMenu = (menu) => (
    <li key={menu.id} className={`nav-item ${isActiveMenu(menu) ? 'active' : ''} ${menu.children?.length ? 'has-submenu' : ''}`}>
      <a
        href={menu.url}
        className="nav-link"
        onClick={(e) => handleMenuClick(menu, e)}
      >
        {menu.name}
        {menu.children?.length > 0 && <i className="dropdown-icon" />}
      </a>
      {menu.children && menu.children.length > 0 && renderSubMenu(menu.children)}
    </li>
  );
  
  const visibleMenus = getAllMenus();
  
  return (
    <nav className="advanced-navigation">
      {/* 데스크톱 메뉴 */}
      <ul className="nav-menu desktop-menu">
        {visibleMenus.map(menu => renderMainMenu(menu))}
      </ul>
      
      {/* 모바일 햄버거 버튼 */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      {/* 모바일 메뉴 */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="nav-menu">
          {visibleMenus.map(menu => renderMainMenu(menu))}
        </ul>
        
        {/* 모바일 사용자 정보 */}
        <div className="mobile-user-info">
          {isLoggedIn ? (
            <>
              <div className="user-profile">
                <img src={user?.avatar || '/default-avatar.png'} alt="프로필" />
                <span>{user?.name}</span>
              </div>
              <button onClick={actions?.onLogout} className="logout-btn">
                로그아웃
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="login-btn">
              로그인
            </button>
          )}
        </div>
      </div>
      
      {/* 모바일 메뉴 오버레이 */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};
```

### 완전한 스킨 (모든 기능 통합)

```typescript
const CompleteSkin = ({ data, actions, utils, layout, theme }) => {
  const { withcookieData, cartItems, companyIsUse } = data;
  
  // 동적 테마 색상 적용
  useEffect(() => {
    const colors = withcookieData?.skin?.theme?.colorset || {};
    const root = document.documentElement;
    
    if (colors.primary) root.style.setProperty('--primary-color', colors.primary);
    if (colors.secondary) root.style.setProperty('--secondary-color', colors.secondary);
    if (colors.tertiary) root.style.setProperty('--tertiary-color', colors.tertiary);
  }, [withcookieData]);
  
  // 로고 처리 (에러 핸들링 포함)
  const logoUrl = withcookieData?.skin?.theme?.main_logo_url || '/assets_flone/img/logo/logo.png';
  const companyName = withcookieData?.skin?.extra?.company_name || '회사명';
  
  // 쇼핑카트 표시 여부
  const showCart = withcookieData?.skin?.company?.useShop && companyIsUse;
  const cartCount = cartItems?.length || 0;
  
  return (
    <div className="complete-skin">
      <header className="skin-header">
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
          
          {/* 메인 네비게이션 */}
          <AdvancedNavigation data={data} utils={utils} actions={actions} />
          
          {/* 헤더 액션 영역 */}
          <div className="header-actions">
            {showCart && (
              <button 
                className="cart-button"
                onClick={() => utils.navigate('/cart')}
              >
                <i className="cart-icon" />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* 브레드크럼 (선택적) */}
      {layout.breadcrumbs?.length > 0 && (
        <nav className="breadcrumb">
          <div className="container">
            {layout.breadcrumbs.map((crumb, index) => (
              <span key={index}>
                {index > 0 && <span className="separator"> / </span>}
                {crumb.url ? (
                  <a onClick={() => utils.navigate(crumb.url)}>{crumb.name}</a>
                ) : (
                  <span className="current">{crumb.name}</span>
                )}
              </span>
            ))}
          </div>
        </nav>
      )}
      
      {/* 메인 컨텐츠 */}
      <main className="main-content">
        {layout.children}
      </main>
      
      {/* 푸터 */}
      <footer className="skin-footer">
        <div className="container">
          <div className="footer-content">
            <div className="company-info">
              <img src={logoUrl} alt={companyName} className="footer-logo" />
              <p>{withcookieData?.skin?.address}</p>
              <p>전화: {withcookieData?.skin?.phone}</p>
              <p>이메일: {withcookieData?.skin?.email}</p>
            </div>
            <div className="footer-links">
              <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// UMD 글로벌 등록
window.CompleteSkin = CompleteSkin;
```

### 스타일링 (CSS)

```scss
.complete-skin {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  
  .skin-header {
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    
    .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .logo-area img {
      max-height: 60px;
    }
  }
  
  .advanced-navigation {
    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      
      .nav-item {
        position: relative;
        
        &.has-submenu:hover .sub-menu {
          display: block;
        }
        
        &.active > .nav-link {
          color: var(--primary-color);
        }
      }
      
      .nav-link {
        display: block;
        padding: 15px 20px;
        text-decoration: none;
        color: #333;
        transition: color 0.3s;
        
        &:hover {
          color: var(--primary-color);
        }
      }
      
      .sub-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        min-width: 200px;
        z-index: 1000;
        
        li a {
          padding: 10px 15px;
          border-bottom: 1px solid #eee;
          
          &:hover {
            background: #f8f9fa;
          }
        }
      }
    }
    
    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      
      span {
        width: 25px;
        height: 3px;
        background: #333;
        margin: 3px 0;
        transition: 0.3s;
      }
    }
    
    .mobile-menu {
      display: none;
      position: fixed;
      top: 0;
      right: -300px;
      width: 300px;
      height: 100vh;
      background: white;
      box-shadow: -2px 0 8px rgba(0,0,0,0.1);
      transition: right 0.3s;
      z-index: 2000;
      
      &.open {
        right: 0;
      }
    }
    
    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1500;
    }
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    
    .cart-button {
      position: relative;
      background: none;
      border: none;
      cursor: pointer;
      padding: 10px;
      
      .cart-count {
        position: absolute;
        top: 0;
        right: 0;
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
  
  .breadcrumb {
    background: #f8f9fa;
    padding: 10px 0;
    
    .separator {
      color: #6c757d;
    }
    
    a {
      color: var(--primary-color);
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .current {
      color: #6c757d;
    }
  }
  
  @media (max-width: 768px) {
    .advanced-navigation {
      .desktop-menu {
        display: none;
      }
      
      .mobile-menu-toggle {
        display: flex;
      }
      
      .mobile-menu {
        display: block;
      }
    }
    
    .skin-header .container {
      padding: 0 15px;
    }
    
    .logo-area img {
      max-height: 40px;
    }
  }
}
```

---

## 🔧 navigation 데이터 활용하기

`data.navigation`은 이미 계층 구조로 변환되고 클릭 핸들러가 포함된 메뉴 데이터입니다:

```typescript
const MySkin: React.FC<ExternalSkinProps> = ({ data }) => {
  const { navigation } = data; // 바로 사용 가능!
  
  return (
    <nav>
      {navigation.map(item => (
        <li key={item.id}>
          {/* onClick 핸들러가 이미 포함되어 있음 */}
          <a onClick={item.onClick}>{item.label}</a>
          
          {/* 하위 메뉴도 동일하게 처리 */}
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

### navigation vs menus 차이점

| 구분 | menus | navigation |
|------|-------|------------|
| 구조 | 평면적 배열 | 계층적 트리 구조 |
| 클릭 핸들러 | 없음 | `onClick` 포함 |
| 필터링 | 직접 구현 필요 | 이미 필터링됨 |
| 사용성 | 커스터마이징 필요 | 바로 사용 가능 |

## 🐛 디버깅 팁

### 콘솔에서 확인할 수 있는 정보

```javascript
// 스킨 로딩 과정
console.log('🚀 UMD 스크립트 로드 시작:', url);
console.log('🎯 예상 전역 변수명:', globalName);
console.log('✅ 컴포넌트 발견:', foundComponent);

// 메뉴 데이터 확인
console.log('🔍 최종 메뉴 데이터:', menus);
console.log('🔍 navigation 구조:', navigation);

// Props 전체 확인
console.log('Props:', { data, actions, utils, layout, theme });
```

### 자주 발생하는 문제와 해결법

#### 1. 메뉴가 표시되지 않음
```typescript
// 메뉴 데이터 확인
console.log('menus:', data.menus);
console.log('navigation:', data.navigation);

// 필터링 조건 확인
console.log('isLoggedIn:', data.isUserLoggedIn || data.isAdminLoggedIn);
console.log('isBusiness:', data.isBusiness);
```

#### 2. 스킨 로딩이 느림
- 20ms 이내 로딩 시 로딩 메시지가 표시되지 않음
- CSS 로딩 실패해도 컴포넌트는 계속 로드됨
- 캐시 전략: 일반 스킨은 캐싱, 레지스트리 스킨은 항상 최신

#### 3. 전역 변수 충돌
레지스트리 스킨의 경우 자동으로 `ExternalSkin{ID}` 형식으로 변환됩니다:
```javascript
// 원본: window.ModernSkin
// 자동 변환: window.ExternalSkin123
```

## 🚀 고급 팁

### 메뉴 URL 우선순위
```javascript
const menuUrl = menu.url || menu.path || menu.link || '#';
```

### React Router 자동 통합
모든 `<a>` 태그 클릭이 자동으로 React Router로 처리됩니다:
```typescript
// 자동 처리됨
<a href="/products">상품</a>

// 수동 처리도 가능
<button onClick={() => utils.navigate('/products')}>
  상품 보기
</button>
```

### B2B 기능 정확한 구현
```typescript
const MySkin = ({ data }) => {
  const { isBusiness, companyIsUse, withcookieData } = data;
  
  // 쇼핑몰 기능 정확한 체크
  const useShop = withcookieData?.skin?.company?.useShop && companyIsUse;
  
  // B2B 전용 메뉴
  const showBusinessMenu = isBusiness && (data.isUserLoggedIn || data.isAdminLoggedIn);
  
  return (
    <>
      {showBusinessMenu && (
        <nav className="business-only">
          <a href="/business/dashboard">대시보드</a>
        </nav>
      )}
      
      {useShop && (
        <CartButton count={data.cartItems?.length || 0} />
      )}
    </>
  );
};
```

### 회사별 특수 처리
```typescript
useEffect(() => {
  const companyId = data.withcookieData?.company?.id;
  
  // 특정 회사를 위한 특수 처리
  if (companyId === 27) {
    document.documentElement.classList.add('company-27');
  }
}, [data.withcookieData]);
```

---

💡 **프로 팁**: 개발할 때는 `npm run dev` 상태로 두고, 메인 프로젝트에서 `http://localhost:3001` URL로 테스트하면 실시간 반영됩니다!