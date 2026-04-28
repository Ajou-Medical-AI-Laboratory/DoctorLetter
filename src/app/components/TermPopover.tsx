import { X, Volume2 } from 'lucide-react';

interface TermPopoverProps {
  term: string;
  onClose: () => void;
}

export function TermPopover({ term, onClose }: TermPopoverProps) {
  const termDefinitions: Record<string, {
    simple: string;
    detailed: string;
    example: string;
  }> = {
    'ER 양성': {
      simple: '에스트로겐 호르몬에 반응하는 종류의 암입니다.',
      detailed: '에스트로겐은 우리 몸에 있는 여성 호르몬 중 하나예요. 이 호르몬에 반응하는 종류의 암이라는 뜻입니다.',
      example: '호르몬은 우리 몸이 사용하는 신호 같은 거예요. 이 암은 그 신호에 반응해서 자라기 때문에, 신호를 막는 약을 쓰면 자라지 못하게 할 수 있다는 뜻이에요.'
    },
    '유방암': {
      simple: '유방에 생긴 악성 종양을 말합니다.',
      detailed: '유방 조직의 세포가 비정상적으로 자라는 질병입니다.',
      example: '정상 세포가 통제를 벗어나 계속 자라는 상태입니다. 하지만 조기에 발견하면 치료 효과가 매우 좋습니다.'
    },
    'HER2 음성': {
      simple: 'HER2 단백질이 없는 종류의 암입니다.',
      detailed: 'HER2는 세포 성장에 관여하는 단백질인데, 이것이 암세포에 많지 않다는 의미입니다.',
      example: '일부 암은 HER2가 많아서 특수 치료가 필요한데, 이 경우는 그렇지 않아서 표준 치료로 충분합니다.'
    }
  };

  const definition = termDefinitions[term] || {
    simple: '의료 용어입니다.',
    detailed: '자세한 설명이 준비 중입니다.',
    example: ''
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl animate-[slideUp_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-blue-600 text-white px-8 py-6 rounded-t-3xl flex items-center justify-between sticky top-0">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{term}</h2>
            <p className="text-blue-100 text-sm">의료 용어 쉬운 설명</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Level 1 - Simple */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <h3 className="font-bold text-blue-900">간단한 설명</h3>
            </div>
            <p className="text-lg text-gray-800 leading-relaxed">{definition.simple}</p>
          </div>

          {/* Level 2 - Detailed */}
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <h3 className="font-bold text-green-900">조금 더 자세히</h3>
            </div>
            <p className="text-lg text-gray-800 leading-relaxed">{definition.detailed}</p>
          </div>

          {/* Level 3 - Example */}
          {definition.example && (
            <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <h3 className="font-bold text-purple-900">쉬운 비유</h3>
              </div>
              <p className="text-lg text-gray-800 leading-relaxed">{definition.example}</p>
            </div>
          )}

          {/* Audio Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg">
            <Volume2 className="w-6 h-6" />
            음성으로 듣기
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
