import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { RadioButton } from '@/components/ui/RadioButton';

import type { SortType } from '@/constants/sorting';

gsap.registerPlugin(useGSAP);

interface SortOption {
    value: SortType;
    label: string;
}

interface ListSortingProps {
    sort: SortType;
    options: SortOption[];
    onChange?: (sort: SortType) => void;
    modalOffsetBottomClassName?: string;
}

export function ListSorting({ sort, options, onChange, modalOffsetBottomClassName }: ListSortingProps) {
    const [isMobileSortModalOpen, setIsMobileSortModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const handleSortChange = (sort: SortType) => {
        onChange?.(sort);
    };

    const handleMobileSortClick = () => {
        setIsMobileSortModalOpen(true);
    };

    const handleMobileSortModalClose = () => {
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
            onComplete: () => setIsMobileSortModalOpen(false),
        });
    };

    const getSortLabel = (sort: SortType) => {
        const sortOption = options.find((option) => option.value === sort);
        return sortOption?.label ?? '인기순';
    };

    // 모달 열릴때
    useGSAP(() => {
        if (isMobileSortModalOpen) {
            gsap.fromTo(
                backdropRef.current,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.inOut',
                }
            );
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
    }, [isMobileSortModalOpen]);

    return (
        <>
            <div className="poj2-list-sorting">
                {/* 데스크톱 */}
                <div className="hidden lg:flex ">
                    <InfoTooltip>
                        <div className="text-sm text-description">
                            <p className="font-semibold">CJ온스타일 인기순</p>
                            <p className="mb-4">인기도(클릭 · 주문)를 기반으로 상품을 정렬합니다.</p>
                            <p>검색 품질 개선을 위해 채널 · 기간별 가중치 등 추가요소가 반영됩니다</p>
                        </div>
                    </InfoTooltip>
                    <select
                        title="정렬 방식 선택"
                        value={sort}
                        className="w-[120px] appearance-none bg-white border border-border px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_10px]"
                        onChange={(e) => handleSortChange(e.target.value as SortType)}
                    >
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 모바일 */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={handleMobileSortClick}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-border bg-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-4 h-4 fill-description"
                        >
                            <path d="M120-240v-60h240v60H120Zm0-210v-60h480v60H120Zm0-210v-60h720v60H120Z" />
                        </svg>
                        <span>{getSortLabel(sort)}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-4 h-4 fill-description"
                        >
                            <path d="M480-361.54 267.69-573.85q-8.31-8.3-8.31-20.65 0-12.35 8.31-20.65 8.31-8.31 20.66-8.31 12.34 0 20.65 8.31L480-444.16l171-170.99q8.31-8.31 20.65-8.31 12.35 0 20.66 8.31 8.31 8.3 8.31 20.65 0 12.35-8.31 20.65L480-361.54Z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 모바일 정렬 모달 */}
            {isMobileSortModalOpen && (
                <div
                    ref={backdropRef}
                    className={`fixed inset-0 z-20 bg-black/50 flex items-end lg:hidden ${modalOffsetBottomClassName}`}
                    onClick={handleMobileSortModalClose}
                >
                    <div
                        ref={modalRef}
                        className="w-full bg-white rounded-t-lg px-4 py-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">정렬순</h3>
                            <button
                                type="button"
                                onClick={handleMobileSortModalClose}
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

                        <div className="space-y-3">
                            {options.map((option) => (
                                <div key={option.value}>
                                    <RadioButton
                                        checked={sort === option.value}
                                        onChange={(value) => {
                                            handleSortChange(value as SortType);
                                            handleMobileSortModalClose();
                                        }}
                                        value={option.value}
                                        name="sort"
                                        label={option.label}
                                        className="py-1"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
