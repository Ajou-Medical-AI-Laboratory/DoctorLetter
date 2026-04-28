import { useState } from 'react';
import { ArrowLeft, Bell, BellOff, Camera, Check, Clock, Info, AlertTriangle } from 'lucide-react';

interface MedicationScheduleProps {
  onBack: () => void;
}

interface Medication {
  id: string;
  name: string;
  dose: string;
  times: string[];
  color: string;
  active: boolean;
  description: string;
  purpose: string;
  sideEffects: string[];
}

export function MedicationSchedule({ onBack }: MedicationScheduleProps) {
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: '메트포르민',
      dose: '500mg',
      times: ['08:00', '20:00'],
      color: 'blue',
      active: true,
      description: '혈당을 낮추는 경구용 당뇨병 치료제입니다.',
      purpose: '혈당 조절 및 인슐린 저항성 개선',
      sideEffects: ['소화불량', '설사', '복부 불편감', '메스꺼움']
    },
    {
      id: '2',
      name: '아스피린',
      dose: '100mg',
      times: ['08:00'],
      color: 'red',
      active: true,
      description: '혈액을 묽게 하여 혈전 형성을 예방하는 약입니다.',
      purpose: '심혈관 질환 예방 및 혈전 방지',
      sideEffects: ['위장 장애', '속쓰림', '출혈 위험 증가', '알레르기 반응']
    },
    {
      id: '3',
      name: '오메프라졸',
      dose: '20mg',
      times: ['08:00'],
      color: 'purple',
      active: false,
      description: '위산 분비를 억제하여 위염과 역류성 식도염을 치료합니다.',
      purpose: '위산 분비 억제 및 위 보호',
      sideEffects: ['두통', '복통', '설사', '비타민 B12 흡수 감소']
    }
  ]);

  const toggleMedication = (id: string) => {
    setMedications(meds =>
      meds.map(med =>
        med.id === id ? { ...med, active: !med.active } : med
      )
    );
  };

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
  };

  const todaySchedule = [
    { time: '08:00', medications: ['메트포르민 500mg', '아스피린 100mg', '오메프라졸 20mg'], done: true },
    { time: '12:00', medications: [''], done: false },
    { time: '20:00', medications: ['메트포르민 500mg'], done: false }
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
        <h1 className="text-xl font-bold text-gray-900">복약 알림</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Usage Guide */}
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h3 className="font-bold text-green-900 mb-3">💊 복약 알림 사용 방법</h3>
            <ul className="space-y-2 text-green-800 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>처방전 촬영:</strong> 처방전을 촬영하면 자동으로 약 정보와 복용 시간이 등록됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>약 정보:</strong> 각 약물의 "정보" 버튼을 눌러 효능과 부작용을 확인하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>알림 설정:</strong> 알림 버튼으로 각 약물별로 알림을 켜고 끌 수 있습니다</span>
              </li>
            </ul>
          </div>

          {/* Add Prescription */}
          <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 rounded-2xl text-lg flex items-center justify-center gap-3 shadow-lg transition-all">
            <Camera className="w-6 h-6" />
            처방전 촬영하기
          </button>

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-green-600" />
              <h2 className="font-bold text-xl text-gray-900">오늘의 복약 스케줄</h2>
            </div>

            <div className="space-y-4">
              {todaySchedule.map((schedule, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 rounded-xl ${
                    schedule.done ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      schedule.done ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {schedule.done ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <span className="text-white font-bold text-sm">{schedule.time}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900 mb-1">{schedule.time}</div>
                    {schedule.medications[0] ? (
                      <div className="space-y-1">
                        {schedule.medications.map((med, medIdx) => (
                          <div key={medIdx} className="text-gray-700">{med}</div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 italic">복용할 약이 없습니다</div>
                    )}
                  </div>

                  {!schedule.done && schedule.medications[0] && (
                    <button className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      복용 완료
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Medication List */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h2 className="font-bold text-xl text-gray-900 mb-6">등록된 약</h2>

            <div className="space-y-4">
              {medications.map((med) => {
                const colors = colorClasses[med.color];
                return (
                  <div
                    key={med.id}
                    className={`rounded-xl p-5 border-2 ${colors.border} ${colors.bg}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{med.name}</h3>
                        <p className={`${colors.text} font-medium`}>{med.dose}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedMedId(selectedMedId === med.id ? null : med.id)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white hover:bg-gray-100 border-2 border-gray-300 transition-all"
                        >
                          <Info className="w-4 h-4" />
                          정보
                        </button>
                        <button
                          onClick={() => toggleMedication(med.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            med.active
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                          }`}
                        >
                          {med.active ? (
                            <>
                              <Bell className="w-4 h-4" />
                              알림 켜짐
                            </>
                          ) : (
                            <>
                              <BellOff className="w-4 h-4" />
                              알림 꺼짐
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {med.times.map((time, idx) => (
                        <div
                          key={idx}
                          className="bg-white px-4 py-2 rounded-lg font-medium text-gray-700 border border-gray-300"
                        >
                          {time}
                        </div>
                      ))}
                    </div>

                    {/* Medication Details */}
                    {selectedMedId === med.id && (
                      <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-4">
                        <div className="bg-white/50 rounded-xl p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2">약물 설명</h4>
                              <p className="text-gray-700">{med.description}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/50 rounded-xl p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2">효능 및 작용</h4>
                              <p className="text-gray-700">{med.purpose}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/50 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 mb-3">주요 부작용</h4>
                              <ul className="space-y-2">
                                {med.sideEffects.map((effect, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-orange-600">•</span>
                                    <span>{effect}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="text-sm text-gray-600 mt-3 bg-orange-50 p-3 rounded-lg border border-orange-200">
                                ⚠️ 부작용이 심하거나 지속되면 의사와 상담하세요
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
            <h3 className="font-bold text-lg text-blue-900 mb-4">💡 알림 설정</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>앱 알림과 문자 메시지로 알려드려요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>복용 시간 5분 전에 미리 알림을 보냅니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>놓치신 경우 30분 후 다시 알려드려요</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
