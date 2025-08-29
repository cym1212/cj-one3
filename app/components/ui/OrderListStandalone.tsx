import * as React from 'react';

// Props 인터페이스 정의 (API 가이드와 호환)
interface TabItem {
    label: string;
    href: string;
    isActive?: boolean;
}

interface FilterOption {
    value: string;
    label: string;
}

// OrderHistory API 가이드와 호환되는 인터페이스
interface OrderCart {
    id: number;
    count: number;
    unitPrice: string;
    options?: {
        options?: Array<{import * as React from 'react';

// Props 인터페이스 정의 (API 가이드와 호환)
            interface TabItem {
    label: string;
    href: string;
    isActive?: boolean;
}

interface FilterOption {
    value: string;
    label: string;
}

// OrderHistory API 가이드와 호환되는 인터페이스
interface OrderCart {
    id: number;
    count: number;
    unitPrice: string;
    options?: {
        options?: Array<{
            groupName: string;
            valueName: string;
        }>;
    };
    product: {
        id: number;
        title: string;
        config?: {
            img_url?: string;
            default_price?: number;
            discounted_price?: number;
        };
    };
}

interface DeliveryInfo {
    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    address: string;
    addressDetail: string;
    deliveryMessage?: string;
    trackingNumber?: string;
    carrierName?: string;
}

interface Order {
    id: number;
    orderNumber?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    totalAmount: number;
    shippingFee: number;
    paymentMethod: string;
    deliveryInfo?: DeliveryInfo;
    carts: OrderCart[];
}

// 레거시 호환성을 위한 OrderItem 인터페이스 유지
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

// ComponentSkinProps와 호환되는 새로운 인터페이스
interface ComponentSkinProps {
    data: {
        id: string;
        style: React.CSSProperties;
        componentProps: {
            title?: string;
            emptyText?: string;
            itemsPerPage?: number;
        };
        orders: Order[];
        loading: boolean;
        error: any;
        currentPage: number;
        totalPages: number;
        totalOrders: number;
        searchQuery: string;
        selectedStatus: string;
        selectedDateRange: string;
        selectedOrder: any | null;
        showOrderDetail: boolean;
        isUserLoggedIn: boolean;
        isAdminMode: boolean;
        theme: any;
        isMobile: boolean;
        deviceType: string;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
        };
        checkouts: any[];
        itemsPerPage: number;
        title: string;
        emptyText: string;
        reviewModalOpen: boolean;
        selectedProduct: any;
        selectedOrderForReview: any;
        deliveryModalOpen: boolean;
        selectedCheckout: any;
    };
    actions: {
        setSearchQuery: (query: string) => void;
        setSelectedStatus: (status: string) => void;
        setSelectedDateRange: (range: string) => void;
        handleViewDetail: (order: any) => void;
        handleCancelOrder: (orderId: number) => void;
        handleTrackShipment: (trackingNumber: string) => void;
        handleAddToCartAgain: (order: any) => void;
        handlePageChange: (page: number) => void;
        setShowOrderDetail: (show: boolean) => void;
        getStatusText: (status: string) => string;
        getStatusInfo: (status: string) => { text: string; class: string; icon: string };
        formatDate: (date: string) => string;
        loadOrders: (page: number, take: number) => void;
        openReviewModal: (product: any, order: any) => void;
        handleReviewSubmitted: () => void;
        setReviewModalOpen: (open: boolean) => void;
        openDeliveryModal: (order: any) => void;
        setDeliveryModalOpen: (open: boolean) => void;
    };
    options: any;
    mode: 'production' | 'preview' | 'editor';
    utils: {
        t: (key: string) => string;
        navigate: (path: string) => void;
        formatCurrency: (amount: number, currency?: string) => string;
        formatDate: (date: string | Date, format?: string) => string;
        getAssetUrl: (path: string) => string;
        cx: (...classes: (string | undefined | null | false)[]) => string;
    };
    app: {
        user: any | null;
        settings: Record<string, any>;
        theme: any;
    };
    editor?: {
        isSelected: boolean;
        onSelect: () => void;
        onEdit: () => void;
        onDelete: () => void;
        dragHandleProps?: any;
    };
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

    // 주문 데이터 (레거시 지원)
    orders?: OrderItem[];

    // 기본 필터 값
    defaultPeriod?: string;
    defaultStatus?: string;
    defaultSearch?: string;

    // 데이터 로딩 상태
    isLoading?: boolean;
    error?: string | null;

    // 디버그 모드
    debug?: boolean;

    // 이벤트 핸들러
    onTabClick?: (href: string, label: string) => void;
    onFilterChange?: (type: 'period' | 'status' | 'search', value: string) => void;
    onLinkClick?: (href: string, label: string) => void;
    onButtonClick?: (action: string, data?: any) => void;
    onSearchSubmit?: (searchTerm: string) => void;

    // API 가이드 호환 props (optional)
    skinProps?: ComponentSkinProps;
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

const defaultOrders: OrderItem[] = [];

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
                                                orders, // 기본값 제거 - undefined가 되도록 함
                                                defaultPeriod = "recent-1month",
                                                defaultStatus = "all",
                                                defaultSearch = "",
                                                isLoading = false,
                                                error = null,
                                                debug = false,
                                                onTabClick,
                                                onFilterChange,
                                                onLinkClick,
                                                onButtonClick,
                                                onSearchSubmit,
                                                skinProps
                                            }: OrderListProps) {

    // 에러 상태 관리
    const [dataError, setDataError] = React.useState<string | null>(error);

    // API 가이드 기반 데이터 활용
    const actualData = skinProps?.data;
    const actualActions = skinProps?.actions;
    const utils = skinProps?.utils;

    // API 데이터를 레거시 형식으로 변환하는 함수
    const transformApiOrderToLegacy = React.useCallback((apiOrder: Order): OrderItem => {
        const firstCart = apiOrder.carts?.[0];
        const statusInfo = actualActions?.getStatusInfo ? actualActions.getStatusInfo(apiOrder.status) : null;

        return {
            orderId: apiOrder.orderNumber || apiOrder.id.toString(),
            title: firstCart?.product?.title || '상품명 없음',
            option: firstCart?.options?.options?.map(opt => `${opt.groupName}: ${opt.valueName}`).join(', ') || '단일상품',
            price: Number(firstCart?.unitPrice) || apiOrder.totalAmount,
            quantity: firstCart?.count || 1,
            image: firstCart?.product?.config?.img_url || '/images/product/placeholder.png',
            orderDate: apiOrder.createdAt,
            deliveryDate: apiOrder.updatedAt,
            deliveryStatus: statusInfo?.text || apiOrder.status
        };
    }, [actualActions]);

    // 데이터 소스 우선순위와 변환
    const getOrderData = React.useCallback(() => {
        try {
            // 1. skinProps API 데이터가 있으면 최우선 사용 (길이 체크 제거)
            if (actualData?.orders && Array.isArray(actualData.orders)) {
                return {
                    orders: actualData.orders.map(transformApiOrderToLegacy),
                    apiOrders: actualData.orders,
                    source: 'api',
                    isEmpty: actualData.orders.length === 0
                };
            }

            // 2. props로 전달된 orders가 있으면 사용 (단, 빈 배열이면 무시)
            if (orders && Array.isArray(orders) && orders.length > 0) {
                return {
                    orders: orders,
                    apiOrders: [],
                    source: 'props',
                    isEmpty: false
                };
            }

            // 3. 빈 상태 (목 데이터 사용 안함)
            return {
                orders: [],
                apiOrders: [],
                source: actualData ? 'api' : 'props',
                isEmpty: true
            };
        } catch (error) {
            console.error('Order data transformation error:', error);
            setDataError(error instanceof Error ? error.message : '데이터 처리 중 오류가 발생했습니다.');
            return {
                orders: [],
                apiOrders: [],
                source: 'error',
                isEmpty: true
            };
        }
    }, [actualData, orders, transformApiOrderToLegacy]);

    const { orders: displayOrders, apiOrders, source: dataSource, isEmpty } = getOrderData();

    // 상태 우선순위 설정
    const displayTitle = actualData?.title || actualData?.componentProps?.title || title;
    const currentIsLoading = actualData?.loading || isLoading;
    const currentHasError = actualData?.error || dataError;
    const isLoggedIn = actualData?.isUserLoggedIn !== false; // 기본값 true
    const currentSearchQuery = actualData?.searchQuery || defaultSearch;
    const currentSelectedStatus = actualData?.selectedStatus || defaultStatus;
    const currentSelectedDateRange = actualData?.selectedDateRange || defaultPeriod;
    const emptyText = actualData?.emptyText || actualData?.componentProps?.emptyText || "주문 내역이 없습니다.";

    const [searchTerm, setSearchTerm] = React.useState(currentSearchQuery);

    // 디버깅 로그
    React.useEffect(() => {
        if (debug) {
            console.log('OrderList Debug Info:', {
                dataSource,
                ordersCount: displayOrders?.length,
                apiOrdersCount: apiOrders?.length,
                skinPropsData: actualData,
                currentIsLoading,
                currentHasError,
                isEmpty
            });
        }
    }, [debug, dataSource, displayOrders, apiOrders, actualData, currentIsLoading, currentHasError, isEmpty]);

    // 데이터 유효성 검사
    React.useEffect(() => {
        setDataError(null);
        try {
            if (actualData && !Array.isArray(actualData.orders)) {
                throw new Error('API 주문 데이터가 배열이 아닙니다.');
            }
            if (orders && !Array.isArray(orders)) {
                throw new Error('props 주문 데이터가 배열이 아닙니다.');
            }
        } catch (error) {
            console.error('Order data validation error:', error);
            setDataError(error instanceof Error ? error.message : '데이터 유효성 검사 실패');
        }
    }, [actualData, orders]);

    // 검색어 상태를 외부 데이터 변경에 따라 업데이트
    React.useEffect(() => {
        setSearchTerm(currentSearchQuery);
    }, [currentSearchQuery]);

    const handleTabClick = (href: string, label: string, event: React.MouseEvent) => {
        if (onTabClick) {
            event.preventDefault();
            onTabClick(href, label);
        }
    };

    const handleLinkClick = (href: string, label: string, event: React.MouseEvent) => {
        // API 가이드 액션 우선 사용
        if (actualActions?.handleViewDetail && event.currentTarget.getAttribute('data-action') === 'detail') {
            event.preventDefault();
            const orderId = event.currentTarget.getAttribute('data-order-id');
            const order = displayOrders.find(o => o.id.toString() === orderId);
            if (order) {
                actualActions.handleViewDetail(order);
            }
            return;
        }

        // 레거시 핸들러
        if (onLinkClick) {
            event.preventDefault();
            onLinkClick(href, label);
        } else if (utils?.navigate) {
            event.preventDefault();
            utils.navigate(href);
        }
    };

    const handleButtonClick = (action: string, data?: any) => {
        // API 가이드 액션 우선 사용
        if (actualActions) {
            switch (action) {
                case 'cancel':
                    if (data && actualActions.handleCancelOrder) {
                        const orderId = typeof data.id === 'number' ? data.id : parseInt(data.orderId);
                        actualActions.handleCancelOrder(orderId);
                    }
                    break;
                case 'track':
                case 'delivery':
                    if (data && actualActions.openDeliveryModal) {
                        actualActions.openDeliveryModal(data);
                    }
                    break;
                case 'reorder':
                case 'addToCart':
                    if (data && actualActions.handleAddToCartAgain) {
                        actualActions.handleAddToCartAgain(data);
                    }
                    break;
                case 'review':
                    if (data && actualActions.openReviewModal) {
                        actualActions.openReviewModal(data.product, data.order);
                    }
                    break;
                default:
                    break;
            }
        }

        // 레거시 핸들러
        if (onButtonClick) {
            onButtonClick(action, data);
        }
    };

    const handleFilterChange = (type: 'period' | 'status', value: string) => {
        // API 가이드 액션 우선 사용
        if (actualActions) {
            if (type === 'period') {
                actualActions.setSelectedDateRange(value);
            } else if (type === 'status') {
                actualActions.setSelectedStatus(value);
            }
        }

        // 레거시 핸들러
        if (onFilterChange) {
            onFilterChange(type, value);
        }
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // API 가이드 액션 우선 사용
        if (actualActions?.setSearchQuery) {
            actualActions.setSearchQuery(searchTerm);
        }

        // 레거시 핸들러
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

    // 로딩 상태
    if (currentIsLoading) {
        return (
            <div className="lg:pt-10 pb-15 lg:pb-30">
                <div className="max-lg:px-4 text-center py-20">
                    <p>{utils?.t ? utils.t('주문 내역을 불러오는 중입니다...') : '주문 내역을 불러오는 중입니다...'}</p>
                    {debug && (
                        <p className="text-sm text-gray-500 mt-2">데이터 소스: {dataSource}</p>
                    )}
                </div>
            </div>
        );
    }

    // 에러 상태
    if (currentHasError) {
        const errorMessage = typeof currentHasError === 'string' ? currentHasError :
            utils?.t ? utils.t('주문 내역을 불러오는데 실패했습니다') : '주문 내역을 불러오는데 실패했습니다';

        return (
            <div className="lg:pt-10 pb-15 lg:pb-30">
                <div className="max-lg:px-4 text-center py-20">
                    <p className="text-red-600 mb-4">{errorMessage}</p>
                    {debug && (
                        <div className="text-sm text-gray-500 mb-4">
                            <p>데이터 소스: {dataSource}</p>
                            <p>에러 타입: {typeof currentHasError}</p>
                        </div>
                    )}
                    <button
                        className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
                        onClick={() => {
                            setDataError(null);
                            window.location.reload();
                        }}
                    >
                        {utils?.t ? utils.t('다시 시도') : '다시 시도'}
                    </button>
                </div>
            </div>
        );
    }

    // 로그인 필요
    if (!isLoggedIn) {
        return (
            <div className="lg:pt-10 pb-15 lg:pb-30">
                <div className="max-lg:px-4 text-center py-20">
                    <p className="mb-4">{utils?.t ? utils.t('주문 내역을 확인하려면 로그인이 필요합니다.') : '주문 내역을 확인하려면 로그인이 필요합니다.'}</p>
                    <button
                        className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
                        onClick={() => utils?.navigate ? utils.navigate('/login') : window.location.href = '/login'}
                    >
                        {utils?.t ? utils.t('로그인') : '로그인'}
                    </button>
                </div>
            </div>
        );
    }

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
                    <h2 className="max-lg:hidden text-2xl font-semibold">{displayTitle}</h2>
                )}

                {/* 필터 폼 */}
                <div className="mt-6 mb-4">
                    <form className="flex max-lg:flex-wrap items-center gap-2" onSubmit={handleSearchSubmit}>
                        {/* 기간 필터 */}
                        <select
                            id="period-filter"
                            className="flex-1 lg:w-1/3 px-4 py-2 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
                            value={currentSelectedDateRange}
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
                            value={currentSelectedStatus}
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
                                    placeholder={utils?.t ? utils.t('상품명을 입력해 주세요') : '상품명을 입력해 주세요'}
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

            {/* 주문 목록 또는 빈 상태 */}
            <div className="max-lg:p-4">
                {isEmpty ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 mb-4">{emptyText}</p>
                        {debug && (
                            <div className="text-sm text-gray-500 mb-4">
                                <p>데이터 소스: {dataSource}</p>
                                <p>API 주문 수: {apiOrders?.length || 0}</p>
                                <p>레거시 주문 수: {orders?.length || 0}</p>
                            </div>
                        )}
                        <button
                            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
                            onClick={() => utils?.navigate ? utils.navigate('/shop') : window.location.href = '/shop'}
                        >
                            {utils?.t ? utils.t('쇼핑 계속하기') : '쇼핑 계속하기'}
                        </button>
                    </div>
                ) : (
                    <>
                        {debug && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                <p><strong>디버그 정보:</strong></p>
                                <p>데이터 소스: {dataSource}</p>
                                <p>표시 주문 수: {displayOrders?.length || 0}</p>
                                <p>API 주문 수: {apiOrders?.length || 0}</p>
                            </div>
                        )}

                        <OrderItemList
                            orders={displayOrders}
                            apiOrders={apiOrders}
                            onLinkClick={handleLinkClick}
                            onButtonClick={handleButtonClick}
                            utils={utils}
                            actualActions={actualActions}
                            dataSource={dataSource}
                        />

                        {/* 페이지네이션 (API 가이드 기반) */}
                        {actualData?.pagination && actualData.pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => actualActions?.handlePageChange?.(1)}
                                        disabled={actualData.pagination.currentPage === 1}
                                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                                    >
                                        {utils?.t ? utils.t('처음') : '처음'}
                                    </button>
                                    <button
                                        onClick={() => actualActions?.handlePageChange?.(actualData.pagination.currentPage - 1)}
                                        disabled={actualData.pagination.currentPage === 1}
                                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                                    >
                                        {utils?.t ? utils.t('이전') : '이전'}
                                    </button>
                                    <span className="px-3 py-1 text-sm">
                                        {actualData.pagination.currentPage} / {actualData.pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => actualActions?.handlePageChange?.(actualData.pagination.currentPage + 1)}
                                        disabled={actualData.pagination.currentPage === actualData.pagination.totalPages}
                                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                                    >
                                        {utils?.t ? utils.t('다음') : '다음'}
                                    </button>
                                    <button
                                        onClick={() => actualActions?.handlePageChange?.(actualData.pagination.totalPages)}
                                        disabled={actualData.pagination.currentPage === actualData.pagination.totalPages}
                                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                                    >
                                        {utils?.t ? utils.t('마지막') : '마지막'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// 주문 아이템 리스트 컴포넌트
function OrderItemList({
                           orders,
                           apiOrders = [],
                           onLinkClick,
                           onButtonClick,
                           utils,
                           actualActions,
                           dataSource
                       }: {
    orders: OrderItem[];
    apiOrders?: Order[];
    onLinkClick: (href: string, label: string, event: React.MouseEvent) => void;
    onButtonClick: (action: string, data?: any) => void;
    utils?: ComponentSkinProps['utils'];
    actualActions?: ComponentSkinProps['actions'];
    dataSource?: string;
}) {
    // 데이터 소스에 따른 렌더링 결정
    const shouldRenderApiOrders = dataSource === 'api' && apiOrders.length > 0;
    const shouldRenderLegacyOrders = !shouldRenderApiOrders && orders && orders.length > 0;

    // 주문 상태 정보 가져오기
    const getStatusInfo = (status: string) => {
        if (actualActions?.getStatusInfo) {
            return actualActions.getStatusInfo(status);
        }

        // 기본 상태 정보
        const statusMap: Record<string, { text: string; class: string; icon: string }> = {
            'REQUESTED': { text: '주문 요청됨', class: 'status-requested', icon: '📋' },
            'PENDING': { text: '결제 대기 중', class: 'status-pending', icon: '⏳' },
            'PREPARING': { text: '상품 준비 중', class: 'status-preparing', icon: '📦' },
            'PAID': { text: '결제 완료', class: 'status-paid', icon: '💰' },
            'SHIPPING': { text: '배송 중', class: 'status-shipping', icon: '🚚' },
            'ARRIVED': { text: '배송 도착', class: 'status-arrived', icon: '🏠' },
            'FINISHED': { text: '배송 완료', class: 'status-finished', icon: '✅' },
            'ISSUE': { text: '배송 문제 발생', class: 'status-issue', icon: '⚠️' },
            'CANCELLED': { text: '주문 취소됨', class: 'status-cancelled', icon: '❌' },
            'CANCELED': { text: '주문 취소됨', class: 'status-cancelled', icon: '❌' },
            'REFUNDED': { text: '환불 완료', class: 'status-refunded', icon: '💸' },
        };

        return statusMap[status] || { text: status, class: 'status-default', icon: '📋' };
    };

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        if (actualActions?.formatDate) {
            return actualActions.formatDate(dateString);
        }
        if (utils?.formatDate) {
            return utils.formatDate(dateString);
        }
        return formatDeliveryDate(dateString);
    };

    // 금액 포맷팅
    const formatCurrencyAmount = (amount: number) => {
        if (utils?.formatCurrency) {
            return utils.formatCurrency(amount);
        }
        return formatCurrency(amount);
    };

    return (
        <ul className="space-y-4">
            {/* API 기반 주문 렌더링 */}
            {shouldRenderApiOrders && apiOrders.map((order) => (
                <li key={order.id} className="w-full border border-border bg-white">
                    {/* 상단 헤더 라인 */}
                    <div className="flex items-center justify-between pl-3 lg:pl-4 pr-1 lg:pr-2 py-2 lg:py-3 border-b border-border text-sm">
                        <p>{utils?.t ? utils.t('주문번호') : '주문번호'}: {order.orderNumber || order.id}</p>
                        <a
                            className="flex items-center gap-1 font-semibold text-black/70 lg:text-description lg:hover:text-black transition-colors"
                            href={`/myzone/order-detail/${order.id}`}
                            onClick={(e) => onLinkClick(`/myzone/order-detail/${order.id}`, "주문상세보기", e)}
                            data-discover="true"
                            data-action="detail"
                            data-order-id={order.id.toString()}
                        >
                            <span>{utils?.t ? utils.t('주문상세보기') : '주문상세보기'}</span>
                            <ChevronRightIcon />
                        </a>
                    </div>

                    {/* 주문 상태 및 날짜 */}
                    <div className="px-3 lg:px-4 py-2 border-b border-border bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${getStatusInfo(order.status).class}`}>
                                    <span>{getStatusInfo(order.status).icon}</span>
                                    {getStatusInfo(order.status).text}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {formatDate(order.createdAt)}
                                </span>
                            </div>
                            <div className="text-sm font-semibold">
                                {utils?.t ? utils.t('총 결제금액') : '총 결제금액'}: {formatCurrencyAmount(order.totalAmount)}원
                            </div>
                        </div>
                    </div>

                    {/* 상품 목록 */}
                    {order.carts.map((cartItem) => (
                        <div key={cartItem.id} className="lg:grid lg:grid-cols-[1fr_220px]">
                            <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4">
                                <div className="shrink-0">
                                    <a
                                        href={`/myzone/order-detail/${order.id}`}
                                        onClick={(e) => onLinkClick(`/myzone/order-detail/${order.id}`, cartItem.product.title, e)}
                                        data-discover="true"
                                        data-action="detail"
                                        data-order-id={order.id.toString()}
                                    >
                                        <img
                                            alt={cartItem.product.title}
                                            className="w-[90px] h-[90px] lg:w-28 lg:h-28 object-cover rounded"
                                            src={cartItem.product.config?.img_url || '/images/product/placeholder.png'}
                                        />
                                    </a>
                                </div>
                                <div className="flex-1">
                                    <p className="mt-0.5 lg:mt-1 text-sm lg:text-base font-semibold truncate">
                                        {cartItem.product.title}
                                    </p>

                                    {/* 옵션 표시 */}
                                    {cartItem.options?.options && cartItem.options.options.length > 0 && (
                                        <div className="mt-1 text-xs lg:text-sm text-description">
                                            {cartItem.options.options.map((option, idx) => (
                                                <span key={idx} className="mr-2">
                                                    {option.groupName}: {option.valueName}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <p className="flex items-center gap-1 text-xs lg:text-sm text-description mt-1">
                                        <span>{utils?.t ? utils.t('수량') : '수량'} {cartItem.count}</span>
                                    </p>

                                    <div className="mt-1 lg:mt-2 flex items-center justify-between lg:block">
                                        <p className="text-lg lg:text-xl font-bold">
                                            {formatCurrencyAmount(Number(cartItem.unitPrice))}
                                            <span className="text-sm lg:text-base font-semibold">원</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* 우측: 액션 영역 */}
                            <div className="hidden lg:block border-l border-border">
                                <div className="h-full px-4 flex flex-col justify-center gap-2">
                                    {/* 주문 취소 (pending 상태에서만) */}
                                    {order.status === 'PENDING' && (
                                        <button
                                            type="button"
                                            className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                                            onClick={() => onButtonClick('cancel', order)}
                                        >
                                            {utils?.t ? utils.t('주문 취소') : '주문 취소'}
                                        </button>
                                    )}

                                    {/* 배송조회 (배송 관련 상태에서) */}
                                    {(['SHIPPING', 'ARRIVED', 'FINISHED'].includes(order.status)) && (
                                        <button
                                            type="button"
                                            className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                                            onClick={() => onButtonClick('delivery', order)}
                                        >
                                            {utils?.t ? utils.t('배송조회') : '배송조회'}
                                        </button>
                                    )}

                                    {/* 리뷰 작성 (배송 완료 상태에서) */}
                                    {order.status === 'FINISHED' && (
                                        <button
                                            type="button"
                                            className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                                            onClick={() => onButtonClick('review', { product: cartItem.product, order })}
                                        >
                                            {utils?.t ? utils.t('리뷰 작성') : '리뷰 작성'}
                                        </button>
                                    )}

                                    {/* 다시 담기 */}
                                    <button
                                        type="button"
                                        className="w-full py-1.5 text-sm font-semibold text-accent border border-accent rounded transition-colors hover:bg-accent hover:text-white"
                                        onClick={() => onButtonClick('reorder', order)}
                                    >
                                        {utils?.t ? utils.t('다시 담기') : '다시 담기'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </li>
            ))}

            {/* 레거시 주문 렌더링 */}
            {shouldRenderLegacyOrders && orders.map((item) => (
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
            groupName: string;
            valueName: string;
        }>;
    };
    product: {
        id: number;
        title: string;
        config?: {
            img_url?: string;
            default_price?: number;
            discounted_price?: number;
        };
    };
}

interface DeliveryInfo {
    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    address: string;
    addressDetail: string;
    deliveryMessage?: string;
    trackingNumber?: string;
    carrierName?: string;
}

interface Order {
    id: number;
    orderNumber?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    totalAmount: number;
    shippingFee: number;
    paymentMethod: string;
    deliveryInfo?: DeliveryInfo;
    carts: OrderCart[];
}

// 레거시 호환성을 위한 OrderItem 인터페이스 유지
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

// ComponentSkinProps와 호환되는 새로운 인터페이스
interface ComponentSkinProps {
    data: {
        id: string;
        style: React.CSSProperties;
        componentProps: {
            title?: string;
            emptyText?: string;
            itemsPerPage?: number;
        };
        orders: Order[];
        loading: boolean;
        error: any;
        currentPage: number;
        totalPages: number;
        totalOrders: number;
        searchQuery: string;
        selectedStatus: string;
        selectedDateRange: string;
        selectedOrder: any | null;
        showOrderDetail: boolean;
        isUserLoggedIn: boolean;
        isAdminMode: boolean;
        theme: any;
        isMobile: boolean;
        deviceType: string;
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
        };
        checkouts: any[];
        itemsPerPage: number;
        title: string;
        emptyText: string;
        reviewModalOpen: boolean;
        selectedProduct: any;
        selectedOrderForReview: any;
        deliveryModalOpen: boolean;
        selectedCheckout: any;
    };
    actions: {
        setSearchQuery: (query: string) => void;
        setSelectedStatus: (status: string) => void;
        setSelectedDateRange: (range: string) => void;
        handleViewDetail: (order: any) => void;
        handleCancelOrder: (orderId: number) => void;
        handleTrackShipment: (trackingNumber: string) => void;
        handleAddToCartAgain: (order: any) => void;
        handlePageChange: (page: number) => void;
        setShowOrderDetail: (show: boolean) => void;
        getStatusText: (status: string) => string;
        getStatusInfo: (status: string) => { text: string; class: string; icon: string };
        formatDate: (date: string) => string;
        loadOrders: (page: number, take: number) => void;
        openReviewModal: (product: any, order: any) => void;
        handleReviewSubmitted: () => void;
        setReviewModalOpen: (open: boolean) => void;
        openDeliveryModal: (order: any) => void;
        setDeliveryModalOpen: (open: boolean) => void;
    };
    options: any;
    mode: 'production' | 'preview' | 'editor';
    utils: {
        t: (key: string) => string;
        navigate: (path: string) => void;
        formatCurrency: (amount: number, currency?: string) => string;
        formatDate: (date: string | Date, format?: string) => string;
        getAssetUrl: (path: string) => string;
        cx: (...classes: (string | undefined | null | false)[]) => string;
    };
    app: {
        user: any | null;
        settings: Record<string, any>;
        theme: any;
    };
    editor?: {
        isSelected: boolean;
        onSelect: () => void;
        onEdit: () => void;
        onDelete: () => void;
        dragHandleProps?: any;
    };
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
    
    // 주문 데이터 (레거시 지원)
    orders?: OrderItem[];
    
    // 기본 필터 값
    defaultPeriod?: string;
    defaultStatus?: string;
    defaultSearch?: string;
    
    // 데이터 로딩 상태
    isLoading?: boolean;
    error?: string | null;
    
    // 디버그 모드
    debug?: boolean;
    
    // 이벤트 핸들러
    onTabClick?: (href: string, label: string) => void;
    onFilterChange?: (type: 'period' | 'status' | 'search', value: string) => void;
    onLinkClick?: (href: string, label: string) => void;
    onButtonClick?: (action: string, data?: any) => void;
    onSearchSubmit?: (searchTerm: string) => void;
    
    // API 가이드 호환 props (optional)
    skinProps?: ComponentSkinProps;
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

const defaultOrders: OrderItem[] = [];

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
    orders, // 기본값 제거 - undefined가 되도록 함
    defaultPeriod = "recent-1month",
    defaultStatus = "all",
    defaultSearch = "",
    isLoading = false,
    error = null,
    debug = false,
    onTabClick,
    onFilterChange,
    onLinkClick,
    onButtonClick,
    onSearchSubmit,
    skinProps
}: OrderListProps) {

    // 에러 상태 관리
    const [dataError, setDataError] = React.useState<string | null>(error);

    // API 가이드 기반 데이터 활용
    const actualData = skinProps?.data;
    const actualActions = skinProps?.actions;
    const utils = skinProps?.utils;

    // API 데이터를 레거시 형식으로 변환하는 함수
    const transformApiOrderToLegacy = React.useCallback((apiOrder: Order): OrderItem => {
        const firstCart = apiOrder.carts?.[0];
        const statusInfo = actualActions?.getStatusInfo ? actualActions.getStatusInfo(apiOrder.status) : null;
        
        return {
            orderId: apiOrder.orderNumber || apiOrder.id.toString(),
            title: firstCart?.product?.title || '상품명 없음',
            option: firstCart?.options?.options?.map(opt => `${opt.groupName}: ${opt.valueName}`).join(', ') || '단일상품',
            price: Number(firstCart?.unitPrice) || apiOrder.totalAmount,
            quantity: firstCart?.count || 1,
            image: firstCart?.product?.config?.img_url || '/images/product/placeholder.png',
            orderDate: apiOrder.createdAt,
            deliveryDate: apiOrder.updatedAt,
            deliveryStatus: statusInfo?.text || apiOrder.status
        };
    }, [actualActions]);

    // 데이터 소스 우선순위와 변환
    const getOrderData = React.useCallback(() => {
        try {
            // 1. skinProps API 데이터가 있으면 최우선 사용 (길이 체크 제거)
            if (actualData?.orders && Array.isArray(actualData.orders)) {
                return {
                    orders: actualData.orders.map(transformApiOrderToLegacy),
                    apiOrders: actualData.orders,
                    source: 'api',
                    isEmpty: actualData.orders.length === 0
                };
            }

            // 2. props로 전달된 orders가 있으면 사용 (단, 빈 배열이면 무시)
            if (orders && Array.isArray(orders) && orders.length > 0) {
                return {
                    orders: orders,
                    apiOrders: [],
                    source: 'props',
                    isEmpty: false
                };
            }

            // 3. 빈 상태 (목 데이터 사용 안함)
            return {
                orders: [],
                apiOrders: [],
                source: actualData ? 'api' : 'props',
                isEmpty: true
            };
        } catch (error) {
            console.error('Order data transformation error:', error);
            setDataError(error instanceof Error ? error.message : '데이터 처리 중 오류가 발생했습니다.');
            return {
                orders: [],
                apiOrders: [],
                source: 'error',
                isEmpty: true
            };
        }
    }, [actualData, orders, transformApiOrderToLegacy]);

    const { orders: displayOrders, apiOrders, source: dataSource, isEmpty } = getOrderData();

    // 상태 우선순위 설정
    const displayTitle = actualData?.title || actualData?.componentProps?.title || title;
    const currentIsLoading = actualData?.loading || isLoading;
    const currentHasError = actualData?.error || dataError;
    const isLoggedIn = actualData?.isUserLoggedIn !== false; // 기본값 true
    const currentSearchQuery = actualData?.searchQuery || defaultSearch;
    const currentSelectedStatus = actualData?.selectedStatus || defaultStatus;
    const currentSelectedDateRange = actualData?.selectedDateRange || defaultPeriod;
    const emptyText = actualData?.emptyText || actualData?.componentProps?.emptyText || "주문 내역이 없습니다.";

    const [searchTerm, setSearchTerm] = React.useState(currentSearchQuery);

    // 디버깅 로그
    React.useEffect(() => {
        if (debug) {
            console.log('OrderList Debug Info:', {
                dataSource,
                ordersCount: displayOrders?.length,
                apiOrdersCount: apiOrders?.length,
                skinPropsData: actualData,
                currentIsLoading,
                currentHasError,
                isEmpty
            });
        }
    }, [debug, dataSource, displayOrders, apiOrders, actualData, currentIsLoading, currentHasError, isEmpty]);

    // 데이터 유효성 검사
    React.useEffect(() => {
        setDataError(null);
        try {
            if (actualData && !Array.isArray(actualData.orders)) {
                throw new Error('API 주문 데이터가 배열이 아닙니다.');
            }
            if (orders && !Array.isArray(orders)) {
                throw new Error('props 주문 데이터가 배열이 아닙니다.');
            }
        } catch (error) {
            console.error('Order data validation error:', error);
            setDataError(error instanceof Error ? error.message : '데이터 유효성 검사 실패');
        }
    }, [actualData, orders]);

    // 검색어 상태를 외부 데이터 변경에 따라 업데이트
    React.useEffect(() => {
        setSearchTerm(currentSearchQuery);
    }, [currentSearchQuery]);

    const handleTabClick = (href: string, label: string, event: React.MouseEvent) => {
        if (onTabClick) {
            event.preventDefault();
            onTabClick(href, label);
        }
    };

    const handleLinkClick = (href: string, label: string, event: React.MouseEvent) => {
        // API 가이드 액션 우선 사용
        if (actualActions?.handleViewDetail && event.currentTarget.getAttribute('data-action') === 'detail') {
            event.preventDefault();
            const orderId = event.currentTarget.getAttribute('data-order-id');
            const order = displayOrders.find(o => o.id.toString() === orderId);
            if (order) {
                actualActions.handleViewDetail(order);
            }
            return;
        }

        // 레거시 핸들러
        if (onLinkClick) {
            event.preventDefault();
            onLinkClick(href, label);
        } else if (utils?.navigate) {
            event.preventDefault();
            utils.navigate(href);
        }
    };

    const handleButtonClick = (action: string, data?: any) => {
        // API 가이드 액션 우선 사용
        if (actualActions) {
            switch (action) {
                case 'cancel':
                    if (data && actualActions.handleCancelOrder) {
                        const orderId = typeof data.id === 'number' ? data.id : parseInt(data.orderId);
                        actualActions.handleCancelOrder(orderId);
                    }
                    break;
                case 'track':
                case 'delivery':
                    if (data && actualActions.openDeliveryModal) {
                        actualActions.openDeliveryModal(data);
                    }
                    break;
                case 'reorder':
                case 'addToCart':
                    if (data && actualActions.handleAddToCartAgain) {
                        actualActions.handleAddToCartAgain(data);
                    }
                    break;
                case 'review':
                    if (data && actualActions.openReviewModal) {
                        actualActions.openReviewModal(data.product, data.order);
                    }
                    break;
                default:
                    break;
            }
        }

        // 레거시 핸들러
        if (onButtonClick) {
            onButtonClick(action, data);
        }
    };

    const handleFilterChange = (type: 'period' | 'status', value: string) => {
        // API 가이드 액션 우선 사용
        if (actualActions) {
            if (type === 'period') {
                actualActions.setSelectedDateRange(value);
            } else if (type === 'status') {
                actualActions.setSelectedStatus(value);
            }
        }

        // 레거시 핸들러
        if (onFilterChange) {
            onFilterChange(type, value);
        }
    };

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        // API 가이드 액션 우선 사용
        if (actualActions?.setSearchQuery) {
            actualActions.setSearchQuery(searchTerm);
        }

        // 레거시 핸들러
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

    // 로딩 상태
    if (currentIsLoading) {
        return (
            <div className="lg:pt-10 pb-15 lg:pb-30">
                <div className="max-lg:px-4 text-center py-20">
                    <p>{utils?.t ? utils.t('주문 내역을 불러오는 중입니다...') : '주문 내역을 불러오는 중입니다...'}</p>
                    {debug && (
                        <p className="text-sm text-gray-500 mt-2">데이터 소스: {dataSource}</p>
                    )}
                </div>
            </div>
        );
    }

    // 에러 상태
    if (currentHasError) {
        const errorMessage = typeof currentHasError === 'string' ? currentHasError : 
                           utils?.t ? utils.t('주문 내역을 불러오는데 실패했습니다') : '주문 내역을 불러오는데 실패했습니다';
        
        return (
            <div className="lg:pt-10 pb-15 lg:pb-30">
                <div className="max-lg:px-4 text-center py-20">
                    <p className="text-red-600 mb-4">{errorMessage}</p>
                    {debug && (
                        <div className="text-sm text-gray-500 mb-4">
                            <p>데이터 소스: {dataSource}</p>
                            <p>에러 타입: {typeof currentHasError}</p>
                        </div>
                    )}
                    <button 
                        className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
                        onClick={() => {
                            setDataError(null);
                            window.location.reload();
                        }}
                    >
                        {utils?.t ? utils.t('다시 시도') : '다시 시도'}
                    </button>
                </div>
            </div>
        );
    }

    // 로그인 필요
    if (!isLoggedIn) {
        return (
            <div className="lg:pt-10 pb-15 lg:pb-30">
                <div className="max-lg:px-4 text-center py-20">
                    <p className="mb-4">{utils?.t ? utils.t('주문 내역을 확인하려면 로그인이 필요합니다.') : '주문 내역을 확인하려면 로그인이 필요합니다.'}</p>
                    <button 
                        className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
                        onClick={() => utils?.navigate ? utils.navigate('/login') : window.location.href = '/login'}
                    >
                        {utils?.t ? utils.t('로그인') : '로그인'}
                    </button>
                </div>
            </div>
        );
    }

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
                    <h2 className="max-lg:hidden text-2xl font-semibold">{displayTitle}</h2>
                )}

                {/* 필터 폼 */}
                <div className="mt-6 mb-4">
                    <form className="flex max-lg:flex-wrap items-center gap-2" onSubmit={handleSearchSubmit}>
                        {/* 기간 필터 */}
                        <select
                            id="period-filter"
                            className="flex-1 lg:w-1/3 px-4 py-2 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
                            value={currentSelectedDateRange}
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
                            value={currentSelectedStatus}
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
                                    placeholder={utils?.t ? utils.t('상품명을 입력해 주세요') : '상품명을 입력해 주세요'}
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

            {/* 주문 목록 또는 빈 상태 */}
            <div className="max-lg:p-4">
                {isEmpty ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 mb-4">{emptyText}</p>
                        {debug && (
                            <div className="text-sm text-gray-500 mb-4">
                                <p>데이터 소스: {dataSource}</p>
                                <p>API 주문 수: {apiOrders?.length || 0}</p>
                                <p>레거시 주문 수: {orders?.length || 0}</p>
                            </div>
                        )}
                        <button 
                            className="px-4 py-2 bg-accent text-white rounded hover:bg-accent/80"
                            onClick={() => utils?.navigate ? utils.navigate('/shop') : window.location.href = '/shop'}
                        >
                            {utils?.t ? utils.t('쇼핑 계속하기') : '쇼핑 계속하기'}
                        </button>
                    </div>
                ) : (
                    <>
                        {debug && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                                <p><strong>디버그 정보:</strong></p>
                                <p>데이터 소스: {dataSource}</p>
                                <p>표시 주문 수: {displayOrders?.length || 0}</p>
                                <p>API 주문 수: {apiOrders?.length || 0}</p>
                            </div>
                        )}
                        
                        <OrderItemList
                            orders={displayOrders}
                            apiOrders={apiOrders}
                            onLinkClick={handleLinkClick}
                            onButtonClick={handleButtonClick}
                            utils={utils}
                            actualActions={actualActions}
                            dataSource={dataSource}
                        />
                        
                        {/* 페이지네이션 (API 가이드 기반) */}
                        {actualData?.pagination && actualData.pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => actualActions?.handlePageChange?.(1)}
                                        disabled={actualData.pagination.currentPage === 1}
                                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                                    >
                                        {utils?.t ? utils.t('처음') : '처음'}
                                    </button>
                                    <button
                                        onClick={() => actualActions?.handlePageChange?.(actualData.pagination.currentPage - 1)}
                                        disabled={actualData.pagination.currentPage === 1}
                                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                                    >
                                        {utils?.t ? utils.t('이전') : '이전'}
                                    </button>
                                    <span className="px-3 py-1 text-sm">
                                        {actualData.pagination.currentPage} / {actualData.pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => actualActions?.handlePageChange?.(actualData.pagination.currentPage + 1)}
                                        disabled={actualData.pagination.currentPage === actualData.pagination.totalPages}
                                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                                    >
                                        {utils?.t ? utils.t('다음') : '다음'}
                                    </button>
                                    <button
                                        onClick={() => actualActions?.handlePageChange?.(actualData.pagination.totalPages)}
                                        disabled={actualData.pagination.currentPage === actualData.pagination.totalPages}
                                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
                                    >
                                        {utils?.t ? utils.t('마지막') : '마지막'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// 주문 아이템 리스트 컴포넌트
function OrderItemList({
    orders,
    apiOrders = [],
    onLinkClick,
    onButtonClick,
    utils,
    actualActions,
    dataSource
}: {
    orders: OrderItem[];
    apiOrders?: Order[];
    onLinkClick: (href: string, label: string, event: React.MouseEvent) => void;
    onButtonClick: (action: string, data?: any) => void;
    utils?: ComponentSkinProps['utils'];
    actualActions?: ComponentSkinProps['actions'];
    dataSource?: string;
}) {
    // 데이터 소스에 따른 렌더링 결정
    const shouldRenderApiOrders = dataSource === 'api' && apiOrders.length > 0;
    const shouldRenderLegacyOrders = !shouldRenderApiOrders && orders && orders.length > 0;

    // 주문 상태 정보 가져오기
    const getStatusInfo = (status: string) => {
        if (actualActions?.getStatusInfo) {
            return actualActions.getStatusInfo(status);
        }
        
        // 기본 상태 정보
        const statusMap: Record<string, { text: string; class: string; icon: string }> = {
            'REQUESTED': { text: '주문 요청됨', class: 'status-requested', icon: '📋' },
            'PENDING': { text: '결제 대기 중', class: 'status-pending', icon: '⏳' },
            'PREPARING': { text: '상품 준비 중', class: 'status-preparing', icon: '📦' },
            'PAID': { text: '결제 완료', class: 'status-paid', icon: '💰' },
            'SHIPPING': { text: '배송 중', class: 'status-shipping', icon: '🚚' },
            'ARRIVED': { text: '배송 도착', class: 'status-arrived', icon: '🏠' },
            'FINISHED': { text: '배송 완료', class: 'status-finished', icon: '✅' },
            'ISSUE': { text: '배송 문제 발생', class: 'status-issue', icon: '⚠️' },
            'CANCELLED': { text: '주문 취소됨', class: 'status-cancelled', icon: '❌' },
            'CANCELED': { text: '주문 취소됨', class: 'status-cancelled', icon: '❌' },
            'REFUNDED': { text: '환불 완료', class: 'status-refunded', icon: '💸' },
        };
        
        return statusMap[status] || { text: status, class: 'status-default', icon: '📋' };
    };

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        if (actualActions?.formatDate) {
            return actualActions.formatDate(dateString);
        }
        if (utils?.formatDate) {
            return utils.formatDate(dateString);
        }
        return formatDeliveryDate(dateString);
    };

    // 금액 포맷팅
    const formatCurrencyAmount = (amount: number) => {
        if (utils?.formatCurrency) {
            return utils.formatCurrency(amount);
        }
        return formatCurrency(amount);
    };

    return (
        <ul className="space-y-4">
            {/* API 기반 주문 렌더링 */}
            {shouldRenderApiOrders && apiOrders.map((order) => (
                <li key={order.id} className="w-full border border-border bg-white">
                    {/* 상단 헤더 라인 */}
                    <div className="flex items-center justify-between pl-3 lg:pl-4 pr-1 lg:pr-2 py-2 lg:py-3 border-b border-border text-sm">
                        <p>{utils?.t ? utils.t('주문번호') : '주문번호'}: {order.orderNumber || order.id}</p>
                        <a
                            className="flex items-center gap-1 font-semibold text-black/70 lg:text-description lg:hover:text-black transition-colors"
                            href={`/myzone/order-detail/${order.id}`}
                            onClick={(e) => onLinkClick(`/myzone/order-detail/${order.id}`, "주문상세보기", e)}
                            data-discover="true"
                            data-action="detail"
                            data-order-id={order.id.toString()}
                        >
                            <span>{utils?.t ? utils.t('주문상세보기') : '주문상세보기'}</span>
                            <ChevronRightIcon />
                        </a>
                    </div>

                    {/* 주문 상태 및 날짜 */}
                    <div className="px-3 lg:px-4 py-2 border-b border-border bg-gray-50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${getStatusInfo(order.status).class}`}>
                                    <span>{getStatusInfo(order.status).icon}</span>
                                    {getStatusInfo(order.status).text}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {formatDate(order.createdAt)}
                                </span>
                            </div>
                            <div className="text-sm font-semibold">
                                {utils?.t ? utils.t('총 결제금액') : '총 결제금액'}: {formatCurrencyAmount(order.totalAmount)}원
                            </div>
                        </div>
                    </div>

                    {/* 상품 목록 */}
                    {order.carts.map((cartItem) => (
                        <div key={cartItem.id} className="lg:grid lg:grid-cols-[1fr_220px]">
                            <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4">
                                <div className="shrink-0">
                                    <a
                                        href={`/myzone/order-detail/${order.id}`}
                                        onClick={(e) => onLinkClick(`/myzone/order-detail/${order.id}`, cartItem.product.title, e)}
                                        data-discover="true"
                                        data-action="detail"
                                        data-order-id={order.id.toString()}
                                    >
                                        <img
                                            alt={cartItem.product.title}
                                            className="w-[90px] h-[90px] lg:w-28 lg:h-28 object-cover rounded"
                                            src={cartItem.product.config?.img_url || '/images/product/placeholder.png'}
                                        />
                                    </a>
                                </div>
                                <div className="flex-1">
                                    <p className="mt-0.5 lg:mt-1 text-sm lg:text-base font-semibold truncate">
                                        {cartItem.product.title}
                                    </p>
                                    
                                    {/* 옵션 표시 */}
                                    {cartItem.options?.options && cartItem.options.options.length > 0 && (
                                        <div className="mt-1 text-xs lg:text-sm text-description">
                                            {cartItem.options.options.map((option, idx) => (
                                                <span key={idx} className="mr-2">
                                                    {option.groupName}: {option.valueName}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    
                                    <p className="flex items-center gap-1 text-xs lg:text-sm text-description mt-1">
                                        <span>{utils?.t ? utils.t('수량') : '수량'} {cartItem.count}</span>
                                    </p>
                                    
                                    <div className="mt-1 lg:mt-2 flex items-center justify-between lg:block">
                                        <p className="text-lg lg:text-xl font-bold">
                                            {formatCurrencyAmount(Number(cartItem.unitPrice))}
                                            <span className="text-sm lg:text-base font-semibold">원</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 우측: 액션 영역 */}
                            <div className="hidden lg:block border-l border-border">
                                <div className="h-full px-4 flex flex-col justify-center gap-2">
                                    {/* 주문 취소 (pending 상태에서만) */}
                                    {order.status === 'PENDING' && (
                                        <button
                                            type="button"
                                            className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                                            onClick={() => onButtonClick('cancel', order)}
                                        >
                                            {utils?.t ? utils.t('주문 취소') : '주문 취소'}
                                        </button>
                                    )}
                                    
                                    {/* 배송조회 (배송 관련 상태에서) */}
                                    {(['SHIPPING', 'ARRIVED', 'FINISHED'].includes(order.status)) && (
                                        <button
                                            type="button"
                                            className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                                            onClick={() => onButtonClick('delivery', order)}
                                        >
                                            {utils?.t ? utils.t('배송조회') : '배송조회'}
                                        </button>
                                    )}
                                    
                                    {/* 리뷰 작성 (배송 완료 상태에서) */}
                                    {order.status === 'FINISHED' && (
                                        <button
                                            type="button"
                                            className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                                            onClick={() => onButtonClick('review', { product: cartItem.product, order })}
                                        >
                                            {utils?.t ? utils.t('리뷰 작성') : '리뷰 작성'}
                                        </button>
                                    )}
                                    
                                    {/* 다시 담기 */}
                                    <button
                                        type="button"
                                        className="w-full py-1.5 text-sm font-semibold text-accent border border-accent rounded transition-colors hover:bg-accent hover:text-white"
                                        onClick={() => onButtonClick('reorder', order)}
                                    >
                                        {utils?.t ? utils.t('다시 담기') : '다시 담기'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </li>
            ))}

            {/* 레거시 주문 렌더링 */}
            {shouldRenderLegacyOrders && orders.map((item) => (
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