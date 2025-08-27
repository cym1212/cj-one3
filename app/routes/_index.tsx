import { Link } from 'react-router';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

import { MainSlider } from '@/components/ui/MainSlider';
import { MobileMainSlider } from '@/components/ui/MobileMainSlider';
import { HomeSectionTitle } from '@/components/ui/HomeSectionTitle';
import { ProductCard } from '@/components/ui/ProductCard';
import { CreditCardBenefit } from '@/components/ui/CreditCardBenefit';
import { CategoryRankingSlider } from '@/components/ui/CategoryRankingSlider';
import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { MobileMarketingSlideModal } from '@/components/ui/MobileMarketingSlideModal';
import { MobileBrandBenefitTopSection } from '@/components/ui/MobileBrandBenefitTopSection';
import { MobileBrandBenefitBottomSection } from '@/components/ui/MobileBrandBenefitBottomSection';

import { SPECIAL_PRODUCT_DATA, PRODUCT_DATA, CONSULTATION_PRODUCT_DATA } from '@/constants/product';
import { CATEGORY_DATA } from '@/constants/category';
import { SLIDES_DATA, CREDIT_CARD_BENEFIT_DATA } from '@/constants/home';

export function meta() {
    return [
        {
            title: 'CJ온스타일',
        },
        {
            name: 'description',
            content: '매일 만나는 라이브커머스와 취향맞춤 영상 큐레이션까지! CJ온스타일에서 만나보세요.',
        },
        {
            name: 'keywords',
            content: '온스타일,ONSTYLE,CJ온스타일,CJONSTYLE,CJ홈쇼핑,씨제이홈쇼핑,최화정쇼,힛더스타일,굿라이프,브티나는생활,엣지쇼,더엣지,셀렙샷 에디션,오덴세,테일러센츠,오하루',
        },
        {
            name: 'og:title',
            content: 'CJ온스타일',
        },
        {
            name: 'og:description',
            content: '매일 만나는 라이브커머스와 취향맞춤 영상 큐레이션까지! CJ온스타일에서 만나보세요.',
        },
        {
            name: 'og:image',
            content: 'https://example.com/og-image.jpg',
        },
        {
            name: 'og:url',
            content: 'https://example.com',
        },
    ];
}

export default function Home() {
    const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const clickedButton = e.currentTarget;
        const parentElement = clickedButton.closest('ul');

        if (parentElement) {
            const allButtons = parentElement.querySelectorAll('button');
            allButtons.forEach((button) => {
                button.classList.remove('poj2-home-tab-active');
            });
            clickedButton.classList.add('poj2-home-tab-active');
        }

        const tab = clickedButton.dataset.tab;
        if (tab) {
            const targetElement = document.getElementById(tab);
            if (targetElement) {
                gsap.to(window, {
                    duration: 0.9,
                    scrollTo: {
                        y: targetElement,
                        offsetY: 60,
                    },
                    ease: 'power2.inOut',
                });
            }
        }
    };

    return (
        <>
            {/* 모바일 헤더용 빈 영역 / 모바일에서만 보이는 헤더기에 스태틱하게 이렇게 처리해놨습니다. */}
            <div className="w-full h-[55px]"></div>

            {/* 메인 슬라이더 */}
            <section className="mb-10 lg:my-10">
                <div className="hidden lg:block">
                    <MainSlider data={SLIDES_DATA} />
                </div>
                <div className="block lg:hidden">
                    <MobileMainSlider data={SLIDES_DATA} />
                </div>
            </section>

            {/* 추천 서비스 */}
            <section className="poj2-global-wrapper pb-15 lg:pb-30">
                <HomeSectionTitle title="CJ온스타일 추천 서비스" />
                <ul className="poj2-recommend-service overflow-x-auto flex items-center min-md:justify-center gap-2 lg:gap-7">
                    {/* 멤버십혜택 페이지는 없지만 레이아웃상 포함 */}
                    <li className="shrink-0">
                        <Link
                            to="/"
                            className="block"
                        >
                            <div className="text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/membership.png"
                                    alt="멤버십혜택"
                                    className="h-18 lg:h-20 mx-auto"
                                />
                                <p className="text-xs lg:text-base">멤버십 혜택</p>
                            </div>
                        </Link>
                    </li>
                    {/* 출석체크 페이지는 없지만 레이아웃상 포함 */}
                    <li className="shrink-0">
                        <Link
                            to="/"
                            className="block"
                        >
                            <div className="text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/attendance-check.png"
                                    alt="출석체크"
                                    className="h-18 lg:h-20 mx-auto"
                                />
                                <p className="text-xs lg:text-base">출석체크</p>
                            </div>
                        </Link>
                    </li>
                    <li className="shrink-0">
                        <Link
                            to="/benefits"
                            className="block"
                        >
                            <div className="text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/coupon.png"
                                    alt="혜택"
                                    className="h-18 lg:h-20 mx-auto"
                                />
                                <p className="text-xs lg:text-base">혜택</p>
                            </div>
                        </Link>
                    </li>
                    <li className="shrink-0">
                        <Link
                            to="/review-group"
                            className="block"
                        >
                            <div className="text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/review-group.png"
                                    alt="체험단"
                                    className="h-18 lg:h-20 mx-auto"
                                />
                                <p className="text-xs lg:text-base">체험단</p>
                            </div>
                        </Link>
                    </li>
                    <li className="shrink-0">
                        <Link
                            to="/specialty-shop/department-store"
                            className="block"
                        >
                            <div className="text-center space-y-1 lg:space-y-2">
                                <img
                                    src="/images/icon/department-store.png"
                                    alt="백화점"
                                    className="h-18 lg:h-20 mx-auto"
                                />
                                <p className="text-xs lg:text-base">백화점</p>
                            </div>
                        </Link>
                    </li>
                </ul>
            </section>

            {/* 상품 영역 */}
            <QuickMenuContents>
                <div className="lg:hidden">
                    <MobileBrandBenefitTopSection
                        brannerImage="/images/banner/benefit-m.png"
                        brannerImageAlt="오늘 혜택이 가장 좋아요"
                        brandImage="/images/banner/event.jpg"
                        brandImageAlt="이벤트 이미지"
                        logoImage="/images/brand/new-balance.png"
                        logoImageAlt="이벤트 이미지"
                        brandLink="/brand/1"
                    />
                    <MobileBrandBenefitBottomSection
                        slideData={[
                            {
                                image: '/images/banner/marketing-slide-1.jpg',
                                title: '실시간 판매 1등',
                                subtitle: '마제티 4인 스윙 리브',
                                description: '단독 가죽 콤비 무료',
                            },
                            {
                                image: '/images/banner/marketing-slide-2.jpg',
                                title: '오프라인',
                                subtitle: '4인 론도',
                                description: '스타일링 쿠',
                            },
                            {
                                image: '/images/banner/marketing-slide-3.jpg',
                                title: '특별한 혜택',
                                subtitle: '프리미엄 소파',
                                description: '무료 배송',
                            },
                            {
                                image: '/images/banner/marketing-slide-1.jpg',
                                title: '실시간 판매 1등',
                                subtitle: '마제티 4인 스윙 리브',
                                description: '단독 가죽 콤비 무료',
                            },
                            {
                                image: '/images/banner/marketing-slide-2.jpg',
                                title: '오프라인',
                                subtitle: '4인 론도',
                                description: '스타일링 쿠',
                            },
                        ]}
                    />
                </div>

                <div className="max-lg:px-4">
                    <div className="pb-15 lg:pb-30">
                        {/* 추후 재사용 시 이미지+배너+텍스트 컴포넌트화 가능 */}
                        <div className="poj2-img-title-banner pb-6">
                            <img
                                src="/images/banner/benefit.png"
                                alt="혜택ON. 오늘 혜택이 가장 좋아요"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                            {SPECIAL_PRODUCT_DATA.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    data={product}
                                    activeRollingText
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pb-15 lg:pb-30">
                        <HomeSectionTitle title="카드 혜택" />
                        <div className="overflow-x-auto flex items-center gap-2 md:gap-4 min-md:justify-center">
                            {CREDIT_CARD_BENEFIT_DATA.map((benefit, index) => (
                                <CreditCardBenefit
                                    key={benefit.name + index}
                                    image={benefit.image}
                                    name={benefit.name}
                                    discount={benefit.discount}
                                    href={benefit.href}
                                    bgColor={benefit.bgColor}
                                    hasDiscountRange={benefit.hasDiscountRange}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pb-15 lg:pb-30">
                        <HomeSectionTitle
                            title="인기 특가"
                            description="지금 인기있는 MD 선정 상품"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                            {SPECIAL_PRODUCT_DATA.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    data={product}
                                    activeRollingText
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pb-15 lg:pb-30">
                        <HomeSectionTitle
                            title="혜택특가 모아보기"
                            description="놓치기 아까운 혜택 특가 모음"
                        />
                        <ul className="sticky top-0 z-2 flex items-center min-md:justify-center gap-2 sm:gap-3 w-full overflow-x-auto py-3 bg-white">
                            <li>
                                <button
                                    type="button"
                                    className="poj2-home-tab-active px-3 sm:px-4 py-2 sm:py-3 leading-[1] text-xs sm:text-sm border border-border rounded-full bg-white transition-colors hover:bg-black hover:border-black hover:text-white hover:font-bold [&.poj2-home-tab-active]:bg-black [&.poj2-home-tab-active]:border-black [&.poj2-home-tab-active]:text-white [&.poj2-home-tab-active]:font-bold"
                                    onClick={handleTabClick}
                                    data-tab="broadcast-tab"
                                >
                                    방송임박 혜택
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="px-3 sm:px-4 py-2 sm:py-3 leading-[1] text-xs sm:text-sm border border-border rounded-full bg-white transition-colors hover:bg-black hover:border-black hover:text-white hover:font-bold [&.poj2-home-tab-active]:bg-black [&.poj2-home-tab-active]:border-black [&.poj2-home-tab-active]:text-white [&.poj2-home-tab-active]:font-bold"
                                    onClick={handleTabClick}
                                    data-tab="md-recommend-tab"
                                >
                                    MD추천
                                </button>
                            </li>
                        </ul>

                        <div
                            id="broadcast-tab"
                            className="pt-4 lg:pt-5 pb-10 lg:pb-20"
                        >
                            <h3 className="text-lg font-bold mb-4 lg:mb-5">방.송.임.박 특가 놓치지마세요</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                                {SPECIAL_PRODUCT_DATA.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        data={product}
                                        activeRollingText
                                    />
                                ))}
                            </div>
                        </div>

                        <div
                            id="md-recommend-tab"
                            className="pt-4 lg:pt-5"
                        >
                            <h3 className="text-lg font-bold mb-4 lg:mb-5">#MD가 추천하는 트렌드상품이에요</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                                {CONSULTATION_PRODUCT_DATA.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        data={product}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pb-15 lg:pb-30">
                        <HomeSectionTitle title="카테고리별 랭킹" />
                        <div className="z-2 sticky top-0 h-fit py-3 mb-4 lg:mb-7 bg-white">
                            <CategoryRankingSlider data={CATEGORY_DATA} />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                            {PRODUCT_DATA.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    data={product}
                                    visibleLikeButton
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </QuickMenuContents>
            <div className="lg:hidden">
                <MobileMarketingSlideModal />
            </div>
        </>
    );
}
