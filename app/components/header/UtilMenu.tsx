import { Link } from 'react-router';

import { MENU_DATA } from '@/constants/utilMenu';

export function UtilMenu() {
    return (
        <ul className="poj2-util-menu flex items-center gap-5">
            {MENU_DATA.map(({ to, Icon, label, isDesktopOnly }) => (
                <li
                    key={to}
                    className={isDesktopOnly ? 'hidden lg:block' : ''}
                >
                    <Link
                        to={to}
                        aria-label={label}
                        className="group/util-menu-item flex flex-col items-center justify-center gap-1"
                    >
                        <Icon tailwind="w-[27px] h-[27px] transition-colors group-hover/util-menu-item:fill-accent" />
                        <span className="hidden lg:block text-xs text-description transition-colors group-hover/util-menu-item:text-accent">{label}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
