import React, { useState, useEffect } from 'react';

// Tailwind CDN 자동 로드
const loadTailwindCSS = () => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.tailwindcss.com';
        script.async = true;
        document.head.appendChild(script);

        // Tailwind 설정
        script.onload = () => {
            if (window.tailwind) {
                window.tailwind.config = {
                    theme: {
                        extend: {
                            colors: {
                                'accent': '#640faf',
                                'border': '#e5e5e5',
                                'description': '#666',
                                'discount': '#FF5757',
                                'black': '#000000',
                                'white': '#FFFFFF'
                            },
                            spacing: {
                                '15': '3.75rem',
                                '30': '7.5rem'
                            }
                        }
                    }
                };
            }
        };
    }
};

// 화살표 아이콘 컴포넌트
const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={className}>
        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z"/>
    </svg>
);

// 체크박스 컴포넌트
const Checkbox = ({ 
    checked, 
    onChange, 
    label, 
    required, 
    className = '' 
}: { 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
    label: string; 
    required?: boolean;
    className?: string;
}) => (
    <label className={`group/poj2-checkbox flex items-center cursor-pointer ${className}`}>
        <input 
            className="sr-only" 
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`border-1 rounded flex items-center justify-center transition-colors ${checked ? 'bg-accent border-accent' : 'bg-white border-border'} group-hover/poj2-checkbox:border-accent cursor-pointer w-5 h-5`}>
            {checked && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )}
        </div>
        <span className={`ml-2 text-sm ${checked ? 'text-accent' : 'text-black'} group-hover/poj2-checkbox:text-accent ${required ? 'text-base font-semibold' : 'text-sm'}`}>
            {label}
        </span>
    </label>
);

const SignupComponent = () => {
    // Tailwind CSS 로드
    useEffect(() => {
        loadTailwindCSS();
    }, []);

    // 폼 데이터 상태
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        birthDate: '',
        phone: '',
        referralCode: '',
        email: '',
        emailDomain: '직접입력'
    });

    // 약관 동의 상태
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
        personalService: false,
        marketing: false,
        marketingEmail: false,
        marketingSMS: false,
        marketingPhone: false,
        nightMarketing: false,
        nightMarketingSMS: false,
        nightMarketingPhone: false
    });

    // 전체 동의 처리
    const handleAllAgree = (checked: boolean) => {
        setAgreements({
            all: checked,
            terms: checked,
            privacy: checked,
            personalService: checked,
            marketing: checked,
            marketingEmail: checked,
            marketingSMS: checked,
            marketingPhone: checked,
            nightMarketing: checked,
            nightMarketingSMS: checked,
            nightMarketingPhone: checked
        });
    };

    // 마케팅 동의 처리
    const handleMarketingAgree = (checked: boolean) => {
        setAgreements(prev => ({
            ...prev,
            marketing: checked,
            marketingEmail: checked,
            marketingSMS: checked,
            marketingPhone: checked,
            nightMarketing: checked,
            nightMarketingSMS: checked,
            nightMarketingPhone: checked
        }));
    };

    // 개별 약관 동의 처리
    useEffect(() => {
        const allChecked = agreements.terms && 
                          agreements.privacy && 
                          agreements.personalService && 
                          agreements.marketing;
        
        if (agreements.all !== allChecked) {
            setAgreements(prev => ({ ...prev, all: allChecked }));
        }
    }, [agreements.terms, agreements.privacy, agreements.personalService, agreements.marketing]);

    // 아이디 중복 확인
    const handleIdCheck = () => {
        console.log('ID duplicate check:', formData.id);
        alert('아이디 중복 확인');
    };

    // 회원가입 완료
    const handleSignup = () => {
        // 필수 항목 검증
        if (!formData.id || !formData.password || !formData.confirmPassword || 
            !formData.name || !formData.birthDate || !formData.phone || !formData.email) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!agreements.terms || !agreements.privacy) {
            alert('필수 약관에 동의해주세요.');
            return;
        }

        console.log('Signup attempt:', {
            ...formData,
            agreements
        });
        
        alert('회원가입이 완료되었습니다.');
    };

    return (
        <div className="max-w-[600px] mx-auto mb-15 lg:mb-30 bg-white px-4">
            <div className="w-full">
                <div className="mt-8 mb-8 lg:mt-14 lg:mb-10 border-b border-border">
                    <h1 className="text-xl lg:text-2xl font-semibold">회원가입</h1>
                    <div className="mt-2 w-full h-px bg-border"></div>
                </div>

                {/* 필수입력정보 */}
                <div className="mb-10 lg:mb-12">
                    <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">필수입력정보</h2>
                    <div className="space-y-2">
                        {/* 아이디 */}
                        <div>
                            <div className="flex gap-2">
                                <label htmlFor="id" className="sr-only">아이디</label>
                                <input 
                                    id="id"
                                    placeholder="아이디 영문, 숫자 조합 6~12자"
                                    className="flex-1 px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                    type="text"
                                    value={formData.id}
                                    onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                                />
                            </div>
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <label htmlFor="password" className="sr-only">비밀번호</label>
                            <input 
                                id="password"
                                placeholder="비밀번호 영문, 숫자, 특수문자 조합 8~12자"
                                className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            />
                        </div>

                        {/* 비밀번호 확인 */}
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">비밀번호 확인</label>
                            <input 
                                id="confirmPassword"
                                placeholder="비밀번호 다시 입력"
                                className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                        </div>

                        {/* 이름 */}
                        <div>
                            <label htmlFor="name" className="sr-only">이름</label>
                            <input 
                                id="name"
                                placeholder="이름"
                                className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        {/* 생년월일 */}
                        <div>
                            <label htmlFor="birthDate" className="sr-only">생년월일</label>
                            <input 
                                id="birthDate"
                                placeholder="생년월일 예:19870101"
                                className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                type="text"
                                value={formData.birthDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                            />
                        </div>

                        {/* 휴대폰 번호 */}
                        <div>
                            <label htmlFor="phone" className="sr-only">휴대폰 번호</label>
                            <input 
                                id="phone"
                                placeholder="휴대폰 번호 -없이 입력"
                                className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>

                        {/* 추천인 코드 */}
                        <div>
                            <label htmlFor="referralCode" className="sr-only">추천인 코드</label>
                            <input
                                id="referralCode"
                                placeholder="추천인 코드 입력"
                                className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                type="text"
                                value={formData.referralCode}
                                onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value }))}
                            />
                        </div>
                        {/* 이메일 */}
                        <div>
                            <label htmlFor="email" className="sr-only">이메일</label>
                            <div className="flex gap-2">
                                <input 
                                    id="email"
                                    placeholder="이메일"
                                    className="flex-1 px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                    type="text"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                />
                                <select 
                                    className="w-[150px] px-4 lg:px-5 py-3 text-sm appearance-none lg:text-base border border-border transition-colors focus:outline-none focus:border-accent bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_10px]"
                                    value={formData.emailDomain}
                                    onChange={(e) => setFormData(prev => ({ ...prev, emailDomain: e.target.value }))}
                                >
                                    <option value="직접입력">직접입력</option>
                                    <option value="gmail.com">gmail.com</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="hanmail.net">hanmail.net</option>
                                    <option value="nate.com">nate.com</option>
                                    <option value="yahoo.com">yahoo.com</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 약관동의 */}
                <div className="mb-10 lg:mb-12">
                    <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">약관동의</h2>
                    <div className="space-y-3">
                        {/* 전체 동의 */}
                        <div className="pb-3 border-b border-gray-200">
                            <Checkbox 
                                checked={agreements.all}
                                onChange={handleAllAgree}
                                label="전체 동의"
                                required
                            />
                            <p className="text-xs text-description mt-2 ml-7">
                                전체 동의시 필수 및 선택 항목 모두에 대해 동의한 것으로 처리되며, 선택 항목 동의를 거부하시더라도 서비스 이용이 가능합니다.
                            </p>
                        </div>

                        {/* 이용약관 동의 */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    checked={agreements.terms}
                                    onChange={(checked) => setAgreements(prev => ({ ...prev, terms: checked }))}
                                    label="이용약관 동의"
                                />
                                <span className="text-xs text-accent">필수</span>
                            </div>
                            <button type="button">
                                <ChevronRightIcon className="w-5 h-5 fill-description" />
                            </button>
                        </div>

                        {/* 개인정보수집 및 이용 동의 */}
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                checked={agreements.privacy}
                                onChange={(checked) => setAgreements(prev => ({ ...prev, privacy: checked }))}
                                label="개인정보수집 및 이용 동의"
                            />
                            <span className="text-xs text-accent">필수</span>
                        </div>

                        {/* 개인 맞춤형 서비스 활용 동의 */}
                        <div className="flex items-center gap-2">
                            <Checkbox 
                                checked={agreements.personalService}
                                onChange={(checked) => setAgreements(prev => ({ ...prev, personalService: checked }))}
                                label="개인 맞춤형 서비스 활용 동의"
                            />
                            <span className="text-xs text-description">선택</span>
                        </div>

                        {/* 마케팅 활용 동의 */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Checkbox 
                                    checked={agreements.marketing}
                                    onChange={handleMarketingAgree}
                                    label="마케팅 활용 동의"
                                />
                                <span className="text-xs text-description">선택</span>
                            </div>
                            <div className="ml-7 space-y-2 bg-border/15 rounded-md p-4">
                                <p className="text-xs text-description">
                                    <span className="font-semibold">마케팅 정보 (광고) 수신 동의</span> 선택
                                </p>
                                <div className="flex items-center gap-6">
                                    <Checkbox 
                                        checked={agreements.marketingEmail}
                                        onChange={(checked) => setAgreements(prev => ({ ...prev, marketingEmail: checked }))}
                                        label="이메일"
                                        className="text-xs"
                                    />
                                    <Checkbox 
                                        checked={agreements.marketingSMS}
                                        onChange={(checked) => setAgreements(prev => ({ ...prev, marketingSMS: checked }))}
                                        label="SMS"
                                        className="text-xs"
                                    />
                                    <Checkbox 
                                        checked={agreements.marketingPhone}
                                        onChange={(checked) => setAgreements(prev => ({ ...prev, marketingPhone: checked }))}
                                        label="전화"
                                        className="text-xs"
                                    />
                                </div>
                                <p className="text-xs text-description">
                                    모든 항목 수신 동의 시 1천원 쇼핑플러스 쿠폰이 지급됩니다.<br/>
                                    다운로드 후 1주일/3만원 이상 구매시 사용가능/일부상품제외
                                </p>
                                <p className="text-xs text-description">
                                    <span className="font-semibold">심야 마케팅 정보 (광고) 수신 동의 (21~08시)</span> 선택
                                </p>
                                <div className="flex items-center gap-6">
                                    <Checkbox 
                                        checked={agreements.nightMarketingSMS}
                                        onChange={(checked) => setAgreements(prev => ({ ...prev, nightMarketingSMS: checked }))}
                                        label="SMS"
                                        className="text-xs"
                                    />
                                    <Checkbox 
                                        checked={agreements.nightMarketingPhone}
                                        onChange={(checked) => setAgreements(prev => ({ ...prev, nightMarketingPhone: checked }))}
                                        label="전화"
                                        className="text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 개인정보 수집·이용에 대한 안내 */}
                <div className="mb-10 lg:mb-12">
                    <h2 className="text-sm lg:text-base font-semibold mb-2">개인정보 수집·이용에 대한 안내</h2>
                    <div>
                        <table className="w-full text-xs border border-border overflow-hidden">
                            <colgroup>
                                <col style={{ width: '25%' }} />
                                <col style={{ width: '25%' }} />
                                <col style={{ width: '25%' }} />
                                <col style={{ width: '25%' }} />
                            </colgroup>
                            <thead>
                                <tr className="border-b border-border divide-x divide-border">
                                    <th className="px-3 lg:px-4 py-1 bg-border/25">구분</th>
                                    <th className="px-3 lg:px-4 py-1 bg-border/25">목적</th>
                                    <th className="px-3 lg:px-4 py-1 bg-border/25">필수 항목</th>
                                    <th className="px-3 lg:px-4 py-1 bg-border/25">보유기간</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-border divide-x divide-border">
                                    <td className="px-3 lg:px-4 py-1 bg-border/25" rowSpan={3}>통합/간편회원</td>
                                    <td className="px-3 lg:px-4 py-1 font-semibold">회원계정의 생성</td>
                                    <td className="px-3 lg:px-4 py-1"> ID, 비밀번호</td>
                                    <td className="px-3 lg:px-4 py-1 font-semibold">회원 탈퇴 후 1개월까지</td>
                                </tr>
                                <tr className="border-b border-border divide-x divide-border">
                                    <td className="px-3 lg:px-4 py-1 font-semibold">중복가입 확인, 고지의 전달, 의사소통 경로의 확보</td>
                                    <td className="px-3 lg:px-4 py-1">이름, 휴대폰번호, 생년월일, 이메일 주소</td>
                                    <td className="px-3 lg:px-4 py-1 font-semibold">회원 탈퇴 후 1개월까지</td>
                                </tr>
                                <tr className="border-b border-border divide-x divide-border">
                                    <td className="px-3 lg:px-4 py-1 font-semibold">서비스 이용에 대한 분석 및 통계에 따른 개인별 서비스 개선, 고객 의사소통 능력 향상</td>
                                    <td className="px-3 lg:px-4 py-1">IP주소, 서비스 이용기록, 접속로그, 쿠키, 접속기기 정보(디바이스 ID, 광고식별자, 모델명, 기기번호, OS), 네트워크 연결정보</td>
                                    <td className="px-3 lg:px-4 py-1 font-semibold">회원 탈퇴 후 1개월까지</td>
                                </tr>
                                <tr className="border-b border-border divide-x divide-border">
                                    <td className="px-3 lg:px-4 py-1 bg-border/25" rowSpan={2}>TV 고객</td>
                                    <td className="px-3 lg:px-4 py-1 font-semibold">회원계정의 생성</td>
                                    <td className="px-3 lg:px-4 py-1"> ID, 비밀번호</td>
                                    <td className="px-3 lg:px-4 py-1 font-semibold">회원 탈퇴 후 1개월까지</td>
                                </tr>
                                <tr className="border-b border-border divide-x divide-border">
                                    <td className="px-3 lg:px-4 py-1 font-semibold">중복가입 확인</td>
                                    <td className="px-3 lg:px-4 py-1"> CI(연계정보)</td>
                                    <td className="px-3 lg:px-4 py-1 font-semibold">회원 탈퇴 후 1개월까지</td>
                                </tr>
                            </tbody>
                        </table>
                        <ul className="mt-2 text-xs text-description list-disc list-outside pl-4">
                            <li>필수로 수집되는 개인정보는 서비스 이용에 필요한 최소한의 정보로 동의를 해주셔야만 서비스를 이용하실 수 있습니다.</li>
                            <li>선택적으로 수집되는 정보에 대한 동의는 거부하실 수 있으며, 거부하시더라도 회원가입, 상품주문 등 기본 서비스 이용에는 제한을 받지 않습니다.</li>
                        </ul>
                    </div>
                </div>

                {/* 가입완료 버튼 */}
                <div>
                    <div className="mb-8 lg:mb-10">
                        <p className="text-sm font-semibold text-accent mb-4">
                            CJ ENM 이용약관 및 개인정보 동의 내용을 확인하였으며, 위 내용에 동의합니다. 만 14세 미만 아동은 회원가입이 제한됩니다.
                        </p>
                    </div>
                    <button 
                        type="button"
                        onClick={handleSignup}
                        className="w-full bg-accent text-white font-semibold py-3 text-lg rounded-md hover:bg-accent/90 transition-colors"
                    >
                        가입완료
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupComponent;