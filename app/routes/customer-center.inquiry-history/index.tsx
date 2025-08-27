import { useMemo, useState } from 'react';
import { Link } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';

type InquiryStatus = 'answered' | 'pending';

interface InquiryItem {
    id: string;
    createdAt: string;
    primaryType: string;
    secondaryType: string;
    product?: { orderNo: string; name: string; image?: string } | null;
    content: string;
    images?: string[];
    status: InquiryStatus;
    answer?: { content: string; answeredAt: string };
}

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

// 샘플 데이터
const SAMPLE_INQUIRIES: InquiryItem[] = [
    {
        id: 'q-1001',
        createdAt: '2025-08-27 10:21',
        primaryType: '배송 문의',
        secondaryType: '배송일정 문의',
        product: {
            orderNo: '2025-08-26-101661',
            name: '현 고백자 수저받침 2P세트',
            image: '/images/product/product-1-2.jpg',
        },
        content: '배송 예정일이 언제인지 알려주세요. 일정 조율이 필요합니다.',
        images: [],
        status: 'answered',
        answer: {
            content: '안녕하세요. 문의하신 상품은 8/29(금) 예정입니다. 일정 변경은 마이존 > 주문내역에서 가능합니다.',
            answeredAt: '2025-08-27 13:05',
        },
    },
    {
        id: 'q-1002',
        createdAt: '2025-08-26 18:03',
        primaryType: '교환/반품 문의',
        secondaryType: '배송지 변경 요청',
        product: {
            orderNo: '2025-08-27-101632',
            name: '여성 크로스백 8103378',
            image: '/images/product/product-1-2.jpg',
        },
        content: '다음 주소로 변경 부탁드립니다. (서울시 강남구 …)',
        images: ['/images/product/product-1-2.jpg'],
        status: 'pending',
    },
    {
        id: 'q-1003',
        createdAt: '2025-08-25 09:41',
        primaryType: '주문/결제 문의',
        secondaryType: '배송비 문의',
        product: null,
        content: '주문 시 배송비가 이중으로 계산된 것 같습니다. 확인 부탁드립니다.',
        status: 'answered',
        answer: {
            content: '중복 과금 내역은 없으며, 프로모션 적용 후 최종 배송비 0원으로 결제되었습니다.',
            answeredAt: '2025-08-25 12:10',
        },
    },
    {
        id: 'q-1004',
        createdAt: '2025-08-24 21:10',
        primaryType: '상품 문의',
        secondaryType: '배송 오류 문의',
        product: null,
        content: '같은 상품을 2건 주문했는데 1건만 배송완료로 표기됩니다.',
        status: 'pending',
    },
];

export default function CustomerCenterInquiryHistory() {
    const [statusFilter, setStatusFilter] = useState<'all' | InquiryStatus>('all');
    const [openId, setOpenId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        if (statusFilter === 'all') return SAMPLE_INQUIRIES;
        return SAMPLE_INQUIRIES.filter((q) => q.status === statusFilter);
    }, [statusFilter]);

    return (
        <QuickMenuContents>
            <section className="poj2-customer-center grid grid-cols-1 lg:grid-cols-[180px_calc(100%-200px)] gap-4 lg:gap-5">
                {/* 네비게이션 */}
                <div className="max-lg:hidden border-r border-border">
                    <CustomerCenterNavigation />
                </div>

                {/* 컨텐츠 */}
                <div className="lg:pt-10 pb-15 lg:pb-30">
                    {/* 상단 타이틀 */}
                    <div className="max-lg:hidden max-lg:px-4">
                        <h2 className="text-2xl font-semibold">문의내역</h2>
                    </div>

                    {/* 상태 필터 탭 */}
                    <nav className="max-lg:sticky max-lg:top-[57px] max-lg:h-fit max-lg:z-2 lg:mt-2 flex items-center bg-white">
                        {(
                            [
                                { key: 'all', label: '전체' },
                                { key: 'pending', label: '미답변' },
                                { key: 'answered', label: '답변완료' },
                            ] as { key: 'all' | InquiryStatus; label: string }[]
                        ).map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setStatusFilter(t.key)}
                                className={`flex-1 block h-[50px] ${statusFilter === t.key ? 'font-semibold border-b-2 border-current' : 'border-b border-border'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </nav>

                    <div className="max-lg:p-4 mt-2 lg:mt-6">
                        {filtered.length === 0 && <div className="py-20 text-center text-description">문의내역이 없습니다.</div>}

                        <ul className="space-y-3">
                            {filtered.map((q) => {
                                const isOpen = openId === q.id;
                                const isAnswered = q.status === 'answered' || !!q.answer;
                                return (
                                    <li
                                        key={q.id}
                                        className="border border-border rounded"
                                    >
                                        <button
                                            type="button"
                                            className="w-full text-left px-4 py-3"
                                            onClick={() => setOpenId((prev) => (prev === q.id ? null : q.id))}
                                        >
                                            {/* 1열: 뱃지 + 유형 경로 + 작성일 */}
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center h-6 px-2 rounded text-xs border ${isAnswered ? 'border-accent text-accent' : 'border-border text-description'}`}>{isAnswered ? '답변완료' : '미답변'}</span>
                                                <div className="text-sm text-description">
                                                    {q.primaryType} &gt; {q.secondaryType}
                                                </div>
                                                <div className="ml-auto text-xs text-description max-lg:hidden">{q.createdAt}</div>
                                            </div>

                                            {/* 2열: 선택 상품 정보 */}
                                            {q.product && (
                                                <div className="mt-2 flex items-center gap-3">
                                                    {q.product.image && (
                                                        <img
                                                            src={q.product.image}
                                                            alt="상품"
                                                            className="w-14 h-14 object-cover rounded"
                                                        />
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="text-xs text-description">{q.product.orderNo}</div>
                                                        <div className="truncate">{q.product.name}</div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 3열: 문의 내용 */}
                                            <div className="mt-2 text-sm lg:line-clamp-2 max-lg:line-clamp-3">{q.content}</div>
                                            <div className="lg:hidden mt-1 text-xs text-description">{q.createdAt}</div>
                                        </button>

                                        {/* 확장 영역 */}
                                        {isOpen && (
                                            <div className="px-4 pb-4">
                                                <div className="pt-2 text-xs text-description whitespace-pre-wrap">{q.content}</div>
                                                {/* 첨부 */}
                                                {q.images && q.images.length > 0 && (
                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {q.images.map((src, i) => (
                                                            <img
                                                                key={i}
                                                                src={src}
                                                                alt={`첨부 ${i + 1}`}
                                                                className="w-20 h-20 object-cover rounded border border-border"
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                {/* 답변 */}
                                                {isAnswered && (
                                                    <div className="mt-4 p-4 rounded border border-border bg-border/15">
                                                        <div className="text-sm whitespace-pre-wrap">{q.answer?.content}</div>
                                                        <div className="mt-2 text-xs text-description">답변일 {q.answer?.answeredAt}</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </section>
        </QuickMenuContents>
    );
}

function CustomerCenterNavigation() {
    return (
        <nav className="px-4 max-lg:py-4 max-lg:divide-y max-lg:divide-border">
            <h2 className="hidden lg:block text-4xl py-10">
                <Link to="/customer-center">고객센터</Link>
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
