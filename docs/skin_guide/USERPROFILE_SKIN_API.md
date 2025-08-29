# UserProfile 컴포넌트 외부 스킨 API 가이드

## 컴포넌트 개요

UserProfile(사용자 프로필) 컴포넌트는 로그인한 사용자의 개인정보를 조회하고 수정하는 컴포넌트입니다. 기본 회원 정보, 커스텀 필드, 지갑 주소, 추천링크 등의 기능을 제공합니다.

**주요 특징:**
- 회원 정보 조회 및 수정
- 기본 필드 (아이디, 이름, 비밀번호, 전화번호, 이메일, 생년월일, 주소 등)
- 커스텀 필드 (var01~var10) 지원
- 계좌번호 및 주민등록번호 특수 입력 형태
- 지갑 주소 관리 (TRX, BSC)
- 추천링크 생성 및 복사
- 실시간 유효성 검사
- 수정 내용 하이라이트 표시
- 로딩 및 오류 상태 관리
- 반응형 디자인
- 다국어 지원
- 테마 색상 적용

## ComponentSkinProps 인터페이스

```typescript
interface ComponentSkinProps {
  data: {
    // 사용자 정보
    userInfo: {
      id?: string | number;
      insungId?: string;         // 로그인 아이디
      name?: string;
      phone?: string;
      email?: string;
      birthdate?: string;        // 생년월일 (ISO 형식)
      birthday?: string;         // 생년월일 (대체 필드)
      address?: string;
      created_at?: string;       // 가입일
      company_id?: number;
      var01?: string;            // 커스텀 필드 1
      var02?: string;            // 커스텀 필드 2
      var03?: string;            // 커스텀 필드 3
      var04?: string;            // 커스텀 필드 4
      var05?: string;            // 커스텀 필드 5
      var06?: string;            // 커스텀 필드 6
      var07?: string;            // 커스텀 필드 7
      var08?: string;            // 커스텀 필드 8
      var09?: string;            // 커스텀 필드 9
      var10?: string;            // 커스텀 필드 10
      trxWithdrawAddress?: string; // TRX 지갑 주소
      bscWithdrawAddress?: string; // BSC 지갑 주소
    } | null;
    
    // 편집 중인 정보
    editedInfo: {
      name?: string;
      phone?: string;
      email?: string;
      birthday?: string;
      address?: string;
      password?: string;         // 새 비밀번호
      passwordConfirm?: string;  // 비밀번호 확인
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
    };
    
    // 상태 정보
    loading: boolean;                    // 저장/로딩 상태
    errors: Record<string, string>;      // 필드별 오류 메시지
    showPasswordFields: boolean;         // 비밀번호 필드 표시 여부
    isUserLoggedIn: boolean;            // 사용자 로그인 상태
    isAdminMode: boolean;               // 관리자 모드 여부
    isEditing: boolean;                 // 수정 모드 여부
    saveError: string | null;           // 저장 오류 메시지
    highlightedFields: Record<string, boolean>; // 수정된 필드 하이라이트
    referralLink: string;               // 추천링크 URL
    userInfoLoading: boolean;           // 사용자 정보 로딩 상태
    copied: boolean;                    // 클립보드 복사 상태
    
    // 필드 설정
    varFields: {
      var01?: {
        show: boolean;
        label: string;
        type?: 'input' | 'select' | 'radio' | 'document' | 'account' | 'ssn';
        options?: Array<{ value: string; label: string }>;
        required?: boolean;
        content?: string;
      };
      var02?: { /* 동일한 구조 */ };
      var03?: { /* 동일한 구조 */ };
      var04?: { /* 동일한 구조 */ };
      var05?: { /* 동일한 구조 */ };
      var06?: { /* 동일한 구조 */ };
      var07?: { /* 동일한 구조 */ };
      var08?: { /* 동일한 구조 */ };
      var09?: { /* 동일한 구조 */ };
      var10?: { /* 동일한 구조 */ };
    };
    
    // 테마 및 전역 상태
    theme: Record<string, any>;
    withcookieData: {
      skin?: {
        theme?: {
          colorset?: {
            primary?: string;    // 주요 색상
            secondary?: string;  // 보조 색상
            tertiary?: string;   // 성공 색상
          };
        };
        companyId?: number;     // 회사 ID (지갑 주소 표시 조건)
      };
    };
  };
  
  actions: {
    // 필드 변경 처리
    handleFieldChange: (field: string, value: string) => void;
    
    // 프로필 업데이트
    handleUpdate: () => Promise<void>;
    handleSave: () => Promise<void>;     // handleUpdate와 동일
    
    // 편집 상태 관리
    handleEdit: () => void;              // 수정 모드 시작
    handleCancel: () => void;            // 수정 취소
    
    // 기타 액션
    togglePasswordChange: () => void;    // 비밀번호 변경 토글
    copyToClipboard: () => void;         // 추천링크 복사
  };
  
  options: {
    // 컴포넌트 옵션
    title?: string;                      // 컴포넌트 제목
    content?: Record<string, any>;       // 컨텐츠 설정
    style?: React.CSSProperties;         // 스타일
    
    // 기본 필드 표시 설정
    basicFields?: {
      userId: boolean;                   // 아이디 필드
      name: boolean;                     // 이름 필드
      password: boolean;                 // 비밀번호 필드
      phone: boolean;                    // 전화번호 필드
      email: boolean;                    // 이메일 필드
      birthday: boolean;                 // 생년월일 필드
      createdAt: boolean;                // 가입일 필드
      address: boolean;                  // 주소 필드
      referralLink: boolean;             // 추천링크 필드
    };
  };
  
  mode: 'production' | 'preview' | 'editor';
  
  utils: {
    t: (key: string) => string;                              // 다국어 함수
    navigate: (path: string) => void;                        // 페이지 이동
    formatCurrency: (amount: number, currency?: string) => string;
    formatDate: (date: string | Date, format?: string) => string;
    getAssetUrl: (path: string) => string;
    cx: (...classes: (string | undefined | null | false)[]) => string;
  };
  
  app: {
    user: any | null;                    // 현재 로그인 사용자
    settings: Record<string, any>;       // 앱 설정
    theme: any;                          // 전역 테마
    company?: {
      id: number;
    };
  };
  
  editor?: {
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
    dragHandleProps?: any;
  };
}
```

## Props 상세 설명

### data.userInfo
현재 로그인한 사용자의 정보를 담는 객체입니다:
- `id`: 사용자 고유 ID (문자열 또는 숫자)
- `insungId`: 로그인에 사용되는 아이디
- `name`: 사용자 이름
- `phone`: 전화번호
- `email`: 이메일 주소
- `birthdate` / `birthday`: 생년월일 (둘 중 하나 사용)
- `address`: 주소
- `created_at`: 가입일 (ISO 문자열)
- `var01~var10`: 커스텀 필드 값들
- `trxWithdrawAddress`: TRX 지갑 주소 (특정 회사에서만 사용)
- `bscWithdrawAddress`: BSC 지갑 주소

**중요 사항:**
- `userInfo`는 로그인하지 않은 경우 `null`일 수 있습니다
- 에디터 모드에서는 실제 사용자 정보가 로드되지 않을 수 있습니다

### data.editedInfo
사용자가 수정 중인 정보를 담는 객체입니다:
- 수정 모드에서만 값이 채워집니다
- `password`: 새로운 비밀번호 (빈 문자열이면 변경하지 않음)
- 나머지 필드는 `userInfo`와 동일한 구조

### data.varFields
커스텀 필드의 설정 정보입니다:
- `show`: 필드 표시 여부
- `label`: 필드 라벨 텍스트
- `type`: 입력 타입
  - `'input'`: 일반 텍스트 입력
  - `'select'`: 선택 목록
  - `'radio'`: 라디오 버튼
  - `'document'`: 문서 첨부
  - `'account'`: 계좌번호 입력 (은행 선택 + 계좌번호)
  - `'ssn'`: 주민등록번호 입력 (앞자리 + 뒷자리)
- `options`: 선택 목록 옵션들 (select, radio 타입에서 사용)
- `required`: 필수 입력 여부
- `content`: 추가 컨텐츠

### data.highlightedFields
수정 후 저장 시 변경된 필드들을 하이라이트 표시하기 위한 플래그입니다:
```typescript
// 예시: 이름과 전화번호가 변경된 경우
highlightedFields: {
  name: true,
  phone: true
}
```

### data.withcookieData
전역 설정 데이터입니다:
- `skin.theme.colorset`: 테마 색상 설정
  - `primary`: 주요 버튼 색상
  - `secondary`: 보조 버튼 색상  
  - `tertiary`: 성공/완료 버튼 색상
- `skin.companyId`: 회사 ID (지갑 주소 필드 표시 조건)

## Actions 상세 설명

### handleFieldChange(field, value)
사용자 입력 필드 값 변경을 처리합니다:
```typescript
// 일반 필드 변경
handleFieldChange('name', '홍길동');
handleFieldChange('email', 'user@example.com');

// 커스텀 필드 변경
handleFieldChange('var01', '커스텀 값');

// 계좌번호 형태의 필드 (은행코드|계좌번호)
handleFieldChange('var02', 'KB|123-456-789');

// 주민등록번호 형태의 필드 (앞자리-뒷자리)
handleFieldChange('var03', '990101-1234567');
```

### handleEdit()
수정 모드를 시작합니다:
- `isEditing`이 `true`로 변경됩니다
- 현재 사용자 정보가 `editedInfo`에 복사됩니다

### handleCancel()
수정을 취소합니다:
- `isEditing`이 `false`로 변경됩니다
- `editedInfo`가 초기화됩니다
- 오류 메시지가 제거됩니다

### handleSave() / handleUpdate()
수정된 정보를 저장합니다:
- 서버에 업데이트 요청을 보냅니다
- 성공 시 수정 모드가 종료되고 변경된 필드가 하이라이트됩니다
- 실패 시 오류 메시지가 표시됩니다

### copyToClipboard()
추천링크를 클립보드에 복사합니다:
- `referralLink` 값을 클립보드에 복사
- `copied` 상태가 잠시 `true`로 변경됨

## 특수 필드 처리

### 계좌번호 필드 (type: 'account')
은행 선택과 계좌번호 입력을 결합한 형태:
```typescript
// 값 형식: "은행코드|계좌번호"
// 예시: "KB|123-456-789"

const [bankCode, accountNumber] = fieldValue.split('|');

// 은행 코드 매핑
const bankMap = {
  'KB': 'KB국민은행',
  'SH': '신한은행',
  'WR': '우리은행',
  'HN': '하나은행',
  'NH': 'NH농협은행',
  'KP': '우체국',
  'IBK': 'IBK기업은행',
  'KDB': 'KDB산업은행',
  'SC': 'SC제일은행',
  'CT': '씨티은행',
  'DG': '대구은행',
  'BS': '부산은행',
  'GJ': '광주은행',
  'JJ': '제주은행',
  'JB': '전북은행',
  'KN': '경남은행',
  'KK': '카카오뱅크',
  'TS': '토스뱅크'
};
```

### 주민등록번호 필드 (type: 'ssn')
앞자리와 뒷자리를 분리한 입력 형태:
```typescript
// 값 형식: "앞자리-뒷자리"
// 예시: "990101-1234567"

const [ssnFront, ssnBack] = fieldValue.split('-');

// 앞자리는 일반 텍스트, 뒷자리는 password 타입으로 처리
```

### 지갑 주소 필드
특정 회사(companyId: 24, 26, 27)에서만 표시:
```typescript
// TRX 지갑 주소 (companyId === 24만)
if (withcookieData?.skin?.companyId === 24) {
  // trxWithdrawAddress 필드 표시
}

// BSC 지갑 주소 (companyId: 24, 26, 27)
if ([24, 26, 27].includes(withcookieData?.skin?.companyId)) {
  // bscWithdrawAddress 필드 표시
}
```

**중요:** 지갑 주소는 한 번 설정되면 수정할 수 없습니다 (disabled 처리)

## 생년월일 포맷팅

생년월일 데이터는 다양한 형태로 제공될 수 있습니다:
```typescript
// ISO 형식: "2023-01-01T00:00:00.000Z" → "2023-01-01"
// YYYY-MM-DD 형식: "2023-01-01" → "2023-01-01" (그대로)
// Date 객체: new Date() → "YYYY-MM-DD"

const formatBirthdate = (date: string | Date | undefined) => {
  if (!date) return '-';
  
  if (typeof date === 'string') {
    if (date.includes('T')) {
      return date.split('T')[0];
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
  }
  
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  
  return String(date);
};
```

## 스타일링 가이드

### 테마 색상 활용
```typescript
const colorSet = withcookieData?.skin?.theme?.colorset || {};
const primaryColor = colorSet?.primary || "#007bff";
const secondaryColor = colorSet?.secondary || "#6c757d";
const successColor = colorSet?.tertiary || "#28a745";

// 사용 예시
const buttonStyle = {
  backgroundColor: primaryColor,
  color: 'white'
};
```

### 하이라이트 효과
변경된 필드에 하이라이트 효과를 적용:
```typescript
const getHighlightedStyle = (fieldName: string) => {
  return highlightedFields[fieldName] ? {
    backgroundColor: '#e6f7ff',
    padding: '5px',
    borderRadius: '4px',
    transition: 'background-color 0.5s ease',
    animation: 'fadeHighlight 3s'
  } : {};
};
```

### 반응형 디자인
모바일 환경에서의 레이아웃 고려:
```css
@media (max-width: 768px) {
  .profile-row {
    flex-direction: column;
    gap: 5px;
  }
  
  .field-label {
    flex: none;
    font-size: 14px;
  }
  
  .field-value {
    flex: none;
    width: 100%;
  }
}
```

## 사용 예시

### 기본 사용법
```typescript
const BasicUserProfileSkin: React.FC<ComponentSkinProps> = (props) => {
  const { data, actions, options, utils } = props;
  const { t } = utils;
  
  const {
    userInfo,
    editedInfo,
    isEditing,
    loading,
    saveError,
    referralLink,
    copied,
    varFields
  } = data;
  
  const {
    handleFieldChange,
    handleEdit,
    handleCancel,
    handleSave,
    copyToClipboard
  } = actions;
  
  // 로그인하지 않은 경우
  if (!userInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>{t('로그인이 필요합니다.')}</p>
      </div>
    );
  }
  
  return (
    <div className="user-profile">
      <h2>{options.title || t('회원 정보')}</h2>
      
      {/* 수정/저장 버튼 */}
      <div className="button-container">
        {isEditing ? (
          <>
            <button onClick={handleCancel} disabled={loading}>
              {t('취소')}
            </button>
            <button onClick={handleSave} disabled={loading}>
              {loading ? t('저장 중...') : t('저장')}
            </button>
          </>
        ) : (
          <button onClick={handleEdit}>
            {t('수정')}
          </button>
        )}
      </div>
      
      {/* 오류 메시지 */}
      {saveError && (
        <div className="error-message">{saveError}</div>
      )}
      
      {/* 기본 필드들 */}
      <div className="profile-info">
        {/* 아이디 */}
        <div className="profile-row">
          <div className="field-label">{t('아이디')}</div>
          <div className="field-value">{userInfo.insungId}</div>
        </div>
        
        {/* 이름 */}
        <div className="profile-row">
          <div className="field-label">{t('이름')}</div>
          <div className="field-value">
            {isEditing ? (
              <input
                type="text"
                value={editedInfo.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
              />
            ) : (
              <span>{userInfo.name}</span>
            )}
          </div>
        </div>
        
        {/* 커스텀 필드 렌더링 */}
        {varFields.var01?.show && (
          <div className="profile-row">
            <div className="field-label">{t(varFields.var01.label)}</div>
            <div className="field-value">
              {/* 필드 타입에 따른 렌더링 */}
              {renderVarField('var01', varFields.var01, userInfo.var01, editedInfo.var01)}
            </div>
          </div>
        )}
      </div>
      
      {/* 추천링크 */}
      <div className="referral-section">
        <h3>{t('추천링크')}</h3>
        <div className="referral-input">
          <input type="text" value={referralLink} readOnly />
          <button onClick={copyToClipboard}>
            {copied ? t('복사됨!') : t('복사')}
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 계좌번호 필드 렌더링
```typescript
const renderAccountField = (fieldName: string, currentValue: string, editedValue: string) => {
  const [bankCode = '', accountNumber = ''] = 
    (editedValue || currentValue || '').split('|');
  
  return isEditing ? (
    <div style={{ display: 'flex', gap: '10px' }}>
      <select
        value={bankCode}
        onChange={(e) => {
          const newValue = `${e.target.value}|${accountNumber}`;
          handleFieldChange(fieldName, newValue);
        }}
      >
        <option value="">{t('은행 선택')}</option>
        <option value="KB">{t('KB국민은행')}</option>
        <option value="SH">{t('신한은행')}</option>
        {/* 기타 은행들... */}
      </select>
      <input
        type="text"
        placeholder={t('계좌번호 입력')}
        value={accountNumber}
        onChange={(e) => {
          const newValue = `${bankCode}|${e.target.value}`;
          handleFieldChange(fieldName, newValue);
        }}
      />
    </div>
  ) : (
    <span>
      {bankCode && accountNumber ? `${getBankName(bankCode)} ${accountNumber}` : '-'}
    </span>
  );
};
```

### 주민등록번호 필드 렌더링
```typescript
const renderSSNField = (fieldName: string, currentValue: string, editedValue: string) => {
  const [ssnFront = '', ssnBack = ''] = 
    (editedValue || currentValue || '').split('-');
  
  return isEditing ? (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <input
        type="text"
        placeholder={t('앞자리 (6자리)')}
        maxLength={6}
        value={ssnFront}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, '');
          const newValue = `${value}-${ssnBack}`;
          handleFieldChange(fieldName, newValue);
        }}
      />
      <span>-</span>
      <input
        type="password"
        placeholder={t('뒷자리 (7자리)')}
        maxLength={7}
        value={ssnBack}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, '');
          const newValue = `${ssnFront}-${value}`;
          handleFieldChange(fieldName, newValue);
        }}
      />
    </div>
  ) : (
    <span>{currentValue || '-'}</span>
  );
};
```

## 주의사항

### 1. 데이터 안전성
- `userInfo`는 `null`일 수 있으므로 항상 체크해야 합니다
- 에디터 모드에서는 실제 데이터가 로드되지 않을 수 있습니다

### 2. 지갑 주소 제한
- 지갑 주소는 특정 회사에서만 표시됩니다
- 한 번 설정된 지갑 주소는 수정할 수 없습니다

### 3. 커스텀 필드 처리
- `varFields` 설정에 따라 동적으로 필드를 렌더링해야 합니다
- 각 필드 타입에 맞는 적절한 입력 컨트롤을 제공해야 합니다

### 4. 오류 처리
- 네트워크 오류나 서버 오류에 대한 적절한 메시지를 표시해야 합니다
- 로딩 상태 동안 UI가 비활성화되어야 합니다

### 5. 접근성
- 모든 입력 필드에 적절한 라벨을 제공해야 합니다
- 키보드 네비게이션을 지원해야 합니다
- 스크린 리더를 위한 적절한 ARIA 속성을 사용해야 합니다