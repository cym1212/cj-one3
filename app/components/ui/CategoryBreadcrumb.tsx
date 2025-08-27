import { Link, useLocation } from 'react-router';

import { getPathHierarchy } from '@/utils/navigation';

import type { Product } from '@/components/ui/ProductCard';

interface BreadcrumbProps {
    product?: Product;
    isBorder?: boolean;
}

export function CategoryBreadcrumb({ product, isBorder = true }: BreadcrumbProps) {
    const { pathname } = useLocation();

    // 상품 데이터가 있으면 상품의 카테고리 경로 사용, 없으면 현재 URL 사용
    const targetPath = product?.categoryPath || pathname;
    const hierarchy = getPathHierarchy(targetPath);
    const breadcrumbItems = hierarchy.filter((h) => h.path !== '/category');

    return (
        <nav className="w-full bg-white">
            {/* Breadcrumb */}
            {breadcrumbItems.length > 1 && (
                <nav
                    aria-label="breadcrumb"
                    className={`flex items-center gap-2 text-description px-4 py-2 ${isBorder ? 'border-b border-border' : ''}`}
                >
                    {breadcrumbItems.map((item, idx, arr) => {
                        const isLast = idx === arr.length - 1;
                        return (
                            <span
                                key={item.path}
                                className="flex items-center gap-2 text-xs"
                            >
                                {isLast ? (
                                    <span className="font-bold">{item.label}</span>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className="transition-colors hover:text-accent"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                                {!isLast && <span className="text-black">›</span>}
                            </span>
                        );
                    })}
                </nav>
            )}
        </nav>
    );
}
