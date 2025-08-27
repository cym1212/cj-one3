import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { ImageBox } from '@/components/ui/ImageBox';

import { chunkArray } from '@/utils/array';

import type { Product } from '@/components/ui/ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';

interface RelationProductCardProps {
    title: string;
    data: Product[];
}

export function RelationProductCard({ title, data }: RelationProductCardProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const categoryChunks = chunkArray(data, 3);

    return (
        <div className="poj2-relation-product-card w-full sm:border border-border">
            <div className="relative p-4">
                <h3 className="w-[calc(100%-100px)] truncate font-semibold text-sm sm:text-lg leading-[1]">{title}</h3>
            </div>
            <div className="poj2-relation-product-slider relative pb-4">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={0}
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
                            <div className="h-full grid grid-cols-3 gap-3 gap-y-4 sm:gap-x-4 px-4">
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
                    {data.length > 2 && (
                        <>
                            <button
                                ref={navigationPrevRef}
                                type="button"
                                className="hidden sm:flex z-1 absolute left-0 top-[40%] -translate-y-1/2 items-center justify-center w-9 h-9 bg-black/25 opacity-50 transition-opacity hover:opacity-100"
                                aria-label="이전 슬라이드"
                                onClick={() => swiperRef.current?.slidePrev()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    className="transition-colors fill-white"
                                >
                                    <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z" />
                                </svg>
                            </button>
                            <button
                                ref={navigationNextRef}
                                type="button"
                                className="hidden sm:flex z-1 absolute right-0 top-[40%] -translate-y-1/2 items-center justify-center w-9 h-9 bg-black/25 opacity-50 transition-opacity hover:opacity-100"
                                aria-label="다음 슬라이드"
                                onClick={() => swiperRef.current?.slideNext()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24px"
                                    viewBox="0 -960 960 960"
                                    width="24px"
                                    className="transition-colors fill-white"
                                >
                                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                </svg>
                            </button>
                        </>
                    )}
                </Swiper>
            </div>
        </div>
    );
}
