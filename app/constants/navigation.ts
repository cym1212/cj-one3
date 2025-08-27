// 필터 옵션 인터페이스
export interface FilterOption {
    value: string;
    label: string;
}

// 필터 그룹 인터페이스
export interface FilterGroup {
    label: string;
    name: string;
    filter: FilterOption[];
}

// 필터 객체 인터페이스 (필터 그룹 배열)
export type Filters = FilterGroup[];

// 퀵 필터 인터페이스
export interface QuickFilter {
    name: string;
    label: string;
    type: 'brand' | 'benefit' | 'priceRange' | 'category' | 'delivery';
    value: string | { min: number; max: number };
}

// 4차 카테고리 인터페이스
export interface FourthCategory {
    name: string;
    label: string;
    path: string;
    filters?: Filters;
    quickFilters?: QuickFilter[];
}

// 3차 카테고리 인터페이스
export interface ThirdCategory {
    name: string;
    label: string;
    path: string;
    filters?: Filters;
    quickFilters?: QuickFilter[];
    fourthCategory?: FourthCategory[];
}

// 추천 브랜드 인터페이스
export interface RecommendedBrand {
    name: string;
    label: string;
    path: string;
    image: string;
}

// 일반 서브카테고리 인터페이스 (normal 타입용)
export interface NormalSubcategory {
    name: string;
    label: string;
    path: string;
    filters?: Filters;
    quickFilters?: QuickFilter[];
    thirdCategory: ThirdCategory[];
}

// 특별 서브카테고리 인터페이스 (special 타입용)
export interface SpecialSubcategory {
    name: string;
    label: string;
    path: string;
    image: string;
    filters?: Filters;
    quickFilters?: QuickFilter[];
    thirdCategory: ThirdCategory[];
}

export type CategoryType = 'normal' | 'special';

export interface CategoryData {
    name: string;
    label: string;
    type: CategoryType;
    image: string;
    subcategories: (NormalSubcategory | SpecialSubcategory)[];
    recommendedBrands?: RecommendedBrand[];
    quickFilters?: QuickFilter[];
}

export const CATEGORY_ITEMS: CategoryData[] = [
    {
        name: 'fashion',
        label: '패션',
        type: 'normal',
        image: '/images/icon/fashion.png',
        subcategories: [
            {
                name: 'fashion-home',
                label: '패션 홈',
                path: '/category/fashion',
                thirdCategory: [],
            },
            {
                name: 'clothing',
                label: '의류',
                path: '/category/fashion/clothing',
                filters: [
                    {
                        label: '브랜드',
                        name: 'brand',
                        filter: [
                            { value: 'nike', label: '나이키' },
                            { value: 'adidas', label: '아디다스' },
                        ],
                    },
                    {
                        label: '스타일',
                        name: 'style',
                        filter: [
                            { value: 'casual', label: '캐주얼' },
                            { value: 'formal', label: '포멀' },
                        ],
                    },
                    {
                        label: '색상',
                        name: 'color',
                        filter: [
                            { value: 'black', label: '검정' },
                            { value: 'gray', label: '회색' },
                        ],
                    },
                ],
                thirdCategory: [
                    {
                        name: 'tops',
                        label: '상의',
                        path: '/category/fashion/clothing/tops',
                        filters: [
                            {
                                label: '유형',
                                name: 'type',
                                filter: [
                                    { value: 't-shirts', label: '티셔츠' },
                                    { value: 'hoodies', label: '후드' },
                                ],
                            },
                            {
                                label: '브랜드',
                                name: 'brand',
                                filter: [
                                    { value: 'nike', label: '나이키' },
                                    { value: 'adidas', label: '아디다스' },
                                ],
                            },
                            {
                                label: '스타일',
                                name: 'style',
                                filter: [
                                    { value: 'casual', label: '캐주얼' },
                                    { value: 'formal', label: '포멀' },
                                ],
                            },
                            {
                                label: '색상',
                                name: 'color',
                                filter: [
                                    { value: 'black', label: '검정' },
                                    { value: 'gray', label: '회색' },
                                ],
                            },
                        ],
                        fourthCategory: [
                            {
                                name: 'short-sleeve',
                                label: '반팔',
                                path: '/category/fashion/clothing/tops/short-sleeve',
                            },
                            {
                                name: 'sleeveless',
                                label: '민소매',
                                path: '/category/fashion/clothing/tops/sleeveless',
                            },
                        ],
                    },
                    {
                        name: 'bottoms',
                        label: '하의',
                        path: '/category/fashion/clothing/bottoms',
                        filters: [
                            {
                                label: '유형',
                                name: 'type',
                                filter: [
                                    { value: 'jeans', label: '청바지' },
                                    { value: 'shorts', label: '반바지' },
                                ],
                            },
                            {
                                label: '브랜드',
                                name: 'brand',
                                filter: [
                                    { value: 'nike', label: '나이키' },
                                    { value: 'adidas', label: '아디다스' },
                                ],
                            },
                            {
                                label: '스타일',
                                name: 'style',
                                filter: [
                                    { value: 'casual', label: '캐주얼' },
                                    { value: 'formal', label: '포멀' },
                                ],
                            },
                            {
                                label: '색상',
                                name: 'color',
                                filter: [
                                    { value: 'black', label: '검정' },
                                    { value: 'gray', label: '회색' },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: 'shoes',
                label: '신발',
                path: '/category/fashion/shoes',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'bags',
                label: '가방',
                path: '/category/fashion/bags',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'accessories',
                label: '액세서리',
                path: '/category/fashion/accessories',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'underwear',
                label: '언더웨어',
                path: '/category/fashion/underwear',
                filters: [],
                thirdCategory: [],
            },
        ],
        recommendedBrands: [
            {
                name: 'nike',
                label: '나이키',
                path: '/brand/nike',
                image: '/images/brand/nike.png',
            },
            {
                name: 'adidas',
                label: '아디다스',
                path: '/brand/adidas',
                image: '/images/brand/adidas.png',
            },
            {
                name: 'puma',
                label: '푸마',
                path: '/brand/puma',
                image: '/images/brand/puma.png',
            },
            {
                name: 'new-balance',
                label: '뉴발란스',
                path: '/brand/new_balance',
                image: '/images/brand/new-balance.png',
            },
            {
                name: 'converse',
                label: '컨버스',
                path: '/brand/converse',
                image: '/images/brand/converse.png',
            },
            {
                name: 'vans',
                label: '반스',
                path: '/brand/vans',
                image: '/images/brand/vans.png',
            },
            {
                name: 'fila',
                label: '휠라',
                path: '/brand/fila',
                image: '/images/brand/fila.png',
            },
            {
                name: 'reebok',
                label: '리복',
                path: '/brand/reebok',
                image: '/images/brand/reebok.png',
            },
            {
                name: 'asics',
                label: '아식스',
                path: '/brand/asics',
                image: '/images/brand/asics.png',
            },
            {
                name: 'under-armour',
                label: '언더아머',
                path: '/brand/under-armour',
                image: '/images/brand/under-armour.png',
            },
        ],
    },
    {
        name: 'beauty',
        label: '뷰티',
        type: 'normal',
        image: '/images/icon/beauty.png',
        subcategories: [
            {
                name: 'beauty-home',
                label: '뷰티 홈',
                path: '/category/beauty',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'skincare',
                label: '스킨케어',
                path: '/category/beauty/skincare',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'makeup',
                label: '메이크업',
                path: '/category/beauty/makeup',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'haircare',
                label: '헤어케어',
                path: '/category/beauty/haircare',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'bodycare',
                label: '바디케어',
                path: '/category/beauty/bodycare',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'perfume',
                label: '향수',
                path: '/category/beauty/perfume',
                filters: [],
                thirdCategory: [],
            },
        ],
    },
    {
        name: 'life',
        label: '생활',
        type: 'normal',
        image: '/images/icon/life.png',
        subcategories: [
            {
                name: 'life-home',
                label: '생활 홈',
                path: '/category/life',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'kitchen',
                label: '주방용품',
                path: '/category/life/kitchen',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'daily',
                label: '생활용품',
                path: '/category/life/daily',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'interior',
                label: '인테리어',
                path: '/category/life/interior',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'bathroom',
                label: '욕실용품',
                path: '/category/life/bathroom',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'cleaning',
                label: '청소용품',
                path: '/category/life/cleaning',
                filters: [],
                thirdCategory: [],
            },
        ],
    },
    {
        name: 'digital',
        label: '디지털',
        type: 'normal',
        image: '/images/icon/digital.png',
        subcategories: [
            {
                name: 'digital-home',
                label: '디지털 홈',
                path: '/category/digital',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'mobile',
                label: '휴대폰',
                path: '/category/digital/mobile',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'computer',
                label: '컴퓨터',
                path: '/category/digital/computer',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'camera',
                label: '카메라',
                path: '/category/digital/camera',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'audio',
                label: '오디오',
                path: '/category/digital/audio',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'game',
                label: '게임',
                path: '/category/digital/game',
                filters: [],
                thirdCategory: [],
            },
        ],
    },
    {
        name: 'sports',
        label: '스포츠',
        type: 'normal',
        image: '/images/icon/sports.png',
        subcategories: [
            {
                name: 'sports-home',
                label: '스포츠 홈',
                path: '/category/sports',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'sportwear',
                label: '운동복',
                path: '/category/sports/wear',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'sport-shoes',
                label: '운동화',
                path: '/category/sports/shoes',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'fitness',
                label: '헬스용품',
                path: '/category/sports/fitness',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'outdoor',
                label: '아웃도어',
                path: '/category/sports/outdoor',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'swimming',
                label: '수영용품',
                path: '/category/sports/swimming',
                filters: [],
                thirdCategory: [],
            },
        ],
    },
    {
        name: 'food',
        label: '식품',
        type: 'normal',
        image: '/images/icon/food.png',
        subcategories: [
            {
                name: 'food-home',
                label: '식품 홈',
                path: '/category/food',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'fresh',
                label: '신선식품',
                path: '/category/food/fresh',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'processed',
                label: '가공식품',
                path: '/category/food/processed',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'beverage',
                label: '음료',
                path: '/category/food/beverage',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'health-food',
                label: '건강식품',
                path: '/category/food/health',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'convenience',
                label: '간편식',
                path: '/category/food/convenience',
                filters: [],
                thirdCategory: [],
            },
        ],
    },
    {
        name: 'specialty-shop',
        label: '테마별 라이프스타일샵',
        type: 'special',
        image: '/images/icon/life-style.png',
        subcategories: [
            {
                name: 'home-deco',
                label: '홈데코',
                path: '/specialty-shop/home-deco',
                image: '/images/specialty/home-deco.jpg',
                filters: [],
                thirdCategory: [
                    {
                        name: 'rugs',
                        label: '러그',
                        path: '/specialty-shop/home-deco/rugs',
                        filters: [],
                    },
                    {
                        name: 'lighting',
                        label: '조명',
                        path: '/specialty-shop/home-deco/lighting',
                        filters: [],
                    },
                    {
                        name: 'furniture',
                        label: '가구',
                        path: '/specialty-shop/home-deco/furniture',
                        filters: [],
                    },
                    {
                        name: 'trolley',
                        label: '트롤리',
                        path: '/specialty-shop/home-deco/trolley',
                        filters: [],
                    },
                    {
                        name: 'props',
                        label: '소품',
                        path: '/specialty-shop/home-deco/props',
                        filters: [],
                    },
                ],
            },
            {
                name: 'kitchen',
                label: '주방용품',
                path: '/specialty-shop/kitchen',
                image: '/images/specialty/kitchen.jpg',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'appliances',
                label: '가전제품',
                path: '/specialty-shop/appliances',
                image: '/images/specialty/appliances.jpg',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'pet',
                label: '반려동물',
                path: '/specialty-shop/pet',
                image: '/images/specialty/pet.jpg',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'food',
                label: '보양식',
                path: '/specialty-shop/food',
                image: '/images/specialty/food.jpg',
                filters: [],
                thirdCategory: [],
            },
            {
                name: 'camping',
                label: '캠핑용품',
                path: '/specialty-shop/camping',
                image: '/images/specialty/camping.jpg',
                filters: [],
                thirdCategory: [],
            },
        ],
    },
];

export const RECOMMENDED_BRAND_PAGE_SIZE = 8;
