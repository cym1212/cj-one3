export interface ReviewData {
    id: number;
    userId: string;
    productRating: number;
    deliveryRating: number;
    content: string;
    date: string;
    color?: string;
    size?: string;
    media?: {
        type: 'image' | 'video';
        url: string;
        thumbnail?: string; // 비디오의 경우 썸네일
    };
    helpful: number;
}

export const SAMPLE_REVIEWS: ReviewData[] = [
    {
        id: 1,
        userId: 'ysh8****',
        productRating: 4.5,
        deliveryRating: 5,
        content: '배송 빨라요 부드럽고 포근해요. 정사이즈로 맞는데 넉넉하고 편안해하네요',
        date: '2025.08.11',
        color: '크림카멜',
        size: '55',
        helpful: 0,
    },
    {
        id: 2,
        userId: 'essie****',
        productRating: 3.5,
        deliveryRating: 4.5,
        content: '엄마가 입으려 구매했는데 방송에서 보는거보단 실물이 별로 였어요 가격대도 있는건데 내가 입는거면 반품했을수도~~엄마도 못생겼다고 안입으시네요 아까워라',
        date: '2025.05.17',
        color: '토프그레이',
        size: '88',
        media: {
            type: 'image',
            url: '/images/product/product-review.jpg',
        },
        helpful: 5,
    },
    {
        id: 3,
        userId: 'test****',
        productRating: 5,
        deliveryRating: 4,
        content: '제품 품질이 정말 좋아요. 배송도 빠르고 포장도 깔끔했습니다. 다음에도 구매할 예정이에요.',
        date: '2025.08.10',
        color: '블랙',
        size: '66',
        helpful: 2,
    },
];
