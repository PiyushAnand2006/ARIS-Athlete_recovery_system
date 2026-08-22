import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Shield,
  Activity,
  Award,
  Users,
  Target,
  Bot,
  Loader2,
} from 'lucide-react';
import { SportProtocol } from '../types';

interface AIProtocolsViewProps {
  protocols: SportProtocol[];
}

export const AIProtocolsView: React.FC<AIProtocolsViewProps> = ({ protocols }) => {
  const [selectedSport, setSelectedSport] = useState('football');
  const [targetArea, setTargetArea] = useState('Hamstring & Lower Body');
  const [fatigueLevel, setFatigueLevel] = useState('3/5');
  const [intensity, setIntensity] = useState('High');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customProtocol, setCustomProtocol] = useState<any>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#D2FF00]" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-[#D2FF00]" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-[#D2FF00]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#D2FF00]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-[#D2FF00]" />;
      default:
        return <Target className="w-5 h-5 text-[#D2FF00]" />;
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/protocols/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: selectedSport,
          targetArea,
          fatigueLevel,
          intensity,
        }),
      });
      const data = await res.json();
      setCustomProtocol(data);
    } catch (err) {
      console.error('Error generating AI protocol:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-24 max-w-md md:max-w-xl mx-auto px-4 pt-2">
      {/* Header Banner */}
      <div className="bg-[#13151A] border border-[#222631] rounded-3xl p-5 space-y-2 relative overflow-hidden shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D2FF00] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-200">
              AI-GENERATED RECOVERY PROTOCOLS
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#D2FF00]/10 border border-[#D2FF00]/40 text-[#D2FF00] text-[10px] font-mono font-bold flex items-center gap-1">
            <Zap className="w-3 h-3" /> OPTIMIZED V 4.0.2
          </span>
        </div>
      </div>

      {/* Interactive AI Custom Generator Tool */}
      <section className="p-5 bg-[#13151A] border border-[#232733] rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#D2FF00]" />
          <h2 className="text-base font-black uppercase text-white italic">
            GENERATE CUSTOM AI PROTOCOL
          </h2>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Sport
              </label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full bg-[#181B22] border border-[#272B38] text-xs text-white rounded-xl px-3 py-2 uppercase font-semibold focus:outline-none focus:border-[#D2FF00]"
              >
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Badminton">Badminton</option>
                <option value="Kabaddi">Kabaddi</option>
                <option value="Hockey">Hockey</option>
                <option value="Table Tennis">Table Tennis</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Target Muscle
              </label>
              <input
                type="text"
                value={targetArea}
                onChange={(e) => setTargetArea(e.target.value)}
                className="w-full bg-[#181B22] border border-[#272B38] text-xs text-white rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#D2FF00]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 bg-[#D2FF00] hover:bg-[#c2ef00] text-[#0B0C0E] font-black uppercase tracking-wider text-xs rounded-xl shadow-[0_0_15px_rgba(210,255,0,0.3)] flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0B0C0E]" />
                Gemini Synthesizing Protocol...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Generate Real-time AI Protocol
              </>
            )}
          </button>
        </form>

        {/* AI Custom Result Display */}
        {customProtocol && (
          <div className="p-4 bg-[#181B22] border border-[#D2FF00]/40 rounded-2xl space-y-3 mt-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#2A2E3B] pb-2">
              <span className="text-xs font-black text-[#D2FF00] uppercase">
                {customProtocol.title}
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                {customProtocol.sport}
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-gray-400 uppercase">
                PRE-MATCH DRILLS:
              </div>
              {customProtocol.warmupDrills?.map((d: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D2FF00] flex-shrink-0 mt-0.5" />
                  <span>{d}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase">
                POST-MATCH RECOVERY:
              </div>
              {customProtocol.recoveryDrills?.map((r: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D2FF00] flex-shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>

            {customProtocol.notes && (
              <p className="text-[11px] text-gray-400 italic pt-1 border-t border-[#2A2E3B]">
                Note: {customProtocol.notes}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Pre-built Sport Protocol Cards Matching Screenshots */}
      <section className="bg-[#13151A] border border-[#222631] rounded-3xl p-5 space-y-6">
        <div className="grid grid-cols-12 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-[#222631] pb-3 font-mono">
          <span className="col-span-4">SPORT NAME</span>
          <span className="col-span-8">PRE-MATCH EXERCISES</span>
        </div>

        <div className="space-y-6 divide-y divide-[#1D212C]">
          {protocols.map((proto) => (
            <div key={proto.id} className="grid grid-cols-12 gap-2 pt-4 first:pt-0">
              <div className="col-span-4 flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#1A1D27] border border-[#282E3E]">
                  {getIcon(proto.iconName)}
                </div>
                <span className="font-extrabold text-xs text-white uppercase italic tracking-tight">
                  {proto.sport}
                </span>
              </div>

              <div className="col-span-8 space-y-2">
                {proto.exercises.map((ex, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D2FF00] flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{ex.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-medium text-gray-500 italic pt-4 border-t border-[#1F232F]">
          * protocols optimized for athlete metabolic markers and previous injury history.
        </p>
      </section>
    </div>
  );
};
