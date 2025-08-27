import { CATEGORY_ITEMS } from '@/constants/navigation';
import type { NormalSubcategory, SpecialSubcategory, ThirdCategory, FourthCategory } from '@/constants/navigation';

// 네비게이션 아이템 인터페이스 (현재 프로젝트용)
interface NavItem {
    path: string;
    label: string;
    id: string;
    children?: NavItem[];
}

// 계층 구조 아이템 인터페이스
interface HierarchyItem {
    path: string;
    label: string;
    id: string;
}

/**
 * 특정 카테고리의 모든 하위 경로를 재귀적으로 가져오는 유틸리티 함수 (평면화)
 *
 * @param categoryName - 카테고리 이름 (예: '패션')
 * @returns 모든 하위 경로 배열 (평면화된)
 */
export function getAllSubRoutes(categoryName?: string): Array<{ path: string; label: string; id: string }> {
    const result: Array<{ path: string; label: string; id: string }> = [];

    // 특정 카테고리가 지정된 경우
    if (categoryName) {
        const category = CATEGORY_ITEMS.find((cat) => cat.name === categoryName);
        if (!category) return [];

        // 서브카테고리 추가
        category.subcategories.forEach((sub) => {
            result.push({
                path: sub.path,
                label: sub.label,
                id: sub.path.split('/').pop() || '',
            });

            // 3차 카테고리 추가 (normal 타입인 경우)
            if ('thirdCategory' in sub && sub.thirdCategory) {
                sub.thirdCategory.forEach((third) => {
                    result.push({
                        path: third.path,
                        label: third.label,
                        id: third.path.split('/').pop() || '',
                    });
                });
            }
        });
    } else {
        // 모든 카테고리의 전체 경로 반환
        CATEGORY_ITEMS.forEach((category) => {
            // 메인 카테고리 추가
            result.push({
                path: `/category/${category.name.toLowerCase()}`,
                label: category.label,
                id: category.name.toLowerCase(),
            });

            // 서브카테고리 추가
            category.subcategories.forEach((sub) => {
                result.push({
                    path: sub.path,
                    label: sub.label,
                    id: sub.path.split('/').pop() || '',
                });

                // 3차 카테고리 추가 (normal 타입인 경우)
                if ('thirdCategory' in sub && sub.thirdCategory) {
                    sub.thirdCategory.forEach((third) => {
                        result.push({
                            path: third.path,
                            label: third.label,
                            id: third.path.split('/').pop() || '',
                        });
                    });
                }
            });
        });
    }

    return result;
}

/**
 * 경로의 깊이를 계산하는 유틸리티 함수
 *
 * @param path - 경로 (예: '/shop/kitchen-dining/bowls')
 * @returns 경로 깊이 (예: 3)
 */
export function getPathDepth(path: string): number {
    return path.split('/').filter((segment) => segment.length > 0).length;
}

/**
 * 부모 경로를 가져오는 유틸리티 함수
 *
 * @param path - 현재 경로 (예: '/shop/kitchen-dining/bowls')
 * @returns 부모 경로 (예: '/shop/kitchen-dining')
 */
export function getParentPath(path: string): string {
    const segments = path.split('/').filter((segment) => segment.length > 0);
    if (segments.length <= 1) return '/';

    return '/' + segments.slice(0, -1).join('/');
}

/**
 * 특정 카테고리 경로의 전체 계층 구조(breadcrumb)를 가져오는 유틸리티 함수
 *
 * @param targetPath - 대상 경로 (예: '/category/fashion/clothing/tops')
 * @returns 계층 구조 배열 (루트부터 현재 경로까지)
 */
export function getPathHierarchy(targetPath: string): HierarchyItem[] {
    const hierarchy: HierarchyItem[] = [];

    // 카테고리 경로가 아닌 경우 빈 배열 반환
    if (!targetPath.startsWith('/category/')) {
        return [];
    }

    // 경로 파싱: /category/fashion/clothing/tops -> [fashion, clothing, tops]
    const pathSegments = targetPath.replace('/category/', '').split('/').filter(Boolean);

    if (pathSegments.length === 0) {
        return [{ path: '/category', label: '카테고리', id: 'category' }];
    }

    // 루트 추가
    hierarchy.push({ path: '/category', label: '카테고리', id: 'category' });

    // 1차 카테고리 찾기
    const mainCategory = CATEGORY_ITEMS.find((cat) => cat.subcategories.some((sub) => sub.path.includes(pathSegments[0])) || cat.name.toLowerCase() === pathSegments[0]);

    if (mainCategory) {
        hierarchy.push({
            path: `/category/${pathSegments[0]}`,
            label: mainCategory.label,
            id: pathSegments[0],
        });

        // 2차 카테고리 찾기
        if (pathSegments.length >= 2) {
            const subCategory = mainCategory.subcategories.find((sub) => sub.path === `/category/${pathSegments[0]}/${pathSegments[1]}`);

            if (subCategory) {
                hierarchy.push({
                    path: subCategory.path,
                    label: subCategory.label,
                    id: pathSegments[1],
                });

                // 3차 카테고리 찾기
                if (pathSegments.length >= 3 && 'thirdCategory' in subCategory && subCategory.thirdCategory) {
                    const thirdPath = `/category/${pathSegments[0]}/${pathSegments[1]}/${pathSegments[2]}`;
                    const thirdCategory = subCategory.thirdCategory.find((third) => third.path === thirdPath);

                    if (thirdCategory) {
                        hierarchy.push({
                            path: thirdCategory.path,
                            label: thirdCategory.label,
                            id: pathSegments[2],
                        });
                    }
                }
            }
        }
    }

    return hierarchy;
}

/**
 * 경로가 특정 카테고리의 하위 경로인지 확인하는 유틸리티 함수
 *
 * @param currentPath - 현재 경로
 * @param categoryPath - 카테고리 경로
 * @returns 하위 경로 여부
 */
export function isSubPathOf(currentPath: string, categoryPath: string): boolean {
    const hierarchy = getPathHierarchy(currentPath);
    return hierarchy.some((item) => item.path === categoryPath);
}

/**
 * 카테고리 이름을 기반으로 카테고리 데이터를 가져오는 유틸리티 함수
 *
 * @param categoryName - 카테고리 이름 (예: '패션')
 * @returns 카테고리 데이터 또는 null
 */
export function getCategoryByName(categoryName: string) {
    return CATEGORY_ITEMS.find((cat) => cat.name === categoryName) || null;
}

/**
 * 경로를 기반으로 카테고리 데이터를 가져오는 유틸리티 함수
 *
 * @param path - 카테고리 경로 (예: '/category/fashion')
 * @returns 카테고리 데이터 또는 null
 */
export function getCategoryByPath(path: string) {
    if (!path.startsWith('/category/')) return null;

    return CATEGORY_ITEMS.find((cat) => cat.subcategories.some((sub) => path.startsWith(sub.path))) || null;
}

/**
 * 서브카테고리 경로를 기반으로 서브카테고리 데이터를 가져오는 유틸리티 함수
 *
 * @param path - 서브카테고리 경로 (예: '/category/fashion/clothing')
 * @returns 서브카테고리 데이터 또는 null
 */
export function getSubcategoryByPath(path: string) {
    if (!path.startsWith('/category/')) return null;

    for (const category of CATEGORY_ITEMS) {
        const subcategory = category.subcategories.find((sub) => sub.path === path);
        if (subcategory) {
            return subcategory;
        }
    }

    return null;
}

/**
 * 주어진 카테고리 경로의 하위 카테고리 목록을 반환합니다.
 * - 1뎁스(/category/:main) → 해당 카테고리의 subcategories
 * - 2뎁스(/category/:main/:sub) → 해당 서브카테고리의 thirdCategory
 * - 3뎁스(/category/:main/:sub/:third) → 해당 thirdCategory의 fourthCategory
 * - 그 외/없음 → []
 */
export function getChildCategoriesByPath(path: string): Array<NormalSubcategory | SpecialSubcategory | ThirdCategory | FourthCategory> {
    if (!path.startsWith('/category/')) return [];

    const segments = path.replace('/category/', '').split('/').filter(Boolean);
    if (segments.length === 0) return [];

    const main = segments[0];
    const category = CATEGORY_ITEMS.find((cat) => cat.name === main);
    if (!category) return [];

    // 1뎁스: 카테고리 홈 → 서브카테고리 반환 (하위가 없어도 동일 레벨의 목록을 반환)
    if (segments.length === 1) {
        return category.subcategories;
    }

    // 2뎁스 또는 그 이하 경로 처리
    const subPath = `/category/${segments[0]}/${segments[1]}`;
    const sub = category.subcategories.find((s) => s.path === subPath) as NormalSubcategory | undefined;

    // 서브가 없거나 normal이 아니면 동일 레벨(2뎁스) 목록 반환
    if (!sub || !('thirdCategory' in sub)) {
        return category.subcategories;
    }

    // 2뎁스: third가 있으면 third 목록, 없으면 동일 레벨(2뎁스) 목록 반환
    if (segments.length === 2) {
        return sub.thirdCategory && sub.thirdCategory.length > 0 ? sub.thirdCategory : category.subcategories;
    }

    // 3뎁스: third가 있으면 fourthCategory가 있는지 확인
    if (segments.length === 3) {
        const thirdPath = `/category/${segments[0]}/${segments[1]}/${segments[2]}`;
        const third = sub.thirdCategory?.find((t) => t.path === thirdPath);

        if (third?.fourthCategory && third.fourthCategory.length > 0) {
            return third.fourthCategory;
        }
        // fourthCategory가 없으면 동일 레벨(3뎁스) 목록 반환
        return sub.thirdCategory || [];
    }

    // 4뎁스 이상: 더 하위가 없으므로 본인이 속한 4뎁스 목록 반환
    if (segments.length >= 4) {
        const thirdPath = `/category/${segments[0]}/${segments[1]}/${segments[2]}`;
        const third = sub.thirdCategory?.find((t) => t.path === thirdPath);
        return third?.fourthCategory || [];
    }

    // 기본: 3뎁스 목록 반환
    return sub.thirdCategory || [];
}

/**
 * 현재 경로의 상위 경로를 반환하는 유틸리티 함수
 *
 * @param currentPath - 현재 경로 (예: '/category/fashion/clothing/tops')
 * @returns 상위 경로 (예: '/category/fashion/clothing')
 */
export function getParentCategoryPath(currentPath: string): string | null {
    if (!currentPath.startsWith('/category/')) return null;

    const segments = currentPath.replace('/category/', '').split('/').filter(Boolean);
    if (segments.length <= 1) return null;

    // 상위 경로 생성
    const parentSegments = segments.slice(0, -1);
    return `/category/${parentSegments.join('/')}`;
}

/**
 * 경로 기반으로 해당하는 카테고리 데이터를 가져오는 유틸리티 함수
 * 1차, 2차, 3차, 4차 카테고리 모든 레벨에 대응
 *
 * @param path - 카테고리 경로 (예: '/category/fashion/clothing' 또는 '/category/fashion/clothing/tops')
 * @returns 해당 카테고리의 전체 데이터 또는 null
 */
export function getCategoryDataByPath(path: string): NormalSubcategory | SpecialSubcategory | ThirdCategory | FourthCategory | null {
    if (!path.startsWith('/category/')) return null;

    const segments = path.replace('/category/', '').split('/').filter(Boolean);
    if (segments.length === 0) return null;

    // 1차 카테고리 찾기
    const mainCategory = CATEGORY_ITEMS.find((cat) => cat.name === segments[0]);
    if (!mainCategory) return null;

    // 1차 카테고리 레벨인 경우 (예: /category/fashion)
    if (segments.length === 1) {
        // 메인 카테고리 데이터를 서브카테고리 형태로 반환하기 위해 홈 서브카테고리 찾기
        const homeSubcategory = mainCategory.subcategories.find((sub) => sub.path === path);
        return homeSubcategory || null;
    }

    // 2차 카테고리 레벨인 경우 (예: /category/fashion/clothing)
    if (segments.length === 2) {
        const subcategory = mainCategory.subcategories.find((sub) => sub.path === path);
        return subcategory || null;
    }

    // 3차 카테고리 레벨인 경우 (예: /category/fashion/clothing/tops)
    if (segments.length === 3) {
        const subPath = `/category/${segments[0]}/${segments[1]}`;
        const subcategory = mainCategory.subcategories.find((sub) => sub.path === subPath) as NormalSubcategory | undefined;

        if (!subcategory || !('thirdCategory' in subcategory)) return null;

        const thirdCategory = subcategory.thirdCategory?.find((third) => third.path === path);
        return thirdCategory || null;
    }

    // 4차 카테고리 레벨인 경우 (예: /category/fashion/clothing/tops/short-sleeve)
    if (segments.length === 4) {
        const subPath = `/category/${segments[0]}/${segments[1]}`;
        const thirdPath = `/category/${segments[0]}/${segments[1]}/${segments[2]}`;

        const subcategory = mainCategory.subcategories.find((sub) => sub.path === subPath) as NormalSubcategory | undefined;
        if (!subcategory || !('thirdCategory' in subcategory)) return null;

        const thirdCategory = subcategory.thirdCategory?.find((third) => third.path === thirdPath);
        if (!thirdCategory) return null;

        const fourthCategory = thirdCategory.fourthCategory?.find((fourth) => fourth.path === path);
        return fourthCategory || null;
    }

    return null;
}

/**
 * 경로 기반으로 현재 위치의 Breadcrumb 제목을 생성하는 함수
 *
 * @param currentPath - 현재 경로
 * @returns Breadcrumb 형태의 제목 (예: "패션 > 의류")
 */
export function getBreadcrumbTitle(currentPath: string): string {
    const hierarchy = getPathHierarchy(currentPath);

    // '카테고리' 루트는 제외하고 나머지만 사용
    const categoryHierarchy = hierarchy.filter((item) => item.path !== '/category');

    if (categoryHierarchy.length === 0) return '';
    if (categoryHierarchy.length === 1) return categoryHierarchy[0].label;

    return categoryHierarchy.map((item) => item.label).join(' > ');
}

/**
 * 현재 경로의 계층 구조를 링크 가능한 형태로 반환하는 함수
 *
 * @param currentPath - 현재 경로
 * @returns 계층 구조 배열 (마지막은 현재 위치, 나머지는 링크 가능)
 */
export function getPathHierarchyItems(currentPath: string): Array<{ path: string; label: string; isCurrent: boolean }> {
    const hierarchy = getPathHierarchy(currentPath);

    // '카테고리' 루트는 제외하고 나머지만 사용
    const categoryHierarchy = hierarchy.filter((item) => item.path !== '/category');

    return categoryHierarchy.map((item, index) => ({
        path: item.path,
        label: item.label,
        isCurrent: index === categoryHierarchy.length - 1, // 마지막 요소가 현재 위치
    }));
}
