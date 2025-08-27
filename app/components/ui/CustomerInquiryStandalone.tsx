import * as React from 'react';
const { useState, useEffect } = React;

// SVG 아이콘 컴포넌트들
const ChevronDownIcon = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L6 6L11 1" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM5 4h14a1 1 0 0 1 1 1v8.586l-3.293-3.293a1 1 0 0 0-1.414 0L9 19H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm7 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
  </svg>
);

// Toggle Switch 컴포넌트
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button 
    type="button" 
    role="switch" 
    aria-checked={checked}
    onClick={onChange}
    className={`relative inline-flex w-12 h-7 items-center rounded-full transition-colors border border-border ${
      checked ? 'bg-accent' : 'bg-gray-200'
    }`}
  >
    <span 
      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0.5'
      }`}
    />
  </button>
);

// 문의 유형 옵션들
const mainInquiryTypes = [
  { value: '', label: '유형을 선택해주세요' },
  { value: '배송 문의', label: '배송 문의' },
  { value: '교환/반품 문의', label: '교환/반품 문의' },
  { value: '취소/환불 문의', label: '취소/환불 문의' },
  { value: '주문/결제 문의', label: '주문/결제 문의' },
  { value: '이벤트/혜택/회원 문의', label: '이벤트/혜택/회원 문의' },
  { value: '상품 문의', label: '상품 문의' }
];

// 세부 문의 유형 옵션들
const subInquiryTypes: Record<string, Array<{ value: string; label: string }>> = {
  '배송 문의': [
    { value: '', label: '유형을 선택해주세요' },
    { value: '배송일정 문의', label: '배송일정 문의' },
    { value: '배송지 변경 요청', label: '배송지 변경 요청' },
    { value: '배송비 문의', label: '배송비 문의' },
    { value: '배송 오류 문의', label: '배송 오류 문의' }
  ],
  '교환/반품 문의': [
    { value: '', label: '유형을 선택해주세요' },
    { value: '교환 신청', label: '교환 신청' },
    { value: '반품 신청', label: '반품 신청' },
    { value: '교환/반품 진행상태', label: '교환/반품 진행상태' },
    { value: '교환/반품 비용 문의', label: '교환/반품 비용 문의' }
  ],
  '취소/환불 문의': [
    { value: '', label: '유형을 선택해주세요' },
    { value: '주문 취소', label: '주문 취소' },
    { value: '환불 일정', label: '환불 일정' },
    { value: '부분 취소', label: '부분 취소' },
    { value: '환불 수단 문의', label: '환불 수단 문의' }
  ],
  '주문/결제 문의': [
    { value: '', label: '유형을 선택해주세요' },
    { value: '주문 방법', label: '주문 방법' },
    { value: '결제 오류', label: '결제 오류' },
    { value: '할부 문의', label: '할부 문의' },
    { value: '영수증 발급', label: '영수증 발급' }
  ],
  '이벤트/혜택/회원 문의': [
    { value: '', label: '유형을 선택해주세요' },
    { value: '이벤트 참여', label: '이벤트 참여' },
    { value: '쿠폰 사용', label: '쿠폰 사용' },
    { value: '포인트/적립금', label: '포인트/적립금' },
    { value: '회원 등급', label: '회원 등급' }
  ],
  '상품 문의': [
    { value: '', label: '유형을 선택해주세요' },
    { value: '상품 정보', label: '상품 정보' },
    { value: '재입고 문의', label: '재입고 문의' },
    { value: '사이즈 문의', label: '사이즈 문의' },
    { value: '품질 문의', label: '품질 문의' }
  ]
};

// Props 인터페이스
interface CustomerInquiryProps {
  onSubmit?: (data: InquiryData) => void;
  onCancel?: () => void;
  onProductSelect?: () => void;
}

interface InquiryData {
  mainType: string;
  subType: string;
  product: string;
  content: string;
  images: File[];
  smsNotification: boolean;
}

export default function CustomerInquiryStandalone({
  onSubmit,
  onCancel,
  onProductSelect
}: CustomerInquiryProps) {
  // Tailwind CDN 자동 로드
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
                  'muted-foreground': '#6b7280',
                  'border': '#e5e7eb',
                  'muted': '#f3f4f6'
                },
                spacing: {
                  '15': '3.75rem',
                  '30': '7.5rem'
                }
              }
            }
          };
        }
      };
    }
  }, []);

  // 상태 관리
  const [mainType, setMainType] = useState('');
  const [subType, setSubType] = useState('');
  const [product, setProduct] = useState('');
  const [content, setContent] = useState('');
  const [smsNotification, setSmsNotification] = useState(true);
  const [images, setImages] = useState<File[]>([]);

  // 메인 유형 변경시 서브 유형 초기화
  const handleMainTypeChange = (value: string) => {
    setMainType(value);
    setSubType('');
    setProduct('');
    setContent('');
  };

  // 폼이 유효한지 확인
  const isFormValid = mainType && subType && product && content;

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && onSubmit) {
      onSubmit({
        mainType,
        subType,
        product,
        content,
        images,
        smsNotification
      });
    }
  };

  // 취소
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // 상품 선택
  const handleProductSelect = () => {
    if (onProductSelect) {
      onProductSelect();
    }
  };

  // 커스텀 select 배경 스타일
  const selectBackgroundStyle = {
    backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center right 12px'
  };

  return (
    <div className="lg:pt-10 pb-15 lg:pb-30">
      {/* 헤더 */}
      <div className="max-lg:px-4 max-lg:pt-6">
        <h1 className="text-lg lg:text-xl font-bold leading-tight">안녕하세요.</h1>
        <p className="text-lg lg:text-xl font-bold">CJ온스타일 고객센터입니다.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          문제 해결을 위한 가장 빠른 방법을 안내해드릴게요.
        </p>
      </div>

      {/* 폼 */}
      <form className="mt-5 lg:mt-6 space-y-2 max-lg:px-4" onSubmit={handleSubmit}>
        {/* 메인 문의 유형 */}
        <div>
          <select 
            value={mainType}
            onChange={(e) => handleMainTypeChange(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-border rounded appearance-none focus:outline-none focus:border-accent transition-colors"
            style={selectBackgroundStyle}
          >
            {mainInquiryTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* 세부 문의 유형 */}
        <div>
          <select 
            value={subType}
            onChange={(e) => setSubType(e.target.value)}
            disabled={!mainType}
            className={`w-full px-4 py-3 text-sm border border-border rounded appearance-none focus:outline-none focus:border-accent transition-colors ${
              !mainType ? 'bg-muted text-muted-foreground' : ''
            }`}
            style={selectBackgroundStyle}
          >
            {mainType && subInquiryTypes[mainType] ? (
              subInquiryTypes[mainType].map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))
            ) : (
              <option value="">유형을 선택해주세요</option>
            )}
          </select>
        </div>

        {/* 상품 선택 */}
        <div className="flex gap-2">
          <input 
            type="text"
            value={product}
            readOnly
            placeholder="상품을 선택해주세요"
            disabled={!subType}
            className={`flex-1 py-3 px-4 text-sm border border-border rounded outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-muted-foreground ${
              !subType ? 'bg-muted text-muted-foreground' : ''
            }`}
          />
          <button 
            type="button"
            onClick={handleProductSelect}
            disabled={!subType}
            className="shrink-0 py-3 px-4 text-sm border border-border rounded hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            상품선택
          </button>
        </div>

        {/* 문의 내용 */}
        <div>
          <textarea 
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="문의내용을 입력해주세요."
            disabled={!product}
            className={`w-full py-3 px-4 text-sm border border-border rounded outline-none resize-y focus:ring-2 focus:ring-accent/40 placeholder:text-muted-foreground ${
              !product ? 'bg-muted text-muted-foreground' : ''
            }`}
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="border border-border rounded">
          <div 
            aria-disabled={!content}
            className={`h-12 w-full px-4 flex items-center justify-center gap-2 text-sm select-none ${
              !content ? 'text-muted-foreground cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
            }`}
          >
            <ImageIcon />
            <span>
              이미지 추가 <span className="text-muted-foreground">(최대3개)</span>
            </span>
          </div>
        </div>

        {/* SMS 알림 토글 */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm">휴대폰 답변 알림 SMS 받기</span>
          <ToggleSwitch 
            checked={smsNotification} 
            onChange={() => setSmsNotification(!smsNotification)} 
          />
        </div>

        {/* 버튼 */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            type="button"
            onClick={handleCancel}
            className="h-12 rounded border border-border hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={!isFormValid}
            className="h-12 rounded bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            문의하기
          </button>
        </div>
      </form>
    </div>
  );
}