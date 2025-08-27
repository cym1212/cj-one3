import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { LocalStorageUtil } from '@/utils/localStorage';

import 'swiper/css';
import 'swiper/css/pagination';

interface MarketingSlide {
    id: number;
    image: string;
    alt: string;
    path: string;
}

const marketingData: MarketingSlide[] = [
    {
        id: 1,
        image: '/images/brand/specialty-brand-1.jpg',
        alt: 'specialty-brand-1',
        path: '/',
    },
    {
        id: 2,
        image: '/images/brand/specialty-brand-2.jpg',
        alt: 'specialty-brand-1',
        path: '/',
    },
    {
        id: 3,
        image: '/images/brand/specialty-brand-3.jpg',
        alt: 'specialty-brand-1',
        path: '/',
    },
];

export function MobileMarketingSlideModal() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const storage = new LocalStorageUtil('poj2');
    const HIDE_KEY = 'hide_marketing_modal';

    const backgroundRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // 컴포넌트 마운트 시 모달 표시 여부 확인
    useEffect(() => {
        const today = new Date().toDateString();
        const hideUntilDate = storage.get<string>(HIDE_KEY);

        // 오늘 하루 보지 않기가 설정되어 있지 않거나, 날짜가 바뀌었으면 모달 표시
        if (!hideUntilDate || hideUntilDate !== today) {
            setIsVisible(true);
            // 이전 날짜 데이터가 있다면 삭제
            if (hideUntilDate && hideUntilDate !== today) {
                storage.delete(HIDE_KEY);
            }
        }
    }, []);

    // 모달이 열렸을 때 뒷 배경 스크롤 방지 (모바일에서만)
    useEffect(() => {
        if (!isVisible) return;

        let scrollY = window.scrollY;

        const applyScrollPrevention = () => {
            const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
            
            if (isDesktop) {
                // 데스크톱에서는 스크롤 방지 해제
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
            } else {
                // 모바일에서는 스크롤 방지 적용
                scrollY = window.scrollY;
                document.body.style.position = 'fixed';
                document.body.style.top = `-${scrollY}px`;
                document.body.style.width = '100%';
                document.body.style.overflow = 'hidden';
            }
        };

        // 초기 적용
        applyScrollPrevention();

        // 리사이즈 이벤트 리스너
        const handleResize = () => {
            applyScrollPrevention();
        };

        window.addEventListener('resize', handleResize);

        // cleanup 함수
        return () => {
            window.removeEventListener('resize', handleResize);
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            // 스크롤 위치 복원
            window.scrollTo(0, scrollY);
        };
    }, [isVisible]);

    const handleCloseAnimation = () => {
        gsap.to(backgroundRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
        });
        gsap.to(contentRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
                setIsVisible(false);
                setIsAnimating(false);
            },
        });
    };

    const handleClose = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        handleCloseAnimation();
    };

    const handleHideToday = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        const today = new Date().toDateString();
        storage.set(HIDE_KEY, today);
        handleCloseAnimation();
    };

    useGSAP(() => {
        if (isVisible && backgroundRef.current && contentRef.current) {
            gsap.fromTo(backgroundRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut' });
            gsap.fromTo(
                contentRef.current,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.inOut',
                }
            );
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div
            ref={backgroundRef}
            className="fixed inset-0 z-50 bg-black/50 flex items-end"
            onClick={handleClose}
        >
            <div
                ref={contentRef}
                className="w-full bg-white rounded-t-[10px] max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 슬라이더 영역 */}
                <div className="relative">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        loop
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        speed={500}
                        spaceBetween={0}
                        pagination={{
                            type: 'fraction',
                            el: '.swiper-pagination',
                        }}
                        onSlideChange={(swiper) => {
                            setCurrentSlide(swiper.realIndex);
                        }}
                        className="w-full"
                    >
                        {marketingData.map((slide) => (
                            <SwiperSlide
                                key={slide.id}
                                className="!w-full"
                            >
                                <Link
                                    to={slide.path}
                                    className="block w-full h-[260px] overflow-hidden"
                                >
                                    <img
                                        src={slide.image}
                                        alt={slide.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* 커스텀 페이지네이션 - 고정 위치 */}
                    <div className="absolute bottom-3 right-3 bg-black/25 rounded-[20px] px-2 h-5 flex items-center z-10">
                        <span className="text-white text-xs">
                            {currentSlide + 1} | {marketingData.length}
                        </span>
                    </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="h-12 py-4 bg-white border-t border-gray-200 flex items-center">
                    <div className="flex justify-between items-center w-full">
                        <button
                            onClick={handleHideToday}
                            className="text-description text-sm py-2 px-4 hover:text-gray-800 transition-colors"
                        >
                            오늘 하루 보지 않기
                        </button>
                        <button
                            onClick={handleClose}
                            className="text-sm py-2 px-4 hover:text-black"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
