import { Link } from 'react-router';
import { CartIcon } from '@/components/icons';
import { MobileSearchBar } from '@/components/header/MobileSearchBar';
import { MobileSearchView } from '@/components/header/MobileSearchView';
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function MobileHeader() {
    const [openSearchView, setOpenSearchView] = useState<boolean>(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const topHeaderRef = useRef<HTMLDivElement>(null);
    const bottomNavRef = useRef<HTMLDivElement>(null);

    // GSAP ScrollTrigger를 사용한 스크롤 애니메이션
    useGSAP(() => {
        if (!headerRef.current || !topHeaderRef.current || !bottomNavRef.current) return;

        const header = headerRef.current;
        const topHeader = topHeaderRef.current;
        const bottomNav = bottomNavRef.current;

        // 초기 상태 설정
        gsap.set(topHeader, {
            y: 0,
        });
        gsap.set(bottomNav, {
            y: 0,
            background: 'transparent',
        });
        gsap.set(bottomNav.querySelectorAll('a'), { color: '#ffffff' });
        gsap.set(header, { height: 'auto', background: 'linear-gradient(to bottom, black, transparent)' });

        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                const direction = self.direction;
                const scrollY = self.scroll();

                if (scrollY <= 50) {
                    // 최상단 도달: 최상단 스타일 적용
                    gsap.to(topHeader, {
                        y: 0,
                        background: 'transparent',
                        duration: 0.4,
                        ease: 'power2.out',
                    });
                    gsap.to(bottomNav, {
                        y: 0,
                        background: 'transparent',
                        duration: 0.4,
                        ease: 'power2.out',
                    });
                    gsap.to(topHeader.querySelectorAll('svg'), {
                        fill: '#fff',
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                    gsap.to(bottomNav.querySelectorAll('a'), {
                        color: '#fff',
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                    gsap.to(header, {
                        height: 'auto',
                        background: 'linear-gradient(to bottom, black, transparent)',
                        duration: 0.4,
                        ease: 'power2.out',
                    });
                } else if (scrollY > 50) {
                    // 50px 이상 스크롤된 상태에서만 방향 감지 작동
                    if (direction === -1) {
                        // 스크롤 업: 즉시 헤더 복원
                        gsap.to(topHeader, {
                            y: 0,
                            duration: 0.4,
                            ease: 'power2.out',
                        });
                        gsap.to(bottomNav, {
                            y: 0,
                            duration: 0.4,
                            ease: 'power2.out',
                        });
                        gsap.to(topHeader.querySelectorAll('svg'), {
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                        gsap.to(bottomNav.querySelectorAll('a'), {
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                        gsap.to(header, {
                            height: 'auto',
                            duration: 0.4,
                            ease: 'power2.out',
                        });
                    } else if (direction === 1) {
                        // 스크롤 다운: 즉시 헤더 숨김
                        gsap.to(topHeader, {
                            y: -topHeader.offsetHeight,
                            background: '#fff',
                            duration: 0.4,
                            ease: 'power2.out',
                        });
                        gsap.to(bottomNav, {
                            y: -topHeader.offsetHeight,
                            background: '#fff',
                            duration: 0.4,
                            ease: 'power2.out',
                        });
                        gsap.to(topHeader.querySelectorAll('svg'), {
                            fill: '#111',
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                        gsap.to(bottomNav.querySelectorAll('a'), {
                            color: '#111',
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                        gsap.to(header, {
                            height: bottomNav.offsetHeight,
                            duration: 0.4,
                            ease: 'power2.out',
                        });
                    }
                }
            },
        });

        ScrollTrigger.refresh();

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    return (
        <header
            ref={headerRef}
            className="relative z-50 fixed top-0 left-0 right-0"
        >
            {/* 상단 헤더 영역 - 스크롤 시 사라짐 */}
            <div
                ref={topHeaderRef}
                className="flex items-center justify-between px-4 py-3 will-change-transform"
            >
                {/* 로고 */}
                <div className="shrink-0">
                    <Link
                        to="/"
                        className="block"
                    >
                        <img
                            src="/images/logo.png"
                            alt="CJONSTYLE"
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>

                {/* 카트 아이콘과 검색 버튼 */}
                <div className="flex items-center gap-3">
                    {/* 검색 버튼 */}
                    <MobileSearchBar />

                    {/* 카트 아이콘 */}
                    <div className="shrink-0 relative">
                        <Link
                            to="/cart"
                            className="block text-white"
                        >
                            <CartIcon tailwind="w-6 h-6 fill-current" />
                            {/* 알림 배지 */}
                            <span className="absolute -top-2 -right-2 bg-[#640faf] text-[#23eb95] text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold leading-none">0</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* 하단 카테고리 네비게이션 */}
            <div
                ref={bottomNavRef}
                className="will-change-transform"
            >
                <nav className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <ul className="flex items-center gap-6 px-4 py-3 whitespace-nowrap">
                        <li className="last:pr-4">
                            <Link
                                to="/live-show"
                                className="font-semibold text-white"
                            >
                                라이브쇼
                            </Link>
                        </li>
                        <li className="last:pr-4">
                            <Link
                                to="/tv"
                                className="font-semibold text-white"
                            >
                                TV
                            </Link>
                        </li>
                        <li className="last:pr-4">
                            <Link
                                to="/schedule"
                                className="font-semibold text-white"
                            >
                                편성표
                            </Link>
                        </li>
                        <li className="relative">
                            <Link
                                to="/hourclass"
                                className="font-semibold text-white"
                            >
                                아워클래스
                            </Link>
                            <span className="absolute -top-0 -right-2 w-[4px] h-[4px] bg-red-500 rounded-full"></span>
                        </li>
                        <li className="relative">
                            <Link
                                to="/"
                                className="font-semibold text-white"
                            >
                                홈
                            </Link>
                        </li>
                        <li className="last:pr-4">
                            <Link
                                to="/daily-sale"
                                className="font-semibold text-white"
                            >
                                하루끝장세일
                            </Link>
                        </li>
                        <li className="relative">
                            <Link
                                to="/mega-beauty"
                                className="font-semibold text-white"
                            >
                                메가뷰티
                            </Link>
                            <span className="absolute -top-0 -right-2 w-[4px] h-[4px] bg-red-500 rounded-full"></span>
                        </li>
                        <li className="relative">
                            <Link
                                to="/fast-delivery"
                                className="font-semibold text-white"
                            >
                                바로도착
                            </Link>
                            <span className="absolute -top-0 -right-2 w-[4px] h-[4px] bg-red-500 rounded-full"></span>
                        </li>
                        <li className="last:pr-4">
                            <Link
                                to="/ranking"
                                className="font-semibold text-white"
                            >
                                랭킹
                            </Link>
                        </li>
                        <li className="last:pr-4">
                            <Link
                                to="/brand"
                                className="font-semibold text-white"
                            >
                                브랜드
                            </Link>
                        </li>
                        <li className="last:pr-4">
                            <Link
                                to="/shorts"
                                className="font-semibold text-white"
                            >
                                숏츠
                            </Link>
                        </li>
                        <li className="last:pr-4">
                            <Link
                                to="/vip"
                                className="font-semibold text-white"
                            >
                                VIP
                            </Link>
                        </li>
                        <li className="last:pr-4">
                            <Link
                                to="/benefits"
                                className="font-semibold text-white"
                            >
                                혜택
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {openSearchView && <MobileSearchView onClose={() => setOpenSearchView(false)} />}
        </header>
    );
}
