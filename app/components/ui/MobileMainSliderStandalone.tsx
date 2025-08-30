import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

interface Banner {
  text: string;
  description?: string;
  url: string;
  icon: string;
  mediaType?: string;
  videoUrl?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  position?: string;
  hasBackground?: boolean;
  textColor?: string;
  textShadow?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonHoverColor?: string;
  buttonText?: string;
  transparentButton?: boolean;
  buttonWidth?: string;
  buttonHeight?: string;
  showTitle?: boolean;
  showButton?: boolean;
  showAd?: boolean;
  adImageUrl?: string;
  adText?: string;
  adLink?: string;
  adPosition?: string;
  adPositionPc?: string;
  adPositionMobile?: string;
  adTextColor?: string;
  adBackgroundColor?: string;
  adBorderColor?: string;
  adOpacity?: number;
  showCategory?: boolean;
  categories?: string[];
  categoryPosition?: string;
  categoryPositionPc?: string;
  categoryPositionMobile?: string;
  categoryTextColor?: string;
  categoryBackgroundColor?: string;
  categoryBorderColor?: string;
  categoryFontSize?: string;
  categoryBorderRadius?: string;
}

interface WithCookieProps {
  deviceProperty?: {
    pc?: {
      banners?: Banner[];
      skin?: string;
    };
    mobile?: {
      banners?: Banner[];
      skin?: string;
    };
  };
  banners?: Banner[];
  skin?: string;
}

export interface MobileMainSliderProps extends WithCookieProps {
  onSlideClick?: (slide: Banner) => void;
}

// 인라인 모달 컴포넌트
interface MobileMainSliderModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Banner[];
  onItemClick?: (slide: Banner) => void;
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

  const handleItemClick = (item: Banner, e: React.MouseEvent) => {
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
              key={item.text + idx}
              href={item.url}
              className="block bg-white rounded overflow-hidden"
              onClick={(e) => handleItemClick(item, e)}
            >
              {/* 이미지 */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.icon}
                  alt={item.text}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 텍스트 영역 */}
              <div className="mt-[8px]">
                {/* 제목 */}
                <h3 className="text-sm font-bold line-clamp-2 leading-tight">
                  {item.text.replace(/\\n/g, ' ')}
                </h3>

                {/* 카테고리 배지들 */}
                {item.showCategory && item.categories && (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {item.categories.map((category, index) => (
                      <span
                        className="inline-block font-medium text-xs px-2 py-0.5 rounded"
                        key={index}
                        style={{
                          color: item.categoryTextColor || '#000',
                          backgroundColor: item.categoryBackgroundColor || '#f0f0f0',
                          borderRadius: item.categoryBorderRadius || '4px',
                          fontSize: item.categoryFontSize || '12px'
                        }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// 기본 데이터
const defaultData: Banner[] = [
  {
    text: '새로운 컬렉션 출시',
    url: '#',
    icon: 'https://via.placeholder.com/400x400',
    showCategory: true,
    categories: ['신상품', '특가'],
    categoryTextColor: '#ffffff',
    categoryBackgroundColor: '#000000',
    showButton: true,
    buttonText: '자세히 보기',
    buttonBgColor: '#000000',
    buttonTextColor: '#ffffff',
    showTitle: true
  },
  {
    text: '봄 시즌 특별 할인',
    url: '#',
    icon: 'https://via.placeholder.com/400x400',
    showCategory: true,
    categories: ['50% 할인', '한정판매'],
    categoryTextColor: '#ffffff',
    categoryBackgroundColor: '#ff0000',
    showButton: true,
    buttonText: '자세히 보기',
    buttonBgColor: '#000000',
    buttonTextColor: '#ffffff',
    showTitle: true
  },
  {
    text: '프리미엄 라인업',
    url: '#',
    icon: 'https://via.placeholder.com/400x400',
    showCategory: true,
    categories: ['프리미엄', '럭셔리'],
    categoryTextColor: '#ffffff',
    categoryBackgroundColor: '#800080',
    showButton: true,
    buttonText: '자세히 보기',
    buttonBgColor: '#000000',
    buttonTextColor: '#ffffff',
    showTitle: true
  }
];

// 웹빌더 초기화 지원 (필요한 경우만 사용)
if (typeof window !== 'undefined') {
  // 수동 초기화가 필요한 경우를 위한 함수
  (window as any).initMobileMainSlider = function(containerId: string, customProps?: any) {
    const container = document.getElementById(containerId);
    if (container && typeof (window as any).React !== 'undefined' && typeof (window as any).ReactDOM !== 'undefined') {
      const React = (window as any).React;
      const ReactDOM = (window as any).ReactDOM;
      
      console.log('[WithCookie] Manual initialization with props:', customProps);
      
      const element = React.createElement(MobileMainSliderStandalone, customProps || {});
      ReactDOM.render(element, container);
      return true;
    }
    console.error('[WithCookie] Failed to initialize - React or container not found');
    return false;
  };
}

function MobileMainSlider(props: MobileMainSliderProps) {
  const { onSlideClick } = props;
  
  // props 구조 디버깅
  console.log('[MobileMainSlider] Raw props:', props);
  console.log('[MobileMainSlider] Props structure:', {
    hasData: !!(props as any)?.data,
    hasDeviceProperty: !!props.deviceProperty,
    hasBanners: !!props.banners,
    dataContent: (props as any)?.data?.content,
    dataComponentProps: (props as any)?.data?.componentProps
  });

  // 웹빌더에서 오는 중첩된 구조 처리
  const mergedProps = React.useMemo(() => {
    // 1. 직접 전달된 props 확인 (정상적인 구조)
    if (props && (props.banners || props.deviceProperty)) {
      console.log('[MobileMainSlider] Using direct props');
      return props;
    }

    // 2. 웹빌더의 중첩된 구조 처리 (data.content 또는 data.componentProps에서 찾기)
    const dataWrapper = (props as any)?.data;
    if (dataWrapper) {
      // content에서 먼저 확인
      if (dataWrapper.content) {
        const content = dataWrapper.content;
        if (content.deviceProperty || content.banners) {
          console.log('[MobileMainSlider] Using data.content:', content);
          return {
            deviceProperty: content.deviceProperty,
            banners: content.banners,
            skin: dataWrapper.componentProps?.skin || content.skin
          };
        }
      }

      // componentProps에서 확인
      if (dataWrapper.componentProps) {
        const componentProps = dataWrapper.componentProps;
        if (componentProps.deviceProperty || componentProps.banners) {
          console.log('[MobileMainSlider] Using data.componentProps:', componentProps);
          return {
            deviceProperty: componentProps.deviceProperty,
            banners: componentProps.banners,
            skin: componentProps.skin
          };
        }
      }

      // data 자체에 직접 있는지 확인
      if (dataWrapper.deviceProperty || dataWrapper.banners) {
        console.log('[MobileMainSlider] Using data directly:', dataWrapper);
        return {
          deviceProperty: dataWrapper.deviceProperty,
          banners: dataWrapper.banners,
          skin: dataWrapper.skin
        };
      }
    }

    // 3. window.editorProps 폴백
    if (typeof window !== 'undefined') {
      const windowProps = (window as any).editorProps ||
                         (window as any).__withCookieProps;
      if (windowProps) {
        console.log('[MobileMainSlider] Using window props as fallback');
        return windowProps;
      }
    }

    console.log('[MobileMainSlider] No valid props found, using empty object');
    return {};
  }, [props]);

  // 배너 데이터 추출
  const bannersData = React.useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    
    // deviceProperty 체크
    if (mergedProps.deviceProperty) {
      if (isMobile && mergedProps.deviceProperty.mobile?.banners) {
        return mergedProps.deviceProperty.mobile.banners;
      }
      if (mergedProps.deviceProperty.pc?.banners) {
        return mergedProps.deviceProperty.pc.banners;
      }
    }
    
    // 직접 banners 체크
    if (mergedProps.banners && Array.isArray(mergedProps.banners)) {
      return mergedProps.banners;
    }
    
    return defaultData;
  }, [mergedProps]);

  // 데이터 유효성 검증 및 정규화
  const normalizedData = React.useMemo(() => {
    if (!bannersData || !Array.isArray(bannersData) || bannersData.length === 0) {
      return defaultData;
    }

    // 각 아이템의 구조 검증 및 변환
    return bannersData.filter(item => item && item.icon).map(item => ({
      ...item,
      text: item.text || '',
      url: item.url || '#',
      icon: item.icon || 'https://via.placeholder.com/400x400'
    }));
  }, [bannersData]);

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

  const handleSlideClick = (slide: Banner, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSlideClick) {
      onSlideClick(slide);
    }
  };

  const handleCtaClick = (slide: Banner, e: React.MouseEvent) => {
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
            key={slide.text + idx}
            className="!w-full"
          >
            <div className="w-full h-[390px] overflow-hidden relative">
              <a
                className="w-full h-full block"
                href={slide.url}
                onClick={(e) => handleSlideClick(slide, e)}
              >
                <img
                  src={slide.icon}
                  alt={slide.text}
                  className="w-full h-full object-cover"
                />
                {/* 광고 표시 */}
                {slide.showAd && slide.adText && (
                  <div 
                    className="absolute top-4 right-4 px-2 py-1 text-xs rounded"
                    style={{
                      color: slide.adTextColor || '#ffffff',
                      backgroundColor: slide.adBackgroundColor || 'rgba(0,0,0,0.5)'
                    }}
                  >
                    {slide.adText}
                  </div>
                )}
              </a>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="relative z-1">
        <div className="absolute bottom-[63%] left-0 right-0 h-[140px] bg-gradient-to-t from-white to-transparent"></div>
        {/* 제목 */}
        <div className="relative -mt-[50px] text-center mb-3">
          {currentSlideData?.showTitle !== false && (
            <a
              ref={titleTextRef}
              href={currentSlideData?.url || '#'}
              className="block px-15 text-2xl font-bold text-center leading-tight"
              style={{
                color: currentSlideData?.textColor || '#000000',
                textShadow: currentSlideData?.textShadow || 'none'
              }}
              onClick={(e) => handleSlideClick(currentSlideData, e)}
            >
              {currentSlideData?.text?.replace(/\\n/g, ' ') || ''}
            </a>
          )}
        </div>

        {/* CTA 버튼 */}
        {currentSlideData?.showButton !== false && (
          <div className="text-center mb-3">
            <a
              href={currentSlideData?.url || '#'}
              className="inline-block px-8 py-2 rounded-full font-bold text-sm transition-colors"
              style={{
                backgroundColor: currentSlideData?.transparentButton ? 'transparent' : (currentSlideData?.buttonBgColor || '#000000'),
                color: currentSlideData?.buttonTextColor || '#ffffff',
                border: currentSlideData?.transparentButton ? `2px solid ${currentSlideData?.buttonBgColor || '#000000'}` : 'none',
                width: currentSlideData?.buttonWidth || 'auto',
                height: currentSlideData?.buttonHeight || 'auto'
              }}
              onMouseEnter={(e) => {
                if (currentSlideData?.buttonHoverColor) {
                  e.currentTarget.style.backgroundColor = currentSlideData.buttonHoverColor;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = currentSlideData?.transparentButton ? 'transparent' : (currentSlideData?.buttonBgColor || '#000000');
              }}
              onClick={(e) => handleCtaClick(currentSlideData, e)}
            >
              <span ref={ctaTextRef}>
                {currentSlideData?.buttonText || 
                 (currentSlideData?.showCategory && currentSlideData?.categories ? 
                  currentSlideData.categories.join(' ') : 
                  '자세히 보기')}
              </span>
            </a>
          </div>
        )}

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

// 웹빌더 호환성을 위한 래퍼 컴포넌트
export default function MobileMainSliderStandalone(props?: MobileMainSliderProps) {
  // props가 전달되면 사용, 없으면 빈 객체
  const finalProps = props || {};
  
  console.log('[MobileMainSliderStandalone] Received props:', finalProps);
  
  return <MobileMainSlider {...finalProps} />;
}

// 컴포넌트를 글로벌로도 노출 (웹빌더가 직접 접근 가능)
if (typeof window !== 'undefined') {
  (window as any).MobileMainSliderComponent = MobileMainSlider;
}