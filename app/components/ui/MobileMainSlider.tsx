import { useState, useRef } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import { MobileMainSliderModal } from '@/components/ui/MobileMainSliderModal';

import 'swiper/css';
import 'swiper/css/pagination';

interface Slider {
    content: string;
    path: string;
    image: string;
    badges: string[];
}

export interface MobileMainSliderProps {
    data: Slider[];
}

export function MobileMainSlider({ data }: MobileMainSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const titleTextRef = useRef<HTMLAnchorElement>(null);
    const ctaTextRef = useRef<HTMLAnchorElement>(null);

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
                    setCurrentSlide(swiper.realIndex);
                }}
                className="w-full"
            >
                {data.map((slide, idx) => (
                    <SwiperSlide
                        key={slide.content + idx}
                        className="!w-full"
                    >
                        <div className="w-full h-[390px] overflow-hidden">
                            <Link
                                className="w-full h-full block"
                                to={slide.path}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.content}
                                    className="w-full h-full object-cover"
                                />
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="relative z-1">
                <div className="absolute bottom-[63%] left-0 right-0 h-[140px] bg-gradient-to-t from-white to-transparent"></div>
                {/* 제목 */}
                <div className="relative -mt-[50px] text-center mb-3">
                    <Link
                        ref={titleTextRef}
                        to={data[currentSlide].path || '/'}
                        className="block px-15 text-2xl font-bold text-center leading-tight"
                    >
                        {data[currentSlide].content || ''}
                    </Link>
                </div>

                {/* CTA 버튼 */}
                <div className="text-center mb-3">
                    <Link
                        to={data[currentSlide].path || '#'}
                        className="inline-block bg-black text-white px-8 py-2 rounded-full font-bold text-sm"
                    >
                        <span ref={ctaTextRef}>{data[currentSlide].badges.join(' ') || ''}</span>
                    </Link>
                </div>

                {/* 페이지네이션 및 전체보기 */}
                <div className="flex items-center justify-center gap-2 text-xs text-description">
                    <span>
                        <span className="text-[#111] font-bold">{currentSlide + 1}</span>
                        <span className="text-[#666]"> | {data.length}</span>
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
                data={data}
            />
        </div>
    );
}
