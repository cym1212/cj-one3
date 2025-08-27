import * as React from 'react';

// Props 인터페이스 정의
interface CreditSummary {
    totalAmount: number;
    expiringAmount: number;
    expiringDate?: string;
}

interface CreditHistoryItem {
    date: string;
    type: string;
    description?: string;
    expiryDate?: string;
    amount: number;
    isPositive: boolean;
}

interface PeriodOption {
    value: string;
    label: string;
    isActive?: boolean;
}

interface CreditProps {
    // 페이지 제목
    title?: string;
    showTitle?: boolean;
    
    // 적립금 요약
    creditSummary?: CreditSummary;
    
    // 기간 필터 옵션
    periodOptions?: PeriodOption[];
    
    // 적립금 내역
    creditHistory?: CreditHistoryItem[];
    
    // 안내사항
    notices?: string[];
    
    // 이벤트 핸들러
    onPeriodChange?: (period: string) => void;
}

// 기본 데이터
const defaultCreditSummary: CreditSummary = {
    totalAmount: 2000,
    expiringAmount: 1200
};

const defaultPeriodOptions: PeriodOption[] = [
    { value: "1month", label: "1개월", isActive: true },
    { value: "3months", label: "3개월" },
    { value: "6months", label: "6개월" },
    { value: "12months", label: "12개월" }
];

const defaultCreditHistory: CreditHistoryItem[] = [
    {
        date: "2025-08-26",
        type: "구매 적립",
        description: "소멸 예정일 - 2025-08-30",
        amount: 1200,
        isPositive: true
    },
    {
        date: "2025-08-25",
        type: "구매 시 적립금 사용",
        amount: 500,
        isPositive: false
    },
    {
        date: "2025-08-12",
        type: "이벤트 적립",
        description: "소멸 예정일 - 2025-09-12",
        amount: 800,
        isPositive: true
    },
    {
        date: "2025-07-28",
        type: "소멸 처리",
        amount: 300,
        isPositive: false
    }
];

const defaultNotices: string[] = [
    "구매 후 받은 적립금은 다른 상품 구매시 현금처럼 사용이 가능합니다.",
    "구매 후 받은 적립금은 배송완료 후 90일 이내에 마이존 페이지에서 다운로드 받아 사용하셔야 합니다.",
    "이벤트 적립금은 이벤트 페이지에서 적립신청 후 이벤트가 종료되면 자동 적립 됩니다. (결제금액에 기준하여 비율 적용됨)",
    "상품정보에 표기된 적립금액과 실제 반소신 금액이 다를 수 있습니다. (결제금액에 기준하여 비율 적용됨)",
    "적립금의 사용은 고객의 의사와 관계없이 유효기간이 임박한 적립금이 가장 먼저 사용됩니다.",
    "상품 구매 후 받은 적립금은 상품을 반품할 경우 적립이 취소되며, 이때 적립금을 이미 사용하여 취소할 적립금이 부족한 경우 마이너스 적립금이 발생할 수 있습니다.",
    "적립금 초과 사용한 경우 초과 사용된 적립금만큼 (-)적립금으로 처리되며, (-)적립금은 신규 적립을 통해 초과 사용한 적립금만큼 변제되도록 처리됩니다.",
    "(-)적립금은 모두 변제가 되어야 정상적인 적립금 적립 및 사용이 가능합니다."
];

// 유틸리티 함수
const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('ko-KR')}원`;
};

const formatAmount = (amount: number, isPositive: boolean) => {
    const sign = isPositive ? '+' : '-';
    return `${sign}${formatCurrency(amount)}`;
};

export default function CreditStandalone({
    title = "적립금",
    showTitle = true,
    creditSummary = defaultCreditSummary,
    periodOptions = defaultPeriodOptions,
    creditHistory = defaultCreditHistory,
    notices = defaultNotices,
    onPeriodChange
}: CreditProps) {

    const [activePeriod, setActivePeriod] = React.useState(
        periodOptions.find(option => option.isActive)?.value || periodOptions[0]?.value
    );

    const handlePeriodClick = (period: string) => {
        setActivePeriod(period);
        if (onPeriodChange) {
            onPeriodChange(period);
        }
    };

    return (
        <div className="lg:pt-10 pb-15 lg:pb-30">
            {/* PC 제목 */}
            {showTitle && (
                <div className="max-lg:hidden max-lg:px-4">
                    <h2 className="text-2xl font-semibold">{title}</h2>
                </div>
            )}

            <div className="max-lg:p-4 max-lg:mt-2 mt-6">
                {/* 적립금 요약 */}
                <CreditSummaryCard creditSummary={creditSummary} />

                {/* 기간 필터 */}
                <PeriodFilter
                    options={periodOptions}
                    activePeriod={activePeriod}
                    onPeriodClick={handlePeriodClick}
                />

                {/* 적립금 내역 */}
                <CreditHistoryList history={creditHistory} />

                {/* 안내사항 */}
                <NoticeList notices={notices} />
            </div>
        </div>
    );
}

// 적립금 요약 카드
function CreditSummaryCard({ creditSummary }: { creditSummary: CreditSummary }) {
    return (
        <div className="max-lg:py-6 p-4 space-y-2 bg-accent text-white max-lg:rounded max-lg:bg-gradient-to-b max-lg:from-[#9a6cff] max-lg:via-[#7a3bd6] max-lg:to-[#640faf]">
            <div className="flex items-center justify-between">
                <p className="font-semibold flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs font-bold">
                        ₩
                    </span>
                    <span>나의 적립금</span>
                </p>
                <p className="text-lg font-bold">{formatCurrency(creditSummary.totalAmount)}</p>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold">
                <p>당월 소멸예정 적립금</p>
                <p>{formatCurrency(creditSummary.expiringAmount)}</p>
            </div>
        </div>
    );
}

// 기간 필터
function PeriodFilter({ 
    options, 
    activePeriod, 
    onPeriodClick 
}: { 
    options: PeriodOption[];
    activePeriod: string;
    onPeriodClick: (period: string) => void;
}) {
    return (
        <div className="grid grid-cols-4 mt-6 mb-4 border border-border">
            {options.map((option, index) => (
                <button
                    key={option.value}
                    type="button"
                    className={`py-2 lg:py-3 text-sm font-semibold border-r border-border last:border-r-0 transition-colors ${
                        activePeriod === option.value
                            ? 'bg-white text-accent'
                            : 'bg-border/25 hover:bg-border/50'
                    }`}
                    onClick={() => onPeriodClick(option.value)}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

// 적립금 내역 리스트
function CreditHistoryList({ history }: { history: CreditHistoryItem[] }) {
    return (
        <div className="border border-border bg-white">
            <ul className="divide-y divide-border">
                {history.map((item, index) => (
                    <li key={index} className="max-lg:py-3 p-4 text-xs lg:text-sm flex items-center justify-between gap-2 lg:gap-3">
                        {/* 날짜 */}
                        <div className="w-[75px] lg:w-[100px] text-description">
                            {item.date}
                        </div>
                        
                        {/* 내용 */}
                        <div className="flex-1 flex items-start lg:items-center flex-col lg:flex-row gap-x-2 min-w-0 truncate">
                            <p className="max-lg:text-sm">{item.type}</p>
                            {item.description && (
                                <p className="text-xs text-description">{item.description}</p>
                            )}
                        </div>
                        
                        {/* 금액 */}
                        <div className={`shrink-0 font-bold ${item.isPositive ? 'text-black' : 'text-discount'}`}>
                            {formatAmount(item.amount, item.isPositive)}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// 안내사항
function NoticeList({ notices }: { notices: string[] }) {
    return (
        <ul className="list-disc list-outside pl-4 mt-10 lg:mt-6 text-xs text-description space-y-1 lg:space-y-2">
            {notices.map((notice, index) => (
                <li key={index}>{notice}</li>
            ))}
        </ul>
    );
}