# QuickMenu 컴포넌트 스킨 API

QuickMenu 컴포넌트는 최상위 카테고리들을 원형 아이콘으로 표시하는 네비게이션 컴포넌트입니다. 카테고리별 빠른 이동과 직관적인 UI를 제공합니다.

## 📌 관련 문서

- **[QuickMenu + 상품리스트 통합 가이드](./QUICKMENU_WITH_PRODUCTS_GUIDE.md)** - 카테고리 선택 시 상품을 표시하는 확장 기능 문서

## 스킨 Props

### data

스킨에 전달되는 데이터 객체입니다.

```typescript
{
  displayItems: Array<{           // 표시할 카테고리 아이템 목록
    id: string;                   // 고유 ID ('all-category' 또는 실제 카테고리 ID)
    categoryId: number;           // 카테고리 ID (-1은 전체 카테고리)
    categoryName: string;         // 카테고리 이름
    imageUrl?: string;            // 카테고리 이미지 URL
    routingPath: string;          // 라우팅 경로 (예: '/electronics')
    visible?: boolean;            // 표시 여부 (기본값: true)
  }>;
  loading: boolean;               // 카테고리 로딩 상태
  error: string | null;           // 에러 메시지
}
```

### actions

스킨에서 사용할 수 있는 액션 함수들입니다.

```typescript
{
  handleItemClick: (item: QuickMenuItem) => void;  // 카테고리 아이템 클릭 핸들러
}
```

### options

스킨 커스터마이징 옵션입니다.

```typescript
{
  columnsPerRow?: number;                    // 한 줄에 표시할 아이템 수 (기본값: 4)
  showCategoryName?: boolean;                // 카테고리명 표시 여부 (기본값: true)
  showAllCategory?: boolean;                 // 전체 카테고리 표시 여부 (기본값: true)
  allCategoryGradientStart?: string;         // 전체 카테고리 그라데이션 시작색 (기본값: '#ff6b6b')
  allCategoryGradientEnd?: string;           // 전체 카테고리 그라데이션 끝색 (기본값: '#ee5a24')
  allCategoryTextColor?: string;             // 전체 카테고리 텍스트 색상 (기본값: '#ffffff')
  imageSize?: number;                        // 이미지 크기 px (기본값: 60)
  gap?: number;                             // 아이템 간격 px (기본값: 15)
  hoverEffect?: boolean;                    // 호버 효과 여부 (기본값: true)
}
```

### utils

유틸리티 함수들입니다.

```typescript
{
  t: (key: string) => string;           // 번역 함수
  navigate: (path: string) => void;     // 네비게이션
  formatDate: (date: string) => string; // 날짜 포맷
}
```

## 주요 기능

### 1. 카테고리 아이콘 표시
- 최상위 카테고리를 원형 아이콘으로 표시
- 카테고리 이미지가 있으면 이미지 표시, 없으면 기본 아이콘 표시
- 반응형 그리드 레이아웃 지원

### 2. 전체 카테고리 지원
- "전체" 카테고리 자동 생성 옵션
- 그라데이션 배경과 커스텀 텍스트 색상 지원
- "ALL" 텍스트로 표시

### 3. 네비게이션 기능
- 카테고리 클릭 시 해당 상품 페이지로 이동
- `/shopping/{categoryPath}` 형태의 라우팅
- 에디터 모드에서는 클릭 비활성화

### 4. 반응형 디자인
- 설정 가능한 컬럼 수
- 동적 아이템 크기 조정
- 간격 조정 가능

## 커스텀 스킨 예제


```jsx
// CustomQuickMenuSkin.jsx
import React from 'react';
import './CustomQuickMenu.css';

const CustomQuickMenuSkin = ({ data, actions, options, utils }) => {
  const { t } = utils;
  const { displayItems, loading, error } = data;
  const { handleItemClick } = actions;
  
  // 컴포넌트 설정값 추출
  const {
    columnsPerRow = 4,
    showCategoryName = true,
    showAllCategory = true,
    allCategoryGradientStart = '#ff6b6b',
    allCategoryGradientEnd = '#ee5a24',
    allCategoryTextColor = '#ffffff',
    imageSize = 60,
    gap = 15,
    hoverEffect = true
  } = options;
  
  if (loading) {
    return (
      <div className="custom-quick-menu">
        <div className="loading-spinner">
          {t('카테고리를 불러오는 중...')}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="custom-quick-menu">
        <div className="error-message">{error}</div>
      </div>
    );
  }
  
  if (!displayItems || displayItems.length === 0) {
    return (
      <div className="custom-quick-menu">
        <div className="empty-message">
          {t('표시할 카테고리가 없습니다.')}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="custom-quick-menu"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
        gap: `${gap}px`
      }}
    >
      {displayItems.map((item) => (
        <div
          key={item.id}
          className={`quick-item ${hoverEffect ? 'hover-enabled' : ''}`}
          onClick={() => handleItemClick(item)}
        >
          <div 
            className="item-icon"
            style={{ width: imageSize, height: imageSize }}
          >
            {item.id === 'all-category' ? (
              <div 
                className="all-category-icon"
                style={{
                  background: allCategoryGradientStart === allCategoryGradientEnd 
                    ? allCategoryGradientStart 
                    : `linear-gradient(45deg, ${allCategoryGradientStart}, ${allCategoryGradientEnd})`,
                  color: allCategoryTextColor
                }}
              >
                ALL
              </div>
            ) : item.imageUrl ? (
              <img 
                src={item.imageUrl} 
                alt={item.categoryName}
                className="category-image"
              />
            ) : (
              <div className="placeholder-icon">
                <i className="fas fa-folder"></i>
              </div>
            )}
          </div>
          
          {showCategoryName && (
            <div className="item-label">
              {item.categoryName}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomQuickMenuSkin;
```

## CSS 스타일 예제

```css
/* CustomQuickMenu.css */
.custom-quick-menu {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  padding: 10px;
  border-radius: 8px;
}

.quick-item.hover-enabled:hover {
  transform: translateY(-4px);
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-icon {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.all-category-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  border-radius: 50%;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.placeholder-icon {
  width: 100%;
  height: 100%;
  background: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 20px;
}

.item-label {
  text-align: center;
  font-size: 12px;
  color: #495057;
  line-height: 1.3;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading-spinner {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.error-message {
  text-align: center;
  padding: 20px;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 4px;
}

.empty-message {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .custom-quick-menu {
    padding: 15px;
    grid-template-columns: repeat(3, 1fr) !important;
  }
  
  .quick-item {
    padding: 8px;
  }
  
  .item-icon {
    width: 50px !important;
    height: 50px !important;
  }
  
  .item-label {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .custom-quick-menu {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
```

## 데이터 플로우

### 1. 초기 로드
```
1. 컴포넌트 마운트
2. Redux에서 카테고리 데이터 확인
3. 필요시 fetchProductCategories API 호출
4. 최상위 카테고리만 필터링
5. displayItems 생성
```

### 2. 아이템 표시
```
1. categoryItems 설정과 API 데이터 매칭
2. 카테고리 이름을 URL 친화적으로 변환
3. showAllCategory 설정에 따라 '전체' 아이템 추가
4. visible=false인 아이템 제외
```

### 3. 네비게이션
```
1. 카테고리 아이템 클릭
2. 에디터 모드인지 확인
3. 라우팅 경로 생성 (/shopping + routingPath)
4. navigate() 호출로 페이지 이동
5. 카테고리 상태 정보 전달
```

## 설정 예제

### 웹빌더에서 설정

#### 기본 모드 (페이지 이동)
```javascript
{
  type: 'QUICK_MENU',
  componentProps: {
    categoryItems: [
      {
        id: 'cat-1',
        categoryId: 5,
        categoryName: '전자제품',
        imageUrl: '/images/electronics.jpg',
        routingPath: '/electronics',
        visible: true
      },
      {
        id: 'cat-2', 
        categoryId: 8,
        categoryName: '의류',
        imageUrl: '/images/clothing.jpg',
        routingPath: '/clothing',
        visible: true
      }
    ],
    columnsPerRow: 4,
    showCategoryName: true,
    showAllCategory: true,
    allCategoryGradientStart: '#ff6b6b',
    allCategoryGradientEnd: '#ee5a24',
    allCategoryTextColor: '#ffffff',
    imageSize: 60,
    gap: 15,
    hoverEffect: true,
    skin: 'basic'
  }
}
```

### 외부 스킨 등록
```javascript
// 외부 스킨 파일을 별도로 준비
window.CustomQuickMenuSkin = CustomQuickMenuSkin;
```

## API 연동

### fetchProductCategories
QuickMenu는 카테고리 트리 데이터를 사용합니다:

```javascript
// API 응답 예시
{
  categories: [
    {
      id: 5,
      name: '전자제품',
      parentId: null,
      children: [...]
    },
    {
      id: 8, 
      name: '의류',
      parentId: null,
      children: [...]
    }
  ]
}
```

### 라우팅 연동
클릭 시 다음과 같이 이동합니다:
- 전체: `/shopping/all`
- 특정 카테고리: `/shopping/{categoryName}` (URL 친화적으로 변환)

## 주의사항

### 1. 카테고리 데이터
- `categoryItems` 설정과 API 데이터가 매칭되어야 함
- `categoryId`가 실제 존재하는 카테고리여야 함
- 최상위 카테고리만 표시됨 (parentId가 null인 것들)

### 2. 이미지 처리
- `imageUrl`이 없으면 기본 아이콘 표시
- 이미지는 원형으로 크롭됨
- 적절한 크기의 이미지 사용 권장

### 3. 반응형 대응
- `columnsPerRow` 설정을 모바일에서 자동 조정
- CSS 미디어 쿼리로 추가 최적화 가능

### 4. 에디터 모드
- 에디터에서는 클릭 이벤트가 비활성화됨
- 프리뷰 모드에서만 실제 네비게이션 동작

## 문제 해결

### Q: 카테고리가 표시되지 않아요
A: 다음을 확인하세요:
1. `categoryItems` 설정이 올바른지 확인
2. `categoryId`가 실제 존재하는 카테고리인지 확인  
3. Redux store에서 카테고리 데이터가 로드되었는지 확인

### Q: 이미지가 표시되지 않아요
A: `imageUrl` 경로가 올바른지 확인하고, CORS 설정을 점검하세요.

### Q: 클릭이 작동하지 않아요
A: 에디터 모드가 아닌 프리뷰/실제 페이지에서 테스트하세요.

### Q: 반응형이 작동하지 않아요
A: CSS 미디어 쿼리와 `columnsPerRow` 설정을 확인하세요.