import React, { useState } from 'react';
import {
  AlertTriangle,
  Users,
  TrendingUp,
  Heart,
  Sparkles,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
} from 'lucide-react';
import { User, HighRiskAlert, SquadKPIs } from '../types';

interface RosterViewProps {
  athletes: User[];
  alerts: HighRiskAlert[];
  kpis: SquadKPIs;
  onSelectAthlete: (athlete: User) => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  athletes,
  alerts,
  kpis,
  onSelectAthlete,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL' | 'MODERATE' | 'OPTIMAL'>('ALL');

  const filteredAthletes = athletes.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.sport.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-24 max-w-md md:max-w-xl mx-auto px-4 pt-2">
      {/* 1. HIGH RISK ALERTS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white italic">
            HIGH RISK ALERTS
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FF4B4B]/20 border border-[#FF4B4B] text-[#FF4B4B] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4B4B] animate-ping" />
            {alerts.length} CRITICAL
          </span>
        </div>

        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 bg-[#1E1417] border border-[#FF4B4B]/40 rounded-2xl flex items-start gap-3 shadow-lg"
            >
              <div className="p-1.5 rounded-xl bg-[#3B171D] text-[#FF4B4B] flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm text-white">
                  {alert.athleteName} — {alert.riskTitle}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. ATHLETE ROSTER */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white italic">
            ATHLETE ROSTER
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = statusFilter === 'ALL' ? 'CRITICAL' : statusFilter === 'CRITICAL' ? 'MODERATE' : statusFilter === 'MODERATE' ? 'OPTIMAL' : 'ALL';
                setStatusFilter(next);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#171A23] border border-[#272D3D] text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-[#D2FF00]" />
              <span>{statusFilter}</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search athlete by name or sport..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#13151A] border border-[#222631] text-xs text-white pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:border-[#D2FF00]"
          />
        </div>

        {/* Roster List Container */}
        <div className="bg-[#13151A] border border-[#222631] rounded-3xl p-4 space-y-3">
          <div className="grid grid-cols-12 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider px-2 font-mono">
            <span className="col-span-6">ATHLETE</span>
            <span className="col-span-3 text-center">STATUS</span>
            <span className="col-span-3 text-right">RECOVERY</span>
          </div>

          <div className="space-y-2">
            {filteredAthletes.map((athlete) => (
              <div
                key={athlete.id}
                onClick={() => onSelectAthlete(athlete)}
                className="grid grid-cols-12 items-center p-2.5 bg-[#171A23] hover:bg-[#1E2330] rounded-2xl border border-[#242938] cursor-pointer transition-all"
              >
                <div className="col-span-6 flex items-center gap-2.5">
                  <img
                    src={athlete.avatarUrl}
                    alt={athlete.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#2E3547]"
                  />
                  <div>
                    <div className="font-bold text-xs text-white">{athlete.name}</div>
                    <div className="text-[10px] text-gray-400 capitalize">
                      {athlete.sport} | {athlete.group}
                    </div>
                  </div>
                </div>

                <div className="col-span-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase font-mono ${
                      athlete.status === 'CRITICAL'
                        ? 'bg-[#3B181E] text-[#FF4B4B] border border-[#FF4B4B]/40'
                        : athlete.status === 'MODERATE'
                        ? 'bg-[#2E2413] text-amber-400 border border-amber-500/40'
                        : 'bg-[#1C2818] text-[#D2FF00] border border-[#D2FF00]/40'
                    }`}
                  >
                    {athlete.status}
                  </span>
                </div>

                <div className="col-span-3 text-right">
                  <div className="text-xs font-black text-white font-mono">
                    {athlete.recoveryScore}%
                  </div>
                  <div className="w-full h-1 bg-[#252936] rounded-full mt-1 overflow-hidden">
                    <div
                      style={{ width: `${athlete.recoveryScore}%` }}
                      className={`h-full rounded-full ${
                        athlete.recoveryScore < 65
                          ? 'bg-[#FF4B4B]'
                          : athlete.recoveryScore < 80
                          ? 'bg-amber-400'
                          : 'bg-[#D2FF00]'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SQUAD KPI CARDS GRID */}
      <section className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-[#13151A] border border-[#222631] rounded-2xl space-y-2">
          <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
            TEAM READINESS
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#D2FF00] font-sans">
              {kpis.teamReadiness}%
            </span>
            <TrendingUp className="w-4 h-4 text-[#D2FF00]" />
          </div>
          <div className="w-full h-1.5 bg-[#202532] rounded-full overflow-hidden">
            <div
              style={{ width: `${kpis.teamReadiness}%` }}
              className="h-full bg-[#D2FF00] shadow-[0_0_10px_#D2FF00]"
            />
          </div>
        </div>

        <div className="p-4 bg-[#13151A] border border-[#222631] rounded-2xl space-y-2">
          <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
            INJURY RISK
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#FF6B6B] font-sans">
              High
            </span>
            <AlertTriangle className="w-4 h-4 text-[#FF6B6B]" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            3 ACTIVE FLAGS DETECTED
          </p>
        </div>

        <div className="p-4 bg-[#13151A] border border-[#222631] rounded-2xl space-y-2">
          <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
            AVG HRV BASELINE
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white font-sans">
              {kpis.avgHrvBaseline}
            </span>
            <Heart className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            STABLE (±2MS VARIANCE)
          </p>
        </div>

        <div className="p-4 bg-[#13151A] border border-[#222631] rounded-2xl space-y-2">
          <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
            OPTIMIZATION STATE
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#3A86FF] font-sans">
              {kpis.optimizationState}%
            </span>
            <Sparkles className="w-4 h-4 text-[#3A86FF]" />
          </div>
          <div className="w-full h-1.5 bg-[#202532] rounded-full overflow-hidden">
            <div
              style={{ width: `${kpis.optimizationState}%` }}
              className="h-full bg-[#3A86FF]"
            />
          </div>
        </div>
      </section>

      {/* 4. MATCH READINESS RECOMMENDATION */}
      <section className="space-y-3">
        <h2 className="text-xl font-black uppercase tracking-tight text-white italic">
          MATCH READINESS RECOMMENDATION
        </h2>

        <div className="bg-[#13151A] border border-[#222631] rounded-3xl p-5 space-y-4">
          {/* Cleared To Play */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
              CLEARED TO PLAY
            </div>
            <div className="p-3 bg-[#1C2818] border border-[#D2FF00]/40 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#D2FF00] flex-shrink-0" />
              <div>
                <div className="font-bold text-xs text-white">Prashant</div>
                <div className="text-[10px] text-gray-300">
                  Full match availability (Stable recovery)
                </div>
              </div>
            </div>
          </div>

          {/* Cleared With Caution */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
              CLEARED WITH CAUTION
            </div>
            <div className="p-3 bg-[#1D2230] border border-[#3A86FF]/40 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#3A86FF] flex-shrink-0" />
              <div>
                <div className="font-bold text-xs text-white">Bharath</div>
                <div className="text-[10px] text-gray-300">
                  Limited minutes recommended (Risk management)
                </div>
              </div>
            </div>
          </div>

          {/* Not Cleared */}
          <div className="space-y-2">
            <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider font-mono">
              NOT CLEARED
            </div>
            <div className="p-3 bg-[#2E161B] border border-[#FF4B4B]/40 rounded-2xl flex items-center gap-3">
              <XCircle className="w-5 h-5 text-[#FF4B4B] flex-shrink-0" />
              <div>
                <div className="font-bold text-xs text-white">Rohit & Sandeep</div>
                <div className="text-[10px] text-gray-300">
                  Rest / Rehab active (Strain risk)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
