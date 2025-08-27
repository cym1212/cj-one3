interface DefaultSearchbarProps {
    placeholder?: string;
    onSearch?: (keyword: string) => void;
}

export function DefaultSearchbar({ placeholder, onSearch }: DefaultSearchbarProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.currentTarget;
        const keyword = new FormData(form).get('search') as string;

        onSearch?.(keyword);
    };

    return (
        <form
            className="poj2-default-search-bar relative w-full min-w-[240px]"
            onSubmit={handleSubmit}
        >
            <label
                className="block relative w-full h-10 border border-description rounded-full"
                htmlFor="poj2-search"
            >
                <input
                    id="poj2-search"
                    type="text"
                    placeholder={placeholder || '검색어를 입력하세요'}
                    className="w-full h-full pr-10 pl-6 text-sm leading-[1] focus:outline-none"
                />
                <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        className="fill-description w-5 h-5"
                    >
                        <path d="M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                    </svg>
                </button>
            </label>
        </form>
    );
}
