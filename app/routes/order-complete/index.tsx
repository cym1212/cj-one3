import { Link, useLocation } from 'react-router';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { CartBreadcrumb } from '@/components/ui/CartBreadcrumb';

gsap.registerPlugin(useGSAP);

export function meta() {
    return [
        {
            title: '주문완료 - CJ온스타일',
        },
        {
            name: 'description',
            content: 'CJ온스타일 주문완료 페이지',
        },
    ];
}

// 샘플 주문 데이터
const sampleOrderData = {
    orderNumber: 'POJ20250825001',
    orderDate: '2025. 08. 25. 14:30',
    deliveryDate: '8/27(화) 도착예정',
    paymentMethod: '카카오페이',
    totalAmount: 1501300,
    discountAmount: 183100,
    pointsUsed: 1303,
    finalAmount: 1316897,
    shippingAddress: {
        name: '홍길동',
        address: '서울 강남구 가로수길 5 (신사동)',
        detailAddress: '101호',
        zipCode: '06035',
        phone: '010-1234-5678',
    },
    items: [
        {
            id: 1,
            title: '여성 크로스백 8103378',
            option: '단일상품',
            price: 1318100,
            quantity: 1,
            image: '/images/product/product-1-2.jpg',
        },
        {
            id: 2,
            title: '[TV] 미나투고 디럭스 플러스 LED (푸쉬바 포함)',
            option: '민트',
            price: 183200,
            quantity: 1,
            image: '/images/product/product-1-4.jpg',
        },
    ],
};

export default function OrderComplete() {
    const location = useLocation();

    return (
        <QuickMenuContents>
            <section className="max-w-[600px] mx-auto pb-30">
                {/* 상단 헤더 */}
                <div className="max-lg:px-4 pb-6 pt-4 bg-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">주문완료</h2>
                        <CartBreadcrumb currentPath={location.pathname} />
                    </div>
                </div>

                <div className="space-y-4 max-lg:px-4">
                    {/* 주문 완료 메시지 */}
                    <div className="bg-white rounded p-6 border border-border text-center">
                        {/* 성공 아이콘 */}
                        <div className="w-12 h-12 lg:w-15 lg:h-15 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
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

                        <h2 className="text-xl lg:text-2xl font-bold mb-2">주문이 완료되었습니다!</h2>
                        <p className="text-sm text-description mb-4">
                            주문해 주셔서 감사합니다.
                            <br />
                            주문번호를 확인해 주세요.
                        </p>

                        {/* 주문번호 */}
                        <div>
                            <p className="text-sm">주문번호</p>
                            <p className="text-lg font-bold text-accent">{sampleOrderData.orderNumber}</p>
                        </div>
                    </div>

                    {/* 주문 정보 요약 */}
                    <div className="bg-white rounded p-4 border border-border">
                        <h3 className="text-base lg:text-lg font-bold mb-4">주문 정보</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-description">주문일시</span>
                                <span>{sampleOrderData.orderDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-description">결제금액</span>
                                <span className="font-semibold">{sampleOrderData.finalAmount.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-description">결제수단</span>
                                <span>{sampleOrderData.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-description">배송예정</span>
                                <span className="text-accent">{sampleOrderData.deliveryDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* 배송지 정보 */}
                    <div className="bg-white rounded p-4 border border-border">
                        <h3 className="text-base lg:text-lg font-bold mb-4">배송지 정보</h3>
                        <div className="space-y-2 text-sm">
                            <p className="font-semibold">{sampleOrderData.shippingAddress.name}</p>
                            <p>
                                {sampleOrderData.shippingAddress.address} {sampleOrderData.shippingAddress.detailAddress}
                            </p>
                            <p>({sampleOrderData.shippingAddress.zipCode})</p>
                            <p>{sampleOrderData.shippingAddress.phone}</p>
                        </div>
                    </div>

                    {/* 주문 상품 */}
                    <div className="bg-white rounded p-4 border border-border">
                        <h3 className="text-base lg:text-lg font-bold mb-4">주문 상품</h3>
                        <div className="space-y-4">
                            {sampleOrderData.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-3 pb-4 border-b border-border last:border-b-0 last:pb-0"
                                >
                                    <div className="shrink-0">
                                        <div className="aspect-square w-[60px] bg-border/25 rounded overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium leading-tight">{item.title}</p>
                                        <p className="text-xs text-description mb-1">
                                            {item.option} | 수량 {item.quantity}
                                        </p>
                                        <p className="text-base font-bold">{item.price.toLocaleString()}원</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 결제 정보 */}
                    <div className="bg-white rounded p-4 border border-border">
                        <h3 className="text-base lg:text-lg font-bold mb-4">결제 정보</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-description">총 상품금액</span>
                                <span>{sampleOrderData.totalAmount.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-description">할인금액</span>
                                <span className="text-discount">-{sampleOrderData.discountAmount.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-description">포인트 사용</span>
                                <span className="text-discount">-{sampleOrderData.pointsUsed.toLocaleString()}P</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-description">배송비</span>
                                <span>0원</span>
                            </div>
                            <div className="pt-2 border-t border-border">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">최종 결제금액</span>
                                    <span className="text-lg font-bold text-accent">{sampleOrderData.finalAmount.toLocaleString()}원</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="space-y-3 lg:space-y-0 lg:flex lg:gap-4">
                        <Link
                            to="/myzone"
                            className="block w-full py-2 text-base lg:text-lg text-accent font-semibold border border-accent rounded-lg text-center hover:bg-accent hover:text-white transition-colors"
                        >
                            주문 상세보기
                        </Link>
                        <Link
                            to="/"
                            className="block w-full py-2 text-base lg:text-lg text-white font-semibold bg-accent rounded-lg text-center hover:bg-accent/90 transition-colors"
                        >
                            쇼핑 계속하기
                        </Link>
                    </div>

                    {/* 안내 사항 */}
                    <div className="bg-white rounded p-4 border border-border">
                        <h4 className="text-base font-semibold mb-3">주문 및 배송 안내</h4>
                        <div className="space-y-2 text-xs lg:text-sm text-description">
                            <div className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-description rounded-full flex-shrink-0 mt-2"></span>
                                <span>주문 확인 및 배송준비 완료 후 배송이 시작됩니다.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-description rounded-full flex-shrink-0 mt-2"></span>
                                <span>주문 관련 문의는 마이존에서 확인하실 수 있습니다.</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-description rounded-full flex-shrink-0 mt-2"></span>
                                <span>취소/교환/반품은 배송 완료 후 7일 이내 가능합니다.</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border text-center">
                            <p className="text-sm text-description">
                                궁금한 사항이 있으시면 CJ ONSTYLE 고객센터
                                <span className="text-accent font-medium"> 1644-2525</span>로 연락주세요.
                            </p>
                            <p className="text-xs text-description mt-1">(평일 09:00~18:00, 주말 및 공휴일 제외)</p>
                        </div>
                    </div>
                </div>
            </section>
        </QuickMenuContents>
    );
}
