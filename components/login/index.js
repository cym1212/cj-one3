import React, { useState, useEffect } from 'react';
import './styles.css';

// Tailwind CDN 자동 로드
const loadTailwindCSS = () => {
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="cdn.tailwindcss.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://cdn.tailwindcss.com';
        script.async = true;
        document.head.appendChild(script);
    }
};

// SVG 아이콘 컴포넌트들
const KakaoIcon = () => (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <defs><path id="a" d="M0 0h16v16H0z"/></defs>
        <g fill="none" fillRule="evenodd">
            <path d="M8 1C3.582 1 0 3.873 0 7.416c0 2.278 1.481 4.279 3.713 5.417l-.754 2.86a.235.235 0 0 0 .055.239.227.227 0 0 0 .304.018l3.244-2.222c.466.068.947.103 1.438.103 4.418 0 8-2.872 8-6.415S12.418 1 8 1" fill="rgb(51,51,51)"/>
        </g>
    </svg>
);

const NaverIcon = () => (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <defs><path id="a" d="M0 0h16v16H0z"/></defs>
        <g fill="none" fillRule="evenodd">
            <path fill="#FFF" d="M10.314 1.55v6.9l-4.819-6.9H1.5v12.89h4.186V7.542l4.819 6.9H14.5V1.55z"/>
        </g>
    </svg>
);

const Login = (props) => {
    // Props 구조 분해 with 기본값
    const {
        data = {},
        actions = {},
        utils = {},
        app = {},
        mode = 'production',
        options = {},
        editor = {}
    } = props || {};

    // Data 추출 with 기본값
    const {
        formData = { user_id: '', password: '' },
        validationErrors = {},
        loading = false,
        loginSuccess = false,
        loginError = null,
        theme = {},
        withcookieData = {},
        isUserLoggedIn = false,
        isAdminLoggedIn = false,
        redirectUrl = '/',
        backgroundType = 'none',
        backgroundUrl = '',
        title = '로그인',
        buttonColor,
        titleColor = '#000000',
        labelColor = '#666666',
        inputTextColor = '#000000',
        style = {},
        className = '',
        isEditor = false,
        isPreview = false
    } = data;

    // Actions 추출 with 기본값
    const {
        handleChange = () => {},
        handleSubmit = () => {},
        handleSignupClick = () => {}
    } = actions;

    // Utils 추출 with 기본값
    const {
        t = (key) => key,
        navigate = (path) => { window.location.href = path; },
        formatCurrency = (amount) => amount,
        formatDate = (date) => date,
        getAssetUrl = (path) => path,
        cx = (...classes) => classes.filter(Boolean).join(' ')
    } = utils;

    // 로컬 상태 (아이디 저장용)
    const [saveId, setSaveId] = useState(false);

    useEffect(() => {
        loadTailwindCSS();
    }, []);

    // 소셜 로그인 핸들러
    const handleSocialLogin = (provider) => {
        if (loading) return;

        if (provider === 'kakao') {
            window.location.href = '/auth/kakao';
        } else if (provider === 'naver') {
            window.location.href = '/auth/naver';
        }
    };

    // 아이디 찾기 핸들러
    const handleFindId = () => {
        if (loading) return;
        navigate('/find-id');
    };

    // 비밀번호 찾기 핸들러
    const handleFindPassword = () => {
        if (loading) return;
        navigate('/find-pw-gate-by-id');
    };

    // 회원가입 핸들러
    const handleRegister = () => {
        if (loading) return;
        handleSignupClick();
    };

    // 비회원 구매조회 핸들러
    const handleGuestOrder = () => {
        if (loading) return;
        navigate('/guest-order');
    };

    // 로그인 성공 시 처리
    if (loginSuccess && !isEditor && !isPreview) {
        return (
            <div className="w-full text-center py-8">
                <p className="text-lg">{t('로그인되었습니다. 잠시 후 이동합니다...')}</p>
            </div>
        );
    }

    // 이미 로그인된 상태 처리
    if (isUserLoggedIn && !isEditor && !isPreview) {
        return (
            <div className="w-full text-center py-8">
                <p className="text-lg">{t('이미 로그인되어 있습니다.')}</p>
                <button 
                    onClick={() => navigate('/')}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {t('홈으로 이동')}
                </button>
            </div>
        );
    }

    // 테마 색상 적용
    const primaryColor = theme?.primary || buttonColor || '#640faf';

    return (
        <div className={cx("w-full", className)} style={style}>
            {/* 배경 처리 */}
            {backgroundType === 'image' && backgroundUrl && (
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getAssetUrl(backgroundUrl)})` }}
                />
            )}
            {backgroundType === 'video' && backgroundUrl && (
                <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay 
                    loop 
                    muted
                    playsInline
                >
                    <source src={getAssetUrl(backgroundUrl)} type="video/mp4" />
                    {t('브라우저가 비디오 태그를 지원하지 않습니다.')}
                </video>
            )}

            <div className="max-w-[500px] mx-auto mb-15 lg:mb-30 bg-white flex flex-col items-center lg:justify-center px-4 relative z-10">
                <div className="w-full">
                    <div className="mt-8 mb-5 lg:mt-14 lg:mb-8">
                        <p className="text-xl lg:text-2xl font-semibold" style={{ color: titleColor }}>
                            {t('반갑습니다.')}
                        </p>
                        <p className="text-xl lg:text-2xl font-semibold flex items-center gap-0.5" style={{ color: titleColor }}>
                            {withcookieData?.company?.logo ? (
                                <img 
                                    alt={withcookieData.company.name || "Company"} 
                                    className="max-h-10 h-full" 
                                    src={getAssetUrl(withcookieData.company.logo)}
                                />
                            ) : (
                                <img 
                                    alt="CJ온스타일" 
                                    className="max-h-10 h-full" 
                                    src="https://withcookie.b-cdn.net/c/default/0.3825441797800482.png"
                                />
                            )}
                            <span>{t('입니다.')}</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-2 lg:space-y-4 mb-4 lg:mb-5">
                            <div>
                                <label htmlFor="user_id" className="sr-only">{t('아이디')}</label>
                                <input
                                    id="user_id"
                                    name="user_id"
                                    type="text"
                                    placeholder={t('CJ ONSTYLE / CJ ONE 통합 아이디 6~12자')}
                                    className={cx(
                                        "w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent",
                                        validationErrors.user_id ? "border-red-500 bg-red-50" : "border-border"
                                    )}
                                    value={formData.user_id || ''}
                                    onChange={handleChange}
                                    style={{ color: inputTextColor }}
                                    disabled={loading}
                                />
                                {validationErrors.user_id && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.user_id}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="sr-only">{t('비밀번호')}</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={t('영문, 특수문자, 숫자혼합 6~12자')}
                                    className={cx(
                                        "w-full px-4 lg:px-5 py-3 text-sm lg:text-base border placeholder-description transition-colors focus:outline-none focus:border-accent",
                                        validationErrors.password ? "border-red-500 bg-red-50" : "border-border"
                                    )}
                                    value={formData.password || ''}
                                    onChange={handleChange}
                                    style={{ color: inputTextColor }}
                                    disabled={loading}
                                />
                                {validationErrors.password && (
                                    <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center pb-3">
                                <label className="group/poj2-checkbox flex items-center cursor-pointer">
                                    <input 
                                        className="sr-only" 
                                        type="checkbox"
                                        checked={saveId}
                                        onChange={(e) => setSaveId(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <div className={cx(
                                        "border-1 rounded flex items-center justify-center transition-colors group-hover/poj2-checkbox:border-accent cursor-pointer w-4 h-4 lg:w-5 lg:h-5",
                                        saveId ? 'bg-accent border-accent' : 'bg-white border-border'
                                    )}>
                                        {saveId && (
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                            </svg>
                                        )}
                                    </div>
                                    <span className="ml-2 text-sm text-black group-hover/poj2-checkbox:text-accent text-sm lg:text-base" style={{ color: labelColor }}>
                                        {t('아이디 저장')}
                                    </span>
                                </label>
                            </div>

                            {/* 로그인 에러 메시지 */}
                            {loginError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                                    <span className="block sm:inline">{loginError}</span>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                className={cx(
                                    "w-full text-white font-semibold py-3 text-base lg:text-lg rounded-md transition-colors",
                                    loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"
                                )}
                                style={{ backgroundColor: primaryColor }}
                                disabled={loading}
                            >
                                {loading ? t('로그인 중...') : t('로그인')}
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center justify-center gap-3 lg:gap-4 text-sm text-description mb-8 lg:mb-12">
                        <button
                            type="button"
                            className="hover:text-black transition-colors cursor-pointer" 
                            onClick={handleFindId}
                            disabled={loading}
                        >
                            {t('아이디 찾기')}
                        </button>
                        <span className="text-border">|</span>
                        <button
                            type="button"
                            className="hover:text-black transition-colors cursor-pointer" 
                            onClick={handleFindPassword}
                            disabled={loading}
                        >
                            {t('비밀번호 찾기')}
                        </button>
                        <span className="text-border">|</span>
                        <button
                            type="button"
                            className="hover:text-black transition-colors cursor-pointer" 
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {t('회원가입')}
                        </button>
                    </div>

                    <div className="space-y-2 lg:space-y-4">
                        <p className="text-center text-xs lg:text-sm text-description mb-3 lg:mb-4">
                            {t('아이디/비밀번호 찾기 없이 로그인하세요')}
                        </p>

                        <button 
                            type="button" 
                            className="w-full bg-[#FEE500] text-black font-semibold py-3 text-base lg:text-lg rounded-md hover:bg-[#FEE500]/90 transition-colors flex items-center justify-center gap-2"
                            onClick={() => handleSocialLogin('kakao')}
                            disabled={loading}
                        >
                            <KakaoIcon />
                            {t('카카오 로그인')}
                        </button>

                        <button 
                            type="button" 
                            className="w-full bg-[#03C75A] text-white font-semibold py-3 text-base lg:text-lg rounded-md hover:bg-[#03C75A]/90 transition-colors flex items-center justify-center gap-2"
                            onClick={() => handleSocialLogin('naver')}
                            disabled={loading}
                        >
                            <NaverIcon />
                            {t('네이버 로그인')}
                        </button>
                    </div>



                </div>
            </div>
        </div>
    );
};

export default Login;