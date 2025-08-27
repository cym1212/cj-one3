import { useLocation, useNavigate } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { CartBreadcrumb } from '@/components/ui/CartBreadcrumb';
import { PaymentUi } from '@/components/ui/PaymentUi';

gsap.registerPlugin(useGSAP);

export function meta() {
    return [
        {
            title: '주문서 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 주문서 페이지',
        },
    ];
}

export default function Order() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = () => {
        navigate('/order-complete');
    };

    return (
        <QuickMenuContents>
            <section className="max-w-[600px] mx-auto pb-30">
                <div className="hidden lg:block pb-6 pt-4 bg-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">주문서</h2>
                        <CartBreadcrumb currentPath={location.pathname} />
                    </div>
                </div>

                <PaymentUi onPayment={handleSubmit} />
            </section>
        </QuickMenuContents>
    );
}
