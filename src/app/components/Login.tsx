import { useState } from 'react';
import { Eye, EyeOff, Fingerprint, Lock, Mail } from 'lucide-react';
import { loginApi } from '../api/auth';
import { useAuth } from '../auth/AuthContext';

interface LoginProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Login({ onLogin, onSignup }: LoginProps) {
  const { setTokens } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'normal' | 'biometric'>('normal');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const tokens = await loginApi(email, password);
      setTokens(tokens.accessToken, tokens.refreshToken);
      onLogin();
    } catch (e: any) {
      setError(e?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  return (
    <div className="size-full flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-5xl">🩺</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">닥터레터</h1>
            <p className="text-lg text-gray-600">쉽게 이해하는 나의 건강 정보</p>
          </div>

          {/* Login Method Toggle */}
          <div className="bg-white rounded-2xl p-2 shadow-md mb-6 flex gap-2">
            <button
              onClick={() => setLoginMethod('normal')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                loginMethod === 'normal'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Mail className="w-5 h-5 inline mr-2" />
              일반 로그인
            </button>
            <button
              onClick={() => setLoginMethod('biometric')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                loginMethod === 'biometric'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Fingerprint className="w-5 h-5 inline mr-2" />
              생체 인식
            </button>
          </div>

          {/* Login Form */}
          {loginMethod === 'normal' ? (
            <div className="space-y-4">
              {/* Email Input */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <label className="block text-sm font-bold text-gray-700 mb-3">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>

              {/* Password Input */}
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <label className="block text-sm font-bold text-gray-700 mb-3">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg pr-12"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-5 rounded-2xl text-lg shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    로그인 중...
                  </>
                ) : '로그인'}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  비밀번호를 잊으셨나요?
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 shadow-md text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Fingerprint className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">생체 인식 로그인</h3>
              <p className="text-gray-600 mb-8 text-lg">
                지문 또는 얼굴 인식으로<br />
                간편하게 로그인하세요
              </p>
              <button
                onClick={handleBiometricLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 rounded-2xl text-lg shadow-lg transition-all"
              >
                생체 인식 시작
              </button>
            </div>
          )}

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg mb-3">아직 회원이 아니신가요?</p>
            <button
              onClick={onSignup}
              className="text-blue-600 hover:text-blue-700 font-bold text-lg underline"
            >
              회원가입하기
            </button>
          </div>

          {/* Usage Guide */}
          <div className="mt-12 bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-3">💡 로그인 방법</h4>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>일반 로그인:</strong> 이메일과 비밀번호로 로그인합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>생체 인식:</strong> 지문 또는 얼굴 인식으로 빠르게 로그인할 수 있습니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>생체 인식은 회원가입 후 설정에서 등록할 수 있습니다</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
