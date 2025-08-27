import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { Checkbox } from '@/components/ui/Checkbox';
import { AddressModal } from '@/components/ui/AddressModal';
import type { AddressData } from '@/components/ui/AddressModal';

export function meta() {
    return [
        {
            title: '마이존 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 마이존 페이지',
        },
    ];
}

/**
 * 해당 페이지 접근 시 check-pw로 리다이렉트 시킨 후 검증되면 다시 여기로 보내거나 기획에 따라 처리 필요
 */
export default function MyzoneProfile() {
    // 탭 상태
    const [activeTab, setActiveTab] = useState<'shopping' | 'body'>('shopping');

    return (
        <QuickMenuContents>
            <section className="poj2-myzone-profile grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-[180px_calc(100%-200px)] gap-4 lg:gap-5">
                {/* 네비게이션 */}
                <div className="max-lg:hidden border-r border-border">
                    <MyzonNavigation />
                </div>

                {/* 컨텐츠 */}
                <div className="lg:pt-10 pb-15 lg:pb-30">
                    {/* 상단 타이틀 */}
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
                            <span className={`flex items-center justify-center gap-1 w-full h-full ${activeTab === 'shopping' ? 'font-semibold border-b-2 border-current' : 'border-b border-border'}`}>쇼핑 정보</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('body')}
                            className="flex-1 block h-[50px]"
                        >
                            <span className={`flex items-center justify-center gap-1 w-full h-full ${activeTab === 'body' ? 'font-semibold border-b-2 border-current' : 'border-b border-border'}`}>바디 정보</span>
                        </button>
                    </nav>
                    {/* 컨텐츠 영역 */}
                    {activeTab === 'shopping' ? <ShoppingInfoForm /> : <BodyInfoSection />}
                </div>
            </section>
        </QuickMenuContents>
    );
}

// 쇼핑정보 폼
function ShoppingInfoForm() {
    // 주소 및 일부 수정 가능한 필드만 간단 검증
    const [zip, setZip] = useState('12345');
    const [addr1, setAddr1] = useState('서울특별시 광진구 긴고랑로');
    const [addr2, setAddr2] = useState('2층');

    // 표시값 상태 (변경 모달 확정 시 업데이트)
    const [mobile, setMobile] = useState('010-1234-5678');
    const [tel, setTel] = useState('02-123-4567');
    const [email, setEmail] = useState('test@naver.com');

    // 모달 오픈 상태
    const [openPw, setOpenPw] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    const [openTel, setOpenTel] = useState(false);
    const [openEmail, setOpenEmail] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);

    const [errors, setErrors] = useState<{ zip?: string; addr1?: string; addr2?: string }>({});

    // 마케팅/개인맞춤형 동의 (회원가입 페이지 패턴 재사용)
    const [agreements, setAgreements] = useState({
        personalized: false,
        marketing: false,
        email: false,
        sms: false,
        phone: false,
        nightSms: false,
        nightPhone: false,
        cjOnly: false,
    });

    const validate = () => {
        const next: typeof errors = {};
        if (!zip || !/^\d{5}$/.test(zip)) next.zip = '우편번호 5자리를 입력해주세요.';
        if (!addr1) next.addr1 = '기본주소를 입력해주세요.';
        if (!addr2) next.addr2 = '상세주소를 입력해주세요.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSave = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        console.log('쇼핑정보 저장', { zip, addr1, addr2, agreements });
    };

    return (
        <form
            onSubmit={onSave}
            className="mt-4"
        >
            {/* 타이틀 라인 */}
            <div className="px-4 lg:px-0">
                <div className="flex items-end justify-between pb-3 border-b border-border">
                    <h3 className="text-base lg:text-lg font-semibold">홍길동님의 쇼핑정보</h3>
                    <span className="text-xs text-accent">* 필수입력정보</span>
                </div>
            </div>

            {/* 정보 리스트 */}
            <div className="divide-y divide-border">
                {/* 아이디 */}
                <Row label="아이디">
                    <span className="text-sm">test</span>
                </Row>

                {/* 비밀번호 */}
                <Row label="비밀번호">
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-sm">********</span>
                        <button
                            type="button"
                            className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                            onClick={() => setOpenPw(true)}
                        >
                            변경
                        </button>
                    </div>
                </Row>

                {/* 로그인연동 */}
                <Row label="로그인연동">
                    <div className="flex flex-col gap-3 py-1">
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/icon/naver.png"
                                className="w-4 h-4 object-contain"
                            />
                            <span className="text-sm">네이버 로그인</span>
                            <button
                                type="button"
                                className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                            >
                                OFF
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/icon/apple.svg"
                                className="w-4 h-4 object-contain"
                            />
                            <span className="text-sm">애플로 로그인</span>
                            <button
                                type="button"
                                className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                            >
                                OFF
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <img
                                src="/images/icon/kakao.png"
                                className="w-4 h-4 object-contain"
                            />
                            <span className="text-sm">카카오 로그인</span>
                            <button
                                type="button"
                                className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                            >
                                OFF
                            </button>
                        </div>
                    </div>
                </Row>

                {/* 휴대폰번호 */}
                <Row
                    label={
                        <span>
                            휴대폰번호 <span className="text-accent">*</span>
                        </span>
                    }
                >
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-sm">{mobile}</span>
                        <button
                            type="button"
                            className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                            onClick={() => setOpenMobile(true)}
                        >
                            변경
                        </button>
                    </div>
                </Row>

                {/* 전화번호 */}
                <Row label="전화번호">
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-sm">{tel}</span>
                        <button
                            type="button"
                            className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                            onClick={() => setOpenTel(true)}
                        >
                            변경
                        </button>
                    </div>
                </Row>

                {/* 이메일 */}
                <Row
                    label={
                        <span>
                            이메일 <span className="text-accent">*</span>
                        </span>
                    }
                >
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-sm">{email}</span>
                        <button
                            type="button"
                            className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                            onClick={() => setOpenEmail(true)}
                        >
                            변경
                        </button>
                    </div>
                </Row>

                {/* 주소 */}
                <Row label="주소">
                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            className="ml-auto px-3 py-1 border border-border text-sm hover:bg-border/20 transition-colors rounded"
                            onClick={() => setOpenAddress(true)}
                        >
                            변경
                        </button>
                    </div>
                </Row>
                <div className="px-4 lg:px-0 py-3 space-y-2">
                    <div>
                        <div className="flex gap-2">
                            <input
                                value={zip}
                                onChange={(e) => {
                                    setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
                                    if (errors.zip) setErrors((prev) => ({ ...prev, zip: undefined }));
                                }}
                                placeholder="우편번호"
                                className={`w-[120px] px-4 py-2 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.zip ? 'border-discount' : 'border-border'}`}
                            />
                        </div>
                        {errors.zip && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.zip}</p>}
                    </div>
                    <div>
                        <input
                            value={addr1}
                            onChange={(e) => {
                                setAddr1(e.target.value);
                                if (errors.addr1) setErrors((prev) => ({ ...prev, addr1: undefined }));
                            }}
                            placeholder="기본주소"
                            className={`w-full px-4 py-2 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.addr1 ? 'border-discount' : 'border-border'}`}
                        />
                        {errors.addr1 && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.addr1}</p>}
                    </div>
                    <div>
                        <input
                            value={addr2}
                            onChange={(e) => {
                                setAddr2(e.target.value);
                                if (errors.addr2) setErrors((prev) => ({ ...prev, addr2: undefined }));
                            }}
                            placeholder="상세주소"
                            className={`w-full px-4 py-2 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent ${errors.addr2 ? 'border-discount' : 'border-border'}`}
                        />
                        {errors.addr2 && <p className="mt-1 text-xs lg:text-sm text-discount">{errors.addr2}</p>}
                    </div>
                </div>

                {/* 생년월일 */}
                <Row
                    label={
                        <span>
                            생년월일 <span className="text-accent">*</span>
                        </span>
                    }
                >
                    <span className="text-sm">********</span>
                </Row>
            </div>

            {/* 수신동의 */}
            <div className="mt-6">
                <h4 className="px-4 lg:px-0 text-base font-semibold mb-2">수신동의</h4>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-4 lg:px-0">
                        <Checkbox
                            checked={agreements.personalized}
                            onChange={(checked) => setAgreements((p) => ({ ...p, personalized: checked }))}
                            label="개인 맞춤형 서비스 활용 동의"
                            labelClassName="text-sm"
                            checkboxClassName="w-5 h-5"
                        />
                        <span className="text-xs text-description">선택</span>
                    </div>

                    {/* 마케팅 활용 동의 + 하위 옵션 */}
                    <div className="px-4 lg:px-0">
                        <div className="flex items-center gap-2 mb-2">
                            <Checkbox
                                checked={agreements.marketing}
                                onChange={(checked) => setAgreements((p) => ({ ...p, marketing: checked, email: checked, sms: checked, phone: checked, nightSms: checked && p.nightSms, nightPhone: checked && p.nightPhone }))}
                                label="마케팅 활용 동의"
                                labelClassName="text-sm"
                                checkboxClassName="w-5 h-5"
                            />
                        </div>
                        <div className="ml-7 space-y-2 bg-border/15 p-4 rounded">
                            <p className="text-xs text-description">
                                <span className="font-semibold">마케팅 정보 (광고) 수신 동의</span>
                            </p>
                            <div className="flex items-center gap-6">
                                <Checkbox
                                    checked={agreements.email}
                                    onChange={(c) => setAgreements((p) => ({ ...p, email: c }))}
                                    label="이메일"
                                    labelClassName="text-xs"
                                    checkboxClassName="w-4 h-4"
                                />
                                <Checkbox
                                    checked={agreements.sms}
                                    onChange={(c) => setAgreements((p) => ({ ...p, sms: c }))}
                                    label="SMS"
                                    labelClassName="text-xs"
                                    checkboxClassName="w-4 h-4"
                                />
                                <Checkbox
                                    checked={agreements.phone}
                                    onChange={(c) => setAgreements((p) => ({ ...p, phone: c }))}
                                    label="전화"
                                    labelClassName="text-xs"
                                    checkboxClassName="w-4 h-4"
                                />
                            </div>
                            <p className="text-xs text-description">심야 마케팅 정보 (광고) 수신 동의 (21~08시)</p>
                            <div className="flex items-center gap-6">
                                <Checkbox
                                    checked={agreements.nightSms}
                                    onChange={(c) => setAgreements((p) => ({ ...p, nightSms: c }))}
                                    label="SMS"
                                    labelClassName="text-xs"
                                    checkboxClassName="w-4 h-4"
                                />
                                <Checkbox
                                    checked={agreements.nightPhone}
                                    onChange={(c) => setAgreements((p) => ({ ...p, nightPhone: c }))}
                                    label="전화"
                                    labelClassName="text-xs"
                                    checkboxClassName="w-4 h-4"
                                />
                            </div>
                        </div>
                    </div>

                    {/* CJ 온니서비스 동의 */}
                    <div className="flex items-center gap-2 px-4 lg:px-0">
                        <Checkbox
                            checked={agreements.cjOnly}
                            onChange={(checked) => setAgreements((p) => ({ ...p, cjOnly: checked }))}
                            label="CJ 온니서비스 동의"
                            labelClassName="text-sm"
                            checkboxClassName="w-5 h-5"
                        />
                        <span className="text-xs text-description">선택</span>
                        <button
                            type="button"
                            className="ml-auto text-xs text-description underline underline-offset-2"
                        >
                            전문보기
                        </button>
                    </div>
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="px-4 lg:px-0 mt-6 flex items-center gap-3">
                <button
                    type="button"
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

            {/* 주소 변경 모달 */}
            <AddressModal
                isOpen={openAddress}
                onClose={() => setOpenAddress(false)}
                onAddressSave={(data: AddressData) => {
                    setZip(data.zipCode);
                    setAddr1(data.address);
                    setAddr2(data.detailAddress);
                }}
            />

            {/* 비밀번호 변경 모달 */}
            <PasswordChangeModal
                open={openPw}
                onClose={() => setOpenPw(false)}
                onChanged={() => setOpenPw(false)}
            />

            {/* 휴대폰 변경 모달 */}
            <MobileChangeModal
                open={openMobile}
                onClose={() => setOpenMobile(false)}
                onChanged={(newValue) => {
                    setMobile(newValue);
                    setOpenMobile(false);
                }}
            />

            {/* 전화번호 변경 모달 */}
            <TelChangeModal
                open={openTel}
                onClose={() => setOpenTel(false)}
                onChanged={(newValue) => {
                    setTel(newValue);
                    setOpenTel(false);
                }}
            />

            {/* 이메일 변경 모달 */}
            <EmailChangeModal
                open={openEmail}
                onClose={() => setOpenEmail(false)}
                onChanged={(newValue) => {
                    setEmail(newValue);
                    setOpenEmail(false);
                }}
            />
        </form>
    );
}

function MyzonNavigation() {
    return (
        <nav className="px-4 max-lg:py-4 max-lg:divide-y max-lg:divide-border">
            <h2 className="hidden lg:block text-4xl py-10">
                <Link to="/myzone">마이존</Link>
            </h2>
            {/* 주문현황 */}
            <div>
                <h3 className="max-lg:mb-2 text-lg font-bold">주문현황</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/myzone/orders?status=all"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M8.533 7.792h-1.2V5.783H4.867V18.05h12.266V5.783h-2.466v2.009h-1.2V5.783H8.533v2.009zm-1.2-3.209V2.75c0-.506.41-.917.917-.917h5.5c.506 0 .917.41.917.917v1.833h3.666V19.25H3.667V4.583h3.666zm6.134 0v-1.55H8.533v1.55h4.934z"
                                    />
                                </svg>
                                <span>주문/배송 조회</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/myzone/orders?status=cancelled"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M13.83 6.026l-1.236 1.03 5.803.861-.083-5.625-1.186.987.035 2.36a7.864 7.864 0 0 0-6.205-3.03c-4.361 0-7.891 3.554-7.891 7.933v.6h1.2v-.6c0-3.722 2.999-6.734 6.691-6.734a6.664 6.664 0 0 1 5.262 2.573l-2.39-.355zm-2.533 13.366c4.362 0 7.892-3.555 7.892-7.934v-.6h-1.2v.6c0 3.722-3 6.734-6.692 6.734a6.665 6.665 0 0 1-5.261-2.573l2.39.355 1.235-1.03-5.802-.861.083 5.625 1.186-.987-.035-2.36a7.864 7.864 0 0 0 6.204 3.03z"
                                    />
                                </svg>
                                <span>취소/교환/반품 조회</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* 나의혜택 */}
            <div className="pt-8 lg:pt-2">
                <h3 className="max-lg:mb-2 text-lg font-bold">나의 혜택</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/myzone/credit"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M19.62 3.754H2.38v14.492h9.22v-1.2H3.58V8.392h14.84V11.6h1.2V3.754zm-1.2 3.438V4.954H3.58v2.238h14.84zm1.288 9.995c0 .633-.492 1.146-1.1 1.146-.607 0-1.1-.513-1.1-1.145 0-.633.493-1.146 1.1-1.146.608 0 1.1.513 1.1 1.145zm-6.233-3.437c.607 0 1.1-.513 1.1-1.146 0-.633-.492-1.146-1.1-1.146-.607 0-1.1.513-1.1 1.146 0 .633.492 1.146 1.1 1.146zm.733 4.057l4.516-4.515-.849-.849-4.515 4.515.848.849z"
                                    />
                                </svg>
                                <span>적립금</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/myzone/coupon"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M18.508 5.783H3.492v10.434h15.016V5.783zm-16.216-1.2v12.834h17.416V4.583H2.292zm10.55 3.713c-.384 0-.643.236-.643.586v.353h.912s.03 2.995-.004 3.308c-.034.314-.114.825-.679 1.092-.462.22-.494.428-.523.615l-.004.03c-.04.251.007.284.192.238.724-.176 1.496-.466 1.886-1.179.212-.386.297-.806.297-1.442V9.235c.386-.005.665-.25.665-.586v-.353h-2.1zm-3.168 5.082c1.422 0 2.154-1.044 2.154-1.044s-.316-.395-.738-.395c-.198 0-.335.083-.48.17l-.003.003a1.558 1.558 0 0 1-.932.265c-.834 0-1.512-.716-1.512-1.597 0-.9.678-1.631 1.511-1.631.44 0 .68.147.891.277l.002.001c.157.096.294.18.476.18.375 0 .766-.416.766-.416s-.739-1.044-2.134-1.044c-1.467 0-2.572 1.132-2.572 2.633 0 1.481 1.105 2.598 2.572 2.598z"
                                    />
                                </svg>
                                <span>쿠폰</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* 나의활동 */}
            <div className="pt-8 lg:pt-2">
                <h3 className="max-lg:mb-2 text-lg font-bold">나의 활동</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/myzone/review"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M8.88 16.042l7.964-7.506 1.948-1.89-4.297-4.354-9.453 9.453-.917 4.297H8.88zm7.546-8.772l.662-.643-2.599-2.633-.67.67 2.607 2.606zM6.14 12.342l6.83-6.83L15.558 8.1l-7.154 6.743H5.608l.533-2.5zm-2.704 7.05h15v-1.2h-15v1.2z"
                                    />
                                </svg>
                                <span>나의 리뷰</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* 나의정보 */}
            <div className="pt-8 lg:pt-2">
                <h3 className="max-lg:mb-2 text-lg font-bold">나의 정보</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/myzone/profile"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M13.123 7.887a2.123 2.123 0 1 1-4.246 0 2.123 2.123 0 0 1 4.246 0zm1.2 0a3.323 3.323 0 1 1-6.646 0 3.323 3.323 0 0 1 6.646 0zm-6.915 6.715c.996-.699 2.29-1.095 3.648-1.084 1.358.011 2.641.429 3.618 1.143.974.712 1.559 1.651 1.723 2.62l1.183-.202c-.223-1.311-1.002-2.513-2.198-3.387-1.195-.873-2.726-1.36-4.316-1.374-1.59-.013-3.132.449-4.348 1.302-1.216.854-2.024 2.042-2.278 3.35l1.178.229c.188-.967.796-1.9 1.79-2.597z"
                                    />
                                </svg>
                                <span>개인정보수정</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/myzone/check-pw"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <g
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    >
                                        <path d="M11.056 13.605c-1.341-.01-2.618.38-3.598 1.069-.977.686-1.571 1.6-1.754 2.542l-1.178-.23c.25-1.282 1.043-2.452 2.243-3.294 1.2-.842 2.724-1.3 4.297-1.287a7.711 7.711 0 0 1 2.507.438l-.4 1.13a6.51 6.51 0 0 0-2.117-.368zM11 10.01a2.123 2.123 0 1 0 0-4.246 2.123 2.123 0 0 0 0 4.246zm0 1.2a3.323 3.323 0 1 0 0-6.646 3.323 3.323 0 0 0 0 6.646zM16.11 14.667l-1.868-1.868.849-.848 1.867 1.867 1.868-1.867.848.848-1.867 1.868 1.867 1.867-.848.849-1.868-1.868-1.867 1.867-.849-.848 1.868-1.867z" />
                                    </g>
                                </svg>
                                <span>회원탈퇴</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* 고객센터 */}
            <div className="pt-8 lg:pt-2">
                <h3 className="max-lg:mb-2 text-lg font-bold">고객센터</h3>
                <ul className="mt-1 mb-7">
                    <li>
                        <Link
                            to="/customer-center/inquiry"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.949 14.538h10.184V4.867H4.867v11.618l2.082-1.947zM3.667 19.25V3.667h14.666v12.071H7.423L3.666 19.25zm11-10.4H7.333v-1.2h7.334v1.2zm-7.334 3.208h5.042v-1.2H7.333v1.2z"
                                    />
                                </svg>
                                <span>고객센터 문의하기</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/customer-center/inquiry-history"
                            className="max-lg:font-semibold max-lg:py-1.5 text-sm flex items-center justify-between transition-colors hover:text-accent"
                        >
                            <div className="flex items-center gap-1.5">
                                <svg
                                    viewBox="0 0 22 22"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="block lg:hidden w-5 h-5 fill-current"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.949 14.538h10.184V4.867H4.867v11.618l2.082-1.947zM3.667 19.25V3.667h14.666v12.071H7.423L3.666 19.25zm11.6-11.998v4.665h-1.2V8.789l-1.088.272-.291-1.164 2.579-.645zM8.85 11.917V7.252l-2.579.645.291 1.164L7.65 8.79v3.128h1.2zm2.3-2.458a.6.6 0 0 1-.608-.607.6.6 0 0 1 .608-.602c.32 0 .607.27.607.602a.617.617 0 0 1-.607.607zm0 2.3a.6.6 0 0 1-.608-.608.6.6 0 0 1 .608-.601c.32 0 .607.27.607.601a.617.617 0 0 1-.607.608z"
                                    />
                                </svg>
                                <span>나의 문의내역</span>
                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                className="block lg:hidden w-6 h-6 fill-current"
                            >
                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

// 바디 정보 탭
function BodyInfoSection() {
    const [consented, setConsented] = useState(false);

    // 신체치수
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    // 라디오 그룹 상태
    const [bodyConcern, setBodyConcern] = useState<string | null>(null);
    const [shoeSize, setShoeSize] = useState<string | null>(null);
    const [footShape, setFootShape] = useState<string | null>(null);
    const [skinType, setSkinType] = useState<string | null>(null);
    const [skinConcern, setSkinConcern] = useState<string | null>(null);

    const requireConsent = () => {
        if (!consented) {
            alert('신체치수 및 사이즈정보의 이용동의가 필요합니다.');
            return true;
        }
        return false;
    };

    const sizes = ['220 이하', '225', '230', '235', '240', '245', '250', '255', '260', '265', '270', '275', '280', '285', '290', '295', '300', '305 이상'];
    const footShapes = ['보통형', '발볼 넓은형', '발볼 좁은형', '발등 높은형'];
    const skinTypes = ['지성', '건성', '복합성', '극건성', '중성', '수분부족지성'];
    const skinConcerns = ['모공', '주름', '트러블', '여드름', '피부손상', '홍조', '민감성', '피부건조'];
    const bodyConcerns = ['두꺼운 팔뚝', '불룩한 뱃살', '넓은 어깨', '통통 엉덩이', '굵은 허벅지', '없음'];

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!consented) {
            alert('신체치수 및 사이즈정보의 이용동의가 필요합니다.');
            return;
        }
        // TODO: 저장 API 연동
        console.log('바디정보 저장', { height, weight, bodyConcern, shoeSize, footShape, skinType, skinConcern });
    };

    return (
        <form
            onSubmit={onSubmit}
            className="px-4 lg:px-0 py-6"
        >
            {/* 사이즈 수집 및 이용동의 */}
            <div className="mb-6">
                <p className="mb-2 font-semibold">신체치수 및 피부정보</p>
                <div className="flex items-center justify-between">
                    <Checkbox
                        checked={consented}
                        onChange={setConsented}
                        label="사이즈 수집 및 이용동의"
                        labelClassName="text-sm"
                        checkboxClassName="w-4 h-4"
                    />
                    <button
                        type="button"
                        className="ml-auto text-xs text-description underline underline-offset-2"
                    >
                        전문보기
                    </button>
                </div>
            </div>

            {/* 신체치수 */}
            <section className="mb-6">
                <h4 className="mb-2 text-sm lg:text-base font-semibold">신체치수</h4>
                <ConsentGuard
                    active={consented}
                    onGuardClick={requireConsent}
                >
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                            <input
                                value={height}
                                onChange={(e) => setHeight(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                                placeholder="키"
                                className="w-full px-4 py-3 text-sm border border-border rounded placeholder-description focus:outline-none focus:border-accent"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-description text-sm">cm</span>
                        </div>
                        <div className="relative">
                            <input
                                value={weight}
                                onChange={(e) => setWeight(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                                placeholder="몸무게"
                                className="w-full px-4 py-3 text-sm border border-border rounded placeholder-description focus:outline-none focus:border-accent"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-description text-sm">kg</span>
                        </div>
                    </div>
                </ConsentGuard>
            </section>

            {/* 체형고민 */}
            <section className="mb-6">
                <h4 className="mb-2 text-sm lg:text-base font-semibold">체형고민</h4>
                <ConsentGuard
                    active={consented}
                    onGuardClick={requireConsent}
                >
                    <div className="grid grid-cols-3 gap-3">
                        {bodyConcerns.map((label) => {
                            const selected = bodyConcern === label;
                            return (
                                <button
                                    key={label}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => (consented ? setBodyConcern(label) : requireConsent())}
                                    className={`relative text-center w-full border rounded p-3 transition-colors ${selected ? 'border-accent' : 'border-border hover:border-accent'}`}
                                >
                                    {selected && <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center">✓</span>}
                                    <p className="text-sm font-medium mb-2">{label}</p>
                                    {/* 이미지 추출 불가로 자리표시자 대체 */}
                                    <div className="w-full h-20 bg-border/30 rounded flex items-center justify-center text-xs text-description">placeholder</div>
                                </button>
                            );
                        })}
                    </div>
                </ConsentGuard>
            </section>

            {/* 발 사이즈 */}
            <section className="mb-6">
                <h4 className="mb-2 text-sm lg:text-base font-semibold">발 사이즈</h4>
                <ConsentGuard
                    active={consented}
                    onGuardClick={requireConsent}
                >
                    <div className="grid grid-cols-4 gap-2">
                        {sizes.map((sz) => {
                            const selected = shoeSize === sz;
                            return (
                                <button
                                    key={sz}
                                    type="button"
                                    onClick={() => (consented ? setShoeSize(sz) : requireConsent())}
                                    className={`px-4 py-3 border rounded text-sm ${selected ? 'border-accent' : 'border-border hover:border-accent'}`}
                                >
                                    {sz}
                                </button>
                            );
                        })}
                    </div>
                </ConsentGuard>
            </section>

            {/* 발 모양 */}
            <section className="mb-6">
                <h4 className="mb-2 text-sm lg:text-base font-semibold">발 모양</h4>
                <ConsentGuard
                    active={consented}
                    onGuardClick={requireConsent}
                >
                    <div className="grid grid-cols-4 gap-2">
                        {footShapes.map((shape) => {
                            const selected = footShape === shape;
                            return (
                                <button
                                    key={shape}
                                    type="button"
                                    onClick={() => (consented ? setFootShape(shape) : requireConsent())}
                                    className={`px-4 py-3 border rounded text-sm ${selected ? 'border-accent' : 'border-border hover:border-accent'}`}
                                >
                                    {shape}
                                </button>
                            );
                        })}
                    </div>
                </ConsentGuard>
            </section>

            {/* 피부타입 */}
            <section className="mb-6">
                <h4 className="mb-2 text-sm lg:text-base font-semibold">피부타입</h4>
                <ConsentGuard
                    active={consented}
                    onGuardClick={requireConsent}
                >
                    <div className="grid grid-cols-3 gap-2">
                        {skinTypes.map((t) => {
                            const selected = skinType === t;
                            return (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => (consented ? setSkinType(t) : requireConsent())}
                                    className={`px-4 py-3 border rounded text-sm ${selected ? 'border-accent' : 'border-border hover:border-accent'}`}
                                >
                                    {t}
                                </button>
                            );
                        })}
                    </div>
                </ConsentGuard>
            </section>

            {/* 피부고민 */}
            <section className="mb-6">
                <h4 className="mb-2 text-sm lg:text-base font-semibold">피부고민</h4>
                <ConsentGuard
                    active={consented}
                    onGuardClick={requireConsent}
                >
                    <div className="grid grid-cols-4 gap-2">
                        {skinConcerns.map((c) => {
                            const selected = skinConcern === c;
                            return (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => (consented ? setSkinConcern(c) : requireConsent())}
                                    className={`px-4 py-3 border rounded text-sm ${selected ? 'border-accent' : 'border-border hover:border-accent'}`}
                                >
                                    {c}
                                </button>
                            );
                        })}
                    </div>
                </ConsentGuard>
            </section>

            {/* 하단 버튼 */}
            <div className="mt-6 flex items-center gap-3">
                <button
                    type="button"
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
    );
}

function ConsentGuard({ active, onGuardClick, children }: { active: boolean; onGuardClick: () => boolean; children: React.ReactNode }) {
    return (
        <div className={`relative ${active ? '' : 'opacity-60'}`}>
            {!active && (
                <button
                    type="button"
                    onClick={onGuardClick}
                    className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                    aria-label="consent-required-overlay"
                />
            )}
            {children}
        </div>
    );
}

// 공통 행 레이아웃
function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="px-4 lg:px-0 py-3 flex items-start gap-6">
            <div className="w-[90px] lg:w-[120px] shrink-0 text-sm font-semibold">{label}</div>
            <div className="flex-1">{children}</div>
        </div>
    );
}

function DialogModal({ open, title, children, onClose, onConfirm, confirmText = '확인', cancelText = '취소' }: { open: boolean; title?: string; children: ReactNode; onClose: () => void; onConfirm?: () => void; confirmText?: string; cancelText?: string }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
        >
            {/* dialog */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-md bg-white rounded border border-border shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <h3 className="text-lg font-semibold">{title}</h3>
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
                    {/* body */}
                    <div className="px-4 py-4">{children}</div>
                    {/* footer */}
                    <div className="px-4 py-3 flex items-center justify-end gap-2 border-t border-border">
                        <button
                            type="button"
                            className="px-4 py-2 text-sm font-semibold border border-border rounded transition-colors hover:bg-black/5"
                            onClick={onClose}
                        >
                            {cancelText}
                        </button>
                        {onConfirm && (
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-semibold text-accent border border-accent rounded transition-colors hover:bg-accent hover:text-white"
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// 비밀번호 변경 모달
function PasswordChangeModal({ open, onClose, onChanged }: { open: boolean; onClose: () => void; onChanged: () => void }) {
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [errors, setErrors] = useState<{ currentPw?: string; newPw?: string; confirmPw?: string }>({});

    const pwRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,12}$/;
    const validate = () => {
        const next: typeof errors = {};
        if (!currentPw) next.currentPw = '현재 비밀번호를 입력해 주세요.';
        if (!pwRule.test(newPw)) next.newPw = '8~12자, 영문/숫자/특수문자 조합으로 입력해 주세요.';
        if (newPw !== confirmPw) next.confirmPw = '비밀번호가 일치하지 않습니다.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const confirm = () => {
        if (!validate()) return;
        onChanged();
    };

    return (
        <DialogModal
            open={open}
            title="비밀번호 변경"
            onClose={onClose}
            onConfirm={confirm}
            confirmText="변경"
        >
            <div className="space-y-3">
                <div>
                    <input
                        type="password"
                        value={currentPw}
                        onChange={(e) => {
                            setCurrentPw(e.target.value);
                            if (errors.currentPw) setErrors((p) => ({ ...p, currentPw: undefined }));
                        }}
                        placeholder="현재 비밀번호"
                        className={`w-full px-4 py-2 text-sm border placeholder-description focus:outline-none focus:border-accent rounded ${errors.currentPw ? 'border-discount' : 'border-border'}`}
                    />
                    {errors.currentPw && <p className="mt-1 text-xs text-discount">{errors.currentPw}</p>}
                </div>
                <div>
                    <input
                        type="password"
                        value={newPw}
                        onChange={(e) => {
                            setNewPw(e.target.value);
                            if (errors.newPw) setErrors((p) => ({ ...p, newPw: undefined }));
                        }}
                        placeholder="새 비밀번호 (8~12자, 영문/숫자/특수문자 조합)"
                        className={`w-full px-4 py-2 text-sm border placeholder-description focus:outline-none focus:border-accent rounded ${errors.newPw ? 'border-discount' : 'border-border'}`}
                    />
                    {errors.newPw && <p className="mt-1 text-xs text-discount">{errors.newPw}</p>}
                </div>
                <div>
                    <input
                        type="password"
                        value={confirmPw}
                        onChange={(e) => {
                            setConfirmPw(e.target.value);
                            if (errors.confirmPw) setErrors((p) => ({ ...p, confirmPw: undefined }));
                        }}
                        placeholder="새 비밀번호 확인"
                        className={`w-full px-4 py-2 text-sm border placeholder-description focus:outline-none focus:border-accent rounded ${errors.confirmPw ? 'border-discount' : 'border-border'}`}
                    />
                    {errors.confirmPw && <p className="mt-1 text-xs text-discount">{errors.confirmPw}</p>}
                </div>
                <ul className="text-xs text-description list-disc list-outside pl-4 space-y-0.5">
                    <li>영문자, 숫자, 특수문자 조합 8~12자리로 설정</li>
                    <li>계정 아이디와 4자리 이상 동일한 문자 불가</li>
                    <li>4회 이상 동일 문구와 숫자 사용 불가</li>
                </ul>
            </div>
        </DialogModal>
    );
}

// 공통: 타이머 훅
function useCountdown(active: boolean, seconds: number) {
    const [remain, setRemain] = useState(seconds);
    useEffect(() => {
        if (!active) return;
        setRemain(seconds);
        const id = setInterval(() => {
            setRemain((s) => {
                if (s <= 1) {
                    clearInterval(id);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [active, seconds]);
    const mm = Math.floor(remain / 60)
        .toString()
        .padStart(2, '0');
    const ss = (remain % 60).toString().padStart(2, '0');
    return { remain, label: `${mm}:${ss}` };
}

// 휴대폰 변경 모달
function MobileChangeModal({ open, onClose, onChanged }: { open: boolean; onClose: () => void; onChanged: (value: string) => void }) {
    const [value, setValue] = useState('');
    const [sent, setSent] = useState(false);
    const { remain, label } = useCountdown(sent, 180);
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | undefined>();

    const formatMobile = (v: string) => {
        const d = v.replace(/\D/g, '').slice(0, 11);
        if (d.length <= 3) return d;
        if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
        return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    };

    const send = () => {
        const digits = value.replace(/\D/g, '');
        if (!(digits.length === 10 || digits.length === 11)) {
            setError('휴대폰 번호를 정확히 입력해 주세요.');
            return;
        }
        setError(undefined);
        setSent(false);
        // 재시작 트릭
        setTimeout(() => setSent(true), 0);
    };

    const confirm = () => {
        if (!sent || remain === 0 || !/^\d{6}$/.test(code)) return;
        onChanged(formatMobile(value));
    };

    return (
        <DialogModal
            open={open}
            title="휴대폰번호 변경"
            onClose={onClose}
            onConfirm={confirm}
            confirmText="변경"
        >
            <div className="space-y-3">
                <p className="text-sm">휴대폰으로 인증번호를 받은 후 입력해주세요.</p>
                <div>
                    <div className="flex gap-2">
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="'-' 없이 숫자만 입력"
                            className={`flex-1 px-4 py-2 text-sm border placeholder-description focus:outline-none focus:border-accent rounded ${error ? 'border-discount' : 'border-border'}`}
                        />
                        <button
                            type="button"
                            onClick={send}
                            className="shrink-0 px-3 py-2 text-sm border border-border rounded hover:bg-black/5"
                        >
                            {sent ? '재전송' : '인증번호 전송'}
                        </button>
                    </div>
                    {error && <p className="mt-1 text-xs text-discount">{error}</p>}
                </div>
                {sent && (
                    <div>
                        <label className="block text-xs text-description mb-1">인증번호</label>
                        <div className="flex items-center gap-2">
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                placeholder="6자리"
                                className="flex-1 px-4 py-2 text-sm border border-border placeholder-description focus:outline-none focus:border-accent rounded"
                            />
                            <span className={`text-xs ${remain > 0 ? 'text-accent' : 'text-discount'}`}>{label}</span>
                        </div>
                    </div>
                )}
                <ul className="text-xs text-description list-disc list-outside pl-4 space-y-0.5">
                    <li>통신사 사정으로 번호 수신에 최대 10분이 소요될 수 있습니다.</li>
                </ul>
            </div>
        </DialogModal>
    );
}

// 전화번호 변경 모달
function TelChangeModal({ open, onClose, onChanged }: { open: boolean; onClose: () => void; onChanged: (value: string) => void }) {
    const [value, setValue] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | undefined>();

    const formatTel = (v: string) => {
        const d = v.replace(/\D/g, '').slice(0, 11);
        if (d.startsWith('02')) {
            if (d.length <= 2) return d;
            if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`;
            if (d.length <= 9) return `${d.slice(0, 2)}-${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
            return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`;
        }
        if (d.length <= 3) return d;
        if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
        if (d.length <= 10) return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(-4)}`;
        return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    };

    const confirm = () => {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 9) {
            setError('전화번호를 정확히 입력해 주세요.');
            return;
        }
        setError(undefined);
        onChanged(formatTel(value));
    };

    return (
        <DialogModal
            open={open}
            title="전화번호 변경"
            onClose={onClose}
            onConfirm={confirm}
            confirmText="변경"
        >
            <div className="space-y-3">
                <p className="text-sm">등록/변경할 자택번호를 입력해주세요.</p>
                <div>
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="'-' 없이 숫자만 입력"
                        className={`w-full px-4 py-2 text-sm border placeholder-description focus:outline-none focus:border-accent rounded ${error ? 'border-discount' : 'border-border'}`}
                    />
                    {error && <p className="mt-1 text-xs text-discount">{error}</p>}
                </div>
            </div>
        </DialogModal>
    );
}

// 이메일 변경 모달
function EmailChangeModal({ open, onClose, onChanged }: { open: boolean; onClose: () => void; onChanged: (value: string) => void }) {
    const [value, setValue] = useState('');
    const [sent, setSent] = useState(false);
    const { remain, label } = useCountdown(sent, 180);
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | undefined>();

    const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const send = () => {
        if (!emailRule.test(value)) {
            setError('이메일 형식을 확인해 주세요.');
            return;
        }
        setError(undefined);
        setSent(false);
        setTimeout(() => setSent(true), 0);
    };

    const confirm = () => {
        if (!sent || remain === 0 || !/^\d{6}$/.test(code)) return;
        onChanged(value);
    };

    return (
        <DialogModal
            open={open}
            title="이메일 변경"
            onClose={onClose}
            onConfirm={confirm}
            confirmText="변경"
        >
            <div className="space-y-3">
                <p className="text-sm">이메일로 인증번호를 받은 후 입력해주세요.</p>
                <div>
                    <div className="flex gap-2">
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="example@mail.com"
                            className={`flex-1 px-4 py-2 text-sm border placeholder-description focus:outline-none focus:border-accent rounded ${error ? 'border-discount' : 'border-border'}`}
                        />
                        <button
                            type="button"
                            onClick={send}
                            className="shrink-0 px-3 py-2 text-sm border border-border rounded hover:bg-black/5"
                        >
                            {sent ? '재전송' : '인증번호 전송'}
                        </button>
                    </div>
                    {error && <p className="mt-1 text-xs text-discount">{error}</p>}
                </div>
                {sent && (
                    <div>
                        <label className="block text-xs text-description mb-1">인증번호</label>
                        <div className="flex items-center gap-2">
                            <input
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                placeholder="6자리"
                                className="flex-1 px-4 py-2 text-sm border border-border placeholder-description focus:outline-none focus:border-accent rounded"
                            />
                            <span className={`text-xs ${remain > 0 ? 'text-accent' : 'text-discount'}`}>{label}</span>
                        </div>
                    </div>
                )}
                <ul className="text-xs text-description list-disc list-outside pl-4 space-y-0.5">
                    <li>10분 내에 이메일을 받지 못하시는 경우, 스팸메일함을 확인해주시거나 재전송 버튼을 눌러주세요.</li>
                </ul>
            </div>
        </DialogModal>
    );
}
