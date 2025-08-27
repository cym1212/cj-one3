import { Link } from 'react-router';

import { ImageBox } from '@/components/ui/ImageBox';

import type { Product } from '@/components/ui/ProductCard';

export interface RecommendBannerData {
    thumbnail: string;
    thumbnailLink: string;
    thumbnailAlt?: string;
    isAd: boolean;
    products: Product[];
}

interface RecommendBannerCardProps {
    data: RecommendBannerData;
}

export function RecommendBannerCard({ data }: RecommendBannerCardProps) {
    const { thumbnail, thumbnailLink, thumbnailAlt, isAd, products } = data;

    return (
        <div className="poj2-recommend-banner-card flex flex-col w-full sm:h-[380px] md:h-[420px] lg:h-[480px] sm:border border-border">
            <div className="shrink-0">
                <Link
                    to={thumbnailLink}
                    className="relative block"
                >
                    <ImageBox
                        src={thumbnail}
                        alt={`${thumbnailAlt || ''}`}
                    />
                    {isAd && <span className="absolute top-0 right-0 text-xs  text-white px-2 py-0.5 font-bold bg-black/20">광고</span>}
                </Link>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-3 sm:gap-4 px-4 max-lg:mt-6">
                {products.map((category) => {
                    const { id, type, brand, title, thumbnails, price, discount } = category;

                    const isSpecial = type === 'special';
                    const discountPrice = price && discount && price * (1 - discount / 100);

                    return (
                        <Link
                            key={id}
                            to={`/product/${id}`}
                            className="flex flex-col justify-center"
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
        </div>
    );
}
