import * as React from 'react';

// Props 인터페이스 정의
interface ReviewProduct {
    id: string;
    name: string;
    option?: string;
    purchaseDate: string;
    imageUrl: string;
    hasReview?: boolean;
}

interface MyReviewItem {
    id: string;
    productName: string;
    option?: string;
    productRating: number;
    deliveryRating: number;
    reviewText: string;
    reviewDate: string;
    imageUrl?: string;
    isExpanded?: boolean;
}

interface TabItem {
    label: string;
    count?: number;
    subLabel?: string;
    badge?: string;
    isActive?: boolean;
}

interface ReviewProps {
    // 페이지 제목
    title?: string;
    showTitle?: boolean;
    
    // 탭 설정
    tabs?: TabItem[];
    
    // 등록 가능한 리뷰 상품 목록
    reviewableProducts?: ReviewProduct[];
    
    // 나의 리뷰 목록
    myReviews?: MyReviewItem[];
    
    // 도움 통계
    helpCount?: number;
    
    // 이벤트 핸들러
    onTabClick?: (index: number, label: string) => void;
    onWriteReview?: (productId: string) => void;
    onReviewClick?: (reviewId: string) => void;
    onExpandReview?: (reviewId: string) => void;
}

// 기본 데이터
const defaultTabs: TabItem[] = [
    { 
        label: "등록 가능한 리뷰", 
        count: 3,
        subLabel: "건",
        badge: "최대 +0P 적립",
        isActive: true 
    },
    { 
        label: "나의 리뷰", 
        count: 2,
        subLabel: "건"
    }
];

const defaultReviewableProducts: ReviewProduct[] = [
    {
        id: "prod-1",
        name: "남성 크로스백 8103378",
        option: "단일상품",
        purchaseDate: "2025-08-27",
        imageUrl: "/images/product/product-1-2.jpg"
    },
    {
        id: "prod-2",
        name: "여성 크로스백 8103378",
        option: "단일상품",
        purchaseDate: "2025-08-27",
        imageUrl: "/images/product/product-1-2.jpg"
    },
    {
        id: "prod-3",
        name: "컴포트 샌들",
        option: "240 / 블랙",
        purchaseDate: "2025-08-20",
        imageUrl: "/images/product/product-1-2.jpg"
    }
];

const defaultMyReviews: MyReviewItem[] = [
    {
        id: "review-1",
        productName: "남성 크로스백 8103378",
        option: "단일상품",
        productRating: 4,
        deliveryRating: 5,
        reviewText: "디자인이 깔끔하고 수납이 좋아요. 데일리로 들기 좋습니다. 스트랩 길이 조절도 편하고 마감도 깔끔합니다.",
        reviewDate: "2025-08-22",
        imageUrl: "/images/product/product-1-2.jpg"
    },
    {
        id: "review-2",
        productName: "컴포트 샌들",
        option: "240 / 블랙",
        productRating: 5,
        deliveryRating: 4,
        reviewText: "발볼이 넓은 편인데도 편했고, 배송도 빨랐어요. 여름 내내 잘 신을 듯!",
        reviewDate: "2025-08-10"
    }
];

export default function ReviewStandalone({
    title = "나의 리뷰",
    showTitle = true,
    tabs = defaultTabs,
    reviewableProducts = defaultReviewableProducts,
    myReviews = defaultMyReviews,
    helpCount = 0,
    onTabClick,
    onWriteReview,
    onReviewClick,
    onExpandReview
}: ReviewProps) {

    const [activeTab, setActiveTab] = React.useState(
        tabs.findIndex(tab => tab.isActive) !== -1 ? tabs.findIndex(tab => tab.isActive) : 0
    );

    const [expandedReviews, setExpandedReviews] = React.useState<Set<string>>(new Set());

    const handleTabClick = (index: number) => {
        setActiveTab(index);
        if (onTabClick) {
            onTabClick(index, tabs[index].label);
        }
    };

    const handleWriteReview = (productId: string) => {
        if (onWriteReview) {
            onWriteReview(productId);
        }
    };

    const handleReviewClick = (reviewId: string) => {
        if (onReviewClick) {
            onReviewClick(reviewId);
        }
    };

    const handleExpandReview = (reviewId: string) => {
        setExpandedReviews(prev => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
        if (onExpandReview) {
            onExpandReview(reviewId);
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
            <nav className="max-lg:sticky max-lg:top-[57px] max-lg:h-fit max-lg:z-2 bg-white lg:mt-6">
                <div className="grid grid-cols-2 text-center">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`relative max-lg:pt-6 py-2 ${
                                activeTab === index 
                                    ? 'font-semibold border-b-2 border-current' 
                                    : 'border-b border-border'
                            }`}
                            onClick={() => handleTabClick(index)}
                        >
                            {tab.badge && activeTab === index && (
                                <div className="absolute top-1 lg:-top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="px-2 py-0.5 rounded bg-accent text-white text-[10px]">
                                        {tab.badge}
                                    </span>
                                </div>
                            )}
                            <div className="text-xl lg:text-3xl font-semibold">
                                {tab.count}
                                {tab.subLabel && (
                                    <span className="align-middle text-sm lg:text-base font-normal">
                                        {tab.subLabel}
                                    </span>
                                )}
                            </div>
                            <div className="text-[10px] lg:text-xs text-description">
                                {tab.label}
                            </div>
                        </button>
                    ))}
                </div>

                {/* 도움 통계 바 */}
                <div className="bg-border/25 text-sm text-description px-4 py-3">
                    <span className="flex items-center justify-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-description" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 21H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h2v11Zm2 0V8.34a2 2 0 0 1 .59-1.42l3.65-3.64a1 1 0 0 1 1.71.7V8h3a2 2 0 0 1 2 2l-1 5a6 6 0 0 1-5.89 5H11Z"></path>
                        </svg>
                        <span className="leading-none">
                            회원님의 리뷰가 <b>{helpCount}명</b>에게 도움이 됐어요
                        </span>
                    </span>
                </div>
            </nav>

            <div className="max-lg:p-4 max-lg:mt-2 mt-6">
                {/* 탭별 컨텐츠 */}
                {activeTab === 0 ? (
                    // 등록 가능한 리뷰 탭
                    <ReviewableProductList
                        products={reviewableProducts}
                        onWriteReview={handleWriteReview}
                    />
                ) : (
                    // 나의 리뷰 탭
                    <MyReviewList
                        reviews={myReviews}
                        expandedReviews={expandedReviews}
                        onReviewClick={handleReviewClick}
                        onExpandReview={handleExpandReview}
                    />
                )}
            </div>
        </div>
    );
}

// 등록 가능한 리뷰 상품 목록
function ReviewableProductList({
    products,
    onWriteReview
}: {
    products: ReviewProduct[];
    onWriteReview: (productId: string) => void;
}) {
    return (
        <ul className="space-y-3">
            {products.map((product) => (
                <li key={product.id} className="flex items-center gap-4 p-2 lg:p-4 border border-border rounded bg-white">
                    {/* 상품 이미지 */}
                    <div className="w-20 h-20 lg:w-24 lg:h-24 overflow-hidden rounded bg-border/25">
                        <img 
                            alt="상품 이미지" 
                            className="w-full h-full object-cover"
                            src={product.imageUrl}
                        />
                    </div>
                    
                    {/* 상품 정보 */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{product.name}</p>
                        <p className="text-sm text-description truncate">{product.option}</p>
                        <p className="text-xs text-description mt-1">구매일 {product.purchaseDate}</p>
                    </div>
                    
                    {/* 리뷰 작성 버튼 */}
                    <div className="shrink-0">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center px-4 py-2 rounded bg-accent text-white text-sm font-semibold"
                            onClick={() => onWriteReview(product.id)}
                        >
                            리뷰 작성
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

// 나의 리뷰 목록
function MyReviewList({
    reviews,
    expandedReviews,
    onReviewClick,
    onExpandReview
}: {
    reviews: MyReviewItem[];
    expandedReviews: Set<string>;
    onReviewClick: (reviewId: string) => void;
    onExpandReview: (reviewId: string) => void;
}) {
    return (
        <div className="border-t border-border">
            {reviews.map((review, index) => (
                <div 
                    key={review.id} 
                    className="border-b border-border py-4 lg:py-5 cursor-pointer"
                    onClick={() => onReviewClick(review.id)}
                >
                    {/* 상품 정보 및 평점 */}
                    <div className="mb-3">
                        <p className="font-semibold truncate">{review.productName}</p>
                        <div className="flex items-center gap-4 mb-1">
                            {/* 상품 평점 */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm">상품</span>
                                <StarRating rating={review.productRating} />
                            </div>
                            {/* 배송 평점 */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm">배송</span>
                                <StarRating rating={review.deliveryRating} />
                            </div>
                        </div>
                        <div className="text-xs lg:text-sm text-description">{review.option}</div>
                    </div>

                    {/* 리뷰 내용 */}
                    <div className="flex gap-4">
                        {/* 리뷰 이미지 (있는 경우) */}
                        {review.imageUrl && (
                            <div className="shrink-0 w-20 h-20 lg:w-24 lg:h-24">
                                <img 
                                    alt="리뷰 이미지" 
                                    className="w-full h-full object-cover rounded"
                                    src={review.imageUrl}
                                />
                            </div>
                        )}
                        
                        {/* 리뷰 텍스트 */}
                        <div className="flex-1 flex flex-col justify-between">
                            <p className={`max-lg:text-sm mb-2 ${
                                expandedReviews.has(review.id) ? '' : 'line-clamp-3'
                            }`}>
                                {review.reviewText}
                            </p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-sm text-description">
                                    <span>{review.reviewDate}</span>
                                </div>
                                {review.reviewText.length > 100 && (
                                    <button 
                                        className="flex items-center text-xs lg:text-sm text-description hover:text-black hover:fill-black"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onExpandReview(review.id);
                                        }}
                                    >
                                        <span>{expandedReviews.has(review.id) ? '접기' : '더보기'}</span>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 -960 960 960" 
                                            className={`w-5 h-5 fill-current transition-transform ${
                                                expandedReviews.has(review.id) ? 'rotate-180' : 'rotate-0'
                                            }`}
                                        >
                                            <path d="M480-384.85q-6.46 0-11.92-2.11-5.46-2.12-10.7-7.35L281.85-569.85q-5.62-5.61-6-13.77-.39-8.15 6-14.53 6.38-6.39 14.15-6.39 7.77 0 14.15 6.39L480-428.31l169.85-169.84q5.61-5.62 13.77-6 8.15-.39 14.53 6 6.39 6.38 6.39 14.15 0 7.77-6.39 14.15L502.62-394.31q-5.24 5.23-10.7 7.35-5.46 2.11-11.92 2.11Z"></path>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// 별점 컴포넌트
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                    key={star}
                    viewBox="0 0 24 24" 
                    className={`w-4 h-4 ${
                        star <= rating 
                            ? 'fill-current text-accent' 
                            : 'fill-border text-accent'
                    }`}
                >
                    <path d="M12 .587l3.668 7.431L24 9.753l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.601 0 9.753l8.332-1.735L12 .587z"></path>
                </svg>
            ))}
        </div>
    );
}