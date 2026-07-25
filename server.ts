import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI SDK lazily
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  };

  // Helper middleware for auth user resolution
  const getUserFromReq = (req: express.Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return db.getUserById('user-rohit')!;
    const token = authHeader.replace('Bearer ', '').trim();
    return db.getUserByToken(token) || db.getUserById('user-rohit')!;
  };

  // -------------------- AUTH API --------------------
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, sport, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const { user, token } = db.createUser(
      {
        name,
        email,
        role: role || 'athlete',
        sport: sport || 'football',
        group: 'Pro Group',
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`,
        status: 'OPTIMAL',
        recoveryScore: 88,
        sleepDuration: '8h 00m',
        hydrationIndex: 'Optimal',
        hrvBaseline: 70,
        readinessScore: 88,
        symmetry: 94,
        inflammation: 'None',
      },
      password || 'password123'
    );

    res.json({ user, token });
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const result = db.loginUser(email, password);
    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.json(result);
  });

  app.get('/api/auth/me', (req, res) => {
    const user = getUserFromReq(req);
    res.json({ user });
  });

  // -------------------- DASHBOARD & TIMELINE API --------------------
  app.get('/api/dashboard', (req, res) => {
    const user = getUserFromReq(req);
    const timeline = db.getTimelineEvents(user.id);
    const hotspots = db.getInjuryHotspots(user.id);
    const tasks = db.getRecoveryTasks(user.id);
    const clinics = db.getClinicalPartners();
    const bookings = db.getBookings(user.id);

    res.json({
      user,
      timeline,
      hotspots,
      tasks,
      clinics,
      bookings,
      criticalLoad: {
        title: 'CRITICAL LOAD: RIGHT HAMSTRING',
        description:
          'High eccentric load detected during morning sprints. Recommended immediate cessation of explosive movements.',
        symmetry: user.symmetry || 88,
        inflammation: user.inflammation || 'Low',
      },
    });
  });

  app.post('/api/timeline', (req, res) => {
    const user = getUserFromReq(req);
    const { timeRange, title, focus, category, isHighlighted } = req.body;
    const event = db.addTimelineEvent({
      userId: user.id,
      timeRange,
      title,
      focus,
      category,
      isHighlighted: !!isHighlighted,
    });
    res.json(event);
  });

  app.post('/api/tasks/toggle', (req, res) => {
    const { taskId } = req.body;
    const tasks = db.toggleRecoveryTask(taskId);
    res.json({ tasks });
  });

  app.post('/api/tasks', (req, res) => {
    const user = getUserFromReq(req);
    const { text } = req.body;
    const task = db.addRecoveryTask(user.id, text);
    res.json(task);
  });

  // -------------------- SURVEY & BIOMETRICS API --------------------
  app.post('/api/survey', (req, res) => {
    const user = getUserFromReq(req);
    const { sleepHours, sleepQuality, hydrationLevel, heartRateZone, muscleSoreness, fatigueLevel } = req.body;

    const survey = db.addSurvey({
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      sleepHours: Number(sleepHours) || 8,
      sleepQuality: sleepQuality || 'Optimal',
      hydrationLevel: Number(hydrationLevel) || 80,
      heartRateZone: Number(heartRateZone) || 3,
      muscleSoreness: muscleSoreness || 'Low',
      fatigueLevel: Number(fatigueLevel) || 4,
    });

    const updatedUser = db.getUserById(user.id);
    res.json({ survey, user: updatedUser });
  });

  // -------------------- CLINICAL BOOKING API --------------------
  app.post('/api/bookings', (req, res) => {
    const user = getUserFromReq(req);
    const { clinicId, date, time } = req.body;

    const booking = db.createBooking(user.id, clinicId, date || 'Today', time || '04:00 PM');
    res.json(booking);
  });

  // -------------------- ROSTER & SQUAD API --------------------
  app.get('/api/roster', (req, res) => {
    const users = db.getUsers().filter((u) => u.role === 'athlete');
    const alerts = db.getHighRiskAlerts();
    const kpis = db.getSquadKPIs();

    const matchReadiness = {
      clearedToPlay: [
        { name: 'Prashant', notes: 'Full match availability (Stable recovery)' },
      ],
      clearedWithCaution: [
        { name: 'Bharath', notes: 'Limited minutes recommended (Risk management)' },
      ],
      notCleared: [
        { name: 'Rohit', notes: 'Right hamstring strain risk - Active rehab' },
        { name: 'Sandeep', notes: 'Thigh strain risk & HRV baseline drop' },
      ],
    };

    res.json({
      athletes: users,
      alerts,
      kpis,
      matchReadiness,
    });
  });

  app.post('/api/roster/update-sport', (req, res) => {
    const user = getUserFromReq(req);
    const { sport } = req.body;
    const updated = db.updateUser(user.id, { sport });
    res.json({ user: updated });
  });

  // -------------------- AI PROTOCOLS & GENERATION --------------------
  app.get('/api/protocols', (req, res) => {
    res.json(db.getSportProtocols());
  });

  app.post('/api/protocols/generate', async (req, res) => {
    const { sport, targetArea, fatigueLevel, intensity } = req.body;

    try {
      const genAI = getGenAI();
      if (!genAI) {
        // Fallback response if API key is not configured
        return res.json({
          sport: sport || 'Football',
          title: `AI Customized Protocol for ${sport || 'Athletes'}`,
          warmupDrills: [
            'Dynamic multi-planar joint mobility & leg swings (8 mins)',
            'Low-intensity decelerations & hip capsule openers (10 mins)',
            'Accelerated short-burst 15m sprint activations (5 mins)',
          ],
          recoveryDrills: [
            'Cryotherapy contrast bath (12°C to 38°C) for 15 mins',
            'Post-exercise targeted foam rolling (Quadriceps & Hamstrings)',
            'Electrolyte & protein synthesis hydration blend',
          ],
          notes: 'Optimized for eccentric load reduction and kinetic chain stabilization.',
        });
      }

      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Act as ARIS (Athlete Recovery & Performance Intelligence AI). Generate an elite athletic recovery and pre-match protocol for an athlete playing ${
          sport || 'Football'
        }.
        Target Area/Focus: ${targetArea || 'Hamstring & Lower Body'}.
        Current Fatigue Rating: ${fatigueLevel || '3/5'}.
        Target Session Intensity: ${intensity || 'High'}.
        Return ONLY a JSON object with this exact shape:
        {
          "sport": "${sport}",
          "title": "Protocol Title",
          "warmupDrills": ["drill 1", "drill 2", "drill 3"],
          "recoveryDrills": ["recovery 1", "recovery 2", "recovery 3"],
          "notes": "Key physiological recommendation"
        }`,
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      res.json(parsed);
    } catch (err: any) {
      console.error('Gemini Protocol Generation error:', err);
      res.json({
        sport: sport || 'Football',
        title: `AI Customized Protocol for ${sport || 'Athletes'}`,
        warmupDrills: [
          'FIFA 11+ dynamic activation drill (10 mins)',
          'High-intensity shadow movement & agility ladder (8 mins)',
          'PNS neuromuscular stimulation exercises (5 mins)',
        ],
        recoveryDrills: [
          'Compression therapy (Level 3) for 20 mins',
          'Soft tissue mobilization: Lateral quads & glutes',
          'Intra-muscular hydration re-balancing',
        ],
        notes: 'Protocol calibrated for eccentric strain reduction.',
      });
    }
  });

  // -------------------- VITE MIDDLEWARE & STATIC SERVING --------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARIS Performance Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
