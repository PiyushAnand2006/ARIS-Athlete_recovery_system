import React, { useState } from 'react';
import { X, UserCheck, PlusCircle, Shield, Check } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  currentUser: User;
  onClose: () => void;
  onSelectUser: (user: User) => void;
  onRegister: (name: string, email: string, sport: string, role: 'athlete' | 'coach') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  onClose,
  onSelectUser,
  onRegister,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sport, setSport] = useState('football');
  const [role, setRole] = useState<'athlete' | 'coach'>('athlete');

  const demoUsers: User[] = [
    {
      id: 'user-rohit',
      name: 'Rohit',
      email: 'rohit@aris.ai',
      role: 'athlete',
      sport: 'football',
      group: 'Pro Group',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      status: 'CRITICAL',
      recoveryScore: 58,
      sleepDuration: '5h 30m',
      hydrationIndex: 'Low',
      hrvBaseline: 54,
      readinessScore: 52,
      symmetry: 88,
      inflammation: 'Low',
    },
    {
      id: 'user-prashant',
      name: 'Prashant',
      email: 'prashant@aris.ai',
      role: 'athlete',
      sport: 'football',
      group: 'Pro Group',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      status: 'OPTIMAL',
      recoveryScore: 94,
      sleepDuration: '8h 42m',
      hydrationIndex: 'Optimal',
      hrvBaseline: 72,
      readinessScore: 94,
      symmetry: 96,
      inflammation: 'None',
    },
    {
      id: 'user-bharath',
      name: 'Bharath',
      email: 'bharath@aris.ai',
      role: 'athlete',
      sport: 'football',
      group: 'Pro Group',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      status: 'MODERATE',
      recoveryScore: 71,
      sleepDuration: '7h 10m',
      hydrationIndex: 'Moderate',
      hrvBaseline: 65,
      readinessScore: 71,
      symmetry: 91,
      inflammation: 'Mild',
    },
    {
      id: 'user-coach',
      name: 'Coach Vikram',
      email: 'coach@aris.ai',
      role: 'coach',
      sport: 'football',
      group: 'Elite Staff',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
      status: 'OPTIMAL',
      recoveryScore: 98,
      sleepDuration: '8h 00m',
      hydrationIndex: 'Optimal',
      hrvBaseline: 75,
      readinessScore: 98,
      symmetry: 98,
      inflammation: 'None',
    },
  ];

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onRegister(name, email, sport, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#13151A] border border-[#232733] rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-[10px] font-bold text-[#D2FF00] uppercase tracking-wider mb-1">
          ARIS AUTHENTICATION & PERSONA SWITCHER
        </div>
        <h3 className="text-xl font-bold text-white mb-4">
          {isRegistering ? 'Create Athlete Account' : 'Switch Athlete Profile'}
        </h3>

        {!isRegistering ? (
          <div className="space-y-4">
            <p className="text-xs text-gray-400">
              Select an active athlete or coach profile to view individualized biometric recovery data and real-time risk alerts.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {demoUsers.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all text-left ${
                      isSelected
                        ? 'bg-[#1C212B] border-[#D2FF00] text-white shadow-[0_0_12px_rgba(210,255,0,0.15)]'
                        : 'bg-[#171A22] border-[#252936] text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#303648]"
                      />
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          {u.name}
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${
                              u.status === 'CRITICAL'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : u.status === 'MODERATE'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-lime-500/20 text-[#D2FF00] border border-lime-500/40'
                            }`}
                          >
                            {u.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-400 capitalize">
                          {u.role} • {u.sport} ({u.group})
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-[#D2FF00]" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsRegistering(true)}
              className="w-full py-2.5 bg-[#1C202B] hover:bg-[#252A38] text-gray-200 border border-[#2D3344] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-[#D2FF00]" />
              Register New Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full bg-[#181B22] border border-[#2A2E3B] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D2FF00]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@aris.ai"
                className="w-full bg-[#181B22] border border-[#2A2E3B] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D2FF00]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Primary Sport
                </label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full bg-[#181B22] border border-[#2A2E3B] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D2FF00] capitalize"
                >
                  <option value="football">Football</option>
                  <option value="cricket">Cricket</option>
                  <option value="badminton">Badminton</option>
                  <option value="kabaddi">Kabaddi</option>
                  <option value="hockey">Hockey</option>
                  <option value="table_tennis">Table Tennis</option>
                  <option value="basketball">Basketball</option>
                  <option value="running">Running</option>
                  <option value="tennis">Tennis</option>
                  <option value="gym">Gym / Conditioning</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'athlete' | 'coach')}
                  className="w-full bg-[#181B22] border border-[#2A2E3B] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D2FF00]"
                >
                  <option value="athlete">Athlete</option>
                  <option value="coach">Head Coach / Physio</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="flex-1 py-2.5 bg-[#1C202B] hover:bg-[#252A38] text-gray-300 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#D2FF00] hover:bg-[#c2ef00] text-[#0B0C0E] font-extrabold uppercase text-xs rounded-xl shadow-[0_0_15px_rgba(210,255,0,0.3)]"
              >
                Create Account
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
