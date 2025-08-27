import { useState } from 'react';
import { useNavigate } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { Checkbox } from '@/components/ui/Checkbox';

export function meta() {
    return [
        {
            title: '회원가입 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 회원가입 페이지',
        },
    ];
}

interface FormData {
    id: string;
    password: string;
    confirmPassword: string;
    name: string;
    email: string;
    emailDomain: string;
    phone: string;
    birthDate: string;
}

interface FormErrors {
    id: string;
    password: string;
    confirmPassword: string;
    name: string;
    email: string;
    phone: string;
    birthDate: string;
}

interface AgreementState {
    allAgreed: boolean;
    required: {
        terms: boolean;
        privacy: boolean;
    };
    optional: {
        personalized: boolean;
        marketing: boolean;
        sms: boolean;
        email: boolean;
        phone: boolean;
        nightSms: boolean;
        nightPhone: boolean;
    };
}

interface AgreementErrors {
    required: string;
}

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        emailDomain: '직접입력',
        phone: '',
        birthDate: '',
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({
        id: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        phone: '',
        birthDate: '',
    });

    const [agreements, setAgreements] = useState<AgreementState>({
        allAgreed: false,
        required: {
            terms: false,
            privacy: false,
        },
        optional: {
            personalized: false,
            marketing: false,
            sms: false,
            email: false,
            phone: false,
            nightSms: false,
            nightPhone: false,
        },
    });

    const [agreementErrors, setAgreementErrors] = useState<AgreementErrors>({
        required: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (formErrors[field as keyof FormErrors]) {
            setFormErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const handleAgreementChange = (category: 'required' | 'optional', field: string, checked: boolean) => {
        setAgreements((prev) => {
            const newAgreements = {
                ...prev,
                [category]: {
                    ...prev[category],
                    [field]: checked,
                },
            };

            // 마케팅 활용 동의가 체크/체크해제될 때 하위 항목들도 같이 처리
            if (category === 'optional' && field === 'marketing') {
                newAgreements.optional.email = checked;
                newAgreements.optional.sms = checked;
                newAgreements.optional.phone = checked;
                newAgreements.optional.nightSms = checked;
                newAgreements.optional.nightPhone = checked;
            }

            // 마케팅 하위 항목들이 변경될 때 마케팅 동의 상태도 업데이트
            if (category === 'optional' && ['email', 'sms', 'phone', 'nightSms', 'nightPhone'].includes(field)) {
                const marketingSubItems = [newAgreements.optional.email, newAgreements.optional.sms, newAgreements.optional.phone, newAgreements.optional.nightSms, newAgreements.optional.nightPhone];
                // 모든 마케팅 하위 항목이 체크되어 있으면 마케팅 동의도 체크
                newAgreements.optional.marketing = marketingSubItems.every(Boolean);
            }

            // 전체 동의 상태 업데이트
            const allRequiredChecked = Object.values(newAgreements.required).every(Boolean);
            const allOptionalChecked = Object.values(newAgreements.optional).every(Boolean);
            newAgreements.allAgreed = allRequiredChecked && allOptionalChecked;

            return newAgreements;
        });

        // 필수 약관 동의 시 에러 메시지 제거
        if (category === 'required' && checked) {
            setAgreementErrors((prev) => ({
                ...prev,
                required: '',
            }));
        }
    };

    const handleAllAgreementChange = (checked: boolean) => {
        setAgreements({
            allAgreed: checked,
            required: {
                terms: checked,
                privacy: checked,
            },
            optional: {
                personalized: checked,
                marketing: checked,
                sms: checked,
                email: checked,
                phone: checked,
                nightSms: checked,
                nightPhone: checked,
            },
        });

        // 전체 동의 시 에러 메시지 제거
        if (checked) {
            setAgreementErrors({
                required: '',
            });
        }
    };

    const checkIdDuplicate = () => {
        if (!formData.id) return;
        console.log('아이디 중복 체크:', formData.id);
    };

    const validateForm = () => {
        const newErrors: FormErrors = {
            id: '',
            password: '',
            confirmPassword: '',
            name: '',
            email: '',
            phone: '',
            birthDate: '',
        };

        // 필수 약관 동의 체크
        if (!agreements.required.terms || !agreements.required.privacy) {
            setAgreementErrors({
                required: '필수 약관에 모두 동의해주세요.',
            });
            return false;
        }

        // 아이디 유효성 검사 (영문, 숫자 조합 6~12자)
        if (!formData.id) {
            newErrors.id = '아이디를 입력해주세요.';
        } else if (formData.id.length < 6 || formData.id.length > 12) {
            newErrors.id = '아이디는 6~12자로 입력해주세요.';
        } else if (!/^[a-zA-Z0-9]+$/.test(formData.id)) {
            newErrors.id = '아이디는 영문, 숫자 조합으로 입력해주세요.';
        }

        // 비밀번호 유효성 검사 (영문, 숫자, 특수문자 조합 8~12자)
        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요.';
        } else if (formData.password.length < 8 || formData.password.length > 12) {
            newErrors.password = '비밀번호는 8~12자로 입력해주세요.';
        } else {
            const hasLetter = /[a-zA-Z]/.test(formData.password);
            const hasNumber = /[0-9]/.test(formData.password);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password);

            if (!hasLetter || !hasNumber || !hasSpecialChar) {
                newErrors.password = '영문, 숫자, 특수문자를 모두 포함해야 합니다.';
            }
        }

        // 비밀번호 확인
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        // 이름 유효성 검사
        if (!formData.name) {
            newErrors.name = '이름을 입력해주세요.';
        } else if (formData.name.length < 2) {
            newErrors.name = '이름은 2자 이상 입력해주세요.';
        } else if (!/^[가-힣a-zA-Z]+$/.test(formData.name)) {
            newErrors.name = '이름은 한글 또는 영문으로만 입력해주세요.';
        }

        // 생년월일 유효성 검사 (예: 19870101)
        if (!formData.birthDate) {
            newErrors.birthDate = '생년월일을 입력해주세요.';
        } else if (formData.birthDate.length !== 8) {
            newErrors.birthDate = '생년월일 8자리를 입력해주세요.';
        } else if (!/^\d{8}$/.test(formData.birthDate)) {
            newErrors.birthDate = '생년월일은 숫자만 입력해주세요.';
        } else {
            const year = parseInt(formData.birthDate.substring(0, 4));
            const month = parseInt(formData.birthDate.substring(4, 6));
            const day = parseInt(formData.birthDate.substring(6, 8));
            const currentYear = new Date().getFullYear();

            if (year < 1900 || year > currentYear) {
                newErrors.birthDate = '올바른 연도를 입력해주세요.';
            } else if (month < 1 || month > 12) {
                newErrors.birthDate = '올바른 월을 입력해주세요.';
            } else if (day < 1 || day > 31) {
                newErrors.birthDate = '올바른 일을 입력해주세요.';
            }
        }

        // 휴대폰 번호 유효성 검사 (-없이 입력)
        if (!formData.phone) {
            newErrors.phone = '휴대폰 번호를 입력해주세요.';
        } else if (!/^010\d{8}$/.test(formData.phone)) {
            newErrors.phone = '010으로 시작하는 11자리 번호를 입력해주세요.';
        }

        // 이메일 유효성 검사
        if (!formData.email) {
            newErrors.email = '이메일을 입력해주세요.';
        } else if (formData.emailDomain === '직접입력') {
            // 직접입력인 경우 전체 이메일 형식 검사
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = '올바른 이메일 형식을 입력해주세요.';
            }
        } else {
            // 도메인 선택인 경우 @ 앞부분만 검사
            if (!/^[^\s@]+$/.test(formData.email) || formData.email.includes('@')) {
                newErrors.email = '이메일 주소를 정확히 입력해주세요.';
            }
        }

        setFormErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('회원가입 처리:', formData);
            navigate('/register-result');
        }
    };

    return (
        <QuickMenuContents>
            <div className="max-w-[600px] mx-auto mb-15 lg:mb-30 bg-white px-4">
                <div className="w-full">
                    {/* 타이틀 */}
                    <div className="mt-8 mb-8 lg:mt-14 lg:mb-10 border-b border-border">
                        <h1 className="text-xl lg:text-2xl font-semibold">회원가입</h1>
                        <div className="mt-2 w-full h-px bg-border" />
                    </div>

                    {/* 사용자 입력 폼 */}
                    <UserInputForm
                        formData={formData}
                        formErrors={formErrors}
                        onInputChange={handleInputChange}
                        onCheckIdDuplicate={checkIdDuplicate}
                    />

                    {/* 약관 동의 영역 */}
                    <AgreementSection
                        agreements={agreements}
                        agreementErrors={agreementErrors}
                        onAgreementChange={handleAgreementChange}
                        onAllAgreementChange={handleAllAgreementChange}
                    />

                    {/* 안내 정보 테이블 */}
                    <InformationSection />

                    {/* 하단 안내와 가입완료 버튼 */}
                    <BottomSection onSubmit={handleSubmit} />
                </div>
            </div>
        </QuickMenuContents>
    );
}

interface UserInputFormProps {
    formData: FormData;
    formErrors: FormErrors;
    onInputChange: (field: string, value: string) => void;
    onCheckIdDuplicate: () => void;
}

function UserInputForm({ formData, formErrors, onInputChange, onCheckIdDuplicate }: UserInputFormProps) {
    const emailDomains = ['직접입력', 'gmail.com', 'naver.com', 'daum.net', 'hanmail.net', 'nate.com', 'yahoo.com'];

    return (
        <div className="mb-10 lg:mb-12">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">필수입력정보</h2>

            <div className="space-y-2">
                {/* 아이디 */}
                <div>
                    <div className="flex gap-2">
                        <label
                            htmlFor="id"
                            className="sr-only"
                        >
                            아이디
                        </label>
                        <input
                            type="text"
                            id="id"
                            placeholder="아이디 영문, 숫자 조합 6~12자"
                            value={formData.id}
                            onChange={(e) => onInputChange('id', e.target.value)}
                            className={`flex-1 px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${formErrors.id ? 'border-discount' : 'border-border'}`}
                        />
                        <button
                            type="button"
                            onClick={onCheckIdDuplicate}
                            className="px-4 bg-accent text-white text-sm lg:text-base rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap"
                        >
                            중복확인
                        </button>
                    </div>
                    {formErrors.id && <p className="mt-1 text-xs lg:text-sm text-discount">{formErrors.id}</p>}
                </div>

                {/* 비밀번호 */}
                <div>
                    <label
                        htmlFor="password"
                        className="sr-only"
                    >
                        비밀번호
                    </label>
                    <input
                        type="password"
                        id="password"
                        placeholder="비밀번호 영문, 숫자, 특수문자 조합 8~12자"
                        value={formData.password}
                        onChange={(e) => onInputChange('password', e.target.value)}
                        className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${formErrors.password ? 'border-discount' : 'border-border'}`}
                    />
                    {formErrors.password && <p className="mt-1 text-xs lg:text-sm text-discount">{formErrors.password}</p>}
                </div>

                {/* 비밀번호 확인 */}
                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="sr-only"
                    >
                        비밀번호 확인
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="비밀번호 다시 입력"
                        value={formData.confirmPassword}
                        onChange={(e) => onInputChange('confirmPassword', e.target.value)}
                        className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${formErrors.confirmPassword ? 'border-discount' : 'border-border'}`}
                    />
                    {formErrors.confirmPassword && <p className="mt-1 text-xs lg:text-sm text-discount">{formErrors.confirmPassword}</p>}
                </div>

                {/* 이름 */}
                <div>
                    <label
                        htmlFor="name"
                        className="sr-only"
                    >
                        이름
                    </label>
                    <input
                        type="text"
                        id="name"
                        placeholder="이름"
                        value={formData.name}
                        onChange={(e) => onInputChange('name', e.target.value)}
                        className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${formErrors.name ? 'border-discount' : 'border-border'}`}
                    />
                    {formErrors.name && <p className="mt-1 text-xs lg:text-sm text-discount">{formErrors.name}</p>}
                </div>

                {/* 생년월일 */}
                <div>
                    <label
                        htmlFor="birthDate"
                        className="sr-only"
                    >
                        생년월일
                    </label>
                    <input
                        type="text"
                        id="birthDate"
                        placeholder="생년월일 예:19870101"
                        value={formData.birthDate}
                        onChange={(e) => onInputChange('birthDate', e.target.value.replace(/\D/g, '').slice(0, 8))}
                        className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${formErrors.birthDate ? 'border-discount' : 'border-border'}`}
                    />
                    {formErrors.birthDate && <p className="mt-1 text-xs lg:text-sm text-discount">{formErrors.birthDate}</p>}
                </div>

                {/* 휴대폰 번호 */}
                <div>
                    <label
                        htmlFor="phone"
                        className="sr-only"
                    >
                        휴대폰 번호
                    </label>
                    <input
                        type="text"
                        id="phone"
                        placeholder="휴대폰 번호 -없이 입력"
                        value={formData.phone}
                        onChange={(e) => onInputChange('phone', e.target.value)}
                        className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${formErrors.phone ? 'border-discount' : 'border-border'}`}
                    />
                    {formErrors.phone && <p className="mt-1 text-xs lg:text-sm text-discount">{formErrors.phone}</p>}
                </div>

                {/* 이메일 */}
                <div>
                    <label
                        htmlFor="email"
                        className="sr-only"
                    >
                        이메일
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="email"
                            placeholder="이메일"
                            value={formData.email}
                            onChange={(e) => onInputChange('email', e.target.value)}
                            className={`flex-1 px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${formErrors.email ? 'border-discount' : 'border-border'}`}
                        />
                        <select
                            value={formData.emailDomain}
                            onChange={(e) => onInputChange('emailDomain', e.target.value)}
                            className="w-[150px] px-4 lg:px-5 py-3 text-sm appearance-none lg:text-base border border-border transition-colors focus:outline-none focus:border-accent bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_10px]"
                        >
                            {emailDomains.map((domain) => (
                                <option
                                    key={domain}
                                    value={domain}
                                >
                                    {domain}
                                </option>
                            ))}
                        </select>
                    </div>
                    {formErrors.email && <p className="mt-1 text-xs lg:text-sm text-discount">{formErrors.email}</p>}
                </div>
            </div>
        </div>
    );
}

interface AgreementSectionProps {
    agreements: AgreementState;
    agreementErrors: AgreementErrors;
    onAgreementChange: (category: 'required' | 'optional', field: string, checked: boolean) => void;
    onAllAgreementChange: (checked: boolean) => void;
}

function AgreementSection({ agreements, agreementErrors, onAgreementChange, onAllAgreementChange }: AgreementSectionProps) {
    return (
        <div className="mb-10 lg:mb-12">
            <h2 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">약관동의</h2>

            <div className="space-y-3">
                {/* 전체 동의 */}
                <div className="pb-3 border-b border-gray-200">
                    <Checkbox
                        checked={agreements.allAgreed}
                        onChange={onAllAgreementChange}
                        label="전체 동의"
                        labelClassName="text-base font-semibold"
                        checkboxClassName="w-5 h-5"
                    />
                    <p className="text-xs text-description mt-2 ml-7">전체 동의시 필수 및 선택 항목 모두에 대해 동의한 것으로 처리되며, 선택 항목 동의를 거부하시더라도 서비스 이용이 가능합니다.</p>
                </div>

                {/* 이용약관 동의 */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={agreements.required.terms}
                            onChange={(checked) => onAgreementChange('required', 'terms', checked)}
                            label="이용약관 동의"
                            labelClassName="text-sm"
                            checkboxClassName="w-5 h-5"
                        />
                        <span className="text-xs text-accent">필수</span>
                    </div>
                    <button type="button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-5 h-5 fill-description"
                        >
                            <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                        </svg>
                    </button>
                </div>

                {/* 개인정보수집 및 이용 동의 */}
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={agreements.required.privacy}
                        onChange={(checked) => onAgreementChange('required', 'privacy', checked)}
                        label="개인정보수집 및 이용 동의"
                        labelClassName="text-sm"
                        checkboxClassName="w-5 h-5"
                    />
                    <span className="text-xs text-accent">필수</span>
                </div>

                {/* 개인 맞춤형 서비스 활용 동의 */}
                <div className="flex items-center gap-2">
                    <Checkbox
                        checked={agreements.optional.personalized}
                        onChange={(checked) => onAgreementChange('optional', 'personalized', checked)}
                        label="개인 맞춤형 서비스 활용 동의"
                        labelClassName="text-sm"
                        checkboxClassName="w-5 h-5"
                    />
                    <span className="text-xs text-description">선택</span>
                </div>

                {/* 마케팅 활용 동의 */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Checkbox
                            checked={agreements.optional.marketing}
                            onChange={(checked) => onAgreementChange('optional', 'marketing', checked)}
                            label="마케팅 활용 동의"
                            labelClassName="text-sm"
                            checkboxClassName="w-5 h-5"
                        />
                        <span className="text-xs text-description">선택</span>
                    </div>

                    {/* 마케팅 하위 옵션 */}
                    <div className="ml-7 space-y-2 bg-border/15 rounded-md p-4">
                        <p className="text-xs text-description">
                            <span className="font-semibold">마케팅 정보 (광고) 수신 동의</span> 선택
                        </p>
                        <div className="flex items-center gap-6">
                            <Checkbox
                                checked={agreements.optional.email}
                                onChange={(checked) => onAgreementChange('optional', 'email', checked)}
                                label="이메일"
                                labelClassName="text-xs"
                                checkboxClassName="w-4 h-4"
                            />
                            <Checkbox
                                checked={agreements.optional.sms}
                                onChange={(checked) => onAgreementChange('optional', 'sms', checked)}
                                label="SMS"
                                labelClassName="text-xs"
                                checkboxClassName="w-4 h-4"
                            />
                            <Checkbox
                                checked={agreements.optional.phone}
                                onChange={(checked) => onAgreementChange('optional', 'phone', checked)}
                                label="전화"
                                labelClassName="text-xs"
                                checkboxClassName="w-4 h-4"
                            />
                        </div>
                        <p className="text-xs text-description">
                            모든 항목 수신 동의 시 1천원 쇼핑플러스 쿠폰이 지급됩니다.
                            <br />
                            다운로드 후 1주일/3만원 이상 구매시 사용가능/일부상품제외
                        </p>
                        <p className="text-xs text-description">
                            <span className="font-semibold">심야 마케팅 정보 (광고) 수신 동의 (21~08시)</span> 선택
                        </p>
                        <div className="flex items-center gap-6">
                            <Checkbox
                                checked={agreements.optional.nightSms}
                                onChange={(checked) => onAgreementChange('optional', 'nightSms', checked)}
                                label="SMS"
                                labelClassName="text-xs"
                                checkboxClassName="w-4 h-4"
                            />
                            <Checkbox
                                checked={agreements.optional.nightPhone}
                                onChange={(checked) => onAgreementChange('optional', 'nightPhone', checked)}
                                label="전화"
                                labelClassName="text-xs"
                                checkboxClassName="w-4 h-4"
                            />
                        </div>
                    </div>
                </div>

                {/* 필수 약관 동의 에러 메시지 */}
                {agreementErrors.required && <p className="mt-1 text-xs lg:text-sm text-discount">{agreementErrors.required}</p>}
            </div>
        </div>
    );
}

function InformationSection() {
    return (
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
                            <td
                                className="px-3 lg:px-4 py-1 bg-border/25"
                                rowSpan={3}
                            >
                                통합/간편회원
                            </td>
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
                            <td
                                className="px-3 lg:px-4 py-1 bg-border/25"
                                rowSpan={2}
                            >
                                TV 고객
                            </td>
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
    );
}

interface BottomSectionProps {
    onSubmit: () => void;
}

function BottomSection({ onSubmit }: BottomSectionProps) {
    return (
        <div>
            {/* 안내 메시지 */}
            <div className="mb-8 lg:mb-10">
                <p className="text-sm font-semibold text-accent mb-4">CJ ENM 이용약관 및 개인정보 동의 내용을 확인하였으며, 위 내용에 동의합니다. 만 14세 미만 아동은 회원가입이 제한됩니다.</p>
            </div>

            {/* 가입완료 버튼 */}
            <button
                type="button"
                onClick={onSubmit}
                className="w-full bg-accent text-white font-semibold py-3 text-lg rounded-md hover:bg-accent/90 transition-colors"
            >
                가입완료
            </button>
        </div>
    );
}
