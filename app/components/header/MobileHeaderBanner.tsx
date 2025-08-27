import { useState } from 'react';

export function MobileHeaderBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="z-51 relative w-full h-[55px] bg-white">
            {/* 배너 이미지 */}
            <img
                src="/images/banner/mobile-header-banner.jpg"
                alt="배너"
                className="w-full h-full object-cover"
            />

            {/* 닫기 버튼 */}
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 w-[25px] h-[25px] flex items-center justify-center"
                aria-label="배너 닫기"
            >
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-white"
                >
                    <path
                        d="M15 5L5 15M5 5L15 15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
        </div>
    );
}
