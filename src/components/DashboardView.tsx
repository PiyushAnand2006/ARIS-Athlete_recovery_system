import React, { useState } from 'react';
import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  Circle,
  MapPin,
  Calendar,
  Utensils,
  Zap,
  Activity,
  Plus,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import {
  User,
  TimelineEvent,
  InjuryHotspot,
  RecoveryTask,
  ClinicalPartner,
} from '../types';

interface DashboardViewProps {
  user: User;
  timeline: TimelineEvent[];
  hotspots: InjuryHotspot[];
  tasks: RecoveryTask[];
  clinics: ClinicalPartner[];
  onToggleTask: (taskId: string) => void;
  onStartRecovery: () => void;
  onBookClinic: (clinic: ClinicalPartner) => void;
  onAddTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  onUploadDiagnostic: (file: File) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  timeline,
  hotspots,
  tasks,
  clinics,
  onToggleTask,
  onStartRecovery,
  onBookClinic,
  onAddTimelineEvent,
  onUploadDiagnostic,
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<InjuryHotspot>(
    hotspots[0] || {
      id: 'hotspot-hamstring',
      bodyRegion: 'right_hamstring',
      label: 'Right Hamstring',
      xPercent: 57,
      yPercent: 58,
      severity: 'CRITICAL',
      title: 'CRITICAL LOAD: RIGHT HAMSTRING',
      description:
        'High eccentric load detected during morning sprints. Recommended immediate cessation of explosive movements.',
      symmetry: user.symmetry || 88,
      inflammation: user.inflammation || 'Low',
    }
  );

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newTime, setNewTime] = useState('14:00 - 15:00');
  const [newTitle, setNewTitle] = useState('Cryo Therapy & Foam Roll');
  const [newFocus, setNewFocus] = useState('Post-load recovery');
  const [newCategory, setNewCategory] = useState<'fueling' | 'training' | 'recovery'>('recovery');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDiagnostic(e.target.files[0]);
    }
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTimelineEvent({
      userId: user.id,
      timeRange: newTime,
      title: newTitle,
      focus: newFocus,
      category: newCategory,
      isHighlighted: false,
    });
    setShowAddEvent(false);
  };

  return (
    <div className="space-y-8 pb-24 max-w-md md:max-w-xl mx-auto px-4 pt-2">
      {/* 1. DAILY TIMELINE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white italic">
            DAILY TIMELINE
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 font-mono tracking-wider">
              OCT 24, 2023
            </span>
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="p-1 rounded-lg bg-[#191D27] text-[#D2FF00] hover:bg-[#232838] border border-[#2B3142]"
              title="Add activity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add event expandable form */}
        {showAddEvent && (
          <form
            onSubmit={handleAddEventSubmit}
            className="p-4 bg-[#14161C] border border-[#282E3E] rounded-2xl space-y-3"
          >
            <div className="text-xs font-bold text-[#D2FF00]">ADD TIMELINE EVENT</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Time (e.g. 14:00 - 15:00)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="bg-[#1A1E29] border border-[#2C3244] text-xs text-white rounded-xl px-3 py-2"
                required
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="bg-[#1A1E29] border border-[#2C3244] text-xs text-white rounded-xl px-2 py-2"
              >
                <option value="fueling">Fueling</option>
                <option value="training">Training</option>
                <option value="recovery">Recovery</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Title (e.g. High Intensity Sprints)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-[#1A1E29] border border-[#2C3244] text-xs text-white rounded-xl px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Focus (e.g. Explosive movements)"
              value={newFocus}
              onChange={(e) => setNewFocus(e.target.value)}
              className="w-full bg-[#1A1E29] border border-[#2C3244] text-xs text-white rounded-xl px-3 py-2"
            />
            <button
              type="submit"
              className="w-full py-2 bg-[#D2FF00] text-[#0B0C0E] font-extrabold text-xs rounded-xl uppercase"
            >
              Save Event
            </button>
          </form>
        )}

        {/* Timeline Cards Horizontal Scroll / Grid */}
        <div className="grid grid-cols-2 gap-3">
          {timeline.slice(0, 2).map((item) => {
            const isHighlight = item.isHighlighted;
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isHighlight
                    ? 'bg-[#D2FF00] text-[#0B0C0E] border-[#D2FF00] shadow-[0_0_20px_rgba(210,255,0,0.25)]'
                    : 'bg-[#13151A] text-white border-[#222631]'
                }`}
              >
                <div
                  className={`text-[11px] font-mono font-semibold mb-3 ${
                    isHighlight ? 'text-[#0B0C0E]/80' : 'text-gray-400'
                  }`}
                >
                  {item.timeRange}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  {item.category === 'fueling' ? (
                    <Utensils className={`w-4 h-4 ${isHighlight ? 'text-[#0B0C0E]' : 'text-gray-300'}`} />
                  ) : (
                    <Zap className={`w-4 h-4 ${isHighlight ? 'text-[#0B0C0E]' : 'text-[#D2FF00]'}`} />
                  )}
                  <h3 className="font-extrabold text-sm leading-tight">{item.title}</h3>
                </div>
                <p
                  className={`text-[11px] font-medium ${
                    isHighlight ? 'text-[#0B0C0E]/80' : 'text-gray-400'
                  }`}
                >
                  {item.focus}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. INJURY DIAGNOSTIC */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white italic">
            INJURY DIAGNOSTIC
          </h2>
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1D212C] hover:bg-[#272D3C] border border-[#2E3547] text-[11px] font-extrabold text-gray-200 uppercase tracking-wider transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#D2FF00]" />
            <span>UPLOAD AREA</span>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Human Silhouette Canvas with Hotspots */}
        <div className="bg-[#13151A] border border-[#222631] rounded-3xl p-6 relative overflow-hidden">
          <div className="relative w-full h-80 flex items-center justify-center">
            {/* Human Body Silhouette Vector */}
            <svg
              className="h-full w-auto text-[#222631]"
              viewBox="0 0 200 450"
              fill="currentColor"
            >
              {/* Head */}
              <circle cx="100" cy="45" r="24" />
              {/* Neck */}
              <rect x="92" y="70" width="16" height="15" rx="3" />
              {/* Torso & Shoulders */}
              <path d="M60 85 C60 85, 100 80, 140 85 L135 220 C135 220, 100 225, 65 220 Z" />
              {/* Arms */}
              <path d="M55 90 L38 210 Q35 220 42 222 Q50 222 55 210 L68 110 Z" />
              <path d="M145 90 L162 210 Q165 220 158 222 Q150 222 145 210 L132 110 Z" />
              {/* Legs */}
              <path d="M66 225 L60 380 Q58 400 70 405 Q80 405 82 380 L88 225 Z" />
              <path d="M134 225 L140 380 Q142 400 130 405 Q120 405 118 380 L112 225 Z" />
            </svg>

            {/* Hotspot Markers Overlay */}
            {hotspots.map((spot) => {
              const isSelected = selectedHotspot.id === spot.id;
              const isCritical = spot.severity === 'CRITICAL';
              return (
                <button
                  key={spot.id}
                  onClick={() => setSelectedHotspot(spot)}
                  style={{
                    left: `${spot.xPercent}%`,
                    top: `${spot.yPercent}%`,
                  }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-300 ${
                    isSelected ? 'scale-125 z-10' : 'hover:scale-110'
                  }`}
                  title={spot.title}
                >
                  <span
                    className={`block w-4 h-4 rounded-full border-2 ${
                      isCritical
                        ? 'bg-[#FF4B4B] border-white shadow-[0_0_15px_#FF4B4B] animate-ping'
                        : 'bg-[#D2FF00] border-white shadow-[0_0_15px_#D2FF00]'
                    }`}
                  />
                  <span
                    className={`block w-3 h-3 rounded-full border-2 absolute top-1.5 left-1.5 ${
                      isCritical ? 'bg-[#FF4B4B] border-white' : 'bg-[#D2FF00] border-white'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Diagnostic Warning Container */}
          <div className="mt-6 p-4 rounded-2xl bg-[#3D1418] border border-[#631E24] relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#591A20] text-[#FF6B6B] flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black tracking-wider text-[#FF9B9B] uppercase">
                  {selectedHotspot.title}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {selectedHotspot.description}
                </p>
              </div>
            </div>
          </div>

          {/* Diagnostic Metrics Row */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-[#191C24] border border-[#272C39] rounded-2xl">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                SYMMETRY
              </div>
              <div className="text-xl font-black text-[#D2FF00] font-sans">
                {selectedHotspot.symmetry}%
              </div>
            </div>

            <div className="p-3 bg-[#191C24] border border-[#272C39] rounded-2xl">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                INFLAMMATION
              </div>
              <div className="text-xl font-black text-[#FF7575] font-sans">
                {selectedHotspot.inflammation}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PLAN: FOOTBALL / ACTIVE RECOVERY PROTOCOL */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white italic flex items-center gap-2">
            PLAN: {user.sport.toUpperCase()}
          </h2>
          <span className="p-1.5 rounded-xl bg-[#181B24] border border-[#282D3D] text-[#D2FF00]">
            <Activity className="w-4 h-4" />
          </span>
        </div>

        {/* Hero Card Banner */}
        <div className="bg-[#13151A] border border-[#222631] rounded-3xl overflow-hidden shadow-xl">
          <div className="relative h-36 bg-gradient-to-t from-[#13151A] via-black/40 to-transparent">
            <img
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800"
              alt="Athlete Recovery"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#13151A] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4">
              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#D2FF00] text-[#0B0C0E] text-[10px] font-extrabold uppercase tracking-wider mb-1">
                ELITE RECOVERY
              </span>
              <h3 className="text-lg font-black text-white italic tracking-tight">
                Post-Match Protocol
              </h3>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="p-5 space-y-3">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl bg-[#191C24] hover:bg-[#202530] border border-[#272D3A] transition-colors"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-[#D2FF00] flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                )}
                <span
                  className={`text-xs font-semibold leading-snug ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-200'
                  }`}
                >
                  {task.text}
                </span>
              </button>
            ))}

            <button
              onClick={onStartRecovery}
              className="w-full py-3.5 mt-2 bg-[#D2FF00] hover:bg-[#c3ef00] text-[#0B0C0E] font-black uppercase tracking-wider text-sm rounded-2xl shadow-[0_0_25px_rgba(210,255,0,0.35)] transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              START RECOVERY SESSION
            </button>
          </div>
        </div>
      </section>

      {/* 4. CLINICAL NETWORK */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white italic">
            CLINICAL NETWORK
          </h2>
          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1 font-mono uppercase">
            <MapPin className="w-3 h-3 text-[#D2FF00]" /> LONDON, UK
          </span>
        </div>

        <div className="space-y-3">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className="p-5 bg-[#13151A] border border-[#222631] rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">{clinic.name}</h3>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-[#D2FF00] font-mono">
                    {clinic.distance}
                  </div>
                  <div className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">
                    {clinic.availability}
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                {clinic.description}
              </p>

              <button
                onClick={() => onBookClinic(clinic)}
                className="w-full py-2.5 bg-[#171A23] hover:bg-[#202532] border border-[#2F3649] hover:border-[#D2FF00]/50 text-white font-extrabold uppercase text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                BOOK NOW <ArrowRight className="w-3.5 h-3.5 text-[#D2FF00]" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
