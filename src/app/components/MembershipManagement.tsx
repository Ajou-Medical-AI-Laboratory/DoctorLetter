import { ArrowLeft, Check, Crown, FileText, TrendingUp, Newspaper } from 'lucide-react';

interface MembershipManagementProps {
  onBack: () => void;
  onUpgrade: () => void;
  userTier: 'free' | 'pro' | 'max';
}

export function MembershipManagement({ onBack, onUpgrade, userTier }: MembershipManagementProps) {
  const tiers = [
    {
      id: 'free',
      name: '일반 회원',
      price: '무료',
      color: 'gray',
      features: [
        { name: '의료문서 촬영 및 분석', included: true },
        { name: '쉬운 설명 제공', included: true },
        { name: '음성으로 듣기', included: true },
        { name: '복약 알림', included: true },
        { name: '누적 검사 비교 (3회까지)', included: true },
        { name: '상세 설명', included: false },
        { name: '관련 논문 및 뉴스레터', included: false },
        { name: '무제한 누적 검사 비교', included: false }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '월 9,900원',
      color: 'blue',
      popular: true,
      features: [
        { name: '일반 회원 모든 기능', included: true },
        { name: '의료 용어 상세 설명', included: true },
        { name: '검사 결과 심화 분석', included: true },
        { name: '무제한 누적 검사 비교', included: true },
        { name: '맞춤형 건강 리포트', included: true },
        { name: '관련 논문 및 뉴스레터', included: false },
        { name: '전문의 상담 연결', included: false }
      ]
    },
    {
      id: 'max',
      name: 'Max',
      price: '월 19,900원',
      color: 'purple',
      features: [
        { name: 'Pro 모든 기능', included: true },
        { name: '최신 의학 논문 자동 검색', included: true },
        { name: '치료 현황 및 통계', included: true },
        { name: '주간 건강 뉴스레터', included: true },
        { name: '질환별 맞춤 가이드라인', included: true },
        { name: '전문의 상담 연결', included: true },
        { name: '우선 고객 지원', included: true }
      ]
    }
  ];

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
        <h1 className="text-xl font-bold text-gray-900">멤버십 관리</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Usage Guide */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-3">💎 더 많은 기능을 경험하세요</h3>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Pro:</strong> 상세한 의료 정보와 무제한 검사 비교</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Max:</strong> 최신 논문, 치료 현황, 전문의 상담까지</span>
              </li>
            </ul>
          </div>

          {/* Current Tier */}
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-blue-500">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-lg text-gray-900">현재 등급</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {tiers.find(t => t.id === userTier)?.name}
            </p>
          </div>

          {/* Tier Comparison */}
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const isCurrentTier = tier.id === userTier;
              const colorClasses = {
                gray: 'border-gray-300 bg-white',
                blue: 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100',
                purple: 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-100'
              };

              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-6 border-2 ${colorClasses[tier.color as keyof typeof colorClasses]} ${
                    isCurrentTier ? 'ring-4 ring-blue-500 ring-offset-2' : ''
                  } relative shadow-lg`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                      인기
                    </div>
                  )}

                  {isCurrentTier && (
                    <div className="absolute -top-3 right-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                      현재 등급
                    </div>
                  )}

                  <div className="text-center mb-6 mt-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-3xl font-bold text-blue-600">{tier.price}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <div className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-gray-900' : 'text-gray-400 line-through'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {!isCurrentTier && tier.id !== 'free' && (
                    <button
                      onClick={onUpgrade}
                      className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                        tier.color === 'blue'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      } shadow-md hover:shadow-lg`}
                    >
                      업그레이드
                    </button>
                  )}

                  {isCurrentTier && tier.id !== 'free' && (
                    <div className="w-full py-3 rounded-xl font-bold text-center bg-gray-200 text-gray-600">
                      사용 중
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Feature Details */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">등급별 기능 상세</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">분석 결과 제공</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• <strong>일반:</strong> 쉬운 설명까지만 제공</li>
                    <li>• <strong>Pro:</strong> 상세 설명 및 심화 분석</li>
                    <li>• <strong>Max:</strong> 관련 논문 및 치료 현황 정보</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">누적 검사 비교</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• <strong>일반:</strong> 3회까지만 비교 가능</li>
                    <li>• <strong>Pro/Max:</strong> 무제한 비교 및 분석</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-900 mb-2">뉴스레터 및 논문</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• <strong>Max 전용:</strong> 주간 건강 뉴스레터 발송</li>
                    <li>• <strong>Max 전용:</strong> 관련 최신 논문 자동 검색</li>
                    <li>• <strong>Max 전용:</strong> 질환별 치료 현황 및 통계</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
