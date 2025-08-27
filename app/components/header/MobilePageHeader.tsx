import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';

import { ArrowLeftIcon, SearchIcon, CartIcon } from '@/components/icons';
import { getPageTitleByPath } from '@/utils/pageTitle';
import { MobileSearchView } from '@/components/header/MobileSearchView';

export function MobilePageHeader({ title }: { title?: string }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [openSearchView, setOpenSearchView] = useState<boolean>(false);

    // title prop이 제공되지 않으면 동적으로 타이틀 생성 (파라미터 기반 + 경로 기반)
    const pathBasedTitle = getPageTitleByPath(location.pathname);
    const pageTitle = title || pathBasedTitle;

    const handleBackClick = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const handleCloseSearchView = () => {
        setOpenSearchView(false);
    };

    return (
        <>
            <header className="poj2-mobile-header bg-white border-b border-border lg:hidden">
                <div className="poj2-global-wrapper">
                    <div className="grid grid-cols-[1fr_auto_1fr] h-14">
                        {/* 왼쪽 영역 */}
                        <div className="flex items-center">
                            <button
                                type="button"
                                onClick={handleBackClick}
                                className="-ml-2"
                                aria-label="뒤로가기"
                            >
                                <ArrowLeftIcon tailwind="w-9 h-9 fill-current" />
                            </button>
                        </div>

                        {/* 중앙 영역 */}
                        <div className="flex items-center text-center">
                            <h1 className="text-lg font-bold truncate px-4">{pageTitle}</h1>
                        </div>

                        {/* 오른쪽 영역 - 검색, 장바구니 버튼 */}
                        <div className="flex items-center justify-end -mr-2">
                            <button
                                type="button"
                                className="w-9 h-9 flex items-center justify-center"
                                aria-label="검색"
                                onClick={() => setOpenSearchView(true)}
                            >
                                <SearchIcon tailwind="w-6 h-6 fill-current" />
                            </button>
                            <Link
                                to="/cart"
                                className="w-9 h-9 flex items-center justify-center"
                                aria-label="장바구니"
                            >
                                <CartIcon tailwind="w-6 h-6 fill-current" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            {openSearchView && <MobileSearchView onClose={handleCloseSearchView} />}
        </>
    );
}
