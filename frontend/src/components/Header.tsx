import React from 'react';
import { Bell, User as UserIcon, ShieldAlert, Sparkles, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  activeTab: string;
  onOpenAuth: () => void;
  unreadAlertsCount: number;
}

const SPORT_ICONS: Record<string, string> = {
  football: '⚽',
  cricket: '🏏',
  basketball: '🏀',
  running: '🏃',
  tennis: '🎾',
  gym: '🏋️',
  badminton: '🏸',
  kabaddi: '🤼',
  hockey: '🏑',
  table_tennis: '🏓',
};

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  unreadAlertsCount,
}) => {
  const sportIcon = SPORT_ICONS[user.sport.toLowerCase()] || '🏆';

  return (
    <header className="sticky top-0 z-40 bg-[#0B0C0E]/90 backdrop-blur-md border-b border-[#1A1D24] px-4 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#D2FF00] flex items-center justify-center shadow-[0_0_15px_rgba(210,255,0,0.3)]">
          {/* Neon Bar Graph Logo Icon */}
          <svg
            className="w-5 h-5 text-[#0B0C0E]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 20V10" />
            <path d="M12 20V4" />
            <path d="M6 20v-6" />
          </svg>
        </div>
        <span className="text-2xl font-black tracking-tighter text-[#D2FF00] italic font-sans">
          ARIS
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Risk Alerts Notification Bell */}
        <button
          onClick={onOpenAuth}
          className="relative p-2 rounded-xl bg-[#14161B] border border-[#222630] text-gray-300 hover:text-white hover:border-[#D2FF00]/40 transition-colors"
          title="Alerts & Persona"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF4B4B] text-white text-[10px] font-bold flex items-center justify-center animate-pulse border-2 border-[#0B0C0E]">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar / Switcher */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#14161B] border border-[#222630] hover:border-[#D2FF00]/50 transition-all text-left group"
        >
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-[#D2FF00]/60"
            />
            <span className="absolute -bottom-1 -right-1.5 text-[9px] bg-[#14161B] rounded-full w-4 h-4 flex items-center justify-center border border-[#222630]">
              {sportIcon}
            </span>
          </div>
          <div className="hidden sm:block text-xs">
            <div className="font-bold text-gray-200 group-hover:text-[#D2FF00] transition-colors leading-tight flex items-center gap-1">
              {user.name}
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
            <div className="text-[10px] text-gray-400 capitalize">{user.role} • {sportIcon} {user.sport}</div>
          </div>
        </button>
      </div>
    </header>
  );
};
