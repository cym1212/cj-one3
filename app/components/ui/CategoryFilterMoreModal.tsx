import { useEffect, useMemo, useRef, useState } from 'react';

import { Checkbox } from '@/components/ui/Checkbox';
import type { FilterOption } from '@/constants/navigation';

type SortType = 'popular' | 'korean';

interface CategoryFilterMoreModalProps {
    title: string;
    options: FilterOption[];
    selected: Set<string>;
    onToggle: (value: string, checked: boolean) => void;
    isOpen: boolean;
    onClose: () => void;
}

// 해당 모달은 오버레이 위에 중앙 정렬되지만, top 위치는 부모에서 계산하여 주입합니다.
export function CategoryFilterMoreModal({ title, options, selected, onToggle, isOpen, onClose }: CategoryFilterMoreModalProps) {
    const [sort, setSort] = useState<SortType>('popular');
    const containerRef = useRef<HTMLDivElement | null>(null);

    // ESC 닫기
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // 정렬된 옵션
    const sortedOptions = useMemo(() => {
        if (sort === 'korean') {
            return [...options].sort((a, b) => a.label.localeCompare(b.label, 'ko'));
        }
        // 인기순은 일단 현재 인덱스 순서 유지
        return options;
    }, [sort, options]);

    if (!isOpen) return null;

    return (
        <div className="poj2-filter-more-modal absolute -top-px left-[calc(100%+20px)] z-10">
            <div
                ref={containerRef}
                className="bg-white border border-border"
            >
                {/* header + tabs */}
                <div className="min-w-[420px] flex items-center justify-between gap-4 px-4 py-3 border-b border-border">
                    <h3 className="text-accent">{title} 전체보기</h3>
                    <div className="flex items-center">
                        <button
                            type="button"
                            className={`px-5 py-1.5 text-xs border ${sort === 'popular' ? 'text-accent border-r border-accent' : 'text-description border-r-0 border-border'}`}
                            onClick={() => setSort('popular')}
                        >
                            인기순
                        </button>
                        <button
                            type="button"
                            className={`px-5 py-1.5 text-xs border ${sort === 'korean' ? 'text-accent border-l border-accent' : 'text-description border-l-0 border-border'}`}
                            onClick={() => setSort('korean')}
                        >
                            가나다순
                        </button>
                    </div>
                </div>

                {/* list */}
                <div className="px-4">
                    <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 max-h-[200px] overflow-y-auto py-4">
                        {[...sortedOptions, ...sortedOptions].map((opt) => (
                            <div
                                key={opt.value}
                                className="flex items-center"
                            >
                                <Checkbox
                                    checked={selected.has(opt.value)}
                                    onChange={(checked) => onToggle(opt.value, checked)}
                                    label={opt.label}
                                    checkboxClassName="w-4 h-4"
                                    labelClassName="text-sm"
                                />
                            </div>
                        ))}
                    </div>

                    {/* actions */}
                    <div className="flex items-center justify-center gap-4 py-4 border-t border-border">
                        <button
                            type="button"
                            onClick={() => {
                                alert('검색 버튼이 클릭되었습니다.');
                            }}
                            className="min-w-[120px] py-2 bg-accent text-white text-base font-semibold hover:bg-accent/90 transition-colors"
                        >
                            검색
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="min-w-[120px] py-2 border border-border bg-white text-base font-semibold text-black hover:border-accent transition-colors"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
