import { useState } from 'react';
import { useParams } from 'react-router';

import { getCategoryByName } from '@/utils/navigation';

interface CategoryHomeTabProps {
    onClick?: () => void;
}

export function CategoryHomeTab({ onClick }: CategoryHomeTabProps) {
    const params = useParams();

    // URL 파라미터에서 카테고리명 추출
    const categoryName = params.name;

    // 카테고리 데이터 찾기
    const categoryData = getCategoryByName(categoryName || '');

    // 서브카테고리 필터링
    const subcategories = categoryData?.subcategories || [];

    const [activeCategoryName, setActiveCategoryName] = useState<string>(subcategories[0].name || '');

    const handleClick = (name: string) => {
        setActiveCategoryName(name);
        onClick?.();
    };

    return (
        <nav className="poj2-category-home-tab sm:border-y sm:border-border sm:py-3">
            <ul className="flex max-lg:py-2 max-lg:gap-x-2 sm:gap-y-2 sm:items-center sm:divide-x sm:divide-border">
                {subcategories.map((category) => (
                    <li
                        key={category.name}
                        className="max-lg:shrink-0 text-center sm:px-7"
                    >
                        <button
                            type="button"
                            className={`max-lg:px-4 max-lg:py-2 max-lg:border text-xs sm:text-sm transition-colors bg-white rounded-full leading-[1] hover:text-accent hover:font-semibold ${category.name === activeCategoryName ? 'text-accent font-semibold max-lg:border-accent' : 'text-description max-lg:border-border'}`}
                            onClick={() => handleClick(category.name)}
                        >
                            {category.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
