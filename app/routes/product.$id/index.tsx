import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Pagination as SwiperPagination, Autoplay } from 'swiper/modules';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import gsap from 'gsap';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { ImageBox } from '@/components/ui/ImageBox';
import { CategoryBreadcrumb } from '@/components/ui/CategoryBreadcrumb';
import { RelationProductCard } from '@/components/ui/RelationProductCard';
import { ListSorting } from '@/components/ui/ListSorting';
import { RadioButton } from '@/components/ui/RadioButton';
import { ReviewMobileFilter } from '@/components/ui/ReviewMobileFilter';
import { Checkbox } from '@/components/ui/Checkbox';

import { SPECIAL_PRODUCT_DATA, PRODUCT_DATA, CONSULTATION_PRODUCT_DATA } from '@/constants/product';
import { SAMPLE_REVIEWS } from '@/constants/review';
import { SAMPLE_QNA } from '@/constants/qna';
import { REVIEW_SORT_DATA } from '@/constants/sorting';

import type { Swiper as SwiperType } from 'swiper';
import type { Product, ProductFlags } from '@/components/ui/ProductCard';
import type { ReviewData } from '@/constants/review';
import type { QnAData } from '@/constants/qna';
import type { SortType } from '@/constants/sorting';

// 카드 할인 혜택 데이터
const CARD_BENEFITS = [
    { card: '카카오페이(삼성카드)', type: '즉시할인가', discount: '5%', condition: '940,500원 (8/20 50,000원 이상)', url: '/benefit/kakao-pay' },
    { card: 'CJ삼성ID카드', type: '청구할인가', discount: '7%', condition: '940,000원 (7/1~12/31)', url: '/benefit/cj-samsung' },
    { card: 'CJ카드', type: '청구할인가', discount: '5%', condition: '960,000원', url: '/benefit/cj-card' },
];

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

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
    const productId = params.id;
    const product = [...PRODUCT_DATA, ...CONSULTATION_PRODUCT_DATA, ...SPECIAL_PRODUCT_DATA].find((product) => product.id === parseInt(productId));
    return { product };
}

export default function ProductDetail({ loaderData }: Route.ComponentProps) {
    const { product } = loaderData;
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('poj2-product-detail-contents-info');
    const [isScrolling, setIsScrolling] = useState(false);

    if (!product) {
        // 데이터 없을 경우 처리 필요
        return null;
    }

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const text = product.title || 'CJ One';

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
        }
    };

    const handleClickLike = () => {
        console.log('Like button clicked');
    };

    const handleClickGift = () => {
        console.log('Gift button clicked');
    };

    const handleClickCard = () => {
        console.log('Card button clicked');
    };

    const handleClickPurchase = () => {
        console.log('Purchase button clicked');
    };

    // 탭 스크롤 기능
    const scrollToSection = useCallback((sectionClass: string) => {
        const element = document.querySelector(`.${sectionClass}`);
        if (element) {
            const headerOffset = 120; // 모바일 헤더 + 탭 높이 고려
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            setIsScrolling(true); // 스크롤 중임을 표시
            setActiveTab(sectionClass);

            gsap.to(window, {
                scrollTo: offsetPosition,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    // 스크롤 완료 후 약간의 지연을 두고 스크롤 추적 재활성화
                    setTimeout(() => {
                        setIsScrolling(false);
                    }, 100);
                },
            });
        }
    }, []);

    // 스크롤 위치에 따른 활성 탭 추적
    useEffect(() => {
        const handleScroll = () => {
            // 프로그래매틱 스크롤 중이면 추적하지 않음
            if (isScrolling) return;

            const sections = ['poj2-product-detail-contents-info', 'poj2-product-benefits-delivery', 'poj2-product-reviews', 'poj2-product-qa'];
            const headerOffset = 120;
            let currentSection = sections[0];

            // 현재 뷰포트 내에서 가장 많이 보이는 섹션을 찾기
            let maxVisibleHeight = 0;

            for (const sectionClass of sections) {
                const element = document.querySelector(`.${sectionClass}`);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;

                    // 섹션의 가시 영역 계산
                    const visibleTop = Math.max(rect.top, headerOffset);
                    const visibleBottom = Math.min(rect.bottom, viewportHeight);
                    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

                    if (visibleHeight > maxVisibleHeight && visibleHeight > 50) {
                        maxVisibleHeight = visibleHeight;
                        currentSection = sectionClass;
                    }
                }
            }

            setActiveTab(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // 초기 실행

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolling]);

    return (
        <>
            <QuickMenuContents>
                <section className="poj2-project-detail lg:mb-15 mb-30">
                    {/* 최상단 */}
                    <div className="flex items-center justify-between py-2 lg:py-4">
                        <CategoryBreadcrumb
                            product={product}
                            isBorder={false}
                        />
                        <div className="flex justify-center gap-2 max-lg:pr-4">
                            <button
                                type="button"
                                className="flex items-center justify-center p-1.5 bg-description/25 transition-colors hover:bg-[#1877F2]"
                                onClick={() => handleShare('facebook')}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 fill-white"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center p-1.5 bg-description/25 transition-colors hover:bg-[#1DA1F2]"
                                onClick={() => handleShare('twitter')}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 fill-white"
                                >
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* 제품 정보 */}
                    <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between gap-4 lg:gap-12">
                        <ProductThumbSlide
                            images={product.thumbnails}
                            title={product.title}
                            className="w-full lg:w-1/2"
                        />
                        <div className="w-full lg:w-1/2 max-lg:px-4">
                            <ProductInfo
                                product={product}
                                onClickLike={handleClickLike}
                                onClickGift={handleClickGift}
                                onClickCard={handleClickCard}
                                onClickPurchase={handleClickPurchase}
                            />
                        </div>
                    </div>

                    {/* 혜택 슬라이더 */}
                    <div className="pt-5 lg:py-15">
                        <BenefitSlider />
                    </div>

                    {/* 함께 많이 본 상품 슬라이더 */}
                    <div className="pb-5 lg:pb-15 max-lg:py-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <RelationProductCard
                            title={`${product.brand || '동일'} 브랜드`}
                            data={PRODUCT_DATA}
                        />
                        <RelationProductCard
                            title="함께 많이 본 상품"
                            data={PRODUCT_DATA}
                        />
                    </div>

                    {/* 상품 상세 */}
                    <section className="grid grid-cols-1 min-lg:grid-cols-[calc(100%-220px)_200px] gap-4 lg:gap-5">
                        {/* 상품 컨텐츠 */}
                        <div className="poj2-product-detail-contents">
                            <nav className="poj2-product-detail-tab z-1 sticky top-[57px] lg:top-0 h-fit bg-white">
                                <ul className="grid grid-cols-3 lg:grid-cols-4">
                                    <li className="relative">
                                        <button
                                            type="button"
                                            className={`w-full h-[50px] lg:h-[60px] text-center text-lg ${activeTab === 'poj2-product-detail-contents-info' ? 'border-b-2 border-accent text-black font-semibold' : 'text-description border-b border-border'}`}
                                            onClick={() => scrollToSection('poj2-product-detail-contents-info')}
                                        >
                                            상세설명
                                        </button>
                                    </li>
                                    <li className="relative hidden lg:block">
                                        <button
                                            type="button"
                                            className={`w-full h-[50px] lg:h-[60px] text-center text-lg ${activeTab === 'poj2-product-benefits-delivery' ? 'border-b-2 border-accent text-black font-semibold' : 'text-description border-b border-border'}`}
                                            onClick={() => scrollToSection('poj2-product-benefits-delivery')}
                                        >
                                            혜택/배송
                                        </button>
                                    </li>
                                    <li className="relative">
                                        <button
                                            type="button"
                                            className={`w-full h-[50px] lg:h-[60px] text-center text-lg ${activeTab === 'poj2-product-reviews' ? 'border-b-2 border-accent text-black font-semibold' : 'text-description border-b border-border'}`}
                                            onClick={() => scrollToSection('poj2-product-reviews')}
                                        >
                                            리뷰
                                        </button>
                                        <span className="absolute top-[30%] right-[25%] lg:right-[30%] -translate-y-1/2 translate-x-1/2 inline-flex px-1.5 lg:px-2.5 py-0.5 text-[10px] lg:text-xs bg-border rounded-full">16</span>
                                    </li>
                                    <li className="relative">
                                        <button
                                            type="button"
                                            className={`w-full h-[50px] lg:h-[60px] text-center text-lg ${activeTab === 'poj2-product-qa' ? 'border-b-2 border-accent text-black font-semibold' : 'text-description border-b border-border'}`}
                                            onClick={() => scrollToSection('poj2-product-qa')}
                                        >
                                            Q&A
                                        </button>
                                        <span className="absolute top-[30%] right-[25%] lg:right-[30%] -translate-y-1/2 translate-x-1/2 inline-flex px-1.5 lg:px-2.5 py-0.5 text-[10px] lg:text-xs bg-border rounded-full">16</span>
                                    </li>
                                </ul>
                            </nav>

                            {/* 상품 상세 설명 이미지 혹은 컨텐츠 컴포넌트 */}
                            <div className="poj2-product-detail-contents-info py-4 lg:py-5 mb-5 lg:mb-6">
                                <div className={`relative overflow-hidden transition-all ${!isContentExpanded ? 'max-h-[600px] lg:max-h-none' : ''}`}>
                                    <img
                                        src="/images/product/product-detail.jpg"
                                        alt={product.title}
                                    />

                                    {/* 모바일에서만 그라데이션 표시 (펼치지 않은 상태) */}
                                    {!isContentExpanded && <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent lg:hidden" />}
                                </div>

                                {/* 모바일에서만 버튼 표시 (펼치지 않은 상태) */}
                                {!isContentExpanded && (
                                    <div className="px-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsContentExpanded(true)}
                                            className="w-full flex items-center justify-center gap-1 h-[50px] border border-border bg-white lg:hidden hover:bg-border/10 transition-colors"
                                        >
                                            <span className="font-semibold">상품정보 더보기</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 -960 960 960"
                                                className="w-5 h-5 mt-1 fill-current"
                                            >
                                                <path d="M480-361.54 267.69-573.85q-8.31-8.3-8.31-20.65 0-12.35 8.31-20.65 8.31-8.31 20.66-8.31 12.34 0 20.65 8.31L480-444.16l171-170.99q8.31-8.31 20.65-8.31 12.35 0 20.66 8.31 8.31 8.3 8.31 20.65 0 12.35-8.31 20.65L480-361.54Z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* 혜택/배송 */}
                            <div className="py-9 lg:py-12 max-lg:px-4">
                                <ProductBenefitsDeliveryTable product={product} />
                            </div>

                            {/* 리뷰 */}
                            <div className="poj2-product-reviews py-9 lg:py-12 max-lg:px-4">
                                <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-6">리뷰 (16)</h3>
                                <ProductReviewList
                                    reviews={SAMPLE_REVIEWS}
                                    pageSize={10}
                                />
                            </div>

                            {/* Q&A */}
                            <div className="poj2-product-qa py-9 lg:py-12 max-lg:px-4">
                                <h3 className="text-xl lg:text-2xl font-bold mb-6">Q&A ({SAMPLE_QNA.length})</h3>
                                <ProductQnAList
                                    qnas={SAMPLE_QNA}
                                    pageSize={10}
                                />
                            </div>
                        </div>

                        {/* 데스크탑 사이드 플로팅 메뉴 */}
                        <div className="hidden lg:block sticky top-0 h-fit">
                            <ProductPurchaseQuickMenu product={product} />
                        </div>
                    </section>
                </section>
            </QuickMenuContents>
            {/* 모바일 구매 네비게이션 */}
            <MobileBottomNav
                onClickLike={handleClickLike}
                onClickGift={handleClickGift}
                onClickCard={handleClickCard}
                onClickPurchase={handleClickPurchase}
            />
        </>
    );
}

function ProductThumbSlide({ images, title, className }: { images: string[]; title?: string; className?: string }) {
    const [activeIndex, setActiveIndex] = useState(0);

    const mainSwiperRef = useRef<SwiperType | null>(null);
    const thumbsSwiperRef = useRef<SwiperType | null>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);

    if (!images || images.length === 0) return null;

    return (
        <div className={`poj2-product-thumb-slide ${className || ''}`}>
            {/* Main Image Swiper */}
            <div className="relative mb-3">
                <Swiper
                    modules={[Navigation, Thumbs]}
                    spaceBetween={0}
                    slidesPerView={1}
                    thumbs={{ swiper: thumbsSwiperRef.current && !thumbsSwiperRef.current.destroyed ? thumbsSwiperRef.current : null }}
                    onSwiper={(swiper) => {
                        mainSwiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => {
                        setActiveIndex(swiper.activeIndex);
                    }}
                >
                    {images.map((image, index) => (
                        <SwiperSlide
                            key={index}
                            className="!w-full !aspect-square"
                        >
                            <div className="w-full h-full lg:rounded overflow-hidden bg-border-50">
                                <ImageBox
                                    src={image}
                                    alt={title ? `${title} - ${index + 1}` : `Product image ${index + 1}`}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Thumbnail Navigation Swiper */}
            {images.length > 1 && (
                <div className="relative px-4 lg:px-5">
                    <Swiper
                        modules={[Navigation, Thumbs]}
                        onSwiper={(swiper) => {
                            thumbsSwiperRef.current = swiper;
                        }}
                        navigation={{
                            prevEl: navigationPrevRef.current || undefined,
                            nextEl: navigationNextRef.current || undefined,
                        }}
                        spaceBetween={10}
                        slidesPerView={5}
                        watchSlidesProgress={true}
                        onBeforeInit={(swiper) => {
                            if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                                if (navigationPrevRef.current) {
                                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                                }
                                if (navigationNextRef.current) {
                                    swiper.params.navigation.nextEl = navigationNextRef.current;
                                }
                            }
                        }}
                    >
                        {images.map((image, index) => (
                            <SwiperSlide
                                key={index}
                                className="cursor-pointer !aspect-square"
                            >
                                <div className={`aspect-square h-full mx-auto border-1 rounded overflow-hidden bg-border-50 transition-colors ${activeIndex === index ? 'border-accent' : 'border-none hover:border-accent'}`}>
                                    <ImageBox
                                        src={image}
                                        alt={title ? `${title} thumbnail ${index + 1}` : `Thumbnail ${index + 1}`}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        ref={navigationPrevRef}
                        type="button"
                        className="hidden lg:flex absolute top-1/2 left-0 -translate-y-1/2 items-center justify-center w-5 h-5 hover:fill-accent"
                        aria-label="이전 슬라이드"
                        onClick={() => mainSwiperRef.current?.slidePrev()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            className="transition-colors"
                        >
                            <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z" />
                        </svg>
                    </button>
                    <button
                        ref={navigationNextRef}
                        type="button"
                        className="hidden lg:flex absolute top-1/2 right-0 -translate-y-1/2 items-center justify-center w-5 h-5 hover:fill-accent"
                        aria-label="다음 슬라이드"
                        onClick={() => mainSwiperRef.current?.slideNext()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            className="transition-colors"
                        >
                            <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

function ProductInfo({ product, onClickLike, onClickGift, onClickCard, onClickPurchase }: { product: Product; onClickLike: () => void; onClickGift: () => void; onClickCard: () => void; onClickPurchase: () => void }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);

    const { brand, title, price, discount, flags } = product;
    const discountPrice = price && discount ? price * (1 - discount / 100) : price;

    // 옵션 데이터 (실제로는 API에서 받아올 데이터)
    const options = [
        { value: '3종/55', label: '3종/55', price: 39900, inStock: false },
        { value: '3종/66', label: '3종/66', price: 39900, inStock: true },
        { value: '3종/77', label: '3종/77', price: 39900, inStock: true },
        { value: '3종/88', label: '3종/88', price: 39900, inStock: true },
    ];

    // 광고 링크 데이터 (실제로는 API에서 받아올 데이터)
    const adLinks = [
        { id: 'ad-1', text: '(광고) 구매 전 적립금 5,000원 받기', url: '/benefit/ad/1' },
        { id: 'card-benefits', text: '카드 무이자 혜택보기', url: '/benefit/card-benefits' },
    ];

    const handleOptionSelect = (optionValue: string) => {
        setSelectedOption(optionValue);
        setIsOptionDropdownOpen(false);
    };

    return (
        <div className="poj2-product-detail-info space-y-4 lg:space-y-6">
            {/* 브랜드 링크 */}
            {brand && (
                <div>
                    <Link
                        to={`/brand/${brand?.toLowerCase()}`}
                        className="inline-flex items-center text-sm text-black hover:text-accent transition-colors"
                    >
                        {brand}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-4 h-4 ml-1 fill-current"
                        >
                            <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                        </svg>
                    </Link>
                </div>
            )}

            {/* 제품 정보 */}
            <div className="space-y-2 lg:space-y-3">
                <h1 className="text-base lg:text-lg font-semibold leading-tight">{title}</h1>

                <div className="space-y-1">
                    {discount && price && <p className="text-sm lg:text-lg text-description line-through">{price.toLocaleString()}원</p>}
                    <p className="text-2xl lg:text-3xl font-bold">
                        {discountPrice?.toLocaleString()}
                        <span className="text-base lg:text-lg font-normal">원</span>
                    </p>
                </div>
            </div>

            {/* 카드 할인 혜택 */}
            <div className="space-y-1 lg:space-y-2">
                {CARD_BENEFITS.map((benefit, index) => (
                    <Link
                        key={index}
                        to={benefit.url}
                        className="flex items-center space-x-0.5 lg:space-x-1 hover:opacity-80 transition-opacity"
                    >
                        <span className="text-xs lg:text-sm">{benefit.card}</span>
                        <span className="text-xs lg:text-sm font-semibold text-red-600">
                            {benefit.type} {benefit.discount}
                        </span>
                        <span className="text-xs lg:text-sm text-description">{benefit.condition}</span>
                    </Link>
                ))}
            </div>

            {/* 배송 및 기타 플래그 정보 */}
            {flags && flags.length > 0 && (
                <div className="poj2-product-detail-flags">
                    <Flags flags={flags} />
                </div>
            )}

            {/* 광고 링크 박스들 */}
            <div className="space-y-2">
                {adLinks.map((ad) => (
                    <Link
                        key={ad.id}
                        to={ad.url}
                        className="flex items-center justify-between p-2 lg:p-3 bg-border/25 hover:bg-border/50 transition-colors"
                    >
                        <span className="text-xs lg:text-sm text-description">{ad.text}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-4 h-4 fill-description"
                        >
                            <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                        </svg>
                    </Link>
                ))}
            </div>

            {/* 커스텀 셀렉트 박스 */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOptionDropdownOpen(!isOptionDropdownOpen)}
                    className="w-full flex items-center justify-between p-3 lg:p-4 border border-border bg-white text-left"
                >
                    <span className="text-xs lg:text-sm">{selectedOption || '옵션을 선택하세요'}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className={`w-5 h-5 fill-current transition-transform ${isOptionDropdownOpen ? 'rotate-180' : ''}`}
                    >
                        <path d="M480-361.54 267.69-573.85q-8.31-8.3-8.31-20.65 0-12.35 8.31-20.65 8.31-8.31 20.66-8.31 12.34 0 20.65 8.31L480-444.16l171-170.99q8.31-8.31 20.65-8.31 12.35 0 20.66 8.31 8.31 8.3 8.31 20.65 0 12.35-8.31 20.65L480-361.54Z" />
                    </svg>
                </button>

                {isOptionDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-white border border-border border-t-0 max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-center justify-between p-3 lg:p-4 hover:bg-border/10 cursor-pointer border-b border-border last:border-b-0"
                                onClick={() => handleOptionSelect(option.value)}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs lg:text-sm">{option.label}</span>
                                        {option.inStock ? (
                                            <span className="text-xs lg:text-sm">{option.price.toLocaleString()}원</span>
                                        ) : (
                                            <button
                                                type="button"
                                                className="px-3 py-1 text-xs border border-border bg-white hover:bg-border/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    alert('재입고 알림 신청이 완료되었습니다.');
                                                }}
                                            >
                                                재입고알림
                                            </button>
                                        )}
                                    </div>
                                    {!option.inStock && <span className="text-xs text-description mt-1 block">재고없음</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 액션 버튼들 - 데스크톱에서만 표시 */}
            <div className="hidden lg:flex gap-2">
                <UtilButtons
                    onClickLike={onClickLike}
                    onClickGift={onClickGift}
                    onClickCard={onClickCard}
                    onClickPurchase={onClickPurchase}
                />
            </div>
        </div>
    );
}

function Flags({ flags }: { flags: ProductFlags[] }) {
    return (
        <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1 sm:gap-x-2">
            {flags.map((flag) => {
                switch (flag) {
                    case 'broadcast':
                        return (
                            <span
                                key={flag}
                                className="text-xs font-bold"
                            >
                                방송상품
                            </span>
                        );
                    case 'tomorrow':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                <img
                                    src="/images/icon/tomorrow.svg"
                                    alt="내일배송"
                                    className="h-3"
                                />
                            </span>
                        );
                    case 'weekend':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                <img
                                    src="/images/icon/weekend.svg"
                                    alt="주말배송"
                                    className="h-3"
                                />
                            </span>
                        );
                    case 'delivery':
                        return (
                            <span
                                key={flag}
                                className="text-xs text-description"
                            >
                                무료배송
                            </span>
                        );
                    case 'return':
                        return (
                            <span
                                key={flag}
                                className="text-xs text-description"
                            >
                                무료반품
                            </span>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}

function BenefitSlider() {
    const swiperRef = useRef<SwiperType | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);
    const userInteractionTimeout = useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    // 샘플 데이터
    const benefitSlides: {
        image: string;
        alt: string;
        path: string;
    }[] = [
        {
            image: '/images/banner/benefit-slide-1.jpg',
            alt: 'Welcome 1만원 쿠폰 받으러가기',
            path: '/benefit/welcome-coupon',
        },
        {
            image: '/images/banner/benefit-slide-2.jpg',
            alt: '신규회원 혜택 안내',
            path: '/benefit/new-member',
        },
        {
            image: '/images/banner/benefit-slide-3.jpg',
            alt: '카드 할인 혜택',
            path: '/benefit/card-discount',
        },
    ];

    // Swiper pagination 초기화
    useEffect(() => {
        if (swiperRef.current && progressRef.current) {
            if (swiperRef.current.params.pagination && typeof swiperRef.current.params.pagination === 'object') {
                swiperRef.current.params.pagination.el = progressRef.current;
                swiperRef.current.pagination.init();
                swiperRef.current.pagination.render();
                swiperRef.current.pagination.update();
            }
        }
    }, []);

    // IntersectionObserver 설정
    useEffect(() => {
        if (!window.IntersectionObserver) {
            console.warn('IntersectionObserver를 지원하지 않는 브라우저입니다.');
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry) {
                    const visible = entry.isIntersecting;
                    setIsVisible(visible);

                    if (swiperRef.current) {
                        if (!visible && isPlaying) {
                            swiperRef.current.autoplay?.stop();
                        } else if (visible && isPlaying) {
                            swiperRef.current.autoplay?.start();
                        }
                    }
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px',
            }
        );

        const currentSliderRef = sliderRef.current;
        if (currentSliderRef) {
            observer.observe(currentSliderRef);
        }

        return () => {
            if (currentSliderRef) {
                observer.unobserve(currentSliderRef);
            }
            if (userInteractionTimeout.current) {
                clearTimeout(userInteractionTimeout.current);
            }
        };
    }, [isPlaying]);

    // 자동 재생 여부 판단
    const shouldAutoplay = useCallback(() => {
        return isPlaying && isVisible;
    }, [isPlaying, isVisible]);

    // 사용자 상호작용 처리
    const handleUserInteraction = useCallback(() => {
        if (userInteractionTimeout.current) {
            clearTimeout(userInteractionTimeout.current);
        }

        if (swiperRef.current && swiperRef.current.autoplay && shouldAutoplay()) {
            swiperRef.current.autoplay.stop();
            userInteractionTimeout.current = setTimeout(() => {
                if (swiperRef.current && shouldAutoplay()) {
                    swiperRef.current.autoplay.start();
                }
            }, 1000);
        }
    }, [shouldAutoplay]);

    // 자동 재생 토글
    const toggleAutoplay = useCallback(() => {
        if (swiperRef.current) {
            if (isPlaying) {
                swiperRef.current.autoplay.stop();
            } else {
                if (shouldAutoplay()) {
                    swiperRef.current.autoplay.start();
                }
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying, shouldAutoplay]);

    return (
        <div
            ref={sliderRef}
            className="poj2-benefit-slider w-full"
        >
            <Swiper
                modules={[SwiperPagination, Navigation, Autoplay]}
                loop
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                speed={900}
                spaceBetween={0}
                pagination={{
                    type: 'bullets',
                    el: progressRef.current,
                    clickable: true,
                }}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                    handleUserInteraction();
                }}
                onBeforeInit={(swiper) => {
                    if (swiper.params.pagination && typeof swiper.params.pagination === 'object' && progressRef.current) {
                        swiper.params.pagination.el = progressRef.current;
                    }
                    if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                        if (navigationPrevRef.current) {
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                        }
                        if (navigationNextRef.current) {
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                        }
                    }
                }}
            >
                {benefitSlides.map((slide, idx) => (
                    <SwiperSlide
                        key={slide.image + idx}
                        className="!w-full"
                    >
                        <Link
                            to={slide.path}
                            className="relative block overflow-hidden w-full h-full"
                        >
                            <ImageBox
                                src={slide.image}
                                alt={slide.alt}
                            />
                        </Link>
                    </SwiperSlide>
                ))}

                {benefitSlides.length > 1 && (
                    <>
                        <button
                            ref={navigationPrevRef}
                            type="button"
                            className="hidden sm:flex z-1 absolute left-0 top-1/2 -translate-y-1/2 items-center justify-center w-9 h-9 bg-black/25 opacity-50 transition-opacity hover:opacity-100"
                            aria-label="이전 슬라이드"
                            onClick={handleUserInteraction}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                className="transition-colors fill-white"
                            >
                                <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z" />
                            </svg>
                        </button>
                        <button
                            ref={navigationNextRef}
                            type="button"
                            className="hidden sm:flex z-1 absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center w-9 h-9 bg-black/25 opacity-50 transition-opacity hover:opacity-100"
                            aria-label="다음 슬라이드"
                            onClick={handleUserInteraction}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                className="transition-colors fill-white"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </button>

                        <div className="hidden lg:flex z-1 absolute bottom-1 left-[54%] transform -translate-x-1/2 items-center gap-1">
                            <div
                                ref={progressRef}
                                className="flex items-center gap-1 [&_.swiper-pagination-bullet]:w-2 [&_.swiper-pagination-bullet]:h-2 [&_.swiper-pagination-bullet]:!bg-white/50 [&_.swiper-pagination-bullet]:border [&_.swiper-pagination-bullet]:border-white [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:!bg-white [&_.swiper-pagination-bullet-active]:border-white"
                            ></div>
                            <div>
                                <button
                                    onClick={toggleAutoplay}
                                    type="button"
                                    className="flex items-center justify-center w-6 h-6"
                                    aria-label={isPlaying ? '자동재생 정지' : '자동재생 시작'}
                                    aria-pressed={isPlaying}
                                >
                                    {isPlaying ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="w-[18px] sm:w-[21px] fill-white"
                                        >
                                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="w-[18px] sm:w-[21px] fill-white"
                                        >
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </Swiper>
        </div>
    );
}

interface CartItem {
    option: string;
    price: number;
    quantity: number;
    inStock: boolean;
}

function ProductPurchaseQuickMenu({ product }: { product: Product }) {
    const [isOptionDropdownOpen, setIsOptionDropdownOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // 옵션 데이터 (실제로는 API에서 받아올 데이터)
    const options = [
        { value: '블랙/55', label: '블랙/55', price: 990000, inStock: false },
        { value: '블랙/66', label: '블랙/66', price: 990000, inStock: true },
        { value: '블랙/77', label: '블랙/77', price: 990000, inStock: true },
        { value: '블랙/88', label: '블랙/88', price: 990000, inStock: true },
    ];

    // 총 가격 계산
    const totalPrice = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    // 옵션 선택 핸들러
    const handleOptionSelect = (option: (typeof options)[0]) => {
        if (!option.inStock) return;

        // 이미 장바구니에 있는지 확인
        const existingItemIndex = cartItems.findIndex((item) => item.option === option.label);

        if (existingItemIndex !== -1) {
            // 이미 있으면 수량 증가
            const updatedItems = [...cartItems];
            updatedItems[existingItemIndex].quantity += 1;
            setCartItems(updatedItems);
        } else {
            // 없으면 새로 추가
            const newItem: CartItem = {
                option: option.label,
                price: option.price,
                quantity: 1,
                inStock: option.inStock,
            };
            setCartItems([...cartItems, newItem]);
        }

        setIsOptionDropdownOpen(false);
    };

    // 수량 변경 핸들러
    const handleQuantityChange = (index: number, delta: number) => {
        const updatedItems = [...cartItems];
        const newQuantity = updatedItems[index].quantity + delta;

        if (newQuantity < 1) return;

        updatedItems[index].quantity = newQuantity;
        setCartItems(updatedItems);
    };

    // 아이템 삭제 핸들러
    const handleRemoveItem = (index: number) => {
        const updatedItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedItems);
    };

    return (
        <div className="poj2-product-detail-side-menu flex flex-col w-full min-w-[200px] h-screen bg-white">
            {/* 제목 및 옵션 */}
            <div className="p-4 border border-border">
                <h3 className="text-lg font-semibold leading-tight line-clamp-2">{product.title}</h3>
                <div className="relative mt-4">
                    <button
                        type="button"
                        onClick={() => setIsOptionDropdownOpen(!isOptionDropdownOpen)}
                        className="w-full flex items-center justify-between p-3 border border-border bg-white text-left"
                    >
                        <span className="text-xs">옵션을 선택하세요</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className={`w-4 h-4 fill-current transition-transform ${isOptionDropdownOpen ? 'rotate-180' : ''}`}
                        >
                            <path d="M480-361.54 267.69-573.85q-8.31-8.3-8.31-20.65 0-12.35 8.31-20.65 8.31-8.31 20.66-8.31 12.34 0 20.65 8.31L480-444.16l171-170.99q8.31-8.31 20.65-8.31 12.35 0 20.66 8.31 8.31 8.3 8.31 20.65 0 12.35-8.31 20.65L480-361.54Z" />
                        </svg>
                    </button>

                    {isOptionDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-border border-t-0 max-h-48 overflow-y-auto">
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    className={`flex flex-col p-3 hover:bg-border/10 border-b border-border last:border-b-0 ${!option.inStock ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs">{option.label}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs">{option.price.toLocaleString()}원</span>
                                        {!option.inStock && <span className="text-xs text-description">재고없음</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 선택된 옵션 리스트 */}
            <div className="flex-1 border-x border-b border-border bg-border/20">
                <div className="h-[calc(100%-60px)] overflow-y-auto divide-y divide-border">
                    {cartItems.map((item, index) => (
                        <div
                            key={index}
                            className="p-3"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs flex-1">{item.option}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="ml-2 text-description hover:text-black"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-4 h-4 fill-current"
                                    >
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center border border-border bg-white">
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(index, -1)}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-border/10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="w-3 h-3 fill-current"
                                        >
                                            <path d="M19 13H5v-2h14v2z" />
                                        </svg>
                                    </button>
                                    <span className="w-8 text-center text-xs">{item.quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleQuantityChange(index, 1)}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-border/10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            className="w-3 h-3 fill-current"
                                        >
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                        </svg>
                                    </button>
                                </div>
                                <span className="text-xs font-semibold">{(item.price * item.quantity).toLocaleString()}원</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 총 가격 */}
                <div className="flex items-center justify-end h-[60px] px-3 bg-white border-t border-border">
                    <span className="text-lg font-bold text-accent">{totalPrice.toLocaleString()}원</span>
                </div>
            </div>

            {/* 버튼들 */}
            <div className="space-y-2 mt-4">
                <button
                    type="button"
                    className="w-full h-[42px] border border-accent text-accent hover:bg-accent/5 transition-colors"
                >
                    선물하기
                </button>
                <button
                    type="button"
                    className="w-full h-[42px] border border-accent text-accent hover:bg-accent/5 transition-colors"
                >
                    장바구니
                </button>
                <button
                    type="button"
                    className="w-full h-[42px] bg-accent text-white hover:bg-accent/90 transition-colors font-semibold"
                >
                    바로구매
                </button>
            </div>
        </div>
    );
}

function MobileBottomNav({ onClickLike, onClickGift, onClickCard, onClickPurchase }: { onClickLike: () => void; onClickGift: () => void; onClickCard: () => void; onClickPurchase: () => void }) {
    return (
        <div className="lg:hidden poj2-product-mobile-nav fixed bottom-0 left-0 right-0 z-50 w-full px-4 py-3 bg-white border-t border-border">
            <UtilButtons
                onClickLike={onClickLike}
                onClickGift={onClickGift}
                onClickCard={onClickCard}
                onClickPurchase={onClickPurchase}
            />
        </div>
    );
}

function UtilButtons({ onClickLike, onClickGift, onClickCard, onClickPurchase }: { onClickLike: () => void; onClickGift: () => void; onClickCard: () => void; onClickPurchase: () => void }) {
    return (
        <nav className="flex gap-2 w-full bg-white">
            {/* 찜하기 버튼 - 정사각형 비율 */}
            <button
                type="button"
                className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 border border-border bg-white hover:bg-border/25 transition-colors"
                onClick={onClickLike}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="w-5 h-5 lg:w-6 lg:h-6 fill-current"
                >
                    <path d="m480-121-41-37q-105.77-97.12-174.88-167.56Q195-395 154-447.5T96.5-552Q80-597 80-643q0-90.15 60.5-150.58Q201-854 288-854q52 0 99 22t81 62q34-40 81-62t99-22q87 0 147.5 60.42Q856-733.15 856-643q0 46-16.5 91T763-447.5Q722-395 652.88-324.56 583.77-254.12 521-157l-41 37Z" />
                </svg>
            </button>

            {/* 선물하기 버튼 - 정사각형 비율 */}
            <button
                type="button"
                className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 border border-border bg-white hover:bg-border/25 transition-colors"
                onClick={onClickGift}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="w-5 h-5 lg:w-6 lg:h-6 fill-current"
                >
                    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q20-22 36-47.5t26.5-53q10.5-27.5 16-56.5t5.5-59q0-98-54.5-179T616-776v16q0 33-23.5 56.5T536-680h-56v80q0 17-11.5 28.5T440-560h-80v80h240q17 0 28.5 11.5T640-440v120h40q26 0 47 15.5t29 40.5Z" />
                </svg>
            </button>

            {/* 장바구니 버튼 - 남은 공간의 일부 */}
            <button
                type="button"
                className="flex items-center justify-center h-12 lg:h-14 flex-1 p-2 lg:p-3 border border-accent text-accent hover:bg-accent/5 transition-colors"
                onClick={onClickCard}
            >
                <span className="lg:text-lg">장바구니</span>
            </button>

            {/* 바로구매 버튼 - 남은 공간의 일부 */}
            <button
                type="button"
                className="flex items-center justify-center h-12 lg:h-14 flex-1 p-2 lg:p-3 bg-accent text-white hover:bg-accent/90 transition-colors"
                onClick={onClickPurchase}
            >
                <span className="lg:text-lg font-semibold">바로구매</span>
            </button>
        </nav>
    );
}

function ProductBenefitsDeliveryTable({ product }: { product: Product }) {
    return (
        <div className="poj2-product-benefits-delivery">
            <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-6">혜택/배송</h3>

            {/* 혜택/배송 테이블 */}
            <table className="poj2-benefits-delivery-table w-full border border-border">
                <tbody>
                    <tr>
                        <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">상품코드</th>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm">{product.id}</td>
                    </tr>
                    <tr className="border-t border-border">
                        <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">카드행사안내</th>
                        <td className="p-3 lg:p-4 space-y-2 lg:space-y-1">
                            {CARD_BENEFITS.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-center flex-wrap lg:justify-between text-xs lg:text-sm max-lg:gap-1"
                                >
                                    <div className="text-accent">{`${benefit.card} ${benefit.type} ${benefit.discount} ${benefit.condition}`}</div>
                                    <Link
                                        to={benefit.url}
                                        className="text-xs lg:text-xs pr-2 sm-1 border border-border rounded hover:bg-border/25"
                                    >
                                        더보기 &gt;
                                    </Link>
                                </div>
                            ))}
                        </td>
                    </tr>
                    <tr className="border-t border-border">
                        <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">무이자</th>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm">12개월(82,500 원 x 12)</td>
                    </tr>
                    <tr className="border-t border-border">
                        <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">CJ ONE포인트</th>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm">고객등급별 990P ~ 2,970P</td>
                    </tr>
                    <tr className="border-t border-border">
                        <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">배송정보</th>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm space-y-1">
                            <p>무료배송 / 무료반품</p>
                            <p className="font-semibold">8/22(금) 이내 도착예정</p>
                        </td>
                    </tr>
                    <tr className="border-t border-border">
                        <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">교환/반품</th>
                        <td className="p-3 lg:p-4 text-xs lg:text-sm">교환 신청 시 맞교환, 반품 신청 시 상품 회수 후 환불</td>
                    </tr>
                </tbody>
            </table>

            {/* 상품정보 테이블 */}
            <div className="py-10">
                <h4 className="text-lg lg:text-xl font-semibold mb-3">상품정보</h4>
                <table className="poj2-benefits-delivery-table w-full border border-border">
                    <tbody>
                        <tr>
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">제품 소재 (섬유의 조성 또는 혼용률을 백분율로 표시, 기능성인 경우 성적서 또는 허가서)</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">겉감: 천연가죽(양), 이면: 천연모피(양)</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">색상</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">블랙, 크림카멜, 토프그레이, 애쉬핑크</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">치수</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">44, 55, 66, 77, 88</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">제조자, 수입품의 경우 수입자를 함께 표기 (병행수입의 경우 병행수입 여부로 대체 가능)</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">(주)로보</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">제조국 (원산지와 가공지 등이 다를 경우 함께 표기)</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm space-y-1">한국</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">세탁/세척 방법 및 취급시 주의사항</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">
                                <p>가죽/모피전문점에 의뢰</p>
                                <p>※ 물이나 땀에 젖어 있을 경우 이염,변색 우려가 있으니 즉시 세탁 및 건조하십시오.</p>
                            </td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">제조연월/수입연월</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">2024.10 이후</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">품질보증기준</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">1년</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">A/S 책임자와 전화번호</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">로보 (02-335-0836)</td>
                        </tr>
                    </tbody>
                </table>
                <div className="pt-2">
                    <p className="text-xs lg:text-sm text-description">CJ ONSTYLE 상품정보는 전자상거래등에서의 상품정보 제공 고시에 따라 작성되었습니다.</p>
                </div>
            </div>

            {/* 교환반품정보 테이블 */}
            <div className="py-10">
                <h4 className="text-lg lg:text-xl font-semibold mb-3">교환반품정보</h4>
                <table className="poj2-benefits-delivery-table w-full border border-border">
                    <tbody>
                        <tr>
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">교환/반품 가능기간</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">상품 청약철회 가능기간은 상품 수령일로 부터 15일 이내 입니다.</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">교환/반품비</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">
                                <p>반품배송비: 무료</p>
                                <p>교환배송비: 무료</p>
                                <p>*제품하자 및 배송오류는 고객부담 제외</p>
                            </td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">교환/반품 조건</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">교환 신청 시 맞교환, 반품 신청 시 상품 회수 후 환불</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">교환/반품 안내</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">
                                <ul className="list-disc list-outside pl-3 marker:text-gray-400 marker:text-[10px] leading-relaxed">
                                    <li>유료배송상품, 일부 특가/명품 상품은 고객 변심에 의한 교환, 반품은 고객께서 반품비를 부담하셔야 합니다 (제품의 하자, 배송오류는 제외).</li>
                                    <li>
                                        <p>반품비 여부는 상품상세정보를 참조하시기 바랍니다.</p>
                                        <p>(설치상품과 같이 협력사에서 직접 배송/설치하는 상품은 상황, 지역에 따라 교환/반품비가 추과로 부과될 수 있으므로 확인 필수)</p>
                                    </li>
                                    <li>고객 변심에 의한 반품일 경우 주문에 포함된 배송비는 차감 후 결제됩니다.</li>
                                    <li className="font-semibold">파본이나 오염도서는 무상으로 교환해 드립니다.</li>
                                    <li>상품 텍(Tag) 분리전/착용전 교환/반품 가능 세탁/사용 후 제품 불량시 외부기간 심의 결과에 따라 반품 가능</li>
                                    <li>CJ ONSTYLE에서 구입하신 상품에 대한 품질 보증 및 피해보상에 관한 사항은 소비자분쟁 해결기준(공정거래위원회고시 제2018-2호) 에 의거하며, 문의사항은 CJ ONSTYLE 고객센터 (1644-2525)로 문의해주시기 바랍니다.</li>
                                </ul>
                            </td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">교환/반품 불가 안내</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm space-y-1">
                                <ul className="list-disc list-outside pl-3 marker:text-gray-400 marker:text-[10px] leading-relaxed">
                                    <li>사용(착용)/설치(조립) 후에는 제품 불량시를 제외하고 교환/반품 기간 내라도 교환 및 반품이 되지 않습니다.</li>
                                    <li>상품 택(TAG)제거 또는 상품 개봉으로 인한 상품 가치 훼손 시에는 15일 이내라도 교환 및 반품이 불가능합니다.</li>
                                    <li>해당 서비스 이용 개시 후에는 취소 및 반품이 불가능합니다.</li>
                                    <li>CJ ENM은 광고페이지 등을 통해 협력사 자체의 청약철회 조건이 고지되는 경우에도 협력사가 고지한 조건이 아닌 전자상거래법 및 소비자분쟁해결기준 청약철회 규정을 따릅니다.</li>
                                </ul>
                            </td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">세탁/세척 방법 및 취급시 주의사항</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">
                                <p>가죽/모피전문점에 의뢰</p>
                                <p>※ 물이나 땀에 젖어 있을 경우 이염,변색 우려가 있으니 즉시 세탁 및 건조하십시오.</p>
                            </td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">제조연월/수입연월</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">2024.10 이후</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">품질보증기준</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">1년</td>
                        </tr>
                        <tr className="border-t border-border">
                            <th className="bg-border/25 p-3 lg:p-4 font-normal text-xs lg:text-sm border-r border-border w-[120px] lg:w-[160px] text-left">A/S 책임자와 전화번호</th>
                            <td className="p-3 lg:p-4 text-xs lg:text-sm">로보 (02-335-0836)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ProductReviewList({ reviews, pageSize = 10 }: { reviews: ReviewData[]; pageSize?: number }) {
    const [sortType, setSortType] = useState<SortType>('LATEST_DESC');
    const [colorFilter, setColorFilter] = useState<string[]>(['색상전체']);
    const [sizeFilter, setSizeFilter] = useState<string[]>(['크기전체']);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());

    // 필터 옵션
    const colorOptions = ['색상전체', '블랙', '크림카멜', '토프그레이', '애쉬핑크'];
    const sizeOptions = ['크기전체', '44', '55', '66', '77', '88'];

    // 평균 별점 계산
    const averageRatings = useMemo(() => {
        if (reviews.length === 0) return { product: 0, delivery: 0 };

        const productSum = reviews.reduce((sum, review) => sum + review.productRating, 0);
        const deliverySum = reviews.reduce((sum, review) => sum + review.deliveryRating, 0);

        return {
            product: productSum / reviews.length,
            delivery: deliverySum / reviews.length,
        };
    }, [reviews]);

    // 리뷰 필터링 및 정렬
    const filteredAndSortedReviews = useMemo(() => {
        let filtered = reviews.filter((review) => {
            const colorMatch = colorFilter.includes('색상전체') || colorFilter.includes(review.color || '');
            const sizeMatch = sizeFilter.includes('크기전체') || sizeFilter.includes(review.size || '');
            return colorMatch && sizeMatch;
        });

        // 정렬
        filtered.sort((a, b) => {
            switch (sortType) {
                // 인기순은 로직 구현필요
                case 'POPULARITY_DESC':
                    return b.productRating + b.deliveryRating - (a.productRating + a.deliveryRating);
                case 'HIGH_HELPFUL_DESC':
                    return b.helpful - a.helpful;
                case 'LATEST_DESC':
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                case 'HIGH_SCORE_DESC':
                    return b.productRating + b.deliveryRating - (a.productRating + a.deliveryRating);
                case 'LOW_SCORE_DESC':
                    return a.productRating + a.deliveryRating - (b.productRating + b.deliveryRating);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [reviews, colorFilter, sizeFilter, sortType]);

    // 현재 페이지에 표시할 리뷰 데이터
    const currentReviews = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredAndSortedReviews.slice(startIndex, endIndex);
    }, [filteredAndSortedReviews, currentPage, pageSize]);

    // 총 페이지 수 계산
    const totalPages = Math.ceil(filteredAndSortedReviews.length / pageSize);

    // 페이지 변경
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // 정렬 변경 핸들러
    const handleMobileListSortChange = (sort: SortType) => {
        setSortType(sort);
    };

    // 별점 렌더링 (0.5단위 지원)
    const renderStars = (rating: number, size: number = 5) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="flex items-center">
                <svg
                    width="0"
                    height="0"
                    style={{ position: 'absolute' }}
                >
                    <defs>
                        <linearGradient
                            id="halfFill"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop
                                offset="50%"
                                stopColor="currentColor"
                            />
                            <stop
                                offset="50%"
                                stopColor="transparent"
                            />
                        </linearGradient>
                    </defs>
                </svg>

                {[1, 2, 3, 4, 5].map((star) => {
                    let fillClass = 'fill-border';
                    let fillUrl = '';

                    if (star <= fullStars) {
                        fillClass = 'fill-accent';
                    } else if (star === fullStars + 1 && hasHalfStar) {
                        fillClass = 'fill-accent';
                        fillUrl = 'url(#halfFill)';
                    }

                    return (
                        <svg
                            key={star}
                            className={`w-${size} h-${size} ${fillClass}`}
                            viewBox="0 0 24 24"
                            style={fillUrl ? { fill: fillUrl } : undefined}
                        >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    );
                })}
            </div>
        );
    };

    // 리뷰 내용 토글
    const toggleReviewExpansion = (reviewId: number) => {
        const newExpanded = new Set(expandedReviews);
        if (newExpanded.has(reviewId)) {
            newExpanded.delete(reviewId);
        } else {
            newExpanded.add(reviewId);
        }
        setExpandedReviews(newExpanded);
    };

    // 텍스트가 3줄을 초과하는지 확인 (대략적인 계산)
    const isTextOverflowing = (text: string) => {
        return text.length > 120; // 대략적인 3줄 길이
    };

    return (
        <div className="poj2-product-review-list">
            {/* 상단 통계 */}
            <div className="mb-3 lg:mb-8">
                {/* 평균 별점 */}
                <div className="flex items-center justify-center gap-8 lg:gap-12 mb-6 lg:mb-8">
                    <div className="text-center">
                        <div className="text-sm lg:text-base text-description mb-1">상품</div>
                        <div className="text-lg lg:text-xl font-bold mb-2">만족해요</div>
                        {renderStars(averageRatings.product)}
                    </div>
                    <div className="text-center">
                        <div className="text-sm lg:text-base text-description mb-1">배송</div>
                        <div className="text-lg lg:text-xl font-bold mb-2">정말 빨라요</div>
                        {renderStars(averageRatings.delivery)}
                    </div>
                </div>

                {/* 필터 및 정렬 */}
                <div className="flex items-center justify-between">
                    {/* 필터 */}
                    <div className="hidden lg:flex items-center gap-2">
                        <select
                            value={colorFilter.includes('색상전체') || colorFilter.length !== 1 ? '색상전체' : colorFilter[0]}
                            onChange={(e) => setColorFilter([e.target.value])}
                            className="appearance-none bg-white border border-border w-[100px] lg:w-[120px] px-3 py-1.5 pr-8 text-sm bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_10px]"
                        >
                            {colorOptions.map((color) => (
                                <option
                                    key={color}
                                    value={color}
                                >
                                    {color}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sizeFilter.includes('크기전체') || sizeFilter.length !== 1 ? '크기전체' : sizeFilter[0]}
                            onChange={(e) => setSizeFilter([e.target.value])}
                            className="appearance-none bg-white border border-border w-[100px] lg:w-[120px] px-3 py-1.5 pr-8 text-sm bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_10px]"
                        >
                            {sizeOptions.map((size) => (
                                <option
                                    key={size}
                                    value={size}
                                >
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="lg:hidden">
                        <ReviewMobileFilter
                            colorOptions={colorOptions}
                            sizeOptions={sizeOptions}
                            colorFilter={colorFilter}
                            sizeFilter={sizeFilter}
                            onColorChange={setColorFilter}
                            onSizeChange={setSizeFilter}
                            modalOffsetBottomClassName="mb-[73px]"
                        />
                    </div>

                    {/* 정렬 */}
                    <div className="hidden lg:flex items-center gap-2 lg:gap-4">
                        {[
                            { value: 'LATEST_DESC', label: '최신순' },
                            { value: 'HIGH_SCORE_DESC', label: '별점높은순' },
                            { value: 'LOW_SCORE_DESC', label: '별점낮은순' },
                        ].map((option) => (
                            <RadioButton
                                key={option.value}
                                checked={sortType === option.value}
                                onChange={(value) => setSortType(value as SortType)}
                                value={option.value}
                                name="reviewSort"
                                label={option.label}
                            />
                        ))}
                    </div>
                    <div className="lg:hidden">
                        <ListSorting
                            sort={sortType}
                            options={REVIEW_SORT_DATA}
                            onChange={handleMobileListSortChange}
                            modalOffsetBottomClassName="mb-[73px]"
                        />
                    </div>
                </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="border-t border-border">
                {currentReviews.map((review) => {
                    const isExpanded = expandedReviews.has(review.id);
                    const hasMedia = !!review.media;
                    const shouldShowMoreButton = isTextOverflowing(review.content);

                    return (
                        <div
                            key={review.id}
                            className="border-b border-border py-4 lg:py-5 cursor-pointer"
                            onClick={() => toggleReviewExpansion(review.id)}
                        >
                            <>
                                <div className="mb-3">
                                    {/* 별점 */}
                                    <div className="flex items-center gap-4 mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">상품</span>
                                            {renderStars(review.productRating, 4)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">배송</span>
                                            {renderStars(review.deliveryRating, 4)}
                                        </div>
                                    </div>

                                    {/* 옵션 정보 */}
                                    <div className="text-xs lg:text-sm text-description">{review.color && review.size && `${review.color}/${review.size}`}</div>
                                </div>
                                <div className={`flex gap-4 ${isExpanded ? 'flex-col' : ''}`}>
                                    {hasMedia && (
                                        <div className={`shrink-0 ${isExpanded ? 'w-[70%]' : 'w-20 h-20 lg:w-24 lg:h-24'}`}>
                                            <img
                                                src={review.media!.url}
                                                alt="리뷰 이미지"
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 flex flex-col justify-between">
                                        {/* 리뷰 내용 */}
                                        <p className={`max-lg:text-sm ${isExpanded ? 'mt-2 mb-4' : 'mb-2 line-clamp-3'}`}>{review.content}</p>

                                        {/* 작성자 및 날짜 */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-sm text-description">
                                                <span>{review.userId}</span>
                                                <span>{review.date}</span>
                                            </div>

                                            {(shouldShowMoreButton || hasMedia) && (
                                                <button
                                                    onClick={() => toggleReviewExpansion(review.id)}
                                                    className="flex items-center text-xs lg:text-sm text-description hover:text-black hover:fill-black"
                                                >
                                                    <span>{isExpanded ? '접기' : '더보기'}</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 -960 960 960"
                                                        className={`w-5 h-5 fill-current transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                                                    >
                                                        <path d="M480-384.85q-6.46 0-11.92-2.11-5.46-2.12-10.7-7.35L281.85-569.85q-5.62-5.61-6-13.77-.39-8.15 6-14.53 6.38-6.39 14.15-6.39 7.77 0 14.15 6.39L480-428.31l169.85-169.84q5.61-5.62 13.77-6 8.15-.39 14.53 6 6.39 6.38 6.39 14.15 0 7.77-6.39 14.15L502.62-394.31q-5.24 5.23-10.7 7.35-5.46 2.11-11.92 2.11Z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        </div>
                    );
                })}
            </div>

            {/* 페이지네이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center mt-6 lg:mt-8">
            <div className="flex items-center gap-1 lg:gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center fill-description hover:fill-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="w-5 h-5 lg:w-6 lg:h-6 fill-current"
                    >
                        <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z" />
                    </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={`w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center text-xs lg:text-sm rounded-full ${pageNum === currentPage ? 'bg-accent text-white font-semibold' : 'text-description hover:text-black hover:bg-border/20'}`}
                    >
                        {pageNum}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center fill-description hover:fill-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="w-5 h-5 lg:w-6 lg:h-6 fill-current"
                    >
                        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function ProductQnAList({ qnas = SAMPLE_QNA, pageSize = 10 }: { qnas?: QnAData[]; pageSize?: number }) {
    const [myQuestions, setMyQuestions] = useState<boolean>(false);
    const [answeredOnly, setAnsweredOnly] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [expandedQnAs, setExpandedQnAs] = useState<Set<number>>(new Set());
    const [clampedQnAs, setClampedQnAs] = useState<Set<number>>(new Set());

    const filteredQnAs = useMemo(() => {
        return qnas.filter((qna) => {
            const myQuestionMatch = !myQuestions || qna.isMyQuestion;
            const answeredMatch = !answeredOnly || qna.answered;
            return myQuestionMatch && answeredMatch;
        });
    }, [qnas, myQuestions, answeredOnly]);

    const totalPages = Math.ceil(filteredQnAs.length / pageSize);
    const currentQnAs = filteredQnAs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const toggleQnAExpansion = (qnaId: number) => {
        setExpandedQnAs((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(qnaId)) {
                newSet.delete(qnaId);
            } else {
                newSet.add(qnaId);
            }
            return newSet;
        });
    };

    return (
        <div className="poj2-product-qna-list">
            {/* 상단 헤더 영역 */}
            <div className="border-b border-border pb-3 lg:pb-3">
                <p className="hidden lg:block text-right text-xs lg:text-xs text-description mb-2 lg:mb-2">배송/교환/반품/사은품 등 상품정보 외 문의는 '고객센터 1:1문의'를 클릭하세요.</p>

                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
                    {/* 필터 체크박스 */}
                    <div className="order-1 lg:order-0 flex items-center gap-3 lg:gap-5">
                        <Checkbox
                            checked={myQuestions}
                            onChange={setMyQuestions}
                            label="나의 질문"
                            checkboxClassName="w-4 h-4 lg:w-5 lg:h-5"
                            labelClassName="text-sm lg:text-base"
                        />
                        <Checkbox
                            checked={answeredOnly}
                            onChange={setAnsweredOnly}
                            label="답변된 질문"
                            checkboxClassName="w-4 h-4 lg:w-5 lg:h-5"
                            labelClassName="text-sm lg:text-base"
                        />
                    </div>

                    {/* 문의 버튼들 */}
                    <div className="max-lg:mb-4 flex items-center gap-2">
                        <Link
                            to="/"
                            className="max-lg:flex-1 text-center px-3 py-3 lg:px-4 lg:py-2 bg-white border border-border text-xs lg:text-sm hover:bg-border/25 transition-colors"
                        >
                            고객센터 1:1문의
                        </Link>
                        <Link
                            to="/"
                            className="max-lg:flex-1 text-center px-3 py-3 lg:px-4 lg:py-2 bg-accent text-white text-xs lg:text-sm hover:bg-accent/90 transition-colors"
                        >
                            상품문의
                        </Link>
                    </div>
                </div>
            </div>

            {/* QnA 리스트 */}
            <div>
                {currentQnAs.length === 0 ? (
                    <div className="text-center py-12 text-description">조건에 맞는 질문이 없습니다.</div>
                ) : (
                    currentQnAs.map((qna) => {
                        const isExpanded = expandedQnAs.has(qna.id);
                        const isClamped = clampedQnAs.has(qna.id);
                        const shouldShowMoreButton = qna.answered || isClamped;

                        return (
                            <div
                                key={qna.id}
                                className="border-b border-border"
                            >
                                {/* 질문 영역 */}
                                <div
                                    className={`p-3 lg:p-4 max-lg:px-0 transition-colors ${shouldShowMoreButton ? 'cursor-pointer hover:bg-border/20' : 'cursor-default'}`}
                                    onClick={shouldShowMoreButton ? () => toggleQnAExpansion(qna.id) : undefined}
                                >
                                    <div className="flex items-start flex-col lg:flex-row gap-2 lg:gap-4 mb-2">
                                        {/* 답변 상태 뱃지 */}
                                        <div className="w-[45px]">
                                            <span className={`inline-block px-2 py-0.5 lg:py-1 text-xs font-semibold rounded shrink-0 ${qna.answered ? 'bg-accent text-white' : 'bg-border/50 text-description'}`}>{qna.answered ? '답변' : '미답변'}</span>
                                        </div>

                                        <div className="w-full flex-1 space-y-1 lg:space-y-2">
                                            {/* 질문 내용 */}
                                            <p
                                                ref={(el) => {
                                                    if (el) {
                                                        const isTextClamped = el.scrollHeight > el.clientHeight;
                                                        el.setAttribute('data-is-clamped', isTextClamped.toString());
                                                        const currentlyClamped = clampedQnAs.has(qna.id);
                                                        if (isTextClamped !== currentlyClamped) {
                                                            setTimeout(() => {
                                                                setClampedQnAs((prev) => {
                                                                    const newSet = new Set(prev);
                                                                    if (isTextClamped) {
                                                                        newSet.add(qna.id);
                                                                    } else {
                                                                        newSet.delete(qna.id);
                                                                    }
                                                                    return newSet;
                                                                });
                                                            }, 0);
                                                        }
                                                    }
                                                }}
                                                className={`text-sm lg:text-base ${isExpanded ? '' : 'line-clamp-3'}`}
                                            >
                                                {qna.question}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                {/* 질문 및 작성자 */}
                                                <div>
                                                    <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm text-description">
                                                        <span>{qna.userId}</span>
                                                        <span>{qna.date}</span>
                                                        {qna.isMyQuestion && <span className="text-accent text-xs">내 질문</span>}
                                                    </div>
                                                </div>

                                                {/* 더보기 버튼 */}
                                                <div className={`${shouldShowMoreButton ? 'flex' : 'hidden'} items-center text-xs lg:text-sm text-description`}>
                                                    <span>{isExpanded ? '접기' : '더보기'}</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 -960 960 960"
                                                        className={`w-4 h-4 fill-current transition-transform ml-1 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                                                    >
                                                        <path d="M480-384.85q-6.46 0-11.92-2.11-5.46-2.12-10.7-7.35L281.85-569.85q-5.62-5.61-6-13.77-.39-8.15 6-14.53 6.38-6.39 14.15-6.39 7.77 0 14.15 6.39L480-428.31l169.85-169.84q5.61-5.62 13.77-6 8.15-.39 14.53 6 6.39 6.38 6.39 14.15 0 7.77-6.39 14.15L502.62-394.31q-5.24 5.23-10.7 7.35-5.46 2.11-11.92 2.11Z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 답변 영역 (펼쳐진 상태에서만 표시) */}
                                {isExpanded && qna.answer && (
                                    <div className="p-4 border-t border-border/50 bg-border/15">
                                        <div className="flex items-start gap-2 lg:gap-3">
                                            <div className="hidden lg:block shrink-0 w-[45px] text-center">
                                                <span className="inline-block px-1 lg:px-2 py-0.5 lg:py-1 text-[10px] rounded bg-border/50 text-description">ㄴ</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs lg:text-sm">{qna.answer}</p>
                                                <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm text-description mt-2 lg:mt-3">
                                                    <span>운영자</span>
                                                    <span>{qna.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* 페이지네이션 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
