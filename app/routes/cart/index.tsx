import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { Checkbox } from '@/components/ui/Checkbox';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { CartBreadcrumb } from '@/components/ui/CartBreadcrumb';

gsap.registerPlugin(useGSAP);

export function meta() {
    return [
        {
            title: '장바구니 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 장바구니 페이지',
        },
    ];
}

interface CartItem {
    id: number;
    title: string;
    option: string;
    price: number;
    quantity: number;
    image: string;
    benefits?: Array<{
        type: 'coupon' | 'card' | 'credit' | 'gift';
        value: string;
    }>;
    deliveryDate: string;
    isSoldOut: boolean;
    isGift: boolean;
}

// 샘플 데이터
const SAMPLE_CART_ITEMS: CartItem[] = [
    {
        id: 1,
        title: '여성 크로스백 8103378',
        option: '단일상품',
        price: 1318100,
        quantity: 1,
        image: '/images/product/product-1-2.jpg',
        benefits: [
            { type: 'coupon', value: '할인쿠폰 15%(최대 5천원)' },
            { type: 'card', value: '적립금 10%(최대 1만원)' },
        ],
        deliveryDate: '8/27(수)이내 도착예정',
        isSoldOut: false,
        isGift: true,
    },
    {
        id: 2,
        title: '[TV] 미나투고 디럭스 플러스 LED (푸쉬바 포함)',
        option: '민트',
        price: 183200,
        quantity: 1,
        image: '/images/product/product-1-4.jpg',
        benefits: [
            { type: 'card', value: '적립금 10%(최대 1만원)' },
            { type: 'card', value: '일부 행사상품' },
        ],
        deliveryDate: '9/3(수)이내 도착예정',
        isSoldOut: true,
        isGift: false,
    },
    {
        id: 3,
        title: '스마트 무선 충전기',
        option: '화이트',
        price: 89000,
        quantity: 2,
        image: '/images/product/product-1-5.jpg',
        benefits: [{ type: 'coupon', value: '신규회원 10% 할인' }],
        deliveryDate: '8/25(금)이내 도착예정',
        isSoldOut: false,
        isGift: true,
    },
];

export default function Cart() {
    const location = useLocation();
    const [cartItems, setCartItems] = useState<CartItem[]>(SAMPLE_CART_ITEMS);
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [isAllSelected, setIsAllSelected] = useState(false);
    const [showGiftableOnly, setShowGiftableOnly] = useState(false);
    const [isDetailExpanded, setIsDetailExpanded] = useState(false);

    useEffect(() => {
        const allSelected = cartItems.length > 0 && cartItems.every((item) => selectedItems.has(item.id));
        setIsAllSelected(allSelected);
    }, [cartItems, selectedItems]);

    const handleSelectAll = (checked: boolean) => {
        setIsAllSelected(checked);
        if (checked) {
            setSelectedItems(new Set(cartItems.map((item) => item.id)));
        } else {
            setSelectedItems(new Set());
        }
    };

    const handleSelectItem = (id: number, checked: boolean) => {
        const newSelectedItems = new Set(selectedItems);
        if (checked) {
            newSelectedItems.add(id);
        } else {
            newSelectedItems.delete(id);
        }
        setSelectedItems(newSelectedItems);
    };

    const handleQuantityChange = (id: number, quantity: number) => {
        if (quantity < 1) return;
        setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)));
    };

    const handleOptionChange = (id: number, option: string, quantity: number) => {
        setCartItems((items) => items.map((item) => (item.id === id ? { ...item, option, quantity } : item)));
    };

    const handleRemoveItem = (id: number) => {
        setCartItems((items) => items.filter((item) => item.id !== id));
    };

    const handleGiftFilter = () => {
        setShowGiftableOnly(!showGiftableOnly);
    };

    const handleDeleteSelected = () => {
        setCartItems((items) => items.filter((item) => !selectedItems.has(item.id)));
        setSelectedItems(new Set());
    };

    const handleDeleteSoldOut = () => {
        const soldOutItemIds = cartItems.filter((item) => item.isSoldOut).map((item) => item.id);
        setCartItems((items) => items.filter((item) => !item.isSoldOut));
        // 삭제된 품절 상품들을 선택 목록에서도 제거
        setSelectedItems((prev) => {
            const newSet = new Set(prev);
            soldOutItemIds.forEach((id) => newSet.delete(id));
            return newSet;
        });
    };

    // 필터링된 상품 목록
    const filteredCartItems = showGiftableOnly ? cartItems.filter((item) => item.isGift) : cartItems;

    const selectedCartItems = filteredCartItems.filter((item) => selectedItems.has(item.id));
    const selectedItemsTotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = selectedItemsTotal > 0 ? 0 : 0;
    const totalPayment = selectedItemsTotal + deliveryFee;

    if (cartItems.length === 0) {
        return (
            <section className="bg-border/25 min-h-screen">
                <div className="hidden lg:block pb-6 pt-4 bg-white">
                    <div className="max-w-[600px] mx-auto flex items-center justify-between">
                        <h1 className="text-2xl font-bold">장바구니</h1>
                        <CartBreadcrumb currentPath={location.pathname} />
                    </div>
                </div>

                <div className="text-center py-20 px-4">
                    <div className="mb-6">
                        <div className="w-18 h-18 mx-auto mb-4 rounded-full border border-border/50 bg-white flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="w-10 h-10 fill-description"
                            >
                                <path d="M292.31-115.38q-25.31 0-42.66-17.35-17.34-17.35-17.34-42.65 0-25.31 17.34-42.66 17.35-17.34 42.66-17.34 25.31 0 42.65 17.34 17.35 17.35 17.35 42.66 0 25.3-17.35 42.65-17.34 17.35-42.65 17.35Zm375.38 0q-25.31 0-42.65-17.35-17.35-17.35-17.35-42.65 0-25.31 17.35-42.66 17.34-17.34 42.65-17.34t42.66 17.34q17.34 17.35 17.34 42.66 0 25.3-17.34 42.65-17.35 17.35-42.66 17.35ZM235.23-740 342-515.38h265.38q6.93 0 12.31-3.47 5.39-3.46 9.23-9.61l104.62-190q4.61-8.46.77-15-3.85-6.54-13.08-6.54h-486Zm-19.54-40h520.77q26.08 0 39.23 21.27 13.16 21.27 1.39 43.81l-114.31 208.3q-8.69 14.62-22.58 22.93-13.88 8.31-30.5 8.31H324l-48.62 89.23q-6.15 9.23-.38 20 5.77 10.77 17.31 10.77h415.38q8.54 0 14.27 5.73t5.73 14.27q0 8.53-5.73 14.26-5.73 5.74-14.27 5.74H292.31q-35 0-52.23-29.5-17.23-29.5-.85-59.27l60.15-107.23L152.31-820H100q-8.54 0-14.27-5.73T80-840q0-8.54 5.73-14.27T100-860h57.31q9.46 0 17.15 4.85 7.69 4.84 11.92 13.53L215.69-780ZM342-515.38h280-280Z" />
                            </svg>
                        </div>
                        <p className="text-description mb-6">앗, 장바구니가 비어있어요!</p>
                    </div>

                    <Link
                        to="/"
                        className="inline-block px-8 py-2 bg-accent text-white rounded-md font-semibold hover:bg-accent/90 transition-colors"
                    >
                        쇼핑 계속하기
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-border/25 pb-30">
            <div className="hidden lg:block pb-6 pt-4 bg-white">
                <div className="max-w-[600px] mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold">장바구니</h1>
                    <CartBreadcrumb currentPath={location.pathname} />
                </div>
            </div>

            <div className="max-lg:sticky max-lg:top-[57px] max-lg:h-fit z-10 bg-white max-lg:px-4 max-lg:pt-4 pb-4 border-b border-border">
                <div className="max-w-[600px] mx-auto flex items-center justify-between">
                    <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        label="전체"
                        checkboxClassName="w-5 h-5"
                        labelClassName="text-sm"
                    />
                    <div className="text-sm flex items-center divide-x divide-border">
                        <button
                            type="button"
                            onClick={handleGiftFilter}
                            className={`leading-[1] px-2 hover:text-black flex items-center ${showGiftableOnly ? 'text-accent' : 'text-description'}`}
                        >
                            <svg
                                className={`w-4 h-4 ${showGiftableOnly ? 'text-accent' : 'text-description'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            선물가능
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteSelected}
                            className="leading-[1] px-2 text-description hover:text-black"
                        >
                            선택삭제
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteSoldOut}
                            className="leading-[1] px-2 text-description hover:text-black"
                        >
                            품절삭제
                        </button>
                    </div>
                </div>
            </div>

            <div className="py-5 px-4">
                <div className="max-w-[600px] mx-auto space-y-5">
                    {filteredCartItems.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            isSelected={selectedItems.has(item.id)}
                            onSelect={(checked) => handleSelectItem(item.id, checked)}
                            onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                            onRemove={() => handleRemoveItem(item.id)}
                            onOptionChange={(option, quantity) => handleOptionChange(item.id, option, quantity)}
                        />
                    ))}
                </div>
            </div>

            {/* 하단 요약 */}
            <div className="mb-15">
                <ul className="max-w-[600px] mx-auto text-xs text-description mb-6 space-y-1 list-disc list-outside pl-8 pr-4 lg:pl-4">
                    <li>장바구니에 담은 상품은 30일 후 삭제됩니다.</li>
                    <li>장바구니에는 최대 50개의 상품을 담으실 수 있습니다.</li>
                    <li>무이자 할부 개월수가 서로 다른 상품을 동시 주문 시 가장 짧은 기간 기준으로 무이자 할부가 가능합니다.</li>
                    <li>일부 상품에 대해 결제수단이 제한될 수 있습니다.</li>
                </ul>
            </div>

            {/* Fixed 하단 버튼 */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[600px] w-full bg-white rounded-t-lg shadow-[0_-4px_10px_#0000000d] p-4 z-10">
                {/* 상세 금액 영역 */}
                {isDetailExpanded && (
                    <div className="mb-4 py-3 space-y-2 text-sm border-b border-border">
                        <div className="flex items-center justify-between">
                            <span className="text-description">상품금액</span>
                            <span>{selectedItemsTotal.toLocaleString()}원</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-description">할인금액</span>
                            <span className="text-discount">-0원</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-description">배송비</span>
                            <span>{deliveryFee.toLocaleString()}원</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg text-description">총</span>
                        <span className="text-lg font-semibold">{selectedItems.size}건</span>
                        <button
                            type="button"
                            onClick={() => setIsDetailExpanded(!isDetailExpanded)}
                            className="w-4 h-4 rounded-full border border-description flex items-center justify-center hover:bg-border/25 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className={`w-3 h-3 transition-transform ${isDetailExpanded ? 'rotate-180' : ''}`}
                            >
                                <path d="M480-541.85 317.08-378.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08l179.77-179.77q10.85-10.84 25.31-10.84 14.46 0 25.31 10.84l179.77 179.77q8.3 8.31 8.5 20.89.19 12.57-8.5 21.27-8.7 8.69-21.08 8.69-12.38 0-21.08-8.69L480-541.85Z" />
                            </svg>
                        </button>
                    </div>
                    <div className="text-2xl font-bold">
                        {totalPayment.toLocaleString()}
                        <span className="text-base">원</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="w-32 py-2 text-accent border border-accent rounded-md hover:bg-accent/5 transition-colors flex items-center justify-center gap-1"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-6 h-6 fill-accent"
                        >
                            <path d="M169.23-184.62v-366.15h-7.69q-17.62 0-29.58-11.96Q120-574.69 120-592.31v-93.84q0-17.62 11.96-29.58 11.96-11.96 29.58-11.96h164.15q-11.92-10.54-16.5-25.01-4.57-14.46-4.57-30.38 0-39.74 27.82-67.56T400-878.46q23 0 42.23 10.81 19.23 10.8 33.15 28.11 13.93-17.54 33.16-28.23 19.23-10.69 42.23-10.69 39.74 0 67.56 27.82t27.82 67.56q0 15.62-4.69 30.12-4.69 14.5-16.38 25.27h173.38q17.62 0 29.58 11.96Q840-703.77 840-686.15v93.84q0 17.62-11.96 29.58-11.96 11.96-29.58 11.96h-7.69v366.15q0 26.66-18.98 45.64T726.15-120h-492.3q-26.66 0-45.64-18.98t-18.98-45.64Zm381.54-653.84q-23.54 0-39.46 15.92-15.93 15.92-15.93 39.46t15.93 39.46q15.92 15.93 39.46 15.93t39.46-15.93q15.92-15.92 15.92-39.46t-15.92-39.46q-15.92-15.92-39.46-15.92Zm-206.15 55.38q0 23.54 15.92 39.46 15.92 15.93 39.46 15.93t39.46-15.93q15.92-15.92 15.92-39.46t-15.92-39.46q-15.92-15.92-39.46-15.92t-39.46 15.92q-15.92 15.92-15.92 39.46ZM160-687.69v96.92h300v-96.92H160ZM460-160v-390.77H209.23v366.15q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92H460Zm40 0h226.15q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-366.15H500V-160Zm300-430.77v-96.92H500v96.92h300Z" />
                        </svg>
                        선물하기
                    </button>
                    <Link
                        to="/order"
                        className="flex-1 block text-center py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors font-semibold"
                    >
                        구매하기
                    </Link>
                </div>
            </div>
        </section>
    );
}

interface CartItemProps {
    item: CartItem;
    isSelected: boolean;
    onSelect: (checked: boolean) => void;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
    onOptionChange: (option: string, quantity: number) => void;
}

function CartItem({ item, isSelected, onSelect, onRemove, onOptionChange }: CartItemProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const benefitsList = (benefit: NonNullable<CartItem['benefits']>[0]) => {
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
        <div className="bg-white rounded-lg">
            <div className="p-4">
                {/* 타이틀 */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={isSelected}
                            onChange={onSelect}
                            checkboxClassName="w-5 h-5"
                        />
                        <h3 className="font-semibold leading-[1] truncate">{item.title}</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-description hover:text-black text-xl ml-4"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-5 h-5 fill-description"
                        >
                            <path d="M480-437.85 277.08-234.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L437.85-480 234.92-682.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69L480-522.15l202.92-202.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08 0 12.38-8.69 21.08L522.15-480l202.93 202.92q8.3 8.31 8.5 20.89.19 12.57-8.5 21.27-8.7 8.69-21.08 8.69-12.38 0-21.08-8.69L480-437.85Z" />
                        </svg>
                    </button>
                </div>

                {/* 상품 이미지 */}
                <div className="flex items-center gap-4 py-4">
                    <div className="shrink-0">
                        <div className="aspect-square w-[70px] bg-border/25 rounded overflow-hidden relative">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                            <div className={`absolute bottom-0 left-0 right-0 text-center text-white text-[10px] py-0.5 ${item.isSoldOut ? 'bg-discount/70' : 'bg-black/70'}`}>{item.isSoldOut ? '품절' : '품절임박 2개'}</div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="text-xl font-bold">{item.price.toLocaleString()}원</div>
                        <p className="text-sm">
                            {item.option} 수량 {item.quantity}
                        </p>
                        <p className="text-xs font-semibold mt-1.5">{item.deliveryDate}</p>
                    </div>
                </div>

                {/* 혜택 */}
                {item.benefits && item.benefits.length > 0 && (
                    <div className="rounded bg-border/15 p-4">
                        <div className="flex items-center text-sm mb-1">
                            <span className="font-bold">적용/추가 혜택</span>
                            <InfoTooltip
                                xPosition="right"
                                yPosition="bottom"
                            >
                                <ul className="text-xs space-y-1 list-disc list-outside pl-4 text-description">
                                    <li>장바구니 상품의 맞춤가는 적립금 즉시할인, 일시불 결제할인이 적용된 가격이며, 주문 시 변경 가능합니다.</li>
                                    <li>카드 즉시할인의 경우 주문서에서 해당 카드로 결제 시 추가 할인 가능합니다.</li>
                                    <li>적립금 즉시할인의 경우 주문 시 지급 예정 적립금의 80% 즉시 사용 가능하며, 사용한 적립금은 별도 지급되지 않습니다.</li>
                                </ul>
                            </InfoTooltip>
                        </div>
                        <ul className="space-y-1">
                            {item.benefits.map((benefit, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    {benefitsList(benefit)}
                                    <p className="text-description text-sm">-564,900원</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 하단 버튼 영역 */}
                <div className="flex items-center gap-2 pt-4">
                    <button
                        type="button"
                        className="w-10 h-10 py-2 border border-border rounded hover:bg-border/25 flex items-center justify-center transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-6 h-6 fill-black"
                        >
                            <path d="M169.23-184.62v-366.15h-7.69q-17.62 0-29.58-11.96Q120-574.69 120-592.31v-93.84q0-17.62 11.96-29.58 11.96-11.96 29.58-11.96h164.15q-11.92-10.54-16.5-25.01-4.57-14.46-4.57-30.38 0-39.74 27.82-67.56T400-878.46q23 0 42.23 10.81 19.23 10.8 33.15 28.11 13.93-17.54 33.16-28.23 19.23-10.69 42.23-10.69 39.74 0 67.56 27.82t27.82 67.56q0 15.62-4.69 30.12-4.69 14.5-16.38 25.27h173.38q17.62 0 29.58 11.96Q840-703.77 840-686.15v93.84q0 17.62-11.96 29.58-11.96 11.96-29.58 11.96h-7.69v366.15q0 26.66-18.98 45.64T726.15-120h-492.3q-26.66 0-45.64-18.98t-18.98-45.64Zm381.54-653.84q-23.54 0-39.46 15.92-15.93 15.92-15.93 39.46t15.93 39.46q15.92 15.93 39.46 15.93t39.46-15.93q15.92-15.92 15.92-39.46t-15.92-39.46q-15.92-15.92-39.46-15.92Zm-206.15 55.38q0 23.54 15.92 39.46 15.92 15.93 39.46 15.93t39.46-15.93q15.92-15.92 15.92-39.46t-15.92-39.46q-15.92-15.92-39.46-15.92t-39.46 15.92q-15.92 15.92-15.92 39.46ZM160-687.69v96.92h300v-96.92H160ZM460-160v-390.77H209.23v366.15q0 10.77 6.92 17.7 6.93 6.92 17.7 6.92H460Zm40 0h226.15q10.77 0 17.7-6.92 6.92-6.93 6.92-17.7v-366.15H500V-160Zm300-430.77v-96.92H500v96.92h300Z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 h-10 py-3 text-sm border border-border rounded hover:bg-border/25 flex items-center justify-center transition-colors"
                    >
                        옵션변경
                    </button>
                    <Link
                        to="/order"
                        className="flex-1 h-10 py-3 text-sm border border-accent text-accent font-semibold rounded hover:bg-accent hover:text-white flex items-center justify-center transition-colors"
                    >
                        구매하기
                    </Link>
                </div>
            </div>

            {/* 배송비 정보 */}
            <div className="bg-border/15 px-4 py-3 text-sm border-t border-border">
                <div className="flex justify-between">
                    <span>배송비</span>
                    <span>0원</span>
                </div>
            </div>

            {/* 옵션 변경 모달 */}
            <CartOptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={item}
                onUpdate={(option, quantity) => {
                    onOptionChange(option, quantity);
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}

interface CartOptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: CartItem;
    onUpdate: (option: string, quantity: number) => void;
}

function CartOptionModal({ isOpen, onClose, item, onUpdate }: CartOptionModalProps) {
    const [tempOption, setTempOption] = useState(item.option);
    const [tempQuantity, setTempQuantity] = useState(item.quantity);
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const availableOptions = ['단일상품', '민트', '화이트', '블랙'];

    // 모달 오픈 시 현재 값으로 초기화
    useEffect(() => {
        if (isOpen) {
            setTempOption(item.option);
            setTempQuantity(item.quantity);
        }
    }, [isOpen, item.option, item.quantity]);

    // GSAP 애니메이션
    useGSAP(() => {
        if (isOpen) {
            gsap.fromTo(
                backdropRef.current,
                { opacity: 0 },
                {
                    opacity: 0.5,
                    duration: 0.4,
                    ease: 'power2.inOut',
                }
            );
            gsap.fromTo(
                modalRef.current,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.inOut',
                }
            );
        }
    }, [isOpen]);

    const handleClose = () => {
        gsap.to(backdropRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
        });
        gsap.to(modalRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => onClose(),
        });
    };

    const handleUpdate = () => {
        onUpdate(tempOption, tempQuantity);
        handleClose();
    };

    const handleQuantityChange = (delta: number) => {
        setTempQuantity((prev) => Math.max(1, prev + delta));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-11 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="absolute bottom-0 max-w-[600px] w-full bg-white rounded-t-lg shadow-[0_-4px_10px_#0000000d] p-4"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">옵션변경</h3>
                    <button
                        type="button"
                        onClick={handleClose}
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

                {/* Content */}
                <div className="space-y-3">
                    {/* 옵션 선택 */}
                    <div>
                        <label
                            className="sr-only"
                            htmlFor="option-select"
                        >
                            옵션
                        </label>
                        <select
                            id="option-select"
                            value={tempOption}
                            onChange={(e) => setTempOption(e.target.value)}
                            className="w-full px-4 py-3 text-sm border border-border rounded-md appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
                        >
                            {availableOptions.map((option) => (
                                <option
                                    key={option}
                                    value={option}
                                >
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 수량 선택 */}
                    <div>
                        <label
                            className="sr-only"
                            htmlFor="quantity-select"
                        >
                            수량
                        </label>
                        <div className="flex items-center justify-center border border-border rounded-md">
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(-1)}
                                className="shrink-0  w-11 py-2 text-lg font-semibold hover:bg-border/25 transition-colors"
                            >
                                -
                            </button>
                            <div className="flex-1 py-2 text-center text-lg font-semibold border-x border-border">{tempQuantity}</div>
                            <button
                                type="button"
                                onClick={() => handleQuantityChange(1)}
                                className="shrink-0 w-11 py-2 text-lg font-semibold hover:bg-border/25 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8">
                    <button
                        type="button"
                        onClick={handleUpdate}
                        className="w-full py-3 bg-accent text-white font-semibold rounded-md hover:bg-accent/90 transition-colors"
                    >
                        변경
                    </button>
                </div>
            </div>
        </div>
    );
}
