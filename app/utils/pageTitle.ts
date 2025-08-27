import { CATEGORY_ITEMS } from '@/constants/navigation';
import { STATIC_ROUTE_TITLES } from '@/constants/routes';

import type { NormalSubcategory, SpecialSubcategory } from '@/constants/navigation';

/**
 * 카테고리 경로에서 실제 카테고리명을 찾는 함수
 */
function findCategoryTitle(categoryPath: string): string | null {
    // 카테고리 경로 파싱: /category/fashion/clothing/tops -> [fashion, clothing, tops]
    const pathSegments = categoryPath.replace('/category/', '').split('/').filter(Boolean);

    if (pathSegments.length === 0) return null;

    // 1차 카테고리 검색
    const mainCategory = CATEGORY_ITEMS.find((cat) => cat.name.toLowerCase() === pathSegments[0] || cat.subcategories.some((sub) => sub.path === `/category/${pathSegments[0]}`));

    if (!mainCategory) return null;

    if (pathSegments.length > 0) {
        return mainCategory.label;
    }

    /**
     * 레퍼런스 페이지 상 뎁스로 들어가도 최상위 뎁스의 타이틀을 사용하기에 아래는 현재 사용하지 않음.
     */

    // 카테고리 홈 페이지인 경우 (/category/fashion)
    if (pathSegments.length === 1) {
        const homeSubcategory = mainCategory.subcategories.find((sub) => sub.label.includes('홈') && sub.path === `/category/${pathSegments[0]}`);
        return homeSubcategory ? mainCategory.label : null;
    }

    // 2차 카테고리 검색 (/category/fashion/clothing)
    if (pathSegments.length === 2) {
        const subCategory = mainCategory.subcategories.find((sub) => sub.path === `/category/${pathSegments[0]}/${pathSegments[1]}`) as NormalSubcategory;

        return subCategory?.label || null;
    }

    // 3차 카테고리 검색 (/category/fashion/clothing/tops)
    if (pathSegments.length === 3) {
        const subCategory = mainCategory.subcategories.find((sub) => sub.path === `/category/${pathSegments[0]}/${pathSegments[1]}`) as NormalSubcategory;

        if (subCategory?.thirdCategory) {
            const thirdCategory = subCategory.thirdCategory.find((third) => third.path === `/category/${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}`);
            return thirdCategory?.label || null;
        }
    }

    return null;
}

/**
 * 스페셜샵 경로에서 스페셜샵명을 찾는 함수
 * 예) /specialty-shop/kitchen -> '주방용품'
 */
export function findSpecialtyShopTitle(pathname: string): string | null {
    if (!pathname.startsWith('/specialty-shop/')) return null;

    // type === 'special' 카테고리에서 하위 스페셜샵 경로 매칭
    const specialtyCategory = CATEGORY_ITEMS.find((cat) => cat.type === 'special');
    if (!specialtyCategory) return null;

    const match = specialtyCategory.subcategories.find((sub) => {
        const path = (sub as SpecialSubcategory).path;
        return pathname === path || pathname.startsWith(path + '/');
    }) as SpecialSubcategory | undefined;

    return match?.label ?? null;
}

/**
 * pathname을 기반으로 페이지 타이틀을 가져오는 함수
 */
export function getPageTitleByPath(pathname: string): string {
    // 우선 정적 라우트 매칭 시도 (카테고리가 아닌 경우)
    const staticTitle = Object.entries(STATIC_ROUTE_TITLES).find(([path, title]) => {
        // 정확한 경로 매칭
        if (path === pathname) {
            return title;
        }
        // 동적 라우팅 패턴 매칭 (/* 패턴)
        if (path.endsWith('/*')) {
            const basePath = path.slice(0, -2); // /* 제거
            return pathname.startsWith(basePath + '/') || pathname === basePath;
        }
    });

    if (staticTitle) {
        return staticTitle[1];
    }

    // 카테고리 페이지 처리
    if (pathname.startsWith('/category/')) {
        const categoryTitle = findCategoryTitle(pathname);
        if (categoryTitle) {
            return categoryTitle;
        }
    }

    // 스페셜샵 페이지 처리
    if (pathname.startsWith('/specialty-shop/')) {
        const specialtyTitle = findSpecialtyShopTitle(pathname);
        if (specialtyTitle) {
            return specialtyTitle;
        }
    }

    // 기타 동적 라우트 처리
    for (const route in STATIC_ROUTE_TITLES) {
        if (pathname.startsWith(route + '/')) {
            return STATIC_ROUTE_TITLES[route];
        }
    }

    // 기본값
    return 'CJ온스타일';
}
