import * as React from 'react';
import { useState, useEffect } from 'react';

// 주문 아이템 타입
interface OrderItem {
  orderNumber: string;
  productName: string;
  productImage: string;
  status: string;
  deliveryInfo: string;
  description: string;
  quantity: number;
  price: number;
  productUrl?: string;
  orderDetailUrl?: string;
}

// Props 인터페이스 정의
interface OrderCancelListProps {
  orders?: OrderItem[];
  onOrderDetailClick?: (orderNumber: string) => void;
  onProductClick?: (orderNumber: string) => void;
  onCancelRequest?: (orderNumber: string) => void;
  onReturnRequest?: (orderNumber: string) => void;
  onPurchaseConfirm?: (orderNumber: string) => void;
  onPeriodChange?: (period: string) => void;
  onStatusChange?: (status: string) => void;
}

// 기본 주문 데이터
const defaultOrders: OrderItem[] = [
  {
    orderNumber: '2025-08-27-101661',
    productName: '남성 크로스백 8103378',
    productImage: '/images/product/product-1-2.jpg',
    status: '상품준비중',
    deliveryInfo: '8/29(금)이내 도착예정',
    description: '단일상품',
    quantity: 1,
    price: 1318100,
    productUrl: '/myzone/order-detail/2025-08-27-101661',
    orderDetailUrl: '/myzone/order-detail/2025-08-27-101661'
  },
  {
    orderNumber: '2025-08-27-101632',
    productName: '여성 크로스백 8103378',
    productImage: '/images/product/product-1-2.jpg',
    status: '상품준비중',
    deliveryInfo: '8/29(금)이내 도착예정',
    description: '단일상품',
    quantity: 1,
    price: 1318100,
    productUrl: '/myzone/order-detail/2025-08-27-101632',
    orderDetailUrl: '/myzone/order-detail/2025-08-27-101632'
  }
];

export default function OrderCancelListStandalone({
  orders = defaultOrders,
  onOrderDetailClick,
  onProductClick,
  onCancelRequest,
  onReturnRequest,
  onPurchaseConfirm,
  onPeriodChange,
  onStatusChange
}: OrderCancelListProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('recent-1month');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Tailwind CSS CDN 자동 로드
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      document.head.appendChild(script);

      // Tailwind 설정
      script.onload = () => {
        if ((window as any).tailwind) {
          (window as any).tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'accent': '#41c5af',
                  'description': '#6b7280',
                  'border': '#e5e7eb'
                },
                spacing: {
                  '15': '3.75rem',
                  '30': '7.5rem'
                },
                zIndex: {
                  '2': '2'
                }
              }
            }
          };
        }
      };
    }
  }, []);

  // 화살표 아이콘 컴포넌트
  const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4 fill-current">
      <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
    </svg>
  );

  // 이벤트 핸들러
  const handleOrderDetailClick = (orderNumber: string) => {
    if (onOrderDetailClick) {
      onOrderDetailClick(orderNumber);
    } else {
      console.log('Order detail clicked:', orderNumber);
    }
  };

  const handleProductClick = (orderNumber: string) => {
    if (onProductClick) {
      onProductClick(orderNumber);
    } else {
      console.log('Product clicked:', orderNumber);
    }
  };

  const handleCancelRequest = (orderNumber: string) => {
    if (onCancelRequest) {
      onCancelRequest(orderNumber);
    } else {
      console.log('Cancel request:', orderNumber);
    }
  };

  const handleReturnRequest = (orderNumber: string) => {
    if (onReturnRequest) {
      onReturnRequest(orderNumber);
    } else {
      console.log('Return request:', orderNumber);
    }
  };

  const handlePurchaseConfirm = (orderNumber: string) => {
    if (onPurchaseConfirm) {
      onPurchaseConfirm(orderNumber);
    } else {
      console.log('Purchase confirm:', orderNumber);
    }
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = e.target.value;
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  return (
    <div className="lg:pt-10 pb-15 lg:pb-30">
      {/* 모바일 상단 탭 네비게이션 */}
      <nav className="sticky top-[57px] h-fit z-2 lg:hidden flex items-center bg-white">
        <a 
          className="flex-1 block h-[50px]" 
          href="/myzone/orders?status=all" 
          data-discover="true"
          onClick={(e) => e.preventDefault()}
        >
          <span className="flex items-center justify-center w-full h-full border-b border-border">
            주문/배송
          </span>
        </a>
        <a 
          className="flex-1 flex items-center justify-center h-[50px]" 
          href="/myzone/orders?status=cancelled" 
          data-discover="true"
          onClick={(e) => e.preventDefault()}
        >
          <span className="flex items-center justify-center w-full h-full font-semibold border-b-2">
            취소/교환/반품
          </span>
        </a>
      </nav>

      {/* 메인 컨텐츠 */}
      <div className="max-lg:px-4">
        {/* 데스크톱 제목 */}
        <h2 className="max-lg:hidden text-2xl font-semibold">취소/교환/반품 조회</h2>

        {/* 필터 영역 */}
        <div className="mt-6 mb-4">
          <form className="flex max-lg:flex-wrap items-center gap-2">
            {/* 기간 필터 */}
            <select 
              id="period-filter" 
              className="flex-1 lg:w-1/3 px-4 py-2 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              <option value="recent-1month">최근 1개월</option>
              <option value="recent-3months">최근 3개월</option>
              <option value="recent-6months">최근 6개월</option>
              <option value="2025">2025년</option>
              <option value="2024">2024년</option>
              <option value="2023">2023년</option>
            </select>

            {/* 상태 필터 */}
            <select 
              id="status-filter" 
              className="flex-1 lg:w-1/3 px-4 py-2 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="all">전체보기</option>
              <option value="order-received">주문접수</option>
              <option value="payment-completed">결제완료</option>
              <option value="preparing">상품준비중</option>
              <option value="shipping">배송중</option>
              <option value="delivered">배송완료</option>
            </select>
          </form>
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="max-lg:p-4">
        <ul className="space-y-4">
          {orders.map((order, index) => (
            <li key={index} className="w-full border border-border bg-white">
              {/* 주문 헤더 */}
              <div className="flex items-center justify-between pl-3 lg:pl-4 pr-1 lg:pr-2 py-2 lg:py-3 border-b border-border text-sm">
                <p>{order.orderNumber}</p>
                <button 
                  className="flex items-center gap-1 font-semibold text-black/70 lg:text-description lg:hover:text-black transition-colors"
                  onClick={() => handleOrderDetailClick(order.orderNumber)}
                >
                  <span>주문상세보기</span>
                  <ArrowRightIcon />
                </button>
              </div>

              {/* 주문 내용 */}
              <div className="lg:grid lg:grid-cols-[1fr_220px]">
                {/* 상품 정보 */}
                <div className="flex items-center gap-3 lg:gap-4 p-3 lg:p-4">
                  {/* 상품 이미지 */}
                  <div className="shrink-0">
                    <button onClick={() => handleProductClick(order.orderNumber)}>
                      <img 
                        alt={order.productName}
                        className="w-[90px] h-[90px] lg:w-28 lg:h-28 object-cover rounded" 
                        src={order.productImage}
                      />
                    </button>
                  </div>

                  {/* 상품 상세 정보 */}
                  <div className="flex-1">
                    {/* 상태 및 배송 정보 */}
                    <p className="flex items-center gap-2 text-sm lg:text-base font-semibold">
                      <span>{order.status}</span>
                      <span className="text-accent text-sm">{order.deliveryInfo}</span>
                    </p>

                    {/* 상품명 */}
                    <p className="mt-0.5 lg:mt-1 text-sm lg:text-base truncate">
                      {order.productName}
                    </p>

                    {/* 상품 옵션 */}
                    <p className="flex items-center gap-1 text-xs lg:text-sm text-description">
                      <span>{order.description}</span>
                      <span>수량 {order.quantity}</span>
                    </p>

                    {/* 가격 */}
                    <div className="mt-1 lg:mt-2 flex items-center justify-between lg:block">
                      <p className="text-lg lg:text-xl font-bold">
                        {formatPrice(order.price)}
                        <span className="text-sm lg:text-base font-semibold">원</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼 (데스크톱만) */}
                <div className="hidden lg:block border-l border-border">
                  <div className="h-full px-4 flex flex-col justify-center gap-2">
                    <button 
                      type="button" 
                      className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                      onClick={() => handleCancelRequest(order.orderNumber)}
                    >
                      취소신청
                    </button>
                    <button 
                      type="button" 
                      className="w-full py-1.5 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                      onClick={() => handleReturnRequest(order.orderNumber)}
                    >
                      반품신청
                    </button>
                    <button 
                      type="button" 
                      className="w-full py-1.5 text-sm font-semibold text-accent border border-accent rounded transition-colors hover:bg-accent hover:text-white"
                      onClick={() => handlePurchaseConfirm(order.orderNumber)}
                    >
                      구매확정
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}