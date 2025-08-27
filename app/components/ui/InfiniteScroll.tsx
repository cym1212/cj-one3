import { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
    children: React.ReactNode;
    hasMore: boolean;
    loading: boolean;
    onLoadMore: () => void;
    threshold?: number;
    className?: string;
    loadingComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
}

export function InfiniteScroll({ children, hasMore, loading, onLoadMore, threshold = 0.1, className = '', loadingComponent, errorComponent }: InfiniteScrollProps) {
    const observerTarget = useRef<HTMLDivElement>(null);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target?.isIntersecting && hasMore && !loading) {
                onLoadMore();
            }
        },
        [hasMore, loading, onLoadMore]
    );

    useEffect(() => {
        const element = observerTarget.current;
        if (!element) return;

        const observer = new IntersectionObserver(handleIntersect, {
            threshold,
            rootMargin: '50px',
        });

        observer.observe(element);

        return () => {
            observer.unobserve(element);
            observer.disconnect();
        };
    }, [handleIntersect, threshold]);

    const defaultLoadingComponent = (
        <div className="flex justify-center items-center sm:py-6 py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
        </div>
    );

    return (
        <div className={className}>
            {children}

            {/* Intersection Observer 타겟 */}
            <div
                ref={observerTarget}
                className="h-1"
            />

            {/* 로딩 상태 */}
            {loading && (loadingComponent || defaultLoadingComponent)}

            {/* 에러 상태 (선택적) */}
            {errorComponent}
        </div>
    );
}
