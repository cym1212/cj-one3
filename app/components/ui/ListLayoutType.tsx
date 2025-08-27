export type ListType = 'grid' | 'list';

interface ListLayoutTypeProps {
    type: ListType;
    onChange?: (type: ListType) => void;
}

export function ListLayoutType({ type, onChange }: ListLayoutTypeProps) {
    const handleListTypeChange = (type: ListType) => {
        onChange?.(type);
    };

    return (
        <div className="poj2-list-type-button flex items-center">
            <button
                className={`flex items-center justify-center p-1 border ${type === 'grid' ? 'border-accent bg-accent fill-white' : 'border-border bg-white fill-description'}`}
                onClick={() => handleListTypeChange('grid')}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="w-5 h-5"
                >
                    <path d="M200-520q-16.08 0-28.04-11.96T160-560v-200q0-16.08 11.96-28.04T200-800h200q16.08 0 28.04 11.96T440-760v200q0 16.08-11.96 28.04T400-520H200Zm0 360q-16.08 0-28.04-11.96T160-200v-200q0-16.08 11.96-28.04T200-440h200q16.08 0 28.04 11.96T440-400v200q0 16.08-11.96 28.04T400-160H200Zm360-360q-16.08 0-28.04-11.96T520-560v-200q0-16.08 11.96-28.04T560-800h200q16.08 0 28.04 11.96T800-760v200q0 16.08-11.96 28.04T760-520H560Zm0 360q-16.08 0-28.04-11.96T520-200v-200q0-16.08 11.96-28.04T560-440h200q16.08 0 28.04 11.96T800-400v200q0 16.08-11.96 28.04T760-160H560ZM200-560h200v-200H200v200Zm360 0h200v-200H560v200Zm0 360h200v-200H560v200Zm-360 0h200v-200H200v200Zm360-360Zm0 160Zm-160 0Zm0-160Z" />
                </svg>
            </button>
            <button
                className={`flex items-center justify-center p-1 border ${type === 'list' ? 'border-accent bg-accent fill-white' : 'border-border bg-white fill-description'}`}
                onClick={() => handleListTypeChange('list')}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    className="w-5 h-5"
                >
                    <path d="M404.62-220q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73H780q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T780-220H404.62Zm0-240q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73H780q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T780-460H404.62Zm0-240q-8.5 0-14.25-5.76t-5.75-14.27q0-8.51 5.75-14.24t14.25-5.73H780q8.5 0 14.25 5.76t5.75 14.27q0 8.51-5.75 14.24T780-700H404.62ZM213.08-186.92q-21.9 0-37.49-15.59Q160-218.11 160-240t15.59-37.49q15.59-15.59 37.49-15.59 21.89 0 37.48 15.59 15.59 15.6 15.59 37.49t-15.59 37.49q-15.59 15.59-37.48 15.59Zm0-240q-21.9 0-37.49-15.59Q160-458.11 160-480t15.59-37.49q15.59-15.59 37.49-15.59 21.89 0 37.48 15.59 15.59 15.6 15.59 37.49t-15.59 37.49q-15.59 15.59-37.48 15.59Zm0-240q-21.9 0-37.49-15.59Q160-698.11 160-720t15.59-37.49q15.59-15.59 37.49-15.59 21.89 0 37.48 15.59 15.59 15.6 15.59 37.49t-15.59 37.49q-15.59 15.59-37.48 15.59Z" />
                </svg>
            </button>
        </div>
    );
}
