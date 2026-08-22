import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { SurveyView } from './components/SurveyView';
import { RecoveryView } from './components/RecoveryView';
import { RosterView } from './components/RosterView';
import { AIProtocolsView } from './components/AIProtocolsView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { RecoveryTimerModal } from './components/RecoveryTimerModal';

import {
  User,
  TimelineEvent,
  InjuryHotspot,
  RecoveryTask,
  ClinicalPartner,
  HighRiskAlert,
  SportProtocol,
  SquadKPIs,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<User>({
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
  });

  const [authToken, setAuthToken] = useState<string>('token-rohit');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [hotspots, setHotspots] = useState<InjuryHotspot[]>([]);
  const [tasks, setTasks] = useState<RecoveryTask[]>([]);
  const [clinics, setClinics] = useState<ClinicalPartner[]>([]);
  const [athletes, setAthletes] = useState<User[]>([]);
  const [alerts, setAlerts] = useState<HighRiskAlert[]>([]);
  const [protocols, setProtocols] = useState<SportProtocol[]>([]);
  const [kpis, setKpis] = useState<SquadKPIs>({
    teamReadiness: 72,
    activeRiskFlags: 3,
    avgHrvBaseline: 68,
    optimizationState: 92,
  });

  // Modal States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecoveryTimer, setShowRecoveryTimer] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<ClinicalPartner | null>(null);

  // Load Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setTimeline(data.timeline || []);
        setHotspots(data.hotspots || []);
        setTasks(data.tasks || []);
        setClinics(data.clinics || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  // Load Squad Roster Data
  const fetchRosterData = async () => {
    try {
      const res = await fetch('/api/roster');
      if (res.ok) {
        const data = await res.json();
        setAthletes(data.athletes || []);
        setAlerts(data.alerts || []);
        if (data.kpis) setKpis(data.kpis);
      }
    } catch (err) {
      console.error('Error fetching roster data:', err);
    }
  };

  // Load AI Protocols Data
  const fetchProtocolsData = async () => {
    try {
      const res = await fetch('/api/protocols');
      if (res.ok) {
        const data = await res.json();
        setProtocols(data || []);
      }
    } catch (err) {
      console.error('Error fetching protocols data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRosterData();
    fetchProtocolsData();

    // Real-time synchronization interval
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchRosterData();
    }, 5000);

    return () => clearInterval(interval);
  }, [authToken]);

  // Handlers
  const handleToggleTask = async (taskId: string) => {
    try {
      const res = await fetch('/api/tasks/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ taskId }),
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Task toggle failed:', err);
    }
  };

  const handleAddTimelineEvent = async (event: Omit<TimelineEvent, 'id'>) => {
    try {
      const res = await fetch('/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(event),
      });
      if (res.ok) {
        const newEv = await res.json();
        setTimeline((prev) => [...prev, newEv]);
      }
    } catch (err) {
      console.error('Add timeline failed:', err);
    }
  };

  const handleSubmitSurvey = async (surveyData: any) => {
    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(surveyData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUser(data.user);
        fetchRosterData();
      }
    } catch (err) {
      console.error('Survey submission failed:', err);
    }
  };

  const handleBookClinic = async (clinicId: string, date: string, time: string) => {
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ clinicId, date, time }),
      });
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  const handleUploadDiagnostic = async (file: File) => {
    alert(`Scanning ${file.name}... ARIS computer vision analyzed tissue inflammation & eccentric hamstrings strain.`);
  };

  const handleSelectUser = (selectedUser: User) => {
    setUser(selectedUser);
    setAuthToken(`token-${selectedUser.id}`);
  };

  const handleRegister = async (name: string, email: string, sport: string, role: 'athlete' | 'coach') => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, sport, role }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAuthToken(data.token);
        fetchRosterData();
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const handleUpdateSport = async (sport: any) => {
    try {
      const res = await fetch('/api/roster/update-sport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ sport }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) setUser(data.user);
      }
    } catch (err) {
      console.error('Update sport failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white selection:bg-[#D2FF00] selection:text-[#0B0C0E] font-sans antialiased">
      {/* Top App Header */}
      <Header
        user={user}
        activeTab={activeTab}
        onOpenAuth={() => setShowAuthModal(true)}
        unreadAlertsCount={alerts.length}
      />

      {/* Main View Render */}
      <main className="pt-3">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            timeline={timeline}
            hotspots={hotspots}
            tasks={tasks}
            clinics={clinics}
            onToggleTask={handleToggleTask}
            onStartRecovery={() => setShowRecoveryTimer(true)}
            onBookClinic={(clinic) => setSelectedClinic(clinic)}
            onAddTimelineEvent={handleAddTimelineEvent}
            onUploadDiagnostic={handleUploadDiagnostic}
          />
        )}

        {activeTab === 'survey' && (
          <SurveyView onSubmitSurvey={handleSubmitSurvey} />
        )}

        {activeTab === 'recovery' && (
          <RecoveryView
            user={user}
            onNavigateDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'roster' && (
          <RosterView
            athletes={athletes.length > 0 ? athletes : [user]}
            alerts={alerts}
            kpis={kpis}
            onSelectAthlete={(athlete) => {
              handleSelectUser(athlete);
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'ai' && (
          <AIProtocolsView protocols={protocols} />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            onUpdateSport={handleUpdateSport}
            onNavigateDashboard={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {/* Bottom Floating Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={user.role}
      />

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          currentUser={user}
          onClose={() => setShowAuthModal(false)}
          onSelectUser={handleSelectUser}
          onRegister={handleRegister}
        />
      )}

      {selectedClinic && (
        <BookingModal
          clinic={selectedClinic}
          onClose={() => setSelectedClinic(null)}
          onConfirm={handleBookClinic}
        />
      )}

      {showRecoveryTimer && (
        <RecoveryTimerModal onClose={() => setShowRecoveryTimer(false)} />
      )}
    </div>
  );
}
