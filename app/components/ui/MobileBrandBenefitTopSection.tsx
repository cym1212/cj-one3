import { Link } from 'react-router';

interface MobileBrandBenefitTopSectionProps {
    brannerImage: string;
    brannerImageAlt?: string;
    brandImage: string;
    brandImageAlt?: string;
    logoImage: string;
    logoImageAlt?: string;
    brandLink: string;
}

export function MobileBrandBenefitTopSection({ brannerImage, brannerImageAlt, brandImage, brandImageAlt, logoImage, logoImageAlt, brandLink }: MobileBrandBenefitTopSectionProps) {
    return (
        <div>
            <div className="poj2-img-title-banner relative">
                {/* 오늘 혜택 이미지 */}
                <div className="mb-4">
                    <img
                        src={brannerImage}
                        alt={brannerImageAlt}
                        className="w-full h-auto"
                    />
                </div>

                {/* 브랜드 이미지 */}
                <Link
                    to={brandLink}
                    className="relative block"
                >
                    <img
                        src={brandImage}
                        alt={brandImageAlt}
                        className="w-full h-[195px] object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_,rgba(0,0,0,1)_100%)]"></div>
                    {/* 하단 오버레이와 버튼 */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-6 space-y-3">
                        <img
                            src={logoImage}
                            alt={logoImageAlt}
                            className="h-10"
                        />
                        <div>
                            <button className="flex items-center bg-transparent border border-white text-white pl-3 pr-1.5 py-0.5 rounded-full text-xs">
                                <span>더 보러가기</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="w-4 h-4 fill-current"
                                >
                                    <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
