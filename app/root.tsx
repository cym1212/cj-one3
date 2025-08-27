/**
 * Root 컴포넌트 - 애플리케이션의 루트 레이아웃
 * 전역 레이아웃 구조 및 메타데이터 관리
 */
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from 'react-router';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

import { DesktopHeader } from '@/components/header/DesktopHeader';
import { MobilePageHeader } from '@/components/header/MobilePageHeader';
import { Footer } from '@/components/footer/Footer';
import { MobileBottomNav } from '@/components/header/MobileBottomNav';
import { CategoryBreadcrumb } from '@/components/ui/CategoryBreadcrumb';
import { CategoryNavigationGrid } from '@/components/ui/CategoryNavigationGrid';
import { MobileHeaderBanner } from '@/components/header/MobileHeaderBanner';
import { MobileHeader } from '@/components/header/MobileHeader';

import type { Route } from './+types/root';

import './app.css';

gsap.registerPlugin(useGSAP);

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const location = useLocation();
    const pathName = location.pathname;

    useGSAP(() => {
        gsap.to('.poj2-app', {
            opacity: 1,
            duration: 0.9,
            ease: 'power2.inOut',
        });
    });

    return (
        <div className="poj2-app opacity-0">
            {!pathName.startsWith('/menu') && (
                <>
                    {/* 메인 페이지에서는 항상 DesktopHeader 사용 */}
                    {pathName === '/' ? (
                        <>
                            <div className="hidden lg:block">
                                <DesktopHeader />
                            </div>
                            <div className="lg:hidden z-10 fixed top-0 left-0 right-0">
                                <MobileHeaderBanner />
                                <MobileHeader />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* 데스크탑 헤더 - lg 이상에서만 표시 / 장바구니 페이지는 안보여줌 */}
                            {!pathName.startsWith('/cart') && (
                                <div className="hidden lg:block">
                                    <DesktopHeader />
                                </div>
                            )}
                            {/* 모바일 헤더 - lg 미만에서만 표시 */}
                            <div className="z-10 sticky top-0 h-fit lg:hidden">
                                <MobilePageHeader />
                                {pathName.startsWith('/category') && <CategoryBreadcrumb />}
                            </div>
                            {/* 모바일 카테고리 네비게이션 - lg 미만에서만 표시 */}
                            <div className="lg:hidden">
                                <CategoryNavigationGrid />
                                {!pathName.startsWith('/cart') && !pathName.startsWith('/myzone') && <div className="w-full h-2 bg-border/25"></div>}
                            </div>
                        </>
                    )}
                </>
            )}
            <main className="poj2-main">
                <Outlet />
            </main>
            {!pathName.startsWith('/menu') && !pathName.startsWith('/cart') && <Footer />}
            {!pathName.startsWith('/product') && !pathName.startsWith('/cart') && <MobileBottomNav />}
        </div>
    );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let title = '오류';
    let message = '예상치 못한 오류가 발생했습니다.';
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        title = error.status === 404 ? '404: 페이지를 찾을 수 없습니다' : `오류 ${error.status}`;
        message = error.status === 404 ? '요청하신 페이지를 찾을 수 없습니다.' : error.statusText || message;
    } else if (import.meta.env.DEV && error instanceof Error) {
        // 개발 환경에서만 오류 스택을 노출합니다.
        message = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="mb-4">{message}</p>
            {stack && (
                <pre className="w-full p-4 bg-gray-100 text-left overflow-x-auto rounded">
                    <code>{stack}</code>
                </pre>
            )}
            {error instanceof Error || isRouteErrorResponse(error) ? (
                <p>
                    <a
                        href="/"
                        className="text-blue-600 hover:underline"
                    >
                        홈으로 돌아가기
                    </a>
                </p>
            ) : null}
        </main>
    );
}
