interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    label?: string;
    checkboxClassName?: string;
    labelClassName?: string;
}

export function Checkbox({ checked, onChange, disabled = false, className = '', label, checkboxClassName = '', labelClassName = '' }: CheckboxProps) {
    return (
        <label className={`group/poj2-checkbox flex items-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="sr-only"
            />
            <div className={`border-1 rounded flex items-center justify-center transition-colors ${checked ? 'bg-accent border-accent' : 'bg-white border-border group-hover/poj2-checkbox:border-accent'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${checkboxClassName}`}>
                {checked && (
                    <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </div>
            {label && <span className={`ml-2 text-sm text-black group-hover/poj2-checkbox:text-accent ${labelClassName}`}>{label}</span>}
        </label>
    );
}
