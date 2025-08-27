import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import { ListSorting } from '@/components/ui/ListSorting';
import { ListLayoutType } from '@/components/ui/ListLayoutType';

import { PRODUCT_SORT_DATA } from '@/constants/sorting';

import type { ListType } from '@/components/ui/ListLayoutType';
import type { SortType } from '@/constants/sorting';

gsap.registerPlugin(useGSAP);

interface ProductListControllerProps {
    totalLength: number;
    listType: ListType;
    listSort: SortType;
    onChangeListType?: (type: ListType) => void;
    onChangeListSort?: (sort: SortType) => void;
}

export function ProductListController({ totalLength, listType, listSort, onChangeListType, onChangeListSort }: ProductListControllerProps) {
    return (
        <div className="poj2-product-list-controller">
            <div className="flex items-center justify-between">
                <div className="hidden lg:flex items-center">
                    <span className="font-semibold">{totalLength}</span>
                    <span className="text-description">개의 상품이 있습니다.</span>
                </div>
                <div className="flex items-center max-lg:w-full max-lg:justify-between gap-2">
                    <ListSorting
                        sort={listSort}
                        options={PRODUCT_SORT_DATA}
                        onChange={onChangeListSort}
                    />
                    <ListLayoutType
                        type={listType}
                        onChange={onChangeListType}
                    />
                </div>
            </div>
        </div>
    );
}
