interface CartBreadcrumbProps {
    currentPath: string;
}

export function CartBreadcrumb({ currentPath }: CartBreadcrumbProps) {
    const steps = [
        { name: '장바구니', path: '/cart' },
        { name: '주문결제', path: '/order' },
        { name: '완료', path: '/order-complete' },
    ];

    return (
        <div className="flex items-center justify-center">
            {steps.map((step, index) => (
                <div
                    key={step.path}
                    className="flex items-center"
                >
                    <div className="flex items-center">
                        <span className={`text-sm font-semibold ${currentPath === step.path ? 'text-accent' : 'text-description/75'}`}>{step.name}</span>
                    </div>
                    {index < steps.length - 1 && (
                        <svg
                            className="w-4 h-4 mx-1 text-description"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    )}
                </div>
            ))}
        </div>
    );
}
