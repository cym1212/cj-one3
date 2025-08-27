import { useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

import { Checkbox } from '@/components/ui/Checkbox';

export interface AddressData {
    recipientName: string;
    zipCode: string;
    address: string;
    detailAddress: string;
    phonePrefix: string;
    phoneNumber: string;
    entryMethod: string;
    entryDetail: string;
}

interface AddressErrors {
    recipientName: string;
    address: string;
    detailAddress: string;
    phoneNumber: string;
}

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddressSave?: (addressData: AddressData) => void;
}

export function AddressModal({ isOpen, onClose, onAddressSave }: AddressModalProps) {
    const [addressData, setAddressData] = useState<AddressData>({
        recipientName: '',
        zipCode: '',
        address: '',
        detailAddress: '',
        phonePrefix: '010',
        phoneNumber: '',
        entryMethod: '자유출입가능',
        entryDetail: '',
    });

    const [addressErrors, setAddressErrors] = useState<AddressErrors>({
        recipientName: '',
        address: '',
        detailAddress: '',
        phoneNumber: '',
    });

    const [useDetailEntry, setUseDetailEntry] = useState(false);
    const [setAsDefault, setSetAsDefault] = useState(false);

    const open = useDaumPostcodePopup();

    const phonePrefixes = ['010', '011', '016', '017', '019'];
    const entryMethods = ['자유출입가능', '경비실 호출', '공동현관 비밀번호', '기타사항'];

    const handleAddressSearch = () => {
        open({
            onComplete: (data: any) => {
                let fullAddress = data.address;
                let extraAddress = '';

                if (data.addressType === 'R') {
                    if (data.bname !== '') {
                        extraAddress += data.bname;
                    }
                    if (data.buildingName !== '') {
                        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
                    }
                    fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
                }

                setAddressData((prev) => ({
                    ...prev,
                    zipCode: data.zonecode,
                    address: fullAddress,
                }));

                // 주소 에러 제거
                if (addressErrors.address) {
                    setAddressErrors((prev) => ({ ...prev, address: '' }));
                }
            },
        });
    };

    const handleInputChange = (field: keyof AddressData, value: string) => {
        setAddressData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // 에러 제거
        if (addressErrors[field as keyof AddressErrors]) {
            setAddressErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors: AddressErrors = {
            recipientName: '',
            address: '',
            detailAddress: '',
            phoneNumber: '',
        };

        if (!addressData.recipientName.trim()) {
            newErrors.recipientName = '받는 사람을 입력해주세요.';
        }

        if (!addressData.address.trim()) {
            newErrors.address = '주소를 입력해주세요.';
        }

        if (!addressData.detailAddress.trim()) {
            newErrors.detailAddress = '상세주소를 입력해주세요.';
        }

        if (!addressData.phoneNumber.trim()) {
            newErrors.phoneNumber = '전화번호를 입력해주세요.';
        } else if (!/^\d{8}$/.test(addressData.phoneNumber)) {
            newErrors.phoneNumber = '전화번호는 8자리 숫자로 입력해주세요.';
        }

        setAddressErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== '');
    };

    const handleSave = () => {
        if (validateForm()) {
            console.log('배송지 저장:', {
                addressData,
                useDetailEntry,
                setAsDefault,
            });
            // 저장된 주소 정보를 부모 컴포넌트로 전달
            onAddressSave?.(addressData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-lg shadow-lg max-h-[550px] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 모달 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-semibold">주소입력</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-description hover:text-black"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            className="w-6 h-6 fill-current"
                        >
                            <path d="M480-437.85 277.08-234.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L437.85-480 234.92-682.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69L480-522.15l202.92-202.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08 0 12.38-8.69 21.08L522.15-480l202.93 202.92q8.3 8.31 8.5 20.89.19 12.57-8.5 21.27-8.7 8.69-21.08 8.69-12.38 0-21.08-8.69L480-437.85Z" />
                        </svg>
                    </button>
                </div>

                {/* 스크롤 가능한 컨텐츠 영역 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {/* 받는 사람 */}
                    <div>
                        <input
                            type="text"
                            placeholder="받는 사람"
                            value={addressData.recipientName}
                            onChange={(e) => handleInputChange('recipientName', e.target.value)}
                            className={`w-full px-4 py-3 text-sm border placeholder-description transition-colors focus:outline-none focus:border-accent ${addressErrors.recipientName ? 'border-discount' : 'border-border'}`}
                        />
                        {addressErrors.recipientName && <p className="mt-1 text-sm text-discount">{addressErrors.recipientName}</p>}
                    </div>

                    {/* 주소 찾기 */}
                    <div className="space-y-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={addressData.zipCode}
                                    readOnly
                                    className="w-full px-4 py-3 text-sm border border-border bg-border/10 text-description"
                                />
                                <div className="shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleAddressSearch}
                                        className="flex items-center justify-between w-full px-4 py-3 text-sm border border-border bg-border/25 hover:bg-border/50 transition-colors"
                                    >
                                        <span className="text-description">주소 찾기</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 -960 960 960"
                                            className="w-5 h-5 fill-current text-accent"
                                        >
                                            <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {addressErrors.address && <p className="mt-1 text-sm text-discount">{addressErrors.address}</p>}
                        </div>
                        {/* 기본주소 (읽기 전용) */}
                        {addressData.address && (
                            <input
                                type="text"
                                value={addressData.address}
                                readOnly
                                className="w-full px-4 py-3 text-sm border border-border bg-border/10 text-description"
                            />
                        )}
                        {/* 상세주소 */}
                        <div>
                            <input
                                type="text"
                                placeholder="상세주소를 입력해주세요. (최대 20자)"
                                value={addressData.detailAddress}
                                onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                                maxLength={20}
                                className={`w-full px-4 py-3 text-sm border placeholder-description transition-colors focus:outline-none focus:border-accent ${addressErrors.detailAddress ? 'border-discount' : 'border-border'}`}
                            />
                            {addressErrors.detailAddress && <p className="mt-1 text-sm text-discount">{addressErrors.detailAddress}</p>}
                        </div>
                    </div>

                    {/* 전화번호 */}
                    <div>
                        <div className="flex gap-2">
                            <select
                                value={addressData.phonePrefix}
                                onChange={(e) => handleInputChange('phonePrefix', e.target.value)}
                                className="w-[100px] px-4 lg:px-5 py-2 text-sm appearance-none border border-border transition-colors focus:outline-none focus:border-accent bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_10px]"
                            >
                                {phonePrefixes.map((prefix) => (
                                    <option
                                        key={prefix}
                                        value={prefix}
                                    >
                                        {prefix}
                                    </option>
                                ))}
                            </select>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="없이 숫자만 입력해주세요."
                                    value={addressData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/[^0-9]/g, ''))}
                                    className={`w-full px-4 py-3 text-sm border placeholder-description transition-colors focus:outline-none focus:border-accent ${addressErrors.phoneNumber ? 'border-discount' : 'border-border'}`}
                                />
                            </div>
                        </div>
                        {addressErrors.phoneNumber && <p className="mt-1 text-sm text-discount">{addressErrors.phoneNumber}</p>}
                    </div>

                    {/* 출입방법 */}
                    <div>
                        <p className="mt-6 mb-2 font-semibold">출입방법</p>
                        <div>
                            <select
                                value={addressData.entryMethod}
                                onChange={(e) => handleInputChange('entryMethod', e.target.value)}
                                className="w-full px-4 py-3 text-sm border border-border bg-white focus:outline-none focus:border-accent appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[center_right_12px]"
                            >
                                {entryMethods.map((method) => (
                                    <option
                                        key={method}
                                        value={method}
                                    >
                                        {method}
                                    </option>
                                ))}
                            </select>

                            {addressData.entryMethod === '경비실 호출' && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="상세 내용을 입력해주세요. (최대 20자)"
                                        value={addressData.entryDetail}
                                        onChange={(e) => handleInputChange('entryDetail', e.target.value)}
                                        maxLength={20}
                                        className="w-full px-4 py-3 text-sm border border-border placeholder-description focus:outline-none focus:border-accent"
                                    />
                                </div>
                            )}

                            {addressData.entryMethod === '공동현관 비밀번호' && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="상세 내용을 입력해주세요. (최대 20자)"
                                        value={addressData.entryDetail}
                                        onChange={(e) => handleInputChange('entryDetail', e.target.value)}
                                        maxLength={20}
                                        className="w-full px-4 py-3 text-sm border border-border placeholder-description focus:outline-none focus:border-accent"
                                    />
                                    <div className="mt-3 space-y-1">
                                        <Checkbox
                                            checked={useDetailEntry}
                                            onChange={setUseDetailEntry}
                                            label="상세 출입정보 활용 안내"
                                            labelClassName="text-sm"
                                            checkboxClassName="w-4 h-4"
                                        />
                                        <div className="text-xs text-description p-3 space-y-0.5 bg-border/25 rounded">
                                            <p>1. 수집목적 : CJONSTYLE 배송서비스 제공</p>
                                            <p>2. 항목 : 공동현관 비밀번호</p>
                                            <p>3. 제공처 : 택배사</p>
                                            <p>4. 보유기간 : 회원탈퇴 또는 정정 삭제 시까지</p>
                                        </div>
                                        <p className="text-xs text-description mt-2">공동현관 비밀번호는 배송 목적으로 사용됩니다. 동의하지 않은 경우 바로도착 서비스 이용에 제한이 됩니다. 입력된 정보는 기준 배송지 정보에 저장됩니다.</p>
                                    </div>
                                </div>
                            )}

                            {addressData.entryMethod === '기타사항' && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="상세 내용을 입력해주세요. (최대 20자)"
                                        value={addressData.entryDetail}
                                        onChange={(e) => handleInputChange('entryDetail', e.target.value)}
                                        maxLength={20}
                                        className="w-full px-4 py-3 text-sm border border-border placeholder-description focus:outline-none focus:border-accent"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 기본배송지로 설정 체크박스 */}
                    <div className="pt-2">
                        <Checkbox
                            checked={setAsDefault}
                            onChange={setSetAsDefault}
                            label="기본배송지로 설정"
                            labelClassName="text-sm"
                            checkboxClassName="w-4 h-4"
                        />
                    </div>
                </div>

                {/* 모달 푸터 */}
                <div className="p-4 border-t border-border">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="w-full py-3 bg-accent text-white font-semibold hover:bg-accent/90 transition-colors"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}
