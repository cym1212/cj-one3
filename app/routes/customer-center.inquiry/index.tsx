import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';

export function meta() {
    return [
        {
            title: '고객센터 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 고객센터 페이지',
        },
    ];
}

export default function CustomerCenterInquiry() {
    // 1차 / 2차 유형
    const [primaryType, setPrimaryType] = useState<string>('');
    const [secondaryType, setSecondaryType] = useState<string>('');

    // 상품 선택
    type Product = { id: string; orderNo: string; name: string };
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productModalOpen, setProductModalOpen] = useState(false);

    // 내용
    const [content, setContent] = useState('');

    // 이미지 업로드 (최대 3개, 이미지 전용)
    const [images, setImages] = useState<{ file: File; url: string }[]>([]);
    const maxImages = 3;

    // SMS 토글
    const [smsToggle, setSmsToggle] = useState(true);

    // 단계별 활성화 플래그
    const canChooseSecondary = !!primaryType;
    const canFillDetails = !!primaryType && !!secondaryType; // 상품선택/문의내용/이미지 활성 기준
    const canSubmit = canFillDetails && content.trim().length > 0;

    const primaryOptions = useMemo(() => ['배송 문의', '교환/반품 문의', '취소/환불 문의', '주문/결제 문의', '이벤트/혜택/회원 문의', '상품 문의'], []);

    const secondaryOptions = useMemo(() => ['배송일정 문의', '배송지 변경 요청', '배송비 문의', '배송 오류 문의'], []);

    // 미리보기 URL 정리
    useEffect(() => {
        return () => {
            images.forEach((i) => URL.revokeObjectURL(i.url));
        };
    }, [images]);

    const onFilesChange = (files: FileList | null) => {
        if (!files) return;
        const next: { file: File; url: string }[] = [];
        for (let i = 0; i < files.length; i++) {
            const f = files[i];
            if (!f.type.startsWith('image/')) continue;
            next.push({ file: f, url: URL.createObjectURL(f) });
        }
        if (!next.length) return;
        setImages((prev) => {
            const merged = [...prev, ...next].slice(0, maxImages);
            return merged;
        });
    };

    const removeImage = (url: string) => {
        if (!confirm('삭제하시겠습니까?')) return;
        setImages((prev) => {
            const rest = prev.filter((i) => i.url !== url);
            URL.revokeObjectURL(url);
            return rest;
        });
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ primaryType, secondaryType, selectedProduct, content, images, smsToggle });
    };

    return (
        <QuickMenuContents>
            <section className="poj2-customer-center grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-[180px_calc(100%-200px)] gap-4 lg:gap-5">
                {/* 네비게이션 */}
                <div className="max-lg:order-2 border-r border-border">
                    <CustomerCenterNavigation />
                </div>

                {/* 모바일 분선 */}
                <div className="order-1 block lg:hidden w-full h-2 bg-border/25"></div>

                {/* 컨텐츠 */}
                <div className="lg:pt-10 pb-15 lg:pb-30">
                    {/* 상단 타이틀 */}
                    <div className="max-lg:px-4 max-lg:pt-6">
                        <h1 className="text-lg lg:text-xl font-bold leading-tight">안녕하세요.</h1>
                        <p className="text-lg lg:text-xl font-bold">CJ온스타일 고객센터입니다.</p>
                        <p className="mt-1 text-sm text-muted-foreground">문제 해결을 위한 가장 빠른 방법을 안내해드릴게요.</p>
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="mt-5 lg:mt-6 space-y-2 max-lg:px-4"
                    >
                        {/* 1차 유형 */}
                        <div>
                            <select
                                value={primaryType}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setPrimaryType(v);
                                }}
                                className="w-full px-4 py-3 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors"
                            >
                                <option value="">유형을 선택해주세요</option>
                                {primaryOptions.map((opt) => (
                                    <option
                                        key={opt}
                                        value={opt}
                                    >
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 2차 유형 */}
                        <div>
                            <select
                                value={secondaryType}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setSecondaryType(v);
                                }}
                                disabled={!canChooseSecondary}
                                className="w-full px-4 py-3 text-sm border border-border rounded appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzExMTExMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px] focus:outline-none focus:border-accent transition-colors disabled:bg-muted disabled:text-muted-foreground"
                            >
                                <option value="">유형을 선택해주세요</option>
                                {secondaryOptions.map((opt) => (
                                    <option
                                        key={opt}
                                        value={opt}
                                    >
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* 상품 선택 */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={selectedProduct ? `${selectedProduct.orderNo} ${selectedProduct.name}` : ''}
                                placeholder="상품을 선택해주세요"
                                disabled={!canFillDetails}
                                className="flex-1 py-3 px-4 text-sm border border-border rounded outline-none focus:ring-2 focus:ring-accent/40 placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground"
                            />
                            <button
                                type="button"
                                className="shrink-0 py-3 px-4 text-sm border border-border rounded hover:border-accent hover:text-accent disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!canFillDetails}
                                onClick={() => setProductModalOpen(true)}
                            >
                                상품선택
                            </button>
                        </div>

                        {/* 문의 내용 */}
                        <div>
                            <textarea
                                rows={8}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="문의내용을 입력해주세요."
                                disabled={!canFillDetails}
                                required={canFillDetails}
                                className="w-full py-3 px-4 text-sm border border-border rounded outline-none resize-y focus:ring-2 focus:ring-accent/40 placeholder:text-muted-foreground disabled:bg-muted disabled:text-muted-foreground"
                            />
                        </div>

                        {/* 이미지 업로드 영역 */}
                        <div className="border border-border rounded">
                            {!canFillDetails ? (
                                <div
                                    aria-disabled
                                    className="h-12 w-full px-4 flex items-center justify-center gap-2 text-sm text-muted-foreground select-none cursor-not-allowed"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5"
                                        fill="currentColor"
                                    >
                                        <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM5 4h14a1 1 0 0 1 1 1v8.586l-3.293-3.293a1 1 0 0 0-1.414 0L9 19H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm7 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                    </svg>
                                    <span>
                                        이미지 추가 <span className="text-muted-foreground">(최대{maxImages}개)</span>
                                    </span>
                                </div>
                            ) : images.length === 0 ? (
                                <label className="h-12 w-full px-4 flex items-center justify-center gap-2 text-sm text-muted-foreground cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => onFilesChange(e.currentTarget.files)}
                                    />
                                    {/* 작은 이미지 아이콘 */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        className="w-5 h-5"
                                        fill="currentColor"
                                    >
                                        <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM5 4h14a1 1 0 0 1 1 1v8.586l-3.293-3.293a1 1 0 0 0-1.414 0L9 19H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm7 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                    </svg>
                                    <span>
                                        이미지 추가 <span className="text-muted-foreground">(최대{maxImages}개)</span>
                                    </span>
                                </label>
                            ) : (
                                <div className="p-3 flex flex-wrap gap-3 items-start">
                                    {/* 추가 버튼 (타일) */}
                                    <label className={`border border-dashed border-border rounded w-[84px] h-[84px] flex flex-col items-center justify-center text-xs cursor-pointer hover:border-accent ${images.length >= maxImages ? 'pointer-events-none opacity-50' : ''}`}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={(e) => onFilesChange(e.currentTarget.files)}
                                            disabled={images.length >= maxImages}
                                        />
                                        <span className="text-[11px]">이미지 추가</span>
                                        <span className="text-[10px] text-muted-foreground">(최대{maxImages}개)</span>
                                    </label>

                                    {/* 미리보기 */}
                                    {images.map((img) => (
                                        <div
                                            key={img.url}
                                            className="relative w-[84px] h-[84px]"
                                        >
                                            <img
                                                src={img.url}
                                                alt="preview"
                                                className="w-full h-full object-cover rounded border border-border"
                                            />
                                            <button
                                                type="button"
                                                aria-label="이미지 삭제"
                                                onClick={() => removeImage(img.url)}
                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-black/60 text-white rounded-full text-xm flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SMS 토글 */}
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm">휴대폰 답변 알림 SMS 받기</span>
                            <button
                                type="button"
                                role="switch"
                                aria-checked={smsToggle}
                                onClick={() => setSmsToggle((v) => !v)}
                                className={`relative inline-flex w-12 h-7 items-center rounded-full transition-colors ${smsToggle ? 'bg-accent' : 'bg-muted'} border border-border`}
                            >
                                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${smsToggle ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                type="button"
                                className="h-12 rounded border border-border"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="h-12 rounded bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                문의하기
                            </button>
                        </div>
                    </form>

                    {/* 상품 선택 모달 */}
                    {productModalOpen && (
                        <SelectProductModal
                            onClose={() => setProductModalOpen(false)}
                            onSelect={(p) => {
                                setSelectedProduct(p);
                                setProductModalOpen(false);
                            }}
                            initialSelectedId={selectedProduct?.id ?? null}
                        />
                    )}
                </div>
            </section>
        </QuickMenuContents>
    );
}

function CustomerCenterNavigation() {
    return (
        <nav className="px-4 max-lg:py-4 max-lg:divide-y max-lg:divide-border">
            <h2 className="hidden lg:block text-4xl py-10">
                <Link to="/customer-center/inquiry">고객센터</Link>
            </h2>
            {/* 고객활동 */}
            <div className="pt-8 lg:pt-2">
                <h3 className="max-lg:mb-2 text-lg font-bold">고객활동</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/customer-center/inquiry"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.949 14.538h10.184V4.867H4.867v11.618l2.082-1.947zM3.667 19.25V3.667h14.666v12.071H7.423L3.666 19.25zm11-10.4H7.333v-1.2h7.334v1.2zm-7.334 3.208h5.042v-1.2H7.333v1.2z"
                                    />
                                </svg>
                                <span>고객센터 문의하기</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/customer-center/inquiry-history"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.949 14.538h10.184V4.867H4.867v11.618l2.082-1.947zM3.667 19.25V3.667h14.666v12.071H7.423L3.666 19.25zm11.6-11.998v4.665h-1.2V8.789l-1.088.272-.291-1.164 2.579-.645zM8.85 11.917V7.252l-2.579.645.291 1.164L7.65 8.79v3.128h1.2zm2.3-2.458a.6.6 0 0 1-.608-.607.6.6 0 0 1 .608-.602c.32 0 .607.27.607.602a.617.617 0 0 1-.607.607zm0 2.3a.6.6 0 0 1-.608-.608.6.6 0 0 1 .608-.601c.32 0 .607.27.607.601a.617.617 0 0 1-.607.608z"
                                    />
                                </svg>
                                <span>나의 문의내역</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

function SelectProductModal({ onClose, onSelect, initialSelectedId }: { onClose: () => void; onSelect: (p: { id: string; orderNo: string; name: string }) => void; initialSelectedId?: string | null }) {
    type OrderItem = {
        orderId: string;
        title: string;
        option: string;
        price: number;
        quantity: number;
        image: string;
    };

    // 주문/배송 탭용 샘플 (myzone.orders에서 사용한 구조 참고)
    const ORDER_ITEMS: OrderItem[] = [
        {
            orderId: '2025-08-26-101661',
            title: '현 고백자 수저받침 2P세트',
            option: '단일상품',
            price: 3900,
            quantity: 1,
            image: '/images/product/product-1-2.jpg',
        },
        {
            orderId: '2025-08-27-101632',
            title: '여성 크로스백 8103378',
            option: '단일상품',
            price: 1318100,
            quantity: 1,
            image: '/images/product/product-1-2.jpg',
        },
    ];

    type Tab = 'order' | 'cancel' | 'cart' | 'wish';
    const [active, setActive] = useState<Tab>('order');
    const [selectedKey, setSelectedKey] = useState<string | null>(initialSelectedId ?? null);

    const groups = ORDER_ITEMS.reduce<Record<string, OrderItem[]>>((acc, item) => {
        (acc[item.orderId] ||= []).push(item);
        return acc;
    }, {});

    const formatPrice = (n: number) => n.toLocaleString('ko-KR');

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/40" />
            <div
                className="relative z-10 w-[92%] max-w-3xl bg-white rounded border border-border shadow-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 헤더 */}
                <div className="px-4 lg:px-6 py-4 border-b border-border">
                    <div className="text-center text-xl font-semibold">상품선택</div>
                </div>

                {/* 탭 */}
                <div className="flex items-center">
                    {(
                        [
                            { key: 'order', label: '주문/배송' },
                            { key: 'cancel', label: '취소/교환/반품' },
                            { key: 'cart', label: '장바구니' },
                            { key: 'wish', label: '쇼핑찜' },
                        ] as { key: Tab; label: string }[]
                    ).map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setActive(t.key)}
                            className={`flex-1 h-[50px] text-center ${active === t.key ? 'font-semibold border-b-2' : 'border-b border-border'}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* 콘텐츠 */}
                <div className="max-h-[60vh] overflow-auto">
                    {active === 'order' ? (
                        <div className="px-4 py-4">
                            {Object.entries(groups).map(([orderId, items]) => (
                                <div
                                    key={orderId}
                                    className="mb-4 last:mb-0"
                                >
                                    <div className="bg-muted rounded text-sm font-semibold inline-flex items-center gap-2">
                                        <span>주문번호</span>
                                        <span className="font-normal text-muted-foreground">{orderId}</span>
                                    </div>
                                    <ul>
                                        {items.map((it, idx) => {
                                            const key = `${orderId}-${idx}`;
                                            const selected = selectedKey === key;
                                            return (
                                                <li key={key}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedKey(key);
                                                            onSelect({ id: key, orderNo: orderId, name: it.title });
                                                        }}
                                                        className="w-full text-left flex items-center gap-3 p-2 rounded hover:bg-accent/5"
                                                    >
                                                        {/* 라디오 */}
                                                        <span className={`shrink-0 w-5 h-5 rounded-full border ${selected ? 'border-accent' : 'border-border'} flex items-center justify-center`}>
                                                            <span className={`block w-3 h-3 rounded-full ${selected ? 'bg-accent' : 'bg-transparent'}`} />
                                                        </span>
                                                        {/* 썸네일 */}
                                                        <img
                                                            src={it.image}
                                                            alt="상품 이미지"
                                                            className="w-24 h-24 object-cover rounded"
                                                        />
                                                        {/* 정보 */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="truncate font-medium">{it.title}</div>
                                                            <div className="mt-0.5 text-sm text-muted-foreground">
                                                                {it.option} | 수량 {it.quantity}
                                                            </div>
                                                            <div className="mt-1 text-lg font-bold">{formatPrice(it.price)}원</div>
                                                        </div>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-description">해당 탭의 데이터가 없습니다.</div>
                    )}
                </div>

                {/* 푸터 */}
                <div className="px-4 py-3 border-t border-border text-right bg-white">
                    <button
                        className="h-10 px-4 rounded border border-border"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
