import { SPECIAL_PRODUCT_DATA } from '@/constants/product';
import type { Product } from '@/components/ui/ProductCard';

interface SlideData {
    content: string;
    path: string;
    image: string;
}

interface BrandData {
    name: string;
    label: string;
    path: string;
    image: string;
}

interface RecommendBannerData {
    thumbnail: string;
    thumbnailLink: string;
    thumbnailAlt: string;
    isAd: boolean;
    products: Product[];
}

export const SLIDES_DATA: SlideData[] = [
    {
        content: '빌리프 더운 여름 CHILL하게 여름 한전 촉촉 에디션',
        path: '/',
        image: '/images/banner/marketing-slide-1.jpg',
    },
    {
        content: '디스커버리 어떤 날씨에도 완벽한 아웃도어 감각',
        path: '/',
        image: '/images/banner/marketing-slide-2.jpg',
    },
    {
        content: '시세이도 피부 노화 감소 저속노화 얼티뮨 세럼',
        path: '/',
        image: '/images/banner/marketing-slide-3.jpg',
    },
];

export const BRAND_DATA: BrandData[] = [
    {
        name: 'nike',
        label: '나이키',
        path: '/brand/nike',
        image: '/images/brand/nike.png',
    },
    {
        name: 'adidas',
        label: '아디다스',
        path: '/brand/adidas',
        image: '/images/brand/adidas.png',
    },
    {
        name: 'puma',
        label: '푸마',
        path: '/brand/puma',
        image: '/images/brand/puma.png',
    },
    {
        name: 'new-balance',
        label: '뉴발란스',
        path: '/brand/new_balance',
        image: '/images/brand/new-balance.png',
    },
    {
        name: 'converse',
        label: '컨버스',
        path: '/brand/converse',
        image: '/images/brand/converse.png',
    },
];

export const RECOMMEND_BANNER_DATA: RecommendBannerData = {
    thumbnail: '/images/banner/recommend-banner.jpg',
    thumbnailLink: '/',
    thumbnailAlt: '추천 배너',
    isAd: false,
    products: SPECIAL_PRODUCT_DATA.slice(0, 3),
};
