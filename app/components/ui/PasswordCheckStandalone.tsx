import * as React from 'react';
import { useState, useEffect } from 'react';

// Props 인터페이스 정의
interface PasswordCheckProps {
  userName?: string;
  placeholderText?: string;
  submitButtonText?: string;
  descriptionText?: string;
  onSubmit?: (password: string) => void;
}

// 기본값
const defaultProps = {
  userName: '홍길동',
  placeholderText: '비밀번호 영문, 숫자, 특수문자 조합 8~12자',
  submitButtonText: '확인',
  descriptionText: '개인정보를 안전하게 보호하기 위해 비밀번호 확인 후 변경할 수 있습니다.'
};

export default function PasswordCheckStandalone({
  userName = defaultProps.userName,
  placeholderText = defaultProps.placeholderText,
  submitButtonText = defaultProps.submitButtonText,
  descriptionText = defaultProps.descriptionText,
  onSubmit
}: PasswordCheckProps) {
  const [password, setPassword] = useState('');

  // Tailwind CSS CDN 자동 로드
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      document.head.appendChild(script);

      // Tailwind 설정
      script.onload = () => {
        if ((window as any).tailwind) {
          (window as any).tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'accent': '#41c5af',
                  'description': '#6b7280',
                  'border': '#e5e7eb'
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
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(password);
    } else {
      console.log('Password submitted:', password);
      // 기본 동작: 콘솔에 출력
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="lg:pt-10 pb-15 lg:pb-30">
      {/* 데스크톱 헤더 */}
      <div className="max-lg:hidden max-lg:px-4">
        <h2 className="text-2xl font-semibold">비밀번호 확인</h2>
      </div>

      {/* 컨텐츠 */}
      <div className="max-lg:px-4 lg:px-0 mt-6 lg:mt-8">
        {/* 설명 텍스트 */}
        <p className="text-sm mb-4 lg:mb-4">
          {userName}님의 {descriptionText}
        </p>

        {/* 폼 */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* 비밀번호 입력 필드 */}
          <div>
            <label htmlFor="password-check" className="sr-only">
              비밀번호
            </label>
            <input
              id="password-check"
              placeholder={placeholderText}
              className="w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full bg-accent text-white font-semibold py-3 text-lg rounded hover:bg-accent/90 transition-colors"
          >
            {submitButtonText}
          </button>
        </form>
      </div>
    </div>
  );
}