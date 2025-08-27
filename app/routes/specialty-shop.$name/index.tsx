import { useLocation, useParams } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { DefaultSearchbar } from '@/components/ui/DefaultSearchbar';
import { MarketingSlider } from '@/components/ui/MarketingSlider';
import { BrandGridCard } from '@/components/ui/BrandGridCard';
import { RecommendProductCard } from '@/components/ui/RecommendProductCard';
import { CategorySpecialHomeTab } from '@/components/ui/CategorySpecialHomeTab';
import { RecommendBannerCard } from '@/components/ui/RecommendBannerCard';
import { SpecialtyBrandCard } from '@/components/ui/SpecialtyBrandCard';
import { ProductCard } from '@/components/ui/ProductCard';

import { getPageTitleByPath } from '@/utils/pageTitle';

import { SPECIAL_PRODUCT_DATA, SPECIAL_BRAND_DATA } from '@/constants/product';
import { SLIDES_DATA, BRAND_DATA, RECOMMEND_BANNER_DATA } from '@/constants/categoryHome';

import type { Route } from './+types';

export function meta() {
    return [
        {
            title: '',
        },
        {
            name: 'description',
            content: '',
        },
        {
            name: 'keywords',
            content: '',
        },
    ];
}

export async function loader({ params }: Route.LoaderArgs) {
    // 여기서 카테고리 파라미터로 데이터 패칭 후 return시 컴포넌트의 loaderData로 전달됩니다.
    return null;
}

export default function SpecialtyShop({ loaderData }: Route.ComponentProps) {
    const location = useLocation();
    const pageTitle = getPageTitleByPath(location.pathname);

    return (
        <QuickMenuContents>
            <section className="poj2-specialty-shop lg:mb-15 mb-30">
                <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] lg:pt-8">
                    <div>{/* Grid Empty */}</div>
                    <h2 className="font-semibold text-4xl text-center">{pageTitle}</h2>
                    <div className="w-[240px] justify-self-end">
                        <DefaultSearchbar />
                    </div>
                </div>

                <div className="max-lg:overflow-x-auto max-lg:px-4 max-lg:pb-3 pt-3 lg:pt-5">
                    <CategorySpecialHomeTab />
                </div>

                <div className="sm:pt-5">
                    <MarketingSlider data={SLIDES_DATA} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-15 sm:gap-4 lg:gap-5 my-4 lg:my-5 bg-white max-lg:px-4">
                    {SPECIAL_PRODUCT_DATA.map((product) => (
                        <ProductCard
                            key={product.id}
                            data={product}
                        />
                    ))}
                </div>

                <div className="my-4 lg:my-5">
                    <MarketingSlider data={[SLIDES_DATA[0]]} />
                </div>

                <div className="my-4 lg:my-5 max-lg:px-4">
                    <SpecialtyBrandCard data={SPECIAL_BRAND_DATA} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-15 sm:gap-4 lg:gap-5 my-4 lg:my-5 bg-white max-lg:px-4">
                    <BrandGridCard
                        title="인기 브랜드"
                        data={BRAND_DATA}
                    />

                    <RecommendProductCard
                        title="브랜드 여성의류 추천"
                        data={[...SPECIAL_PRODUCT_DATA, ...SPECIAL_PRODUCT_DATA, ...SPECIAL_PRODUCT_DATA]}
                    />

                    <RecommendBannerCard data={RECOMMEND_BANNER_DATA} />
                </div>
            </section>
        </QuickMenuContents>
    );
}
