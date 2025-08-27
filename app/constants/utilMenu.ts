import { LoginIcon, UserIcon, CartIcon } from '@/components/icons';

export interface UtilMenuItem {
    to: string;
    Icon: typeof LoginIcon;
    label: string;
    isDesktopOnly?: boolean;
}

export const MENU_DATA: UtilMenuItem[] = [
    {
        to: '/login',
        Icon: LoginIcon,
        label: '로그인',
        isDesktopOnly: true,
    },
    {
        to: '/myzone',
        Icon: UserIcon,
        label: '마이존',
        isDesktopOnly: true,
    },
    {
        to: '/cart',
        Icon: CartIcon,
        label: '장바구니',
    },
];
