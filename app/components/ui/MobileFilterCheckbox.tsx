interface MobileFilterCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    label?: string;
    checkboxClassName?: string;
    labelClassName?: string;
    isHotLabel?: boolean;
}

export function MobileFilterCheckbox({ checked, onChange, disabled = false, className = '', label, checkboxClassName = '', labelClassName = '', isHotLabel = false }: MobileFilterCheckboxProps) {
    return (
        <label className={`group/poj2-mobile-checkbox block ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
            />

            <div
                className={`w-full h-10 border flex items-center justify-center px-4 text-sm transition-colors
                bg-white border-border
                peer-checked:border-black peer-checked:font-semibold
                ${disabled ? 'pointer-events-none' : 'hover:border-black'} ${checkboxClassName}`}
            >
                {label && <span className={`${labelClassName}`}>{label}</span>}
                {isHotLabel && <span className="ml-2 px-2 py-1leading-[1] rounded-full bg-discount/10 text-[10px] text-discount">HOT</span>}
            </div>
        </label>
    );
}
