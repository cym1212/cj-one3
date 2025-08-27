import { useState } from 'react';
import { Link } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

import type { Route } from './+types';

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

interface OrderDetailItem extends OrderItem {
    addressAlias: string;
    recipient: string;
    address: string;
    phoneMasked: string;
    productAmount: number;
    shippingEtcAmount: number;
    discountTotal: number;
    paymentMethodLabel: string;
    accrualPoint: number;
    discountBreakdown: { label: string; amount: number }[];
}

export function meta() {
    return [
        {
            title: '주문 상세 내역 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 주문 상세 내역 페이지',
        },
    ];
}

// 샘플 데이터
const SAMPLE_DATA: OrderDetailItem = {
    orderId: '2025-08-27-101661',
    title: '남성 크로스백 8103378',
    option: '단일상품',
    price: 1318100,
    quantity: 1,
    image: '/images/product/product-1-2.jpg',
    orderDate: '2025-08-27',
    deliveryDate: '2025-08-29',
    deliveryStatus: '상품준비중',
    addressAlias: '배송지1',
    recipient: '홍길동',
    address: '서울특별시 광진구 긴고랑로16길 23-4 2층',
    phoneMasked: '010-****-8371',
    productAmount: 3900,
    shippingEtcAmount: 0,
    discountTotal: 1170,
    paymentMethodLabel: '현대카드 (일시불)',
    accrualPoint: 2,
    discountBreakdown: [
        { label: '쿠폰할인', amount: 1000 },
        { label: '포인트사용', amount: 170 },
    ],
};

export async function loader({ params }: Route.LoaderArgs) {
    return { data: SAMPLE_DATA };
}

export default function MyzoneOrderDetail({ loaderData }: Route.ComponentProps) {
    const { data } = loaderData;
    const [isDiscountOpen, setIsDiscountOpen] = useState(false);

    // 통화 포맷터 및 계산값
    const formatCurrency = (v: number) => v.toLocaleString('ko-KR');
    const finalAmount = data.productAmount + data.shippingEtcAmount - data.discountTotal;

    return (
        <QuickMenuContents>
            <section className="poj2-myzone-order-detail grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-[180px_calc(100%-200px)] gap-4 lg:gap-5">
                {/* 네비게이션 */}
                <div className="max-lg:hidden border-r border-border">
                    <MyzonNavigation />
                </div>

                {/* 컨텐츠 */}
                <div className="lg:pt-10 pb-15 lg:pb-30">
                    {/* 상단 타이틀 */}
                    <div className="max-lg:hidden max-lg:px-4">
                        <h2 className="text-2xl font-semibold">주문상세</h2>
                    </div>

                    <div className="max-lg:p-4 max-lg:mt-2 mt-6">
                        {/* 주문 헤더 */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <p className="font-bold">주문번호</p>
                                <p className="text-description">{data.orderId}</p>
                            </div>
                            <div className="bg-accent/5">
                                <div className="px-4 py-1 lg:py-2 flex items-center gap-3 text-xs lg:text-sm">
                                    <span className="shrink-0 px-2 py-0.5 lg:py-1 rounded-full text-xs font-semibold border border-accent text-accent">{data.addressAlias}</span>
                                    <p className="shrink-0 font-semibold">{data.recipient}</p>
                                    <p className="text-description">{data.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* 상품 정보 */}
                        <div className="mt-2 border border-border bg-white">
                            <OrderItemSummaryList data={[data]} />
                        </div>

                        {/* 금액 요약 */}
                        <div className="mt-6">
                            <div className="border-b pb-1 font-semibold">
                                <p>결제금액</p>
                            </div>
                            <div className="text-sm py-3 space-y-2">
                                <div className="flex items-center justify-between px-4">
                                    <span className="text-description">상품 금액</span>
                                    <span className="font-semibold">{formatCurrency(data.productAmount)}원</span>
                                </div>
                                <div className="flex items-center justify-between px-4">
                                    <span className="text-description">배송비 및 기타 금액</span>
                                    <span className="font-semibold">{formatCurrency(data.shippingEtcAmount)}원</span>
                                </div>
                                <div className="px-4">
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-between"
                                        onClick={() => setIsDiscountOpen((prev) => !prev)}
                                    >
                                        <div className="flex items-center gap-1">
                                            <span className="text-description">할인금액</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 -960 960 960"
                                                className={`w-4 h-4 fill-current transition-transform ${isDiscountOpen ? 'rotate-180' : ''}`}
                                            >
                                                <path d="M480-360 240-600l42.77-42.77L480-445.54 677.23-642.77 720-600 480-360Z" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold">-{formatCurrency(data.discountTotal)}원</span>
                                    </button>
                                    {isDiscountOpen && (
                                        <ul className="mt-3 pt-3 pb-1 border-t border-border/80 space-y-1">
                                            {data.discountBreakdown.map((d, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-center justify-between text-description"
                                                >
                                                    <span className="text-xs">{d.label}</span>
                                                    <span className="text-xs font-semibold text-discount">-{formatCurrency(d.amount)}원</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="flex items-center justify-between border-t border-border px-4 pt-2">
                                    <span className="text-base">총 결제금액</span>
                                    <span className="text-xl font-bold text-discount">{formatCurrency(finalAmount)}원</span>
                                </div>
                            </div>
                        </div>

                        {/* 결제정보 */}
                        <div className="mt-4 lg:mt-6">
                            <div className="font-semibold border-b pb-1">
                                <p>결제정보</p>
                            </div>
                            <div className="px-4 py-3 flex items-start justify-between">
                                <span className="text-sm">신용카드</span>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(finalAmount)}원</p>
                                    <p className="text-xs text-accent">{data.paymentMethodLabel}</p>
                                </div>
                            </div>
                        </div>

                        {/* 적립예정 정보 */}
                        <div className="mt-4 lg:mt-4">
                            <div className="border-b pb-1 flex items-center gap-1">
                                <p className="font-semibold">적립예정 정보</p>
                                <InfoTooltip xPosition="right">
                                    <ul className="list-disc list-outside pl-3 text-xs text-description space-y-2">
                                        <li>주문 상품에 의해 발생 된 CJ ONE 포인트와 적립금 예정 정보가 안내 됩니다.</li>
                                        <li>취소와 반품 시, CJ ONE 포인트, 적립금 금액이 변경 될 수 있습니다.</li>
                                        <li>취소의 경우 취소 완료 시, CJ ONE포인트와 적립금 금액 변경이 발생됩니다.</li>
                                        <li>반품의 경우 CJ ONE 포인트는 환불 완료 시, 적립금은 반품 접수 즉시 금액 변경이 발생됩니다.</li>
                                    </ul>
                                </InfoTooltip>
                            </div>
                            <div className="px-4 py-3 flex items-center justify-between">
                                <span className="text-sm">CJONE포인트</span>
                                <span className="font-semibold">{data.accrualPoint}P</span>
                            </div>
                        </div>

                        {/* 배송정보 */}
                        <div className="mt-4 lg:mt-6">
                            <div className="border-b pb-1 font-semibold">
                                <p>배송정보</p>
                            </div>
                            <div className="px-4 py-3 text-sm space-y-2">
                                <p className="flex items-start gap-3">
                                    <span className="w-16 shrink-0 text-description">받는사람</span>
                                    <span>{data.recipient}</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="w-16 shrink-0 text-description">배송지</span>
                                    <span>{data.address}</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="w-16 shrink-0 text-description">연락처</span>
                                    <span>{data.phoneMasked}</span>
                                </p>
                            </div>
                        </div>
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

function OrderItemSummaryList({ data }: { data: OrderItem[] }) {
    const formatCurrency = (v: number) => v.toLocaleString('ko-KR');

    const formatDeliveryDate = (dateString: string): string => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayOfWeek = dayNames[date.getDay()];

        return `${month}/${day}(${dayOfWeek})`;
    };

    return (
        <ul>
            {data.map((d, index) => (
                <li className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4">
                    <div className="shrink-0">
                        <img
                            src={d.image}
                            alt={d.title}
                            className="w-[90px] h-[90px] lg:w-28 lg:h-28 object-cover rounded"
                        />
                    </div>
                    <div className="flex-1">
                        <p className="flex items-center gap-2 text-sm lg:text-base font-semibold">
                            <span>{d.deliveryStatus}</span>
                            <span className="text-accent text-sm">{formatDeliveryDate(d.deliveryDate)}이내 도착예정</span>
                        </p>
                        <p className="mt-0.5 lg:mt-1 text-sm lg:text-base truncate">{d.title}</p>
                        <p className="flex items-center gap-1 text-xs lg:text-sm text-description">
                            <span>{d.option}</span>
                            <span>수량 {d.quantity}</span>
                        </p>
                        <div className="mt-1 lg:mt-2 flex items-center justify-between lg:block">
                            <p className="text-lg lg:text-xl font-bold">
                                {formatCurrency(d.price)}
                                <span className="text-sm lg:text-base font-semibold">원</span>
                            </p>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
