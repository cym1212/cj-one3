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
            content: 'CJ온스타일 비밀번호 찾기 페이지',
        },
    ];
}

export default function FindPWGateById() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ id: '' });
    const [errors, setErrors] = useState({ id: '' });

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

    const validateForm = () => {
        const newErrors = {
            id: '',
        };

        if (!formData.id.trim()) {
            newErrors.id = '아이디를 입력해주세요.';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // 현재 방식은 보안상 좋지 않아서 실제 구현시 수정 필요
            navigate('/find-pw?id=TEST');
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

                    <p className="text-sm lg:text-base text-description mb-3 lg:mb-4">아이디를 입력 후, 본인확인을 통해 비밀번호를 다시 설정할 수 있습니다.</p>

                    <div className="mb-8 lg:mb-10">
                        <label
                            htmlFor="id"
                            className="sr-only"
                        >
                            아이디
                        </label>
                        <input
                            type="text"
                            id="id"
                            placeholder="아이디 입력"
                            value={formData.id}
                            onChange={(e) => handleInputChange('id', e.target.value)}
                            className={`w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.id ? 'border-discount' : 'border-border'}`}
                        />
                        {errors.id && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.id}</p>}
                    </div>

                    {/* 확인 버튼 */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-full bg-accent text-white font-semibold py-3 text-base lg:text-lg rounded-md hover:bg-accent/90 transition-colors mb-5"
                    >
                        조회
                    </button>
                </div>
            </div>
        </QuickMenuContents>
    );
}
