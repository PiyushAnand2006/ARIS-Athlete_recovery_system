import fs from 'node:fs';
import path from 'node:path';
import {
  User,
  RiskStatus,
  TimelineEvent,
  InjuryHotspot,
  RecoveryTask,
  ClinicalPartner,
  Booking,
  BiometricSurvey,
  HighRiskAlert,
  SportProtocol,
  SquadKPIs,
} from '../types.js';

interface DatabaseSchema {
  users: User[];
  passwords: Record<string, string>; // userId -> hash/plain password for simple auth
  tokens: Record<string, string>; // token -> userId
  timelineEvents: TimelineEvent[];
  injuryHotspots: Record<string, InjuryHotspot[]>; // userId -> hotspots
  recoveryTasks: RecoveryTask[];
  clinicalPartners: ClinicalPartner[];
  bookings: Booking[];
  surveys: BiometricSurvey[];
  highRiskAlerts: HighRiskAlert[];
  sportProtocols: SportProtocol[];
}

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const INITIAL_CLINICAL_PARTNERS: ClinicalPartner[] = [
  {
    id: 'clinic-1',
    name: 'Peak Performance Lab',
    distance: '0.8 KM',
    availability: 'WALK-IN READY',
    description: 'Advanced sports physiotherapy and cryo-chamber treatments specialized for pro football.',
    type: 'Physiotherapy & Cryo',
  },
  {
    id: 'clinic-2',
    name: 'Elite Recovery Hub',
    distance: '2.4 KM',
    availability: 'BY APPOINTMENT',
    description: 'Orthopedic specialists focused on lower limb trauma and kinetic chain optimization.',
    type: 'Orthopedics',
  },
  {
    id: 'clinic-3',
    name: 'ARIS Care Central',
    distance: '3.1 KM',
    availability: 'NEXT OPENING: 4PM',
    description: 'Official ARIS clinical partner. Direct data sync with your performance profile.',
    type: 'Clinical Partner',
  },
];

const INITIAL_SPORT_PROTOCOLS: SportProtocol[] = [
  {
    id: 'proto-1',
    sport: 'BADMINTON',
    sportKey: 'badminton',
    iconName: 'Zap',
    exercises: [
      { name: 'Dynamic arm circles & shoulder rotations' },
      { name: 'Multi-directional lunges for gait prep' },
      { name: 'High-intensity shadow footwork (10 min)' },
    ],
  },
  {
    id: 'proto-2',
    sport: 'FOOTBALL',
    sportKey: 'football',
    iconName: 'Activity',
    exercises: [
      { name: 'FIFA 11+ dynamic warm-up protocol' },
      { name: 'Leg swings & hip openers' },
      { name: 'Accelerated short burst sprints' },
    ],
  },
  {
    id: 'proto-3',
    sport: 'CRICKET',
    sportKey: 'cricket',
    iconName: 'Shield',
    exercises: [
      { name: 'Thoracic spine rotations (Bowlers/Batsmen)' },
      { name: 'Shoulder cuff activation with bands' },
      { name: 'Agility ladder drills for fielding prep' },
    ],
  },
  {
    id: 'proto-4',
    sport: 'KABADDI',
    sportKey: 'kabaddi',
    iconName: 'Users',
    exercises: [
      { name: 'Lower body explosive lunges' },
      { name: 'Core bracing drills' },
      { name: 'Shoulder stability rotations' },
    ],
  },
  {
    id: 'proto-5',
    sport: 'HOCKEY',
    sportKey: 'hockey',
    iconName: 'Award',
    exercises: [
      { name: 'Lateral glute activation' },
      { name: 'Wrist mobility drills' },
      { name: 'High-intensity sprint starts' },
    ],
  },
  {
    id: 'proto-6',
    sport: 'TABLE TENNIS',
    sportKey: 'table_tennis',
    iconName: 'Target',
    exercises: [
      { name: 'Reflex-based hand-eye drills' },
      { name: 'Forearm stretch protocol' },
      { name: 'Lateral shuffle steps' },
    ],
  },
];

const INITIAL_USERS: User[] = [
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
    id: 'user-sandeep',
    name: 'Sandeep',
    email: 'sandeep@aris.ai',
    role: 'athlete',
    sport: 'football',
    group: 'Pro Group',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=200',
    status: 'CRITICAL',
    recoveryScore: 61,
    sleepDuration: '6h 05m',
    hydrationIndex: 'Low',
    hrvBaseline: 58,
    readinessScore: 59,
    symmetry: 84,
    inflammation: 'Moderate',
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

const INITIAL_HIGH_RISK_ALERTS: HighRiskAlert[] = [
  {
    id: 'alert-1',
    athleteName: 'Rohit',
    athleteId: 'user-rohit',
    riskTitle: 'Hamstring Strain Risk',
    description: 'Fatigue trend up 42% in 48h. Load modification required.',
    severity: 'CRITICAL',
  },
  {
    id: 'alert-2',
    athleteName: 'Sandeep',
    athleteId: 'user-sandeep',
    riskTitle: 'Thigh Strain Risk',
    description: 'Sleep latency +18m. HRV baseline drop detected.',
    severity: 'CRITICAL',
  },
  {
    id: 'alert-3',
    athleteName: 'Bharath',
    athleteId: 'user-bharath',
    riskTitle: 'Knee Injury Risk',
    description: 'Metabolic markers indicate overreaching state.',
    severity: 'CRITICAL',
  },
];

const INITIAL_TIMELINE: TimelineEvent[] = [
  {
    id: 't-1',
    userId: 'user-rohit',
    timeRange: '06:30 - 07:30',
    title: 'Fueling: Breakfast',
    focus: 'Pre-load carbs',
    category: 'fueling',
    isHighlighted: false,
  },
  {
    id: 't-2',
    userId: 'user-rohit',
    timeRange: '08:00 - 10:30',
    title: 'High Intensity Training',
    focus: 'Focus: Explosion',
    category: 'training',
    isHighlighted: true,
  },
  {
    id: 't-3',
    userId: 'user-rohit',
    timeRange: '11:00 - 12:00',
    title: 'Cryotherapy & Flush',
    focus: 'Recovery Protocol',
    category: 'recovery',
    isHighlighted: false,
  },
];

const INITIAL_TASKS: RecoveryTask[] = [
  {
    id: 'task-1',
    userId: 'user-rohit',
    text: 'Compression therapy (Level 3) for 20 mins post-drill.',
    completed: true,
  },
  {
    id: 'task-2',
    userId: 'user-rohit',
    text: 'Increase electrolyte intake (Mg+ Focus) by 15%.',
    completed: true,
  },
  {
    id: 'task-3',
    userId: 'user-rohit',
    text: 'Soft tissue mobilization: Lateral quads & glutes.',
    completed: false,
  },
];

const INITIAL_HOTSPOTS: InjuryHotspot[] = [
  {
    id: 'hotspot-hamstring',
    bodyRegion: 'right_hamstring',
    label: 'Right Hamstring',
    xPercent: 57,
    yPercent: 58,
    severity: 'CRITICAL',
    title: 'CRITICAL LOAD: RIGHT HAMSTRING',
    description: 'High eccentric load detected during morning sprints. Recommended immediate cessation of explosive movements.',
    symmetry: 88,
    inflammation: 'Low',
  },
  {
    id: 'hotspot-quad',
    bodyRegion: 'left_quad',
    label: 'Left Quadriceps',
    xPercent: 43,
    yPercent: 28,
    severity: 'MODERATE',
    title: 'MODERATE TENSION: LEFT QUAD',
    description: 'Slight fatigue build-up detected during lateral decelerations. Foam rolling suggested.',
    symmetry: 92,
    inflammation: 'Mild',
  },
  {
    id: 'hotspot-knee',
    bodyRegion: 'right_knee',
    label: 'Right Knee',
    xPercent: 57,
    yPercent: 68,
    severity: 'MODERATE',
    title: 'LOAD WARNING: RIGHT KNEE',
    description: 'Elevated patellar impact force during jump landings. Pre-activation exercises required.',
    symmetry: 90,
    inflammation: 'Low',
  },
];

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read DB file, initializing with defaults:', err);
    }

    const defaultData: DatabaseSchema = {
      users: INITIAL_USERS,
      passwords: {
        'user-rohit': 'password123',
        'user-prashant': 'password123',
        'user-bharath': 'password123',
        'user-sandeep': 'password123',
        'user-coach': 'password123',
      },
      tokens: {
        'token-rohit': 'user-rohit',
        'token-prashant': 'user-prashant',
        'token-coach': 'user-coach',
      },
      timelineEvents: INITIAL_TIMELINE,
      injuryHotspots: {
        'user-rohit': INITIAL_HOTSPOTS,
      },
      recoveryTasks: INITIAL_TASKS,
      clinicalPartners: INITIAL_CLINICAL_PARTNERS,
      bookings: [],
      surveys: [
        {
          id: 'survey-1',
          userId: 'user-rohit',
          date: '2023-10-24',
          sleepHours: 5.5,
          sleepQuality: 'Poor',
          hydrationLevel: 40,
          heartRateZone: 3,
          muscleSoreness: 'High',
          fatigueLevel: 2,
          calculatedScore: 58,
        },
      ],
      highRiskAlerts: INITIAL_HIGH_RISK_ALERTS,
      sportProtocols: INITIAL_SPORT_PROTOCOLS,
    };

    this.saveToDisk(defaultData);
    return defaultData;
  }

  private saveToDisk(data: DatabaseSchema) {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to DB file:', err);
    }
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserByToken(token: string): User | undefined {
    const userId = this.data.tokens[token];
    if (!userId) return undefined;
    return this.getUserById(userId);
  }

  public createUser(user: Omit<User, 'id'>, password?: string): { user: User; token: string } {
    const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newUser: User = { ...user, id };
    this.data.users.push(newUser);

    if (password) {
      this.data.passwords[id] = password;
    }

    const token = `token-${id}-${Date.now()}`;
    this.data.tokens[token] = id;

    this.saveToDisk(this.data);
    return { user: newUser, token };
  }

  public loginUser(email: string, password?: string): { user: User; token: string } | null {
    const user = this.getUserByEmail(email);
    if (!user) return null;

    // Simple password check
    if (password && this.data.passwords[user.id] && this.data.passwords[user.id] !== password) {
      return null;
    }

    const token = `token-${user.id}-${Date.now()}`;
    this.data.tokens[token] = user.id;
    this.saveToDisk(this.data);

    return { user, token };
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.data.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.saveToDisk(this.data);
    return this.data.users[index];
  }

  public getTimelineEvents(userId: string): TimelineEvent[] {
    return this.data.timelineEvents.filter((t) => t.userId === userId || t.userId === 'user-rohit');
  }

  public addTimelineEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
    const newEvent: TimelineEvent = {
      ...event,
      id: `t-${Date.now()}`,
    };
    this.data.timelineEvents.push(newEvent);
    this.saveToDisk(this.data);
    return newEvent;
  }

  public getInjuryHotspots(userId: string): InjuryHotspot[] {
    return this.data.injuryHotspots[userId] || INITIAL_HOTSPOTS;
  }

  public getRecoveryTasks(userId: string): RecoveryTask[] {
    return this.data.recoveryTasks.filter((t) => t.userId === userId || t.userId === 'user-rohit');
  }

  public toggleRecoveryTask(taskId: string): RecoveryTask[] {
    const task = this.data.recoveryTasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveToDisk(this.data);
    }
    return this.data.recoveryTasks;
  }

  public addRecoveryTask(userId: string, text: string): RecoveryTask {
    const newTask: RecoveryTask = {
      id: `task-${Date.now()}`,
      userId,
      text,
      completed: false,
    };
    this.data.recoveryTasks.push(newTask);
    this.saveToDisk(this.data);
    return newTask;
  }

  public getClinicalPartners(): ClinicalPartner[] {
    return this.data.clinicalPartners;
  }

  public getBookings(userId: string): Booking[] {
    return this.data.bookings.filter((b) => b.userId === userId);
  }

  public createBooking(userId: string, clinicId: string, date: string, time: string): Booking {
    const clinic = this.data.clinicalPartners.find((c) => c.id === clinicId);
    const booking: Booking = {
      id: `book-${Date.now()}`,
      userId,
      clinicId,
      clinicName: clinic ? clinic.name : 'Clinical Partner',
      date,
      time,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    this.data.bookings.push(booking);
    this.saveToDisk(this.data);
    return booking;
  }

  public addSurvey(survey: Omit<BiometricSurvey, 'id' | 'calculatedScore'>): BiometricSurvey {
    // Calculate score logic based on sleep, hydration, fatigue, soreness
    let score = 50;
    score += (survey.sleepHours / 8) * 20;
    score += (survey.hydrationLevel / 100) * 15;
    score += survey.fatigueLevel * 3;
    if (survey.muscleSoreness === 'Low') score += 10;
    if (survey.sleepQuality === 'Optimal') score += 5;

    score = Math.min(99, Math.max(30, Math.round(score)));

    const newSurvey: BiometricSurvey = {
      ...survey,
      id: `survey-${Date.now()}`,
      calculatedScore: score,
    };

    this.data.surveys.push(newSurvey);

    // Update user's current score & status
    const user = this.getUserById(survey.userId);
    if (user) {
      const status: RiskStatus = score < 65 ? 'CRITICAL' : score < 80 ? 'MODERATE' : 'OPTIMAL';
      this.updateUser(user.id, {
        recoveryScore: score,
        readinessScore: score,
        status,
        sleepDuration: `${survey.sleepHours}h`,
        hydrationIndex: survey.hydrationLevel > 70 ? 'Optimal' : 'Low',
      });
    }

    this.saveToDisk(this.data);
    return newSurvey;
  }

  public getHighRiskAlerts(): HighRiskAlert[] {
    return this.data.highRiskAlerts;
  }

  public getSportProtocols(): SportProtocol[] {
    return this.data.sportProtocols;
  }

  public getSquadKPIs(): SquadKPIs {
    const users = this.data.users.filter((u) => u.role === 'athlete');
    const totalReadiness = users.reduce((acc, u) => acc + u.readinessScore, 0);
    const avgReadiness = Math.round(totalReadiness / (users.length || 1));

    const activeRiskFlags = this.data.highRiskAlerts.length;
    const totalHrv = users.reduce((acc, u) => acc + u.hrvBaseline, 0);
    const avgHrv = Math.round(totalHrv / (users.length || 1));

    return {
      teamReadiness: avgReadiness,
      activeRiskFlags,
      avgHrvBaseline: avgHrv,
      optimizationState: 92,
    };
  }
}

export const db = new Database();
