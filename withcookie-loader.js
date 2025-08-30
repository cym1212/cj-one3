/**
 * WithCookie 컴포넌트 로더
 * 이 파일을 WithCookie 에디터에서 사용하여 컴포넌트를 초기화합니다.
 */

(function() {
    // props_MAIN_BANNER_57.js가 로드되었는지 확인
    if (typeof editorProps === 'undefined') {
        console.error('[WithCookie Loader] editorProps not found. Make sure props_MAIN_BANNER_57.js is loaded first.');
        return;
    }

    // 컴포넌트가 로드되었는지 확인
    if (typeof window.Poj2MobileMainSlider === 'undefined') {
        console.error('[WithCookie Loader] Poj2MobileMainSlider component not found. Make sure poj2-mobile-slider.umd.js is loaded.');
        return;
    }

    // WithCookie 초기화 함수
    window.WithCookieInit = function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('[WithCookie Loader] Container not found:', containerId);
            return false;
        }

        // React와 ReactDOM이 있는지 확인
        if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
            console.error('[WithCookie Loader] React or ReactDOM not found.');
            return false;
        }

        try {
            // editorProps를 window에 설정 (컴포넌트가 읽을 수 있도록)
            window.editorProps = editorProps;
            window.WithCookieProps = editorProps;
            window.componentProps = editorProps;
            
            // 컴포넌트 렌더링
            const Component = window.Poj2MobileMainSlider;
            const element = React.createElement(Component, editorProps);
            
            // React 18+ 지원
            if (ReactDOM.createRoot) {
                const root = ReactDOM.createRoot(container);
                root.render(element);
            } else {
                // React 17 이하
                ReactDOM.render(element, container);
            }
            
            console.log('[WithCookie Loader] Component initialized successfully');
            return true;
        } catch (error) {
            console.error('[WithCookie Loader] Failed to initialize:', error);
            return false;
        }
    };

    // 자동 초기화 (DOMContentLoaded 이벤트)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // data-withcookie-component 속성이 있는 요소 찾기
            const containers = document.querySelectorAll('[data-withcookie-component="main-banner-57"]');
            containers.forEach(function(container) {
                window.WithCookieInit(container.id || container.getAttribute('id'));
            });
        });
    } else {
        // 이미 DOM이 로드된 경우
        const containers = document.querySelectorAll('[data-withcookie-component="main-banner-57"]');
        containers.forEach(function(container) {
            window.WithCookieInit(container.id || container.getAttribute('id'));
        });
    }

    // 글로벌 함수로도 노출
    window.initMainBanner57 = window.WithCookieInit;
    
    console.log('[WithCookie Loader] Loader ready. Use WithCookieInit(containerId) or add data-withcookie-component="main-banner-57" to your container.');
})();