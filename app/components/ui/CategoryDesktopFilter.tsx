import { useRef, useState } from 'react';
import { useLocation } from 'react-router';

import { Checkbox } from '@/components/ui/Checkbox';
import { CategoryFilterMoreModal } from '@/components/ui/CategoryFilterMoreModal';

import { getCategoryDataByPath } from '@/utils/navigation';
import type { FilterGroup, FilterOption } from '@/constants/navigation';

export function CategoryDesktopFilter() {
    const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
    const [priceRange, setPriceRange] = useState({ min: 500, max: 139000000 });
    const [tempPriceRange, setTempPriceRange] = useState({ min: 500, max: 139000000 });
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [moreTargetName, setMoreTargetName] = useState<string | null>(null);
    const groupRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const { pathname } = useLocation();

    // 현재 카테고리 데이터
    const currentCategoryData = getCategoryDataByPath(pathname);

    // 필터
    const filters: FilterGroup[] = currentCategoryData && 'filters' in currentCategoryData ? currentCategoryData.filters || [] : [];

    const handleFilterSelect = (value: string, checked: boolean) => {
        const newSelected = new Set(selectedFilters);
        if (checked) {
            newSelected.add(value);
        } else {
            newSelected.delete(value);
        }
        setSelectedFilters(newSelected);
    };

    const handleClickMore = (name: string) => {
        setMoreTargetName(name);
        setIsMoreOpen(true);
    };

    const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
        if (type === 'min') {
            setTempPriceRange((prev) => ({
                ...prev,
                min: Math.min(value, prev.max - 1), // 최소값이 최대값보다 크지 않도록
            }));
        } else {
            setTempPriceRange((prev) => ({
                ...prev,
                max: Math.max(value, prev.min + 1), // 최대값이 최소값보다 작지 않도록
            }));
        }
    };

    const handleApplyPriceFilter = () => {
        setPriceRange(tempPriceRange);
    };

    const handleResetFilter = () => {
        setTempPriceRange({ min: 500, max: 139000000 });
        setSelectedFilters(new Set());
    };

    if (filters.length === 0) return null;

    return (
        <>
            <div className="poj2-desktop-category-filter min-w-[180px] bg-white border border-border px-4 lg:px-5 divide-y divide-border">
                {filters.length > 0 &&
                    filters.map((filter) => (
                        <div
                            key={filter.name}
                            className="relative pt-3 pb-5"
                            ref={(el) => {
                                groupRefs.current[filter.name] = el;
                            }}
                        >
                            <div className="flex items-center justify-between py-1 mb-1">
                                <p className="font-semibold text-sm text-black">{filter.label}</p>
                                <button
                                    type="button"
                                    className="flex items-center text-xs text-description transition-colors hover:text-black hover:fill-black"
                                    onClick={() => handleClickMore(filter.name)}
                                >
                                    더보기
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 -960 960 960"
                                        className="fill-description w-4 h-4"
                                    >
                                        <path d="M460-460H260q-8.5 0-14.25-5.76T240-480.03q0-8.51 5.75-14.24T260-500h200v-200q0-8.5 5.76-14.25t14.27-5.75q8.51 0 14.24 5.75T500-700v200h200q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T700-460H500v200q0 8.5-5.76 14.25T479.97-240q-8.51 0-14.24-5.75T460-260v-200Z" />
                                    </svg>
                                </button>
                            </div>
                            <ul className="space-y-2">
                                {filter.filter.map((filterItem: FilterOption) => (
                                    <li key={filterItem.value}>
                                        <Checkbox
                                            checked={selectedFilters.has(filterItem.value)}
                                            onChange={(checked) => handleFilterSelect(filterItem.value, checked)}
                                            label={filterItem.label}
                                            checkboxClassName="w-4 h-4"
                                            labelClassName="text-xs"
                                        />
                                    </li>
                                ))}
                            </ul>
                            {/* 더보기 모달 */}
                            {isMoreOpen && moreTargetName === filter.name && (
                                <CategoryFilterMoreModal
                                    title={filters.find((f) => f.name === moreTargetName)?.label || ''}
                                    options={filters.find((f) => f.name === moreTargetName)?.filter || []}
                                    selected={selectedFilters}
                                    onToggle={handleFilterSelect}
                                    isOpen={isMoreOpen}
                                    onClose={() => {
                                        setIsMoreOpen(false);
                                        setMoreTargetName(null);
                                    }}
                                />
                            )}
                        </div>
                    ))}

                {/* 가격 필터 */}
                <div className="pt-3 pb-5">
                    <p className="font-semibold text-sm text-black">가격</p>

                    {/* 슬라이더 */}
                    <div className="relative flex items-center justify-between mt-2 mb-3">
                        {/* 슬라이더 트랙 */}
                        <div className="w-[80%] relative h-2 mx-2 bg-border rounded-full">
                            <div
                                className="absolute h-2 bg-accent/50 rounded-full"
                                style={{
                                    left: `${((tempPriceRange.min - 500) / (139000000 - 500)) * 100}%`,
                                    width: `${((tempPriceRange.max - tempPriceRange.min) / (139000000 - 500)) * 100}%`,
                                }}
                            />
                            {/* 최소값 슬라이더 */}
                            <input
                                type="range"
                                min="500"
                                max="139000000"
                                value={tempPriceRange.min}
                                onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value))}
                                className="absolute top-0 w-full h-2 bg-transparent cursor-pointer appearance-none 
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 
                                 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full 
                                 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                                 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                                 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:bg-accent 
                                 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 
                                 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md 
                                 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none
                                 [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:border-none"
                            />

                            {/* 최대값 슬라이더 */}
                            <input
                                type="range"
                                min="500"
                                max="139000000"
                                value={tempPriceRange.max}
                                onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value))}
                                className="absolute top-0 w-full h-2 bg-transparent cursor-pointer appearance-none 
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 
                                 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full 
                                 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                                 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                                 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:bg-accent 
                                 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 
                                 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md 
                                 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none
                                 [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:border-none"
                            />
                        </div>

                        {/* 적용 버튼 */}
                        <button
                            type="button"
                            onClick={handleApplyPriceFilter}
                            className="flex items-center justify-center w-6 h-6 border border-border transition-colors hover:border-accent"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="w-4 h-4 fill-accent"
                            >
                                <path d="M381.54-350.77q-95.92 0-162.58-66.65-66.65-66.66-66.65-162.58 0-95.92 66.65-162.58 66.66-66.65 162.58-66.65 95.92 0 162.58 66.65 66.65 66.66 66.65 162.58 0 41.69-14.77 80.69t-38.77 66.69l236.31 236.31q5.61 5.62 6 13.77.38 8.16-6 14.54-6.39 6.38-14.16 6.38-7.76 0-14.15-6.38L528.92-404.31q-30 25.54-69 39.54t-78.38 14Zm0-40q79.61 0 134.42-54.81 54.81-54.8 54.81-134.42 0-79.62-54.81-134.42-54.81-54.81-134.42-54.81-79.62 0-134.42 54.81-54.81 54.8-54.81 134.42 0 79.62 54.81 134.42 54.8 54.81 134.42 54.81Z" />
                            </svg>
                        </button>
                    </div>

                    {/* 가격 입력 */}
                    <div className="flex items-center gap-[5px]">
                        <input
                            type="number"
                            value={tempPriceRange.min}
                            onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 500)}
                            className="w-full px-2 py-1.5 text-xs border border-border focus:outline-none focus:border-accent
                                 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                 [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0
                                 [&]:[-moz-appearance:textfield]"
                            placeholder="500"
                        />
                        <span className="text-xs text-description">~</span>
                        <input
                            type="number"
                            value={tempPriceRange.max}
                            onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 139000000)}
                            className="w-full px-2 py-1.5 text-xs border border-border focus:outline-none focus:border-accent
                                 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                 [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0
                                 [&]:[-moz-appearance:textfield]"
                            placeholder="139,000,000"
                        />
                    </div>
                </div>
            </div>
            <div>
                <button
                    type="button"
                    onClick={handleResetFilter}
                    className="w-full py-2.5 text-sm font-semibold text-description border border-border bg-white transition-colors hover:border-accent hover:text-accent"
                >
                    초기화
                </button>
            </div>
        </>
    );
}
