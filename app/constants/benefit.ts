export interface Event {
    path: string;
    title: string;
    image: string;
    endDate?: string;
    benefits?: Array<{
        type: 'coupon' | 'card' | 'credit' | 'gift';
        value: string;
    }>;
}

export const EVENT_DATA: Event[] = [
    {
        path: '/event/1',
        endDate: '2025-08-25',
        title: '오늘은 뷰티페스타',
        image: '/images/banner/event.jpg',
        benefits: [
            { type: 'coupon', value: '할인쿠폰 15%(최대 5천원)' },
            { type: 'card', value: '적립금 10%(최대 1만원)' },
        ],
    },
    {
        path: '/event/1',
        endDate: '2025-08-22',
        title: '오늘은 뷰티페스타',
        image: '/images/banner/event.jpg',
        benefits: [
            { type: 'coupon', value: '할인쿠폰 15%(최대 5천원)' },
            { type: 'gift', value: '기프트 증정' },
        ],
    },
    {
        path: '/event/1',
        endDate: '2025-09-25',
        title: '오늘은 뷰티페스타',
        image: '/images/banner/event.jpg',
        benefits: [
            { type: 'credit', value: '5만원 이상 즉시할인' },
            { type: 'gift', value: '기프트 증정' },
        ],
    },
    {
        path: '/event/1',
        endDate: '2025-08-29',
        title: '오늘은 뷰티페스타',
        image: '/images/banner/event.jpg',
        benefits: [
            { type: 'card', value: '적립금 10%(최대 1만원)' },
            { type: 'card', value: '일부 행사상품' },
        ],
    },
    {
        path: '/event/1',
        title: '오늘은 뷰티페스타',
        image: '/images/banner/event.jpg',
        benefits: [
            { type: 'coupon', value: '할인쿠폰 15%(최대 5천원)' },
            { type: 'card', value: '적립금 10%(최대 1만원)' },
            { type: 'credit', value: '5만원 이상 즉시할인' },
            { type: 'gift', value: '기프트 증정' },
        ],
    },
];
