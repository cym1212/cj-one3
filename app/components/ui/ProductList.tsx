import { Link } from 'react-router';

import { ImageBox } from '@/components/ui/ImageBox';
import { LikeIcon, StarIcon } from '@/components/icons';

import { useShoppingHistory } from '@/hooks/useShoppingHistory';

import type { Product, ProductFlags, ProductBenefit } from '@/components/ui/ProductCard';

interface ProductCardProps {
    data: Product;
}

export function ProductList({ data }: ProductCardProps) {
    const { id, status, type, title, brand, price, thumbnails, discount, purchases, flags, benefits, stars, reviews } = data;
    const isSpecial = type === 'special';
    const isConsultation = type === 'consultation';
    const discountPrice = price && discount && price * (1 - discount / 100);

    const { addShoppingHistory } = useShoppingHistory();

    const handleProductClick = () => {
        // 상품 클릭 시 처리 로직
        addShoppingHistory({
            id,
            status,
            type,
            thumbnail: thumbnails[0],
            title,
            price,
            createdAt: new Date().toLocaleDateString('ko-KR'),
        });
    };

    const handleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        // 실제 장바구니 추가로직 구현
        alert(`${title} 상품을 찜했습니다`);
    };

    return (
        <div className="poj2-product-list py-3 lg:py-5">
            <Link
                to={`/product/${id}`}
                onClick={handleProductClick}
                className="flex items-stretch gap-3 lg:gap-5"
            >
                <div className="poj2-product-list-thumb overflow-hidden aspect-square w-[100px] lg:w-[130px] shrink-0">
                    <ImageBox
                        src={thumbnails[0]}
                        alt={`${brand || ''} ${title}`}
                    />
                </div>
                <div className="poj2-product-list-info flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 lg:gap-3 mb-1.5 lg:mb-2">
                            {brand && (
                                <Link
                                    to={`/brand/${brand}`}
                                    className="inline-flex items-center pl-1.5 lg:pl-2 pr-0.5 lg:pr-1 border border-border fill-description text-description transition-colors hover:border-description hover:fill-black hover:text-black"
                                >
                                    <span className="text-xs transition-colors shrink-0">브랜드</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 -960 960 960"
                                        className="w-3 h-3 lg:w-4 lg:h-4 transition-colors"
                                    >
                                        <path d="M531.69-480 361.85-649.85q-5.62-5.61-6-13.77-.39-8.15 6-14.53 6.38-6.39 14.15-6.39 7.77 0 14.15 6.39l175.54 175.53q5.23 5.24 7.35 10.7 2.11 5.46 2.11 11.92t-2.11 11.92q-2.12 5.46-7.35 10.7L390.15-281.85q-5.61 5.62-13.77 6-8.15.39-14.53-6-6.39-6.38-6.39-14.15 0-7.77 6.39-14.15L531.69-480Z" />
                                    </svg>
                                </Link>
                            )}
                            {benefits && benefits.length > 0 && (
                                <div className="poj2-product-list-benefits">
                                    <Benefits benefits={benefits} />
                                </div>
                            )}
                        </div>
                        <p className="text-sm lg:text-base leading-tight lg:leading-sm mb-2 lg:mb-3">
                            {brand && <span className="pr-1 font-bold">{brand}</span>}
                            {title}
                        </p>
                        {isConsultation && <p className="text-xs lg:text-sm">상담신청</p>}
                        <div className="flex items-end gap-1.5 lg:gap-2">
                            <div className="flex items-end gap-1">
                                {discount && <p className="text-base lg:text-xl font-bold text-discount">{discount}%</p>}
                                <p>
                                    <span className="text-base lg:text-xl font-bold">{discountPrice?.toLocaleString() || price?.toLocaleString()}</span>
                                    <span className="text-sm lg:text-base">원</span>
                                </p>
                            </div>
                            {discount && (
                                <p className="text-xs lg:text-sm text-description line-through">
                                    {price?.toLocaleString()}원{isSpecial && '~'}
                                </p>
                            )}
                        </div>
                    </div>
                    {flags && flags.length > 0 && (
                        <div className="poj2-product-list-flags lg:pt-1">
                            <Flags flags={flags} />
                        </div>
                    )}
                </div>
                <div className="shrink-0 flex flex-col items-end justify-between">
                    <button
                        type="button"
                        className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-white opacity-50 transition-colors transition-opacity hover:opacity-100 hover:fill-discount"
                        onClick={handleLike}
                    >
                        <LikeIcon tailwind="mt-0.5" />
                    </button>
                    <div className="text-right">
                        {isSpecial && purchases && <p className="text-xs text-description">{purchases.toLocaleString()} 구매</p>}
                        {stars && reviews && (
                            <div className="mt-1">
                                <Review
                                    stars={stars}
                                    reviews={reviews}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}

function Flags({ flags }: { flags: ProductFlags[] }) {
    return (
        <div className="flex items-center flex-wrap gap-x-1.5 gap-y-1 sm:gap-x-2">
            {flags.map((flag) => {
                switch (flag) {
                    case 'broadcast':
                        return (
                            <span
                                key={flag}
                                className="text-xs font-bold"
                            >
                                방송상품
                            </span>
                        );
                    case 'tomorrow':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                <img
                                    src="/images/icon/tomorrow.svg"
                                    alt="내일배송"
                                    className="h-3"
                                />
                            </span>
                        );
                    case 'weekend':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                <img
                                    src="/images/icon/weekend.svg"
                                    alt="주말배송"
                                    className="h-3"
                                />
                            </span>
                        );
                    case 'delivery':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                무료배송
                            </span>
                        );
                    case 'return':
                        return (
                            <span
                                key={flag}
                                className="text-xs"
                            >
                                무료반품
                            </span>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}

function Benefits({ benefits }: { benefits: ProductBenefit[] }) {
    return (
        <div className="flex items-center flex-wrap gap-1">
            {benefits.map((benefit) => {
                switch (benefit.type) {
                    case 'coupon':
                        return (
                            <p
                                key={benefit.value}
                                className="flex items-center gap-1 border border-border rounded px-1.5 text-xs"
                            >
                                <img
                                    src="/images/icon/coupon.svg"
                                    alt="쿠폰"
                                    className="h-3"
                                />
                                <span>{benefit.value}</span>
                            </p>
                        );
                    case 'card':
                        return (
                            <p
                                key={benefit.value}
                                className="flex items-center gap-1 border border-border rounded px-1.5 text-xs"
                            >
                                <img
                                    src="/images/icon/card.svg"
                                    alt="카드"
                                    className="h-3"
                                />
                                <span>{benefit.value}</span>
                            </p>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}

function Review({ stars, reviews }: { stars: number; reviews: number }) {
    return (
        <div className="flex items-center">
            <StarIcon tailwind="w-4 h-4 lg:w-5 lg:h-5 fill-description" />
            <div className="flex gap-1 text-xs text-description">
                <p>{stars}점</p>
                <p>{reviews}건</p>
            </div>
        </div>
    );
}
