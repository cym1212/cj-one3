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

export default function FindIdResult() {
    const [searchParams] = useSearchParams();
    const foundId = searchParams.get('id');

    return (
        <QuickMenuContents>
            <div className="max-w-[500px] mx-auto mb-15 lg:mb-30 bg-white flex flex-col items-center lg:justify-center px-4">
                <div className="w-full">
                    {/* 타이틀 */}
                    <div className="mt-8 mb-8 lg:mt-14 lg:mb-10 border-b border-border">
                        <h1 className="text-xl lg:text-2xl font-semibold">아이디 찾기</h1>
                        <div className="mt-2 w-full h-px bg-border" />
                    </div>

                    {/* 결과 메시지 */}
                    <div className="text-center mb-8 lg:mb-10">
                        <p className="text-lg lg:text-xl font-semibold">고객님의 CJ ONSTYLE 아이디는</p>
                        <p className="text-lg lg:text-xl font-semibold">
                            <span className="text-accent">{foundId}</span>
                            <span>입니다.</span>
                        </p>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4">
                        <Link
                            to="/find-pw-gate-by-id"
                            className="block w-full py-3 text-base lg:text-lg text-accent font-semibold border border-accent rounded-md text-center hover:bg-accent hover:text-white transition-colors"
                        >
                            비밀번호 바로찾기
                        </Link>
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
