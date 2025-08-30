import * as React from 'react';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// 아이콘 컴포넌트 인라인화
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className="w-4 h-4 fill-current">
    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z"/>
  </svg>
);

interface MarketingSlide {
  id: number;
  title: string;
  image: string;
  link?: string;
}

interface BrandBanner {
  id: number;
  title: string;
  brandLogo: string;
  eventImage: string;
  link: string;
}

export interface MobileBannerSectionProps {
  topBannerImage?: string;
  topBannerAlt?: string;
  brandBanner?: BrandBanner;
  marketingSlides?: MarketingSlide[];
}

// 기본 데이터
const defaultData: MobileBannerSectionProps = {
  topBannerImage: "/images/banner/benefit-m.png",
  topBannerAlt: "오늘 혜택이 가장 좋아요",
  brandBanner: {
    id: 1,
    title: "이벤트",
    brandLogo: "/images/brand/new-balance.png",
    eventImage: "/images/banner/event.jpg",
    link: "/brand/1"
  },
  marketingSlides: [
    {
      id: 1,
      title: "실시간 판매 1등",
      image: "/images/banner/marketing-slide-1.jpg"
    },
    {
      id: 2,
      title: "오프라인",
      image: "/images/banner/marketing-slide-2.jpg"
    },
    {
      id: 3,
      title: "특별한 혜택",
      image: "/images/banner/marketing-slide-3.jpg"
    },
    {
      id: 4,
      title: "실시간 판매 1등",
      image: "/images/banner/marketing-slide-1.jpg"
    },
    {
      id: 5,
      title: "오프라인",
      image: "/images/banner/marketing-slide-2.jpg"
    }
  ]
};

function MobileBannerSection(props: MobileBannerSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  // props와 기본값 병합
  const data = {
    topBannerImage: props.topBannerImage || defaultData.topBannerImage,
    topBannerAlt: props.topBannerAlt || defaultData.topBannerAlt,
    brandBanner: props.brandBanner || defaultData.brandBanner,
    marketingSlides: props.marketingSlides && props.marketingSlides.length > 0 
      ? props.marketingSlides 
      : defaultData.marketingSlides
  };

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
                  'description': '#9ca3af',
                  'border': '#e5e7eb'
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

  const totalSlides = data.marketingSlides?.length || 0;
  const progressPercentage = totalSlides > 0 ? (currentSlide / totalSlides) * 100 : 0;

  return (
    <div className="">
      <div>
        {/* 상단 배너 섹션 */}
        <div className="poj2-img-title-banner relative">
          {/* 상단 이미지 배너 */}
          <div className="mb-4">
            <img 
              alt={data.topBannerAlt}
              className="w-full h-auto" 
              src={data.topBannerImage}
            />
          </div>

          {/* 브랜드 이벤트 배너 */}
          {data.brandBanner && (
            <a 
              className="relative block" 
              href={data.brandBanner.link}
              data-discover="true"
            >
              <img 
                alt="이벤트 이미지" 
                className="w-full h-[195px] object-cover" 
                src={data.brandBanner.eventImage}
              />
              <div className="absolute bottom-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_,rgba(0,0,0,1)_100%)]"></div>
              <div className="absolute bottom-0 left-0 right-0 px-4 py-6 space-y-3">
                <img 
                  alt="이벤트 이미지" 
                  className="h-10" 
                  src={data.brandBanner.brandLogo}
                />
                <div>
                  <button className="flex items-center bg-transparent border border-white text-white pl-3 pr-1.5 py-0.5 rounded-full text-xs">
                    <span>더 보러가기</span>
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
            </a>
          )}
        </div>

        {/* 마케팅 슬라이더 섹션 */}
        <div className="relative w-full h-[250px] overflow-hidden">
          {/* 배경 레이어 */}
          <div className="absolute inset-0">
            <div className="w-full h-[180px] bg-black"></div>
            <div className="w-full h-[70px] bg-white"></div>
          </div>

          {/* 슬라이더 컨테이너 */}
          <div className="relative h-full">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={10}
              slidesPerView="auto"
              onSwiper={setSwiper}
              onSlideChange={(swiper) => {
                setCurrentSlide(swiper.activeIndex + 1);
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              className="h-full !px-4"
            >
              {data.marketingSlides?.map((slide) => (
                <SwiperSlide key={slide.id} className="!w-[280px]">
                  <div className="relative w-[280px] h-[205px] mx-auto">
                    <img 
                      alt={slide.title}
                      className="w-full h-full object-cover rounded" 
                      src={slide.image}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* 진행 상태 표시 */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex-1 bg-border rounded-full h-0.5 mr-4">
              <div 
                className="bg-black h-0.5 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs font-semibold">
              <span>{currentSlide}</span>
              <span className="text-description"> | {totalSlides}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 웹빌더 호환성을 위한 래퍼 컴포넌트
export default function MobileBannerSectionStandalone(props?: MobileBannerSectionProps) {
  const finalProps = props || {};
  return <MobileBannerSection {...finalProps} />;
}

// 컴포넌트를 글로벌로도 노출 (웹빌더가 직접 접근 가능)
if (typeof window !== 'undefined') {
  (window as any).MobileBannerSectionComponent = MobileBannerSection;
  (window as any).Poj2MobileBannerSection = MobileBannerSectionStandalone;
}