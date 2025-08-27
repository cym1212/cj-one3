import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { ImageBox } from '@/components/ui/ImageBox';
import { ArrowLeftIcon, ArrowRightIcon, PlayIcon, PauseIcon } from '@/components/icons';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Slider {
    content: string;
    path: string;
    badges: string[];
    image: string;
    isAd: boolean;
}

export interface MainSliderProps {
    data: Slider[];
}

export function MainSlider({ data }: MainSliderProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);
    const userInteractionTimeout = useRef<NodeJS.Timeout | null>(null);

    const [currentSlide, setCurrentSlide] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    const totalSlides = data.length;

    // Swiper pagination 초기화
    useEffect(() => {
        if (swiperRef.current && progressRef.current) {
            if (swiperRef.current.params.pagination && typeof swiperRef.current.params.pagination === 'object') {
                swiperRef.current.params.pagination.el = progressRef.current;
                swiperRef.current.pagination.init();
                swiperRef.current.pagination.render();
                swiperRef.current.pagination.update();
            }
        }
    }, []);

    // IntersectionObserver 설정
    useEffect(() => {
        if (!window.IntersectionObserver) {
            console.warn('IntersectionObserver를 지원하지 않는 브라우저입니다.');
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry) {
                    const visible = entry.isIntersecting;
                    setIsVisible(visible);

                    if (swiperRef.current) {
                        if (!visible && isPlaying) {
                            swiperRef.current.autoplay?.stop();
                        } else if (visible && isPlaying) {
                            swiperRef.current.autoplay?.start();
                        }
                    }
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px',
            }
        );

        const currentSliderRef = sliderRef.current;
        if (currentSliderRef) {
            observer.observe(currentSliderRef);
        }

        return () => {
            if (currentSliderRef) {
                observer.unobserve(currentSliderRef);
            }
            if (userInteractionTimeout.current) {
                clearTimeout(userInteractionTimeout.current);
            }
        };
    }, [isPlaying]);

    // 자동 재생 여부 판단
    const shouldAutoplay = useCallback(() => {
        return isPlaying && isVisible;
    }, [isPlaying, isVisible]);

    // 사용자 상호작용 처리
    const handleUserInteraction = useCallback(() => {
        if (userInteractionTimeout.current) {
            clearTimeout(userInteractionTimeout.current);
        }

        if (swiperRef.current && swiperRef.current.autoplay && shouldAutoplay()) {
            swiperRef.current.autoplay.stop();
            userInteractionTimeout.current = setTimeout(() => {
                if (swiperRef.current && shouldAutoplay()) {
                    swiperRef.current.autoplay.start();
                }
            }, 1000);
        }
    }, [shouldAutoplay]);

    // 자동 재생 토글
    const toggleAutoplay = useCallback(() => {
        if (swiperRef.current) {
            if (isPlaying) {
                swiperRef.current.autoplay.stop();
            } else {
                if (shouldAutoplay()) {
                    swiperRef.current.autoplay.start();
                }
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying, shouldAutoplay]);

    return (
        <div
            ref={sliderRef}
            className="poj2-main-slider w-full"
        >
            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                loop
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                speed={900}
                spaceBetween={0}
                slidesPerView={1}
                breakpoints={{
                    640: {
                        slidesPerView: 'auto',
                        spaceBetween: 20,
                    },
                }}
                pagination={{
                    type: 'progressbar',
                    el: progressRef.current || undefined,
                }}
                navigation={{
                    prevEl: navigationPrevRef.current || undefined,
                    nextEl: navigationNextRef.current || undefined,
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
                    setCurrentSlide(swiper.realIndex + 1);
                    handleUserInteraction();
                }}
                onBeforeInit={(swiper) => {
                    if (swiper.params.pagination && typeof swiper.params.pagination === 'object' && progressRef.current) {
                        swiper.params.pagination.el = progressRef.current;
                    }
                    if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                        if (navigationPrevRef.current) {
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                        }
                        if (navigationNextRef.current) {
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                        }
                    }
                }}
                className="w-full sm:h-[480px]"
            >
                {data.map((slide, idx) => (
                    <SwiperSlide
                        key={slide.content + idx}
                        className="sm:!w-auto"
                    >
                        <Link
                            to={slide.path}
                            className="relative block overflow-hidden w-full h-full"
                        >
                            {/* 이미지 박스 */}
                            <ImageBox
                                src={slide.image}
                                alt={slide.content}
                            />

                            {/* 광고 뱃지 */}
                            {slide.isAd && <span className="absolute top-0 right-0 text-xs  text-white px-2 py-0.5 font-bold bg-black/20">광고</span>}

                            {/* 내용 및 배지 */}
                            <div className="absolute bottom-[45px] left-0 right-0 w-full px-[30px] text-white">
                                <p className="mb-2.5  text-2xl font-bold leading-sm whitespace-pre">{slide.content}</p>
                                {slide.badges && (
                                    <div className="flex gap-1.5">
                                        {slide.badges.map((badge, badgeIdx) => (
                                            <span
                                                key={badge + badgeIdx}
                                                className="text-xs  text-white px-2 py-0.5 font-bold bg-black/20 border border-border/25"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="poj2-main-slider-controller poj2-global-wrapper flex items-center justify-center gap-3 sm:gap-5 p-4 sm:p-5">
                <div
                    ref={progressRef}
                    className="swiper-pagination swiper-pagination-progressbar swiper-pagination-horizontal"
                >
                    <span className="swiper-pagination-progressbar-fill"></span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                    <span className="font-bold">{currentSlide}</span>
                    <span className="text-description">|</span>
                    <span>{totalSlides}</span>
                </div>
                <div className="hidden sm:flex items-center px-1 border border-black/25 rounded-full">
                    <button
                        ref={navigationPrevRef}
                        type="button"
                        className="flex items-center justify-center w-9 h-9 hover:fill-accent"
                        aria-label="이전 슬라이드"
                        onClick={handleUserInteraction}
                    >
                        <ArrowLeftIcon tailwind="transition-colors" />
                    </button>
                    <button
                        ref={navigationNextRef}
                        type="button"
                        className="flex items-center justify-center w-9 h-9 hover:fill-accent"
                        aria-label="다음 슬라이드"
                        onClick={handleUserInteraction}
                    >
                        <ArrowRightIcon tailwind="transition-colors" />
                    </button>
                </div>
                <div>
                    <button
                        onClick={toggleAutoplay}
                        type="button"
                        className="flex items-center justify-center w-6 sm:w-9 h-6 sm:h-9 border border-black/25 rounded-full transition-colors hover:fill-accent"
                        aria-label={isPlaying ? '자동재생 정지' : '자동재생 시작'}
                        aria-pressed={isPlaying}
                    >
                        {isPlaying ? <PauseIcon tailwind="w-[18px] sm:w-[24px]" /> : <PlayIcon tailwind="w-[18px] sm:w-[24px]" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
