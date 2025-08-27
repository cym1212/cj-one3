import { useState } from 'react';

export function InfoTooltip({ children, xPosition = 'left', yPosition = 'bottom' }: { children?: React.ReactNode; xPosition?: 'left' | 'right'; yPosition?: 'top' | 'bottom' }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const tooltipXPosition = xPosition === 'right' ? 'left-0' : 'right-0';
    const tooltipYPosition = yPosition === 'bottom' ? 'top-full' : 'bottom-full';

    return (
        <div className="poj2-info-tooltip relative">
            <button
                type="button"
                className="flex items-center justify-center p-1"
                onClick={() => setIsOpen(true)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="w-5 h-5 fill-description"
                >
                    <path d="M480.03-300q8.51 0 14.24-5.75T500-320v-180q0-8.5-5.76-14.25T479.97-520q-8.51 0-14.24 5.75T460-500v180q0 8.5 5.76 14.25t14.27 5.75ZM480-576.92q10.46 0 17.54-7.08 7.08-7.08 7.08-17.54 0-10.46-7.08-17.54-7.08-7.07-17.54-7.07-10.46 0-17.54 7.07-7.08 7.08-7.08 17.54 0 10.46 7.08 17.54 7.08 7.08 17.54 7.08Zm.13 456.92q-74.67 0-140.41-28.34-65.73-28.34-114.36-76.92-48.63-48.58-76.99-114.26Q120-405.19 120-479.87q0-74.67 28.34-140.41 28.34-65.73 76.92-114.36 48.58-48.63 114.26-76.99Q405.19-840 479.87-840q74.67 0 140.41 28.34 65.73 28.34 114.36 76.92 48.63 48.58 76.99 114.26Q840-554.81 840-480.13q0 74.67-28.34 140.41-28.34 65.73-76.92 114.36-48.58 48.63-114.26 76.99Q554.81-120 480.13-120Zm-.13-40q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
            </button>
            {isOpen && children && (
                <div className={`absolute ${tooltipXPosition} ${tooltipYPosition} z-1 min-w-80 pl-4 pr-9 py-3 bg-white border border-border`}>
                    <button
                        type="button"
                        className="absolute top-1 right-1 flex items-center justify-center p-1"
                        onClick={() => setIsOpen(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-5 h-5 fill-description"
                        >
                            <path d="M480-451.69 270.15-241.85q-5.61 5.62-13.77 6-8.15.39-14.53-6-6.39-6.38-6.39-14.15 0-7.77 6.39-14.15L451.69-480 241.85-689.85q-5.62-5.61-6-13.77-.39-8.15 6-14.53 6.38-6.39 14.15-6.39 7.77 0 14.15 6.39L480-508.31l209.85-209.84q5.61-5.62 13.77-6 8.15-.39 14.53 6 6.39 6.38 6.39 14.15 0 7.77-6.39 14.15L508.31-480l209.84 209.85q5.62 5.61 6 13.77.39 8.15-6 14.53-6.38 6.39-14.15 6.39-7.77 0-14.15-6.39L480-451.69Z" />
                        </svg>
                    </button>
                    {children}
                </div>
            )}
        </div>
    );
}
