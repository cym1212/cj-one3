import { useState, useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import { Checkbox } from '@/components/ui/Checkbox';

gsap.registerPlugin(useGSAP);

interface ReviewMobileFilterProps {
    colorOptions: string[];
    sizeOptions: string[];
    colorFilter: string[];
    sizeFilter: string[];
    onColorChange: (colors: string[]) => void;
    onSizeChange: (sizes: string[]) => void;
    modalOffsetBottomClassName?: string;
}

export function ReviewMobileFilter({ colorOptions, sizeOptions, colorFilter, sizeFilter, onColorChange, onSizeChange, modalOffsetBottomClassName }: ReviewMobileFilterProps) {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('색상');

    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    // 필터 탭들
    const filterTabs = ['색상', '크기'];

    // 현재 탭에 따른 옵션
    const currentOptions = useMemo(() => {
        if (selectedTab === '색상') {
            return colorOptions.filter((option) => option !== '색상전체');
        } else if (selectedTab === '크기') {
            return sizeOptions.filter((option) => option !== '크기전체');
        }
        return [];
    }, [selectedTab, colorOptions, sizeOptions]);

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

    // 각 탭별 선택된 필터 개수 계산
    const getSelectedCountForTab = (tabName: string) => {
        if (tabName === '색상') {
            return colorFilter.filter((color) => color !== '색상전체').length;
        } else if (tabName === '크기') {
            return sizeFilter.filter((size) => size !== '크기전체').length;
        }
        return 0;
    };

    const handleFilterSelect = (value: string, checked: boolean) => {
        if (selectedTab === '색상') {
            const newColors = checked ? [...colorFilter.filter((c) => c !== '색상전체'), value] : colorFilter.filter((c) => c !== value);
            onColorChange(newColors.length === 0 ? ['색상전체'] : newColors);
        } else if (selectedTab === '크기') {
            const newSizes = checked ? [...sizeFilter.filter((s) => s !== '크기전체'), value] : sizeFilter.filter((s) => s !== value);
            onSizeChange(newSizes.length === 0 ? ['크기전체'] : newSizes);
        }
    };

    const handleResetFilter = () => {
        onColorChange(['색상전체']);
        onSizeChange(['크기전체']);
    };

    const handleApplyFilters = () => {
        handleFilterModalClose();
    };

    // 현재 선택된 값 확인
    const isOptionSelected = (value: string) => {
        if (selectedTab === '색상') {
            return colorFilter.includes(value);
        } else if (selectedTab === '크기') {
            return sizeFilter.includes(value);
        }
        return false;
    };

    return (
        <div className="poj2-mobile-review-filter">
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

            {/* 필터 모달 */}
            {isFilterModalOpen && (
                <div
                    ref={backdropRef}
                    className={`fixed inset-0 z-20 bg-black/50 flex items-end lg:hidden ${modalOffsetBottomClassName}`}
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
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="h-full grid grid-cols-2 auto-rows-[40px] gap-3">
                                {currentOptions.map((option) => (
                                    <Checkbox
                                        key={option}
                                        checked={isOptionSelected(option)}
                                        onChange={(checked) => handleFilterSelect(option, checked)}
                                        label={option}
                                        className="w-full p-3 border border-border rounded"
                                        checkboxClassName="w-4 h-4"
                                        labelClassName="text-sm"
                                    />
                                ))}
                            </div>
                        </div>

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
