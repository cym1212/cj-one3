import { NavLink, useLocation } from 'react-router';

import { getChildCategoriesByPath } from '@/utils/navigation';

export function CategoryNavigationGrid() {
    const { pathname } = useLocation();

    const navItems = getChildCategoriesByPath(pathname);

    return (
        <nav className="w-full bg-white">
            {/* Navigation Grid */}
            {navItems.length > 0 && (
                <div>
                    {(() => {
                        const cols = navItems.length < 3 ? 2 : 3;
                        return (
                            <div className={`grid ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                {navItems.map((item, idx) => {
                                    const isLastCol = (idx + 1) % cols === 0;
                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            end
                                            className={({ isActive }) => ['block h-full px-4 py-2.5 text-sm border-b border-r border-border', isLastCol ? 'border-r-0' : '', isActive ? 'font-bold' : 'text-description'].join(' ')}
                                        >
                                            {item.label}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            )}
        </nav>
    );
}
