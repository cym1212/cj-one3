import { useEffect, useState, useCallback } from 'react';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { CategoryMenu } from '@/components/ui/CategoryMenu';
import { CategoryDesktopFilter } from '@/components/ui/CategoryDesktopFilter';
import { CategoryMobileFilter } from '@/components/ui/CategoryMobileFilter';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductList } from '@/components/ui/ProductList';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';
import { ProductListController } from '@/components/ui/ProductListController';
import { BrandBanner } from '@/components/ui/BrandBanner';

import { PRODUCT_DATA } from '@/constants/product';
import type { Product } from '@/components/ui/ProductCard';
import type { ListType } from '@/components/ui/ListLayoutType';
import type { SortType } from '@/constants/sorting';

import type { Route } from './+types';

export function meta() {
    return [
        {
            title: '',
        },
        {
            name: 'description',
            content: '',
        },
        {
            name: 'keywords',
            content: '',
        },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    // 여기서 카테고리 파라미터로 데이터 패칭 후 return시 컴포넌트의 loaderData로 전달됩니다.
    return null;
}

// 페이지당 로드할 상품 수
const PRODUCTS_PER_PAGE = 12;

// 전체 상품 데이터 (실제로는 API에서 가져올 데이터)
const ALL_PRODUCTS = [...PRODUCT_DATA, ...PRODUCT_DATA, ...PRODUCT_DATA, ...PRODUCT_DATA, ...PRODUCT_DATA];

export default function Brand({ loaderData }: Route.ComponentProps) {
    const [listType, setListType] = useState<ListType>('grid');
    const [listSort, setListSort] = useState<SortType>('BEST_SELLING_DESC');

    // 인피니티 스크롤 상태 관리
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    // 추가 상품 로드 함수
    const loadMoreProducts = useCallback(() => {
        if (loading) return;

        setLoading(true);

        // 실제 API 호출을 시뮬레이션 (지연 시간 추가)
        setTimeout(() => {
            const startIndex = page * PRODUCTS_PER_PAGE;
            const endIndex = startIndex + PRODUCTS_PER_PAGE;
            const newProducts = ALL_PRODUCTS.slice(startIndex, endIndex);

            if (newProducts.length > 0) {
                setDisplayedProducts((prev) => [...prev, ...newProducts]);
                setPage((prev) => prev + 1);
                setHasMore(endIndex < ALL_PRODUCTS.length);
            } else {
                setHasMore(false);
            }

            setLoading(false);
        }, 500);
    }, [loading, page]);

    const handleListTypeChange = (type: ListType) => {
        setListType(type);
    };

    const handleListSortChange = (sort: SortType) => {
        setListSort(sort);
    };

    const handleBrandLikeClick = () => {
        // 찜 로직 구현 필요
    };

    // 초기 상품 로드
    useEffect(() => {
        const initialProducts = ALL_PRODUCTS.slice(0, PRODUCTS_PER_PAGE);
        setDisplayedProducts(initialProducts);
        setPage(1);
        setHasMore(ALL_PRODUCTS.length > PRODUCTS_PER_PAGE);
    }, []);

    return (
        <QuickMenuContents>
            <>
                <section className="poj2-brand-banner mb-5 lg:my-10">
                    <BrandBanner
                        imageSrc="/images/brand/brand-nike-banner.jpg"
                        imageAlt="Brand Title"
                        title="Brand Title"
                        likes={100}
                        onLike={handleBrandLikeClick}
                    />
                </section>
                <section className="poj2-brand-home grid grid-cols-1 min-lg:grid-cols-[220px_calc(100%-240px)] gap-4 lg:gap-5 lg:mb-15 mb-30">
                    <div>
                        <div className="hidden min-lg:flex flex-col gap-4 lg:gap-5 sm:pt-5">
                            <div className="hidden lg:block">
                                <CategoryMenu />
                            </div>
                            <CategoryDesktopFilter />
                        </div>
                        <div className="block min-lg:hidden">
                            <CategoryMobileFilter />
                        </div>
                    </div>

                    <div className="sm:pt-5 max-lg:px-4">
                        <div className="pb-4 lg:pb-5">
                            <ProductListController
                                totalLength={ALL_PRODUCTS.length}
                                listType={listType}
                                listSort={listSort}
                                onChangeListType={handleListTypeChange}
                                onChangeListSort={handleListSortChange}
                            />
                        </div>
                        <InfiniteScroll
                            hasMore={hasMore}
                            loading={loading}
                            onLoadMore={loadMoreProducts}
                        >
                            {listType === 'grid' ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 lg:gap-x-5 gap-y-8 lg:gap-y-10">
                                    {displayedProducts.map((product, index) => (
                                        <ProductCard
                                            key={`${product.id}-${index}`}
                                            data={product}
                                            visibleLikeButton
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {displayedProducts.map((product, index) => (
                                        <ProductList
                                            key={`${product.id}-${index}`}
                                            data={product}
                                        />
                                    ))}
                                </div>
                            )}
                        </InfiniteScroll>
                    </div>
                </section>
            </>
        </QuickMenuContents>
    );
}
