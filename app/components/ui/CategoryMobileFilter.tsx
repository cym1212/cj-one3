import { useState, useRef, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import { MobileFilterCheckbox } from '@/components/ui/MobileFilterCheckbox';

import { getCategoryDataByPath } from '@/utils/navigation';
import type { FilterGroup, FilterOption, QuickFilter } from '@/constants/navigation';

gsap.registerPlugin(useGSAP);

type SortType = 'popular' | 'korean';

export function CategoryMobileFilter() {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [activeQuickFilters, setActiveQuickFilters] = useState<Set<string>>(new Set());
    const [selectedTab, setSelectedTab] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
    const [priceRange, setPriceRange] = useState({ min: 500, max: 139000000 });
    const [tempPriceRange, setTempPriceRange] = useState({ min: 500, max: 139000000 });
    const [sort, setSort] = useState<SortType>('popular');
    const [selectedPricePreset, setSelectedPricePreset] = useState<number | null>(null);

    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const { pathname } = useLocation();

    // 현재 카테고리 데이터
    const currentCategoryData = getCategoryDataByPath(pathname);

    // 필터
    const filters: FilterGroup[] = currentCategoryData && 'filters' in currentCategoryData ? currentCategoryData.filters || [] : [];

    // 퀵 필터 (임시 데이터)
    const quickFilters: QuickFilter[] = [
        { name: 'broadcast', label: '방송상품', type: 'category', value: 'broadcast' },
        { name: 'free-delivery', label: '무료배송', type: 'delivery', value: 'free' },
        { name: 'outlet', label: '아울렛', type: 'category', value: 'outlet' },
        { name: 'under-20k', label: '~2만원', type: 'priceRange', value: { min: 0, max: 20000 } },
    ];

    // 필터 탭들 (동적 생성)
    const filterTabs = useMemo(() => {
        const tabs = ['가격']; // 가격은 항상 첫 번째 탭

        // 실제 필터 데이터에서 탭 추가
        filters.forEach((filter) => {
            if (filter.label && filter.label !== '가격') {
                tabs.push(filter.label);
            }
        });

        return tabs;
    }, [filters]);

    // 정렬된 옵션
    const sortedOptions = useMemo(() => {
        const currentFilter = filters.find((filter) => filter.label === selectedTab);
        if (!currentFilter) return [];

        if (sort === 'korean') {
            return [...currentFilter.filter].sort((a, b) => a.label.localeCompare(b.label, 'ko'));
        }
        // 인기순은 일단 현재 인덱스 순서 유지
        return currentFilter.filter;
    }, [sort, filters, selectedTab]);

    // GSAP 애니메이션
    useGSAP(() => {
        if (isFilterModalOpen) {
            gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.inOut' });
            gsap.fromTo(
                modalRef.current,
                {
                    opacity: 0,
                    y: 20,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.inOut',
                }
            );
        }
    }, [isFilterModalOpen]);

    // 초기 탭 선택
    useEffect(() => {
        if (filterTabs.length > 0 && !selectedTab) {
            setSelectedTab(filterTabs[0]);
        }
    }, [filterTabs, selectedTab]);

    const handleFilterModalOpen = () => {
        setIsFilterModalOpen(true);
    };

    const handleFilterModalClose = () => {
        gsap.to(backdropRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut',
        });
        gsap.to(modalRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => setIsFilterModalOpen(false),
        });
    };

    const handleQuickFilterToggle = (filterName: string) => {
        const newActiveFilters = new Set(activeQuickFilters);
        if (newActiveFilters.has(filterName)) {
            newActiveFilters.delete(filterName);
        } else {
            newActiveFilters.add(filterName);
        }
        setActiveQuickFilters(newActiveFilters);
    };

    // 각 탭별 선택된 필터 개수 계산
    const getSelectedCountForTab = (tabName: string) => {
        if (tabName === '가격') {
            // 가격 필터는 범위가 기본값과 다르면 1개로 카운트
            return priceRange.min !== 500 || priceRange.max !== 139000000 ? 1 : 0;
        }

        const filter = filters.find((f) => f.label === tabName);
        if (!filter) return 0;

        return filter.filter.filter((item) => selectedFilters.has(item.value)).length;
    };

    const handleFilterSelect = (value: string, checked: boolean) => {
        const newSelected = new Set(selectedFilters);
        if (checked) {
            newSelected.add(value);
        } else {
            newSelected.delete(value);
        }
        setSelectedFilters(newSelected);
    };

    const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
        // 수동 조작 시 프리셋 선택 해제
        if (selectedPricePreset !== null) setSelectedPricePreset(null);
        if (type === 'min') {
            setTempPriceRange((prev) => ({
                ...prev,
                min: Math.min(value, prev.max - 1),
            }));
        } else {
            setTempPriceRange((prev) => ({
                ...prev,
                max: Math.max(value, prev.min + 1),
            }));
        }
    };

    const handleResetFilter = () => {
        setTempPriceRange({ min: 500, max: 139000000 });
        setSelectedFilters(new Set());
        setActiveQuickFilters(new Set());
        setPriceRange({ min: 500, max: 139000000 });
        setSelectedPricePreset(null);
    };

    const handleApplyFilters = () => {
        setPriceRange(tempPriceRange);
        handleFilterModalClose();
    };

    // 가격 프리셋 정의 및 선택 처리
    const pricePresets = [
        { label: '~19,000원', min: 500, max: 19000 },
        { label: '19,000원~25,000원', min: 19000, max: 25000 },
        { label: '25,000원~34,000원', min: 25000, max: 34000 },
        { label: '34,000원~52,000원', min: 34000, max: 52000 },
        { label: '52,000원~', min: 52000, max: 139000000 },
    ];

    const handleSelectPricePreset = (index: number) => {
        const preset = pricePresets[index];
        setSelectedPricePreset(index);
        setTempPriceRange({ min: preset.min, max: preset.max });
    };

    const renderFilterContent = () => {
        switch (selectedTab) {
            case '가격':
                return (
                    <div className="space-y-6">
                        {/* 슬라이더 */}
                        <div className="relative h-2 bg-border rounded-full">
                            <div
                                className="absolute h-2 bg-accent rounded-full"
                                style={{
                                    left: `${((tempPriceRange.min - 500) / (139000000 - 500)) * 100}%`,
                                    width: `${((tempPriceRange.max - tempPriceRange.min) / (139000000 - 500)) * 100}%`,
                                }}
                            />
                            <input
                                type="range"
                                min="500"
                                max="139000000"
                                value={tempPriceRange.min}
                                onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value))}
                                aria-label="최소 가격"
                                className="absolute top-0 w-full h-2 bg-transparent appearance-none z-20 pointer-events-none 
                              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                              [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full 
                              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                            />
                            <input
                                type="range"
                                min="500"
                                max="139000000"
                                value={tempPriceRange.max}
                                onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value))}
                                aria-label="최대 가격"
                                className="absolute top-0 w-full h-2 bg-transparent appearance-none z-10 pointer-events-none 
                              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                              [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full 
                              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white 
                              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto"
                            />
                        </div>

                        {/* 가격 범위 입력 */}
                        <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center gap-2 mb-4">
                            <label
                                htmlFor="min-price"
                                className="relative block w-full border border-border pl-3 pr-7 py-2"
                            >
                                <input
                                    type="number"
                                    id="min-price"
                                    value={tempPriceRange.min}
                                    onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 500)}
                                    className="w-full text-sm text-right bg-transparent outline-none border-0 focus:ring-0"
                                    placeholder="1,700"
                                />
                                <span className="absolute top-1/2 -translate-y-1/2 right-3 text-sm">원</span>
                            </label>
                            <span className="text-description text-center">~</span>
                            <label
                                htmlFor="max-price"
                                className="relative block w-full border border-border pl-3 pr-7 py-2"
                            >
                                <input
                                    type="number"
                                    id="max-price"
                                    value={tempPriceRange.max}
                                    onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 139000000)}
                                    className="w-full text-sm text-right bg-transparent outline-none border-0 focus:ring-0"
                                    placeholder="5,924,900"
                                />
                                <span className="absolute top-1/2 -translate-y-1/2 right-3 text-sm">원</span>
                            </label>
                        </div>

                        {/* 가격 범위 프리셋 */}
                        <div className="space-y-2">
                            {pricePresets.map((p, i) => (
                                <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => handleSelectPricePreset(i)}
                                    className={`w-full text-center py-2 border text-sm transition-colors ${selectedPricePreset === i ? 'bg-black border-black text-white font-semibold' : 'bg-white border-border text-black hover:bg-gray-50'}`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <>
                        <div className="flex items-center divide-x divide-description/50 mb-4">
                            <button
                                type="button"
                                className={`pr-2 leading-[1] text-sm ${sort === 'popular' ? 'font-bold' : 'text-description'}`}
                                onClick={() => setSort('popular')}
                            >
                                인기순
                            </button>
                            <button
                                type="button"
                                className={`pl-2 leading-[1] text-sm ${sort === 'korean' ? 'font-bold' : 'text-description'}`}
                                onClick={() => setSort('korean')}
                            >
                                가나다순
                            </button>
                        </div>
                        <div className="h-[calc(100%-30px)] grid grid-cols-2 gap-2">
                            {sortedOptions.map((filterItem: FilterOption) => (
                                <MobileFilterCheckbox
                                    key={filterItem.value}
                                    checked={selectedFilters.has(filterItem.value)}
                                    onChange={(checked) => handleFilterSelect(filterItem.value, checked)}
                                    label={filterItem.label}
                                    className="w-full"
                                />
                            ))}
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="poj2-mobile-category-filter">
            {/* 필터 버튼 영역 */}
            <div className="flex items-center gap-4 px-4 py-3 border-b border-border">
                {/* 필터 아이콘 버튼 */}
                <button
                    type="button"
                    onClick={handleFilterModalOpen}
                    className="shrink-0 flex items-center justify-center w-8 h-8 border border-border bg-white"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="w-5 h-5 fill-current"
                    >
                        <path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z" />
                    </svg>
                </button>

                {/* 퀵 필터 버튼들 */}
                <div className="flex items-center gap-1.5 overflow-x-auto border-l border-border pl-3">
                    {quickFilters.map((filter) => (
                        <button
                            key={filter.name}
                            onClick={() => handleQuickFilterToggle(filter.name)}
                            className={`flex-shrink-0 px-3 py-1.5 text-sm border rounded-full transition-colors ${
                                activeQuickFilters.has(filter.name) ? 'bg-accent border-accent text-white font-bold' : 'bg-white border-border text-black hover:bg-black hover:border-black hover:text-white hover:font-bold'
                            }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 필터 모달 */}
            {isFilterModalOpen && (
                <div
                    ref={backdropRef}
                    className="fixed inset-0 z-50 bg-black/50 flex items-end"
                    onClick={handleFilterModalClose}
                >
                    <div
                        ref={modalRef}
                        className="w-full bg-white rounded-t-lg h-[70%] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 모달 헤더 */}
                        <div className="flex items-center justify-between px-4 pt-6 pb-1">
                            <h3 className="text-lg font-semibold">상세필터</h3>
                            <button
                                type="button"
                                onClick={handleFilterModalClose}
                                className="p-1 rounded transition-colors hover:bg-black/5"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="w-6 h-6 fill-gray-400"
                                >
                                    <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                                </svg>
                            </button>
                        </div>

                        {/* 필터 탭 */}
                        <div className="flex items-center gap-2 p-4 overflow-x-auto">
                            {filterTabs.map((tab) => {
                                const count = getSelectedCountForTab(tab);
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`relative flex-shrink-0 px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-1 ${selectedTab === tab ? 'bg-black text-white font-bold' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {tab}
                                        {count > 0 && <span className={`absolute -top-[5px] -right-[5px] text-[10px] rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center border border-white bg-black text-white`}>{count}</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* 필터 내용 */}
                        <div className="flex-1 p-4 overflow-y-auto">{renderFilterContent()}</div>

                        {/* 모달 하단 버튼 */}
                        <div className="flex gap-3 p-4 border-t border-border">
                            <button
                                type="button"
                                onClick={handleResetFilter}
                                className="flex items-center justify-center flex-1 py-3 bg-white border border-border text-gray-700 font-semibold transition-colors hover:bg-gray-50"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="w-4 h-4 mr-1 fill-current"
                                >
                                    <path d="M440-122q-121-15-200.5-105.5T160-440q0-66 26-126.5T260-672l57 57q-38 34-57.5 79T240-440q0 88 56 155.5T440-202v80Zm80 0v-80q87-16 143.5-83T720-440q0-100-70-170t-170-70h-3l44 44-56 56-140-140 140-140 56 56-44 44h3q134 0 227 93t93 227q0 121-79.5 211.5T520-122Z" />
                                </svg>
                                초기화
                            </button>
                            <button
                                type="button"
                                onClick={handleApplyFilters}
                                className="flex-[2] py-3 bg-accent text-white font-semibold transition-colors hover:bg-accent/90"
                            >
                                적용하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
