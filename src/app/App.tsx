import { useState } from 'react';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Home } from './components/Home';
import { DocumentScanner } from './components/DocumentScanner';
import { AnalysisResult } from './components/AnalysisResult';
import { MedicationSchedule } from './components/MedicationSchedule';
import { TrendComparison } from './components/TrendComparison';
import { Profile } from './components/Profile';
import { MembershipManagement } from './components/MembershipManagement';
import { Payment } from './components/Payment';
import { HealthInsights } from './components/HealthInsights';
import { DocumentArchive } from './components/DocumentArchive';

type Screen = 'login' | 'signup' | 'home' | 'scanner' | 'result' | 'medication' | 'trend' | 'profile' | 'membership' | 'payment' | 'insights' | 'archive';
type MembershipTier = 'free' | 'pro' | 'max';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userTier, setUserTier] = useState<MembershipTier>('free');
  const [trendViewCount, setTrendViewCount] = useState(0);

  const handleLogout = () => {
    setUserTier('free');
    setTrendViewCount(0);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <Login onLogin={() => setCurrentScreen('home')} onSignup={() => setCurrentScreen('signup')} />;
      case 'signup':
        return <Signup onComplete={() => setCurrentScreen('login')} onBack={() => setCurrentScreen('login')} />;
      case 'home':
        return <Home onNavigate={setCurrentScreen} userTier={userTier} />;
      case 'scanner':
        return <DocumentScanner onBack={() => setCurrentScreen('home')} onComplete={() => setCurrentScreen('result')} />;
      case 'result':
        return <AnalysisResult onBack={() => setCurrentScreen('home')} onViewTrend={() => setCurrentScreen('trend')} userTier={userTier} onUpgrade={() => setCurrentScreen('payment')} />;
      case 'medication':
        return <MedicationSchedule onBack={() => setCurrentScreen('home')} />;
      case 'trend':
        return <TrendComparison onBack={() => setCurrentScreen('result')} userTier={userTier} viewCount={trendViewCount} onUpgrade={() => setCurrentScreen('payment')} onIncrementView={() => setTrendViewCount(prev => prev + 1)} />;
      case 'profile':
        return <Profile onBack={() => setCurrentScreen('home')} onMembership={() => setCurrentScreen('membership')} onLogout={handleLogout} onInsights={() => setCurrentScreen('insights')} onUpgrade={() => setCurrentScreen('payment')} userTier={userTier} />;
      case 'membership':
        return <MembershipManagement onBack={() => setCurrentScreen('profile')} onUpgrade={() => setCurrentScreen('payment')} userTier={userTier} />;
      case 'payment':
        return <Payment onBack={() => setCurrentScreen('membership')} onComplete={(tier) => { setUserTier(tier); setCurrentScreen('home'); }} />;
      case 'insights':
        return <HealthInsights onBack={() => setCurrentScreen('profile')} userTier={userTier} onUpgrade={() => setCurrentScreen('payment')} />;
      case 'archive':
        return <DocumentArchive onBack={() => setCurrentScreen('home')} />;
      default:
        return <Login onLogin={() => setCurrentScreen('home')} onSignup={() => setCurrentScreen('signup')} />;
    }
  };

  return (
    <div className="size-full bg-gray-50">
      {renderScreen()}
    </div>
  );
}