import { Link } from 'react-router';

import type { RecommendedBrand } from '@/constants/navigation';

interface BrandGridCardProps {
    title: string;
    data: RecommendedBrand[];
}

export function BrandGridCard({ title, data }: BrandGridCardProps) {
    // 언제나 12개 셀 보장 (반대로 최대 12개까지만)
    const filled = [...data, ...Array.from({ length: 12 - data.length }, () => null)].slice(0, 12);

    return (
        <div className="poj2-brand-grid-card w-full sm:h-[380px] md:h-[420px] lg:h-[480px] sm:border border-border">
            <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-sm sm:text-lg leading-[1]">{title}</h3>
            </div>
            <ul className="grid grid-cols-3 auto-rows-fr sm:grid-rows-4 sm:h-[calc(100%-61px)]">
                {filled.map((brand, idx) => {
                    const isLastCol = (idx + 1) % 3 === 0;
                    const isLastRow = idx >= filled.length - 3;

                    if (!brand)
                        return (
                            <li
                                key={idx}
                                className={`hidden sm:block border-b border-r border-border ${isLastCol ? 'border-r-0' : ''} ${isLastRow ? 'sm:border-b-0' : ''}`}
                            ></li>
                        );

                    return (
                        <li
                            key={idx}
                            className={`border-b border-r border-border ${isLastCol ? 'border-r-0' : ''} ${isLastRow ? 'sm:border-b-0' : ''}`}
                        >
                            {brand && (
                                <Link
                                    to={brand.path}
                                    className="flex items-center justify-center w-full h-full"
                                >
                                    <img
                                        src={brand.image}
                                        alt={brand.name}
                                        className="max-w-[60%] sm:max-w-[70%] max-h-[60%] sm:max-h-[70%]"
                                    />
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
