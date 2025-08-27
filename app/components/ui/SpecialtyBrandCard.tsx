import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { ImageBox } from '@/components/ui/ImageBox';

import { chunkArray } from '@/utils/array';

import 'swiper/css';
import 'swiper/css/navigation';

export interface SpecialtyBrandData {
    path: string;
    thumbnail: string;
    name: string;
    description?: string;
}

interface SpecialtyBrandCardProps {
    data: SpecialtyBrandData[];
}

export function SpecialtyBrandCard({ data }: SpecialtyBrandCardProps) {
    const swiperRef = useRef<SwiperType | null>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    // Tailwind sm 기준(>=640px)으로 동적 청크 크기 결정: sm 이상 4, 미만 3
    const [chunkSize, setChunkSize] = useState<number>(3);

    useEffect(() => {
        if (typeof window === 'undefined' || !('matchMedia' in window)) return;
        const mq = window.matchMedia('(min-width: 640px)');
        const update = () => setChunkSize(mq.matches ? 4 : 3);
        update();
        // Safari/구형 브라우저 호환: addEventListener 우선, 없으면 legacy addListener 사용
        if (typeof mq.addEventListener === 'function') {
            mq.addEventListener('change', update);
            return () => mq.removeEventListener('change', update);
        } else if ('addListener' in mq && typeof (mq as any).addListener === 'function') {
            // deprecated 시그니처에 직접 접근하면 경고가 떠서, 호환을 위해 안전한 캐스팅 사용
            const legacyMq = mq as unknown as {
                addListener: (cb: (ev: MediaQueryListEvent) => void) => void;
                removeListener: (cb: (ev: MediaQueryListEvent) => void) => void;
            };
            legacyMq.addListener(update);
            return () => legacyMq.removeListener(update);
        }
    }, []);

    const chunkData = useMemo(() => chunkArray(data, chunkSize), [data, chunkSize]);

    return (
        <div className="poj2-specialty-brand-card w-full sm:border border-border">
            <div className="">
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
                    className="!h-full"
                >
                    {chunkData.map((chunk, chunkIndex) => (
                        <SwiperSlide
                            key={chunkIndex}
                            className="!w-full"
                        >
                            <div className="h-full grid grid-cols-3 sm:grid-cols-4 gap-3 gap-y-4 sm:gap-x-4 px-7 lg:px-8 py-5 lg:py-6">
                                {chunk.map((category) => {
                                    const { path, thumbnail, name, description } = category;

                                    return (
                                        <Link
                                            key={path}
                                            to={`/product/${path}`}
                                            className="block"
                                        >
                                            <div className="w-full aspect-square">
                                                <ImageBox
                                                    src={thumbnail}
                                                    alt={name + description}
                                                />
                                            </div>
                                            <div className="mt-2 sm:mt-3">
                                                <p className="text-sm leading-sm truncate">{name}</p>
                                                {description && <p className="text-xs text-gray-500">{description}</p>}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </SwiperSlide>
                    ))}
                    <button
                        ref={navigationPrevRef}
                        type="button"
                        className={`absolute z-1 top-1/2 -translate-y-1/2 left-0 block rounded transition-colors ${isBeginning ? 'opacity-30 cursor-not-allowed' : 'hover:fill-accent'}`}
                        aria-label="이전 리스트"
                        disabled={isBeginning}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-8 h-8"
                        >
                            <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z" />
                        </svg>
                    </button>
                    <button
                        ref={navigationNextRef}
                        type="button"
                        className={`absolute z-1 top-1/2 -translate-y-1/2 right-0 block rounded transition-colors ${isEnd ? 'opacity-30 cursor-not-allowed' : 'hover:fill-accent'}`}
                        aria-label="다음 리스트"
                        disabled={isEnd}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-8 h-8"
                        >
                            <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                        </svg>
                    </button>
                </Swiper>
            </div>
        </div>
    );
}
