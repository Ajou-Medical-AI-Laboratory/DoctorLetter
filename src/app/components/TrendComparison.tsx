import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingDown, TrendingUp, Lock } from 'lucide-react';

interface TrendComparisonProps {
  onBack: () => void;
  userTier: 'free' | 'pro' | 'max';
  viewCount: number;
  onUpgrade: () => void;
  onIncrementView: () => void;
}

export function TrendComparison({ onBack, userTier, viewCount, onUpgrade, onIncrementView }: TrendComparisonProps) {
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    if (userTier === 'free' && viewCount >= 3) {
      setShowContent(false);
    } else {
      setShowContent(true);
      if (userTier === 'free') {
        onIncrementView();
      }
    }
  }, []);

  const remainingViews = userTier === 'free' ? Math.max(0, 3 - viewCount) : Infinity;
  const labTests = [
    {
      name: 'CA 15-3',
      unit: 'U/mL',
      current: 18.5,
      previous: 22.3,
      reference: '< 25',
      trend: 'down',
      history: [28.1, 25.4, 22.3, 20.1, 18.5]
    },
    {
      name: 'CEA',
      unit: 'ng/mL',
      current: 2.1,
      previous: 2.8,
      reference: '< 5',
      trend: 'down',
      history: [4.2, 3.5, 2.8, 2.4, 2.1]
    },
    {
      name: '백혈구',
      unit: '10³/μL',
      current: 6.2,
      previous: 5.8,
      reference: '4.0-10.0',
      trend: 'stable',
      history: [5.5, 5.7, 5.8, 6.0, 6.2]
    }
  ];

  const renderChart = (history: number[], trend: string) => {
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;

    return (
      <div className="relative h-32 flex items-end gap-2 px-4">
        {history.map((value, idx) => {
          const heightPercent = ((value - min) / range) * 100;
          const isLast = idx === history.length - 1;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={`w-full rounded-t-lg transition-all ${
                  trend === 'down'
                    ? 'bg-gradient-to-t from-green-500 to-green-400'
                    : trend === 'up'
                    ? 'bg-gradient-to-t from-red-500 to-red-400'
                    : 'bg-gradient-to-t from-blue-500 to-blue-400'
                } ${isLast ? 'opacity-100 shadow-lg' : 'opacity-60'}`}
                style={{ height: `${Math.max(heightPercent, 10)}%` }}
              >
                {isLast && (
                  <div className="w-full h-full flex items-start justify-center pt-2">
                    <span className="text-white font-bold text-xs">{value}</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {idx === 0 ? '5개월전' : idx === history.length - 1 ? '현재' : ''}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

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
        <h1 className="text-xl font-bold text-gray-900">누적 검사 비교</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Free User Limit Warning */}
          {!showContent && userTier === 'free' ? (
            <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl p-12 text-center shadow-lg border-2 border-purple-300">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">누적 검사 비교 횟수 초과</h2>
              <p className="text-lg text-gray-700 mb-6">
                일반 회원은 누적 검사 비교를 <strong>3회까지</strong> 무료로 이용할 수 있습니다.
              </p>
              <div className="bg-white rounded-xl p-6 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">사용한 횟수</span>
                  <span className="text-2xl font-bold text-blue-600">{viewCount} / 3회</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <p className="text-gray-700 mb-8 text-lg">
                Pro 또는 Max 멤버십으로 업그레이드하면<br />
                <strong>무제한으로</strong> 누적 검사 비교를 이용할 수 있습니다.
              </p>
              <button
                onClick={onUpgrade}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 px-12 rounded-2xl text-xl shadow-lg transition-all"
              >
                멤버십 업그레이드하기
              </button>
            </div>
          ) : (
            <>
              {/* Remaining Views Warning for Free Users */}
              {userTier === 'free' && remainingViews > 0 && (
                <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⚠️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-yellow-900 mb-2">무료 이용 횟수 안내</h3>
                      <p className="text-yellow-800">
                        일반 회원은 누적 검사 비교를 3회까지 무료로 이용할 수 있습니다.<br />
                        남은 횟수: <strong>{remainingViews}회</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                <h2 className="text-2xl font-bold mb-2">전반적으로 좋아지고 있어요! 👍</h2>
                <p className="text-green-100 text-lg">
                  지난 5개월간 종양 표지자 수치가 지속적으로 감소하고 있습니다.
                </p>
              </div>

          {/* Test Results */}
          {labTests.map((test, idx) => {
            const change = test.current - test.previous;
            const changePercent = ((change / test.previous) * 100).toFixed(1);
            const isImproving = test.trend === 'down';

            return (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
              >
                {/* Test Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-1">{test.name}</h3>
                      <p className="text-sm text-gray-500">정상 범위: {test.reference} {test.unit}</p>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                      isImproving
                        ? 'bg-green-100 text-green-700'
                        : test.trend === 'up'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {test.trend === 'down' && <TrendingDown className="w-5 h-5" />}
                      {test.trend === 'up' && <TrendingUp className="w-5 h-5" />}
                      <span>{Math.abs(parseFloat(changePercent))}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600 mb-1">이전 검사</div>
                      <div className="text-2xl font-bold text-gray-700">
                        {test.previous} <span className="text-sm font-normal text-gray-500">{test.unit}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">3개월 전</div>
                    </div>

                    <div className={`rounded-xl p-4 ${
                      isImproving ? 'bg-green-50' : test.trend === 'up' ? 'bg-red-50' : 'bg-blue-50'
                    }`}>
                      <div className="text-sm text-gray-600 mb-1">현재</div>
                      <div className={`text-2xl font-bold ${
                        isImproving ? 'text-green-700' : test.trend === 'up' ? 'text-red-700' : 'text-blue-700'
                      }`}>
                        {test.current} <span className="text-sm font-normal text-gray-500">{test.unit}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">오늘</div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="p-6 bg-gray-50">
                  <h4 className="font-bold text-gray-900 mb-4">5개월 추이</h4>
                  {renderChart(test.history, test.trend)}
                </div>

                {/* Interpretation */}
                <div className={`p-6 border-t-2 ${
                  isImproving ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isImproving ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      <span className="text-white text-lg">
                        {isImproving ? '✓' : 'i'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        isImproving ? 'text-green-900' : 'text-blue-900'
                      }`}>
                        {isImproving
                          ? `수치가 계속 감소하고 있어요. 치료가 잘 되고 있다는 긍정적인 신호입니다.`
                          : `수치가 정상 범위 내에서 안정적으로 유지되고 있습니다.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

              {/* Info Box */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="font-bold text-lg text-blue-900 mb-4">📊 그래프 보는 법</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>초록색 ↓</strong>: 수치가 낮아지고 있어요 (좋음)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>파란색 →</strong>: 수치가 안정적이에요</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>빨간색 ↑</strong>: 수치가 높아지고 있어요 (주의 필요)</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
