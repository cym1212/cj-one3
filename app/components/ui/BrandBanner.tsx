import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';

gsap.registerPlugin(useGSAP);

import { ImageBox } from '@/components/ui/ImageBox';

interface BrandBannerProps {
    imageSrc: string;
    imageAlt: string;
    title: string;
    likes: number;
    onLike: () => void;
}

export function BrandBanner({ imageSrc, imageAlt, title, likes, onLike }: BrandBannerProps) {
    const [isOpenShareModal, setIsOpenShareModal] = useState<boolean>(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (isOpenShareModal) {
            gsap.fromTo(
                modalRef.current,
                {
                    scale: 0.8,
                    opacity: 0,
                    y: 20,
                },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.inOut',
                }
            );
        }
    }, [isOpenShareModal]);

    const handleCloseModal = () => {
        gsap.to(modalRef.current, {
            scale: 0.8,
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => setIsOpenShareModal(false),
        });
    };

    const handleShare = (platform: string) => {
        const url = window.location.href;
        const text = title;

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
        }
        handleCloseModal();
    };

    return (
        <div className="poj2-brand-banner relative overflow-hidden lg:rounded-lg">
            <ImageBox
                src={imageSrc}
                alt={imageAlt}
                isOverlay
            />
            <div className="absolute left-4 lg:left-10 bottom-5 lg:bottom-10 space-y-2 lg:space-y-3">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">{title}</h2>
                <div className="flex items-center gap-3 lg:gap-4">
                    <button
                        type="button"
                        className="flex items-center gap-1"
                        onClick={() => setIsOpenShareModal(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-5 h-5 fill-white"
                        >
                            <path d="M664.43-120q-39.81 0-67.51-27.82-27.69-27.82-27.69-67.56 0-6 5.31-30.31L286.62-416.62q-12.93 15-31.72 23.5-18.8 8.5-40.28 8.5-39.43 0-67.02-28.07Q120-440.77 120-480q0-39.23 27.6-67.31 27.59-28.07 67.02-28.07 21.48 0 40.28 8.5 18.79 8.5 31.72 23.5l287.92-170.16q-2.77-7.77-4.04-15.42-1.27-7.66-1.27-15.66 0-39.74 27.87-67.56Q624.98-840 664.8-840q39.82 0 67.51 27.87Q760-784.25 760-744.43q0 39.81-27.82 67.51-27.82 27.69-67.56 27.69-21.7 0-40-8.89Q606.31-667 593.38-682L305.46-511.08q2.77 7.77 4.04 15.43 1.27 7.65 1.27 15.65t-1.27 15.65q-1.27 7.66-4.04 15.43L593.38-278q12.93-15 31.24-23.88 18.3-8.89 40-8.89 39.74 0 67.56 27.87Q760-255.02 760-215.2q0 39.82-27.87 67.51Q704.25-120 664.43-120Zm.19-40q23.53 0 39.46-15.92Q720-191.85 720-215.38q0-23.54-15.92-39.47-15.93-15.92-39.46-15.92-23.54 0-39.47 15.92-15.92 15.93-15.92 39.47 0 23.53 15.92 39.46Q641.08-160 664.62-160Zm-450-264.62q23.86 0 40-15.92 16.15-15.92 16.15-39.46t-16.15-39.46q-16.14-15.92-40-15.92-23.22 0-38.92 15.92Q160-503.54 160-480t15.7 39.46q15.7 15.92 38.92 15.92Zm450-264.61q23.53 0 39.46-15.92Q720-721.08 720-744.62q0-23.53-15.92-39.46Q688.15-800 664.62-800q-23.54 0-39.47 15.92-15.92 15.93-15.92 39.46 0 23.54 15.92 39.47 15.93 15.92 39.47 15.92Zm0 473.85ZM215.38-480Zm449.24-264.62Z" />
                        </svg>
                        <span className="text-sm text-white font-semibold">공유</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-1"
                        onClick={onLike}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-5 h-5 fill-white"
                        >
                            <path d="M479.23-196.23q-11.69 0-23.11-4.23-11.43-4.23-20.12-12.92l-45.92-41.47q-106.77-97-188.43-188.65Q120-535.15 120-634q0-76.31 51.85-128.15Q223.69-814 300-814q43.77 0 91.15 22.12 47.39 22.11 88.85 83.42 41.46-61.31 88.85-83.42Q616.23-814 660-814q76.31 0 128.15 51.85Q840-710.31 840-634q0 101.15-85 194.46T568.92-254.62l-45.69 41.24q-8.69 8.69-20.5 12.92t-23.5 4.23Zm-18.77-470.69q-35.92-57.93-74.69-82.5Q347-774 300-774q-60 0-100 40t-40 100q0 44.31 25.08 90.88 25.07 46.58 67.34 95.43 42.27 48.84 97.16 99.92 54.88 51.08 114.27 105.15 6.92 6.16 16.15 6.16 9.23 0 16.15-6.16 59.39-54.07 114.27-105.15 54.89-51.08 97.16-99.92 42.27-48.85 67.34-95.43Q800-589.69 800-634q0-60-40-100t-100-40q-47 0-85.77 24.58-38.77 24.57-74.69 82.5-3.16 5.38-8.54 8.07-5.38 2.7-11 2.7t-11-2.7q-5.38-2.69-8.54-8.07ZM480-504.08Z" />
                        </svg>
                        <span className="text-sm text-white font-semibold">찜 {likes}</span>
                    </button>
                </div>
            </div>

            {isOpenShareModal && (
                <div className="poj2-brand-sns-share fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-15 max-w-[85%]">
                    <div
                        ref={modalRef}
                        className="px-4 py-3 lg:py-4 bg-white shadow-lg"
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                            <h3 className="lg:text-lg font-semibold">공유하기</h3>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="p-1 rounded transition-colors hover:bg-black/5"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 -960 960 960"
                                    className="w-6 h-6 fill-gray-400"
                                >
                                    <path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 lg:px-8 pt-2 lg:pt-3">
                            <div className="flex justify-center gap-2 lg:gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleShare('facebook')}
                                    className="flex flex-col items-center gap-2 p-4 hover:bg-border/20 rounded-xl transition-colors"
                                >
                                    <div className="w-15 h-15 bg-[#1877F2] rounded-full flex items-center justify-center">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-8 h-8 fill-white"
                                        >
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-description">페이스북</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleShare('twitter')}
                                    className="flex flex-col items-center gap-2 p-4 hover:bg-border/20 rounded-xl transition-colors"
                                >
                                    <div className="w-15 h-15 bg-[#1DA1F2] rounded-full flex items-center justify-center">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-8 h-8 fill-white"
                                        >
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </div>
                                    <span className="text-sm text-description">트위터</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
