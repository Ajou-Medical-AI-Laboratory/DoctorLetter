import { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Smartphone } from 'lucide-react';

interface PaymentProps {
  onBack: () => void;
  onComplete: (tier: 'pro' | 'max') => void;
}

export function Payment({ onBack, onComplete }: PaymentProps) {
  const [selectedTier, setSelectedTier] = useState<'pro' | 'max'>('pro');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'kakaopay' | 'naverpay' | 'toss'>('card');
  const [processing, setProcessing] = useState(false);

  const tiers = {
    pro: { name: 'Pro', price: 9900, color: 'blue' },
    max: { name: 'Max', price: 19900, color: 'purple' }
  };

  const paymentMethods = [
    { id: 'card', name: '신용/체크카드', icon: CreditCard },
    { id: 'kakaopay', name: '카카오페이', logo: '💛' },
    { id: 'naverpay', name: '네이버페이', logo: '💚' },
    { id: 'toss', name: '토스페이', logo: '💙' }
  ];

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onComplete(selectedTier);
    }, 2000);
  };

  const currentTier = tiers[selectedTier];

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">멤버십 결제</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Usage Guide */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">💳 간편결제 안내</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>신용/체크카드 또는 간편결제로 빠르게 결제하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>매월 자동 결제되며 언제든지 해지 가능합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>첫 달 50% 할인 혜택이 적용됩니다</span>
              </li>
            </ul>
          </div>

          {/* Tier Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4">구독 등급 선택</h3>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedTier('pro')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedTier === 'pro'
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Pro</h4>
                  <p className="text-sm text-gray-600 mb-3">상세 설명 + 무제한 비교</p>
                  <div className="text-gray-400 line-through text-sm mb-1">월 9,900원</div>
                  <div className="text-3xl font-bold text-blue-600">4,950원</div>
                  <div className="text-xs text-blue-600 mt-1">첫 달 50% 할인</div>
                </div>
                {selectedTier === 'pro' && (
                  <div className="mt-4 flex justify-center">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>

              <button
                onClick={() => setSelectedTier('max')}
                className={`p-6 rounded-xl border-2 transition-all ${
                  selectedTier === 'max'
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Max</h4>
                  <p className="text-sm text-gray-600 mb-3">논문 + 뉴스레터 + 전문의</p>
                  <div className="text-gray-400 line-through text-sm mb-1">월 19,900원</div>
                  <div className="text-3xl font-bold text-purple-600">9,950원</div>
                  <div className="text-xs text-purple-600 mt-1">첫 달 50% 할인</div>
                </div>
                {selectedTier === 'max' && (
                  <div className="mt-4 flex justify-center">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4">결제 수단 선택</h3>

            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      {Icon ? (
                        <Icon className="w-8 h-8 text-gray-700" />
                      ) : (
                        <span className="text-3xl">{method.logo}</span>
                      )}
                      <span className="font-medium text-gray-900 text-sm">{method.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4">결제 정보</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">구독 상품</span>
                <span className="font-medium text-gray-900">{currentTier.name} 멤버십</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">정가</span>
                <span className="font-medium text-gray-900">{currentTier.price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-green-600 font-medium">첫 달 할인 (50%)</span>
                <span className="font-medium text-green-600">-{(currentTier.price / 2).toLocaleString()}원</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">최종 결제 금액</span>
                  <span className={`text-2xl font-bold ${
                    selectedTier === 'pro' ? 'text-blue-600' : 'text-purple-600'
                  }`}>
                    {(currentTier.price / 2).toLocaleString()}원
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">다음 달부터 월 {currentTier.price.toLocaleString()}원</p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                defaultChecked
              />
              <div className="flex-1 text-sm text-gray-700">
                <p className="font-medium mb-2">자동 결제에 동의합니다</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• 매월 같은 날짜에 자동으로 결제됩니다</li>
                  <li>• 언제든지 구독을 취소할 수 있습니다</li>
                  <li>• 환불 정책은 이용약관을 따릅니다</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className={`w-full py-6 rounded-2xl font-bold text-xl text-white shadow-lg transition-all ${
              processing
                ? 'bg-gray-400 cursor-not-allowed'
                : selectedTier === 'pro'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                결제 처리 중...
              </span>
            ) : (
              `${(currentTier.price / 2).toLocaleString()}원 결제하기`
            )}
          </button>

          {/* Security Info */}
          <div className="text-center text-sm text-gray-500">
            <p>🔒 안전한 결제 시스템으로 보호됩니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
