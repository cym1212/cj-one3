import * as React from 'react';

// Props 인터페이스 정의
interface TabItem {
    label: string;
    href: string;
    isActive?: boolean;
}

interface FilterOption {
    value: string;
    label: string;
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

interface OrderListProps {
    // 탭 네비게이션
    tabs?: TabItem[];
    
    // 페이지 제목
    title?: string;
    showTitle?: boolean;
    
    // 필터 옵션
    periodOptions?: FilterOption[];
    statusOptions?: FilterOption[];
    
    // 주문 데이터
    orders?: OrderItem[];
    
    // 기본 필터 값
    defaultPeriod?: string;
    defaultStatus?: string;
    defaultSearch?: string;
    
    // 이벤트 핸들러
    onTabClick?: (href: string, label: string) => void;
    onFilterChange?: (type: 'period' | 'status' | 'search', value: string) => void;
    onLinkClick?: (href: string, label: string) => void;
    onButtonClick?: (action: string, data?: any) => void;
    onSearchSubmit?: (searchTerm: string) => void;
}

// 기본 데이터
const defaultTabs: TabItem[] = [
    { label: "주문/배송", href: "/myzone/orders?status=all", isActive: true },
    { label: "취소/교환/반품", href: "/myzone/orders?status=cancelled" }
];

const defaultPeriodOptions: FilterOption[] = [
    { value: "recent-1month", label: "최근 1개월" },
    { value: "recent-3months", label: "최근 3개월" },
    { value: "recent-6months", label: "최근 6개월" },
    { value: "2025", label: "2025년" },
    { value: "2024", label: "2024년" },
    { value: "2023", label: "2023년" }
];

const defaultStatusOptions: FilterOption[] = [
    { value: "all", label: "전체보기" },
    { value: "order-received", label: "주문접수" },
    { value: "payment-completed", label: "결제완료" },
    { value: "preparing", label: "상품준비중" },
    { value: "shipping", label: "배송중" },
    { value: "delivered", label: "배송완료" }
];

const defaultOrders: OrderItem[] = [
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
    }
];

// 유틸리티 함수
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

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="fill-current w-5 h-5">
        <path d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
    </svg>
);

export default function OrderListStandalone({
    tabs = defaultTabs,
    title = "주문/배송 조회",
    showTitle = true,
    periodOptions = defaultPeriodOptions,
    statusOptions = defaultStatusOptions,
    orders = defaultOrders,
    defaultPeriod = "recent-1month",
    defaultStatus = "all",
    defaultSearch = "",
    onTabClick,
    onFilterChange,
    onLinkClick,
    onButtonClick,
    onSearchSubmit
}: OrderListProps) {

    const [searchTerm, setSearchTerm] = React.useState(defaultSearch);

    const handleTabClick = (href: string, label: string, event: React.MouseEvent) => {
        if (onTabClick) {
            event.preventDefault();
            onTabClick(href, label);
        }
    };

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

    const handleFilterChange = (type: 'period' | 'status', value: string) => {
        if (onFilterChange) {
            onFilterChange(type, value);
        }
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (onSearchSubmit) {
            onSearchSubmit(searchTerm);
        }
        if (onFilterChange) {
            onFilterChange('search', searchTerm);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="lg:pt-10 pb-15 lg:pb-30">
            {/* 모바일 네비게이션 탭 */}
            <nav className="sticky top-[57px] h-fit z-2 lg:hidden flex items-center bg-white">
                {tabs.map((tab) => (
                    <a
                        key={tab.label}
                        className="flex-1 block h-[50px]"
                        href={tab.href}
                        onClick={(e) => handleTabClick(tab.href, tab.label, e)}
                        data-discover="true"
                    >
                        <span className={`flex items-center justify-center w-full h-full font-semibold ${
                            tab.isActive 
                                ? 'border-b-2' 
                                : 'border-b border-border'
                        }`}>
                            {tab.label}
                        </span>
                    </a>
                ))}
            </nav>

            <div className="max-lg:px-4">
                {/* PC 제목 */}
                {showTitle && (
                    <h2 className="max-lg:hidden text-2xl font-semibold">{title}</h2>
                )}

                {/* 필터 폼 */}
                <div className="mt-6 mb-4">
                    <form className="flex max-lg:flex-wrap items-center gap-2" onSubmit={handleSearchSubmit}>
                        {/* 기간 필터 */}
                        <select
                            id="period-filter"
                            className="flex-1 lg:w-1/3 px-4 py-2 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
                            defaultValue={defaultPeriod}
                            onChange={(e) => handleFilterChange('period', e.target.value)}
                        >
                            {periodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* 상태 필터 */}
                        <select
                            id="status-filter"
                            className="flex-1 lg:w-1/3 px-4 py-2 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
                            defaultValue={defaultStatus}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {/* 검색 입력 */}
                        <div className="w-full lg:w-1/3">
                            <label
                                htmlFor="name-filter"
                                className="relative block w-full border border-border rounded focus-within:border-accent transition-colors"
                            >
                                <input
                                    id="name-filter"
                                    placeholder="상품명을 입력해 주세요"
                                    className="w-full px-4 py-2 text-sm focus:outline-none"
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                >
                                    <SearchIcon />
                                </button>
                            </label>
                        </div>
                    </form>
                </div>
            </div>

            {/* 주문 목록 */}
            <div className="max-lg:p-4">
                <OrderItemList
                    orders={orders}
                    onLinkClick={handleLinkClick}
                    onButtonClick={handleButtonClick}
                />
            </div>
        </div>
    );
}

// 주문 아이템 리스트 컴포넌트
function OrderItemList({
    orders,
    onLinkClick,
    onButtonClick
}: {
    orders: OrderItem[];
    onLinkClick: (href: string, label: string, event: React.MouseEvent) => void;
    onButtonClick: (action: string, data?: any) => void;
}) {
    return (
        <ul className="space-y-4">
            {orders.map((item) => (
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
                                        alt={item.title}
                                        className="w-[90px] h-[90px] lg:w-28 lg:h-28 object-cover rounded"
                                        src={item.image}
                                    />
                                </a>
                            </div>
                            <div className="flex-1">
                                <p className="flex items-center gap-2 text-sm lg:text-base font-semibold">
                                    <span>{item.deliveryStatus}</span>
                                    <span className="text-accent text-sm">
                                        {formatDeliveryDate(item.deliveryDate)}이내 도착예정
                                    </span>
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