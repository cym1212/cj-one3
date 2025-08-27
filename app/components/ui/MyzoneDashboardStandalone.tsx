import * as React from 'react';

// Props 인터페이스 정의
interface UserInfo {
    name: string;
    membershipMessage?: string;
}

interface BenefitItem {
    label: string;
    value: string | number;
    unit?: string;
    href?: string;
}

interface OrderStatus {
    label: string;
    count: number;
    href: string;
    isActive?: boolean;
}

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

interface MyzoneDashboardProps {
    userInfo?: UserInfo;
    benefits?: BenefitItem[];
    orderStatuses?: OrderStatus[];
    cancelExchangeReturn?: {
        cancel: number;
        exchange: number;
        return: number;
    };
    recentOrders?: OrderItem[];
    onLinkClick?: (href: string, label: string) => void;
    onButtonClick?: (action: string, data?: any) => void;
}

// 기본 데이터
const defaultUserInfo: UserInfo = {
    name: "홍길동",
    membershipMessage: "1건만 구매하면 프렌즈가 됩니다"
};

const defaultBenefits: BenefitItem[] = [
    { label: "적립금", value: 0, unit: "원", href: "/myzone/credit" },
    { label: "방송상품지원금", value: 0, unit: "원", href: "/myzone/credit" },
    { label: "CJ ONE 포인트", value: 1303, unit: "P", href: "/myzone/credit" },
    { label: "쿠폰", value: 0, unit: "개", href: "/myzone/credit" }
];

const defaultOrderStatuses: OrderStatus[] = [
    { label: "주문접수", count: 0, href: "/myzone/orders?status=all" },
    { label: "결제완료", count: 1, href: "/myzone/orders?status=all", isActive: true },
    { label: "상품준비중", count: 0, href: "/myzone/orders?status=all" },
    { label: "배송중", count: 0, href: "/myzone/orders?status=all" },
    { label: "배송완료", count: 0, href: "/myzone/orders?status=all" }
];

const defaultRecentOrders: OrderItem[] = [
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

// 유틸리티 함수들
const formatCurrency = (value: number) => value.toLocaleString('ko-KR');

const formatDeliveryDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = dayNames[date.getDay()];
    return `${month}/${day}(${dayOfWeek})`;
};

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4 fill-current">
        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
    </svg>
);

const MobileChevronIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="lg:hidden w-5 h-5 fill-current">
        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
    </svg>
);

export default function MyzoneDashboardStandalone({
    userInfo = defaultUserInfo,
    benefits = defaultBenefits,
    orderStatuses = defaultOrderStatuses,
    cancelExchangeReturn = { cancel: 0, exchange: 0, return: 0 },
    recentOrders = defaultRecentOrders,
    onLinkClick,
    onButtonClick
}: MyzoneDashboardProps) {

    const handleLinkClick = (href: string, label: string, event: React.MouseEvent) => {
        if (onLinkClick) {
            event.preventDefault();
            onLinkClick(href, label);
        }
    };

    const handleButtonClick = (action: string, data?: any) => {
        if (onButtonClick) {
            onButtonClick(action, data);
        }
    };

    return (
        <div className="lg:pt-12 pb-15 lg:pb-30">
            {/* 유저 요약 */}
            <UserSummary 
                userInfo={userInfo}
                benefits={benefits}
                onLinkClick={handleLinkClick}
                onButtonClick={handleButtonClick}
            />

            {/* 주문 배송 조회 - mobile */}
            <div className="lg:hidden mt-5 px-4">
                <div className="flex items-center justify-between mb-5">
                    <p className="flex items-end gap-1">
                        <span className="leading-[1] text-lg font-bold">주문 배송 조회</span>
                        <span className="leading-[1] text-xs text-description">최근 1개월 기준</span>
                    </p>
                    <a 
                        className="flex items-center text-xs lg:text-sm hover:underline" 
                        href="/myzone/orders?status=all" 
                        onClick={(e) => handleLinkClick("/myzone/orders?status=all", "전체보기", e)}
                        data-discover="true"
                    >
                        <span>전체보기</span>
                        <ChevronRightIcon />
                    </a>
                </div>
                <DeliveryTracking 
                    orderStatuses={orderStatuses}
                    cancelExchangeReturn={cancelExchangeReturn}
                    onLinkClick={handleLinkClick}
                />
            </div>

            {/* 최근 주문상품 - pc */}
            <div className="max-lg:hidden mt-10">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xl font-bold">최근 주문상품</p>
                    <a 
                        className="flex items-center text-xs lg:text-sm hover:underline" 
                        href="/myzone/orders?status=all"
                        onClick={(e) => handleLinkClick("/myzone/orders?status=all", "전체보기", e)}
                        data-discover="true"
                    >
                        <span>전체보기</span>
                        <ChevronRightIcon />
                    </a>
                </div>
                <OrderItemDetailList 
                    data={recentOrders}
                    onLinkClick={handleLinkClick}
                    onButtonClick={handleButtonClick}
                />
            </div>

            {/* 최근 주문 상품 - mobile */}
            <div className="lg:hidden px-4 mt-6">
                <OrderItemCompactList 
                    data={recentOrders}
                    onLinkClick={handleLinkClick}
                />
            </div>
        </div>
    );
}

// 사용자 요약 컴포넌트
function UserSummary({ 
    userInfo, 
    benefits, 
    onLinkClick, 
    onButtonClick 
}: { 
    userInfo: UserInfo;
    benefits: BenefitItem[];
    onLinkClick: (href: string, label: string, event: React.MouseEvent) => void;
    onButtonClick: (action: string, data?: any) => void;
}) {
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
                            WELCOME <span className="font-bold">{userInfo.name}님</span>
                        </p>
                        <button
                            type="button"
                            className="flex items-center pl-2.5 pr-1 py-0.5 lg:py-1 text-xs font-semibold text-[#2d8d7d] border border-[#2d8d7d] rounded-full transition-colors hover:bg-[#2d8d7d] hover:text-white"
                            onClick={() => onButtonClick('membershipBenefit')}
                        >
                            <span>멤버십혜택</span>
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>
                {userInfo.membershipMessage && (
                    <button
                        type="button"
                        className="w-full flex items-center justify-center bg-[#2d8d7d]/10 py-1.5 lg:py-1 transition-colors hover:bg-[#2d8d7d]/20"
                        onClick={() => onButtonClick('membershipProgress')}
                    >
                        <p className="text-sm">
                            {userInfo.membershipMessage.replace('프렌즈', '')}
                            <span className="font-semibold">프렌즈</span>가 됩니다
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4 fill-description">
                            <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                        </svg>
                    </button>
                )}
            </div>
            
            {/* 우측 */}
            <div className="w-full lg:w-1/2 max-lg:px-4 max-lg:mt-2 max-lg:mb-4 lg:border-l lg:border-border">
                <div className="h-full grid grid-cols-2 grid-rows-2 max-lg:bg-[linear-gradient(54deg,#8865EB_0.8%,#2BBAA2_71.11%,#23eb96_109.08%)] max-lg:rounded-lg max-lg:py-4 max-lg:gap-y-4">
                    {benefits.map((benefit, index) => (
                        <div key={benefit.label} className={`flex flex-col lg:items-center justify-center max-lg:px-4 ${getBenefitBorderClass(index)}`}>
                            <a 
                                className="block max-lg:text-white" 
                                href={benefit.href || '/myzone/credit'}
                                onClick={(e) => onLinkClick(benefit.href || '/myzone/credit', benefit.label, e)}
                                data-discover="true"
                            >
                                <p className="text-xs lg:text-sm font-semibold">{benefit.label}</p>
                                <div className="flex items-center justify-between lg:justify-center">
                                    <p className="text-sm font-semibold">
                                        <span className="text-base lg:text-lg font-bold">{benefit.value}</span>{benefit.unit}
                                    </p>
                                    <MobileChevronIcon />
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 혜택 아이템의 테두리 클래스 반환
function getBenefitBorderClass(index: number): string {
    switch (index) {
        case 0: return 'lg:border-b lg:border-r lg:border-border';
        case 1: return 'lg:border-b lg:border-border';
        case 2: return 'lg:border-r lg:border-border';
        default: return '';
    }
}

// 배송 추적 컴포넌트
function DeliveryTracking({ 
    orderStatuses, 
    cancelExchangeReturn, 
    onLinkClick 
}: { 
    orderStatuses: OrderStatus[];
    cancelExchangeReturn: { cancel: number; exchange: number; return: number };
    onLinkClick: (href: string, label: string, event: React.MouseEvent) => void;
}) {
    return (
        <div className="space-y-5">
            <ul className="flex items-center justify-center">
                {orderStatuses.map((status, index) => (
                    <li key={status.label} className="relative w-1/5">
                        <a
                            className="text-center space-y-1"
                            href={status.href}
                            onClick={(e) => onLinkClick(status.href, status.label, e)}
                            data-discover="true"
                        >
                            <p className={`text-2xl font-semibold ${status.isActive ? 'text-accent' : 'text-description'}`}>
                                {status.count}
                            </p>
                            <p className="text-xs text-description">{status.label}</p>
                        </a>
                        {index < orderStatuses.length - 1 && (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="absolute top-2 -right-2 w-4 h-4 fill-current">
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        )}
                    </li>
                ))}
            </ul>
            <div className="flex items-center justify-center gap-1">
                <a
                    className="flex items-center justify-center gap-1 w-1/3 py-2 bg-border/50 rounded"
                    href="/myzone/orders?status=cancelled"
                    onClick={(e) => onLinkClick("/myzone/orders?status=cancelled", "취소", e)}
                    data-discover="true"
                >
                    <span className="text-sm">취소</span>
                    <span className="text-sm font-bold">{cancelExchangeReturn.cancel}</span>
                </a>
                <a
                    className="flex items-center justify-center gap-1 w-1/3 py-2 bg-border/50 rounded"
                    href="/myzone/orders?status=cancelled"
                    onClick={(e) => onLinkClick("/myzone/orders?status=cancelled", "교환", e)}
                    data-discover="true"
                >
                    <span className="text-sm">교환</span>
                    <span className="text-sm font-bold">{cancelExchangeReturn.exchange}</span>
                </a>
                <a
                    className="flex items-center justify-center gap-1 w-1/3 py-2 bg-border/50 rounded"
                    href="/myzone/orders?status=cancelled"
                    onClick={(e) => onLinkClick("/myzone/orders?status=cancelled", "반품", e)}
                    data-discover="true"
                >
                    <span className="text-sm">반품</span>
                    <span className="text-sm font-bold">{cancelExchangeReturn.return}</span>
                </a>
            </div>
        </div>
    );
}

// PC용 주문 상품 목록
function OrderItemDetailList({ 
    data, 
    onLinkClick, 
    onButtonClick 
}: { 
    data: OrderItem[];
    onLinkClick: (href: string, label: string, event: React.MouseEvent) => void;
    onButtonClick: (action: string, data?: any) => void;
}) {
    return (
        <ul className="space-y-4">
            {data.map((item) => (
                <li key={item.orderId} className="w-full border border-border bg-white">
                    {/* 상단 헤더 라인 */}
                    <div className="flex items-center justify-between pl-3 lg:pl-4 pr-1 lg:pr-2 py-2 lg:py-3 border-b border-border text-sm">
                        <p>{item.orderId}</p>
                        <a
                            className="flex items-center gap-1 font-semibold text-black/70 lg:text-description lg:hover:text-black transition-colors"
                            href={`/myzone/order-detail/${item.orderId}`}
                            onClick={(e) => onLinkClick(`/myzone/order-detail/${item.orderId}`, "주문상세보기", e)}
                            data-discover="true"
                        >
                            <span>주문상세보기</span>
                            <ChevronRightIcon />
                        </a>
                    </div>

                    {/* 콘텐츠 라인 */}
                    <div className="lg:grid lg:grid-cols-[1fr_220px]">
                        <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4">
                            <div className="shrink-0">
                                <a 
                                    href={`/myzone/order-detail/${item.orderId}`}
                                    onClick={(e) => onLinkClick(`/myzone/order-detail/${item.orderId}`, item.title, e)}
                                    data-discover="true"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-[90px] h-[90px] lg:w-28 lg:h-28 object-cover rounded"
                                    />
                                </a>
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
                                    onClick={() => onButtonClick('cancel', item)}
                                >
                                    취소신청
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                                    onClick={() => onButtonClick('return', item)}
                                >
                                    반품신청
                                </button>
                                <button
                                    type="button"
                                    className="w-full py-1.5 text-sm font-semibold text-accent border border-accent rounded transition-colors hover:bg-accent hover:text-white"
                                    onClick={() => onButtonClick('confirm', item)}
                                >
                                    구매확정
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

// 모바일용 주문 상품 목록
function OrderItemCompactList({ 
    data, 
    onLinkClick 
}: { 
    data: OrderItem[];
    onLinkClick: (href: string, label: string, event: React.MouseEvent) => void;
}) {
    return (
        <ul className="space-y-4">
            {data.map((item) => (
                <li key={item.orderId} className="w-full bg-white">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="shrink-0">
                            <a 
                                href={`/myzone/order-detail/${item.orderId}`}
                                onClick={(e) => onLinkClick(`/myzone/order-detail/${item.orderId}`, item.title, e)}
                                data-discover="true"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-[70px] h-[70px] object-cover rounded"
                                />
                            </a>
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