import { useParams, NavLink } from 'react-router';

import { getCategoryByName } from '@/utils/navigation';

export function CategorySpecialHomeTab() {
    const params = useParams();

    // URL 파라미터에서 카테고리명 추출
    const categoryName = params.name;

    // 카테고리 데이터 찾기
    const categoryData = getCategoryByName('specialty-shop');

    // 서브카테고리 필터링
    const subcategories = categoryData?.subcategories || [];
    const currentCategory = subcategories.find((sub) => sub.name === categoryName);
    const thirdCategory = currentCategory?.thirdCategory || [];

    return (
        <nav className="poj2-category-special-home-tab sm:border-y sm:border-border sm:py-3">
            <ul className="flex sm:justify-center max-lg:py-2 max-lg:gap-x-2 sm:gap-y-2 sm:items-center sm:divide-x sm:divide-border">
                {thirdCategory.map((category) => (
                    <li
                        key={category.name}
                        className="max-lg:shrink-0 text-center sm:px-7"
                    >
                        <NavLink
                            to={category.path}
                            className={({ isActive }) => `max-lg:px-4 max-lg:py-2 max-lg:border text-sm sm:text-base transition-colors bg-white rounded-full leading-[1] hover:text-accent hover:font-semibold ${isActive ? 'text-accent font-semibold max-lg:border-accent' : 'max-lg:border-border'}`}
                        >
                            {category.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
