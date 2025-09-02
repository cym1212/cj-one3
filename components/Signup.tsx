import React, { useEffect } from 'react';

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
    disabled,
    className = '' 
}: { 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
    label: string; 
    required?: boolean;
    disabled?: boolean;
    className?: string;
}) => (
    <label className={`group/poj2-checkbox flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        <input 
            className="sr-only" 
            type="checkbox"
            checked={checked}
            onChange={(e) => !disabled && onChange(e.target.checked)}
            disabled={disabled}
        />
        <div className={`border-1 rounded flex items-center justify-center transition-colors ${checked ? 'bg-accent border-accent' : 'bg-white border-border'} group-hover/poj2-checkbox:border-accent cursor-pointer w-5 h-5 ${className.includes('text-xs') ? 'w-4 h-4' : ''}`}>
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

const SignupComponent = (props: any) => {
    // Props 구조 분해
    const {
        data = {},
        actions = {},
        utils = {},
        app = {},
        mode = 'production',
        options = {},
        editor = {}
    } = props || {};

    // Data 추출
    const {
        formData = {
            user_id: '',
            password: '',
            password_confirm: '',
            name: '',
            birth_date: '',
            phone: '',
            email: '',
            email_domain: '직접입력',
            referral_code: '',
            referral_code_from_url: false
        },
        validationErrors = {},
        loading = false,
        signupSuccess = false,
        signupError = null,
        agreements = {
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
        },
        basicFields = {},
        theme = {},
        withcookieData = {},
        isEditor = false,
        isPreview = false
    } = data;

    // Actions 추출 - 웹빌더가 제공하지 않을 경우를 대비한 기본 함수들
    const {
        handleChange = (e: any) => {
            console.log('handleChange:', e.target.name, e.target.value);
        },
        handleSubmit = (e: any) => {
            e.preventDefault();
            console.log('Signup attempt:', formData, agreements);
            alert('회원가입이 완료되었습니다.');
        },
        handleIdCheck = () => {
            console.log('ID duplicate check:', formData.user_id);
            alert('아이디 중복 확인');
        },
        handleAgreementChange = (field: string, checked: boolean) => {
            console.log('Agreement change:', field, checked);
            // 로컬 state 업데이트
            if (agreements.all === undefined) {
                setLocalAgreements(prev => ({
                    ...prev,
                    [field]: checked
                }));
            }
        },
        handleAllAgree = (checked: boolean) => {
            console.log('All agree:', checked);
            // 로컬 state 업데이트
            if (agreements.all === undefined) {
                setLocalAgreements({
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
            }
        },
        handleMarketingAgree = (checked: boolean) => {
            console.log('Marketing agree:', checked);
            // 로컬 state 업데이트
            if (agreements.all === undefined) {
                setLocalAgreements(prev => ({
                    ...prev,
                    marketing: checked,
                    marketingEmail: checked,
                    marketingSMS: checked,
                    marketingPhone: checked,
                    nightMarketing: checked,
                    nightMarketingSMS: checked,
                    nightMarketingPhone: checked
                }));
            }
        }
    } = actions;

    // Utils 추출
    const {
        t = (key: string) => key,
        navigate = (path: string) => { 
            console.log('Navigate to:', path);
            window.location.href = path; 
        },
        getAssetUrl = (path: string) => path,
        cx = (...classes: any[]) => classes.filter(Boolean).join(' ')
    } = utils;

    // 로컬 state for checkboxes (웹빌더가 제공하지 않을 경우 사용)
    const [localAgreements, setLocalAgreements] = React.useState({
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

    // 실제 사용할 agreements (웹빌더 제공 시 웹빌더 것 사용, 아니면 로컬 사용)
    const actualAgreements = (agreements.all !== undefined) ? agreements : localAgreements;

    // Tailwind CSS 로드
    useEffect(() => {
        loadTailwindCSS();
        // 디버깅용 로그
        console.log('basicFields:', basicFields);
        console.log('formData:', formData);
    }, []);

    // 회원가입 성공 처리
    if (signupSuccess && !isEditor && !isPreview) {
        return (
            <div className="text-center py-8">
                <p className="text-lg font-semibold mb-4">{t('회원가입이 완료되었습니다.')}</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
                >
                    {t('로그인하기')}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[600px] mx-auto mb-15 lg:mb-30 bg-white px-4">
            <form onSubmit={handleSubmit}>
                <div className="w-full">
                    <div className="mt-8 mb-8 lg:mt-14 lg:mb-10 border-b border-border">
                        <h1 className="text-xl lg:text-2xl font-semibold">{t('회원가입')}</h1>
                        <div className="mt-2 w-full h-px bg-border"></div>
                    </div>

                    {/* 전체 에러 메시지 */}
                    {signupError && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {signupError}
                        </div>
                    )}

                    {/* 필수입력정보 */}
                    <div style={{ marginBottom: '40px' }}>
                        <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">{t('필수입력정보')}</h2>
                        <div className="space-y-2">
                            {/* 아이디 */}
                            {(basicFields.user_id !== false && basicFields.id !== false) && (
                                <div>
                                    <div className="flex gap-2">
                                        <label htmlFor="id" className="sr-only">{t('아이디')}</label>
                                        <input 
                                            id="id"
                                            name="user_id"
                                            placeholder={t('아이디 영문, 숫자 조합 6~12자')}
                                            className="flex-1 px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                            type="text"
                                            value={formData.user_id || ''}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        {/*<button */}
                                        {/*    type="button"*/}
                                        {/*    onClick={handleIdCheck}*/}
                                        {/*    disabled={loading || !formData.user_id}*/}
                                        {/*    className="px-4 bg-accent text-white text-sm lg:text-base rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"*/}
                                        {/*>*/}
                                        {/*    {t('중복확인')}*/}
                                        {/*</button>*/}
                                    </div>
                                    {validationErrors.user_id && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.user_id}</p>
                                    )}
                                </div>
                            )}

                            {/* 비밀번호 */}
                            {basicFields.password !== false && (
                                <div>
                                    <label htmlFor="password" className="sr-only">{t('비밀번호')}</label>
                                    <input 
                                        id="password"
                                        name="password"
                                        placeholder={t('비밀번호 영문, 숫자, 특수문자 조합 8~12자')}
                                        className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                        type="password"
                                        value={formData.password || ''}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {validationErrors.password && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                                    )}
                                </div>
                            )}

                            {/* 비밀번호 확인 */}
                            {basicFields.password !== false && (
                                <div>
                                    <label htmlFor="confirmPassword" className="sr-only">{t('비밀번호 확인')}</label>
                                    <input 
                                        id="confirmPassword"
                                        name="password_confirm"
                                        placeholder={t('비밀번호 다시 입력')}
                                        className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                        type="password"
                                        value={formData.password_confirm || ''}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {validationErrors.password_confirm && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.password_confirm}</p>
                                    )}
                                </div>
                            )}

                            {/* 이름 */}
                            {basicFields.name !== false && (
                                <div>
                                    <label htmlFor="name" className="sr-only">{t('이름')}</label>
                                    <input 
                                        id="name"
                                        name="name"
                                        placeholder={t('이름')}
                                        className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {validationErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                                    )}
                                </div>
                            )}

                            {/* 생년월일 */}
                            {(basicFields.birth_date !== false && basicFields.birthDate !== false) && (
                                <div>
                                    <label htmlFor="birthDate" className="sr-only">{t('생년월일')}</label>
                                    <input 
                                        id="birthDate"
                                        name="birth_date"
                                        placeholder={t('생년월일 예:19870101')}
                                        className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                        type="text"
                                        value={formData.birth_date || ''}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {validationErrors.birth_date && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.birth_date}</p>
                                    )}
                                </div>
                            )}

                            {/* 휴대폰 번호 */}
                            {basicFields.phone !== false && (
                                <div>
                                    <label htmlFor="phone" className="sr-only">{t('휴대폰 번호')}</label>
                                    <input 
                                        id="phone"
                                        name="phone"
                                        placeholder={t('휴대폰 번호 -없이 입력')}
                                        className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                        type="text"
                                        value={formData.phone || ''}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {validationErrors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                                    )}
                                </div>
                            )}

                            {/* 추천인 코드 */}
                            {(basicFields.referral_code !== false && basicFields.referralCode !== false) && (
                                <div>
                                    <label htmlFor="referralCode" className="sr-only">{t('추천인 코드')}</label>
                                    <input
                                        id="referralCode"
                                        name="referral_code"
                                        placeholder={t('추천인 코드 입력')}
                                        className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                        type="text"
                                        value={formData.referral_code || ''}
                                        onChange={handleChange}
                                        disabled={formData.referral_code_from_url || loading}
                                    />
                                    {validationErrors.referral_code && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.referral_code}</p>
                                    )}
                                </div>
                            )}

                            {/* 이메일 */}
                            {basicFields.email !== false && (
                                <div>
                                    <label htmlFor="email" className="sr-only">{t('이메일')}</label>
                                    <div className="flex gap-2">
                                        <input 
                                            id="email"
                                            name="email"
                                            placeholder={t('이메일')}
                                            className="flex-1 px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                                            type="text"
                                            value={formData.email || ''}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        <select
                                            name="email_domain"
                                            className="w-[150px] h-[45px] px-4 lg:px-5 text-sm appearance-none lg:text-base border border-border transition-colors focus:outline-none focus:border-accent bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_10px]"
                                            value={formData.email_domain || '직접입력'}
                                            onChange={handleChange}
                                            disabled={loading}
                                        >
                                            <option value="직접입력">{t('직접입력')}</option>
                                            <option value="gmail.com">gmail.com</option>
                                            <option value="naver.com">naver.com</option>
                                            <option value="daum.net">daum.net</option>
                                            <option value="hanmail.net">hanmail.net</option>
                                            <option value="nate.com">nate.com</option>
                                            <option value="yahoo.com">yahoo.com</option>
                                        </select>
                                    </div>
                                    {validationErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 약관동의 */}
                    <div style={{ marginBottom: '40px' }}>
                        <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">{t('약관동의')}</h2>
                        <div className="space-y-3">
                            {/* 전체 동의 */}
                            <div className="pb-3 border-b border-gray-200">
                                <Checkbox 
                                    checked={actualAgreements.all}
                                    onChange={handleAllAgree}
                                    label={t('전체 동의')}
                                    required
                                    disabled={loading}
                                />
                                <p className="text-xs text-description mt-2 ml-7">
                                    {t('전체 동의시 필수 및 선택 항목 모두에 대해 동의한 것으로 처리되며, 선택 항목 동의를 거부하시더라도 서비스 이용이 가능합니다.')}
                                </p>
                            </div>

                            {/* 이용약관 동의 */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox 
                                        checked={actualAgreements.terms}
                                        onChange={(checked) => handleAgreementChange('terms', checked)}
                                        label={t('이용약관 동의')}
                                        disabled={loading}
                                    />
                                    <span className="text-xs text-accent">{t('필수')}</span>
                                </div>
                                <button type="button">
                                    <ChevronRightIcon className="w-5 h-5 fill-description" />
                                </button>
                            </div>

                            {/* 개인정보수집 및 이용 동의 */}
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    checked={actualAgreements.privacy}
                                    onChange={(checked) => handleAgreementChange('privacy', checked)}
                                    label={t('개인정보수집 및 이용 동의')}
                                    disabled={loading}
                                />
                                <span className="text-xs text-accent">{t('필수')}</span>
                            </div>

                            {/* 개인 맞춤형 서비스 활용 동의 */}
                            <div className="flex items-center gap-2">
                                <Checkbox 
                                    checked={actualAgreements.personalService}
                                    onChange={(checked) => handleAgreementChange('personalService', checked)}
                                    label={t('개인 맞춤형 서비스 활용 동의')}
                                    disabled={loading}
                                />
                                <span className="text-xs text-description">{t('선택')}</span>
                            </div>

                            {/* 마케팅 활용 동의 */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Checkbox 
                                        checked={actualAgreements.marketing}
                                        onChange={handleMarketingAgree}
                                        label={t('마케팅 활용 동의')}
                                        disabled={loading}
                                    />
                                    <span className="text-xs text-description">{t('선택')}</span>
                                </div>
                                <div className="ml-7 space-y-2 bg-border/15 rounded-md p-4">
                                    <p className="text-xs text-description">
                                        <span className="font-semibold">{t('마케팅 정보 (광고) 수신 동의')}</span> {t('선택')}
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <Checkbox 
                                            checked={actualAgreements.marketingEmail}
                                            onChange={(checked) => handleAgreementChange('marketingEmail', checked)}
                                            label={t('이메일')}
                                            className="text-xs"
                                            disabled={loading}
                                        />
                                        <Checkbox 
                                            checked={actualAgreements.marketingSMS}
                                            onChange={(checked) => handleAgreementChange('marketingSMS', checked)}
                                            label={t('SMS')}
                                            className="text-xs"
                                            disabled={loading}
                                        />
                                        <Checkbox 
                                            checked={actualAgreements.marketingPhone}
                                            onChange={(checked) => handleAgreementChange('marketingPhone', checked)}
                                            label={t('전화')}
                                            className="text-xs"
                                            disabled={loading}
                                        />
                                    </div>
                                    <p className="text-xs text-description">
                                        {t('모든 항목 수신 동의 시 1천원 쇼핑플러스 쿠폰이 지급됩니다.')}<br/>
                                        {t('다운로드 후 1주일/3만원 이상 구매시 사용가능/일부상품제외')}
                                    </p>
                                    <p className="text-xs text-description">
                                        <span className="font-semibold">{t('심야 마케팅 정보 (광고) 수신 동의 (21~08시)')}</span> {t('선택')}
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <Checkbox 
                                            checked={actualAgreements.nightMarketingSMS}
                                            onChange={(checked) => handleAgreementChange('nightMarketingSMS', checked)}
                                            label={t('SMS')}
                                            className="text-xs"
                                            disabled={loading}
                                        />
                                        <Checkbox 
                                            checked={actualAgreements.nightMarketingPhone}
                                            onChange={(checked) => handleAgreementChange('nightMarketingPhone', checked)}
                                            label={t('전화')}
                                            className="text-xs"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 개인정보 수집·이용에 대한 안내 */}
                    <div style={{ marginBottom: '40px' }}>
                        <h2 className="text-sm lg:text-base font-semibold mb-2">{t('개인정보 수집·이용에 대한 안내')}</h2>
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
                                        <th className="px-3 lg:px-4 py-1 bg-border/25">{t('구분')}</th>
                                        <th className="px-3 lg:px-4 py-1 bg-border/25">{t('목적')}</th>
                                        <th className="px-3 lg:px-4 py-1 bg-border/25">{t('필수 항목')}</th>
                                        <th className="px-3 lg:px-4 py-1 bg-border/25">{t('보유기간')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border divide-x divide-border">
                                        <td className="px-3 lg:px-4 py-1 bg-border/25" rowSpan={3}>{t('통합/간편회원')}</td>
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('회원계정의 생성')}</td>
                                        <td className="px-3 lg:px-4 py-1">{t('ID, 비밀번호')}</td>
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('회원 탈퇴 후 1개월까지')}</td>
                                    </tr>
                                    <tr className="border-b border-border divide-x divide-border">
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('중복가입 확인, 고지의 전달, 의사소통 경로의 확보')}</td>
                                        <td className="px-3 lg:px-4 py-1">{t('이름, 휴대폰번호, 생년월일, 이메일 주소')}</td>
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('회원 탈퇴 후 1개월까지')}</td>
                                    </tr>
                                    <tr className="border-b border-border divide-x divide-border">
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('서비스 이용에 대한 분석 및 통계에 따른 개인별 서비스 개선, 고객 의사소통 능력 향상')}</td>
                                        <td className="px-3 lg:px-4 py-1">{t('IP주소, 서비스 이용기록, 접속로그, 쿠키, 접속기기 정보(디바이스 ID, 광고식별자, 모델명, 기기번호, OS), 네트워크 연결정보')}</td>
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('회원 탈퇴 후 1개월까지')}</td>
                                    </tr>
                                    <tr className="border-b border-border divide-x divide-border">
                                        <td className="px-3 lg:px-4 py-1 bg-border/25" rowSpan={2}>{t('TV 고객')}</td>
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('회원계정의 생성')}</td>
                                        <td className="px-3 lg:px-4 py-1">{t('ID, 비밀번호')}</td>
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('회원 탈퇴 후 1개월까지')}</td>
                                    </tr>
                                    <tr className="border-b border-border divide-x divide-border">
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('중복가입 확인')}</td>
                                        <td className="px-3 lg:px-4 py-1">{t('CI(연계정보)')}</td>
                                        <td className="px-3 lg:px-4 py-1 font-semibold">{t('회원 탈퇴 후 1개월까지')}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <ul className="mt-2 text-xs text-description list-disc list-outside pl-4">
                                <li>{t('필수로 수집되는 개인정보는 서비스 이용에 필요한 최소한의 정보로 동의를 해주셔야만 서비스를 이용하실 수 있습니다.')}</li>
                                <li>{t('선택적으로 수집되는 정보에 대한 동의는 거부하실 수 있으며, 거부하시더라도 회원가입, 상품주문 등 기본 서비스 이용에는 제한을 받지 않습니다.')}</li>
                            </ul>
                        </div>
                    </div>

                    {/* 가입완료 버튼 */}
                    <div>
                        <div className="mb-8 lg:mb-10">
                            <p className="text-sm font-semibold text-accent mb-4">
                                {t('CJ ENM 이용약관 및 개인정보 동의 내용을 확인하였으며, 위 내용에 동의합니다. 만 14세 미만 아동은 회원가입이 제한됩니다.')}
                            </p>
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-white font-semibold py-3 text-lg rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('처리 중...') : t('가입완료')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SignupComponent;