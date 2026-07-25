import React from 'react';
import {
  LayoutDashboard,
  Activity,
  ClipboardList,
  Sparkles,
  Users,
  User,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: 'athlete' | 'coach';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  userRole,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recovery', label: 'Recovery', icon: Activity },
    { id: 'survey', label: 'Survey', icon: ClipboardList },
    { id: 'ai', label: 'AI', icon: Sparkles },
    { id: 'roster', label: 'Roster', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E1015]/95 backdrop-blur-lg border-t border-[#1C202B] px-2 py-2 sm:py-3">
      <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#D2FF00] scale-105'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-[#D2FF00]/10 shadow-[0_0_12px_rgba(210,255,0,0.2)]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold mt-0.5 tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
