import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons';
import { ImageBox } from '@/components/ui/ImageBox';

import { chunkArray } from '@/utils/array';

import type { Product } from '@/components/ui/ProductCard';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface RecommendProductCardProps {
    title: string;
    data: Product[];
}

export function RecommendProductCard({ title, data }: RecommendProductCardProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const categoryChunks = chunkArray(data, 6);

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

    return (
        <div className="poj2-recommend-product-card w-full sm:h-[380px] md:h-[420px] lg:h-[480px] sm:border border-border">
            <div className="relative p-4">
                <h3 className="w-[calc(100%-100px)] truncate font-semibold text-sm sm:text-lg leading-[1]">{title}</h3>
                {data.length > 6 && (
                    <div className="poj2-recommend-product-slider-controller absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <button
                            ref={navigationPrevRef}
                            type="button"
                            className={`block transition-colors ${isBeginning ? 'opacity-30 cursor-not-allowed' : 'hover:border-black'}`}
                            aria-label="이전 카테고리"
                            disabled={isBeginning}
                        >
                            <ArrowLeftIcon tailwind="w-6 h-6 text-black" />
                        </button>
                        <div
                            ref={progressRef}
                            className="flex items-center justify-center gap-1 text-xs sm:text-sm"
                        ></div>
                        <button
                            ref={navigationNextRef}
                            type="button"
                            className={`block transition-colors ${isEnd ? 'opacity-30 cursor-not-allowed' : 'hover:border-black'}`}
                            aria-label="다음 카테고리"
                            disabled={isEnd}
                        >
                            <ArrowRightIcon tailwind="w-6 h-6 text-black" />
                        </button>
                    </div>
                )}
            </div>
            <div className="poj2-recommend-product-slider relative sm:h-[calc(100%-61px)]">
                <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={0}
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
                    className="!h-full"
                >
                    {categoryChunks.map((chunk, chunkIndex) => (
                        <SwiperSlide
                            key={chunkIndex}
                            className="!w-full"
                        >
                            <div className={`h-full grid grid-cols-3 ${categoryChunks.length > 3 ? 'grid-rows-2' : 'grid-rows-1'} gap-3 gap-y-4 sm:gap-x-4 px-4`}>
                                {chunk.map((category) => {
                                    const { id, type, brand, title, thumbnails, price, discount } = category;

                                    const isSpecial = type === 'special';
                                    const discountPrice = price && discount && price * (1 - discount / 100);

                                    return (
                                        <Link
                                            key={id}
                                            to={`/product/${id}`}
                                            className="block"
                                        >
                                            <div className="w-full aspect-square overflow-hidden rounded">
                                                <ImageBox
                                                    src={thumbnails[0]}
                                                    alt={`${brand || ''} ${title}`}
                                                />
                                            </div>
                                            <div className="mt-2 sm:mt-3">
                                                <p className="text-sm leading-sm truncate">
                                                    {brand && <span className="pr-1 font-bold">{brand}</span>}
                                                    {title}
                                                </p>
                                                <p>
                                                    <span className="font-bold">{discountPrice?.toLocaleString() || price?.toLocaleString()}</span>
                                                    <span>원</span>
                                                    {isSpecial && '~'}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
