import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { RadioButton } from '@/components/ui/RadioButton';

export function meta() {
    return [
        {
            title: '비밀번호 찾기 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 비밀번호 찾기 페이지',
        },
    ];
}

type FindMethod = 'identity' | 'phone' | 'email';

export default function FindPw() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');

    const [selectedMethod, setSelectedMethod] = useState<FindMethod>('identity');
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        verificationCode: '',
    });
    const [errors, setErrors] = useState({
        phone: '',
        email: '',
        verificationCode: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (errors[field as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const handleMethodChange = (method: string) => {
        setSelectedMethod(method as FindMethod);
        setFormData({
            phone: '',
            email: '',
            verificationCode: '',
        });
        setErrors({
            phone: '',
            email: '',
            verificationCode: '',
        });
    };

    const validateForm = () => {
        const newErrors = {
            phone: '',
            email: '',
            verificationCode: '',
        };

        switch (selectedMethod) {
            case 'phone':
                if (!formData.phone.trim()) {
                    newErrors.phone = '휴대폰번호를 입력해주세요.';
                }
                break;
            case 'email':
                if (!formData.email.trim()) {
                    newErrors.email = '이메일을 입력해주세요.';
                }
                break;
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = () => {
        if (selectedMethod === 'identity') {
            console.log('본인인증 처리');
            navigate('/find-pw-reset');
            return;
        }

        if (validateForm()) {
            console.log('비밀번호 찾기 처리:', { method: selectedMethod, ...formData });
            navigate('/find-pw-reset');
        }
    };

    const handleSendVerification = () => {
        if (selectedMethod === 'phone' && formData.phone) {
            console.log('인증번호 전송');
        } else if (selectedMethod === 'email' && formData.email) {
            console.log('인증메일 전송');
        }
    };

    return (
        <QuickMenuContents>
            <div className="max-w-[500px] mx-auto mb-15 lg:mb-30 bg-white flex flex-col items-center lg:justify-center px-4">
                <div className="w-full">
                    {/* 타이틀 */}
                    <div className="mt-8 mb-8 lg:mt-14 lg:mb-10 border-b border-border">
                        <h1 className="text-xl lg:text-2xl font-semibold">비밀번호 찾기</h1>
                        <div className="mt-2 w-full h-px bg-border" />
                    </div>

                    {/* 아이디 확인 메시지 */}
                    <div className="text-center mb-8 lg:mb-10">
                        <p className="text-lg lg:text-xl font-semibold">고객님의 아이디</p>
                        <p className="text-lg lg:text-xl font-semibold">
                            <span className="text-accent">{userId}</span>
                            <span>확인되었습니다.</span>
                        </p>
                    </div>

                    <p className="text-sm lg:text-base text-description mb-3 lg:mb-4">비밀번호 찾는 방법을 선택해주세요.</p>

                    {/* 찾기 방법 선택 (아코디언) */}
                    <AccordionSelector
                        selectedMethod={selectedMethod}
                        onMethodChange={handleMethodChange}
                        formData={formData}
                        errors={errors}
                        onInputChange={handleInputChange}
                        onSendVerification={handleSendVerification}
                    />

                    {/* 확인 버튼 */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-accent text-white font-semibold py-3 text-base lg:text-lg rounded-md hover:bg-accent/90 transition-colors mb-5"
                    >
                        확인
                    </button>

                    {/* 고객센터 안내 */}
                    <ul className="text-xs lg:text-sm text-description list-disc list-outside pl-4">
                        <li>
                            본인확인이 불가한 경우, CJ ONSTYLE 고객센터{' '}
                            <a
                                href="tel:16442525"
                                className="text-black"
                            >
                                1644-2525
                            </a>
                            로 문의 바랍니다.
                        </li>
                    </ul>
                </div>
            </div>
        </QuickMenuContents>
    );
}

interface AccordionSelectorProps {
    selectedMethod: FindMethod;
    onMethodChange: (method: string) => void;
    formData: {
        phone: string;
        email: string;
        verificationCode: string;
    };
    errors: {
        phone: string;
        email: string;
        verificationCode: string;
    };
    onInputChange: (field: string, value: string) => void;
    onSendVerification: () => void;
}

function AccordionSelector({ selectedMethod, onMethodChange, formData, errors, onInputChange, onSendVerification }: AccordionSelectorProps) {
    const renderAccordionItem = (method: FindMethod, label: string) => {
        const isSelected = selectedMethod === method;

        return (
            <div
                key={method}
                className="border border-border rounded-md overflow-hidden"
            >
                <div
                    className="p-3 lg:p-4 cursor-pointer transition-colors hover:border-accent"
                    onClick={() => onMethodChange(method)}
                >
                    <RadioButton
                        checked={isSelected}
                        onChange={() => onMethodChange(method)}
                        value={method}
                        name="find-method"
                        label={label}
                        className="pointer-events-none"
                        radioButtonClassName="w-5 h-5"
                        labelClassName="text-sm lg:text-base"
                    />
                </div>

                {isSelected && (
                    <div className="px-3 lg:px-4 pb-3 lg:pb-4 bg-white">
                        <AccordionContent
                            method={method}
                            formData={formData}
                            errors={errors}
                            onInputChange={onInputChange}
                            onSendVerification={onSendVerification}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4 mb-8 lg:mb-10">
            {renderAccordionItem('identity', '본인인증으로 찾기')}
            {renderAccordionItem('phone', '등록된 휴대폰번호로 찾기')}
            {renderAccordionItem('email', '등록된 이메일주소로 찾기')}
        </div>
    );
}

interface AccordionContentProps {
    method: FindMethod;
    formData: {
        phone: string;
        email: string;
        verificationCode: string;
    };
    errors: {
        phone: string;
        email: string;
        verificationCode: string;
    };
    onInputChange: (field: string, value: string) => void;
    onSendVerification: () => void;
}

function AccordionContent({ method, formData, errors, onInputChange, onSendVerification }: AccordionContentProps) {
    switch (method) {
        case 'identity':
            return (
                <div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <button
                            type="button"
                            className="bg-accent text-white py-3 text-sm lg:text-base rounded-md hover:bg-accent/90 transition-colors"
                        >
                            휴대폰
                        </button>
                        <button
                            type="button"
                            className="bg-accent text-white py-3 text-sm lg:text-base rounded-md hover:bg-accent/90 transition-colors"
                        >
                            신용/체크카드
                        </button>
                        <button
                            type="button"
                            className="bg-accent text-white py-3 text-sm lg:text-base rounded-md hover:bg-accent/90 transition-colors"
                        >
                            아이핀
                        </button>
                    </div>
                    <p className="text-xs lg:text-sm text-description">CJ ONSTYLE 가맴회원으로 가입하신 경우, 다른 방식을 이용해 주세요.</p>
                </div>
            );

        case 'phone':
            return (
                <div className="space-y-4">
                    <div>
                        <div className="flex gap-2">
                            <label
                                htmlFor="phone"
                                className="sr-only"
                            >
                                휴대폰번호
                            </label>
                            <input
                                type="text"
                                id="phone"
                                placeholder="휴대폰번호"
                                value={formData.phone}
                                onChange={(e) => onInputChange('phone', e.target.value)}
                                className={`flex-1 px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.phone ? 'border-discount' : 'border-border'}`}
                            />
                            <button
                                type="button"
                                onClick={onSendVerification}
                                className="px-4 bg-accent text-white text-sm lg:text-base rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap"
                            >
                                인증번호 전송
                            </button>
                        </div>
                        {errors.phone && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.phone}</p>}
                    </div>
                    <div>
                        <label
                            htmlFor="verificationCode"
                            className="sr-only"
                        >
                            인증번호
                        </label>
                        <input
                            type="text"
                            id="verificationCode"
                            placeholder="인증번호 10분이내 입력"
                            value={formData.verificationCode}
                            onChange={(e) => onInputChange('verificationCode', e.target.value)}
                            className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border border-border placeholder-description transition-colors focus:outline-none focus:border-accent"
                        />
                    </div>
                </div>
            );

        case 'email':
            return (
                <div className="space-y-4">
                    <div>
                        <div className="flex gap-2">
                            <label
                                htmlFor="email"
                                className="sr-only"
                            >
                                이메일
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="이메일"
                                value={formData.email}
                                onChange={(e) => onInputChange('email', e.target.value)}
                                className={`flex-1 px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.email ? 'border-discount' : 'border-border'}`}
                            />
                            <button
                                type="button"
                                onClick={onSendVerification}
                                className="px-4 bg-accent text-white text-sm lg:text-base rounded-md hover:bg-accent/90 transition-colors whitespace-nowrap"
                            >
                                인증메일 전송
                            </button>
                        </div>
                        {errors.email && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.email}</p>}
                    </div>
                    <div>
                        <label
                            htmlFor="verificationCode"
                            className="sr-only"
                        >
                            인증번호
                        </label>
                        <input
                            type="text"
                            id="verificationCode"
                            placeholder="인증번호 10분이내 입력"
                            value={formData.verificationCode}
                            onChange={(e) => onInputChange('verificationCode', e.target.value)}
                            className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border border-border placeholder-description transition-colors focus:outline-none focus:border-accent"
                        />
                    </div>
                </div>
            );

        default:
            return null;
    }
}
