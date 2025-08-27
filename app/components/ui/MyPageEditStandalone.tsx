import * as React from 'react';
import { useState, useEffect } from 'react';

interface MyPageEditProps {
  userId?: string;
  userName?: string;
  phoneNumber?: string;
  homePhone?: string;
  email?: string;
  postCode?: string;
  address?: string;
  detailAddress?: string;
  birthDate?: string;
  socialLogin?: {
    naver?: boolean;
    apple?: boolean;
    kakao?: boolean;
  };
  marketing?: {
    personalized?: boolean;
    email?: boolean;
    sms?: boolean;
    call?: boolean;
    nightSms?: boolean;
    nightCall?: boolean;
    cjService?: boolean;
  };
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

// 체크박스 컴포넌트
const Checkbox = ({ checked = false, onChange, label, labelClass = "text-sm", size = "w-5 h-5" }: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label: string;
  labelClass?: string;
  size?: string;
}) => (
  <label className="group/poj2-checkbox flex items-center cursor-pointer">
    <input 
      className="sr-only" 
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
    />
    <div className={`border-1 rounded flex items-center justify-center transition-colors ${checked ? 'bg-accent border-accent' : 'bg-white border-border'} group-hover/poj2-checkbox:border-accent cursor-pointer ${size}`}>
      {checked && (
        <svg className="text-white" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
    <span className={`ml-2 text-black group-hover/poj2-checkbox:text-accent ${labelClass}`}>
      {label}
    </span>
  </label>
);

export default function MyPageEditStandalone({
  userId = 'test',
  userName = '홍길동',
  phoneNumber = '010-1234-5678',
  homePhone = '02-123-4567',
  email = 'test@naver.com',
  postCode = '12345',
  address = '서울특별시 광진구 긴고랑로',
  detailAddress = '2층',
  birthDate = '********',
  socialLogin = {
    naver: false,
    apple: false,
    kakao: false
  },
  marketing = {
    personalized: false,
    email: false,
    sms: false,
    call: false,
    nightSms: false,
    nightCall: false,
    cjService: false
  },
  onSubmit,
  onCancel
}: MyPageEditProps) {
  // State
  const [activeTab, setActiveTab] = useState<'shopping' | 'body'>('shopping');
  const [formData, setFormData] = useState({
    postCode,
    address,
    detailAddress,
    socialLogin: { ...socialLogin },
    marketing: { ...marketing }
  });

  // Tailwind CDN 자동 로드
  useEffect(() => {
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
                  'accent': '#41c5af',
                  'description': '#6b7280',
                  'border': '#e5e7eb',
                },
                spacing: {
                  '15': '3.75rem',
                  '30': '7.5rem'
                },
                zIndex: {
                  '2': '2'
                }
              }
            }
          };
        }
      };
    }
  }, []);

  const handleSocialLoginToggle = (platform: 'naver' | 'apple' | 'kakao') => {
    setFormData(prev => ({
      ...prev,
      socialLogin: {
        ...prev.socialLogin,
        [platform]: !prev.socialLogin[platform]
      }
    }));
  };

  const handleMarketingToggle = (key: keyof typeof marketing) => {
    setFormData(prev => ({
      ...prev,
      marketing: {
        ...prev.marketing,
        [key]: !prev.marketing[key]
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  const handleEditClick = (field: string) => {
    console.log('Edit:', field);
  };

  return (
    <div className="lg:pt-10 pb-15 lg:pb-30">
      <div className="max-lg:hidden max-lg:px-4">
        <h2 className="text-2xl font-semibold">비밀번호 확인</h2>
      </div>

      {/* 탭 네비게이션 */}
      <nav className="max-lg:sticky max-lg:top-[57px] max-lg:h-fit max-lg:z-2 lg:mt-2 flex items-center bg-white">
        <button 
          type="button"
          onClick={() => setActiveTab('shopping')}
          className="flex-1 block h-[50px]"
        >
          <span className={`flex items-center justify-center gap-1 w-full h-full font-semibold ${
            activeTab === 'shopping' 
              ? 'border-b-2 border-current' 
              : 'border-b border-border'
          }`}>
            쇼핑 정보
          </span>
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('body')}
          className="flex-1 block h-[50px]"
        >
          <span className={`flex items-center justify-center gap-1 w-full h-full ${
            activeTab === 'body' 
              ? 'font-semibold border-b-2 border-current' 
              : 'border-b border-border'
          }`}>
            바디 정보
          </span>
        </button>
      </nav>

      {activeTab === 'shopping' && (
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="px-4 lg:px-0">
            <div className="flex items-end justify-between pb-3 border-b border-border">
              <h3 className="text-base lg:text-lg font-semibold">{userName}님의 쇼핑정보</h3>
              <span className="text-xs text-accent">* 필수입력정보</span>
            </div>
          </div>

          <div className="divide-y divide-border">
            {/* 아이디 */}
            <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
              <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                아이디
              </div>
              <div className="flex-1">
                <span className="text-sm">{userId}</span>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
              <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                비밀번호
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-sm">********</span>
                  <button 
                    type="button"
                    onClick={() => handleEditClick('password')}
                    className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>

            {/* 로그인연동 */}
            <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
              <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                로그인연동
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-3 py-1">
                  <div className="flex items-center gap-2">
                    <NaverIcon />
                    <span className="text-sm">네이버 로그인</span>
                    <button 
                      type="button"
                      onClick={() => handleSocialLoginToggle('naver')}
                      className={`ml-auto px-3 py-1 border text-sm transition-colors rounded ${
                        formData.socialLogin.naver 
                          ? 'bg-accent text-white border-accent hover:bg-accent/90' 
                          : 'border-border hover:bg-border/20'
                      }`}
                    >
                      {formData.socialLogin.naver ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppleIcon />
                    <span className="text-sm">애플로 로그인</span>
                    <button 
                      type="button"
                      onClick={() => handleSocialLoginToggle('apple')}
                      className={`ml-auto px-3 py-1 border text-sm transition-colors rounded ${
                        formData.socialLogin.apple 
                          ? 'bg-accent text-white border-accent hover:bg-accent/90' 
                          : 'border-border hover:bg-border/20'
                      }`}
                    >
                      {formData.socialLogin.apple ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <KakaoIcon />
                    <span className="text-sm">카카오 로그인</span>
                    <button 
                      type="button"
                      onClick={() => handleSocialLoginToggle('kakao')}
                      className={`ml-auto px-3 py-1 border text-sm transition-colors rounded ${
                        formData.socialLogin.kakao 
                          ? 'bg-accent text-white border-accent hover:bg-accent/90' 
                          : 'border-border hover:bg-border/20'
                      }`}
                    >
                      {formData.socialLogin.kakao ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 휴대폰번호 */}
            <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
              <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                <span>휴대폰번호 <span className="text-accent">*</span></span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-sm">{phoneNumber}</span>
                  <button 
                    type="button"
                    onClick={() => handleEditClick('phone')}
                    className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>

            {/* 전화번호 */}
            <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
              <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                전화번호
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-sm">{homePhone}</span>
                  <button 
                    type="button"
                    onClick={() => handleEditClick('homePhone')}
                    className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>

            {/* 이메일 */}
            <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
              <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                <span>이메일 <span className="text-accent">*</span></span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 w-full">
                  <span className="text-sm">{email}</span>
                  <button 
                    type="button"
                    onClick={() => handleEditClick('email')}
                    className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>

            {/* 주소 헤더 */}
            <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
              <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                주소
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 w-full">
                  <button 
                    type="button"
                    onClick={() => handleEditClick('address')}
                    className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>

            {/* 주소 입력 */}
            <div className="px-4 lg:px-0 py-3 space-y-2">
              <div>
                <div className="flex gap-2">
                  <input 
                    placeholder="우편번호"
                    className="w-[120px] px-4 py-2 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                    value={formData.postCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postCode: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <input 
                  placeholder="기본주소"
                  className="w-full px-4 py-2 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div>
                <input 
                  placeholder="상세주소"
                  className="w-full px-4 py-2 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent border-border"
                  value={formData.detailAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, detailAddress: e.target.value }))}
                />
              </div>
            </div>

            {/* 생년월일 */}
            <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
              <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                <span>생년월일 <span className="text-accent">*</span></span>
              </div>
              <div className="flex-1">
                <span className="text-sm">{birthDate}</span>
              </div>
            </div>
          </div>

          {/* 수신동의 */}
          <div className="mt-6">
            <h4 className="px-4 lg:px-0 text-base font-semibold mb-2">수신동의</h4>
            <div className="space-y-3">
              {/* 개인 맞춤형 서비스 */}
              <div className="flex items-center gap-2 px-4 lg:px-0">
                <Checkbox
                  checked={formData.marketing.personalized}
                  onChange={(checked) => handleMarketingToggle('personalized')}
                  label="개인 맞춤형 서비스 활용 동의"
                />
                <span className="text-xs text-description">선택</span>
              </div>

              {/* 마케팅 활용 동의 */}
              <div className="px-4 lg:px-0">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    checked={formData.marketing.email || formData.marketing.sms || formData.marketing.call}
                    onChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        marketing: {
                          ...prev.marketing,
                          email: checked,
                          sms: checked,
                          call: checked
                        }
                      }));
                    }}
                    label="마케팅 활용 동의"
                  />
                </div>

                <div className="ml-7 space-y-2 bg-border/15 p-4 rounded">
                  <p className="text-xs text-description">
                    <span className="font-semibold">마케팅 정보 (광고) 수신 동의</span>
                  </p>
                  <div className="flex items-center gap-6">
                    <Checkbox
                      checked={formData.marketing.email}
                      onChange={(checked) => handleMarketingToggle('email')}
                      label="이메일"
                      labelClass="text-xs"
                      size="w-4 h-4"
                    />
                    <Checkbox
                      checked={formData.marketing.sms}
                      onChange={(checked) => handleMarketingToggle('sms')}
                      label="SMS"
                      labelClass="text-xs"
                      size="w-4 h-4"
                    />
                    <Checkbox
                      checked={formData.marketing.call}
                      onChange={(checked) => handleMarketingToggle('call')}
                      label="전화"
                      labelClass="text-xs"
                      size="w-4 h-4"
                    />
                  </div>
                  <p className="text-xs text-description">
                    심야 마케팅 정보 (광고) 수신 동의 (21~08시)
                  </p>
                  <div className="flex items-center gap-6">
                    <Checkbox
                      checked={formData.marketing.nightSms}
                      onChange={(checked) => handleMarketingToggle('nightSms')}
                      label="SMS"
                      labelClass="text-xs"
                      size="w-4 h-4"
                    />
                    <Checkbox
                      checked={formData.marketing.nightCall}
                      onChange={(checked) => handleMarketingToggle('nightCall')}
                      label="전화"
                      labelClass="text-xs"
                      size="w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* CJ 온니서비스 동의 */}
              <div className="flex items-center gap-2 px-4 lg:px-0">
                <Checkbox
                  checked={formData.marketing.cjService}
                  onChange={(checked) => handleMarketingToggle('cjService')}
                  label="CJ 온니서비스 동의"
                />
                <span className="text-xs text-description">선택</span>
                <button 
                  type="button"
                  onClick={() => console.log('Show terms')}
                  className="ml-auto text-xs text-description underline underline-offset-2"
                >
                  전문보기
                </button>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="px-4 lg:px-0 mt-6 flex items-center gap-3">
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 border border-border py-3 text-base hover:bg-border/20 transition-colors rounded"
            >
              취소
            </button>
            <button 
              type="submit"
              className="flex-1 bg-accent text-white py-3 text-base hover:bg-accent/90 transition-colors rounded"
            >
              저장
            </button>
          </div>
        </form>
      )}

      {activeTab === 'body' && (
        <div className="mt-4 px-4 lg:px-0">
          <p className="text-center text-description py-10">
            바디 정보 탭 내용이 여기에 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}

// 아이콘 컴포넌트들
const NaverIcon = () => (
  <div className="w-4 h-4 bg-[#03C75A] rounded flex items-center justify-center">
    <span className="text-white text-[10px] font-bold">N</span>
  </div>
);

const AppleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
    <path d="M11.621 14.985c-.868.522-1.651.009-2.434-.653-.802-.677-1.522-.708-2.364-.016-.565.463-1.085.839-1.735.839-1.205-.001-2.173-1.048-2.748-2.105-.922-1.693-.771-4.394.562-5.935.624-.722 1.466-1.115 2.334-1.115.556 0 .905.187 1.337.408.384.196.829.423 1.428.423.539 0 .935-.195 1.288-.369.456-.226.846-.42 1.478-.42 1.039 0 2.007.493 2.593 1.319l.232.337-.319.253c-.439.35-.988.787-.988 1.675 0 1.036.623 1.493 1.117 1.839.231.162.469.329.469.643 0 .234-.178.678-.486 1.157-.378.588-.865 1.188-1.474 1.196-.003 0-.007 0-.01 0-.397 0-.696-.167-1.03-.352zM11.182 2c.036.168.053.335.053.5 0 .596-.215 1.149-.605 1.558-.468.491-1.034.775-1.652.732-.032-.164-.048-.336-.048-.513 0-.572.249-1.183.691-1.685.22-.254.501-.465.837-.632.336-.164.654-.253.947-.264.037.101.061.202.074.304z" fill="currentColor"/>
  </svg>
);

const KakaoIcon = () => (
  <div className="w-4 h-4 bg-[#FEE500] rounded flex items-center justify-center">
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M5 1C2.8 1 1 2.44 1 4.2c0 1.14.76 2.14 1.9 2.7L2.6 8.4c-.04.14.1.26.24.2L4.6 7.3c.13 0 .26.02.4.02 2.2 0 4-.88 4-2.32C9 2.44 7.2 1 5 1z" fill="#3C1E1E"/>
    </svg>
  </div>
);

// TypeScript 타입 선언
declare global {
  interface Window {
    tailwind?: any;
  }
}