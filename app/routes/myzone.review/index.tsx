import { useState } from 'react';
import { Link } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';

interface ReviewableItem {
    id: string;
    title: string;
    option: string;
    image: string;
    orderDate: string;
}

interface MyReview {
    id: string;
    title: string;
    option?: string;
    productRating: number;
    deliveryRating: number;
    content: string;
    date: string;
    image?: string;
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

// 샘플 데이터 (주문 아이템 기반 간략형)
const REVIEWABLE_ITEMS: ReviewableItem[] = [
    { id: 'rv-1', title: '남성 크로스백 8103378', option: '단일상품', image: '/images/product/product-1-2.jpg', orderDate: '2025-08-27' },
    { id: 'rv-2', title: '여성 크로스백 8103378', option: '단일상품', image: '/images/product/product-1-2.jpg', orderDate: '2025-08-27' },
    { id: 'rv-3', title: '컴포트 샌들', option: '240 / 블랙', image: '/images/product/product-1-2.jpg', orderDate: '2025-08-20' },
];

const MY_REVIEWS: MyReview[] = [
    {
        id: 'mr-1',
        title: '남성 크로스백 8103378',
        option: '단일상품',
        productRating: 4,
        deliveryRating: 5,
        content: '디자인이 깔끔하고 수납이 좋아요. 데일리로 들기 좋습니다. 스트랩 길이 조절도 편하고 마감도 깔끔합니다.',
        date: '2025-08-22',
        image: '/images/product/product-1-2.jpg',
    },
    {
        id: 'mr-2',
        title: '컴포트 샌들',
        option: '240 / 블랙',
        productRating: 5,
        deliveryRating: 4,
        content: '발볼이 넓은 편인데도 편했고, 배송도 빨랐어요. 여름 내내 잘 신을 듯!',
        date: '2025-08-10',
    },
];

export default function MyzoneReview() {
    // 탭 상태: 등록 가능한 리뷰 / 나의 리뷰
    const [activeTab, setActiveTab] = useState<'writable' | 'mine'>('writable');

    const writableCount = REVIEWABLE_ITEMS.length;
    const myCount = MY_REVIEWS.length;

    return (
        <QuickMenuContents>
            <section className="poj2-myzone-review grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-[180px_calc(100%-200px)] gap-4 lg:gap-5">
                {/* 네비게이션 */}
                <div className="max-lg:hidden border-r border-border">
                    <MyzonNavigation />
                </div>

                {/* 컨텐츠 */}
                <div className="lg:pt-10 pb-15 lg:pb-30">
                    {/* 상단 타이틀 */}
                    <div className="max-lg:hidden max-lg:px-4">
                        <h2 className="text-2xl font-semibold">나의 리뷰</h2>
                    </div>

                    {/* 탭 네비게이션 */}
                    <nav className="max-lg:sticky max-lg:top-[57px] max-lg:h-fit max-lg:z-2 bg-white lg:mt-6">
                        <div className="grid grid-cols-2 text-center">
                            {/* 등록 가능한 리뷰 */}
                            <button
                                type="button"
                                onClick={() => setActiveTab('writable')}
                                className={`relative max-lg:pt-6 py-2 ${activeTab === 'writable' ? 'border-b-2 border-current' : 'border-b border-border'}`}
                            >
                                <div className="absolute top-1 lg:-top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="px-2 py-0.5 rounded bg-accent text-white text-[10px]">최대 +0P 적립</span>
                                </div>
                                <div className="text-xl lg:text-3xl font-semibold">
                                    {writableCount}
                                    <span className="align-middle text-sm lg:text-base font-normal">건</span>
                                </div>
                                <div className="text-[10px] lg:text-xs text-description">등록 가능한 리뷰</div>
                            </button>

                            {/* 나의 리뷰 */}
                            <button
                                type="button"
                                onClick={() => setActiveTab('mine')}
                                className={`relative max-lg:pt-6 py-2 ${activeTab === 'mine' ? 'font-semibold border-b-2 border-current' : 'border-b border-border'}`}
                            >
                                <div className="text-xl lg:text-3xl font-semibold">
                                    {myCount}
                                    <span className="align-middle text-sm lg:text-base font-normal">건</span>
                                </div>
                                <div className="text-[10px] lg:text-xs text-description">나의 리뷰</div>
                            </button>
                        </div>

                        {/* 도움 카운트 바 */}
                        <div className="bg-border/25 text-sm text-description px-4 py-3">
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5 fill-current text-description"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9 21H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2v11Zm2 0V8.34a2 2 0 0 1 .59-1.42l3.65-3.64a1 1 0 0 1 1.71.7V8h3a2 2 0 0 1 2 2l-1 5a6 6 0 0 1-5.89 5H11Z" />
                                </svg>
                                <span className="leading-none">
                                    회원님의 리뷰가 <b>0명</b>에게 도움이 됐어요
                                </span>
                            </span>
                        </div>
                    </nav>

                    <div className="max-lg:p-4 max-lg:mt-2 mt-6">{activeTab === 'writable' ? <WritableReviewList items={REVIEWABLE_ITEMS} /> : <MyReviewList items={MY_REVIEWS} />}</div>
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

function WritableReviewList({ items }: { items: { id: string; title: string; option: string; image: string; orderDate: string }[] }) {
    if (items.length === 0) {
        return <div className="py-20 text-center text-description">등록 가능한 리뷰가 없습니다</div>;
    }

    return (
        <ul className="space-y-3">
            {items.map((it) => (
                <li
                    key={it.id}
                    className="flex items-center gap-4 p-2 lg:p-4 border border-border rounded bg-white"
                >
                    <div className="w-20 h-20 lg:w-24 lg:h-24 overflow-hidden rounded bg-border/25">
                        <img
                            src={it.image}
                            alt="상품 이미지"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{it.title}</p>
                        <p className="text-sm text-description truncate">{it.option}</p>
                        <p className="text-xs text-description mt-1">구매일 {it.orderDate}</p>
                    </div>
                    <div className="shrink-0">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center px-4 py-2 rounded bg-accent text-white text-sm font-semibold"
                        >
                            리뷰 작성
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

function MyReviewList({ items }: { items: { id: string; title: string; option?: string; productRating: number; deliveryRating: number; content: string; date: string; orderDate?: string; image?: string; media?: { type: 'image' | 'video'; url: string; thumbnail?: string } }[] }) {
    const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

    const toggleReviewExpansion = (reviewId: string) => {
        setExpandedReviews((prev) => {
            const next = new Set(prev);
            if (next.has(reviewId)) next.delete(reviewId);
            else next.add(reviewId);
            return next;
        });
    };

    const isTextOverflowing = (text: string) => text.length > 120;

    if (items.length === 0) {
        return <div className="py-20 text-center text-description">작성한 리뷰가 없습니다</div>;
    }

    return (
        <div className="border-t border-border">
            {items.map((r) => {
                const isExpanded = expandedReviews.has(r.id);
                const mediaUrl = r.media ? (r.media.type === 'image' ? r.media.url : r.media.thumbnail) : undefined;
                const previewUrl = mediaUrl || r.image;
                const hasMedia = !!previewUrl;
                const shouldShowMoreButton = isTextOverflowing(r.content);

                return (
                    <div
                        key={r.id}
                        className="border-b border-border py-4 lg:py-5 cursor-pointer"
                        onClick={() => toggleReviewExpansion(r.id)}
                    >
                        <>
                            <div className="mb-3">
                                {/* 상품명 */}
                                <p className="font-semibold truncate">{r.title}</p>
                                {/* 별점 */}
                                <div className="flex items-center gap-4 mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">상품</span>
                                        {renderStars(r.productRating, 4)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">배송</span>
                                        {renderStars(r.deliveryRating, 4)}
                                    </div>
                                </div>

                                {/* 옵션 정보 */}
                                <div className="text-xs lg:text-sm text-description">{r.option}</div>
                                {/* 구매일자 */}
                                {r.orderDate && <div className="text-xs lg:text-sm text-description mt-0.5">구매일 {r.orderDate}</div>}
                            </div>
                            <div className={`flex gap-4 ${isExpanded ? 'flex-col' : ''}`}>
                                {hasMedia && (
                                    <div className={`shrink-0 ${isExpanded ? 'w-[70%]' : 'w-20 h-20 lg:w-24 lg:h-24'}`}>
                                        <img
                                            src={previewUrl}
                                            alt="리뷰 이미지"
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col justify-between">
                                    {/* 리뷰 내용 */}
                                    <p className={`max-lg:text-sm ${isExpanded ? 'mt-2 mb-4' : 'mb-2 line-clamp-3'}`}>{r.content}</p>

                                    {/* 작성자 및 날짜 */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-sm text-description">
                                            <span>{r.date}</span>
                                        </div>

                                        {(shouldShowMoreButton || hasMedia) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleReviewExpansion(r.id);
                                                }}
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
    );
}

function renderStars(rating: number, size = 4) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const sizeClass = size === 6 ? 'w-6 h-6' : size === 5 ? 'w-5 h-5' : 'w-4 h-4';
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((i) => {
                const isFull = i <= full;
                const isHalf = i === full + 1 && half;
                return (
                    <svg
                        key={i}
                        viewBox="0 0 24 24"
                        className={`${isFull ? 'fill-current' : isHalf ? '' : 'fill-border'} text-accent ${sizeClass}`}
                    >
                        {isHalf ? (
                            <defs>
                                <linearGradient
                                    id={`half-${i}`}
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
                        ) : null}
                        <path
                            fill={isHalf ? `url(#half-${i})` : undefined}
                            d="M12 .587l3.668 7.431L24 9.753l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.601 0 9.753l8.332-1.735L12 .587z"
                        />
                    </svg>
                );
            })}
        </div>
    );
}
