interface RadioButtonProps {
    checked: boolean;
    onChange: (value: string) => void;
    value: string;
    name: string;
    disabled?: boolean;
    className?: string;
    label?: string;
    radioButtonClassName?: string;
    labelClassName?: string;
}

export function RadioButton({ checked, onChange, value, name, disabled = false, className = '', label, radioButtonClassName = '', labelClassName = '' }: RadioButtonProps) {
    return (
        <label className={`group/poj2-radio flex items-center cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="sr-only"
            />
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${checked ? 'bg-accent border-accent' : 'bg-white border-border group-hover/poj2-radio:border-accent'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${radioButtonClassName}`}>
                {checked && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            {label && <span className={`ml-2 text-sm text-black group-hover/poj2-radio:text-accent ${labelClassName}`}>{label}</span>}
        </label>
    );
}
