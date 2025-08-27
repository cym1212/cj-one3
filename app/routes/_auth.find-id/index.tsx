import { useState } from 'react';
import { useNavigate } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { RadioButton } from '@/components/ui/RadioButton';

export function meta() {
    return [
        {
            title: '아이디 찾기 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 아이디 찾기 페이지',
        },
    ];
}

type FindMethod = 'name-birth' | 'identity' | 'phone' | 'email';

export default function FindId() {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState<FindMethod>('name-birth');
    const [formData, setFormData] = useState({
        name: '',
        birthDate: '',
        phone: '',
        email: '',
        verificationCode: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        birthDate: '',
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
            name: '',
            birthDate: '',
            phone: '',
            email: '',
            verificationCode: '',
        });
        setErrors({
            name: '',
            birthDate: '',
            phone: '',
            email: '',
            verificationCode: '',
        });
    };

    const validateForm = () => {
        const newErrors = {
            name: '',
            birthDate: '',
            phone: '',
            email: '',
            verificationCode: '',
        };

        switch (selectedMethod) {
            case 'name-birth':
                if (!formData.name.trim()) {
                    newErrors.name = '이름을 입력해주세요.';
                }
                if (!formData.birthDate.trim()) {
                    newErrors.birthDate = '생년월일을 입력해주세요.';
                } else if (formData.birthDate.length !== 8) {
                    newErrors.birthDate = '생년월일 8자리를 입력해주세요.';
                }
                break;
            case 'phone':
                if (!formData.name.trim()) {
                    newErrors.name = '이름을 입력해주세요.';
                }
                if (!formData.phone.trim()) {
                    newErrors.phone = '휴대폰번호를 입력해주세요.';
                }
                break;
            case 'email':
                if (!formData.name.trim()) {
                    newErrors.name = '이름을 입력해주세요.';
                }
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
            // 본인인증 완료 후 결과 페이지로 이동 (실제 구현에서는 API 응답 후 이동)
            // 현재 방식은 보안상 좋지 않아서 실제 구현시 수정 필요
            navigate('/find-id-result?id=TEST');
            return;
        }

        if (validateForm()) {
            console.log('아이디 찾기 처리:', { method: selectedMethod, ...formData });
            // 아이디 찾기 성공 시 결과 페이지로 이동 (실제 구현에서는 API 응답의 아이디 사용)
            // 현재 방식은 보안상 좋지 않아서 실제 구현시 수정 필요
            navigate('/find-id-result?id=TEST');
        }
    };

    const handleSendVerification = () => {
        if (selectedMethod === 'phone' && formData.name && formData.phone) {
            console.log('인증번호 전송');
        } else if (selectedMethod === 'email' && formData.name && formData.email) {
            console.log('인증메일 전송');
        }
    };

    return (
        <QuickMenuContents>
            <div className="max-w-[500px] mx-auto mb-15 lg:mb-30 bg-white flex flex-col items-center lg:justify-center px-4">
                <div className="w-full">
                    {/* 타이틀 */}
                    <div className="mt-8 mb-8 lg:mt-14 lg:mb-10 border-b border-border">
                        <h1 className="text-xl lg:text-2xl font-semibold">아이디 찾기</h1>
                        <div className="mt-2 w-full h-px bg-border" />
                    </div>

                    <p className="text-sm lg:text-base text-description mb-3 lg:mb-4">아이디 찾는 방법을 선택해주세요.</p>

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
                            아이디를 찾지 못한 경우, CJ ONSTYLE 고객센터{' '}
                            <a
                                href="tel:16442525"
                                className="text-black"
                            >
                                1644-2525
                            </a>
                            로 문의 바랍니다.
                        </li>
                        <li>아이디 중 일부 갖만 확인되어 전체 아이디 확인이 추가로 필요하신 경우, 본인인증으로 찾기, 휴대폰번호로 찾기, 이메일 주소로 찾기를 이용해주세요</li>
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
        name: string;
        birthDate: string;
        phone: string;
        email: string;
        verificationCode: string;
    };
    errors: {
        name: string;
        birthDate: string;
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
            {renderAccordionItem('name-birth', '이름/생년월일로 찾기 (아이디 일부**표시)')}
            {renderAccordionItem('identity', '본인인증으로 찾기')}
            {renderAccordionItem('phone', '등록된 휴대폰번호로 찾기')}
            {renderAccordionItem('email', '등록된 이메일주소로 찾기')}
        </div>
    );
}

interface AccordionContentProps {
    method: FindMethod;
    formData: {
        name: string;
        birthDate: string;
        phone: string;
        email: string;
        verificationCode: string;
    };
    errors: {
        name: string;
        birthDate: string;
        phone: string;
        email: string;
        verificationCode: string;
    };
    onInputChange: (field: string, value: string) => void;
    onSendVerification: () => void;
}

function AccordionContent({ method, formData, errors, onInputChange, onSendVerification }: AccordionContentProps) {
    switch (method) {
        case 'name-birth':
            return (
                <div className="space-y-4">
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
                            className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.name ? 'border-discount' : 'border-border'}`}
                        />
                        {errors.name && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.name}</p>}
                    </div>
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
                            placeholder="생년월일 8자리로 입력 (예: 19560209)"
                            value={formData.birthDate}
                            onChange={(e) => onInputChange('birthDate', e.target.value.replace(/\D/g, '').slice(0, 8))}
                            className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.birthDate ? 'border-discount' : 'border-border'}`}
                        />
                        {errors.birthDate && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.birthDate}</p>}
                    </div>
                </div>
            );

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
                            className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.name ? 'border-discount' : 'border-border'}`}
                        />
                        {errors.name && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.name}</p>}
                    </div>
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
                            className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.name ? 'border-discount' : 'border-border'}`}
                        />
                        {errors.name && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.name}</p>}
                    </div>
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
