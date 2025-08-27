import { useState } from 'react';

import { MobileSearchView } from '@/components/header/MobileSearchView';
import { SearchIcon } from '@/components/icons';

export function MobileSearchBar() {
    const [openSearchView, setOpenSearchView] = useState<boolean>(false);

    const handleCloseSearchView = () => {
        setOpenSearchView(false);
    };

    return (
        <>
            <div className="poj2-m-search-bar relative w-24">
                <button
                    type="button"
                    onClick={() => setOpenSearchView(true)}
                    className="relative w-[100px] h-8 bg-border/25 text-white rounded-full text-sm flex items-center px-4"
                >
                    <SearchIcon tailwind="absolute right-3 w-5 h-5 fill-current" />
                </button>
            </div>
            {openSearchView && <MobileSearchView onClose={handleCloseSearchView} />}
        </>
    );
}
