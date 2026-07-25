import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Zap } from 'lucide-react';

interface RecoveryTimerModalProps {
  onClose: () => void;
}

export const RecoveryTimerModal: React.FC<RecoveryTimerModalProps> = ({ onClose }) => {
  const TOTAL_SECONDS = 1200; // 20 minutes
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [isActive, setIsActive] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { title: 'Level 3 Compression Therapy', duration: '20 mins', focus: 'Vasodilation & Lactic Acid Flush' },
    { title: 'Electrolyte Intake (Mg+ Focus)', duration: 'Active', focus: 'Restoring Cellular Sodium Balance' },
    { title: 'Soft Tissue Mobilization', duration: '5 mins', focus: 'Lateral Quads & Glutes Roller' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12141A] border border-[#232733] rounded-3xl p-6 w-full max-w-md relative shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-xl bg-[#1A1D25]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D2FF00]/10 border border-[#D2FF00]/30 text-[#D2FF00] text-xs font-bold uppercase mb-4">
          <Zap className="w-3.5 h-3.5" /> RECOVERY SESSION ACTIVE
        </div>

        {/* Circular Progress Timer */}
        <div className="relative w-48 h-48 mx-auto my-4 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-[#1E222D]"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              className="stroke-[#D2FF00] transition-all duration-1000"
              strokeWidth="7"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-white font-mono tracking-tight">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[10px] uppercase font-bold text-[#D2FF00] tracking-widest mt-1">
              {isActive ? 'IN PROGRESS' : secondsLeft === 0 ? 'COMPLETED' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 my-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className="w-12 h-12 rounded-2xl bg-[#D2FF00] text-[#0B0C0E] flex items-center justify-center font-bold hover:scale-105 transition-transform shadow-[0_0_15px_rgba(210,255,0,0.4)]"
          >
            {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button
            onClick={() => {
              setSecondsLeft(TOTAL_SECONDS);
              setIsActive(false);
            }}
            className="w-12 h-12 rounded-2xl bg-[#1C202B] text-gray-300 hover:text-white border border-[#2D3344] flex items-center justify-center"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Protocol Steps */}
        <div className="text-left bg-[#181B22] border border-[#262A36] rounded-2xl p-4 mt-6 space-y-3">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            ACTIVE RECOVERY STEPS
          </div>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                currentStepIndex === idx
                  ? 'bg-[#222733] border-[#D2FF00]/50 text-white'
                  : 'bg-[#14161B] border-transparent text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    currentStepIndex >= idx ? 'text-[#D2FF00]' : 'text-gray-600'
                  }`}
                />
                <div>
                  <div className="font-semibold text-gray-200">{step.title}</div>
                  <div className="text-[10px] text-gray-400">{step.focus}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#D2FF00]">{step.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
