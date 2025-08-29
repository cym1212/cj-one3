import * as React from 'react';
const { useState, useEffect } = React;

// UserProfile API 인터페이스 정의
interface UserInfo {
  id?: string | number;
  insungId?: string;
  name?: string;
  phone?: string;
  email?: string;
  birthdate?: string;
  birthday?: string;
  address?: string;
  created_at?: string;
  company_id?: number;
  var01?: string;
  var02?: string;
  var03?: string;
  var04?: string;
  var05?: string;
  var06?: string;
  var07?: string;
  var08?: string;
  var09?: string;
  var10?: string;
  trxWithdrawAddress?: string;
  bscWithdrawAddress?: string;
}

interface EditedInfo {
  name?: string;
  phone?: string;
  email?: string;
  birthday?: string;
  address?: string;
  password?: string;
  passwordConfirm?: string;
  var01?: string;
  var02?: string;
  var03?: string;
  var04?: string;
  var05?: string;
  var06?: string;
  var07?: string;
  var08?: string;
  var09?: string;
  var10?: string;
  trxWithdrawAddress?: string;
  bscWithdrawAddress?: string;
}

interface VarFieldConfig {
  show: boolean;
  label: string;
  type?: 'input' | 'select' | 'radio' | 'document' | 'account' | 'ssn';
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  content?: string;
}

interface ComponentSkinProps {
  data: {
    userInfo: UserInfo | null;
    editedInfo: EditedInfo;
    loading: boolean;
    errors: Record<string, string>;
    showPasswordFields: boolean;
    isUserLoggedIn: boolean;
    isAdminMode: boolean;
    isEditing: boolean;
    saveError: string | null;
    highlightedFields: Record<string, boolean>;
    referralLink: string;
    userInfoLoading: boolean;
    copied: boolean;
    varFields: {
      var01?: VarFieldConfig;
      var02?: VarFieldConfig;
      var03?: VarFieldConfig;
      var04?: VarFieldConfig;
      var05?: VarFieldConfig;
      var06?: VarFieldConfig;
      var07?: VarFieldConfig;
      var08?: VarFieldConfig;
      var09?: VarFieldConfig;
      var10?: VarFieldConfig;
    };
    theme: Record<string, any>;
    withcookieData: {
      skin?: {
        theme?: {
          colorset?: {
            primary?: string;
            secondary?: string;
            tertiary?: string;
          };
        };
        companyId?: number;
      };
    };
  };
  actions: {
    handleFieldChange: (field: string, value: string) => void;
    handleUpdate: () => Promise<void>;
    handleSave: () => Promise<void>;
    handleEdit: () => void;
    handleCancel: () => void;
    togglePasswordChange: () => void;
    copyToClipboard: () => void;
  };
  options: {
    title?: string;
    content?: Record<string, any>;
    style?: React.CSSProperties;
    basicFields?: {
      userId?: boolean;
      name?: boolean;
      password?: boolean;
      phone?: boolean;
      email?: boolean;
      birthday?: boolean;
      createdAt?: boolean;
      address?: boolean;
      referralLink?: boolean;
      var01?: boolean;
      var02?: boolean;
      var03?: boolean;
      var04?: boolean;
      var05?: boolean;
      var06?: boolean;
      var07?: boolean;
      var08?: boolean;
      var09?: boolean;
      var10?: boolean;
    };
  };
  mode: 'production' | 'preview' | 'editor';
  utils: {
    t: (key: string) => string;
    navigate: (path: string) => void;
    formatCurrency: (amount: number, currency?: string) => string;
    formatDate: (date: string | Date, format?: string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: (string | undefined | null | false)[]) => string;
  };
  app: {
    user: any | null;
    settings: Record<string, any>;
    theme: any;
    company?: { id: number };
  };
  editor?: {
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    dragHandleProps?: any;
  };
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

// 기본 데이터 (개발/테스트용)
const defaultUserInfo: UserInfo = {
  id: 1,
  insungId: 'testuser',
  name: '홍길동',
  phone: '010-1234-5678',
  email: 'test@example.com',
  birthday: '1990-01-01',
  address: '서울특별시 강남구 테헤란로 123',
  created_at: '2020-01-01',
  var01: '계좌정보',
  var02: 'KB|123-456-789',
  var03: '990101-1******'
};

const defaultData = {
  userInfo: defaultUserInfo,
  editedInfo: {},
  loading: false,
  errors: {},
  showPasswordFields: false,
  isUserLoggedIn: true,
  isAdminMode: false,
  isEditing: false,
  saveError: null,
  highlightedFields: {},
  referralLink: 'https://example.com/refer/testuser',
  userInfoLoading: false,
  copied: false,
  varFields: {
    var01: { show: true, label: '추가정보', type: 'input' as const, required: false },
    var02: { show: true, label: '계좌번호', type: 'account' as const, required: false },
    var03: { show: true, label: '주민등록번호', type: 'ssn' as const, required: false }
  },
  theme: {},
  withcookieData: {
    skin: {
      theme: {
        colorset: {
          primary: '#640faf',
          secondary: '#6b7280',
          tertiary: '#28a745'
        }
      },
      companyId: 24
    }
  }
};

const defaultActions = {
  handleFieldChange: (field: string, value: string) => console.log('Field change:', field, value),
  handleUpdate: async () => console.log('Update'),
  handleSave: async () => console.log('Save'),
  handleEdit: () => console.log('Edit'),
  handleCancel: () => console.log('Cancel'),
  togglePasswordChange: () => console.log('Toggle password'),
  copyToClipboard: () => console.log('Copy to clipboard')
};

const defaultOptions = {
  title: '회원정보 수정',
  basicFields: {
    userId: true,
    name: true,
    password: true,
    phone: true,
    email: true,
    birthday: true,
    createdAt: true,
    address: true,
    referralLink: true,
    var01: true,
    var02: true,
    var03: true,
    var04: false,
    var05: false,
    var06: false,
    var07: false,
    var08: false,
    var09: false,
    var10: false
  }
};

const defaultUtils = {
  t: (key: string) => key,
  navigate: (path: string) => console.log('Navigate:', path),
  formatCurrency: (amount: number, currency = '원') => `${amount.toLocaleString()}${currency}`,
  formatDate: (date: string | Date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },
  getAssetUrl: (path: string) => path,
  cx: (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ')
};

const defaultApp = {
  user: defaultUserInfo,
  settings: {},
  theme: {},
  company: { id: 24 }
};

export default function MypageEditStandalone(props: Partial<ComponentSkinProps> = {}) {
  const {
    data = defaultData,
    actions = defaultActions,
    options = defaultOptions,
    mode = 'production',
    utils = defaultUtils,
    app = defaultApp,
    editor
  } = {
    ...{
      data: defaultData,
      actions: defaultActions,
      options: defaultOptions,
      mode: 'production' as const,
      utils: defaultUtils,
      app: defaultApp
    },
    ...props
  };

  // 지갑 탭 제거로 인한 상태 변경
  // const [activeTab, setActiveTab] = useState<'profile' | 'wallet'>('profile');

  // Tailwind CDN 자동 로드
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
                  'accent': data.withcookieData?.skin?.theme?.colorset?.primary || '#640faf',
                  'muted-foreground': '#6b7280',
                  'border': '#e5e7eb',
                  'muted': '#f3f4f6'
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
  }, [data.withcookieData]);

  // 유틸리티 함수들
  const formatBirthdate = (date: string | undefined) => {
    if (!date) return '-';
    if (date.includes('T')) return date.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    return String(date);
  };

  const getBankName = (bankCode: string) => {
    const bankMap: Record<string, string> = {
      'KB': 'KB국민은행',
      'SH': '신한은행',
      'WR': '우리은행',
      'HN': '하나은행',
      'NH': 'NH농협은행',
      'KP': '우체국',
      'IBK': 'IBK기업은행',
      'KDB': 'KDB산업은행',
      'SC': 'SC제일은행',
      'CT': '씨티은행'
    };
    return bankMap[bankCode] || bankCode;
  };

  const getHighlightedStyle = (fieldName: string) => {
    return data.highlightedFields[fieldName] ? {
      backgroundColor: '#e6f7ff',
      padding: '4px 8px',
      borderRadius: '4px',
      transition: 'background-color 0.5s ease'
    } : {};
  };

  // 특수 필드 렌더링 함수들
  const renderAccountField = (fieldName: string, currentValue: string, editedValue: string) => {
    const [bankCode = '', accountNumber = ''] = (editedValue || currentValue || '').split('|');
    
    if (data.isEditing) {
      return (
        <div className="flex gap-2">
          <select
            value={bankCode}
            onChange={(e) => {
              const newValue = `${e.target.value}|${accountNumber}`;
              actions.handleFieldChange(fieldName, newValue);
            }}
            className="px-3 py-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
          >
            <option value="">{utils.t('은행 선택')}</option>
            <option value="KB">{utils.t('KB국민은행')}</option>
            <option value="SH">{utils.t('신한은행')}</option>
            <option value="WR">{utils.t('우리은행')}</option>
            <option value="HN">{utils.t('하나은행')}</option>
            <option value="NH">{utils.t('NH농협은행')}</option>
          </select>
          <input
            type="text"
            placeholder={utils.t('계좌번호 입력')}
            value={accountNumber}
            onChange={(e) => {
              const newValue = `${bankCode}|${e.target.value}`;
              actions.handleFieldChange(fieldName, newValue);
            }}
            className="flex-1 px-3 py-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
          />
        </div>
      );
    }
    
    return (
      <span style={getHighlightedStyle(fieldName)}>
        {bankCode && accountNumber ? `${getBankName(bankCode)} ${accountNumber}` : '-'}
      </span>
    );
  };

  const renderSSNField = (fieldName: string, currentValue: string, editedValue: string) => {
    const [ssnFront = '', ssnBack = ''] = (editedValue || currentValue || '').split('-');
    
    if (data.isEditing) {
      return (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder={utils.t('앞자리 (6자리)')}
            maxLength={6}
            value={ssnFront}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              const newValue = `${value}-${ssnBack}`;
              actions.handleFieldChange(fieldName, newValue);
            }}
            className="w-24 px-3 py-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
          />
          <span>-</span>
          <input
            type="password"
            placeholder={utils.t('뒷자리 (7자리)')}
            maxLength={7}
            value={ssnBack}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              const newValue = `${ssnFront}-${value}`;
              actions.handleFieldChange(fieldName, newValue);
            }}
            className="w-32 px-3 py-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
          />
        </div>
      );
    }
    
    return (
      <span style={getHighlightedStyle(fieldName)}>
        {currentValue || '-'}
      </span>
    );
  };

  const renderVarField = (fieldName: string, config: VarFieldConfig, currentValue: string, editedValue: string) => {
    if (config.type === 'account') {
      return renderAccountField(fieldName, currentValue, editedValue);
    }
    
    if (config.type === 'ssn') {
      return renderSSNField(fieldName, currentValue, editedValue);
    }
    
    if (config.type === 'select' && config.options) {
      return data.isEditing ? (
        <select
          value={editedValue || currentValue || ''}
          onChange={(e) => actions.handleFieldChange(fieldName, e.target.value)}
          className="px-3 py-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
        >
          <option value="">{utils.t('선택해주세요')}</option>
          {config.options.map(option => (
            <option key={option.value} value={option.value}>
              {utils.t(option.label)}
            </option>
          ))}
        </select>
      ) : (
        <span style={getHighlightedStyle(fieldName)}>
          {config.options?.find(opt => opt.value === currentValue)?.label || currentValue || '-'}
        </span>
      );
    }
    
    // 기본 input 타입
    return data.isEditing ? (
      <input
        type="text"
        value={editedValue || currentValue || ''}
        onChange={(e) => actions.handleFieldChange(fieldName, e.target.value)}
        className="px-3 py-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
      />
    ) : (
      <span style={getHighlightedStyle(fieldName)}>
        {currentValue || '-'}
      </span>
    );
  };

  // 로그인하지 않은 경우
  if (!data.userInfo && data.isUserLoggedIn === false) {
    return (
      <div className="lg:pt-10 pb-15 lg:pb-30 text-center py-20">
        <p className="text-muted-foreground">{utils.t('로그인이 필요합니다.')}</p>
        <button 
          onClick={() => utils.navigate('/login')}
          className="mt-4 px-6 py-2 bg-accent text-white rounded hover:opacity-90"
        >
          {utils.t('로그인 하러 가기')}
        </button>
      </div>
    );
  }

  return (
    <div className="lg:pt-10 pb-15 lg:pb-30">
      {/* 원본 헤더 */}
      <div className="max-lg:hidden max-lg:px-4">
        <h2 className="text-2xl font-semibold">
          {options.title || utils.t('회원정보 수정')}
        </h2>
      </div>

      {/* 탭 제거 - 쇼핑 정보만 표시 */}

      {/* 오류 메시지 */}
      {data.saveError && (
        <div className="mt-3 mx-4 lg:mx-0 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {data.saveError}
        </div>
      )}

      {/* 프로필 정보 - 원본 스타일 */}
      {(
        <form className="mt-4">
          <div className="px-4 lg:px-0">
            <div className="flex items-end justify-between pb-3 border-b border-border">
              <h3 className="text-base lg:text-lg font-semibold">{data.userInfo?.name || '사용자'}님의 쇼핑정보</h3>
              <span className="text-xs text-accent">* 필수입력정보</span>
            </div>
          </div>

          <div className="divide-y divide-border">
            {/* 아이디 */}
            {options.basicFields?.userId && (
              <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
                <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                  아이디
                </div>
                <div className="flex-1">
                  <span className="text-sm" style={getHighlightedStyle('insungId')}>
                    {data.userInfo?.insungId || '-'}
                  </span>
                </div>
              </div>
            )}

            {/* 비밀번호 */}
            {options.basicFields?.password && (
              <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
                <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                  비밀번호
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-sm">********</span>
                    <button 
                      type="button"
                      onClick={actions.togglePasswordChange}
                      className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                    >
                      변경
                    </button>
                  </div>
                  {data.showPasswordFields && (
                    <div className="mt-3 space-y-2">
                      <input
                        type="password"
                        placeholder="새 비밀번호"
                        value={data.editedInfo.password || ''}
                        onChange={(e) => actions.handleFieldChange('password', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
                      />
                      <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={data.editedInfo.passwordConfirm || ''}
                        onChange={(e) => actions.handleFieldChange('passwordConfirm', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
                      />
                      {data.errors.password && (
                        <div className="text-xs text-red-600">{data.errors.password}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 휴대폰번호 */}
            {options.basicFields?.phone && (
              <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
                <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                  <span>휴대폰번호 <span className="text-accent">*</span></span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 w-full">
                    {data.isEditing ? (
                      <input
                        type="text"
                        value={data.editedInfo.phone || data.userInfo?.phone || ''}
                        onChange={(e) => actions.handleFieldChange('phone', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-border rounded focus:outline-none focus:border-accent"
                      />
                    ) : (
                      <span className="text-sm" style={getHighlightedStyle('phone')}>
                        {data.userInfo?.phone || '-'}
                      </span>
                    )}
                    <button 
                      type="button"
                      onClick={data.isEditing ? actions.handleCancel : actions.handleEdit}
                      className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                    >
                      {data.isEditing ? '취소' : '변경'}
                    </button>
                  </div>
                  {data.errors.phone && (
                    <div className="mt-1 text-xs text-red-600">{data.errors.phone}</div>
                  )}
                </div>
              </div>
            )}

            {/* 이메일 */}
            {options.basicFields?.email && (
              <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
                <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                  <span>이메일 <span className="text-accent">*</span></span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 w-full">
                    {data.isEditing ? (
                      <input
                        type="email"
                        value={data.editedInfo.email || data.userInfo?.email || ''}
                        onChange={(e) => actions.handleFieldChange('email', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-border rounded focus:outline-none focus:border-accent"
                      />
                    ) : (
                      <span className="text-sm" style={getHighlightedStyle('email')}>
                        {data.userInfo?.email || '-'}
                      </span>
                    )}
                    <button 
                      type="button"
                      onClick={data.isEditing ? actions.handleCancel : actions.handleEdit}
                      className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                    >
                      {data.isEditing ? '취소' : '변경'}
                    </button>
                  </div>
                  {data.errors.email && (
                    <div className="mt-1 text-xs text-red-600">{data.errors.email}</div>
                  )}
                </div>
              </div>
            )}

            {/* 주소 */}
            {options.basicFields?.address && (
              <>
                {/* 주소 헤더 */}
                <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
                  <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                    주소
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 w-full">
                      <button 
                        type="button"
                        onClick={data.isEditing ? actions.handleCancel : actions.handleEdit}
                        className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                      >
                        {data.isEditing ? '취소' : '변경'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 주소 입력 */}
                {data.isEditing ? (
                  <div className="px-4 lg:px-0 py-3 space-y-2">
                    <div>
                      <input 
                        placeholder="우편번호"
                        className="w-[120px] px-4 py-2 text-sm lg:text-base border placeholder-muted-foreground transition-colors focus:outline-none focus:border-accent border-border"
                        value={data.editedInfo.postCode || ''}
                        onChange={(e) => actions.handleFieldChange('postCode', e.target.value)}
                      />
                    </div>
                    <div>
                      <input 
                        placeholder="기본주소"
                        className="w-full px-4 py-2 text-sm lg:text-base border placeholder-muted-foreground transition-colors focus:outline-none focus:border-accent border-border"
                        value={data.editedInfo.address || data.userInfo?.address || ''}
                        onChange={(e) => actions.handleFieldChange('address', e.target.value)}
                      />
                    </div>
                    <div>
                      <input 
                        placeholder="상세주소"
                        className="w-full px-4 py-2 text-sm lg:text-base border placeholder-muted-foreground transition-colors focus:outline-none focus:border-accent border-border"
                        value={data.editedInfo.detailAddress || ''}
                        onChange={(e) => actions.handleFieldChange('detailAddress', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="px-4 lg:px-0 py-3">
                    <span className="text-sm" style={getHighlightedStyle('address')}>
                      {data.userInfo?.address || '-'}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* 생년월일 */}
            {options.basicFields?.birthday && (
              <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
                <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                  <span>생년월일 <span className="text-accent">*</span></span>
                </div>
                <div className="flex-1">
                  {data.isEditing ? (
                    <input
                      type="date"
                      value={data.editedInfo.birthday || data.userInfo?.birthday || data.userInfo?.birthdate || ''}
                      onChange={(e) => actions.handleFieldChange('birthday', e.target.value)}
                      className="px-3 py-2 border border-border rounded text-sm focus:outline-none focus:border-accent"
                    />
                  ) : (
                    <span className="text-sm" style={getHighlightedStyle('birthday')}>
                      {formatBirthdate(data.userInfo?.birthday || data.userInfo?.birthdate)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 가입일 */}
            {options.basicFields?.createdAt && data.userInfo?.created_at && (
              <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
                <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                  가입일
                </div>
                <div className="flex-1">
                  <span className="text-sm">
                    {utils.formatDate(data.userInfo.created_at)}
                  </span>
                </div>
              </div>
            )}

            {/* 커스텀 필드들 - 속성 패널에서 제어 가능 */}
            {Object.entries(data.varFields).map(([fieldName, config]) => {
              // varFields의 show 속성과 basicFields 옵션 모두 확인
              const isFieldVisible = config?.show && (options.basicFields as any)?.[fieldName] !== false;
              if (!isFieldVisible) return null;
              
              const currentValue = (data.userInfo as any)?.[fieldName] || '';
              const editedValue = (data.editedInfo as any)?.[fieldName] || '';
              
              return (
                <div key={fieldName} className="px-4 lg:px-0 py-3 flex items-start gap-6">
                  <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">
                    <span>
                      {utils.t(config.label)}
                      {config.required && <span className="text-accent"> *</span>}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 w-full">
                      {renderVarField(fieldName, config, currentValue, editedValue)}
                      {!data.isEditing && (
                        <button 
                          type="button"
                          onClick={actions.handleEdit}
                          className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                        >
                          변경
                        </button>
                      )}
                    </div>
                    {data.errors[fieldName] && (
                      <div className="mt-1 text-xs text-red-600">
                        {data.errors[fieldName]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 추천링크 섹션 */}
          {options.basicFields?.referralLink && data.referralLink && (
            <div className="mt-6">
              <div className="px-4 lg:px-0">
                <div className="pb-3 border-b border-border">
                  <h4 className="text-base font-semibold">추천링크</h4>
                </div>
              </div>
              
              <div className="px-4 lg:px-0 py-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.referralLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-border rounded text-sm bg-muted"
                  />
                  <button
                    type="button"
                    onClick={actions.copyToClipboard}
                    className="px-4 py-2 bg-accent text-white rounded text-sm hover:opacity-90"
                  >
                    {data.copied ? '복사됨!' : '복사'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="px-4 lg:px-0 mt-6 flex items-center gap-3">
            <button 
              type="button"
              onClick={actions.handleCancel}
              className="flex-1 border border-border py-3 text-base hover:bg-border/20 transition-colors rounded"
            >
              취소
            </button>
            <button 
              type="button"
              onClick={actions.handleSave}
              disabled={data.loading}
              className="flex-1 bg-accent text-white py-3 text-base hover:opacity-90 transition-colors rounded disabled:opacity-50"
            >
              {data.loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// TypeScript 타입 선언
declare global {
  interface Window {
    tailwind?: any;
  }
}