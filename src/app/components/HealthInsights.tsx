import { useState } from 'react';
import { ArrowLeft, BookOpen, Shield, Heart, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Dna, Pill, Apple, Activity, Lock, Crown, Sparkles, Send } from 'lucide-react';

interface HealthInsightsProps {
  onBack: () => void;
  userTier: 'free' | 'pro' | 'max';
  onUpgrade: () => void;
}

// 논문 인용 데이터
const citations = {
  hormoneTherapy: {
    title: 'Hormone receptor-positive breast cancer: long-term outcomes with endocrine therapy',
    journal: 'NEJM',
    year: 2022,
    doi: '10.1056/NEJMoa2201634',
    finding: 'ER+/PR+ 유방암 환자에서 5년간 호르몬 치료 시 재발률이 약 15% 감소',
  },
  exercise: {
    title: 'Physical activity and survival after breast cancer diagnosis',
    journal: 'JAMA Oncology',
    year: 2023,
    doi: '10.1001/jamaoncol.2023.1578',
    finding: '주 150분 이상 중강도 운동 시 재발 위험 약 24% 감소',
  },
  bmi: {
    title: 'Body mass index and breast cancer recurrence',
    journal: 'Journal of Clinical Oncology',
    year: 2021,
    doi: '10.1200/JCO.2021.39.15',
    finding: 'BMI 25 이상에서 재발 위험이 약 35% 증가하며, 체중 관리가 예후에 중요',
  },
  vitaminD: {
    title: 'Vitamin D and cancer outcomes: evidence from meta-analysis',
    journal: 'Lancet Oncology',
    year: 2023,
    doi: '10.1016/S1470-2045(23)00234-1',
    finding: '비타민 D 충분 유지 시(30ng/mL 이상) 유방암 재발률 약 16% 감소',
  },
  geneticRisk: {
    title: 'Multigene panel testing for hereditary breast cancer risk',
    journal: 'Nature Genetics',
    year: 2024,
    doi: '10.1038/s41588-024-01627-2',
    finding: 'BRCA1/2 음성이라도 ATM, CHEK2, PALB2 변이 시 유방암 위험 2-4배 증가',
  },
  mentalHealth: {
    title: 'Psychological distress and cancer prognosis',
    journal: 'BMJ',
    year: 2023,
    doi: '10.1136/bmj-2023-075199',
    finding: '우울/불안 관리 환자군에서 치료 순응도 40% 향상, 삶의 질 유의미한 개선',
  },
};

export function HealthInsights({ onBack, userTier, onUpgrade }: HealthInsightsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('risk');
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiHistory, setAiHistory] = useState<{q:string;a:string}[]>([]);

  const toggle = (key: string) => setExpandedSection(expandedSection === key ? null : key);

  const isPro = userTier === 'pro' || userTier === 'max';
  const isMax = userTier === 'max';

  // 잠금 오버레이 컴포넌트
  const LockOverlay = ({ tier, feature }: { tier: 'pro' | 'max'; feature: string }) => (
    <div className="px-5 pb-5">
      <div className={`rounded-xl p-6 text-center border-2 ${tier === 'max' ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'}`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${tier === 'max' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}`}>
          {tier === 'max' ? <Crown className="w-7 h-7 text-white" /> : <Lock className="w-6 h-6 text-white" />}
        </div>
        <p className={`text-sm font-bold mb-1 ${tier === 'max' ? 'text-purple-900' : 'text-blue-900'}`}>
          {tier === 'max' ? 'Max 멤버십 전용' : 'Pro 이상 전용'}
        </p>
        <p className="text-xs text-gray-600 mb-4">{feature}</p>
        <button
          onClick={onUpgrade}
          className={`text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md transition-all ${
            tier === 'max'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
          }`}
        >
          {tier === 'max' ? 'Max로 업그레이드' : 'Pro로 업그레이드'}
        </button>
      </div>
    </div>
  );

  // AI 상담 모의 응답
  const handleAiAsk = () => {
    if (!aiQuestion.trim()) return;
    const responses = [
      '귀하의 ER+/PR+/HER2- 유방암은 호르몬 치료에 잘 반응하는 타입입니다. 타목시펜을 5년 이상 복용하면 재발률이 약 15% 감소한다는 연구 결과가 있습니다 (NEJM, 2022).',
      'PIK3CA 변이가 검출된 경우 PI3K 억제제(알펠리십) 치료 효과가 보고되고 있습니다. 담당 의료진과 상의해보시기 바랍니다.',
      '주 150분 이상 중강도 운동(빠른 걷기, 자전거 등)이 재발 위험을 24% 낮춘다는 연구가 있습니다. 점진적으로 운동량을 늘려보세요.',
      '비타민 D 수치를 30ng/mL 이상으로 유지하면 재발률이 16% 감소합니다. 정기 검사와 보충제를 고려해보세요.',
    ];
    const answer = responses[Math.floor(Math.random() * responses.length)];
    setAiHistory([...aiHistory, { q: aiQuestion, a: answer }]);
    setAiQuestion('');
  };

  const CitationCard = ({ cite }: { cite: typeof citations.hormoneTherapy }) => (
    <div className="bg-gray-50 rounded-xl p-4 mt-3 border border-gray-200">
      <div className="flex items-start gap-2">
        <BookOpen className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs text-gray-700 font-medium leading-relaxed">{cite.finding}</p>
          <p className="text-[10px] text-gray-400 mt-1.5">
            {cite.journal} ({cite.year}) · {cite.title}
          </p>
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ id, icon: Icon, title, subtitle, color }: { id: string; icon: any; title: string; subtitle: string; color: string }) => (
    <button
      onClick={() => toggle(id)}
      className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      {expandedSection === id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
    </button>
  );

  const RiskBar = ({ label, level, desc }: { label: string; level: 'low' | 'moderate' | 'high'; desc: string }) => {
    const colors = { low: 'bg-green-500', moderate: 'bg-yellow-500', high: 'bg-red-500' };
    const textColors = { low: 'text-green-700', moderate: 'text-yellow-700', high: 'text-red-700' };
    const bgColors = { low: 'bg-green-50', moderate: 'bg-yellow-50', high: 'bg-red-50' };
    const labels = { low: '낮음', moderate: '보통', high: '높음' };
    const widths = { low: '30%', moderate: '60%', high: '85%' };

    return (
      <div className={`${bgColors[level]} rounded-xl p-4 mb-3`}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${bgColors[level]} ${textColors[level]}`}>
            {labels[level]}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className={`${colors[level]} h-2 rounded-full transition-all duration-700`} style={{ width: widths[level] }} />
        </div>
        <p className="text-xs text-gray-600">{desc}</p>
      </div>
    );
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">나의 건강 인사이트</h1>
          <p className="text-xs text-gray-500">개인 맞춤 건강 관리 리포트</p>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* 환자 요약 카드 */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">김</div>
              <div>
                <h2 className="text-xl font-bold">김경현님의 건강 리포트</h2>
                <p className="text-indigo-200 text-sm">유방암 (침윤성 유관암) · ER+/PR+/HER2- · T2N0M0</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-indigo-200 text-xs">진단 시기</p>
                <p className="font-bold text-lg">2026.04</p>
              </div>
              <div className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-indigo-200 text-xs">치료 단계</p>
                <p className="font-bold text-lg">호르몬</p>
              </div>
              <div className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-indigo-200 text-xs">검사 수</p>
                <p className="font-bold text-lg">12회</p>
              </div>
            </div>
          </div>

          {/* 안내 */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                이 리포트는 공개된 의학 논문을 기반으로 한 <strong>일반적인 통계 정보</strong>이며, 개인의 실제 예후와 다를 수 있습니다.
                반드시 담당 의료진과 상의하세요.
              </p>
            </div>
          </div>

          {/* ── 1. 위험 요인 평가 (Pro+) ── */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <SectionHeader id="risk" icon={Shield} title="위험 요인 평가" subtitle={isPro ? '나의 현재 상태 기반 위험도' : 'Pro 멤버십 전용'} color="bg-red-500" />
            {expandedSection === 'risk' && !isPro && (
              <LockOverlay tier="pro" feature="개인 맞춤 위험도 분석 (재발/심혈관/골다공증)" />
            )}
            {expandedSection === 'risk' && isPro && (
              <div className="px-5 pb-5">
                <RiskBar label="재발 위험" level="low" desc="ER+/PR+/HER2-, T2N0M0 — 호르몬 수용체 양성이며 림프절 전이 없어 비교적 양호한 예후입니다." />
                <RiskBar label="반대측 유방암 위험" level="low" desc="가족력 미확인 시 일반 인구 대비 연 0.5-1.0% 수준의 발생 확률입니다." />
                <RiskBar label="심혈관 위험" level="moderate" desc="호르몬 치료(타목시펜/아로마타제 억제제) 장기 복용 시 심혈관 모니터링이 권장됩니다." />
                <RiskBar label="골다공증 위험" level="moderate" desc="아로마타제 억제제 사용 시 골밀도 감소 위험이 있어 정기 검사가 필요합니다." />

                <CitationCard cite={citations.hormoneTherapy} />
              </div>
            )}
          </div>

          {/* ── 2. 유전체 & 바이오마커 (Max 전용) ── */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <SectionHeader id="genomic" icon={Dna} title="유전체 & 바이오마커" subtitle={isMax ? '검사 결과 기반 분석' : 'Max 멤버십 전용'} color="bg-purple-500" />
            {expandedSection === 'genomic' && !isMax && (
              <LockOverlay tier="max" feature="NGS/유전자 패널 검사 결과 분석 + 변이 의학적 해석" />
            )}
            {expandedSection === 'genomic' && isMax && (
              <div className="px-5 pb-5">
                <div className="space-y-3 mb-4">
                  {/* 바이오마커 상태 */}
                  {[
                    { marker: 'ER (에스트로겐 수용체)', status: '양성 (+)', meaning: '호르몬 치료에 반응할 가능성이 높습니다', good: true },
                    { marker: 'PR (프로게스테론 수용체)', status: '양성 (+)', meaning: '호르몬 치료 효과가 더 좋은 예후 인자입니다', good: true },
                    { marker: 'HER2', status: '음성 (-)', meaning: '표적치료(허셉틴) 대상은 아니나, 호르몬 치료 반응이 우수합니다', good: true },
                    { marker: 'Ki-67 (증식 지표)', status: '15%', meaning: '낮은 증식률로, 종양 성장 속도가 느린 편입니다', good: true },
                  ].map(({ marker, status, meaning, good }) => (
                    <div key={marker} className={`rounded-xl p-4 border ${good ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm text-gray-900">{marker}</span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${good ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{meaning}</p>
                    </div>
                  ))}
                </div>

                {/* 유전자 패널 결과 */}
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 mb-3">
                  <h4 className="font-bold text-sm text-indigo-900 mb-3">다유전자 패널 검사 결과</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { gene: 'BRCA1', result: '변이 미검출', risk: false },
                      { gene: 'BRCA2', result: '변이 미검출', risk: false },
                      { gene: 'TP53', result: '정상', risk: false },
                      { gene: 'PIK3CA', result: 'p.H1047R 검출', risk: true },
                      { gene: 'ATM', result: '정상', risk: false },
                      { gene: 'CHEK2', result: '정상', risk: false },
                    ].map(({ gene, result, risk }) => (
                      <div key={gene} className={`rounded-lg p-3 ${risk ? 'bg-amber-50 border border-amber-200' : 'bg-white border border-gray-200'}`}>
                        <p className="font-bold text-xs text-gray-900">{gene}</p>
                        <p className={`text-xs ${risk ? 'text-amber-700 font-medium' : 'text-gray-500'}`}>{result}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-amber-900 font-bold mb-1">PIK3CA p.H1047R 변이 검출</p>
                      <p className="text-xs text-amber-800">
                        이 변이는 HR+/HER2- 유방암의 약 40%에서 발견됩니다.
                        PI3K 억제제(알펠리십) 치료 대상이 될 수 있으며, 담당 의료진과 상의가 권장됩니다.
                      </p>
                    </div>
                  </div>
                </div>

                <CitationCard cite={citations.geneticRisk} />
              </div>
            )}
          </div>

          {/* ── 3. 치료 반응 & 통계 (Pro+) ── */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <SectionHeader id="treatment" icon={Pill} title="치료 반응 통계" subtitle={isPro ? '논문 기반 치료 효과 데이터' : 'Pro 멤버십 전용'} color="bg-blue-500" />
            {expandedSection === 'treatment' && !isPro && (
              <LockOverlay tier="pro" feature="개인 맞춤 치료 효과 통계 + 권장 치료 타임라인" />
            )}
            {expandedSection === 'treatment' && isPro && (
              <div className="px-5 pb-5">
                <p className="text-sm text-gray-600 mb-4">
                  귀하와 유사한 조건(ER+/PR+/HER2-, Stage II, 호르몬치료)의 환자군에서 보고된 통계입니다.
                </p>

                {/* 통계 카드 */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                    <p className="text-3xl font-bold text-blue-700">91%</p>
                    <p className="text-xs text-gray-600 mt-1">5년 무병생존율</p>
                    <p className="text-[10px] text-gray-400">Stage II, ER+/PR+</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                    <p className="text-3xl font-bold text-green-700">96%</p>
                    <p className="text-xs text-gray-600 mt-1">5년 전체생존율</p>
                    <p className="text-[10px] text-gray-400">Stage II, ER+/PR+</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
                    <p className="text-3xl font-bold text-purple-700">85%</p>
                    <p className="text-xs text-gray-600 mt-1">호르몬치료 반응률</p>
                    <p className="text-[10px] text-gray-400">ER+/PR+ 환자군</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-200">
                    <p className="text-3xl font-bold text-indigo-700">15%↓</p>
                    <p className="text-xs text-gray-600 mt-1">재발률 감소</p>
                    <p className="text-[10px] text-gray-400">5년 호르몬치료 시</p>
                  </div>
                </div>

                {/* 치료 타임라인 */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-3">
                  <h4 className="font-bold text-sm text-gray-900 mb-3">권장 치료 타임라인</h4>
                  <div className="space-y-3">
                    {[
                      { period: '현재', phase: '호르몬 치료 (타목시펜)', status: '진행 중', active: true },
                      { period: '1-5년', phase: '호르몬 치료 유지 + 정기 검진', status: '예정', active: false },
                      { period: '5-10년', phase: '연장 호르몬 치료 여부 평가', status: '의료진 상의', active: false },
                      { period: '평생', phase: '연 1회 유방촬영 + 혈액검사', status: '필수', active: false },
                    ].map(({ period, phase, status, active }) => (
                      <div key={period} className={`flex items-center gap-3 p-3 rounded-lg ${active ? 'bg-blue-100 border border-blue-300' : 'bg-white'}`}>
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${active ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-xs font-bold text-gray-900">{period}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${active ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'}`}>{status}</span>
                          </div>
                          <p className="text-xs text-gray-600">{phase}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <CitationCard cite={citations.hormoneTherapy} />
              </div>
            )}
          </div>

          {/* ── 4. 생활습관 관리 ── */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <SectionHeader id="lifestyle" icon={Apple} title="생활습관 관리" subtitle="근거 기반 건강 관리 가이드" color="bg-green-500" />
            {expandedSection === 'lifestyle' && (
              <div className="px-5 pb-5 space-y-4">
                {/* 운동 */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <h4 className="font-bold text-sm text-green-900">운동 (주 150분 이상)</h4>
                  </div>
                  <p className="text-xs text-gray-700 mb-1">중강도 유산소 운동(빠른 걷기, 자전거 등)을 주 5회, 30분 이상 권장합니다.</p>
                  <p className="text-xs text-green-700 font-medium">근거: 재발 위험 약 24% 감소 (JAMA Oncology, 2023)</p>
                  <CitationCard cite={citations.exercise} />
                </div>

                {/* 체중 관리 */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-amber-600" />
                    <h4 className="font-bold text-sm text-amber-900">체중 관리 (BMI 18.5-24.9)</h4>
                  </div>
                  <p className="text-xs text-gray-700 mb-1">정상 체중 유지가 호르몬 수용체 양성 유방암의 재발 방지에 중요합니다.</p>
                  <p className="text-xs text-amber-700 font-medium">근거: BMI 25 이상 시 재발 위험 약 35% 증가 (JCO, 2021)</p>
                  <CitationCard cite={citations.bmi} />
                </div>

                {/* 비타민 D */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-sm text-blue-900">비타민 D 관리 (30ng/mL 이상)</h4>
                  </div>
                  <p className="text-xs text-gray-700 mb-1">비타민 D 수치를 적정 수준으로 유지하면 재발률 감소에 도움이 됩니다.</p>
                  <p className="text-xs text-blue-700 font-medium">근거: 재발률 약 16% 감소 (Lancet Oncology, 2023)</p>
                  <CitationCard cite={citations.vitaminD} />
                </div>

                {/* 정신 건강 */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-sm text-purple-900">정신 건강 관리</h4>
                  </div>
                  <p className="text-xs text-gray-700 mb-1">스트레스 관리, 심리 상담이 치료 순응도와 삶의 질 향상에 기여합니다.</p>
                  <p className="text-xs text-purple-700 font-medium">근거: 치료 순응도 40% 향상 (BMJ, 2023)</p>
                  <CitationCard cite={citations.mentalHealth} />
                </div>
              </div>
            )}
          </div>

          {/* ── 5. AI 맞춤 상담 (Max 전용) ── */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            <SectionHeader id="ai" icon={Sparkles} title="AI 맞춤 상담" subtitle={isMax ? '검사 결과 기반 질문 답변' : 'Max 멤버십 전용'} color="bg-pink-500" />
            {expandedSection === 'ai' && !isMax && (
              <LockOverlay tier="max" feature="개인 검사 결과를 기반으로 AI가 24시간 맞춤 답변을 제공합니다" />
            )}
            {expandedSection === 'ai' && isMax && (
              <div className="px-5 pb-5">
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-200 mb-3">
                  <p className="text-xs text-pink-900">
                    💬 귀하의 진단(ER+/PR+/HER2- 유방암)과 검사 결과를 바탕으로 AI가 답변합니다.
                    의학적 조언이 아닌 참고용입니다.
                  </p>
                </div>

                {/* 대화 내역 */}
                {aiHistory.length > 0 && (
                  <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                    {aiHistory.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="bg-gray-100 rounded-xl px-4 py-3 ml-8">
                          <p className="text-sm text-gray-800">{item.q}</p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl px-4 py-3 mr-8 border border-pink-100">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-800 leading-relaxed">{item.a}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 입력창 */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiAsk()}
                    placeholder="궁금한 점을 물어보세요..."
                    className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none text-sm"
                  />
                  <button
                    onClick={handleAiAsk}
                    disabled={!aiQuestion.trim()}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 text-white px-4 rounded-xl shadow-md transition-all flex items-center justify-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* 추천 질문 */}
                {aiHistory.length === 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-500 font-medium">💡 추천 질문</p>
                    {[
                      '내 상태에서 운동은 어느 정도 해도 되나요?',
                      'PIK3CA 변이는 어떤 의미인가요?',
                      '비타민 D 보충제는 얼마나 먹어야 하나요?',
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => setAiQuestion(q)}
                        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-pink-50 rounded-lg text-xs text-gray-700 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 하단 안내 */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">💡 이 리포트에 대하여</h3>
            <ul className="space-y-2 text-xs text-blue-800">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>모든 통계는 <strong>동일 조건 환자군의 평균 데이터</strong>이며, 개인차가 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>논문 인용 정보는 최신 연구를 기반으로 하며, <strong>의료 조언을 대체하지 않습니다</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>구체적인 치료 계획은 반드시 <strong>담당 의료진과 상의</strong>하세요</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
