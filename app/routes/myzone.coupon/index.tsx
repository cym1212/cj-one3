import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';

type Coupon = {
    id: string;
    percent: number;
    title: string;
    brand: string;
    linkTo: string;
    remainLabel?: string;
};

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

// 샘플 쿠폰 데이터
const OWNED_COUPONS: Coupon[] = [
    { id: 'owned-1', percent: 8, title: 'SK매직 8% 다운로드쿠폰', brand: 'CJ ONSTYLE', linkTo: '/search?coupon=owned-1', remainLabel: '99+' },
    { id: 'owned-2', percent: 5, title: '백화점명품WEEK 중복쿠폰', brand: '쇼핑플러스 쿠폰', linkTo: '/search?coupon=owned-2', remainLabel: '99+' },
];

const DOWNLOADABLE_COUPONS: Coupon[] = [
    { id: 'down-1', percent: 20, title: '지오다노 20% 다운로드 쿠폰', brand: 'CJ ONSTYLE', linkTo: '/search?coupon=down-1', remainLabel: '99+' },
    { id: 'down-2', percent: 15, title: '지오다노 15% 다운로드 쿠폰', brand: 'CJ ONSTYLE', linkTo: '/search?coupon=down-2', remainLabel: '99+' },
    { id: 'down-3', percent: 12, title: '[SK매직]12% 할인쿠폰', brand: 'CJ ONSTYLE', linkTo: '/search?coupon=down-3', remainLabel: '99+' },
];

export default function MyzoneCoupon() {
    // 탭 상태
    const [activeTab, setActiveTab] = useState<'owned' | 'downloadable'>('downloadable');

    const ownedCount = OWNED_COUPONS.length;
    const downloadableCount = DOWNLOADABLE_COUPONS.length;

    const list: Coupon[] = useMemo(() => (activeTab === 'owned' ? OWNED_COUPONS : DOWNLOADABLE_COUPONS), [activeTab]);

    return (
        <QuickMenuContents>
            <section className="poj2-myzone-coupon grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-[180px_calc(100%-200px)] gap-4 lg:gap-5">
                {/* 네비게이션 */}
                <div className="max-lg:hidden border-r border-border">
                    <MyzonNavigation />
                </div>

                {/* 컨텐츠 */}
                <div className="lg:pt-10 pb-15 lg:pb-30">
                    {/* 상단 타이틀 */}
                    <div className="max-lg:hidden max-lg:px-4">
                        <h2 className="text-2xl font-semibold">쿠폰</h2>
                    </div>

                    {/* 탭 네비게이션 */}
                    <nav className="max-lg:sticky max-lg:top-[57px] max-lg:h-fit max-lg:z-2 lg:mt-2 flex items-center bg-white">
                        <button
                            type="button"
                            onClick={() => setActiveTab('owned')}
                            className="flex-1 block h-[50px]"
                        >
                            <span className={`flex items-center justify-center gap-1 w-full h-full ${activeTab === 'owned' ? 'font-semibold border-b-2 border-current' : 'border-b border-border'}`}>
                                보유 중인 쿠폰
                                <span className="text-description">{ownedCount}</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('downloadable')}
                            className="flex-1 block h-[50px]"
                        >
                            <span className={`flex items-center justify-center gap-1 w-full h-full ${activeTab === 'downloadable' ? 'font-semibold border-b-2 border-current' : 'border-b border-border'}`}>
                                다운 가능한 쿠폰
                                <span className="text-description">{downloadableCount}</span>
                            </span>
                        </button>
                    </nav>

                    <div className="max-lg:p-4 max-lg:mt-2 mt-6">
                        {/* 쿠폰 리스트 */}
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {list.map((c) => (
                                <li key={c.id}>
                                    <CouponCard
                                        coupon={c}
                                        showDownload={activeTab === 'downloadable'}
                                    />
                                </li>
                            ))}
                        </ul>

                        {/* PC: 다운로드 탭에서만 전체 쿠폰 받기 버튼 */}
                        {activeTab === 'downloadable' && (
                            <div className="hidden lg:block mt-6">
                                <button className="w-full py-3 rounded-md bg-accent text-white font-semibold">전체 쿠폰 받기</button>
                            </div>
                        )}

                        {/* 안내 문구 */}
                        <ul className="list-disc list-outside pl-4 mt-10 lg:mt-6 text-xs text-description space-y-1 lg:space-y-2">
                            <li>CJ ONSTYLE에서 사용 가능한 쿠폰으로 상담원 전화 주문 및 ARS 등에서 사용 가능한 쿠폰은 고객센터로 문의주시기 바랍니다.</li>
                            <li>각 할인쿠폰의 구매 조건에 따라 사용 가능하며, 쿠폰 특성에 따라 일부 상품은 제외될 수 있습니다.</li>
                            <li>각 할인쿠폰은 단일 상품별로 적용 가능합니다.</li>
                            <li>제휴사이트(네이버,다음,다나와 등)을 통해 발행된 쿠폰은 해당 사이트를 통해 웹(PC/모바일)로 접속하신 경우만 확인 가능합니다.</li>
                            <li>주문 취소/반품 시 사용된 할인쿠폰은 최초 발급된 유효기간 내에서 자동 재발행 됩니다.</li>
                            <li>보유 중인 할인쿠폰 개수는 쿠폰의 종수 기준이며, 동일한 쿠폰을 여러 장 보유한 경우 해당 쿠폰의 상세 목록에서 총 보유 수량 확인이 가능합니다.</li>
                        </ul>
                    </div>
                </div>
            </section>
            {/* 모바일: 하단 고정 전체 쿠폰 받기 (다운로드 탭 전용) */}
            {activeTab === 'downloadable' && (
                <div className="lg:hidden fixed left-0 right-0 bottom-0 z-50 bg-white border-t border-border p-3">
                    <button className="w-full py-3 rounded bg-accent text-white font-semibold">전체 쿠폰 받기</button>
                </div>
            )}
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

// 쿠폰 카드 컴포넌트
function CouponCard({
    coupon,
    showDownload,
}: {
    coupon: {
        id: string;
        percent: number;
        title: string;
        brand: string;
        linkTo: string;
        remainLabel?: string;
    };
    showDownload: boolean;
}) {
    return (
        <div className="flex rounded border border-border overflow-hidden bg-white">
            {/* 본문 */}
            <div className="flex-1 lg:flex items-start gap-4 p-4">
                <div className="shrink-0 text-accent font-bold">
                    <span className="text-lg lg:text-2xl">{coupon.percent}%</span>
                </div>
                <div className="min-w-0">
                    <p className="text-sm lg:text-base lg:text-lg font-semibold leading-sm">{coupon.title}</p>
                    <p className="text-sm text-description mt-0.5">{coupon.brand}</p>
                    <div className="mt-1 lg:mt-2">
                        <Link
                            to={coupon.linkTo}
                            className="inline-flex items-center gap-1 py-0.5 lg:py-1 pl-2 lg:pl-3 pr-1 lg:pr-1.5 rounded border border-border text-xs transition-colors hover:bg-border/25"
                        >
                            사용 가능 상품
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-4 h-4 fill-current"
                            >
                                <path d="M9.29 6.71a1 1 0 0 0 0 1.41L12.17 11H6a1 1 0 1 0 0 2h6.17l-2.88 2.88a1 1 0 1 0 1.42 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.71 6.7a1 1 0 0 0-1.42 0Z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 우측 영역 */}
            {showDownload && (
                <div className="shrink-0 w-[75px] flex flex-col items-center justify-center bg-border/25">
                    <button
                        type="button"
                        aria-label="쿠폰 다운로드"
                        className="flex flex-col items-center h-full justify-center gap-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                            fill="currentColor"
                        >
                            <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1Zm-7 16a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z" />
                        </svg>
                        {coupon.remainLabel && <span className="text-xs text-description">{coupon.remainLabel}</span>}
                    </button>
                </div>
            )}
        </div>
    );
}
