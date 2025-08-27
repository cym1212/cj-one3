import * as React from 'react';
import { useState, useEffect } from 'react';

// Types
interface InquiryItem {
  id: string;
  status: 'answered' | 'pending';
  category: string;
  subcategory: string;
  date: string;
  orderNumber?: string;
  productName?: string;
  productImage?: string;
  content: string;
}

interface InquiryListProps {
  data?: InquiryItem[];
  onItemClick?: (item: InquiryItem) => void;
}

// 기본 데이터
const defaultData: InquiryItem[] = [
  {
    id: '1',
    status: 'answered',
    category: '배송 문의',
    subcategory: '배송일정 문의',
    date: '2025-08-27 10:21',
    orderNumber: '2025-08-26-101661',
    productName: '현 고백자 수저받침 2P세트',
    productImage: '/images/product/product-1-2.jpg',
    content: '배송 예정일이 언제인지 알려주세요. 일정 조율이 필요합니다.'
  },
  {
    id: '2',
    status: 'pending',
    category: '교환/반품 문의',
    subcategory: '배송지 변경 요청',
    date: '2025-08-26 18:03',
    orderNumber: '2025-08-27-101632',
    productName: '여성 크로스백 8103378',
    productImage: '/images/product/product-1-2.jpg',
    content: '다음 주소로 변경 부탁드립니다. (서울시 강남구 …)'
  },
  {
    id: '3',
    status: 'answered',
    category: '주문/결제 문의',
    subcategory: '배송비 문의',
    date: '2025-08-25 09:41',
    content: '주문 시 배송비가 이중으로 계산된 것 같습니다. 확인 부탁드립니다.'
  },
  {
    id: '4',
    status: 'pending',
    category: '상품 문의',
    subcategory: '배송 오류 문의',
    date: '2025-08-24 21:10',
    content: '같은 상품을 2건 주문했는데 1건만 배송완료로 표기됩니다.'
  }
];

export default function InquiryListStandalone({
  data = defaultData,
  onItemClick
}: InquiryListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'answered'>('all');
  
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
                  'border': '#e5e7eb',
                  'discount': '#ef4444'
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

  // 탭에 따른 데이터 필터링
  const filteredData = activeTab === 'all' 
    ? data 
    : data.filter(item => 
        activeTab === 'pending' ? item.status === 'pending' : item.status === 'answered'
      );

  const handleItemClick = (item: InquiryItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="lg:pt-10 pb-15 lg:pb-30">
      {/* 헤더 */}
      <div className="max-lg:hidden max-lg:px-4">
        <h2 className="text-2xl font-semibold">문의내역</h2>
      </div>

      {/* 탭 네비게이션 */}
      <nav className="max-lg:sticky max-lg:top-[57px] max-lg:h-fit max-lg:z-2 lg:mt-2 flex items-center bg-white">
        <button
          type="button"
          className={`flex-1 block h-[50px] ${
            activeTab === 'all'
              ? 'font-semibold border-b-2 border-current'
              : 'border-b border-border'
          }`}
          onClick={() => setActiveTab('all')}
        >
          전체
        </button>
        <button
          type="button"
          className={`flex-1 block h-[50px] ${
            activeTab === 'pending'
              ? 'font-semibold border-b-2 border-current'
              : 'border-b border-border'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          미답변
        </button>
        <button
          type="button"
          className={`flex-1 block h-[50px] ${
            activeTab === 'answered'
              ? 'font-semibold border-b-2 border-current'
              : 'border-b border-border'
          }`}
          onClick={() => setActiveTab('answered')}
        >
          답변완료
        </button>
      </nav>

      {/* 문의 리스트 */}
      <div className="max-lg:p-4 mt-2 lg:mt-6">
        {filteredData.length > 0 ? (
          <ul className="space-y-3">
            {filteredData.map((item) => (
              <li key={item.id} className="border border-border rounded">
                <button
                  type="button"
                  className="w-full text-left px-4 py-3"
                  onClick={() => handleItemClick(item)}
                >
                  {/* 상태 및 카테고리 */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center h-6 px-2 rounded text-xs border ${
                        item.status === 'answered'
                          ? 'border-accent text-accent'
                          : 'border-border text-description'
                      }`}
                    >
                      {item.status === 'answered' ? '답변완료' : '미답변'}
                    </span>
                    <div className="text-sm text-description">
                      {item.category} &gt; {item.subcategory}
                    </div>
                    <div className="ml-auto text-xs text-description max-lg:hidden">
                      {item.date}
                    </div>
                  </div>

                  {/* 상품 정보 (있는 경우) */}
                  {item.productName && (
                    <div className="mt-2 flex items-center gap-3">
                      {item.productImage && (
                        <img
                          alt="상품"
                          className="w-14 h-14 object-cover rounded"
                          src={item.productImage}
                        />
                      )}
                      <div className="min-w-0">
                        {item.orderNumber && (
                          <div className="text-xs text-description">{item.orderNumber}</div>
                        )}
                        <div className="truncate">{item.productName}</div>
                      </div>
                    </div>
                  )}

                  {/* 문의 내용 */}
                  <div className="mt-2 text-sm lg:line-clamp-2 max-lg:line-clamp-3">
                    {item.content}
                  </div>

                  {/* 모바일 날짜 */}
                  <div className="lg:hidden mt-1 text-xs text-description">
                    {item.date}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-20 text-center text-description">
            {activeTab === 'all' && '문의 내역이 없습니다.'}
            {activeTab === 'pending' && '미답변 문의가 없습니다.'}
            {activeTab === 'answered' && '답변완료된 문의가 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
}