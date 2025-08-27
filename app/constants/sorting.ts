export type ProductListSort = 'BEST_SELLING_DESC' | 'REGISTER_DATE_DESC' | 'PRICE_ASC' | 'PRICE_DESC' | 'REVIEW_SCORE_DESC';

export type ReviewListSort = 'POPULARITY_DESC' | 'LATEST_DESC' | 'HIGH_HELPFUL_DESC' | 'HIGH_SCORE_DESC' | 'LOW_SCORE_DESC';

export type SortType = ProductListSort | ReviewListSort;

export const PRODUCT_SORT_DATA: { value: ProductListSort; label: string }[] = [
    { value: 'BEST_SELLING_DESC', label: '인기순' },
    { value: 'REGISTER_DATE_DESC', label: '최신순' },
    { value: 'PRICE_ASC', label: '낮은가격순' },
    { value: 'PRICE_DESC', label: '높은가격순' },
    { value: 'REVIEW_SCORE_DESC', label: '리뷰많은순' },
];

export const REVIEW_SORT_DATA: { value: ReviewListSort; label: string }[] = [
    { value: 'POPULARITY_DESC', label: '랭킹순' },
    { value: 'LATEST_DESC', label: '최신순' },
    { value: 'HIGH_HELPFUL_DESC', label: '높은 도움 순' },
    { value: 'HIGH_SCORE_DESC', label: '별점 높은 순' },
    { value: 'LOW_SCORE_DESC', label: '별점 낮은 순' },
];
