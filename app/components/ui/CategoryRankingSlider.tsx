import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';

import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons';

import { chunkArray } from '@/utils/array';

import type { Swiper as SwiperType } from 'swiper';
import type { Category } from '@/constants/category';

import 'swiper/css';
import 'swiper/css/navigation';

export interface CategoryRankingSliderProps {
    data: Category[];
}

export function CategoryRankingSlider({ data }: CategoryRankingSliderProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState(data[0]?.id || '');
    const categoryChunks = chunkArray(data, 5);

    const handleCategoryClick = (categoryId: string) => {
        setActiveCategoryId(categoryId);
    };
    return (
        <div className="poj2-category-slider relative">
            <Swiper
                modules={[Navigation, FreeMode]}
                freeMode={{
                    enabled: true,
                    momentum: true,
                    sticky: false,
                }}
                spaceBetween={16}
                breakpoints={{
                    640: {
                        spaceBetween: 0,
                        freeMode: {
                            enabled: false,
                        },
                    },
                }}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onBeforeInit={(swiper) => {
                    if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                        if (navigationPrevRef.current) {
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                        }
                        if (navigationNextRef.current) {
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                        }
                    }
                }}
            >
                {categoryChunks.map((chunk, chunkIndex) => (
                    <SwiperSlide
                        key={chunkIndex}
                        className="!w-full"
                    >
                        <div className="flex sm:justify-center gap-4 lg:gap-6">
                            {chunk.map((category) => (
                                <button
                                    key={category.id}
                                    className="flex flex-col items-center space-y-2 max-lg:w-[20%] w-[75px]"
                                    onClick={() => handleCategoryClick(category.id)}
                                >
                                    <div className={`flex items-center justify-center aspect-square w-full rounded-full overflow-hidden border transition-colors ${category.id === activeCategoryId ? 'border-2 border-black bg-white' : 'border-border bg-border/10'}`}>
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="h-[60%] object-cover"
                                        />
                                    </div>
                                    <p className="text-xs lg:text-sm">{category.name}</p>
                                </button>
                            ))}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* PC 네비게이션 버튼 */}
            <button
                ref={navigationPrevRef}
                type="button"
                className={`z-1 hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 bg-white border border-border rounded-full transition-colors ${isBeginning ? 'opacity-30 cursor-not-allowed' : 'hover:border-black'}`}
                aria-label="이전 카테고리"
                disabled={isBeginning}
            >
                <ArrowLeftIcon tailwind="w-6 h-6 text-black" />
            </button>
            <button
                ref={navigationNextRef}
                type="button"
                className={`z-1 hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 items-center justify-center w-10 h-10 bg-white border border-border rounded-full transition-colors ${isEnd ? 'opacity-30 cursor-not-allowed' : 'hover:border-black'}`}
                aria-label="다음 카테고리"
                disabled={isEnd}
            >
                <ArrowRightIcon tailwind="w-6 h-6 text-gray-600" />
            </button>
        </div>
    );
}
