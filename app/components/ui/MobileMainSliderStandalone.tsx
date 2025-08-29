import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

interface Slider {
  content: string;
  path: string;
  image: string;
  badges: string[];
}

export interface MobileMainSliderProps {
  data?: Slider[];
  onSlideClick?: (slide: Slider) => void;
}

// 인라인 모달 컴포넌트
interface MobileMainSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Slider[];
  onItemClick?: (slide: Slider) => void;
}

function MobileMainSliderModal({ isOpen, onClose, data, onItemClick }: MobileMainSliderModalProps) {
  // 모달이 열려있는 동안 뒷 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 데이터 유효성 검증
  const validData = Array.isArray(data) ? data : [];

  const handleItemClick = (item: Slider, e: React.MouseEvent) => {
    e.preventDefault();
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
        <div className="flex-1"></div>
        <h2 className="text-lg font-semibold text-center flex-1">전체보기</h2>
        <button
          onClick={onClose}
          className="flex-1 flex justify-end"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="#111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>

      {/* 카드 그리드 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-4">
          {validData.map((item, idx) => (
            <a
              key={item.content + idx}
              href={item.path}
              className="block bg-white rounded overflow-hidden"
              onClick={(e) => handleItemClick(item, e)}
            >
              {/* 이미지 */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.content}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 텍스트 영역 */}
              <div className="mt-[8px]">
                {/* 제목 */}
                <h3 className="text-sm font-bold line-clamp-2 leading-tight">{item.content}</h3>

                {/* 배지들 */}
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {Array.isArray(item.badges) && item.badges.map((badge, index) => (
                    <span
                      className="inline-block font-medium text-xs"
                      key={index}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// 기본 데이터
const defaultData: Slider[] = [
  {
    content: '새로운 컬렉션 출시',
    path: '#',
    image: 'https://via.placeholder.com/400x400',
    badges: ['신상품', '특가']
  },
  {
    content: '봄 시즌 특별 할인',
    path: '#',
    image: 'https://via.placeholder.com/400x400',
    badges: ['50% 할인', '한정판매']
  },
  {
    content: '프리미엄 라인업',
    path: '#',
    image: 'https://via.placeholder.com/400x400',
    badges: ['프리미엄', '럭셔리']
  }
];

export default function MobileMainSliderStandalone({
  data = defaultData,
  onSlideClick
}: MobileMainSliderProps) {
  // 데이터 유효성 검증 및 정규화
  const normalizedData = React.useMemo(() => {
    if (!data) return defaultData;
    if (!Array.isArray(data)) return defaultData;
    if (data.length === 0) return defaultData;

    // 각 아이템의 구조 검증
    return data.map(item => ({
      content: item?.content || '',
      path: item?.path || '#',
      image: item?.image || 'https://via.placeholder.com/400x400',
      badges: Array.isArray(item?.badges) ? item.badges : []
    }));
  }, [data]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const titleTextRef = useRef<HTMLAnchorElement>(null);
  const ctaTextRef = useRef<HTMLSpanElement>(null);

  // currentSlide가 유효한 범위인지 확인
  useEffect(() => {
    if (currentSlide >= normalizedData.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, normalizedData.length]);

  // Tailwind CSS CDN 자동 로드
  useEffect(() => {
    // Tailwind CSS 로드
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
                  '1': '1',
                  '2': '2'
                }
              }
            }
          };
        }
      };
    }

    // Swiper CSS CDN 로드
    if (typeof window !== 'undefined' && !document.querySelector('link[href*="swiper-bundle.min.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
      document.head.appendChild(link);
    }
  }, []);

  const handleSlideClick = (slide: Slider, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSlideClick) {
      onSlideClick(slide);
    }
  };

  const handleCtaClick = (slide: Slider, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSlideClick) {
      onSlideClick(slide);
    }
  };

  const currentSlideData = normalizedData[currentSlide] || normalizedData[0];

  return (
    <div className="poj2-mobile-main-slider w-full">
      {/* Swiper - 이미지만 슬라이드 */}
      <Swiper
        modules={[Pagination, Autoplay]}
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        speed={500}
        spaceBetween={0}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.realIndex % normalizedData.length);
        }}
        className="w-full"
      >
        {normalizedData.map((slide, idx) => (
          <SwiperSlide
            key={slide.content + idx}
            className="!w-full"
          >
            <div className="w-full h-[390px] overflow-hidden">
              <a
                className="w-full h-full block"
                href={slide.path}
                onClick={(e) => handleSlideClick(slide, e)}
              >
                <img
                  src={slide.image}
                  alt={slide.content}
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="relative z-1">
        <div className="absolute bottom-[63%] left-0 right-0 h-[140px] bg-gradient-to-t from-white to-transparent"></div>
        {/* 제목 */}
        <div className="relative -mt-[50px] text-center mb-3">
          <a
            ref={titleTextRef}
            href={currentSlideData?.path || '#'}
            className="block px-15 text-2xl font-bold text-center leading-tight"
            onClick={(e) => handleSlideClick(currentSlideData, e)}
          >
            {currentSlideData?.content || ''}
          </a>
        </div>

        {/* CTA 버튼 */}
        <div className="text-center mb-3">
          <a
            href={currentSlideData?.path || '#'}
            className="inline-block bg-black text-white px-8 py-2 rounded-full font-bold text-sm"
            onClick={(e) => handleCtaClick(currentSlideData, e)}
          >
            <span ref={ctaTextRef}>
              {Array.isArray(currentSlideData?.badges) ? currentSlideData.badges.join(' ') : ''}
            </span>
          </a>
        </div>

        {/* 페이지네이션 및 전체보기 */}
        <div className="flex items-center justify-center gap-2 text-xs text-description">
          <span>
            <span className="text-[#111] font-bold">{currentSlide + 1}</span>
            <span className="text-[#666]"> | {normalizedData.length}</span>
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-description flex items-center gap-1 whitespace-nowrap"
          >
            <svg
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-description w-3 h-3 flex-shrink-0"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.75 7.75V2.5H8v5.25H2.75zM2 2a.25.25 0 0 1 .25-.25H8.5a.25.25 0 0 1 .25.25v6.25a.25.25 0 0 1-.25.25H2.25A.25.25 0 0 1 2 8.25V2zm8.25 1.75a.25.25 0 0 1 .25.25v6a.25.25 0 0 1-.25.25h-6A.25.25 0 0 1 4 10v-.25a.25.25 0 0 1 .25-.25H9.5a.25.25 0 0 0 .25-.25V4a.25.25 0 0 1 .25-.25h.25z"
              />
            </svg>
            <span>전체보기</span>
          </button>
        </div>
      </div>

      {/* 모달 */}
      <MobileMainSliderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={normalizedData}
        onItemClick={onSlideClick}
      />
    </div>
  );
}