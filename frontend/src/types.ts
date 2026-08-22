export type SportType =
  | 'football'
  | 'cricket'
  | 'badminton'
  | 'kabaddi'
  | 'hockey'
  | 'table_tennis'
  | 'basketball'
  | 'running'
  | 'tennis'
  | 'gym';

export type RiskStatus = 'CRITICAL' | 'MODERATE' | 'OPTIMAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'coach';
  sport: SportType;
  group: string;
  avatarUrl: string;
  status: RiskStatus;
  recoveryScore: number;
  sleepDuration: string;
  hydrationIndex: string;
  hrvBaseline: number;
  readinessScore: number;
  symmetry: number;
  inflammation: string;
}

export interface TimelineEvent {
  id: string;
  userId: string;
  timeRange: string;
  title: string;
  focus: string;
  category: 'fueling' | 'training' | 'recovery';
  isHighlighted?: boolean;
}

export interface InjuryHotspot {
  id: string;
  bodyRegion: 'right_hamstring' | 'left_quad' | 'right_knee' | 'lower_back' | 'left_shoulder';
  label: string;
  xPercent: number;
  yPercent: number;
  severity: RiskStatus;
  title: string;
  description: string;
  symmetry: number;
  inflammation: string;
}

export interface RecoveryTask {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
}

export interface ClinicalPartner {
  id: string;
  name: string;
  distance: string;
  availability: string;
  description: string;
  type: string;
}

export interface Booking {
  id: string;
  userId: string;
  clinicId: string;
  clinicName: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending';
  createdAt: string;
}

export interface BiometricSurvey {
  id: string;
  userId: string;
  date: string;
  sleepHours: number;
  sleepQuality: 'Poor' | 'Moderate' | 'Optimal';
  hydrationLevel: number; // 0 to 100
  heartRateZone: number; // 1 to 5
  muscleSoreness: 'Low' | 'High';
  fatigueLevel: number; // 1 (Extreme) to 5 (Refreshed)
  calculatedScore: number;
}

export interface HighRiskAlert {
  id: string;
  athleteName: string;
  athleteId: string;
  riskTitle: string;
  description: string;
  severity: RiskStatus;
}

export interface SportProtocol {
  id: string;
  sport: string;
  sportKey: SportType;
  iconName: string;
  exercises: {
    name: string;
    completed?: boolean;
  }[];
}

export interface MatchReadiness {
  clearedToPlay: { name: string; notes: string }[];
  clearedWithCaution: { name: string; notes: string }[];
  notCleared: { name: string; notes: string }[];
}

export interface SquadKPIs {
  teamReadiness: number;
  activeRiskFlags: number;
  avgHrvBaseline: number;
  optimizationState: number;
}
