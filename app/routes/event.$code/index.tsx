import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { ImageBox } from '@/components/ui/ImageBox';
import { InfiniteScroll } from '@/components/ui/InfiniteScroll';
import { ProductCard } from '@/components/ui/ProductCard';

import { PRODUCT_DATA } from '@/constants/product';

import type { Route } from './+types';
import type { Event } from '@/constants/benefit';
import type { Product } from '@/components/ui/ProductCard';

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

export default function Event({ loaderData }: Route.ComponentProps) {
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

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const text = 'CJ One Event';

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
        }
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
            <section className="poj2-event-page">
                {/* 타이틀 (데스크탑 only) */}
                <div className="hidden lg:flex poj2-event-title items-center justify-between pt-6 pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">오늘은 뷰티페스타</p>
                        <span className="text-sm text-description">(2025.08.21 ~ 2025.08.24)페이스북트위터</span>
                    </div>
                    <div className="flex justify-center gap-2 max-lg:pr-4">
                        <button
                            type="button"
                            className="flex items-center justify-center p-2 rounded-full transition-colors bg-[#1877F2]"
                            onClick={() => handleShare('facebook')}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 fill-white"
                            >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center p-2 rounded-full transition-colors bg-[#1DA1F2]"
                            onClick={() => handleShare('twitter')}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 fill-white"
                            >
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 컨텐츠 */}
                <div className="poj2-event-content lg:py-5">
                    <img
                        src="/images/banner/event-detail.jpg"
                        alt=""
                        className="w-full"
                    />
                    {/* 하단 영역은 이벤트마다 상이해서 작업 범위에서 제외하기로 얘기 했었음 */}
                </div>

                {/*  */}
                <div className="poj2-event-product-list py-6 lg:py-12 max-lg:px-4">
                    <InfiniteScroll
                        hasMore={hasMore}
                        loading={loading}
                        onLoadMore={loadMoreProducts}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 lg:gap-x-5 gap-y-8 lg:gap-y-10">
                            {displayedProducts.map((product, index) => (
                                <ProductCard
                                    key={`${product.id}-${index}`}
                                    data={product}
                                    visibleLikeButton
                                />
                            ))}
                        </div>
                    </InfiniteScroll>
                </div>
            </section>
        </QuickMenuContents>
    );
}

function getDDay(endDate: string): string {
    const today = new Date();
    const end = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return '종료';
    } else if (diffDays === 0) {
        return 'D-DAY';
    } else {
        return `D-${diffDays}`;
    }
}

function EventItem({ event }: { event: Event }) {
    const { path, title, image, endDate, benefits } = event;
    const dDay = endDate ? getDDay(endDate) : null;

    const getDDayBadgeColor = (dDayText: string) => {
        if (dDayText === '종료' || dDayText === 'D-DAY') {
            return '#ec0040';
        }
        const daysMatch = dDayText.match(/^D-(\d+)$/);
        if (daysMatch) {
            const days = parseInt(daysMatch[1]);
            return days <= 7 ? '#ec0040' : '#111';
        }
        return '#111';
    };

    const benefitsList = (benefit: NonNullable<Event['benefits']>[0]) => {
        switch (benefit.type) {
            case 'coupon':
                return (
                    <p
                        key={benefit.value}
                        className="flex items-center gap-1 lg:gap-2 text-xs"
                    >
                        <img
                            src="/images/icon/coupon.svg"
                            alt="쿠폰"
                            className="h-3 lg:h-4"
                        />
                        <span>{benefit.value}</span>
                    </p>
                );
            case 'card':
                return (
                    <p
                        key={benefit.value}
                        className="flex items-center gap-1 lg:gap-2 text-xs"
                    >
                        <img
                            src="/images/icon/card.svg"
                            alt="카드"
                            className="h-3 lg:h-4"
                        />
                        <span>{benefit.value}</span>
                    </p>
                );
            case 'credit':
                return (
                    <p
                        key={benefit.value}
                        className="flex items-center gap-1 lg:gap-2 text-xs"
                    >
                        <img
                            src="/images/icon/credit.svg"
                            alt="적립금"
                            className="h-3 lg:h-4"
                        />
                        <span>{benefit.value}</span>
                    </p>
                );
            case 'gift':
                return (
                    <p
                        key={benefit.value}
                        className="flex items-center gap-1 lg:gap-2 text-xs"
                    >
                        <img
                            src="/images/icon/gift.svg"
                            alt="기프트"
                            className="h-3 lg:h-4"
                        />
                        <span>{benefit.value}</span>
                    </p>
                );
            default:
                return null;
        }
    };

    return (
        <div className="poj2-event-item">
            <Link
                to={path}
                className="block"
            >
                <div className="relative mb-2 lg:mb-3">
                    <ImageBox
                        src={image}
                        alt={title}
                    />
                    {dDay ? (
                        <div
                            className="absolute top-0 right-0 text-xs leading-[1] px-1.5 lg:px-2 py-0.5 text-white font-semibold"
                            style={{ backgroundColor: getDDayBadgeColor(dDay) }}
                        >
                            {dDay}
                        </div>
                    ) : null}
                </div>
                <p className="max-lg:text-sm font-semibold mb-1 lg:mb-2">{title}</p>
                {benefits && benefits.length > 0 && (
                    <ul className="space-y-0.5 lg:space-y-2">
                        {benefits.map((benefit, index) => (
                            <li
                                key={index}
                                className="flex items-center flex-wrap gap-1"
                            >
                                {benefitsList(benefit)}
                            </li>
                        ))}
                    </ul>
                )}
            </Link>
        </div>
    );
}
