import React from 'react';
import { Moon, Droplet, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { User } from '../types';

interface RecoveryViewProps {
  user: User;
  onNavigateDashboard: () => void;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({ user, onNavigateDashboard }) => {
  const trendData = [
    { day: 'MON', score: 72 },
    { day: 'TUE', score: 78 },
    { day: 'WED', score: 68 },
    { day: 'THU', score: 82 },
    { day: 'FRI', score: 88 },
    { day: 'SAT', score: 91 },
    { day: 'SUN', score: user.recoveryScore || 94 },
  ];

  const score = user.recoveryScore || 94;
  const isExcellent = score >= 85;

  return (
    <div className="space-y-6 pb-24 max-w-md md:max-w-xl mx-auto px-4 pt-2">
      {/* Recovery Score Circular Meter */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-[#1A1D27]"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-[#D2FF00] transition-all duration-1000"
            strokeWidth="6"
            strokeDasharray={264}
            strokeDashoffset={264 - (264 * score) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-[#D2FF00] font-sans tracking-tight">
            {score}
          </span>
          <span className="text-xs font-black uppercase tracking-widest text-white mt-1">
            RECOVERY
          </span>
        </div>
      </div>

      {/* Readiness Badge */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#182313] border border-[#D2FF00]/40 text-[#D2FF00] text-xs font-extrabold uppercase tracking-wider shadow-[0_0_15px_rgba(210,255,0,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#D2FF00] animate-ping" />
          EXCELLENT - READY TO PERFORM
        </span>
      </div>

      {/* Insight Text */}
      <p className="text-xs text-gray-300 text-center leading-relaxed px-4 font-medium">
        Optimal sleep quality and high hydration levels detected. Your nervous system is primed for maximum intensity today.
      </p>

      {/* Metric Cards Row */}
      <div className="space-y-3">
        <div className="p-4 bg-[#13151A] border border-[#222631] rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1C202B] text-[#D2FF00]">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Sleep Duration</div>
              <div className="text-base font-extrabold text-white font-mono">
                {user.sleepDuration || '8h 42m'}
              </div>
            </div>
          </div>
          <span className="text-xs font-black text-[#D2FF00] font-mono">+12%</span>
        </div>

        <div className="p-4 bg-[#13151A] border border-[#222631] rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#172338] text-[#3A86FF]">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Hydration Index</div>
              <div className="text-base font-extrabold text-white font-mono">
                {user.hydrationIndex || 'Optimal'}
              </div>
            </div>
          </div>
          <span className="text-xs font-black text-[#D2FF00] font-mono">Stable</span>
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      <div className="p-5 bg-[#13151A] border border-[#222631] rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white">7-Day Trend</h3>
          <span className="text-[10px] font-bold text-[#D2FF00] font-mono uppercase flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> SCORE HISTORY
          </span>
        </div>

        <div className="h-40 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <XAxis dataKey="day" stroke="#6B7280" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#13151A', borderColor: '#222631', borderRadius: '12px' }}
                itemStyle={{ color: '#D2FF00', fontWeight: 'bold' }}
              />
              <Bar dataKey="score" fill="#D2FF00" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* View Full Dashboard Navigation Button */}
      <button
        onClick={onNavigateDashboard}
        className="w-full py-3.5 bg-[#D2FF00] hover:bg-[#c2ef00] text-[#0B0C0E] font-black uppercase text-sm rounded-2xl shadow-[0_0_20px_rgba(210,255,0,0.3)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
      >
        View Full Dashboard <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
