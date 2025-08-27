import { Link } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';

export function meta() {
    return [
        {
            title: '회원가입 완료 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 회원가입 완료 페이지',
        },
    ];
}

export default function RegisterResult() {
    return (
        <QuickMenuContents>
            <div className="max-w-[600px] mx-auto mb-15 lg:mb-30 bg-white px-4">
                <div className="w-full">
                    {/* 타이틀 */}
                    <div className="mt-8 mb-8 lg:mt-14 lg:mb-10 border-b border-border">
                        <h1 className="text-xl lg:text-2xl font-semibold">회원가입 완료</h1>
                        <div className="mt-2 w-full h-px bg-border" />
                    </div>

                    {/* 완료 메시지 */}
                    <div className="text-center mb-10 lg:mb-12">
                        <div className="mb-6 lg:mb-8">
                            {/* 성공 아이콘 */}
                            <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 lg:mb-6 bg-accent rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 lg:w-10 lg:h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">CJ온스타일 회원가입이 완료되었습니다!</h2>
                            <p className="text-sm lg:text-base text-description">
                                CJ ENM 통합회원으로 가입해주셔서 감사합니다.
                                <br />
                                다양한 혜택과 서비스를 만나보세요.
                            </p>
                        </div>

                        {/* 혜택 안내 */}
                        <div className="bg-border/25 rounded-lg p-4 lg:p-6 mb-8 lg:mb-10">
                            <h3 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">신규회원 혜택</h3>
                            <div className="space-y-2 text-sm lg:text-base text-left">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></span>
                                    <span>회원가입 축하 쿠폰 지급 (최대 10% 할인)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></span>
                                    <span>첫 구매 시 추가 적립금 5% 지급</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></span>
                                    <span>생일 특별 할인 쿠폰 제공</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></span>
                                    <span>전국 무료배송 서비스 이용</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="space-y-3 lg:space-y-0 lg:flex lg:gap-4">
                        <Link
                            to="/"
                            className="block w-full py-3 text-base lg:text-lg text-accent font-semibold border border-accent rounded-md text-center hover:bg-accent hover:text-white transition-colors"
                        >
                            쇼핑하러 가기
                        </Link>
                        <Link
                            to="/login"
                            className="block w-full py-3 text-base lg:text-lg text-white font-semibold bg-accent rounded-md text-center hover:bg-accent/90 transition-colors"
                        >
                            로그인
                        </Link>
                    </div>

                    {/* 안내 정보 */}
                    <div className="mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-border">
                        <div className="text-center text-xs lg:text-sm text-description space-y-2">
                            <p>
                                회원가입과 관련하여 문의사항이 있으시면
                                <br />
                                CJ ONSTYLE 고객센터 <span className="text-accent">1644-2525</span>로 연락주세요.
                            </p>
                            <p className="text-xs text-description">(평일 09:00~18:00, 주말 및 공휴일 제외)</p>
                        </div>
                    </div>
                </div>
            </div>
        </QuickMenuContents>
    );
}
