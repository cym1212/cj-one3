import { Link, useSearchParams } from 'react-router';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';

export function meta() {
    return [
        {
            title: '아이디 찾기 결과 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 아이디 찾기 결과 페이지',
        },
    ];
}

export default function FindPwResult() {
    const [searchParams] = useSearchParams();
    const foundId = searchParams.get('id');

    return (
        <QuickMenuContents>
            <div className="max-w-[500px] mx-auto mb-15 lg:mb-30 bg-white flex flex-col items-center lg:justify-center px-4">
                <div className="w-full">
                    {/* 타이틀 */}
                    <div className="mt-8 mb-8 lg:mt-14 lg:mb-10 border-b border-border">
                        <h1 className="text-xl lg:text-2xl font-semibold">비밀번호 찾기</h1>
                        <div className="mt-2 w-full h-px bg-border" />
                    </div>

                    {/* 결과 메시지 */}
                    <div className="text-center mb-8 lg:mb-10">
                        <p className="text-lg lg:text-xl font-semibold">
                            <span className="text-accent">{foundId}</span> 님의 비밀번호가
                        </p>
                        <p className="text-lg lg:text-xl font-semibold">성공적으로 변경되었습니다.</p>
                        <p className="text-xs lg:text-sm text-description mt-4 lg:mt-5">로그인시, 새로운 비밀번호로 로그인하여 주시기 바랍니다.</p>
                    </div>

                    {/* 버튼 영역 */}
                    <div>
                        <Link
                            to="/login"
                            className="block w-full py-3 text-base lg:text-lg text-white font-semibold bg-accent rounded-md text-center hover:bg-accent/90 transition-colors"
                        >
                            로그인
                        </Link>
                    </div>
                </div>
            </div>
        </QuickMenuContents>
    );
}
