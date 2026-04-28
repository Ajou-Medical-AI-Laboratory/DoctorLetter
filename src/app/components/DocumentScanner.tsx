import { useState } from 'react';
import { ArrowLeft, Camera, Check, FileText } from 'lucide-react';

interface DocumentScannerProps {
  onBack: () => void;
  onComplete: () => void;
}

export function DocumentScanner({ onBack, onComplete }: DocumentScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = () => {
    setScanning(true);

    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2000);

    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  return (
    <div className="size-full flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 text-white px-6 py-4 flex items-center gap-4 shadow-lg">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">의료문서 촬영</h1>
      </header>

      {/* Camera View */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-900">
        {/* Camera Frame */}
        <div className="relative w-full max-w-lg aspect-[3/4] mx-4">
          {/* Viewfinder */}
          <div className="absolute inset-0 border-4 border-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="size-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              {!scanned ? (
                <FileText className="w-32 h-32 text-gray-400" />
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-white text-xl font-bold">촬영 완료!</p>
                </div>
              )}
            </div>
          </div>

          {/* Corner Guides */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-400"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-400"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-400"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-400"></div>

          {/* Scanning Animation */}
          {scanning && (
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute inset-x-0 h-1 bg-blue-500 shadow-lg shadow-blue-500/50 animate-[scan_2s_ease-in-out]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-800 px-6 py-8">
        <div className="max-w-lg mx-auto">
          {/* Instructions */}
          <div className="bg-gray-700 rounded-2xl p-6 mb-6">
            <h3 className="text-white font-bold text-lg mb-3">📋 의료문서 촬영 가이드</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>서류 전체 촬영:</strong> 진단서나 검사 결과지 전체가 화면에 보이도록 해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>밝은 곳에서:</strong> 조명이 밝은 곳에서 촬영하면 더 정확하게 분석됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>흔들림 방지:</strong> 손을 고정하거나 평평한 곳에 놓고 촬영하세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>지원 서류:</strong> 진단서, 검사결과지, 병리확인서, 처방전 등</span>
              </li>
            </ul>
          </div>

          {/* Capture Button */}
          <button
            onClick={handleScan}
            disabled={scanning || scanned}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-6 rounded-2xl text-xl flex items-center justify-center gap-3 shadow-lg transition-all"
          >
            <Camera className="w-7 h-7" />
            {scanning ? '분석 중...' : scanned ? '완료!' : '촬영하기'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
