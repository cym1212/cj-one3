export function ImageBox({ src, alt, isOverlay }: { src: string; alt: string; isOverlay?: boolean }) {
    return (
        <div className="poj2-image-box relative overflow-hidden w-full h-full">
            {/* 데스크톱 이미지 */}
            <img
                src={src}
                alt={alt}
                className="object-cover transition-transform duration-300 ease-out hover:scale-103 w-full h-full"
            />
            {isOverlay && <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_bottom,rgba(0,0,0,0),rgba(0,0,0,0.4)_99%)]"></div>}
        </div>
    );
}
