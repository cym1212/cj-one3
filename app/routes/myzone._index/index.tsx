import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';

interface OrderItem {
    orderId: string;
    title: string;
    option: string;
    price: number;
    quantity: number;
    image: string;
    orderDate: string;
    deliveryDate: string;
    deliveryStatus: string;
}

export function meta() {
    return [
        {
            title: '마이존 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 마이존 페이지',
        },
    ];
}

// 샘플 데이터
const SAMPLE_ITEMS: OrderItem[] = [
    {
        orderId: '2025-08-27-101661',
        title: '남성 크로스백 8103378',
        option: '단일상품',
        price: 1318100,
        quantity: 1,
        image: '/images/product/product-1-2.jpg',
        orderDate: '2025-08-27',
        deliveryDate: '2025-08-29',
        deliveryStatus: '상품준비중',
    },
    {
        orderId: '2025-08-27-101632',
        title: '여성 크로스백 8103378',
        option: '단일상품',
        price: 1318100,
        quantity: 1,
        orderDate: '2025-08-27',
        image: '/images/product/product-1-2.jpg',
        deliveryDate: '2025-08-29',
        deliveryStatus: '상품준비중',
    },
];

export default function Myzone() {
    return (
        <QuickMenuContents>
            <section className="poj2-myzone grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-[180px_calc(100%-200px)] gap-4 lg:gap-5">
                {/* 네비게이션 */}
                <div className="max-lg:order-2 border-r border-border">
                    <MyzonNavigation />
                </div>

                {/* 모바일 분선 */}
                <div className="order-1 block lg:hidden w-full h-2 bg-border/25"></div>

                {/* 컨텐츠 */}
                <div className="lg:pt-12 pb-15 lg:pb-30">
                    {/* 유저 요약 */}
                    <UserSummary />

                    {/* 주문 배송 조회 - mobile */}
                    <div className="lg:hidden mt-5 px-4">
                        <div className="flex items-center justify-between mb-5">
                            <p className="flex items-end gap-1">
                                <span className="leading-[1] text-lg font-bold">주문 배송 조회</span>
                                <span className="leading-[1] text-xs text-description">최근 1개월 기준</span>
                            </p>
                            <Link
                                to="/myzone/orders?status=all"
                                className="flex items-center text-xs lg:text-sm hover:underline"
                            >
                                <span>전체보기</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="w-4 h-4 fill-current"
                                >
                                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                </svg>
                            </Link>
                        </div>
                        <DeliveryTracking />
                    </div>

                    {/* 최근 주문상품 - pc */}
                    <div className="max-lg:hidden mt-10">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xl font-bold">최근 주문상품</p>
                            <Link
                                to="/myzone/orders?status=all"
                                className="flex items-center text-xs lg:text-sm hover:underline"
                            >
                                <span>전체보기</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="w-4 h-4 fill-current"
                                >
                                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                </svg>
                            </Link>
                        </div>
                        <OrderItemDetailList data={SAMPLE_ITEMS} />
                    </div>

                    {/* 최근 주문 상품 - m */}
                    <div className="lg:hidden px-4 mt-6">
                        <OrderItemCompactList data={SAMPLE_ITEMS} />
                    </div>
                </div>
            </section>
        </QuickMenuContents>
    );
}

function MyzonNavigation() {
    return (
        <nav className="px-4 max-lg:py-4 max-lg:divide-y max-lg:divide-border">
            <h2 className="hidden lg:block text-4xl py-10">
                <Link to="/myzone">마이존</Link>
            </h2>
            {/* 주문현황 */}
            <div>
                <h3 className="max-lg:mb-2 text-lg font-bold">주문현황</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/myzone/orders?status=all"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M8.533 7.792h-1.2V5.783H4.867V18.05h12.266V5.783h-2.466v2.009h-1.2V5.783H8.533v2.009zm-1.2-3.209V2.75c0-.506.41-.917.917-.917h5.5c.506 0 .917.41.917.917v1.833h3.666V19.25H3.667V4.583h3.666zm6.134 0v-1.55H8.533v1.55h4.934z"
                                    />
                                </svg>
                                <span>주문/배송 조회</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/myzone/orders?status=cancelled"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M13.83 6.026l-1.236 1.03 5.803.861-.083-5.625-1.186.987.035 2.36a7.864 7.864 0 0 0-6.205-3.03c-4.361 0-7.891 3.554-7.891 7.933v.6h1.2v-.6c0-3.722 2.999-6.734 6.691-6.734a6.664 6.664 0 0 1 5.262 2.573l-2.39-.355zm-2.533 13.366c4.362 0 7.892-3.555 7.892-7.934v-.6h-1.2v.6c0 3.722-3 6.734-6.692 6.734a6.665 6.665 0 0 1-5.261-2.573l2.39.355 1.235-1.03-5.802-.861.083 5.625 1.186-.987-.035-2.36a7.864 7.864 0 0 0 6.204 3.03z"
                                    />
                                </svg>
                                <span>취소/교환/반품 조회</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* 나의혜택 */}
            <div className="pt-8 lg:pt-2">
                <h3 className="max-lg:mb-2 text-lg font-bold">나의 혜택</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/myzone/credit"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M19.62 3.754H2.38v14.492h9.22v-1.2H3.58V8.392h14.84V11.6h1.2V3.754zm-1.2 3.438V4.954H3.58v2.238h14.84zm1.288 9.995c0 .633-.492 1.146-1.1 1.146-.607 0-1.1-.513-1.1-1.145 0-.633.493-1.146 1.1-1.146.608 0 1.1.513 1.1 1.145zm-6.233-3.437c.607 0 1.1-.513 1.1-1.146 0-.633-.492-1.146-1.1-1.146-.607 0-1.1.513-1.1 1.146 0 .633.492 1.146 1.1 1.146zm.733 4.057l4.516-4.515-.849-.849-4.515 4.515.848.849z"
                                    />
                                </svg>
                                <span>적립금</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/myzone/coupon"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M18.508 5.783H3.492v10.434h15.016V5.783zm-16.216-1.2v12.834h17.416V4.583H2.292zm10.55 3.713c-.384 0-.643.236-.643.586v.353h.912s.03 2.995-.004 3.308c-.034.314-.114.825-.679 1.092-.462.22-.494.428-.523.615l-.004.03c-.04.251.007.284.192.238.724-.176 1.496-.466 1.886-1.179.212-.386.297-.806.297-1.442V9.235c.386-.005.665-.25.665-.586v-.353h-2.1zm-3.168 5.082c1.422 0 2.154-1.044 2.154-1.044s-.316-.395-.738-.395c-.198 0-.335.083-.48.17l-.003.003a1.558 1.558 0 0 1-.932.265c-.834 0-1.512-.716-1.512-1.597 0-.9.678-1.631 1.511-1.631.44 0 .68.147.891.277l.002.001c.157.096.294.18.476.18.375 0 .766-.416.766-.416s-.739-1.044-2.134-1.044c-1.467 0-2.572 1.132-2.572 2.633 0 1.481 1.105 2.598 2.572 2.598z"
                                    />
                                </svg>
                                <span>쿠폰</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* 나의활동 */}
            <div className="pt-8 lg:pt-2">
                <h3 className="max-lg:mb-2 text-lg font-bold">나의 활동</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/myzone/review"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M8.88 16.042l7.964-7.506 1.948-1.89-4.297-4.354-9.453 9.453-.917 4.297H8.88zm7.546-8.772l.662-.643-2.599-2.633-.67.67 2.607 2.606zM6.14 12.342l6.83-6.83L15.558 8.1l-7.154 6.743H5.608l.533-2.5zm-2.704 7.05h15v-1.2h-15v1.2z"
                                    />
                                </svg>
                                <span>나의 리뷰</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* 나의정보 */}
            <div className="pt-8 lg:pt-2">
                <h3 className="max-lg:mb-2 text-lg font-bold">나의 정보</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/myzone/profile"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M13.123 7.887a2.123 2.123 0 1 1-4.246 0 2.123 2.123 0 0 1 4.246 0zm1.2 0a3.323 3.323 0 1 1-6.646 0 3.323 3.323 0 0 1 6.646 0zm-6.915 6.715c.996-.699 2.29-1.095 3.648-1.084 1.358.011 2.641.429 3.618 1.143.974.712 1.559 1.651 1.723 2.62l1.183-.202c-.223-1.311-1.002-2.513-2.198-3.387-1.195-.873-2.726-1.36-4.316-1.374-1.59-.013-3.132.449-4.348 1.302-1.216.854-2.024 2.042-2.278 3.35l1.178.229c.188-.967.796-1.9 1.79-2.597z"
                                    />
                                </svg>
                                <span>개인정보수정</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/myzone/check-pw"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <g
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    >
                                        <path d="M11.056 13.605c-1.341-.01-2.618.38-3.598 1.069-.977.686-1.571 1.6-1.754 2.542l-1.178-.23c.25-1.282 1.043-2.452 2.243-3.294 1.2-.842 2.724-1.3 4.297-1.287a7.711 7.711 0 0 1 2.507.438l-.4 1.13a6.51 6.51 0 0 0-2.117-.368zM11 10.01a2.123 2.123 0 1 0 0-4.246 2.123 2.123 0 0 0 0 4.246zm0 1.2a3.323 3.323 0 1 0 0-6.646 3.323 3.323 0 0 0 0 6.646zM16.11 14.667l-1.868-1.868.849-.848 1.867 1.867 1.868-1.867.848.848-1.867 1.868 1.867 1.867-.848.849-1.868-1.868-1.867 1.867-.849-.848 1.868-1.867z" />
                                    </g>
                                </svg>
                                <span>회원탈퇴</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* 고객센터 */}
            <div className="pt-8 lg:pt-2">
                <h3 className="max-lg:mb-2 text-lg font-bold">고객센터</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/customer-center/inquiry"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.949 14.538h10.184V4.867H4.867v11.618l2.082-1.947zM3.667 19.25V3.667h14.666v12.071H7.423L3.666 19.25zm11-10.4H7.333v-1.2h7.334v1.2zm-7.334 3.208h5.042v-1.2H7.333v1.2z"
                                    />
                                </svg>
                                <span>고객센터 문의하기</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/customer-center/inquiry-history"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.949 14.538h10.184V4.867H4.867v11.618l2.082-1.947zM3.667 19.25V3.667h14.666v12.071H7.423L3.666 19.25zm11.6-11.998v4.665h-1.2V8.789l-1.088.272-.291-1.164 2.579-.645zM8.85 11.917V7.252l-2.579.645.291 1.164L7.65 8.79v3.128h1.2zm2.3-2.458a.6.6 0 0 1-.608-.607.6.6 0 0 1 .608-.602c.32 0 .607.27.607.602a.617.617 0 0 1-.607.607zm0 2.3a.6.6 0 0 1-.608-.608.6.6 0 0 1 .608-.601c.32 0 .607.27.607.601a.617.617 0 0 1-.607.608z"
                                    />
                                </svg>
                                <span>나의 문의내역</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

function UserSummary() {
    return (
        <div className="lg:border lg:border-[#41c5af] flex flex-col lg:flex-row lg:items-stretch">
            {/* 좌측 */}
            <div className="w-full lg:w-1/2 py-4 lg:py-10 px-4 lg:px-5 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="shrink-0">
                        <img
                            src="images/icon/myzone.svg"
                            alt="Myzone Icon"
                            className="w-13 lg:w-16 h-13 lg:h-16"
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg lg:text-2xl">
                            WELCOME <span className="font-bold">홍길동님</span>
                        </p>
                        <button
                            type="button"
                            className="flex items-center pl-2.5 pr-1 py-0.5 lg:py-1 text-xs font-semibold text-[#2d8d7d] border border-[#2d8d7d] rounded-full transition-colors hover:bg-[#2d8d7d] hover:text-white"
                        >
                            <span>멤버십혜택</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="w-4 h-4 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <button
                    type="button"
                    className="w-full flex items-center justify-center bg-[#2d8d7d]/10 py-1.5 lg:py-1 transition-colors hover:bg-[#2d8d7d]/20"
                >
                    <p className="text-sm">
                        1건만 구매하면 <span className="font-semibold">프렌즈</span>가 됩니다
                    </p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="w-4 h-4 fill-description"
                    >
                        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                    </svg>
                </button>
            </div>
            {/* 우측 */}
            <div className="w-full lg:w-1/2 max-lg:px-4 max-lg:mt-2 max-lg:mb-4 lg:border-l lg:border-border">
                <div className="h-full grid grid-cols-2 grid-rows-2 max-lg:bg-[linear-gradient(54deg,#8865EB_0.8%,#2BBAA2_71.11%,#23eb96_109.08%)] max-lg:rounded-lg max-lg:py-4 max-lg:gap-y-4">
                    <div className="flex flex-col lg:items-center justify-center max-lg:px-4 lg:border-b lg:border-r lg:border-border">
                        <Link
                            to="/myzone/credit"
                            className="block max-lg:text-white"
                        >
                            <p className="text-xs lg:text-sm font-semibold">적립금</p>
                            <div className="flex items-center justify-between lg:justify-center">
                                <p className="text-sm font-semibold">
                                    <span className="text-base lg:text-lg font-bold">0</span>원
                                </p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="lg:hidden w-5 h-5 fill-current"
                                >
                                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                    <div className="flex flex-col lg:items-center justify-center max-lg:px-4 lg:border-b lg:border-border">
                        <Link
                            to="/myzone/credit"
                            className="block max-lg:text-white"
                        >
                            <p className="text-xs lg:text-sm font-semibold">방송상품지원금</p>
                            <div className="flex items-center justify-between lg:justify-center">
                                <p className="text-sm font-semibold">
                                    <span className="text-base lg:text-lg font-bold">0</span>원
                                </p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="lg:hidden w-5 h-5 fill-current"
                                >
                                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                    <div className="flex flex-col lg:items-center justify-center max-lg:px-4 lg:border-r lg:border-border">
                        <Link
                            to="/myzone/credit"
                            className="block max-lg:text-white"
                        >
                            <p className="text-xs lg:text-sm font-semibold">CJ ONE 포인트</p>
                            <div className="flex items-center justify-between lg:justify-center">
                                <p className="text-sm font-semibold">
                                    <span className="text-base lg:text-lg font-bold">1,303</span>P
                                </p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="lg:hidden w-5 h-5 fill-current"
                                >
                                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                    <div className="flex flex-col lg:items-center justify-center max-lg:px-4 ">
                        <Link
                            to="/myzone/credit"
                            className="block max-lg:text-white"
                        >
                            <p className="text-xs lg:text-sm font-semibold">쿠폰</p>
                            <div className="flex items-center justify-between lg:justify-center">
                                <p className="text-sm font-semibold">
                                    <span className="text-base lg:text-lg font-bold">0</span>개
                                </p>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="lg:hidden w-5 h-5 fill-current"
                                >
                                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrderItemDetailList({ data }: { data: OrderItem[] }) {
    const [activeModal, setActiveModal] = useState<{
        type: 'cancel' | 'return' | 'confirm' | null;
        item: OrderItem | null;
    }>({ type: null, item: null });

    const formatCurrency = (value: number) => value.toLocaleString('ko-KR');

    const formatDeliveryDate = (dateString: string): string => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = dayNames[date.getDay()];

        return `${month}/${day}(${dayOfWeek})`;
    };

    return (
        <ul className="space-y-4">
            {data.map((item) => (
                <li
                    key={item.orderId}
                    className="w-full border border-border bg-white"
                >
                    {/* 상단 헤더 라인 */}
                    <div className="flex items-center justify-between pl-3 lg:pl-4 pr-1 lg:pr-2 py-2 lg:py-3 border-b border-border text-sm">
                        <p>{item.orderId}</p>
                        <Link
                            to={`/myzone/order-detail/${item.orderId}`}
                            className="flex items-center gap-1 font-semibold text-black/70 lg:text-description lg:hover:text-black transition-colors"
                        >
                            <span>주문상세보기</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="w-4 h-4 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </div>

                    {/* 콘텐츠 라인 */}
                    <div className="lg:grid lg:grid-cols-[1fr_220px]">
                        <div className="flex items-center  gap-3 lg:gap-4 p-3 lg:p-4">
                            <div className="shrink-0">
                                <Link to={`/myzone/order-detail/${item.orderId}`}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-[90px] h-[90px] lg:w-28 lg:h-28 object-cover rounded"
                                    />
                                </Link>
                            </div>
                            <div className="flex-1">
                                <p className="flex items-center gap-2 text-sm lg:text-base font-semibold">
                                    <span>{item.deliveryStatus}</span>
                                    <span className="text-accent text-sm">{formatDeliveryDate(item.deliveryDate)}이내 도착예정</span>
                                </p>
                                <p className="mt-0.5 lg:mt-1 text-sm lg:text-base truncate">{item.title}</p>
                                <p className="flex items-center gap-1 text-xs lg:text-sm text-description">
                                    <span>{item.option}</span>
                                    <span>수량 {item.quantity}</span>
                                </p>
                                <div className="mt-1 lg:mt-2 flex items-center justify-between lg:block">
                                    <p className="text-lg lg:text-xl font-bold">
                                        {formatCurrency(item.price)}
                                        <span className="text-sm lg:text-base font-semibold">원</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* 우측: 액션 영역 */}
                        <div className="hidden lg:block border-l border-border">
                            <div className="h-full px-4 flex flex-col justify-center gap-2">
                                <button
                                    type="button"
                                    className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                                    onClick={() => setActiveModal({ type: 'cancel', item })}
                                >
                                    취소신청
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                                    onClick={() => setActiveModal({ type: 'return', item })}
                                >
                                    반품신청
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-1.5 text-sm font-semibold text-accent border border-accent rounded transition-colors hover:bg-accent hover:text-white"
                                    onClick={() => setActiveModal({ type: 'confirm', item })}
                                >
                                    구매확정
                                </button>
                            </div>
                        </div>

                        {/* 모달들 (해당 아이템에만 렌더) */}
                        {activeModal.item?.orderId === item.orderId && (
                            <>
                                {/* 취소신청 모달 */}
                                <DialogModal
                                    open={activeModal.type === 'cancel'}
                                    title="취소신청"
                                    onClose={() => setActiveModal({ type: null, item: null })}
                                    onConfirm={() => setActiveModal({ type: null, item: null })}
                                    confirmText="신청하기"
                                >
                                    <div className="space-y-3">
                                        <p className="text-sm text-description">아래 정보를 확인 후 주문 취소를 진행해 주세요.</p>
                                        <div className="p-3 bg-[#f8f8f8] rounded border border-border/80">
                                            <p className="text-sm font-semibold truncate">{item.title}</p>
                                            <p className="mt-0.5 text-xs text-description">
                                                옵션: {item.option} · 수량 {item.quantity}
                                            </p>
                                        </div>
                                        <label className="block">
                                            <span className="block text-xs text-description mb-1">취소 사유</span>
                                            <select
                                                id="cancel-reason"
                                                className="w-full px-4 py-2 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
                                            >
                                                <option value='change-of-mind'>단순변심</option>
                                                <option value='payment-method-change'>결제수단 변경</option>
                                                <option value='delivery-address-change'>배송지 변경</option>
                                                <option value='etc'>기타</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="block text-xs text-description mb-1">상세 사유 (선택)</span>
                                            <textarea
                                                rows={3}
                                                className="w-full px-3 py-2 text-sm border border-border rounded resize-none focus:outline-none focus:border-accent"
                                                placeholder="상세 사유를 입력해 주세요"
                                            />
                                        </label>
                                    </div>
                                </DialogModal>

                                {/* 반품신청 모달 */}
                                <DialogModal
                                    open={activeModal.type === 'return'}
                                    title="반품신청"
                                    onClose={() => setActiveModal({ type: null, item: null })}
                                    onConfirm={() => setActiveModal({ type: null, item: null })}
                                    confirmText="신청하기"
                                >
                                    <div className="space-y-3">
                                        <p className="text-sm text-description">수거 후 상품 상태 확인이 완료되면 환불이 진행됩니다.</p>
                                        <div className="p-3 bg-[#f8f8f8] rounded border border-border/80">
                                            <p className="text-sm font-semibold truncate">{item.title}</p>
                                            <p className="mt-0.5 text-xs text-description">
                                                옵션: {item.option} · 수량 {item.quantity}
                                            </p>
                                        </div>
                                        <label className="block">
                                            <span className="block text-xs text-description mb-1">반품 사유</span>
                                            <select
                                                id="cancel-reason"
                                                className="w-full px-4 py-2 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
                                            >
                                                <option value='product-defect'>상품하자/불량</option>
                                                <option value='wrong-delivery'>오배송/누락</option>
                                                <option value='change-of-mind'>단순변심</option>
                                                <option value='etc'>기타</option>
                                            </select>
                                        </label>
                                        <label className="block">
                                            <span className="block text-xs text-description mb-1">상세 사유 (선택)</span>
                                            <textarea
                                                rows={3}
                                                className="w-full px-3 py-2 text-sm border border-border rounded resize-none focus:outline-none focus:border-accent"
                                                placeholder="상세 사유를 입력해 주세요"
                                            />
                                        </label>
                                    </div>
                                </DialogModal>

                                {/* 구매확정 모달 */}
                                <DialogModal
                                    open={activeModal.type === 'confirm'}
                                    title="구매확정"
                                    onClose={() => setActiveModal({ type: null, item: null })}
                                    onConfirm={() => setActiveModal({ type: null, item: null })}
                                    confirmText="확정하기"
                                >
                                    <div className="space-y-3">
                                        <p className="text-sm text-description">구매확정 후에는 취소/교환/반품이 어려울 수 있습니다. 진행하시겠어요?</p>
                                        <div className="p-3 bg-[#f8f8f8] rounded border border-border/80">
                                            <p className="text-sm font-semibold truncate">{item.title}</p>
                                            <p className="mt-0.5 text-xs text-description">
                                                옵션: {item.option} · 수량 {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </DialogModal>
                            </>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

function OrderItemCompactList({ data }: { data: OrderItem[] }) {
    const formatDeliveryDate = (dateString: string): string => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = dayNames[date.getDay()];

        return `${month}/${day}(${dayOfWeek})`;
    };

    return (
        <ul className="space-y-4">
            {data.map((item) => (
                <li
                    key={item.orderId}
                    className="w-full bg-white"
                >
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="shrink-0">
                            <Link to={`/myzone/order-detail/${item.orderId}`}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-[70px] h-[70px] object-cover rounded"
                                />
                            </Link>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold">{item.deliveryStatus}</p>
                            <p className="text-sm font-semibold">{formatDeliveryDate(item.deliveryDate)}이내 도착예정</p>
                            <p className="mt-1 text-sm text-description truncate">{item.title}</p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function DeliveryTracking() {
    return (
        <div className="space-y-5">
            <ul className="flex items-center justify-center">
                <li className="relative w-1/5">
                    <Link
                        to="/myzone/orders?status=all"
                        className="text-center space-y-1"
                    >
                        <p className="text-2xl font-semibold text-description">0</p>
                        <p className="text-xs text-description">주문접수</p>
                    </Link>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="absolute top-2 -right-2 w-4 h-4 fill-current"
                    >
                        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                    </svg>
                </li>
                <li className="relative w-1/5">
                    <Link
                        to="/myzone/orders?status=all"
                        className="text-center space-y-1"
                    >
                        <p className="text-2xl font-semibold text-accent">1</p>
                        <p className="text-xs text-description">결제완료</p>
                    </Link>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="absolute top-2 -right-2 w-4 h-4 fill-current"
                    >
                        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                    </svg>
                </li>
                <li className="relative w-1/5">
                    <Link
                        to="/myzone/orders?status=all"
                        className="text-center space-y-1"
                    >
                        <p className="text-2xl font-semibold text-description">0</p>
                        <p className="text-xs text-description">상품준비중</p>
                    </Link>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="absolute top-2 -right-2 w-4 h-4 fill-current"
                    >
                        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                    </svg>
                </li>
                <li className="relative w-1/5">
                    <Link
                        to="/myzone/orders?status=all"
                        className="text-center space-y-1"
                    >
                        <p className="text-2xl font-semibold text-description">0</p>
                        <p className="text-xs text-description">배송중</p>
                    </Link>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="absolute top-2 -right-2 w-4 h-4 fill-current"
                    >
                        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                    </svg>
                </li>
                <li className="relative w-1/5">
                    <Link
                        to="/myzone/orders?status=all"
                        className="text-center space-y-1"
                    >
                        <p className="text-2xl font-semibold text-description">0</p>
                        <p className="text-xs text-description">배송완료</p>
                    </Link>
                </li>
            </ul>
            <div className="flex items-center justify-center gap-1">
                <Link
                    to="/myzone/orders?status=cancelled"
                    className="flex items-center justify-center gap-1 w-1/3 py-2 bg-border/50 rounded"
                >
                    <span className="text-sm">취소</span>
                    <span className="text-sm font-bold">0</span>
                </Link>
                <Link
                    to="/myzone/orders?status=cancelled"
                    className="flex items-center justify-center gap-1 w-1/3 py-2 bg-border/50 rounded"
                >
                    <span className="text-sm">교환</span>
                    <span className="text-sm font-bold">0</span>
                </Link>
                <Link
                    to="/myzone/orders?status=cancelled"
                    className="flex items-center justify-center gap-1 w-1/3 py-2 bg-border/50 rounded"
                >
                    <span className="text-sm">반품</span>
                    <span className="text-sm font-bold">0</span>
                </Link>
            </div>
        </div>
    );
}

// 공통 모달 컴포넌트
function DialogModal({ open, title, children, onClose, onConfirm, confirmText = '확인', cancelText = '취소' }: { open: boolean; title?: string; children: ReactNode; onClose: () => void; onConfirm?: () => void; confirmText?: string; cancelText?: string }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
        >
            {/* dialog */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-md bg-white rounded-lg border border-border shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-description hover:text-black"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="w-6 h-6 fill-current"
                            >
                                <path d="M480-437.85 277.08-234.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L437.85-480 234.92-682.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69L480-522.15l202.92-202.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08 0 12.38-8.69 21.08L522.15-480l202.93 202.92q8.3 8.31 8.5 20.89.19 12.57-8.5 21.27-8.7 8.69-21.08 8.69-12.38 0-21.08-8.69L480-437.85Z" />
                            </svg>
                        </button>
                    </div>
                    {/* body */}
                    <div className="px-4 py-4">{children}</div>
                    {/* footer */}
                    <div className="px-4 py-3 flex items-center justify-end gap-2 border-t border-border">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                        {onConfirm && (
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-semibold text-accent border border-accent rounded transition-colors hover:bg-accent hover:text-white"
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
