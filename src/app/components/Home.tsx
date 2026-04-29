import { Camera, Pill, TrendingUp, Volume2, User, FolderOpen } from 'lucide-react';

type Screen = 'home' | 'scanner' | 'result' | 'medication' | 'trend' | 'profile' | 'membership' | 'payment' | 'login' | 'signup' | 'archive';

interface HomeProps {
  onNavigate: (screen: Screen) => void;
  userTier: 'free' | 'pro' | 'max';
}

export function Home({ onNavigate, userTier }: HomeProps) {
  const tierInfo = {
    free: { name: '일반 회원', color: 'bg-gray-500' },
    pro: { name: 'Pro', color: 'bg-blue-500' },
    max: { name: 'Max', color: 'bg-purple-500' }
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-8 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🩺</span>
            </div>
            <h1 className="text-3xl font-bold">닥터레터</h1>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">{tierInfo[userTier].name}</span>
          </button>
        </div>
        <p className="text-blue-100 text-lg">쉽게 이해하는 나의 건강 정보</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Document Scan Card */}
          <button
            onClick={() => onNavigate('scanner')}
            className="w-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-400 text-left"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">의료문서 촬영</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  진단서, 검사 결과지를 촬영하면<br />
                  쉬운 말로 설명해드려요
                </p>
                <div className="flex items-center gap-2 mt-3 text-blue-600">
                  <Volume2 className="w-5 h-5" />
                  <span className="text-sm font-medium">음성으로 들을 수 있어요</span>
                </div>
              </div>
            </div>
          </button>

          {/* Trend Analysis Card */}
          <button
            onClick={() => onNavigate('result')}
            className="w-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-400 text-left"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">누적 검사 비교</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  이전 검사 결과와 비교해서<br />
                  변화를 그래프로 보여드려요
                </p>
              </div>
            </div>
          </button>

          {/* Document Archive Card */}
          <button
            onClick={() => onNavigate('archive')}
            className="w-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-400 text-left"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-8 h-8 text-orange-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">내 검사 기록</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  지금까지 촬영한 의료 문서를<br />
                  질병별·종류별로 정리해서 보여드려요
                </p>
              </div>
            </div>
          </button>

          {/* Medication Card */}
          <button
            onClick={() => onNavigate('medication')}
            className="w-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-400 text-left"
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Pill className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">복약 알림</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  처방전을 촬영하면 자동으로<br />
                  약 먹을 시간을 알려드려요
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
                    알림 켜짐
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Help Section */}
        <div className="max-w-2xl mx-auto mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3">💡 이렇게 사용하세요</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>병원에서 받은 서류를 촬영하세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>AI가 어려운 용어를 쉽게 풀어드려요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>음성으로도 들을 수 있어요</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
