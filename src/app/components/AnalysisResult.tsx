import { useState } from 'react';
import { ArrowLeft, Volume2, VolumeX, TrendingUp, HelpCircle, Lock, FileText } from 'lucide-react';
import { TermPopover } from './TermPopover';

interface AnalysisResultProps {
  onBack: () => void;
  onViewTrend: () => void;
  userTier: 'free' | 'pro' | 'max';
  onUpgrade: () => void;
}

export function AnalysisResult({ onBack, onViewTrend, userTier, onUpgrade }: AnalysisResultProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  const handlePlayAudio = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 5000);
    }
  };

  const medicalTerms = [
    { term: '유방암', definition: '유방에 생긴 악성 종양을 말합니다' },
    { term: 'ER 양성', definition: '에스트로겐 호르몬에 반응하는 종류의 암입니다. 호르몬 치료가 효과적일 수 있습니다.' },
    { term: 'HER2 음성', definition: 'HER2 단백질이 없는 종류의 암입니다' }
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
        <h1 className="text-xl font-bold text-gray-900">분석 결과</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Audio Control */}
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">음성으로 듣기</h3>
                <p className="text-blue-100 text-sm">아래 내용을 음성으로 들려드려요</p>
              </div>
              <button
                onClick={handlePlayAudio}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? (
                  <VolumeX className="w-8 h-8 text-blue-600" />
                ) : (
                  <Volume2 className="w-8 h-8 text-blue-600" />
                )}
              </button>
            </div>
            {isPlaying && (
              <div className="mt-4 h-1 bg-blue-400 rounded-full overflow-hidden">
                <div className="h-full bg-white animate-[progress_5s_linear]"></div>
              </div>
            )}
          </div>

          {/* Document Info */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">병리확인서</h2>
                <p className="text-sm text-gray-500">2026년 4월 15일</p>
              </div>
            </div>
          </div>

          {/* Diagram */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
            <h3 className="font-bold text-xl text-gray-900 mb-6">진단 내용 도식</h3>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-8 border-2 border-purple-200">
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="inline-block bg-pink-200 text-pink-900 px-6 py-3 rounded-full font-bold text-lg">
                    유방암 (침윤성 유관암)
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center border-2 border-green-300">
                    <div className="text-3xl mb-2">✓</div>
                    <div className="font-bold text-green-700 mb-1">ER 양성</div>
                    <div className="text-xs text-gray-600">호르몬 치료 가능</div>
                  </div>

                  <div className="bg-white rounded-xl p-4 text-center border-2 border-green-300">
                    <div className="text-3xl mb-2">✓</div>
                    <div className="font-bold text-green-700 mb-1">PR 양성</div>
                    <div className="text-xs text-gray-600">예후 양호</div>
                  </div>

                  <div className="bg-white rounded-xl p-4 text-center border-2 border-blue-300">
                    <div className="text-3xl mb-2">−</div>
                    <div className="font-bold text-blue-700 mb-1">HER2 음성</div>
                    <div className="text-xs text-gray-600">표준 치료 적용</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 mt-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">병기</div>
                    <div className="font-bold text-2xl text-gray-900">T2N0M0</div>
                    <div className="text-sm text-gray-600 mt-2">초기 단계, 림프절 전이 없음</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Easy Explanation */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
            <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
              <span>쉬운 설명</span>
              <HelpCircle className="w-5 h-5 text-blue-500" />
            </h3>

            <div className="space-y-4 text-lg leading-relaxed text-gray-800">
              <p>
                병리확인서에{' '}
                <button
                  onClick={() => setSelectedTerm('ER 양성')}
                  className="text-blue-600 underline decoration-dotted hover:text-blue-700 font-medium"
                >
                  ER 양성
                </button>
                으로 기록되어 있습니다.
              </p>

              <p>
                이것은 여성 호르몬(에스트로겐)에 반응하는 종류의 암이라는 뜻입니다.
              </p>

              <p className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <span className="font-bold text-green-900">좋은 소식:</span>{' '}
                <span className="text-green-800">
                  호르몬 치료가 효과적으로 작용할 수 있어서, 치료 선택지가 많습니다.
                </span>
              </p>

              <p>
                또한 림프절 전이가 없는 초기 단계로 확인되었습니다.
              </p>
            </div>
          </div>

          {/* Medical Terms */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4">알아두면 좋은 용어</h3>
            <div className="space-y-3">
              {medicalTerms.map((item) => (
                <button
                  key={item.term}
                  onClick={() => setSelectedTerm(item.term)}
                  className="w-full bg-gray-50 hover:bg-blue-50 rounded-xl p-4 text-left transition-colors border border-gray-200 hover:border-blue-300"
                >
                  <div className="font-bold text-gray-900 mb-1">{item.term}</div>
                  <div className="text-sm text-gray-600">{item.definition}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Analysis - Pro+ */}
          {userTier === 'free' ? (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-md border-2 border-blue-300 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Lock className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <span>상세 분석</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Pro</span>
              </h3>
              <p className="text-gray-700 mb-6 blur-sm select-none">
                검사 결과에 대한 더 자세한 의학적 분석 내용이 제공됩니다. 각 수치가 의미하는 바와 향후 치료 방향에 대한 심화된 설명을 확인하실 수 있습니다...
              </p>
              <button
                onClick={onUpgrade}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Pro로 업그레이드하고 상세 분석 보기
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <span>상세 분석</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Pro</span>
              </h3>
              <div className="space-y-4 text-gray-800 leading-relaxed">
                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <h4 className="font-bold text-blue-900 mb-3">ER/PR 양성의 의미</h4>
                  <p>
                    에스트로겐 수용체(ER)와 프로게스테론 수용체(PR)가 모두 양성이라는 것은 호르몬 수용체 양성 유방암을 의미합니다.
                    이는 전체 유방암의 약 70%를 차지하며, 호르몬 치료에 반응할 가능성이 높습니다.
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                  <h4 className="font-bold text-green-900 mb-3">치료 방향</h4>
                  <p>
                    타목시펜(Tamoxifen) 또는 아로마타제 억제제와 같은 호르몬 치료가 주로 사용됩니다.
                    일반적으로 5-10년간 복용하며, 재발률을 약 40-50% 감소시킬 수 있습니다.
                  </p>
                </div>

                <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                  <h4 className="font-bold text-purple-900 mb-3">예후</h4>
                  <p>
                    병기 T2N0M0는 조기 유방암에 해당하며, 림프절 전이가 없어 예후가 상대적으로 양호합니다.
                    호르몬 치료와 적절한 추가 치료를 병행할 경우 5년 생존율은 90% 이상입니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Research Papers - Max Only */}
          {userTier !== 'max' ? (
            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-8 shadow-md border-2 border-purple-300 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Lock className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                <span>관련 논문 및 치료 현황</span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Max</span>
              </h3>
              <p className="text-gray-700 mb-6 blur-sm select-none">
                최신 의학 논문과 국내외 치료 가이드라인, 임상시험 정보를 제공합니다. 귀하의 진단과 관련된 최신 연구 동향과 치료 옵션을 확인하실 수 있습니다...
              </p>
              <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Max로 업그레이드하고 논문 및 뉴스레터 받기
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200">
              <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6" />
                <span>관련 논문 및 치료 현황</span>
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Max</span>
              </h3>

              <div className="space-y-4">
                <div className="bg-purple-50 rounded-xl p-6 border-l-4 border-purple-500">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-purple-900 flex-1">
                      호르몬 수용체 양성 유방암의 최신 치료 전략
                    </h4>
                    <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-3">
                      2026.03
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    Journal of Clinical Oncology | Impact Factor: 45.3
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    CDK4/6 억제제와 호르몬 치료의 병합요법이 진행성 ER+ 유방암 환자의 무진행 생존기간을 28개월로 연장시켰다는 최신 연구 결과입니다.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-blue-900 flex-1">
                      국내 유방암 치료 가이드라인 2026
                    </h4>
                    <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-3">
                      2026.01
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">
                    대한유방암학회 | 국내 표준 진료지침
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    조기 유방암에서 호르몬 치료 기간을 5년에서 10년으로 연장할 경우 재발 위험이 추가로 25% 감소한다는 국내 다기관 연구 결과가 반영되었습니다.
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-green-900 flex-1">
                      주간 건강 뉴스레터
                    </h4>
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-3">
                      이번 주
                    </span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>FDA, 새로운 경구용 SERD 약물 승인 (2026.04.20)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>국내 AI 기반 유방암 예후 예측 모델 개발 성공</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>서울대병원, 맞춤형 호르몬 치료 임상시험 참가자 모집</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* View Trend Button */}
          <button
            onClick={onViewTrend}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-lg transition-colors"
          >
            <TrendingUp className="w-6 h-6" />
            누적 변화 그래프 보기
          </button>
        </div>
      </div>

      {/* Term Popover */}
      {selectedTerm && (
        <TermPopover
          term={selectedTerm}
          onClose={() => setSelectedTerm(null)}
        />
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
