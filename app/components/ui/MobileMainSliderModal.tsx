import { useEffect } from 'react';
import { Link } from 'react-router';

interface Slider {
    content: string;
    path: string;
    image: string;
    badges: string[];
}

export interface MobileMainSliderModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Slider[];
}

export function MobileMainSliderModal({ isOpen, onClose, data }: MobileMainSliderModalProps) {
    // 모달이 열려있는 동안 뒷 배경 스크롤 방지
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
                <div className="flex-1"></div>
                <h2 className="text-lg font-semibold text-center flex-1">전체보기</h2>
                <button
                    onClick={onClose}
                    className="flex-1 flex justify-end"
                >
                    <div className="w-6 h-6 flex items-center justify-center">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="#111"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </button>
            </div>

            {/* 카드 그리드 컨텐츠 */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 pb-4">
                    {data.map((item, idx) => (
                        <Link
                            key={item.content + idx}
                            to={item.path}
                            className="block bg-white rounded overflow-hidden"
                        >
                            {/* 이미지 */}
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={item.image}
                                    alt={item.content}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* 텍스트 영역 */}
                            <div className="mt-[8px]">
                                {/* 제목 */}
                                <h3 className="text-sm font-bold line-clamp-2 leading-tight">{item.content}</h3>

                                {/* 배지들 */}
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                    {item.badges.map((badge, index) => (
                                        <span
                                            className="inline-block font-medium text-xs"
                                            key={index}
                                        >
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
