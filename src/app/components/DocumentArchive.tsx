import { useState } from 'react';
import { ArrowLeft, FileText, Search, Filter, ChevronDown, FlaskConical, Stethoscope, Pill, Image as ImageIcon, FileBarChart, MoreVertical, X, Edit2, Trash2, MessageSquarePlus, Volume2, ZoomIn, AlertCircle, Check, Building2, UserRound, Calendar } from 'lucide-react';

interface DocumentArchiveProps {
  onBack: () => void;
}

type ViewMode = 'time' | 'disease' | 'type';

interface Doc {
  id: number;
  title: string;
  type: string;
  disease: string;
  date: string;
  icon: any;
  color: string;
  hospital?: string;
  doctor?: string;
  ocrText?: string;
  aiSummary?: string;
  keyValues?: { label: string; value: string; status?: 'normal' | 'high' | 'low' }[];
  memo?: string;
}

const initialDocs: Doc[] = [
  {
    id: 1,
    title: '유방 조직 검사 결과지',
    type: '병리',
    disease: '유방암',
    date: '2026.04.15',
    icon: FlaskConical,
    color: 'bg-purple-100 text-purple-600',
    hospital: '서울대학교병원',
    doctor: '박서연 (병리과)',
    ocrText: '진단명: Invasive ductal carcinoma\n조직 소견: Grade 2, ER (+), PR (+), HER2 (-), Ki-67: 15%\n림프절 전이: 0/3 (No metastasis)\n절제연: Negative\nStage: T2N0M0',
    aiSummary: '유방 조직검사 결과 침윤성 유관암(가장 흔한 유방암 종류)으로 진단되었습니다. 호르몬 수용체(ER, PR)가 양성이라 호르몬 치료에 잘 반응할 가능성이 높고, HER2는 음성입니다. 림프절 전이가 없어 비교적 초기 단계(2기)입니다.',
    keyValues: [
      { label: '병기', value: 'T2N0M0', status: 'normal' },
      { label: 'ER', value: '양성 (+)', status: 'normal' },
      { label: 'PR', value: '양성 (+)', status: 'normal' },
      { label: 'HER2', value: '음성 (-)', status: 'normal' },
      { label: 'Ki-67', value: '15%', status: 'normal' },
    ],
  },
  {
    id: 2, title: '혈액검사 (CBC)', type: '혈액', disease: '유방암', date: '2026.04.10',
    icon: FlaskConical, color: 'bg-red-100 text-red-600',
    hospital: '서울대학교병원', doctor: '김지훈 (진단검사의학과)',
    ocrText: 'WBC: 6.2 (10³/μL)\nHb: 13.1 (g/dL)\nPLT: 245 (10³/μL)\nANC: 3.8 (10³/μL)\nLymph: 2.1 (10³/μL)',
    aiSummary: '혈액 수치가 모두 정상 범위 내에 있습니다. 항암치료 중 가장 중요한 백혈구 수치도 정상이라 감염 위험이 낮습니다.',
    keyValues: [
      { label: 'WBC', value: '6.2', status: 'normal' },
      { label: 'Hb', value: '13.1', status: 'normal' },
      { label: 'PLT', value: '245', status: 'normal' },
    ],
  },
  {
    id: 3, title: '처방전 - 타목시펜', type: '처방전', disease: '유방암', date: '2026.04.10',
    icon: Pill, color: 'bg-green-100 text-green-600',
    hospital: '서울대학교병원', doctor: '이민수 (혈액종양내과)',
    ocrText: '처방약: Tamoxifen 20mg\n복용법: 1일 1회 식후 (아침)\n처방 일수: 90일\n조제 약국: 서울약국',
    aiSummary: '호르몬 양성 유방암 표준 치료제입니다. 보통 5년 이상 복용하며, 정기 검진과 부작용 모니터링이 필요합니다.',
  },
  {
    id: 4, title: '유방 MRI 영상 판독지', type: '영상 판독지', disease: '유방암', date: '2026.03.28',
    icon: ImageIcon, color: 'bg-blue-100 text-blue-600',
    hospital: '서울대학교병원', doctor: '정수민 (영상의학과)',
    ocrText: '소견: 우측 유방 외상부에 약 2.3cm 크기의 종괴 관찰\n악성 소견 의심 (BI-RADS 5)\n림프절 전이 소견 없음\n반대측 유방 정상',
    aiSummary: '오른쪽 유방에 2.3cm 크기의 종양이 발견되었습니다. 영상 검사상 악성 가능성이 높아 조직검사가 필요합니다. 다행히 림프절로의 전이는 보이지 않습니다.',
  },
  {
    id: 5, title: '종양표지자 (CA 15-3, CEA)', type: '혈액', disease: '유방암', date: '2026.03.20',
    icon: FlaskConical, color: 'bg-red-100 text-red-600',
    hospital: '서울대학교병원',
    ocrText: 'CA 15-3: 18.5 U/mL (정상 < 25)\nCEA: 2.1 ng/mL (정상 < 5)',
    aiSummary: '유방암 관련 종양표지자가 정상 범위 내에 있습니다. 치료가 잘 되고 있다는 긍정적인 신호입니다.',
    keyValues: [
      { label: 'CA 15-3', value: '18.5 U/mL', status: 'normal' },
      { label: 'CEA', value: '2.1 ng/mL', status: 'normal' },
    ],
  },
  {
    id: 6, title: '진단서 - 침윤성 유관암', type: '진단서', disease: '유방암', date: '2026.03.15',
    icon: Stethoscope, color: 'bg-indigo-100 text-indigo-600',
    hospital: '서울대학교병원', doctor: '이민수 (혈액종양내과)',
    ocrText: '병명: 유방의 악성 신생물 (C50.4)\n진단일: 2026년 3월 15일\n향후 치료: 호르몬 치료 + 정기 검진\n진단의: 이민수',
    aiSummary: '유방암(침윤성 유관암) 공식 진단서입니다. 암 보험 청구나 산정특례 신청에 사용할 수 있습니다.',
  },
  {
    id: 7, title: '건강검진 종합 결과', type: '건강검진', disease: '일반', date: '2026.02.10',
    icon: FileBarChart, color: 'bg-amber-100 text-amber-600',
    hospital: '강남세브란스 검진센터',
    ocrText: '신장: 165cm, 체중: 58kg, BMI: 21.3\n혈압: 118/76\n공복혈당: 92\n간기능 (AST/ALT): 24/22\n콜레스테롤: 185',
    aiSummary: '전반적으로 건강한 상태입니다. 모든 수치가 정상 범위에 있어 큰 문제는 없습니다.',
  },
  {
    id: 8, title: '갑상선 초음파', type: '영상 판독지', disease: '갑상선', date: '2026.01.22',
    icon: ImageIcon, color: 'bg-blue-100 text-blue-600',
    hospital: '서울대학교병원', doctor: '정수민 (영상의학과)',
    ocrText: '갑상선 우엽에 0.5cm 결절\nTI-RADS 3 (양성 가능성 높음)\n경과 관찰 권장',
    aiSummary: '갑상선에 작은 결절이 있지만 양성일 가능성이 높습니다. 6개월~1년 후 재검을 권장합니다.',
  },
  {
    id: 9, title: '갑상선 기능 검사 (TSH, T4)', type: '혈액', disease: '갑상선', date: '2026.01.22',
    icon: FlaskConical, color: 'bg-red-100 text-red-600',
    hospital: '서울대학교병원',
    ocrText: 'TSH: 2.1 mIU/L (정상)\nFree T4: 1.3 ng/dL (정상)\nFree T3: 3.2 pg/mL (정상)',
    aiSummary: '갑상선 호르몬 수치가 모두 정상입니다. 갑상선 기능이 잘 작동하고 있어요.',
    keyValues: [
      { label: 'TSH', value: '2.1 mIU/L', status: 'normal' },
      { label: 'Free T4', value: '1.3 ng/dL', status: 'normal' },
    ],
  },
];

const diseases = ['전체', '유방암', '갑상선', '일반'];
const types = ['전체', '진단서', '병리', '혈액', '영상 판독지', '처방전', '건강검진'];
const periods = ['전체', '최근 1개월', '최근 3개월', '최근 6개월', '최근 1년'];

export function DocumentArchive({ onBack }: DocumentArchiveProps) {
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [viewMode, setViewMode] = useState<ViewMode>('disease');
  const [filterDisease, setFilterDisease] = useState('전체');
  const [filterType, setFilterType] = useState('전체');
  const [filterPeriod, setFilterPeriod] = useState('최근 6개월');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editDoc, setEditDoc] = useState<Doc | null>(null);
  const [memoDoc, setMemoDoc] = useState<Doc | null>(null);
  const [memoText, setMemoText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = docs.filter(d => {
    if (filterDisease !== '전체' && d.disease !== filterDisease) return false;
    if (filterType !== '전체' && d.type !== filterType) return false;
    if (search && !d.title.includes(search)) return false;
    return true;
  });

  const groupKey = viewMode === 'disease' ? 'disease' : viewMode === 'type' ? 'type' : null;
  const grouped: Record<string, Doc[]> = {};
  if (groupKey) {
    filtered.forEach(d => {
      const key = d[groupKey];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(d);
    });
  } else {
    grouped['전체'] = filtered;
  }

  const updateDoc = (updated: Doc) => {
    setDocs(docs.map(d => d.id === updated.id ? updated : d));
    setEditDoc(null);
  };

  const deleteDoc = (id: number) => {
    setDocs(docs.filter(d => d.id !== id));
    setConfirmDelete(null);
    setMenuOpenId(null);
  };

  const saveMemo = () => {
    if (memoDoc) {
      updateDoc({ ...memoDoc, memo: memoText });
      setMemoDoc(null);
      setMemoText('');
    }
  };

  const renderDocCard = (doc: Doc) => {
    const Icon = doc.icon;
    return (
      <div key={doc.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all relative">
        <div className="flex items-start gap-3 cursor-pointer" onClick={() => setSelectedDoc(doc)}>
          <div className={`w-12 h-12 ${doc.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <h4 className="font-bold text-sm text-gray-900 truncate">{doc.title}</h4>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{doc.type}</span>
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{doc.disease}</span>
              <span className="text-[10px] text-gray-400">· {doc.date}</span>
            </div>
            {doc.memo && (
              <p className="text-[11px] text-amber-700 mt-1.5 italic line-clamp-1">📝 {doc.memo}</p>
            )}
          </div>
        </div>

        {/* ⋯ 메뉴 */}
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === doc.id ? null : doc.id); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>

        {menuOpenId === doc.id && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
            <div className="absolute top-12 right-3 z-20 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-44">
              <button
                onClick={() => { setEditDoc(doc); setMenuOpenId(null); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3"
              >
                <Edit2 className="w-4 h-4 text-blue-500" /> 분류 수정
              </button>
              <button
                onClick={() => { setMemoDoc(doc); setMemoText(doc.memo || ''); setMenuOpenId(null); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center gap-3"
              >
                <MessageSquarePlus className="w-4 h-4 text-amber-500" /> {doc.memo ? '메모 수정' : '메모 추가'}
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => { setConfirmDelete(doc.id); setMenuOpenId(null); }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-3"
              >
                <Trash2 className="w-4 h-4" /> 삭제
              </button>
            </div>
          </>
        )}
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
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">내 검사 기록</h1>
          <p className="text-xs text-gray-500">{filtered.length}개 문서</p>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-2xl mx-auto">

          {/* 검색창 */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="문서 검색..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* 보기 방식 토글 */}
          <div className="bg-white rounded-xl p-1.5 mb-4 flex gap-1 shadow-sm border border-gray-200">
            {[
              { key: 'disease' as const, label: '질병별', icon: '🏥' },
              { key: 'type' as const, label: '검사종류별', icon: '📄' },
              { key: 'time' as const, label: '시간순', icon: '🕐' },
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                  viewMode === key ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-1">{icon}</span>{label}
              </button>
            ))}
          </div>

          {/* 필터 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white rounded-xl px-4 py-3 mb-3 flex items-center justify-between shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">필터</span>
              {(filterDisease !== '전체' || filterType !== '전체') && (
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {[filterDisease, filterType].filter(f => f !== '전체').length}개 적용
                </span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {showFilters && (
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200 space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">🏥 질병</label>
                <div className="flex flex-wrap gap-2">
                  {diseases.map(d => (
                    <button key={d} onClick={() => setFilterDisease(d)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterDisease === d ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">📄 검사 종류</label>
                <div className="flex flex-wrap gap-2">
                  {types.map(t => (
                    <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterType === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">📅 기간</label>
                <div className="flex flex-wrap gap-2">
                  {periods.map(p => (
                    <button key={p} onClick={() => setFilterPeriod(p)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterPeriod === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 문서 목록 */}
          {Object.keys(grouped).length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">검색 결과가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(grouped).map(([groupName, docList]) => (
                <div key={groupName}>
                  {viewMode !== 'time' && (
                    <div className="flex items-center justify-between mb-2 px-1">
                      <h3 className="text-sm font-bold text-gray-700">
                        {viewMode === 'disease' ? '🏥' : '📄'} {groupName}
                      </h3>
                      <span className="text-xs text-gray-400">{docList.length}개</span>
                    </div>
                  )}
                  <div className="space-y-2">{docList.map(renderDocCard)}</div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-4 mt-6 border border-blue-200">
            <p className="text-xs text-blue-800">
              💡 <strong>검사지를 촬영하면</strong> AI가 자동으로 질병과 검사 종류를 분류합니다.
              잘못 분류된 경우 ⋯ 메뉴에서 직접 수정할 수 있어요.
            </p>
          </div>
        </div>
      </div>

      {/* === 문서 상세 보기 (모달) === */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* 헤더 */}
            <div className={`${selectedDoc.color} px-6 py-5 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <selectedDoc.icon className="w-7 h-7" />
                <div>
                  <h2 className="font-bold text-lg">{selectedDoc.title}</h2>
                  <p className="text-xs opacity-80">{selectedDoc.type} · {selectedDoc.date}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/30 hover:bg-white/50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-4">
              {/* 촬영 사진 (placeholder) */}
              <div className="bg-gray-100 rounded-xl p-8 text-center border-2 border-dashed border-gray-300 relative">
                <div className="text-6xl mb-2">📄</div>
                <p className="text-sm text-gray-500">촬영한 문서 이미지</p>
                <button className="mt-3 inline-flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50">
                  <ZoomIn className="w-3 h-3" /> 크게 보기
                </button>
              </div>

              {/* 핵심 수치 */}
              {selectedDoc.keyValues && selectedDoc.keyValues.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">핵심 수치</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoc.keyValues.map((kv) => (
                      <div key={kv.label} className={`rounded-lg p-3 ${
                        kv.status === 'high' ? 'bg-red-50' : kv.status === 'low' ? 'bg-blue-50' : 'bg-green-50'
                      }`}>
                        <p className="text-xs text-gray-500">{kv.label}</p>
                        <p className={`font-bold text-sm ${
                          kv.status === 'high' ? 'text-red-700' : kv.status === 'low' ? 'text-blue-700' : 'text-green-700'
                        }`}>{kv.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI 쉬운 설명 */}
              {selectedDoc.aiSummary && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                      ✨ AI가 쉽게 풀어드린 설명
                    </h3>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-indigo-100">
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{selectedDoc.aiSummary}</p>
                </div>
              )}

              {/* 원본 OCR 텍스트 */}
              {selectedDoc.ocrText && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">원본 내용 (OCR)</h3>
                  <pre className="bg-gray-50 rounded-xl p-4 text-xs text-gray-700 whitespace-pre-wrap font-mono border border-gray-200">{selectedDoc.ocrText}</pre>
                </div>
              )}

              {/* 메모 */}
              {selectedDoc.memo && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h3 className="text-xs font-bold text-amber-800 mb-1">📝 내 메모</h3>
                  <p className="text-sm text-amber-900">{selectedDoc.memo}</p>
                </div>
              )}
            </div>

            {/* 하단 액션 */}
            <div className="border-t border-gray-200 p-4 flex gap-2">
              <button onClick={() => { setEditDoc(selectedDoc); setSelectedDoc(null); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <Edit2 className="w-4 h-4" /> 분류 수정
              </button>
              <button onClick={() => { setMemoDoc(selectedDoc); setMemoText(selectedDoc.memo || ''); setSelectedDoc(null); }} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                <MessageSquarePlus className="w-4 h-4" /> 메모
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === 분류 수정 모달 === */}
      {editDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setEditDoc(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">분류 수정</h2>
              <button onClick={() => setEditDoc(null)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">제목</label>
                <input
                  type="text"
                  value={editDoc.title}
                  onChange={(e) => setEditDoc({ ...editDoc, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">🏥 질병</label>
                <div className="flex flex-wrap gap-2">
                  {diseases.filter(d => d !== '전체').map(d => (
                    <button key={d} onClick={() => setEditDoc({ ...editDoc, disease: d })} className={`px-3 py-1.5 rounded-full text-xs font-medium ${editDoc.disease === d ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {editDoc.disease === d && <Check className="w-3 h-3 inline mr-1" />}{d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">📄 검사 종류</label>
                <div className="flex flex-wrap gap-2">
                  {types.filter(t => t !== '전체').map(t => (
                    <button key={t} onClick={() => setEditDoc({ ...editDoc, type: t })} className={`px-3 py-1.5 rounded-full text-xs font-medium ${editDoc.type === t ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {editDoc.type === t && <Check className="w-3 h-3 inline mr-1" />}{t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">📅 검사일</label>
                <input
                  type="text"
                  value={editDoc.date}
                  onChange={(e) => setEditDoc({ ...editDoc, date: e.target.value })}
                  placeholder="2026.04.15"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div className="border-t border-gray-200 p-4 flex gap-2">
              <button onClick={() => setEditDoc(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm">취소</button>
              <button onClick={() => updateDoc(editDoc)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* === 메모 추가 모달 === */}
      {memoDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setMemoDoc(null)}>
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-900">메모 추가</h2>
              <button onClick={() => setMemoDoc(null)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs text-gray-500 mb-2">{memoDoc.title}</p>
              <textarea
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                placeholder="이 검사에 대한 메모를 남겨주세요..."
                rows={5}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
            <div className="border-t border-gray-200 p-4 flex gap-2">
              <button onClick={() => setMemoDoc(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm">취소</button>
              <button onClick={saveMemo} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-sm">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* === 삭제 확인 === */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 text-center mb-1">문서를 삭제할까요?</h2>
            <p className="text-sm text-gray-500 text-center mb-5">삭제된 문서는 복구할 수 없습니다.</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm">취소</button>
              <button onClick={() => deleteDoc(confirmDelete)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
