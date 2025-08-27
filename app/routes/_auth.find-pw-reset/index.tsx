import { useState } from 'react';
import { useNavigate } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';

export function meta() {
    return [
        {
            title: '비밀번호 찾기 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 비밀번호 재설정 페이지',
        },
    ];
}

export default function FindPwReset() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: '',
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

    const validatePassword = (password: string) => {
        if (!password) {
            return '비밀번호를 입력해주세요.';
        }
        if (password.length < 8 || password.length > 12) {
            return '비밀번호는 8~12자로 입력해주세요.';
        }

        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!"#$%&'()*+,\-./:;(<=>)?@[\]^_`{|}~]/.test(password);

        if (!hasLetter || !hasNumber || !hasSpecialChar) {
            return '영문, 숫자, 특수문자를 모두 포함해야 합니다.';
        }

        return '';
    };

    const validateForm = () => {
        const newErrors = {
            password: '',
            confirmPassword: '',
        };

        newErrors.password = validatePassword(formData.password);

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호를 다시 입력해주세요.';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        }

        setErrors(newErrors);
        return !newErrors.password && !newErrors.confirmPassword;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('비밀번호 재설정 처리:', formData);
            // 비밀번호 찾기 성공 시 결과 페이지로 이동 (실제 구현에서는 API 응답의 아이디 사용)
            // 현재 방식은 보안상 좋지 않아서 실제 구현시 수정 필요
            navigate('/find-pw-result?id=TEST');
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

                    {/* 안내 메시지 */}
                    <p className="text-sm lg:text-base text-description mb-3 lg:mb-4">안전한 사용을 위해 새 비밀번호를 설정해 주세요.</p>

                    {/* 비밀번호 입력 폼 */}
                    <div className="space-y-2 lg:space-y-4  mb-5 lg:mb-7">
                        {/* 새 비밀번호 입력 */}
                        <div>
                            <label
                                htmlFor="password"
                                className="sr-only"
                            >
                                새 비밀번호
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="새 비밀번호 영문, 숫자, 특수문자 조합 8~12자"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.password ? 'border-discount' : 'border-border'}`}
                            />
                            {errors.password && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.password}</p>}
                        </div>

                        {/* 비밀번호 확인 입력 */}
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
                                placeholder="다시입력 영문, 숫자, 특수문자 조합 8~12자"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.confirmPassword ? 'border-discount' : 'border-border'}`}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.confirmPassword}</p>}
                        </div>
                    </div>

                    {/* 확인 버튼 */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-accent text-white font-semibold py-3 text-base lg:text-lg rounded-md hover:bg-accent/90 transition-colors mb-5"
                    >
                        확인
                    </button>

                    {/* 비밀번호 설정 안내 */}
                    <ul className="text-xs lg:text-sm text-description list-disc list-outside pl-4">
                        <li>비밀번호 설정 시 아이디와 4자리 이상 같거나, 동일문자, 숫자의 4자리 이상 반복불가</li>
                        <li>이용가능 특수문자 ! " # $ % & ' ( ) * + , - . / : ; ( = ) ? @ [ ~ ] ^ _ `</li>
                    </ul>
                </div>
            </div>
        </QuickMenuContents>
    );
}
