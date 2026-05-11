import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Crown, Dna, Edit2, Eye, EyeOff, User, TrendingDown, TrendingUp, Minus, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { deleteMemberApi, FindMemberResponse, getMeApi, updateMemberApi } from '../api/member';
import { logoutApi } from '../api/auth';
import { useAuth } from '../auth/AuthContext';

interface ProfileProps {
  onBack: () => void;
  onMembership: () => void;
  onLogout: () => void;
  onInsights: () => void;
  onUpgrade: () => void;
  userTier: 'free' | 'pro' | 'max';
}

const SEX_LABEL: Record<string, string> = { M: '남성', F: '여성', O: '기타' };

export function Profile({ onBack, onMembership, onLogout, onInsights, onUpgrade, userTier }: ProfileProps) {
  const { refreshToken, clear } = useAuth();

  const [editMode, setEditMode] = useState<'password' | 'disease' | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [disease, setDisease] = useState('');
  const [showLabDetail, setShowLabDetail] = useState(false);

  const [userInfo, setUserInfo] = useState<FindMemberResponse | null>(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMeApi();
        if (!cancelled) {
          setUserInfo(me);
          setDisease(me.specificity_disease ?? '');
        }
      } catch (e: any) {
        if (!cancelled) setLoadError(e?.message || '내 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoadingMe(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 누적 검사 결과 데이터 (백엔드 미구현 — 정적 데이터 유지)
  const labResults = [
    { name: 'CA 15-3', unit: 'U/mL', current: 18.5, previous: 22.3, reference: '< 25', history: [28.1, 25.4, 22.3, 20.1, 18.5], dates: ['2025.12', '2026.01', '2026.02', '2026.03', '2026.04'] },
    { name: 'CEA', unit: 'ng/mL', current: 2.1, previous: 2.8, reference: '< 5', history: [4.2, 3.5, 2.8, 2.4, 2.1], dates: ['2025.12', '2026.01', '2026.02', '2026.03', '2026.04'] },
    { name: '백혈구(WBC)', unit: '10³/μL', current: 6.2, previous: 5.8, reference: '4.0-10.0', history: [5.5, 5.7, 5.8, 6.0, 6.2], dates: ['2025.12', '2026.01', '2026.02', '2026.03', '2026.04'] },
    { name: '혈색소(Hb)', unit: 'g/dL', current: 13.1, previous: 12.8, reference: '12.0-16.0', history: [11.5, 12.0, 12.8, 13.0, 13.1], dates: ['2025.12', '2026.01', '2026.02', '2026.03', '2026.04'] },
    { name: '혈소판(PLT)', unit: '10³/μL', current: 245, previous: 230, reference: '150-400', history: [198, 210, 230, 238, 245], dates: ['2025.12', '2026.01', '2026.02', '2026.03', '2026.04'] },
  ];

  const getTrend = (current: number, previous: number) => {
    const pct = ((current - previous) / previous) * 100;
    if (pct < -5) return { dir: 'down' as const, pct: Math.abs(pct), color: 'text-green-600', bg: 'bg-green-50', icon: TrendingDown };
    if (pct > 5) return { dir: 'up' as const, pct: Math.abs(pct), color: 'text-red-600', bg: 'bg-red-50', icon: TrendingUp };
    return { dir: 'stable' as const, pct: Math.abs(pct), color: 'text-blue-600', bg: 'bg-blue-50', icon: Minus };
  };

  const isInRange = (value: number, ref: string) => {
    if (ref.startsWith('<')) return value < parseFloat(ref.slice(1).trim());
    if (ref.startsWith('>')) return value > parseFloat(ref.slice(1).trim());
    const [lo, hi] = ref.split('-').map(s => parseFloat(s.trim()));
    return value >= lo && value <= hi;
  };

  const overallScore = labResults.filter(l => isInRange(l.current, l.reference)).length;
  const totalTests = labResults.length;

  const renderSparkline = (history: number[]) => {
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;
    const w = 80, h = 28;
    const points = history.map((v, i) => `${(i / (history.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
    return (
      <svg width={w} height={h} className="inline-block">
        <polyline points={points} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={(history.length - 1) / (history.length - 1) * w} cy={h - ((history[history.length - 1] - min) / range) * h} r="3" fill="#6366f1" />
      </svg>
    );
  };

  const tierInfo = {
    free: { name: '일반 회원', color: 'gray', icon: User },
    pro: { name: 'Pro 회원', color: 'blue', icon: Crown },
    max: { name: 'Max 회원', color: 'purple', icon: Crown }
  };

  const currentTier = tierInfo[userTier];
  const TierIcon = currentTier.icon;

  const resetEditState = () => {
    setEditMode(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setActionError('');
  };

  const handlePasswordChange = async () => {
    setActionError('');
    if (!currentPassword) {
      setActionError('현재 비밀번호를 입력해주세요.');
      return;
    }
    if (!newPassword || newPassword !== confirmPassword) {
      setActionError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setSubmitting(true);
    try {
      await updateMemberApi({ password: currentPassword, new_password: newPassword });
      resetEditState();
    } catch (e: any) {
      setActionError(e?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiseaseChange = async () => {
    setActionError('');
    if (!currentPassword) {
      setActionError('현재 비밀번호를 입력해주세요.');
      return;
    }
    if (!disease) {
      setActionError('병명을 입력해주세요.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await updateMemberApi({ password: currentPassword, specificity_disease: disease });
      setUserInfo((prev) => (prev ? { ...prev, specificity_disease: res.specificity_disease } : prev));
      resetEditState();
    } catch (e: any) {
      setActionError(e?.message || '병명 변경에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logoutApi(refreshToken);
    } catch {
      /* 로그아웃 실패해도 로컬 토큰은 비움 */
    }
    clear();
    onLogout();
  };

  const userName = userInfo?.name ?? '';
  const userEmail = userInfo?.userId ?? '';
  const userSex = userInfo?.sex ? (SEX_LABEL[userInfo.sex] ?? userInfo.sex) : '-';
  const userAge = userInfo?.age != null ? `${userInfo.age}세` : '-';

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
        <h1 className="text-xl font-bold text-gray-900">내 정보</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Usage Guide */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">💡 회원정보 수정 안내</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>비밀번호 변경:</strong> 보안을 위해 주기적으로 변경해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>병명 변경:</strong> 현재 상태에 맞게 업데이트하면 더 정확한 정보를 받을 수 있어요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>변경 시 현재 비밀번호 확인이 필요합니다</strong></span>
              </li>
            </ul>
          </div>

          {/* Load Error */}
          {loadError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium">
              {loadError}
            </div>
          )}

          {/* User Info */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {userName ? userName.charAt(0) : '?'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loadingMe ? '불러오는 중...' : userName || '이름 없음'}
                </h2>
                <p className="text-gray-600">{userEmail || '-'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">성별</span>
                <span className="font-medium text-gray-900">{userSex}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">나이</span>
                <span className="font-medium text-gray-900">{userAge}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">현재 병명</span>
                <span className="font-medium text-gray-900">{userInfo?.specificity_disease || '미등록'}</span>
              </div>
            </div>
          </div>

          {/* Membership Tier */}
          <button
            onClick={onMembership}
            className={`w-full bg-gradient-to-r ${
              userTier === 'max'
                ? 'from-purple-600 to-pink-600'
                : userTier === 'pro'
                ? 'from-blue-600 to-cyan-600'
                : 'from-gray-600 to-gray-700'
            } text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <TierIcon className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="text-white/80 text-sm mb-1">현재 등급</p>
                  <p className="text-2xl font-bold">{currentTier.name}</p>
                </div>
              </div>
              <ArrowLeft className="w-6 h-6 rotate-180" />
            </div>
          </button>

          {/* Password Change */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">비밀번호 변경</h3>
              {editMode !== 'password' && (
                <button
                  onClick={() => { resetEditState(); setEditMode('password'); }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  변경
                </button>
              )}
            </div>

            {editMode === 'password' ? (
              <div className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호 (대문자/소문자/특수문자 포함)"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none pr-12"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호 확인"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />

                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-sm">새 비밀번호가 일치하지 않습니다</p>
                )}

                {actionError && (
                  <p className="text-red-500 text-sm">{actionError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handlePasswordChange}
                    disabled={submitting || !currentPassword || !newPassword || newPassword !== confirmPassword}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    {submitting ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={resetEditState}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">변경하려면 우측 [변경] 버튼을 누르세요.</p>
            )}
          </div>

          {/* Disease Change */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">현재 병명</h3>
              {editMode !== 'disease' && (
                <button
                  onClick={() => { resetEditState(); setEditMode('disease'); setDisease(userInfo?.specificity_disease ?? ''); }}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  변경
                </button>
              )}
            </div>

            {editMode === 'disease' ? (
              <div className="space-y-4">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />

                <input
                  type="text"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="현재 병명을 입력하세요"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />

                {actionError && (
                  <p className="text-red-500 text-sm">{actionError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleDiseaseChange}
                    disabled={submitting || !currentPassword || !disease}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    {submitting ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={resetEditState}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-900 text-lg font-medium">{userInfo?.specificity_disease || '미등록'}</p>
            )}
          </div>

          {/* 건강 인사이트 버튼 */}
          <button
            onClick={onInsights}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl p-6 shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Dna className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="text-white/80 text-sm mb-1">맞춤 건강 관리</p>
                  <p className="text-xl font-bold">나의 건강 인사이트</p>
                </div>
              </div>
              <ArrowLeft className="w-6 h-6 rotate-180" />
            </div>
          </button>

          {/* 누적 검사 결과 요약 (정적 더미 — 백엔드 미구현) */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            {userTier === 'free' ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">누적 검사 결과</h3>
                <p className="text-sm text-gray-500 mb-4">Pro 또는 Max 멤버십에서<br />검사 결과 추이를 한눈에 확인하세요</p>
                <button
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
                >
                  멤버십 업그레이드
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowLabDetail(!showLabDetail)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg text-gray-900">누적 검사 결과</h3>
                      <p className="text-sm text-gray-500">최근 5개월 · {totalTests}개 항목</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                      overallScore === totalTests ? 'bg-green-100 text-green-700' :
                      overallScore >= totalTests - 1 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {overallScore}/{totalTests} 정상
                    </div>
                    {showLabDetail ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </button>

                <div className="px-6 pb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        overallScore === totalTests ? 'bg-green-500' :
                        overallScore >= totalTests - 1 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(overallScore / totalTests) * 100}%` }}
                    />
                  </div>
                  <p className={`text-sm mt-2 font-medium ${
                    overallScore === totalTests ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {overallScore === totalTests
                      ? '모든 검사 수치가 정상 범위입니다 👍'
                      : `${totalTests - overallScore}개 항목이 주의가 필요합니다`}
                  </p>
                </div>

                <div className="px-6 pb-4 grid grid-cols-3 gap-3">
                  {labResults.slice(0, 3).map((lab) => {
                    const trend = getTrend(lab.current, lab.previous);
                    const normal = isInRange(lab.current, lab.reference);
                    return (
                      <div key={lab.name} className={`rounded-xl p-3 ${trend.bg}`}>
                        <p className="text-xs text-gray-500 mb-1 truncate">{lab.name}</p>
                        <p className={`text-lg font-bold ${normal ? 'text-gray-900' : 'text-red-600'}`}>{lab.current}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <trend.icon className={`w-3 h-3 ${trend.color}`} />
                          <span className={`text-xs font-medium ${trend.color}`}>{trend.pct.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {showLabDetail && (
                  <div className="border-t border-gray-200">
                    {labResults.map((lab) => {
                      const trend = getTrend(lab.current, lab.previous);
                      const normal = isInRange(lab.current, lab.reference);
                      const TrendIcon = trend.icon;
                      return (
                        <div key={lab.name} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-2.5 h-2.5 rounded-full ${normal ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className="font-bold text-gray-900">{lab.name}</span>
                              <span className="text-xs text-gray-400">({lab.reference} {lab.unit})</span>
                            </div>
                            {renderSparkline(lab.history)}
                          </div>
                          <div className="flex items-center justify-between ml-5">
                            <div className="flex items-center gap-4">
                              <div>
                                <span className="text-xs text-gray-400">이전</span>
                                <span className="ml-1 text-sm text-gray-600">{lab.previous}</span>
                              </div>
                              <span className="text-gray-300">→</span>
                              <div>
                                <span className="text-xs text-gray-400">현재</span>
                                <span className={`ml-1 text-sm font-bold ${normal ? 'text-gray-900' : 'text-red-600'}`}>{lab.current}</span>
                                <span className="text-xs text-gray-400 ml-1">{lab.unit}</span>
                              </div>
                            </div>
                            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg ${trend.bg}`}>
                              <TrendIcon className={`w-3.5 h-3.5 ${trend.color}`} />
                              <span className={`text-xs font-bold ${trend.color}`}>
                                {trend.dir === 'down' ? '감소' : trend.dir === 'up' ? '증가' : '안정'}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 ml-5">
                            {lab.dates.map((d, i) => (
                              <span key={d} className={`text-[10px] ${i === lab.dates.length - 1 ? 'text-indigo-600 font-bold' : 'text-gray-300'}`}>{d}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <div className="px-6 py-4 bg-indigo-50">
                      <p className="text-xs text-indigo-700 font-medium mb-2">📋 검사 결과 해석</p>
                      <div className="grid grid-cols-3 gap-2 text-[11px]">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-gray-600">정상 범위</span></div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-gray-600">범위 초과</span></div>
                        <div className="flex items-center gap-1"><TrendingDown className="w-3 h-3 text-green-600" /><span className="text-gray-600">감소 (긍정)</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogoutClick}
            className="w-full bg-white hover:bg-gray-50 text-red-600 font-bold py-4 rounded-2xl border-2 border-red-200 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
