import { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, X } from 'lucide-react';

interface SignupProps {
  onComplete: () => void;
  onBack: () => void;
}

export function Signup({ onComplete, onBack }: SignupProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    age: '',
    disease: '',
    phone: '',
    optionalEmail: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    marketing: false
  });

  const passwordRequirements = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const isFormValid = formData.email && isPasswordValid && formData.password === formData.confirmPassword &&
    formData.gender && formData.age && formData.phone && agreements.termsOfService && agreements.privacyPolicy;

  const handleSubmit = () => {
    if (isFormValid) {
      onComplete();
    }
  };

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">회원가입</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Usage Guide */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-blue-900 mb-3">📝 회원가입 안내</h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>비밀번호는 8자 이상, 대소문자 및 특수문자를 포함해야 합니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>핸드폰 번호는 복약 알림을 위해 필수입니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>병명은 맞춤형 건강 정보 제공을 위해 사용됩니다</span>
              </li>
            </ul>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              이메일 (아이디) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="example@email.com"
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="space-y-2 mb-4">
              {Object.entries({
                length: '8자 이상',
                uppercase: '대문자 포함',
                lowercase: '소문자 포함',
                special: '특수문자 포함'
              }).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  {passwordRequirements[key as keyof typeof passwordRequirements] ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className={passwordRequirements[key as keyof typeof passwordRequirements] ? 'text-green-700' : 'text-gray-500'}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Confirm Password */}
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="비밀번호 확인"
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">비밀번호가 일치하지 않습니다</p>
            )}
          </div>

          {/* Gender & Age */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  성별 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                >
                  <option value="">선택</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  나이 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="나이"
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
            </div>
          </div>

          {/* Disease */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              현재 병명
            </label>
            <input
              type="text"
              value={formData.disease}
              onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
              placeholder="예: 유방암, 당뇨병 등 (선택사항)"
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            />
            <p className="text-sm text-gray-500 mt-2">맞춤형 건강 정보 제공을 위해 사용됩니다</p>
          </div>

          {/* Phone */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              핸드폰 번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="010-1234-5678"
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            />
            <p className="text-sm text-gray-500 mt-2">복약 알림 SMS를 위해 필수입니다</p>
          </div>

          {/* Optional Email */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              추가 이메일 (선택)
            </label>
            <input
              type="email"
              value={formData.optionalEmail}
              onChange={(e) => setFormData({ ...formData, optionalEmail: e.target.value })}
              placeholder="알림을 받을 추가 이메일"
              className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
            />
          </div>

          {/* Agreements */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-lg text-gray-900 mb-4">개인정보 수집 및 이용 동의</h3>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.termsOfService}
                  onChange={(e) => setAgreements({ ...agreements, termsOfService: e.target.checked })}
                  className="w-6 h-6 mt-0.5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-gray-900">서비스 이용약관 동의 <span className="text-red-500">*</span></span>
                  <p className="text-sm text-gray-600 mt-1">닥터레터 서비스 이용을 위한 필수 약관입니다</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.privacyPolicy}
                  onChange={(e) => setAgreements({ ...agreements, privacyPolicy: e.target.checked })}
                  className="w-6 h-6 mt-0.5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-gray-900">개인정보 처리방침 동의 <span className="text-red-500">*</span></span>
                  <p className="text-sm text-gray-600 mt-1">의료 정보 처리를 위한 필수 동의입니다</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={(e) => setAgreements({ ...agreements, marketing: e.target.checked })}
                  className="w-6 h-6 mt-0.5 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-gray-900">마케팅 정보 수신 동의 (선택)</span>
                  <p className="text-sm text-gray-600 mt-1">건강 정보 및 이벤트 소식을 받아보실 수 있습니다</p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-6 rounded-2xl text-xl shadow-lg transition-colors"
          >
            회원가입 완료
          </button>
        </div>
      </div>
    </div>
  );
}
