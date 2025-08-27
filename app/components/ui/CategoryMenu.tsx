import { NavLink, useLocation, useParams } from 'react-router';
import { getChildCategoriesByPath, getPathHierarchyItems, getCategoryByName } from '@/utils/navigation';

export function CategoryMenu({ isOverflowScroll }: { isOverflowScroll?: boolean }) {
    const location = useLocation();
    const currentPath = location.pathname;

    const params = useParams();

    // URL 파라미터에서 카테고리명 추출
    const categoryName = params.name;

    // 카테고리 데이터 찾기
    const categoryData = getCategoryByName(categoryName || '');

    // 현재 경로의 하위 카테고리들 가져오기
    const childCategories = getChildCategoriesByPath(currentPath);

    // 계층 구조 링크 아이템들 가져오기 (홈 제외)
    const hierarchyItems = getPathHierarchyItems(currentPath).slice(1);

    // 홈 페이지가 아닌 카테고리들만 필터링
    const filteredCategories = childCategories.filter((category) => !category.label.includes('홈'));

    return (
        <nav className="poj2-category-menu min-w-[180px] bg-white border border-border px-4 lg:px-5 pb-4">
            <div className="border-b border-border pt-5 pb-3 mb-3">
                <NavLink
                    to={`/category/${categoryName}`}
                    className="font-bold text-accent"
                >
                    {categoryData?.label || categoryName}
                </NavLink>
            </div>

            {/* 계층 구조 링크 아이템들 */}
            {hierarchyItems.length > 0 && (
                <ul className="space-y-1">
                    {hierarchyItems.map((item, index) => (
                        <li
                            key={item.path}
                            className="flex flex-col"
                        >
                            <NavLink
                                to={item.path}
                                className={`py-1 leading-[1] font-semibold ${item.isCurrent ? 'text-accent' : 'text-black'} text-sm hover:text-accent transition-colors`}
                                style={{ paddingLeft: 10 * index + 'px' }}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}

            {/* 서브카테고리 리스트 */}
            {filteredCategories.length > 0 && (
                <ul className={`space-y-1 mt-1 ${isOverflowScroll ? 'overflow-y-auto h-[calc(100%-70px)]' : 'h-full'}`}>
                    {filteredCategories.map((category) => (
                        <li key={category.path}>
                            <NavLink
                                to={category.path}
                                className={({ isActive }) => `block py-1 leading-[1] text-sm transition-colors hover:text-accent ${isActive ? 'text-accent' : 'text-description'}`}
                                style={{ paddingLeft: 10 * (hierarchyItems.length - 1) + 'px' }}
                            >
                                - {category.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
}
