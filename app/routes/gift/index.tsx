import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import { QuickMenuContents } from '@/components/layout/QuickMenuContents';
import { RadioButton } from '@/components/ui/RadioButton';
import { AddressModal } from '@/components/ui/AddressModal';
import { PaymentUi } from '@/components/ui/PaymentUi';

import type { AddressData } from '@/components/ui/AddressModal';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

interface FormData {
    recipientName: string;
    phonePrefix: string;
    phoneNumber: string;
}

interface FormErrors {
    recipientName: string;
    phoneNumber: string;
}

export default function Gift() {
    const navigate = useNavigate();
    const [deliveryMethod, setDeliveryMethod] = useState<'kakao' | 'message'>('kakao');
    const [addressMethod, setAddressMethod] = useState<'recipient' | 'sender'>('recipient');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [savedAddress, setSavedAddress] = useState<AddressData | null>(null);

    const [formData, setFormData] = useState<FormData>({
        recipientName: '',
        phonePrefix: '010',
        phoneNumber: '',
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({
        recipientName: '',
        phoneNumber: '',
    });

    const phonePrefixes = ['010', '011', '016', '017', '019'];

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // 에러 제거
        if (formErrors[field as keyof FormErrors]) {
            setFormErrors((prev) => ({
                ...prev,
                [field]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors: FormErrors = {
            recipientName: '',
            phoneNumber: '',
        };

        // 받는 사람 이름 유효성 검사
        if (!formData.recipientName.trim()) {
            newErrors.recipientName = '받는 사람 이름을 입력해주세요.';
        } else if (formData.recipientName.trim().length < 2) {
            newErrors.recipientName = '이름은 2자 이상 입력해주세요.';
        } else if (!/^[가-힣a-zA-Z\s]+$/.test(formData.recipientName.trim())) {
            newErrors.recipientName = '이름은 한글 또는 영문으로만 입력해주세요.';
        }

        // 전화번호 유효성 검사
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = '전화번호를 입력해주세요.';
        } else if (!/^\d{8}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = '전화번호는 8자리 숫자로 입력해주세요.';
        }

        setFormErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== '');
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('선물 정보 전송:', {
                deliveryMethod,
                addressMethod,
                formData,
            });
            navigate('/order');
        }
    };

    return (
        <QuickMenuContents>
            <section className="poj2-gift-page max-w-[700px] mx-auto mb-15 lg:mb-30">
                <div className="bg-border/50 p-4">
                    <div className="bg-white rounded-lg px-4 py-6">
                        {/* 제목 */}
                        <h2 className="text-xl font-bold mb-4">선물 받는 분</h2>

                        {/* 선물 방법 선택 */}
                        <div className="space-y-2">
                            <div className="flex lg:hidden bg-border/50 rounded-full h-[35px]">
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('kakao')}
                                    className={`flex-1 px-4 rounded-full text-sm transition-colors ${deliveryMethod === 'kakao' ? 'bg-black text-white' : 'bg-transparent text-description'}`}
                                >
                                    카카오톡으로 선물
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDeliveryMethod('message')}
                                    className={`flex-1 px-4 rounded-full text-sm transition-colors ${deliveryMethod === 'message' ? 'bg-black text-white' : 'bg-transparent text-description'}`}
                                >
                                    문자로 선물
                                </button>
                            </div>

                            {/* 안내 텍스트 */}
                            <p className="text-sm text-description mb-4">{deliveryMethod === 'kakao' ? '결제 후 카카오톡 친구목록에서 받는 분을 선택해주세요' : '아래 입력하신 번호로 선물도착 메시지를 전달합니다'}</p>
                        </div>

                        {/* 주소 입력 방식 선택 */}
                        <div className="space-y-2 mb-5">
                            <RadioButton
                                name="addressMethod"
                                value="recipient"
                                checked={addressMethod === 'recipient'}
                                onChange={(value) => setAddressMethod(value as 'recipient' | 'sender')}
                                label="선물 받는 사람이 주소 입력하기"
                                labelClassName="text-sm"
                            />

                            <RadioButton
                                name="addressMethod"
                                value="sender"
                                checked={addressMethod === 'sender'}
                                onChange={(value) => setAddressMethod(value as 'recipient' | 'sender')}
                                label="내가 주소 입력하기"
                                labelClassName="text-sm"
                            />
                        </div>

                        {/* 받는 사람이 입력하기 인풋 */}
                        {addressMethod === 'recipient' && (
                            <div className="space-y-2">
                                {/* 받는 사람 이름 */}
                                <div>
                                    <label
                                        htmlFor="recipientName"
                                        className="sr-only"
                                    >
                                        받는 사람 이름
                                    </label>
                                    <input
                                        type="text"
                                        id="recipientName"
                                        placeholder="받는 사람 이름을 입력해주세요"
                                        value={formData.recipientName}
                                        onChange={(e) => handleInputChange('recipientName', e.target.value)}
                                        className={`w-full px-4 lg:px-5 py-2 text-sm border placeholder-description transition-colors focus:outline-none focus:border-accent ${formErrors.recipientName ? 'border-discount' : 'border-border'}`}
                                    />
                                    {formErrors.recipientName && <p className="mt-1 text-sm text-discount">{formErrors.recipientName}</p>}
                                </div>

                                {/* 전화번호 입력 */}
                                <div className={`${deliveryMethod === 'kakao' ? 'hidden lg:block' : ''}`}>
                                    <div className="flex space-x-2">
                                        {/* 전화번호 앞자리 선택 */}
                                        <select
                                            value={formData.phonePrefix}
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

                                        {/* 전화번호 입력 */}
                                        <input
                                            type="text"
                                            placeholder="- 없이 숫자만 입력"
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/[^0-9]/g, ''))}
                                            className={`w-full px-4 lg:px-5 py-2 text-sm border placeholder-description transition-colors focus:outline-none focus:border-accent ${formErrors.phoneNumber ? 'border-discount' : 'border-border'}`}
                                        />
                                        {formErrors.phoneNumber && <p className="mt-1 text-sm text-discount">{formErrors.phoneNumber}</p>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 내가 입력하기 인풋 */}
                        {addressMethod === 'sender' && (
                            <div className="border-t border-border pt-4">
                                {!savedAddress ? (
                                    <>
                                        <p className="font-bold mb-1">배송지를 입력해주세요</p>
                                        <p className="text-xs text-description">받는 사람이 배송지 정보를 변경할 수 있습니다.</p>
                                        <button
                                            type="button"
                                            onClick={() => setIsAddressModalOpen(true)}
                                            className="flex items-center justify-center w-full px-4 lg:px-5 py-2 mt-4 text-sm border border-border transition-colors hover:border-black"
                                        >
                                            <span>배송지 입력하기</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 -960 960 960"
                                                className="w-5 h-5 fill-current"
                                            >
                                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="font-bold text-sm">
                                                {savedAddress.recipientName} <span className="text-accent font-normal">기본배송지</span>
                                            </p>
                                        </div>

                                        <div className="mb-4 space-y-1 text-sm">
                                            <p>
                                                {savedAddress.address} ({savedAddress.zipCode})
                                            </p>
                                            <p>
                                                {savedAddress.phonePrefix}-{savedAddress.phoneNumber}
                                            </p>
                                            <p className="mt-2 text-description">받는 사람이 배송지 정보를 변경할 수 있습니다</p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setIsAddressModalOpen(true)}
                                            className="flex items-center justify-center w-full px-4 py-2 text-sm border border-border transition-colors hover:bg-border/25"
                                        >
                                            <span>다른 주소 입력하기</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 -960 960 960"
                                                className="w-4 h-4 ml-1 fill-current"
                                            >
                                                <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <GiftContentSection />
                <PaymentUi
                    onPayment={handleSubmit}
                    visibleDeliveryAddress={false}
                />
            </section>

            {/* 배송지 입력 모달 */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onAddressSave={(addressData) => {
                    setSavedAddress(addressData);
                    setAddressMethod('sender');
                }}
            />
        </QuickMenuContents>
    );
}

function GiftContentSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [cardTexts, setCardTexts] = useState<{ [key: number]: string }>({});

    const mainSwiperRef = useRef<SwiperType | null>(null);
    const thumbsSwiperRef = useRef<SwiperType | null>(null);
    const navigationPrevRef = useRef<HTMLButtonElement>(null);
    const navigationNextRef = useRef<HTMLButtonElement>(null);

    const cards = [
        {
            id: 1,
            image: '/images/banner/card_gift.jpg',
            bgColor: '#8fa5ad',
        },
        {
            id: 2,
            image: '/images/banner/card_gift.jpg',
            bgColor: '#8fa5ad',
        },
        {
            id: 3,
            image: '/images/banner/card_gift.jpg',
            bgColor: '#8fa5ad',
        },
        {
            id: 4,
            image: '/images/banner/card_gift.jpg',
            bgColor: '#8fa5ad',
        },
        {
            id: 5,
            image: '/images/banner/card_gift.jpg',
            bgColor: '#8fa5ad',
        },
        {
            id: 6,
            image: '/images/banner/card_gift.jpg',
            bgColor: '#8fa5ad',
        },
        {
            id: 7,
            image: '/images/banner/card_gift.jpg',
            bgColor: '#8fa5ad',
        },
        {
            id: 8,
            image: '/images/banner/card_gift.jpg',
            bgColor: '#8fa5ad',
        },
    ];

    const handleTextChange = (cardId: number, value: string) => {
        setCardTexts((prev) => ({
            ...prev,
            [cardId]: value,
        }));
    };

    return (
        <div className="bg-white my-8 space-y-4">
            {/* 메인 카드 캐러셀 */}
            <div className="relative">
                <Swiper
                    modules={[Navigation, Thumbs]}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView="auto"
                    centeredSlides={true}
                    thumbs={{ swiper: thumbsSwiperRef.current && !thumbsSwiperRef.current.destroyed ? thumbsSwiperRef.current : null }}
                    navigation={{
                        prevEl: navigationPrevRef.current || undefined,
                        nextEl: navigationNextRef.current || undefined,
                    }}
                    onSwiper={(swiper) => {
                        mainSwiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => {
                        setActiveIndex(swiper.realIndex);
                    }}
                    onBeforeInit={(swiper) => {
                        if (swiper.params.navigation && typeof swiper.params.navigation === 'object') {
                            if (navigationPrevRef.current) {
                                swiper.params.navigation.prevEl = navigationPrevRef.current;
                            }
                            if (navigationNextRef.current) {
                                swiper.params.navigation.nextEl = navigationNextRef.current;
                            }
                        }
                    }}
                    className="w-full"
                >
                    {cards.map((card, index) => (
                        <SwiperSlide
                            key={card.id}
                            className="!w-auto"
                        >
                            <div className="w-[280px] relative rounded-lg overflow-hidden shadow-lg">
                                {/* 카드 이미지 */}
                                <div className="relative h-[200px]">
                                    <img
                                        src={card.image}
                                        alt={card.id.toString()}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* 텍스트 입력 영역 */}
                                <div
                                    className="p-4"
                                    style={{ backgroundColor: card.bgColor }}
                                >
                                    <div className="bg-white bg-[linear-gradient(to_right,#fff_4px,transparent_4px),linear-gradient(to_left,#fff_4px,transparent_4px),linear-gradient(to_top,#fff_1px,transparent_1px),repeating-linear-gradient(transparent,transparent_29px,rgba(0,0,0,.08)_29px,rgba(0,0,0,.08)_30px,transparent_30px)]">
                                        <textarea
                                            value={cardTexts[card.id] || ''}
                                            onChange={(e) => handleTextChange(card.id, e.target.value)}
                                            placeholder="당신을 위한 저의 선물입니다.&#10;(이모티콘은 입력 불가합니다.)"
                                            maxLength={80}
                                            className="w-full h-[120px] px-3 resize-none text-center text-sm mx-auto block leading-[30px]"
                                        />
                                    </div>
                                    <div className="flex justify-end items-center mt-2">
                                        <span className="text-xs text-[#fff]">{(cardTexts[card.id] || '').length}/80</span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation 버튼 */}
                <button
                    ref={navigationPrevRef}
                    type="button"
                    className="absolute top-1/2 left-2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    aria-label="이전 슬라이드"
                    onClick={() => mainSwiperRef.current?.slidePrev()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        className="fill-current"
                    >
                        <path d="M560-253.85 333.85-480 560-706.15 602.15-664l-184 184 184 184L560-253.85Z" />
                    </svg>
                </button>
                <button
                    ref={navigationNextRef}
                    type="button"
                    className="absolute top-1/2 right-2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    aria-label="다음 슬라이드"
                    onClick={() => mainSwiperRef.current?.slideNext()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        className="fill-current"
                    >
                        <path d="M517.85-480 354.92-642.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69 12.38 0 21.08 8.69l179.77 179.77q5.61 5.62 7.92 11.85 2.31 6.23 2.31 13.46t-2.31 13.46q-2.31 6.23-7.92 11.85L397.08-274.92q-8.31 8.3-20.89 8.5-12.57.19-21.27-8.5-8.69-8.7-8.69-21.08 0-12.38 8.69-21.08L517.85-480Z" />
                    </svg>
                </button>
            </div>

            {/* 썸네일 행 */}
            <div className="flex justify-center">
                <Swiper
                    onSwiper={(swiper) => {
                        thumbsSwiperRef.current = swiper;
                    }}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView="auto"
                    watchSlidesProgress={true}
                    modules={[Thumbs]}
                    className="px-4"
                >
                    {cards.map((card, index) => (
                        <SwiperSlide
                            key={card.id}
                            onClick={() => {
                                if (mainSwiperRef.current) {
                                    mainSwiperRef.current.slideToLoop(index);
                                }
                            }}
                            className="!w-auto cursor-pointer"
                        >
                            <div className={`w-[72px] h-[48px] rounded overflow-hidden transition-all ${activeIndex === index ? 'border-2 border-accent' : ''}`}>
                                <img
                                    src={card.image}
                                    alt={`Thumbnail ${card.id}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
