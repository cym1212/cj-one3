import { SideQuickMenu } from '@/components/ui/SideQuickMenu';

export function QuickMenuContents({ children }: { children: React.ReactNode }) {
    return (
        <section className="poj2-quick-menu-layout poj2-global-wrapper relative grid grid-cols-1 min-lg:grid-cols-[calc(100%-100px)_100px] gap-4 lg:gap-5 max-lg:!px-0">
            {/* 컨텐츠 */}
            <div className="w-full">{children}</div>

            {/* 사이드 퀵 메뉴 */}
            <div className="hidden min-lg:block sticky top-0 h-fit sm:pt-5 z-1">
                <SideQuickMenu />
            </div>
        </section>
    );
}
