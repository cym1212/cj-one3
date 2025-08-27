import type { MainSliderProps } from '@/components/ui/MainSlider';

interface CouponBenefit {
    image: string;
    name: string;
    href: string;
}

interface CreditCardBenefit extends CouponBenefit {
    discount: string;
    hasDiscountRange: boolean;
    bgColor: string;
}

export const SLIDES_DATA: MainSliderProps['data'] = [
    {
        content: '네이버페이로 결제하면\n~3,000p 적립',
        path: '/',
        badges: ['네이버포인트'],
        image: '/images/main-slide/n-pay.jpg',
        isAd: false,
    },
    {
        content: '식닥 위의 예술\n~빌레로이앤보흐~44%',
        path: '/',
        badges: ['백화점동일', '단독특가'],
        image: '/images/main-slide/villeroy-boch.jpg',
        isAd: true,
    },
    {
        content: '나에게 맞는 유산균\n드시모네 브랜드위크',
        path: '/',
        badges: ['CJ특가', '5% 카드할인'],
        image: '/images/main-slide/be-simone.jpg',
        isAd: true,
    },
    {
        content: '1일 섭취량은 100%\n~캡슐은 초미니로 작게',
        path: '/',
        badges: ['적립10%', '추가증정'],
        image: '/images/main-slide/ag-health.jpg',
        isAd: true,
    },
    {
        content: '정수기는 역시 코웨이\n최대 6개월 반값할인',
        path: '/',
        badges: ['상품권', '제휴카드'],
        image: '/images/main-slide/coway.jpg',
        isAd: true,
    },
    {
        content: '다이슨 에어랩id\n완벽 썸머 스타일링',
        path: '/',
        badges: ['5%쿠폰', '2종사은증정'],
        image: '/images/main-slide/dyson.jpg',
        isAd: true,
    },
    {
        content: '1일 섭취량은 100%\n~캡슐은 초미니로 작게',
        path: '/',
        badges: ['적립10%', '추가증정'],
        image: '/images/main-slide/ag-health.jpg',
        isAd: true,
    },
    {
        content: '정수기는 역시 코웨이\n최대 6개월 반값할인',
        path: '/',
        badges: ['상품권', '제휴카드'],
        image: '/images/main-slide/coway.jpg',
        isAd: true,
    },
];

export const CREDIT_CARD_BENEFIT_DATA: CreditCardBenefit[] = [
    {
        image: '/images/icon/lotte.png',
        name: '롯데카드',
        discount: '5',
        hasDiscountRange: true,
        href: '/',
        bgColor: '#D53225',
    },
    {
        image: '/images/icon/woori.png',
        name: '우리카드',
        discount: '10',
        href: '/',
        bgColor: '#0F34A2',
        hasDiscountRange: false,
    },
    {
        image: '/images/icon/kb.png',
        name: 'KB국민카드',
        discount: '7',
        href: '/',
        bgColor: '#62584C',
        hasDiscountRange: true,
    },
    {
        image: '/images/icon/lotte.png',
        name: '롯데카드',
        discount: '5',
        hasDiscountRange: true,
        href: '/',
        bgColor: '#D53225',
    },
    {
        image: '/images/icon/woori.png',
        name: '우리카드',
        discount: '10',
        href: '/',
        bgColor: '#0F34A2',
        hasDiscountRange: false,
    },
    {
        image: '/images/icon/kb.png',
        name: 'KB국민카드',
        discount: '7',
        href: '/',
        bgColor: '#62584C',
        hasDiscountRange: true,
    },
];

export const COUPON_BENEFIT_DATA: CouponBenefit[] = [
    {
        image: '/images/banner/benefit-welcome.png',
        name: '신규/휴먼 회원 전용 쿠폰',
        href: '/',
    },
    {
        image: '/images/banner/benefit-member.png',
        name: '멤버십 전용 방송 상품 쿠폰',
        href: '/',
    },
    {
        image: '/images/banner/benefit-kakaotalk.png',
        name: '카톡채널 친구 전용 쿠폰',
        href: '/',
    },
];
