import { useState } from 'react';

import { Checkbox } from '@/components/ui/Checkbox';
import { AddressModal } from '@/components/ui/AddressModal';

import type { AddressData } from '@/components/ui/AddressModal';

// 할인/쿠폰적용 및 적립금/포인트 인터페이스
interface AvailableDiscount {
    id: number;
    type: 'coupon' | 'auto' | 'card';
    name: string;
    discountRate?: number; // 퍼센트 할인
    discountAmount?: number; // 고정 금액 할인
    maxDiscount?: number; // 최대 할인 금액
}

interface ProductItem {
    id: number;
    title: string;
    option: string;
    price: number;
    quantity: number;
    image: string;
    availableDiscounts: AvailableDiscount[];
}

interface PointsReward {
    id: number;
    name: string;
    amount: number;
    unit: string;
}

interface CardCompany {
    id: string;
    name: string;
    logo: string;
    hasDiscount?: boolean;
    discountRate?: number;
}

interface PaymentUiProps {
    onPayment: () => void;
    visibleDeliveryAddress?: boolean;
}

// 샘플 데이터 (배송지)
const sampleDeliveryAddress: AddressData = {
    address: '서울 강남구 가로수길 5 (신사동)',
    detailAddress: '0',
    entryDetail: '',
    entryMethod: '자유출입가능',
    phoneNumber: '12345678',
    phonePrefix: '010',
    recipientName: '홍길동',
    zipCode: '06035',
};

// 샘플 데이터 (장바구니에서 가져온 데이터를 간소화)
const productCartItems: ProductItem[] = [
    {
        id: 2,
        title: '[TV] 미나투고 디럭스 플러스 LED (푸쉬바 포함)',
        option: '민트',
        price: 183200,
        quantity: 1,
        image: '/images/product/product-1-5.jpg',
        availableDiscounts: [
            { id: 1, type: 'coupon', name: '신규회원 10% 할인쿠폰', discountRate: 10, maxDiscount: 20000 },
            { id: 2, type: 'coupon', name: '5000원 할인쿠폰', discountAmount: 5000 },
            { id: 3, type: 'card', name: '카드 즉시할인', discountRate: 5, maxDiscount: 10000 },
        ],
    },
];

export function PaymentUi({ visibleDeliveryAddress, onPayment }: PaymentUiProps) {
    // 상태 관리
    const [savedAddress, setSavedAddress] = useState<AddressData | null>(sampleDeliveryAddress);
    const [selectedDiscounts, setSelectedDiscounts] = useState<Map<number, AvailableDiscount | null>>(new Map());
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [isDiscountInfoModalOpen, setIsDiscountInfoModalOpen] = useState(false);
    const [selectedPointsRewards, setSelectedPointsRewards] = useState<Set<number>>(new Set());
    const [pointsRewardAmounts, setPointsRewardAmounts] = useState<Map<number, number>>(new Map());

    // 결제 관련 상태
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('kakaopay');
    const [selectedCard, setSelectedCard] = useState<CardCompany | null>(null);
    const [selectedInstallment, setSelectedInstallment] = useState('0');
    const [isPaymentInfoModalOpen, setIsPaymentInfoModalOpen] = useState(false);
    const [isCardBenefitModalOpen, setIsCardBenefitModalOpen] = useState(false);
    const [isCardSelectionModalOpen, setIsCardSelectionModalOpen] = useState(false);

    // 개인정보 동의 아코디언 상태
    const [isPrivacyAccordionOpen, setIsPrivacyAccordionOpen] = useState(false);

    // 배송 요청사항 상태
    const [selectedDeliveryRequest, setSelectedDeliveryRequest] = useState('');
    const [customDeliveryRequest, setCustomDeliveryRequest] = useState('');

    // 전체 할인 금액 계산
    const totalDiscountAmount = productCartItems.reduce((total, item) => {
        const selectedDiscount = selectedDiscounts.get(item.id);
        if (!selectedDiscount) return total;

        if (selectedDiscount.discountAmount) {
            return total + selectedDiscount.discountAmount;
        } else if (selectedDiscount.discountRate) {
            const itemTotal = item.price * item.quantity;
            const discountAmount = Math.floor(itemTotal * (selectedDiscount.discountRate / 100));
            const maxDiscount = selectedDiscount.maxDiscount || discountAmount;
            return total + Math.min(discountAmount, maxDiscount);
        }
        return total;
    }, 0);

    // 사용하는 포인트/적립금 총액 계산
    const totalPointsUsed = Array.from(pointsRewardAmounts.values()).reduce((sum, amount) => sum + amount, 0);

    // 상품 총 금액 계산
    const originalTotalAmount = productCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    // 최종 결제 금액 계산 (상품 금액 - 할인 - 포인트 사용)
    const totalAmount = originalTotalAmount - totalDiscountAmount - totalPointsUsed;

    // 적립금/포인트 샘플 데이터
    const pointsRewards: PointsReward[] = [
        {
            id: 1,
            name: 'CJ ONE',
            amount: 1303,
            unit: 'P',
        },
    ];

    // 카드사 샘플 데이터
    const cardCompanies: CardCompany[] = [
        { id: 'hyundai', name: '현대카드', logo: '/images/icon/hyundaicard.png', hasDiscount: true, discountRate: 5 },
        { id: 'woori', name: '우리카드(우리페이)', logo: '/images/icon/wooricard.jpeg' },
    ];

    const handlePointsRewardToggle = (id: number) => {
        const newSelected = new Set(selectedPointsRewards);
        if (newSelected.has(id)) {
            newSelected.delete(id);
            // 체크 해제시 입력값도 초기화
            const newAmounts = new Map(pointsRewardAmounts);
            newAmounts.delete(id);
            setPointsRewardAmounts(newAmounts);
        } else {
            newSelected.add(id);
        }
        setSelectedPointsRewards(newSelected);
    };

    const handlePointsRewardAmountChange = (id: number, amount: number, maxAmount: number) => {
        const newAmounts = new Map(pointsRewardAmounts);
        const validAmount = Math.min(Math.max(0, amount), maxAmount);
        newAmounts.set(id, validAmount);
        setPointsRewardAmounts(newAmounts);
    };

    const handleDiscountApply = (appliedDiscounts: Map<number, AvailableDiscount | null>) => {
        // 할인 적용 로직
        setSelectedDiscounts(appliedDiscounts);
        setIsDiscountModalOpen(false);
    };

    const handlePayment = () => {
        onPayment();
    };

    return (
        <div className="space-y-4 max-lg:px-4">
            {/* 배송지 섹션 */}
            {savedAddress && visibleDeliveryAddress && (
                <div className="bg-white rounded p-4 border border-border">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-base lg:text-xl font-bold">배송지</h2>
                        <button
                            type="button"
                            onClick={() => setIsAddressModalOpen(true)}
                            className="px-4 py-1 lg:py-2 text-xs lg:text-sm border border-border rounded hover:bg-border/25 transition-colors"
                        >
                            변경
                        </button>
                    </div>

                    {/* 배송지 정보 */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-sm">
                                {savedAddress.recipientName} <span className="text-accent font-normal">기본배송지</span>
                            </p>
                        </div>

                        <div className="mb-4 space-y-1 text-sm">
                            <p>
                                {savedAddress.address} ({savedAddress.zipCode})
                            </p>
                            <p>
                                {savedAddress.phonePrefix}-{savedAddress.phoneNumber}
                            </p>
                        </div>

                        {/* 배송 요청사항 선택 */}
                        <div className="space-y-2">
                            <select
                                value={selectedDeliveryRequest}
                                onChange={(e) => {
                                    setSelectedDeliveryRequest(e.target.value);
                                    // 직접 입력이 아닌 다른 옵션 선택 시 커스텀 입력값 초기화
                                    if (e.target.value !== 'custom') {
                                        setCustomDeliveryRequest('');
                                    }
                                }}
                                className="w-full p-3 text-sm border border-border rounded bg-white focus:outline-none focus:border-accent appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNS4yOTMgNy4yOTNhMSAxIDAgMDExLjQxNCAwTDEwIDEwLjU4NmwzLjI5My0zLjI5M2ExIDEgMCAxMTEuNDE0IDEuNDE0bC00IDRhMSAxIDAgMDEtMS40MTQgMGwtNC00YTEgMSAwIDAxMC0xLjQxNHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px]"
                            >
                                <option value="">배송 요청사항 선택</option>
                                <option value="security">경비실</option>
                                <option value="door">문 앞</option>
                                <option value="direct">직접 받음</option>
                                <option value="contact">부재 시 연락</option>
                                <option value="custom">직접 입력(20자이내)</option>
                            </select>

                            {/* 직접 입력 텍스트 필드 */}
                            {selectedDeliveryRequest === 'custom' && (
                                <input
                                    type="text"
                                    value={customDeliveryRequest}
                                    onChange={(e) => setCustomDeliveryRequest(e.target.value)}
                                    maxLength={20}
                                    placeholder="배송 요청사항을 입력해주세요 (최대 20자)"
                                    className="w-full p-3 text-sm border border-border rounded bg-white focus:outline-none focus:border-accent"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 할인/쿠폰적용 섹션 */}
            <div className="bg-white rounded p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base lg:text-xl font-bold">할인/쿠폰적용</h2>
                    <button
                        type="button"
                        onClick={() => setIsDiscountModalOpen(true)}
                        className="px-4 py-1 lg:py-2 text-xs lg:text-sm border border-border rounded hover:bg-border/25 transition-colors"
                    >
                        변경
                    </button>
                </div>

                {/* 상품 리스트 */}
                <div className="space-y-3 mb-4">
                    {productCartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3"
                        >
                            <div className="shrink-0">
                                <div className="aspect-square w-[50px] bg-border/25 rounded overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm leading-tight">{item.title}</p>
                                <p className="text-xs text-description">
                                    {item.option} | 수량 {item.quantity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 할인 정보 및 변경 버튼 */}
                <div className="flex items-center gap-2">
                    <span className="text-sm lg:text-base font-semibold">할인자동적용</span>
                    <span className="text-base lg:text-lg font-bold text-discount">{totalDiscountAmount.toLocaleString()}원</span>
                    <button
                        type="button"
                        onClick={() => setIsDiscountInfoModalOpen(true)}
                        className="w-4 h-4 rounded-full bg-description text-white flex items-center justify-center text-xs"
                    >
                        ?
                    </button>
                </div>
            </div>

            {/* 적립금/포인트 섹션 */}
            <div className="bg-white rounded p-4 border border-border">
                <h2 className="text-base lg:text-xl font-bold mb-2">적립금/포인트</h2>

                <div className="space-y-2">
                    {pointsRewards.map((reward) => {
                        const isSelected = selectedPointsRewards.has(reward.id);
                        const currentAmount = pointsRewardAmounts.get(reward.id) || 0;

                        return (
                            <div
                                key={reward.id}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={() => handlePointsRewardToggle(reward.id)}
                                        checkboxClassName="w-4 h-4"
                                        label={`${reward.name} (${reward.amount.toLocaleString()}${reward.unit})`}
                                    />
                                </div>
                                <div className="text-right flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={currentAmount}
                                        onChange={(e) => handlePointsRewardAmountChange(reward.id, parseInt(e.target.value) || 0, reward.amount)}
                                        disabled={!isSelected}
                                        min="0"
                                        max={reward.amount}
                                        className={`w-20 px-2 py-1 text-sm rounded border border-border text-right focus:outline-none focus:border-accent ${!isSelected ? 'bg-border/25 text-description cursor-not-allowed' : 'border-border'}`}
                                        placeholder="0"
                                    />
                                    <span className="text-sm font-bold">{reward.unit}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 결제수단 섹션 */}
            <div className="bg-white rounded p-4 border border-border">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base lg:text-xl font-bold">결제수단</h2>
                        <button
                            type="button"
                            onClick={() => setIsPaymentInfoModalOpen(true)}
                            className="w-4 h-4 rounded-full bg-description text-white flex items-center justify-center text-xs"
                        >
                            ?
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCardBenefitModalOpen(true)}
                        className="flex items-center text-xs lg:text-sm hover:underline"
                    >
                        <span>즉시할인/무이자혜택안내</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-4 h-4 fill-current"
                        >
                            <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                        </svg>
                    </button>
                </div>

                {/* 공지 영역 */}
                <div className="mb-2">
                    <div className="flex items-center gap-2">
                        <span className="shrink-0 text-xs lg:text-sm text-accent font-bold">공지</span>
                        <span className="text-xs lg:text-sm text-accent">8/1~8/31 네이버페이3만원이상결제시1천원적립(기간내총3회, 3천원)</span>
                    </div>
                </div>

                {/* 카카오페이 결제 */}
                <div className="mb-3">
                    <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('kakaopay')}
                        className={`w-full p-3 border rounded text-center transition-colors ${selectedPaymentMethod === 'kakaopay' ? 'border-accent text-accent font-bold' : 'border-border hover:bg-border/25'}`}
                    >
                        <div className="text-sm">
                            <img
                                src="images/icon/kakaopay.svg"
                                alt="카카오페이"
                                className="h-5 mx-auto object-contain"
                            />
                        </div>
                    </button>
                </div>

                {/* 원클릭 결제 */}
                <div className="overflow-hidden bg-white rounded mb-3 border border-border">
                    <div className="py-3 bg-border/25 text-center font-bold text-sm">원클릭 결제</div>
                    <div className="flex flex-col items-center justify-center py-6">
                        <div className="mb-2">
                            <button
                                type="button"
                                className="p-2 bg-border/50 rounded-full"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="w-8 h-8 fill-description"
                                >
                                    <path d="M479.99-140q-12.76 0-21.37-8.63Q450-157.25 450-170v-280H170q-12.75 0-21.37-8.63-8.63-8.63-8.63-21.38 0-12.76 8.63-21.37Q157.25-510 170-510h280v-280q0-12.75 8.63-21.37 8.63-8.63 21.38-8.63 12.76 0 21.37 8.63Q510-802.75 510-790v280h280q12.75 0 21.37 8.63 8.63 8.63 8.63 21.38 0 12.76-8.63 21.37Q802.75-450 790-450H510v280q0 12.75-8.63 21.37-8.63 8.63-21.38 8.63Z" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm mb-1">카드 등록하고 빠르게 결제하기</p>
                        <p className="text-xs font-bold text-accent">현대카드 즉시할인 5%</p>
                    </div>
                </div>

                {/* 결제 방법 그리드 */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('credit-card')}
                        className={`w-full p-3 border rounded text-center transition-colors ${selectedPaymentMethod === 'credit-card' ? 'border-accent text-accent font-bold' : 'border-border hover:bg-border/25'}`}
                    >
                        <div className="text-xs lg:text-sm">신용카드</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('cash')}
                        className={`w-full p-3 border rounded text-center transition-colors ${selectedPaymentMethod === 'cash' ? 'border-accent text-accent font-bold' : 'border-border hover:bg-border/25'}`}
                    >
                        <div className="text-xs lg:text-sm">현금간편결제</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('naverpay')}
                        className={`w-full p-3 border rounded text-center transition-colors ${selectedPaymentMethod === 'naverpay' ? 'border-accent text-accent font-bold' : 'border-border hover:bg-border/25'}`}
                    >
                        <div className="text-xs lg:text-sm">
                            <img
                                src="images/icon/naverpay.svg"
                                alt="네이버페이"
                                className="h-5 mx-auto object-contain"
                            />
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('payco')}
                        className={`w-full p-3 border rounded text-center transition-colors ${selectedPaymentMethod === 'payco' ? 'border-accent text-accent font-bold' : 'border-border hover:bg-border/25'}`}
                    >
                        <div className="text-xs lg:text-sm">
                            <img
                                src="images/icon/payco.svg"
                                alt="페이코"
                                className="h-4 mx-auto object-contain"
                            />
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('samsungpay')}
                        className={`w-full p-3 border rounded text-center transition-colors ${selectedPaymentMethod === 'samsungpay' ? 'border-accent text-accent font-bold' : 'border-border hover:bg-border/25'}`}
                    >
                        <div className="text-xs lg:text-sm">
                            <img
                                src="images/icon/samsungpay.png"
                                alt="삼성페이"
                                className="h-4 mx-auto object-contain"
                            />
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('smilepay')}
                        className={`w-full p-3 border rounded text-center transition-colors ${selectedPaymentMethod === 'smilepay' ? 'border-accent text-accent font-bold' : 'border-border hover:bg-border/25'}`}
                    >
                        <div className="text-xs lg:text-sm">
                            <img
                                src="images/icon/smilepay.webp"
                                alt="스마일페이"
                                className="h-5 mx-auto object-contain"
                            />
                        </div>
                    </button>
                </div>

                {/* 카드 선택 */}
                {(selectedPaymentMethod === 'kakaopay' || selectedPaymentMethod === 'credit-card' || selectedPaymentMethod === 'smilepay') && (
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => setIsCardSelectionModalOpen(true)}
                            className="w-full p-3 border border-border rounded bg-white text-left flex items-center justify-between hover:bg-border/25 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                {selectedCard ? (
                                    <>
                                        <span className="text-sm font-medium">{selectedCard.name}</span>
                                        <img
                                            src={selectedCard.logo}
                                            alt={selectedCard.name}
                                            className="h-3"
                                        />
                                    </>
                                ) : (
                                    <span className="text-sm text-description">카드를 선택해주세요</span>
                                )}
                            </div>
                            <svg
                                className="w-4 h-4 text-description"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        {selectedPaymentMethod === 'credit-card' && (
                            <select
                                value={selectedInstallment}
                                onChange={(e) => setSelectedInstallment(e.target.value)}
                                className="w-full p-3 text-sm border border-border rounded bg-white focus:outline-none focus:border-accent appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNNS4yOTMgNy4yOTNhMSAxIDAgMDExLjQxNCAwTDEwIDEwLjU4NmwzLjI5My0zLjI5M2ExIDEgMCAxMTEuNDE0IDEuNDE0bC00IDRhMSAxIDAgMDEtMS40MTQgMGwtNC00YTEgMSAwIDAxMC0xLjQxNHoiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px]"
                            >
                                <option value="0">일시불</option>
                                <option value="2">2개월</option>
                                <option value="3">3개월</option>
                                <option value="6">6개월</option>
                                <option value="12">12개월</option>
                                <option value="24">24개월</option>
                            </select>
                        )}
                    </div>
                )}

                {/* 신용 카드 혜택 */}
                {selectedPaymentMethod === 'credit-card' && (
                    <ul className="mt-3 space-y-1.5">
                        <li className="w-full py-2 text-center text-xs rounded bg-accent/5 text-accent">
                            <strong>현대카드, 우리카드</strong>로 결제하면 <strong>즉시할인 5%</strong>
                        </li>
                        <li className="w-full py-2 text-center text-xs rounded bg-border/25">
                            <strong>CJ삼성iD카드</strong>로 결제하면 <strong>청구할인 7%</strong>
                        </li>
                        <li className="w-full py-2 text-center text-xs rounded bg-border/25">
                            <strong>CJ카드</strong>로 결제하면 <strong>청구할인 5%</strong>
                        </li>
                    </ul>
                )}
            </div>

            {/* 결제수단 섹션 */}
            <div className="bg-white rounded p-4 border border-border">
                <h2 className="text-base lg:text-xl font-bold mb-2">결제금액</h2>
                <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-sm text-description">주문금액</span>
                    <span className="text-base lg:text-lg">{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="text-right pt-2 lg:pt-4">
                    <p>
                        <span className="text-xl lg:text-2xl font-semibold">{totalAmount.toLocaleString()}</span>원
                    </p>
                </div>
            </div>

            {/* 주문 및 개인정보 수집이용 동의 */}
            <div className="my-8">
                <p className="font-semibold mb-2">주문 및 개인정보 수집/이용에 동의합니다</p>

                {/* 개인정보 수집 및 이용안내 아코디언 */}
                <div className="border border-border rounded">
                    <button
                        type="button"
                        onClick={() => setIsPrivacyAccordionOpen(!isPrivacyAccordionOpen)}
                        className="w-full px-4 py-2 text-left flex items-center justify-between hover:bg-border/10 transition-colors"
                    >
                        <div className="flex items-center gap-1">
                            <span className="text-sm">개인정보 수집 및 이용안내</span>
                            <span className="text-accent text-sm">(필수)</span>
                        </div>
                        <svg
                            className={`w-5 h-5 text-description transition-transform ${isPrivacyAccordionOpen ? 'rotate-180' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>

                    {isPrivacyAccordionOpen && (
                        <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-border/50 pt-4">
                            <div className="space-y-3">
                                <div>
                                    <strong className="text-black">1. 개인정보 수집 목적:</strong> 주문에 따른 청구 및 배송지 확보, 이전 배송지 조회 서비스 제공(전자상거래법제13조)
                                </div>
                                <div>
                                    <strong className="text-black">2. 개인정보 수집 항목:</strong>
                                    <br />
                                    <span className="text-gray-500">[회원]</span> 이름, 연락처, 배송지 주소, 결제수단 정보
                                    <br />
                                    <span className="text-gray-500">[비회원]</span> 이름, 이메일 주소, 연락처, 배송지 주소, 결제수단 정보, 비밀번호
                                </div>
                                <div>
                                    <strong className="text-black">3. 보유 및 이용기간:</strong> 배송완료시 또는 재사용등의시까지
                                </div>
                                <div className="text-gray-600">해당 정보는 서비스 제공에 필요한 필수 정보로 거부하실 권리가 있으나, 거부하실 경우 서비스 이용이 불가합니다</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 결제 버튼 */}
            <div>
                <button
                    className="w-full bg-accent text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-accent/95 transition-colors"
                    onClick={handlePayment}
                >
                    {totalAmount.toLocaleString()}원 결제하기
                </button>
            </div>

            {/* 배송지 입력 모달 */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onAddressSave={(addressData) => {
                    setSavedAddress(addressData);
                }}
            />

            {/* 할인/쿠폰 변경 모달 */}
            <DiscountModal
                isOpen={isDiscountModalOpen}
                onClose={() => setIsDiscountModalOpen(false)}
                onApply={handleDiscountApply}
                items={productCartItems}
                currentDiscounts={selectedDiscounts}
            />

            {/* 할인자동적용 정보 모달 */}
            <DiscountInfoModal
                totalDiscountAmount={totalDiscountAmount}
                isOpen={isDiscountInfoModalOpen}
                onClose={() => setIsDiscountInfoModalOpen(false)}
            />

            {/* 결제시 유의사항 모달 */}
            <PaymentInfoModal
                isOpen={isPaymentInfoModalOpen}
                onClose={() => setIsPaymentInfoModalOpen(false)}
            />

            {/* 카드혜택안내 모달 */}
            <CardBenefitModal
                isOpen={isCardBenefitModalOpen}
                onClose={() => setIsCardBenefitModalOpen(false)}
            />

            {/* 신용카드선택 모달 */}
            <CardSelectionModal
                isOpen={isCardSelectionModalOpen}
                onClose={() => setIsCardSelectionModalOpen(false)}
                cardCompanies={cardCompanies}
                selectedCard={selectedCard}
                onCardSelect={(card) => {
                    setSelectedCard(card);
                    setIsCardSelectionModalOpen(false);
                }}
            />
        </div>
    );
}

// 할인/쿠폰 변경 모달 컴포넌트
interface DiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (discounts: Map<number, AvailableDiscount | null>) => void;
    items: ProductItem[];
    currentDiscounts: Map<number, AvailableDiscount | null>;
}

function DiscountModal({ isOpen, onClose, onApply, items, currentDiscounts }: DiscountModalProps) {
    const [selectedDiscounts, setSelectedDiscounts] = useState<Map<number, AvailableDiscount | null>>(new Map(currentDiscounts));

    // 할인 금액 계산 함수
    const calculateDiscountAmount = (item: ProductItem, discount: AvailableDiscount) => {
        if (discount.discountAmount) {
            return discount.discountAmount;
        } else if (discount.discountRate) {
            const itemTotal = item.price * item.quantity;
            const discountAmount = Math.floor(itemTotal * (discount.discountRate / 100));
            const maxDiscount = discount.maxDiscount || discountAmount;
            return Math.min(discountAmount, maxDiscount);
        }
        return 0;
    };

    // 전체 할인 금액 계산
    const totalSelectedDiscount = items.reduce((total, item) => {
        const selectedDiscount = selectedDiscounts.get(item.id);
        if (!selectedDiscount) return total;
        return total + calculateDiscountAmount(item, selectedDiscount);
    }, 0);

    const handleDiscountSelect = (itemId: number, discount: AvailableDiscount | null) => {
        const newSelectedDiscounts = new Map(selectedDiscounts);
        newSelectedDiscounts.set(itemId, discount);
        setSelectedDiscounts(newSelectedDiscounts);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-lg shadow-lg max-h-[550px] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold">할인/쿠폰적용</h3>
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

                {/* 스크롤 가능한 컨텐츠 영역 */}
                <div className="flex-1 overflow-y-auto p-4">
                    {/* 상품 정보 */}
                    <div className="space-y-4 mb-6">
                        {items.map((item) => {
                            const selectedDiscount = selectedDiscounts.get(item.id);
                            const selectedDiscountAmount = selectedDiscount ? calculateDiscountAmount(item, selectedDiscount) : 0;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-4 p-4 bg-border/15 rounded"
                                >
                                    <div className="shrink-0">
                                        <div className="aspect-square w-[70px] bg-border/25 rounded overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold leading-tight mb-2">{item.title}</p>
                                        <div className="space-y-1 text-xs text-description">
                                            <p>
                                                {item.option} | 수량 {item.quantity}
                                            </p>
                                            <p>무료배송</p>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <p className="text-lg font-bold">{item.price.toLocaleString()}원</p>
                                            {selectedDiscountAmount > 0 && <p className="text-sm font-bold text-accent">할인: -{selectedDiscountAmount.toLocaleString()}원</p>}
                                        </div>

                                        {/* 할인 선택 selectbox */}
                                        <div className="mt-1">
                                            <select
                                                value={selectedDiscount?.id || ''}
                                                onChange={(e) => {
                                                    const discountId = parseInt(e.target.value);
                                                    if (isNaN(discountId)) {
                                                        handleDiscountSelect(item.id, null);
                                                    } else {
                                                        const discount = item.availableDiscounts.find((d) => d.id === discountId);
                                                        if (discount) {
                                                            handleDiscountSelect(item.id, discount);
                                                        }
                                                    }
                                                }}
                                                className="w-full px-3 py-2 text-xs border border-border bg-white focus:outline-none focus:border-accent appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_8px]"
                                            >
                                                <option value="">할인 미적용</option>
                                                {item.availableDiscounts.map((discount) => {
                                                    const discountAmount = calculateDiscountAmount(item, discount);
                                                    return (
                                                        <option
                                                            key={discount.id}
                                                            value={discount.id}
                                                        >
                                                            {discount.name} (-{discountAmount.toLocaleString()}원)
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 모달 푸터 */}
                <div className="p-4 border-t border-border">
                    <button
                        type="button"
                        onClick={() => onApply(selectedDiscounts)}
                        className="w-full py-3 bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
                    >
                        {totalSelectedDiscount.toLocaleString()}원 할인적용하기
                    </button>
                </div>
            </div>
        </div>
    );
}

// 할인자동적용 정보 모달 컴포넌트
interface DiscountInfoModalProps {
    totalDiscountAmount: number;
    isOpen: boolean;
    onClose: () => void;
}

function DiscountInfoModal({ isOpen, onClose, totalDiscountAmount }: DiscountInfoModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold">할인적용</h3>
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

                {/* 컨텐츠 */}
                <div className="p-4">
                    <div className="flex items-center justify-between lg:py-2">
                        <p className="text-lg lg:text-xl font-bold">할인적용</p>
                        <p className="text-lg lg:text-xl font-bold text-discount">{totalDiscountAmount.toLocaleString()}원</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 결제시 유의사항 모달 컴포넌트
interface PaymentInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function PaymentInfoModal({ isOpen, onClose }: PaymentInfoModalProps) {
    if (!isOpen) return null;

    const paymentNotices = [
        '즉시할인은 결제 시 할인 후 결제됩니다.',
        '청구할인은 대금청구 시점에 차감 적구됩니다.',
        '무통장입금으로 주문하신 후, 고객센터(1644-2525)로 연락주시면 카드결제로 변경하실 수 있습니다. (단, 카드결제로 변경 시 즉시/청구할인 프로모션은 제외되며, 상품권 등 일부상품은 카드결제로 불가합니다.)',
        '간편결제를 이용하시는 경우 무이자할부는 CJonstyle 기준과 다르게 적용됩니다.',
        "간편결제 할인 행사 시 결제수단에서 '신용카드','선택 후 간편결제(삼성페이, 페이코 등)로 결제 시 할인 적용이 불가합니다.",
        '주문 후 CJ기프트카드를 떼기, 사용정지 할 경우 취소/반품으로 인한 환불 요청 시 CJonstyle 적립금으로 환불됩니다.',
        '도서공연비 소득공제 대상 상품의 경우 결제수단에 따라 소득공제 적용 여부가 달라 질 수 있습니다. (신용카드, 현금영수증 처리 가능 결제수단에 한함)',
        '제휴/기획전 상품인 경우에도 도서공연비 소득공제처리가 불가할 수 있습니다.',
        '도서공연비 대상 상품과 미대상 상품 복합 결제시 도서공연비 소득공제는 불가합니다.',
        '구매자가 미성년자일 경우, 법정대리인이 그 책임에 동의하지 아니하면 미성년자 본인 또는 법정대리인이 그 계약을 취소할 수 있습니다.',
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-lg shadow-lg max-h-[550px] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold">결제시 유의사항</h3>
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

                {/* 컨텐츠 */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        <h5 className="font-semibold text-base">유의사항</h5>
                        <ul className="space-y-2 text-sm text-description">
                            {paymentNotices.map((notice, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2"
                                >
                                    <span className="text-description">•</span>
                                    <span>{notice}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 카드혜택안내 모달 컴포넌트
interface CardBenefitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function CardBenefitModal({ isOpen, onClose }: CardBenefitModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-lg shadow-lg max-h-[550px] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold">카드혜택안내</h3>
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

                {/* 컨텐츠 */}
                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8 space-y-6 lg:space-y-10">
                    {/* 즉시할인 */}
                    <div>
                        <p className="font-semibold text-base lg:text-lg mb-2 lg:mb-4">즉시할인</p>
                        <ul className="space-y-3 lg:space-y-5">
                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-[75px] lg:w-[100px] max-h-[30px]">
                                        <img
                                            src="images/icon/hyundaicard.png"
                                            alt="현대카드"
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-xs lg:text-sm">현대카드 3% (50,000원 이상)</span>
                                </div>
                            </li>
                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-[75px] lg:w-[100px] max-h-[30px]">
                                        <img
                                            src="images/icon/hyundaicard.png"
                                            alt="현대카드"
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-xs lg:text-sm">현대카드 3% (50,000원 이상)</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* 청구할인 */}
                    <div>
                        <p className="font-semibold text-base lg:text-lg mb-2 lg:mb-4">청구할인</p>
                        <ul className="space-y-5">
                            <li className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-[75px] lg:w-[100px] max-h-[30px]">
                                        <img
                                            src="images/icon/wooricard.jpeg"
                                            alt="우리카드"
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="text-xs lg:text-sm">우리카드 3% (50,000원 이상)</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 신용카드선택 모달 컴포넌트
interface CardSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    cardCompanies: CardCompany[];
    selectedCard: CardCompany | null;
    onCardSelect: (card: CardCompany) => void;
}

function CardSelectionModal({ isOpen, onClose, cardCompanies, selectedCard, onCardSelect }: CardSelectionModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-lg shadow-lg max-h-[550px] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold">신용카드선택</h3>
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

                {/* 컨텐츠 */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-3 gap-3">
                        {cardCompanies.map((card) => (
                            <button
                                key={card.id}
                                type="button"
                                onClick={() => onCardSelect(card)}
                                className={`relative overflow-hidden p-4 h-[74px] border rounded hover:bg-border/25 transition-colors ${selectedCard?.id === card.id ? 'border-accent' : 'border-border'}`}
                            >
                                {card.hasDiscount && (
                                    <div className="absolute top-0 left-0">
                                        <span className="block bg-accent text-white text-[10px] font-semibold px-1 py-0.5 leading-[1] rounded-br">즉시할인{card.discountRate}%</span>
                                    </div>
                                )}
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <img
                                        src={card.logo}
                                        alt={card.name}
                                        className="h-3"
                                    />
                                    <p className="text-xs font-medium text-center">{card.name}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
