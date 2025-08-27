import * as React from 'react';

// Props 인터페이스 정의
interface CouponItem {
    id: string;
    discount: string;
    title: string;
    brand: string;
    downloadCount?: number | string;
    searchUrl: string;
    isOwned?: boolean;
}

interface TabItem {
    label: string;
    count?: number;
    isActive?: boolean;
}

interface CouponProps {
    // 페이지 제목
    title?: string;
    showTitle?: boolean;
    
    // 탭 설정
    tabs?: TabItem[];
    
    // 쿠폰 목록 (탭별로 다른 쿠폰 목록)
    ownedCoupons?: CouponItem[];
    downloadableCoupons?: CouponItem[];
    
    // 안내사항
    notices?: string[];
    
    // 전체 쿠폰 받기 버튼 표시 여부
    showDownloadAllButton?: boolean;
    downloadAllButtonText?: string;
    
    // 이벤트 핸들러
    onTabClick?: (index: number, label: string) => void;
    onCouponDownload?: (couponId: string) => void;
    onSearchClick?: (href: string, couponId: string) => void;
    onDownloadAllClick?: () => void;
}

// 기본 데이터
const defaultTabs: TabItem[] = [
    { label: "보유 중인 쿠폰", count: 2 },
    { label: "다운 가능한 쿠폰", count: 3, isActive: true }
];

const defaultOwnedCoupons: CouponItem[] = [
    {
        id: "owned-1",
        discount: "8%",
        title: "SK매직 8% 다운로드쿠폰",
        brand: "CJ ONSTYLE",
        searchUrl: "/search?coupon=owned-1",
        isOwned: true
    },
    {
        id: "owned-2",
        discount: "5%",
        title: "백화점명품WEEK 중복쿠폰",
        brand: "쇼핑플러스 쿠폰",
        searchUrl: "/search?coupon=owned-2",
        isOwned: true
    }
];

const defaultDownloadableCoupons: CouponItem[] = [
    {
        id: "down-1",
        discount: "20%",
        title: "지오다노 20% 다운로드 쿠폰",
        brand: "CJ ONSTYLE",
        downloadCount: "99+",
        searchUrl: "/search?coupon=down-1"
    },
    {
        id: "down-2",
        discount: "15%",
        title: "지오다노 15% 다운로드 쿠폰",
        brand: "CJ ONSTYLE",
        downloadCount: "99+",
        searchUrl: "/search?coupon=down-2"
    },
    {
        id: "down-3",
        discount: "12%",
        title: "[SK매직]12% 할인쿠폰",
        brand: "CJ ONSTYLE",
        downloadCount: "99+",
        searchUrl: "/search?coupon=down-3"
    }
];

const defaultNotices: string[] = [
    "CJ ONSTYLE에서 사용 가능한 쿠폰으로 상담원 전화 주문 및 ARS 등에서 사용 가능한 쿠폰은 고객센터로 문의주시기 바랍니다.",
    "각 할인쿠폰의 구매 조건에 따라 사용 가능하며, 쿠폰 특성에 따라 일부 상품은 제외될 수 있습니다.",
    "각 할인쿠폰은 단일 상품별로 적용 가능합니다.",
    "제휴사이트(네이버,다음,다나와 등)을 통해 발행된 쿠폰은 해당 사이트를 통해 웹(PC/모바일)로 접속하신 경우만 확인 가능합니다.",
    "주문 취소/반품 시 사용된 할인쿠폰은 최초 발급된 유효기간 내에서 자동 재발행 됩니다.",
    "보유 중인 할인쿠폰 개수는 쿠폰의 종수 기준이며, 동일한 쿠폰을 여러 장 보유한 경우 해당 쿠폰의 상세 목록에서 총 보유 수량 확인이 가능합니다."
];

export default function CouponStandalone({
    title = "쿠폰",
    showTitle = true,
    tabs = defaultTabs,
    ownedCoupons = defaultOwnedCoupons,
    downloadableCoupons = defaultDownloadableCoupons,
    notices = defaultNotices,
    showDownloadAllButton = true,
    downloadAllButtonText = "전체 쿠폰 받기",
    onTabClick,
    onCouponDownload,
    onSearchClick,
    onDownloadAllClick
}: CouponProps) {

    const [activeTab, setActiveTab] = React.useState(
        tabs.findIndex(tab => tab.isActive) !== -1 ? tabs.findIndex(tab => tab.isActive) : 0
    );

    const handleTabClick = (index: number) => {
        setActiveTab(index);
        if (onTabClick) {
            onTabClick(index, tabs[index].label);
        }
    };

    const handleCouponDownload = (couponId: string) => {
        if (onCouponDownload) {
            onCouponDownload(couponId);
        }
    };

    const handleSearchClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, couponId: string) => {
        if (onSearchClick) {
            e.preventDefault();
            onSearchClick(href, couponId);
        }
    };

    const handleDownloadAllClick = () => {
        if (onDownloadAllClick) {
            onDownloadAllClick();
        }
    };

    return (
        <div className="lg:pt-10 pb-15 lg:pb-30">
            {/* PC 제목 */}
            {showTitle && (
                <div className="max-lg:hidden max-lg:px-4">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                </div>
            )}

            {/* 탭 네비게이션 */}
            <nav className="max-lg:sticky max-lg:top-[57px] max-lg:h-fit max-lg:z-2 lg:mt-2 flex items-center bg-white">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        type="button"
                        className="flex-1 block h-[50px]"
                        onClick={() => handleTabClick(index)}
                    >
                        <span className={`flex items-center justify-center gap-1 w-full h-full ${
                            activeTab === index 
                                ? 'font-semibold border-b-2 border-current' 
                                : 'border-b border-border'
                        }`}>
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="text-description">{tab.count}</span>
                            )}
                        </span>
                    </button>
                ))}
            </nav>

            <div className="max-lg:p-4 max-lg:mt-2 mt-6">
                {/* 쿠폰 목록 */}
                <CouponList 
                    coupons={activeTab === 0 ? ownedCoupons : downloadableCoupons}
                    isOwnedTab={activeTab === 0}
                    onCouponDownload={handleCouponDownload}
                    onSearchClick={handleSearchClick}
                />

                {/* PC 전체 쿠폰 받기 버튼 - 다운 가능한 쿠폰 탭에서만 표시 */}
                {showDownloadAllButton && activeTab === 1 && (
                    <div className="hidden lg:block mt-6">
                        <button 
                            className="w-full py-3 rounded-md bg-accent text-white font-semibold"
                            onClick={handleDownloadAllClick}
                        >
                            {downloadAllButtonText}
                        </button>
                    </div>
                )}

                {/* 안내사항 */}
                <NoticeList notices={notices} />
            </div>
        </div>
    );
}

// 쿠폰 목록 컴포넌트
function CouponList({ 
    coupons, 
    isOwnedTab,
    onCouponDownload,
    onSearchClick
}: { 
    coupons: CouponItem[];
    isOwnedTab: boolean;
    onCouponDownload: (couponId: string) => void;
    onSearchClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string, couponId: string) => void;
}) {
    return (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {coupons.map((coupon) => (
                <li key={coupon.id}>
                    <div className="flex rounded border border-border overflow-hidden bg-white">
                        <div className="flex-1 lg:flex items-start gap-4 p-4">
                            {/* 할인율 */}
                            <div className="shrink-0 text-accent font-bold">
                                <span className="text-lg lg:text-2xl">{coupon.discount}</span>
                            </div>
                            
                            {/* 쿠폰 정보 */}
                            <div className="min-w-0">
                                <p className="text-sm lg:text-base lg:text-lg font-semibold leading-sm">
                                    {coupon.title}
                                </p>
                                <p className="text-sm text-description mt-0.5">{coupon.brand}</p>
                                
                                {/* 사용 가능 상품 링크 */}
                                <div className="mt-1 lg:mt-2">
                                    <a 
                                        className="inline-flex items-center gap-1 py-0.5 lg:py-1 pl-2 lg:pl-3 pr-1 lg:pr-1.5 rounded border border-border text-xs transition-colors hover:bg-border/25"
                                        href={coupon.searchUrl}
                                        data-discover="true"
                                        onClick={(e) => onSearchClick(e, coupon.searchUrl, coupon.id)}
                                    >
                                        사용 가능 상품
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                                            <path d="M9.29 6.71a1 1 0 0 0 0 1.41L12.17 11H6a1 1 0 1 0 0 2h6.17l-2.88 2.88a1 1 0 1 0 1.42 1.41l4.59-4.59a1 1 0 0 0 0-1.41L10.71 6.7a1 1 0 0 0-1.42 0Z"></path>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* 다운로드 버튼 - 다운로드 가능한 쿠폰에만 표시 */}
                        {!isOwnedTab && (
                            <div className="shrink-0 w-[75px] flex flex-col items-center justify-center bg-border/25">
                                <button 
                                    type="button"
                                    aria-label="쿠폰 다운로드"
                                    className="flex flex-col items-center h-full justify-center gap-1"
                                    onClick={() => onCouponDownload(coupon.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                                        <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1Zm-7 16a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"></path>
                                    </svg>
                                    <span className="text-xs text-description">{coupon.downloadCount}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

// 안내사항 컴포넌트
function NoticeList({ notices }: { notices: string[] }) {
    return (
        <ul className="list-disc list-outside pl-4 mt-10 lg:mt-6 text-xs text-description space-y-1 lg:space-y-2">
            {notices.map((notice, index) => (
                <li key={index}>{notice}</li>
            ))}
        </ul>
    );
}