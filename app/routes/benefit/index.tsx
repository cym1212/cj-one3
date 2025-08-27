import { Link } from 'react-router';
import { useGSAP } from '@gsap/react';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { HomeSectionTitle } from '@/components/ui/HomeSectionTitle';
import { CreditCardBenefit } from '@/components/ui/CreditCardBenefit';
import { ImageBox } from '@/components/ui/ImageBox';

import { COUPON_BENEFIT_DATA, CREDIT_CARD_BENEFIT_DATA } from '@/constants/home';
import { EVENT_DATA } from '@/constants/benefit';

import type { Event } from '@/constants/benefit';

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

export default function Benefit() {
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
        <QuickMenuContents>
            <section className="poj2-benefit-page max-lg:px-4 max-lg:pt-3">
                {/* 혜택 Check-On */}
                <div className="poj2-benefit-check-on py-6 lg:py-12">
                    <HomeSectionTitle
                        title="혜택 Check-On"
                        description="놓치면 안되는 필수혜택 확인!"
                    />
                    <div className="overflow-x-auto flex items-center min-md:justify-center gap-2 md:gap-4">
                        <div className="space-y-2">
                            <p className="font-semibold text-description">필수 쿠폰팩</p>
                            <div className="flex items-center gap-2 md:gap-4">
                                {COUPON_BENEFIT_DATA.map((benefit, index) => (
                                    <CreditCardBenefit
                                        key={benefit.name + index}
                                        image={benefit.image}
                                        name={benefit.name}
                                        href={benefit.href}
                                        isOnlyImage
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="font-semibold text-description">카드 혜택</p>
                            <div className="flex items-center gap-2 md:gap-4">
                                {CREDIT_CARD_BENEFIT_DATA.slice(0, 2).map((benefit, index) => (
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
                    </div>
                </div>

                {/* 서비스 바로가기 */}
                <div className="poj2-quick-service py-6 lg:py-12">
                    <HomeSectionTitle title="서비스 바로가기" />
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
                                to="/review-group"
                                className="block"
                            >
                                <div className="text-center space-y-1 lg:space-y-2">
                                    <img
                                        src="/images/icon/gift.png"
                                        alt="당첨확인"
                                        className="h-18 lg:h-20 mx-auto"
                                    />
                                    <p className="text-xs lg:text-base">당첨확인</p>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 진행중인 이벤트 */}
                <div className="poj2-in-progress-event py-6 lg:py-12">
                    <HomeSectionTitle title="진행중인 이벤트" />
                    <ul className="sticky top-0 z-2 flex items-center min-md:justify-center gap-2 sm:gap-3 w-full overflow-x-auto py-3 bg-white">
                        <li>
                            <button
                                type="button"
                                className="poj2-home-tab-active px-3 sm:px-4 py-2 sm:py-3 leading-[1] text-xs sm:text-sm border border-border rounded-full bg-white transition-colors hover:bg-black hover:border-black hover:text-white hover:font-bold [&.poj2-home-tab-active]:bg-black [&.poj2-home-tab-active]:border-black [&.poj2-home-tab-active]:text-white [&.poj2-home-tab-active]:font-bold"
                                onClick={handleTabClick}
                                data-tab="poj2-progress-event-list"
                            >
                                구매혜택
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="px-3 sm:px-4 py-2 sm:py-3 leading-[1] text-xs sm:text-sm border border-border rounded-full bg-white transition-colors hover:bg-black hover:border-black hover:text-white hover:font-bold [&.poj2-home-tab-active]:bg-black [&.poj2-home-tab-active]:border-black [&.poj2-home-tab-active]:text-white [&.poj2-home-tab-active]:font-bold"
                                onClick={handleTabClick}
                                data-tab="poj2-progress-event-list"
                            >
                                참여혜택
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="px-3 sm:px-4 py-2 sm:py-3 leading-[1] text-xs sm:text-sm border border-border rounded-full bg-white transition-colors hover:bg-black hover:border-black hover:text-white hover:font-bold [&.poj2-home-tab-active]:bg-black [&.poj2-home-tab-active]:border-black [&.poj2-home-tab-active]:text-white [&.poj2-home-tab-active]:font-bold"
                                onClick={handleTabClick}
                                data-tab="poj2-progress-event-list"
                            >
                                카드/결제혜택
                            </button>
                        </li>
                    </ul>

                    <div
                        id="poj2-progress-event-list"
                        className="pt-4 lg:pt-5 pb-10 lg:pb-20"
                    >
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-8 lg:gap-y-10">
                            {EVENT_DATA.map((event) => (
                                <EventItem
                                    key={event.title}
                                    event={event}
                                />
                            ))}
                        </div>
                    </div>
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
