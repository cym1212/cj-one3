import { useState } from 'react';
import { Link } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { Checkbox } from '@/components/ui/Checkbox';

export function meta() {
    return [
        {
            title: '로그인 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 로그인 페이지',
        },
    ];
}

export default function Login() {
    const [formData, setFormData] = useState({
        id: '',
        password: '',
        rememberMe: false,
    });

    const [errors, setErrors] = useState({
        id: '',
        password: '',
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

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            rememberMe: checked,
        }));
    };

    const validateForm = () => {
        const newErrors = { id: '', password: '' };

        if (!formData.id.trim()) {
            newErrors.id = '아이디를 입력해주세요.';
        }

        if (!formData.password.trim()) {
            newErrors.password = '비밀번호를 입력해주세요.';
        } else if (formData.password.length < 6) {
            newErrors.password = '비밀번호는 6자리 이상 입력해주세요.';
        }

        setErrors(newErrors);
        return !newErrors.id && !newErrors.password;
    };

    const handleLogin = () => {
        if (validateForm()) {
            console.log('로그인 처리:', formData);
        }
    };

    const handleKakaoLogin = () => {
        console.log('카카오 로그인');
    };

    const handleNaverLogin = () => {
        console.log('네이버 로그인');
    };

    return (
        <QuickMenuContents>
            <div className="max-w-[500px] mx-auto mb-15 lg:mb-30 bg-white flex flex-col items-center lg:justify-center px-4">
                <div className="w-full">
                    {/* 로고 */}
                    <div className="mt-8 mb-5 lg:mt-14 lg:mb-8">
                        <p className="text-xl lg:text-2xl font-semibold">반갑습니다.</p>
                        <p className="text-xl lg:text-2xl font-semibold flex items-center gap-0.5">
                            <img
                                src="/images/logo.png"
                                alt="CJ온스타일"
                                className="max-h-10 h-full"
                            />
                            <span>입니다.</span>
                        </p>
                    </div>

                    {/* 로그인 폼 */}
                    <LoginForm
                        formData={formData}
                        errors={errors}
                        onInputChange={handleInputChange}
                        onCheckboxChange={handleCheckboxChange}
                        onLogin={handleLogin}
                    />

                    {/* 링크 */}
                    <div className="flex items-center justify-center gap-3 lg:gap-4 text-sm text-description mb-8 lg:mb-12">
                        <Link
                            to="/find-id"
                            className="hover:text-black transition-colors"
                        >
                            아이디 찾기
                        </Link>
                        <span className="text-border">|</span>
                        <Link
                            to="/find-pw-gate-by-id"
                            className="hover:text-black transition-colors"
                        >
                            비밀번호 찾기
                        </Link>
                        <span className="text-border">|</span>
                        <Link
                            to="/register"
                            className="hover:text-black transition-colors"
                        >
                            회원가입
                        </Link>
                    </div>

                    {/* 소셜 로그인 */}
                    <SocialLogin
                        onKakaoLogin={handleKakaoLogin}
                        onNaverLogin={handleNaverLogin}
                    />

                    {/* 비회원 구매조회 */}
                    <div className="mt-5 lg:mt-6 pt-5 lg:pt-6 border-t border-border text-center">
                        <Link
                            to="/guest-order"
                            className="block w-full bg-white py-3 text-base lg:text-lg rounded-md border border-border hover:border-black transition-colors"
                        >
                            비회원 구매조회
                        </Link>
                    </div>
                </div>
            </div>
        </QuickMenuContents>
    );
}

interface LoginFormProps {
    formData: {
        id: string;
        password: string;
        rememberMe: boolean;
    };
    errors: {
        id: string;
        password: string;
    };
    onInputChange: (field: string, value: string) => void;
    onCheckboxChange: (checked: boolean) => void;
    onLogin: () => void;
}

function LoginForm({ formData, errors, onInputChange, onCheckboxChange, onLogin }: LoginFormProps) {
    return (
        <div className="space-y-2 lg:space-y-4 mb-4 lg:mb-5">
            {/* 아이디 입력 */}
            <div>
                <label
                    htmlFor="id"
                    className="sr-only"
                >
                    아이디
                </label>
                <input
                    type="text"
                    id="id"
                    placeholder="CJ ONSTYLE / CJ ONE 통합 아이디 6~12자"
                    value={formData.id}
                    onChange={(e) => onInputChange('id', e.target.value)}
                    className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.id ? 'border-discount' : 'border-border'}`}
                />
                {errors.id && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.id}</p>}
            </div>

            {/* 비밀번호 입력 */}
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
                    placeholder="영문, 특수문자, 숫자혼합 6~12자"
                    value={formData.password}
                    onChange={(e) => onInputChange('password', e.target.value)}
                    className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.password ? 'border-discount' : 'border-border'}`}
                />
                {errors.password && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.password}</p>}
            </div>

            {/* 아이디 저장 체크박스 */}
            <div className="flex items-center pb-3">
                <Checkbox
                    checked={formData.rememberMe}
                    onChange={onCheckboxChange}
                    label="아이디 저장"
                    checkboxClassName="w-4 h-4 lg:w-5 lg:h-5"
                    labelClassName="text-sm lg:text-base"
                />
            </div>

            {/* 로그인 버튼 */}
            <button
                type="button"
                onClick={onLogin}
                className="w-full bg-accent text-white font-semibold py-3 text-base lg:text-lg rounded-md hover:bg-accent/90 transition-colors"
            >
                로그인
            </button>
        </div>
    );
}

interface SocialLoginProps {
    onKakaoLogin: () => void;
    onNaverLogin: () => void;
}

function SocialLogin({ onKakaoLogin, onNaverLogin }: SocialLoginProps) {
    return (
        <div className="space-y-2 lg:space-y-4">
            <p className="text-center text-xs lg:text-sm text-description mb-3 lg:mb-4">아이디/비밀번호 찾기 없이 로그인하세요</p>

            {/* 카카오 로그인 */}
            <button
                type="button"
                onClick={onKakaoLogin}
                className="w-full bg-[#FEE500] text-black font-semibold py-3 text-base lg:text-lg rounded-md hover:bg-[#FEE500]/90 transition-colors flex items-center justify-center gap-2"
            >
                <svg
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                >
                    <defs>
                        <path
                            id="a"
                            d="M0 0h16v16H0z"
                        />
                    </defs>
                    <g
                        fill="none"
                        fill-rule="evenodd"
                    >
                        <path
                            d="M8 1C3.582 1 0 3.873 0 7.416c0 2.278 1.481 4.279 3.713 5.417l-.754 2.86a.235.235 0 0 0 .055.239.227.227 0 0 0 .304.018l3.244-2.222c.466.068.947.103 1.438.103 4.418 0 8-2.872 8-6.415S12.418 1 8 1"
                            fill="rgb(51,51,51)"
                        />
                    </g>
                </svg>
                카카오 로그인
            </button>

            {/* 네이버 로그인 */}
            <button
                type="button"
                onClick={onNaverLogin}
                className="w-full bg-[#03C75A] text-white font-semibold py-3 text-base lg:text-lg rounded-md hover:bg-[#03C75A]/90 transition-colors flex items-center justify-center gap-2"
            >
                <svg
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                >
                    <defs>
                        <path
                            id="a"
                            d="M0 0h16v16H0z"
                        />
                    </defs>
                    <g
                        fill="none"
                        fill-rule="evenodd"
                    >
                        <path
                            fill="#FFF"
                            d="M10.314 1.55v6.9l-4.819-6.9H1.5v12.89h4.186V7.542l4.819 6.9H14.5V1.55z"
                        />
                    </g>
                </svg>
                네이버 로그인
            </button>
        </div>
    );
}
