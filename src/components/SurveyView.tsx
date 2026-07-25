import React, { useState } from 'react';
import {
  Heart,
  Moon,
  Droplet,
  Dumbbell,
  BatteryCharging,
  Zap,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { BiometricSurvey } from '../types';

interface SurveyViewProps {
  onSubmitSurvey: (survey: {
    sleepHours: number;
    sleepQuality: 'Poor' | 'Moderate' | 'Optimal';
    hydrationLevel: number;
    heartRateZone: number;
    muscleSoreness: 'Low' | 'High';
    fatigueLevel: number;
  }) => void;
}

export const SurveyView: React.FC<SurveyViewProps> = ({ onSubmitSurvey }) => {
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState<'Poor' | 'Moderate' | 'Optimal'>('Optimal');
  const [hydrationLevel, setHydrationLevel] = useState(85);
  const [heartRateZone, setHeartRateZone] = useState(3);
  const [muscleSoreness, setMuscleSoreness] = useState<'Low' | 'High'>('Low');
  const [fatigueLevel, setFatigueLevel] = useState(4); // 1 = Exhausted, 5 = Refreshed
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSurvey({
      sleepHours,
      sleepQuality,
      hydrationLevel,
      heartRateZone,
      muscleSoreness,
      fatigueLevel,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-24 max-w-md md:max-w-xl mx-auto px-4 pt-2">
      {/* Header Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-gray-300">
            PERFORMANCE SURVEY
          </span>
          <span className="text-xs font-black text-[#D2FF00] font-mono">
            Step 2 of 3
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#1C202B] rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-[#D2FF00] rounded-full shadow-[0_0_10px_#D2FF00]" />
        </div>
      </div>

      {/* Main Title */}
      <div>
        <h1 className="text-2xl font-black text-white italic tracking-tight uppercase mb-1">
          How are you feeling today?
        </h1>
        <p className="text-xs text-gray-400">
          Input your subjective biometrics to optimize your daily training load.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 bg-[#13151A] border border-[#D2FF00]/40 rounded-3xl text-center space-y-4 my-8">
          <CheckCircle2 className="w-16 h-16 text-[#D2FF00] mx-auto animate-bounce" />
          <h2 className="text-xl font-black text-white uppercase italic">
            DATA TRANSMITTED
          </h2>
          <p className="text-xs text-gray-300">
            Your subjective biometrics have been logged. ARIS engine recalculated your readiness score to <span className="text-[#D2FF00] font-bold">94%</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. SLEEP DURATION & QUALITY */}
          <div className="p-5 bg-[#13151A] border border-[#222631] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-[#1D212C] text-[#D2FF00]">
                <Moon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D2FF00] font-mono">
                SLEEP
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">Sleep Duration</span>
              <span className="px-3 py-1 bg-[#1A1E29] border border-[#2B3142] text-white font-mono font-bold text-xs rounded-lg">
                {sleepHours}+ Hours
              </span>
            </div>

            <input
              type="range"
              min="3"
              max="11"
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="w-full accent-[#D2FF00] bg-[#1E222D] rounded-lg h-2"
            />

            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase font-mono pt-1">
              <span
                onClick={() => setSleepQuality('Poor')}
                className={`cursor-pointer ${sleepQuality === 'Poor' ? 'text-red-400 font-black' : ''}`}
              >
                POOR
              </span>
              <span
                onClick={() => setSleepQuality('Optimal')}
                className={`cursor-pointer ${sleepQuality === 'Optimal' ? 'text-[#D2FF00] font-black' : ''}`}
              >
                OPTIMAL
              </span>
            </div>
          </div>

          {/* 2. HYDRATION LEVEL */}
          <div className="p-5 bg-[#13151A] border border-[#222631] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-[#172338] text-[#3A86FF]">
                <Droplet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3A86FF] font-mono">
                HYDRATION
              </span>
            </div>

            <h3 className="font-extrabold text-white text-base">Hydration Level</h3>

            <input
              type="range"
              min="0"
              max="100"
              value={hydrationLevel}
              onChange={(e) => setHydrationLevel(Number(e.target.value))}
              className="w-full accent-[#3A86FF] bg-[#1E222D] rounded-lg h-2"
            />

            <div className="flex justify-between text-[10px] font-extrabold text-gray-400 uppercase font-mono">
              <span>DEHYDRATED</span>
              <span>OPTIMAL</span>
            </div>
          </div>

          {/* 3. HEART RATE ZONE / RPE */}
          <div className="p-5 bg-[#13151A] border border-[#222631] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-[#281820] text-[#FF4B4B]">
                <Heart className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D2FF00] font-mono">
                HEART RATE
              </span>
            </div>

            <h3 className="font-extrabold text-white text-base">Heart Rate Strain Zone</h3>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setHeartRateZone(num)}
                  className={`py-3 rounded-xl border text-sm font-black transition-all ${
                    heartRateZone === num
                      ? 'bg-[#1C212D] border-[#D2FF00] text-[#D2FF00] shadow-[0_0_12px_rgba(210,255,0,0.2)]'
                      : 'bg-[#181B22] border-[#252936] text-gray-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* 4. PHYSIOLOGY / MUSCLE SORENESS */}
          <div className="p-5 bg-[#13151A] border border-[#222631] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-[#1D212C] text-[#D2FF00]">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D2FF00] font-mono">
                PHYSIOLOGY
              </span>
            </div>

            <h3 className="font-extrabold text-white text-base">Muscle Soreness</h3>

            <div className="grid grid-cols-2 gap-3">
              {(['Low', 'High'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setMuscleSoreness(level)}
                  className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                    muscleSoreness === level
                      ? 'bg-[#1C212D] border-[#D2FF00] text-[#D2FF00]'
                      : 'bg-[#181B22] border-[#252936] text-gray-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* 5. GENERAL FATIGUE BATTERY SCALE */}
          <div className="p-5 bg-[#13151A] border border-[#222631] rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-[#281E24] text-[#FF8A8A]">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 font-mono">
                RECOVERY
              </span>
            </div>

            <h3 className="font-extrabold text-white text-base">General Fatigue</h3>

            {/* Battery Level Cells */}
            <div className="flex items-center justify-between gap-1.5 p-2 bg-[#181B22] rounded-xl border border-[#262A37]">
              <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
              {[1, 2, 3, 4, 5].map((level) => {
                const isActive = fatigueLevel >= level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFatigueLevel(level)}
                    className={`h-8 flex-1 rounded-md transition-all ${
                      isActive
                        ? 'bg-[#D2FF00] shadow-[0_0_8px_#D2FF00]'
                        : 'bg-[#252936]'
                    }`}
                  />
                );
              })}
              <BatteryCharging className="w-5 h-5 text-[#D2FF00] flex-shrink-0" />
            </div>

            <div className="flex justify-between text-[9px] font-extrabold text-gray-400 uppercase font-mono">
              <span>EXTREME EXHAUSTION</span>
              <span>FULLY REFRESHED</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-[#D2FF00] hover:bg-[#c3ef00] text-[#0B0C0E] font-black uppercase tracking-wider text-base rounded-2xl shadow-[0_0_25px_rgba(210,255,0,0.35)] transition-all hover:scale-[1.01]"
          >
            Submit Data
          </button>

          <p className="text-[10px] font-bold text-gray-500 uppercase text-center tracking-widest flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-gray-500" /> SECURE HIPAA-COMPLIANT TRANSMISSION
          </p>
        </form>
      )}
    </div>
  );
};
