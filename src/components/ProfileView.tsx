import React, { useState } from 'react';
import {
  Info,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { User, SportType } from '../types';

interface ProfileViewProps {
  user: User;
  onUpdateSport: (sport: SportType) => void;
  onNavigateDashboard: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateSport,
  onNavigateDashboard,
}) => {
  const [selectedSport, setSelectedSport] = useState<SportType>(user.sport || 'football');
  const [saved, setSaved] = useState(false);

  const sportsList: {
    id: SportType;
    name: string;
    level: string;
    imageUrl: string;
    icon: string;
  }[] = [
    {
      id: 'cricket',
      name: 'Cricket',
      level: 'Professional',
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=300',
      icon: '🏏',
    },
    {
      id: 'football',
      name: 'Football',
      level: 'Elite League',
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=300',
      icon: '⚽',
    },
    {
      id: 'basketball',
      name: 'Basketball',
      level: 'Pro Circuit',
      imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=300',
      icon: '🏀',
    },
    {
      id: 'running',
      name: 'Running',
      level: 'Track/Trail',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=300',
      icon: '🏃',
    },
    {
      id: 'tennis',
      name: 'Tennis',
      level: 'ATP Style',
      imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=300',
      icon: '🎾',
    },
    {
      id: 'gym',
      name: 'Gym',
      level: 'Conditioning',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=300',
      icon: '🏋️',
    },
  ];

  const handleContinue = () => {
    onUpdateSport(selectedSport);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onNavigateDashboard();
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-24 max-w-md md:max-w-xl mx-auto px-4 pt-2">
      {/* Badge */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182313] border border-[#D2FF00]/40 text-[#D2FF00] text-xs font-black uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#D2FF00]" />
          ATHLETE PROFILE SETUP
        </span>
      </div>

      {/* Main Headline */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-white italic tracking-tight uppercase">
          Which sport do you play?
        </h1>
        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
          Select your primary discipline to calibrate your performance biometrics and recovery protocols.
        </p>
      </div>

      {/* Sport Selector Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {sportsList.map((sport) => {
          const isSelected = selectedSport === sport.id;
          return (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              className={`p-4 rounded-2xl border text-center relative overflow-hidden transition-all group ${
                isSelected
                  ? 'bg-[#181C25] border-[#D2FF00] shadow-[0_0_20px_rgba(210,255,0,0.2)]'
                  : 'bg-[#13151A] border-[#222631] hover:border-gray-500'
              }`}
            >
              <div className="relative w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-[#2A2F3E]">
                <img
                  src={sport.imageUrl}
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>

              <h3 className="font-bold text-sm text-white mb-0.5">{sport.name}</h3>
              <p className="text-[10px] text-gray-400 font-medium">
                {sport.icon} {sport.level}
              </p>

              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-5 h-5 text-[#D2FF00]" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-2 p-3 bg-[#13151A] border border-[#222631] rounded-2xl text-xs text-gray-400">
        <Info className="w-4 h-4 text-[#D2FF00] flex-shrink-0 mt-0.5" />
        <span>You can change your primary sport anytime in settings.</span>
      </div>

      {/* Continue Button */}
      <button
        onClick={handleContinue}
        disabled={saved}
        className="w-full py-3.5 bg-[#D2FF00] hover:bg-[#c2ef00] text-[#0B0C0E] font-black uppercase text-sm rounded-2xl shadow-[0_0_20px_rgba(210,255,0,0.3)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
      >
        {saved ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-[#0B0C0E]" /> Profile Calibrated!
          </>
        ) : (
          <>
            Continue <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
