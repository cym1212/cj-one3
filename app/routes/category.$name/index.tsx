import { useEffect, useState, useCallback } from 'react';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { CategoryMenu } from '@/components/ui/CategoryMenu';
import { MarketingSlider } from '@/components/ui/MarketingSlider';
import { BrandGridCard } from '@/components/ui/BrandGridCard';
import { RecommendProductCard } from '@/components/ui/RecommendProductCard';
import { RecommendBannerCard } from '@/components/ui/RecommendBannerCard';
import { CategoryHomeTab } from '@/components/ui/CategoryHomeTab';
import { ProductCard } from '@/components/ui/ProductCard';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';

import { SPECIAL_PRODUCT_DATA, PRODUCT_DATA } from '@/constants/product';
import type { Product } from '@/components/ui/ProductCard';
import { SLIDES_DATA, BRAND_DATA, RECOMMEND_BANNER_DATA } from '@/constants/categoryHome';

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

export default function Category({ loaderData }: Route.ComponentProps) {
    // 인피니티 스크롤 상태 관리
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    // 초기 상품 로드
    useEffect(() => {
        const initialProducts = ALL_PRODUCTS.slice(0, PRODUCTS_PER_PAGE);
        setDisplayedProducts(initialProducts);
        setPage(1);
        setHasMore(ALL_PRODUCTS.length > PRODUCTS_PER_PAGE);
    }, []);

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

    useEffect(() => {
        const menuElem = document.querySelector('.poj2-category-menu') as HTMLElement;
        const sliderElem = document.querySelector('.poj2-marketing-slider .swiper') as HTMLElement;

        if (!menuElem || !sliderElem) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            const h = Math.round(entry.contentRect.height);
            menuElem.style.setProperty('height', `${h}px`);
        });

        observer.observe(sliderElem);

        return () => observer.disconnect();
    }, []);

    return (
        <QuickMenuContents>
            <section className="poj2-category-home lg:mb-15 mb-30">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-[180px_calc(100%-200px)] gap-4 lg:gap-5">
                    <div className="hidden lg:block sm:pt-5">
                        <CategoryMenu isOverflowScroll />
                    </div>
                    <div className="sm:pt-5">
                        <MarketingSlider data={SLIDES_DATA} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-15 sm:gap-4 lg:gap-5 my-4 lg:my-5 bg-white max-lg:px-0 max-lg:px-4">
                    <BrandGridCard
                        title="인기 브랜드"
                        data={BRAND_DATA}
                    />

                    <RecommendProductCard
                        title="브랜드 여성의류 추천"
                        data={[...SPECIAL_PRODUCT_DATA, ...SPECIAL_PRODUCT_DATA, ...SPECIAL_PRODUCT_DATA]}
                    />

                    <RecommendProductCard
                        title="브랜드 의류 추천"
                        data={[...SPECIAL_PRODUCT_DATA]}
                    />

                    <RecommendBannerCard data={RECOMMEND_BANNER_DATA} />
                </div>

                <div className="max-lg:overflow-x-auto max-lg:px-4 max-lg:pt-11 mb-4 lg:mb-5">
                    <CategoryHomeTab />
                </div>

                <InfiniteScroll
                    hasMore={hasMore}
                    loading={loading}
                    onLoadMore={loadMoreProducts}
                    className="max-lg:px-4"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 lg:gap-x-5 gap-y-8 lg:gap-y-10">
                        {displayedProducts.map((product, index) => (
                            <ProductCard
                                key={`${product.id}-${index}`}
                                data={product}
                                visibleLikeButton
                            />
                        ))}
                    </div>
                </InfiniteScroll>
            </section>
        </QuickMenuContents>
    );
}
