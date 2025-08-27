# QuickMenu + 상품리스트 통합 가이드

## 개요
QuickMenu 컴포넌트의 확장 기능으로, 카테고리 선택 시 페이지 이동 없이 해당 카테고리의 상품을 즉시 표시할 수 있습니다. 

### 🆕 Skin ID 39 특별 지원
**Skin ID 39**는 자동으로 상품 표시 기능이 활성화되며, 모든 카테고리의 상품을 초기 로드 시 캐싱하여 즉각적인 반응성을 제공합니다.

## 주요 특징
- ✅ 페이지 새로고침 없이 카테고리별 상품 표시
- ✅ **Skin 39: 자동 캐싱으로 즉각적인 카테고리 전환**
- ✅ Redux를 통한 효율적인 상품 데이터 관리
- ✅ 외부 스킨에서 완전한 커스터마이징 가능

## 설정 방법

### 1. 웹빌더에서 컴포넌트 설정

#### Skin ID 39인 경우 (자동 설정)
```javascript
{
  type: 'QUICK_MENU',
  skin: '39',  // 또는 39 (숫자)
  componentProps: {
    // 기본 QuickMenu 설정만 필요
    showAllCategory: true,       // 전체 카테고리 표시
    allCategoryImageUrl: '/images/all-category.png', // 전체 카테고리 이미지 (선택)
    categoryItems: [
      // 전체 카테고리는 자동으로 추가됨 (showAllCategory가 true일 때)
      {
        id: 'cat-1',
        categoryId: 5,           
        categoryName: '전자제품',
        imageUrl: '/images/electronics.jpg',
        visible: true
      },
      {
        id: 'cat-2',
        categoryId: 8,
        categoryName: '의류',
        imageUrl: '/images/clothing.jpg',
        visible: true
      }
    ],
    maxProductsToShow: 20        // 최대 상품 수
    // enableProductDisplay는 자동으로 true 설정됨
  }
}
```

#### 다른 Skin ID인 경우 (수동 설정)
```javascript
{
  type: 'QUICK_MENU',
  skin: 'custom-skin',
  componentProps: {
    // 기본 QuickMenu 설정
    categoryItems: [...],
    
    // 🎯 확장 기능 명시적 활성화 필수!
    enableProductDisplay: true,
    
    // 확장 기능 옵션
    productsPerRow: 4,           
    showProductPrice: true,       
    maxProductsToShow: 20,        
    initialCategoryId: 5         
  }
}
```

### 2. 중요 설정 플래그

| 플래그 | 타입 | 기본값 | Skin 39 | 설명 |
|-------|------|--------|---------|------|
| **enableProductDisplay** | boolean | false | **자동 true** | 확장 기능 활성화 |
| productsPerRow | number | 4 | 4 | 한 줄에 표시할 상품 수 |
| showProductPrice | boolean | true | true | 상품 가격 표시 여부 |
| maxProductsToShow | number | 20 | 20 | 표시할 최대 상품 수 |
| initialCategoryId | number | null | null | 초기 선택 카테고리 ID |
| showAllCategory | boolean | true | true | 전체 카테고리 표시 여부 |
| allCategoryImageUrl | string | null | null | 전체 카테고리 커스텀 이미지 URL |
| onCategorySelect | function | null | null | 카테고리 선택 시 콜백 |

## 외부 스킨에서 받는 데이터

### 확장 데이터 구조
```javascript
const QuickMenuWithProductsSkin = (props) => {
  const {
    data: {
      // 기본 QuickMenu 데이터
      displayItems,           // 카테고리 목록
      topCategories,          // 최상위 카테고리
      loading,                // 카테고리 로딩 상태
      error,                  // 에러 메시지
      
      // 🎯 확장 데이터 (enableProductDisplay가 true일 때만)
      selectedCategoryId,     // 현재 선택된 카테고리 ID
      products,               // 선택된 카테고리의 상품 배열
      productsLoading,        // 상품 로딩 상태
      productsTotalCount      // 상품 총 개수
    },
    actions: {
      handleItemClick,        // 카테고리 클릭 핸들러
      fetchProducts          // 상품 로드 액션 (Skin 39는 사용 불필요)
    },
    componentData             // 컴포넌트 설정
  } = props;
};
```

### 상품 데이터 구조
```javascript
// products 배열의 각 상품 객체
{
  id: number,
  name: string,
  price: number,              // 원가
  newPrice: number,           // 판매가 (할인 적용)
  thumbnail: string,          // 상품 이미지 URL
  stockCount: number,         // 재고 수량
  hasDiscount: boolean,       // 할인 여부
  discountRate: number,       // 할인율 (%)
  description: string,        // 상품 설명
  categoryId: number,         // 카테고리 ID
  // ... 기타 상품 정보
}
```

## 구현 예제

### Skin 39 구현 (캐싱 활용)
```jsx
// Skin 39는 handleItemClick만 호출하면 됨
const Skin39QuickMenu = (props) => {
  const {
    data: { 
      displayItems, 
      products, 
      selectedCategoryId, 
      productsLoading 
    },
    actions: { handleItemClick }, // fetchProducts 직접 호출 불필요!
    componentData
  } = props;
  
  return (
    <div className="quick-menu-skin39">
      {/* 카테고리 메뉴 */}
      <div className="category-menu">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className={`category-item ${
              // 타입 변환 중요! selectedCategoryId는 number, item.categoryId도 number
              selectedCategoryId === item.categoryId ? 'active' : ''
            }`}
            onClick={() => handleItemClick(item)} // 이것만 호출!
          >
            <img src={item.imageUrl} alt={item.categoryName} />
            <span>{item.categoryName}</span>
          </div>
        ))}
      </div>
      
      {/* 상품 리스트 - 캐시된 데이터가 즉시 표시됨 */}
      <div className="product-list">
        {products && products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">
            상품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};
```

### 일반 Skin 구현 (기존 방식)
```jsx
const CustomQuickMenuSkin = (props) => {
  const {
    data: { 
      displayItems, 
      products, 
      selectedCategoryId, 
      productsLoading 
    },
    actions: { handleItemClick, fetchProducts },
    componentData
  } = props;
  
  const { componentProps = {} } = componentData;
  const { enableProductDisplay = false } = componentProps;
  
  // enableProductDisplay가 false면 기본 동작
  if (!enableProductDisplay) {
    return <BasicQuickMenuSkin {...props} />;
  }
  
  // 카테고리 클릭 핸들러
  const onCategoryClick = (item) => {
    handleItemClick(item);
    
    // 일반 스킨은 필요시 fetchProducts 직접 호출 가능
    if (fetchProducts) {
      fetchProducts({
        include_category_ids: [item.categoryId],
        per_page: 20
      });
    }
  };
  
  return (
    <div className="custom-quick-menu">
      {/* 구현 내용 */}
    </div>
  );
};
```

## API 호출 및 동작 흐름

### Redux 액션: fetchProducts

#### ⚠️ 중요: API 파라미터 변경
```javascript
// ✅ 올바른 사용법 - include_category_ids 배열 사용
dispatch(fetchProducts({ 
  include_category_ids: [categoryId],  // 배열로 전달!
  per_page: maxProductsToShow
}));

// ❌ 잘못된 사용법 - category_id는 지원하지 않음
dispatch(fetchProducts({ 
  category_id: categoryId,  // 작동하지 않음!
  per_page: maxProductsToShow
}));
```

#### fetchProducts 파라미터

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| **include_category_ids** | number[] | 포함할 카테고리 ID 배열 |
| per_page | number | 페이지당 상품 수 (기본값: 20) |
| page | number | 페이지 번호 (기본값: 1) |
| include_product_ids | number[] | 포함할 상품 ID 목록 |
| exclude_product_ids | number[] | 제외할 상품 ID 목록 |
| exclude_category_ids | number[] | 제외할 카테고리 ID 배열 |

### Skin 39 동작 흐름 (캐싱)

#### 1. 초기 로드 (자동)
```
1. 컴포넌트 마운트
2. Skin 39 감지 → enableProductDisplay 자동 true
3. 모든 카테고리 상품 병렬 로드 (fetchProductsForAllCategories)
4. Redux productsByCategory에 카테고리별로 캐싱
5. 초기 화면 표시 (로딩 없이 즉시 표시)
```

#### 2. 카테고리 선택
```
1. 사용자가 카테고리 클릭
2. handleItemClick(item) 호출
3. 캐시된 데이터 확인 (productsByCategory[categoryId])
4. 캐시 존재 → Redux 상태만 업데이트 (API 호출 없음!)
5. 상품 즉시 표시 (깜빡임 없음)
```

### 일반 Skin 동작 흐름

#### 1. 초기 로드
```
1. 컴포넌트 마운트
2. enableProductDisplay 체크 (수동 설정 필요)
3. initialCategoryId가 있으면 해당 카테고리 상품 로드
4. 없으면 빈 상태로 대기
```

#### 2. 카테고리 선택
```
1. 사용자가 카테고리 클릭
2. handleItemClick(item) 호출
3. API 호출 (fetchProducts)
4. 로딩 표시
5. 응답 후 상품 표시
```

## 성능 최적화

### Skin 39 최적화 (자동 적용)
- **병렬 로드**: 초기에 모든 카테고리 동시 로드 (최대 5개씩 배치)
- **캐싱**: Redux Store에 카테고리별 저장
- **즉각 반응**: 클릭 시 API 호출 없이 캐시 사용
- **메모리 효율**: 카테고리별 최대 상품 수 제한 (maxProductsToShow)

### 이미지 최적화
```jsx
<img 
  src={product.thumbnail} 
  loading="lazy"
  alt={product.name}
  onError={(e) => {
    e.target.src = '/placeholder.jpg';
  }}
/>
```

### 메모이제이션
```jsx
const MemoizedProductCard = React.memo(ProductCard, (prev, next) => {
  return prev.product.id === next.product.id && 
         prev.showPrice === next.showPrice;
});
```

## 주의사항

### ⚠️ Skin 39 사용 시
1. **fetchProducts 직접 호출 금지**: handleItemClick만 사용
2. **초기 로드 불필요**: 웹빌더가 자동으로 처리
3. **캐싱 의존**: 캐시가 없으면 fallback으로 API 호출
4. **초기 렌더링**: 첫 번째 카테고리가 자동 선택되고 상품이 표시됨
5. **로딩 상태**: productsLoading은 항상 false (캐싱 사용)

### ⚠️ 일반 Skin 사용 시
1. **enableProductDisplay 필수**: 명시적으로 true 설정
2. **API 파라미터**: include_category_ids 배열 사용
3. **로딩 처리**: productsLoading 상태 확인

### 🚫 하지 말아야 할 것
- category_id 파라미터 사용 (include_category_ids 사용)
- Skin 39에서 fetchProducts 직접 호출
- 로딩 상태 무시
- 에러 처리 생략

## 문제 해결

### 카테고리 필터링이 안 되는 경우

체크리스트:

1. **API 파라미터 확인**
   - ✅ 올바른: `include_category_ids: [categoryId]`
   - ❌ 잘못된: `category_id: categoryId`

2. **Skin 39인 경우**
   - `handleItemClick`만 호출하는지 확인
   - `fetchProducts` 직접 호출 제거

3. **네트워크 탭에서 API 요청 확인**
   - Request Body에 `include_category_ids` 있는지 확인
   
4. **타입 확인**
   - `selectedCategoryId`는 number 타입
   - 스킨에서 문자열로 변환하지 않도록 주의

### 초기 로드가 느린 경우 (Skin 39)
```javascript
// 캐싱 상태 확인
console.log('📦 캐시 상태:', {
  캐시된_카테고리: Object.keys(productsByCategory),
  모든_카테고리_로드_완료: allCategoriesLoaded
});
```

### API 호출이 중복되는 경우
```javascript
// Skin 39: 초기 로드 useEffect 제거
// 외부 스킨에서 이 부분 제거:
useEffect(() => {
  if (actions?.fetchProducts) {
    actions.fetchProducts({...}); // 제거!
  }
}, []);
```

## 테스트 체크리스트

### Skin 39
- [ ] 컴포넌트 마운트 시 모든 카테고리 API 병렬 호출
- [ ] 카테고리 클릭 시 API 호출 없음
- [ ] 즉각적인 상품 전환 (깜빡임 없음)
- [ ] 콘솔에 캐시 상태 로그 확인

### 일반 Skin
- [ ] enableProductDisplay: true 설정
- [ ] include_category_ids 파라미터 사용
- [ ] 카테고리 클릭 시 상품 로드
- [ ] 로딩 상태 UI 표시

## 관련 파일
- `/src/components/module/QuickMenu/QuickMenuLogic.ts` - 확장 기능 및 Skin 39 캐싱 로직
- `/src/components/module/QuickMenu/QuickMenu.types.ts` - 확장된 타입 정의
- `/src/redux/WithcookieSlice.ts` - fetchProducts 액션 및 캐싱 시스템
- `/src/components/module/QuickMenu/QuickMenuSkinnable.tsx` - Skin 39 기본 설정