import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

interface MobileBrandBenefitBottomSectionProps {
    slideData: {
        image: string;
        title: string;
        subtitle: string;
        description: string;
    }[];
}

export function MobileBrandBenefitBottomSection({ slideData }: MobileBrandBenefitBottomSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <div className="relative w-full h-[250px] overflow-hidden">
            <div className="absolute inset-0">
                <div className="w-full h-[180px] bg-black" />
                <div className="w-full h-[70px] bg-white" />
            </div>

            {/* Swiper 슬라이더 */}
            <div className="relative h-full">
                <Swiper
                    modules={[Pagination]}
                    speed={500}
                    spaceBetween={10}
                    slidesPerView="auto"
                    centeredSlides={true}
                    centeredSlidesBounds={true}
                    loop={false}
                    watchSlidesProgress={true}
                    onSlideChange={(swiper) => {
                        setCurrentSlide(swiper.realIndex);
                    }}
                    className="h-full !px-4"
                >
                    {slideData.map((slide, index) => (
                        <SwiperSlide
                            key={index}
                            className="!w-[280px]"
                        >
                            <div className="relative w-[280px] h-[205px] mx-auto">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* 하단 게이지와 페이지네이션 */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                {/* 게이지 (진행률 바) */}
                <div className="flex-1 bg-border rounded-full h-0.5 mr-4">
                    <div
                        className="bg-black h-0.5 rounded-full transition-all duration-300"
                        style={{ width: `${((currentSlide + 1) / slideData.length) * 100}%` }}
                    />
                </div>

                {/* 페이지네이션 */}
                <div className="text-xs font-semibold">
                    <span>{currentSlide + 1}</span>
                    <span className="text-description"> | {slideData.length}</span>
                </div>
            </div>
        </div>
    );
}
