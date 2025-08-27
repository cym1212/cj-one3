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
    image: string;
}

export interface MarketingSliderProps {
    data: Slider[];
}

export function MarketingSlider({ data }: MarketingSliderProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);
    const userInteractionTimeout = useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(true);

    // Swiper pagination 초기화
    // pagination.el에 설정하는데, 컴포넌트 첫 렌더링 시 DOM 요소가 아직 생성되지 않아 null일 수 있음
    // Swiper 초기화가 DOM 렌더링보다 먼저 실행될 경우 발생
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
            className="poj2-marketing-slider w-full"
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
                breakpoints={{
                    640: {
                        spaceBetween: 20,
                    },
                }}
                pagination={{
                    type: 'fraction',
                    el: progressRef.current,
                }}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) => {
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
                className="w-full"
            >
                {data.map((slide, idx) => (
                    <SwiperSlide
                        key={slide.content + idx}
                        className="!w-full"
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
                        </Link>
                    </SwiperSlide>
                ))}
                {data.length > 1 && (
                    <>
                        <button
                            ref={navigationPrevRef}
                            type="button"
                            className="hidden sm:flex z-1 absolute left-0 top-1/2 -translate-y-1/2 items-center justify-center w-9 h-9 bg-black/25 opacity-50 transition-opacity hover:opacity-100"
                            aria-label="이전 슬라이드"
                            onClick={handleUserInteraction}
                        >
                            <ArrowLeftIcon tailwind="fill-white -ml-1" />
                        </button>
                        <button
                            ref={navigationNextRef}
                            type="button"
                            className="hidden sm:flex z-1 absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center w-9 h-9 bg-black/25 opacity-50 transition-opacity hover:opacity-100"
                            aria-label="다음 슬라이드"
                            onClick={handleUserInteraction}
                        >
                            <ArrowRightIcon tailwind="fill-white -mr-1" />
                        </button>
                        <div className="z-1 absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center sm:gap-1 pl-3 sm:pl-4 pr-1 sm:pr-2.5 bg-black/25 rounded-full">
                            <div
                                ref={progressRef}
                                className="flex items-center gap-1 !text-white text-xs sm:text-sm"
                            ></div>
                            <div>
                                <button
                                    onClick={toggleAutoplay}
                                    type="button"
                                    className="flex items-center justify-center w-6 h-6"
                                    aria-label={isPlaying ? '자동재생 정지' : '자동재생 시작'}
                                    aria-pressed={isPlaying}
                                >
                                    {isPlaying ? <PauseIcon tailwind="w-[18px] sm:w-[21px] fill-white" /> : <PlayIcon tailwind="w-[18px] sm:w-[21px] fill-white" />}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </Swiper>
        </div>
    );
}
