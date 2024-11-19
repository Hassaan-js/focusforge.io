import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// Configure CORS before other middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow Vite dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const dbPromise = open({
  filename: join(__dirname, 'database.sqlite'),
  driver: sqlite3.Database
});

async function initializeDatabase() {
  const db = await dbPromise;
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS blocked_sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS focus_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      end_time TIMESTAMP,
      duration INTEGER
    );

    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT NOT NULL,
      settings JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS active_template (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template_id INTEGER NOT NULL,
      activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (template_id) REFERENCES templates (id)
    );
  `);

  const defaultTemplates = [
    {
      name: 'Developer Focus',
      description: 'Optimized workspace for coding sessions with minimal distractions.',
      icon: 'Code',
      settings: JSON.stringify({
        focusDuration: 45,
        breakDuration: 10,
        blockedSites: ['twitter.com', 'facebook.com', 'youtube.com'],
        notifications: false
      })
    },
    {
      name: 'Study Session',
      description: 'Perfect for academic work with built-in break reminders.',
      icon: 'Book',
      settings: JSON.stringify({
        focusDuration: 25,
        breakDuration: 5,
        blockedSites: ['instagram.com', 'tiktok.com'],
        notifications: true
      })
    },
    {
      name: 'Business Mode',
      description: 'Streamlined setup for meetings and email management.',
      icon: 'Briefcase',
      settings: JSON.stringify({
        focusDuration: 60,
        breakDuration: 15,
        blockedSites: ['reddit.com', 'netflix.com'],
        notifications: true
      })
    },
    {
      name: 'Creative Workshop',
      description: 'Inspiration-friendly environment for artistic work.',
      icon: 'Palette',
      settings: JSON.stringify({
        focusDuration: 30,
        breakDuration: 10,
        blockedSites: [],
        notifications: false
      })
    }
  ];

  for (const template of defaultTemplates) {
    await db.run(
      'INSERT OR IGNORE INTO templates (name, description, icon, settings) VALUES (?, ?, ?, ?)',
      [template.name, template.description, template.icon, template.settings]
    );
  }
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.get('/api/sites', async (req, res) => {
  try {
    const db = await dbPromise;
    const sites = await db.all('SELECT * FROM blocked_sites ORDER BY created_at DESC');
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sites', async (req, res) => {
  const { url } = req.body;
  try {
    const db = await dbPromise;
    const result = await db.run(
      'INSERT INTO blocked_sites (url) VALUES (?)',
      url
    );
    
    const site = await db.get(
      'SELECT * FROM blocked_sites WHERE id = ?',
      result.lastID
    );
    
    res.status(201).json(site);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(409).json({ error: 'Site already blocked' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.delete('/api/sites/:id', async (req, res) => {
  try {
    const db = await dbPromise;
    await db.run('DELETE FROM blocked_sites WHERE id = ?', req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Template routes
app.get('/api/templates', async (req, res) => {
  try {
    const db = await dbPromise;
    const templates = await db.all('SELECT * FROM templates ORDER BY created_at DESC');
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/templates/active', async (req, res) => {
  try {
    const db = await dbPromise;
    const activeTemplate = await db.get(`
      SELECT t.* 
      FROM templates t
      JOIN active_template a ON t.id = a.template_id
      ORDER BY a.activated_at DESC
      LIMIT 1
    `);
    res.json(activeTemplate || null);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/templates/:id/activate', async (req, res) => {
  try {
    const db = await dbPromise;
    const { id } = req.params;

    await db.run('DELETE FROM active_template');
    await db.run(
      'INSERT INTO active_template (template_id) VALUES (?)',
      id
    );

    const template = await db.get('SELECT * FROM templates WHERE id = ?', id);
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sessions/start', async (req, res) => {
  try {
    const db = await dbPromise;
    const result = await db.run('INSERT INTO focus_sessions (start_time) VALUES (CURRENT_TIMESTAMP)');
    const session = await db.get('SELECT * FROM focus_sessions WHERE id = ?', result.lastID);
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sessions/:id/end', async (req, res) => {
  try {
    const db = await dbPromise;
    await db.run(`
      UPDATE focus_sessions 
      SET end_time = CURRENT_TIMESTAMP,
          duration = ROUND((JULIANDAY(CURRENT_TIMESTAMP) - JULIANDAY(start_time)) * 86400)
      WHERE id = ?
    `, req.params.id);
    
    const session = await db.get('SELECT * FROM focus_sessions WHERE id = ?', req.params.id);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sessions', async (req, res) => {
  try {
    const db = await dbPromise;
    const sessions = await db.all('SELECT * FROM focus_sessions ORDER BY start_time DESC');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const db = await dbPromise;
    
    const stats = await db.get(`
      SELECT 
        COALESCE(SUM(duration), 0) as total_focus_time,
        (SELECT COUNT(*) FROM blocked_sites) as sites_blocked,
        COALESCE(AVG(duration), 0) as avg_session_duration,
        (
          SELECT COUNT(*) 
          FROM focus_sessions 
          WHERE DATE(start_time) >= DATE('now', '-7 days')
        ) as weekly_sessions
      FROM focus_sessions
      WHERE end_time IS NOT NULL
    `);
    
    const focusScore = Math.min(100, Math.round(
      (stats.avg_session_duration / 1500) * 50 +
      (stats.weekly_sessions / 7) * 30 +
      (stats.sites_blocked / 10) * 20
    ));
    
    res.json({
      totalFocusTime: stats.total_focus_time,
      sitesBlocked: stats.sites_blocked,
      focusScore,
      currentStreak: stats.weekly_sessions
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

initializeDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch(console.error);