import express, { Request, Response } from 'express';
import cors from 'cors';
import * as net from 'net';
import {
  createShortLink,
  getShortLink,
  recordVisit,
  getLinkVisits,
  getAllLinks,
  getTotalVisits,
  getVisitsByDate,
  getVisitsByMonth,
  getVisitsByYear,
  getRecentVisits
} from './storage';
import { ShortLink, LinkStats } from './types';

const app = express();
const DEFAULT_PORT = 8080;

let currentPort = DEFAULT_PORT;

function checkPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

async function findAvailablePort(startPort: number): Promise<number> {
  let port = startPort;
  while (port < startPort + 100) {
    if (await checkPortAvailable(port)) {
      return port;
    }
    port++;
  }
  throw new Error('No available ports found');
}

app.use(cors());
app.use(express.json());

app.post('/api/shorten', (req: Request, res: Response) => {
  const { url, customCode }: { url: string; customCode?: string } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  
  if (customCode && !/^[a-zA-Z0-9_-]+$/.test(customCode)) {
    return res.status(400).json({ error: 'Custom code can only contain letters, numbers, hyphens and underscores' });
  }
  
  const link = createShortLink(url, customCode);
  
  if (!link) {
    return res.status(409).json({ error: 'Custom code already exists' });
  }
  
  res.json({
    shortCode: link.shortCode,
    originalUrl: link.originalUrl,
    shortUrl: `http://localhost:${currentPort}/${link.shortCode}`,
    serverPort: currentPort
  });
});

app.get('/:shortCode', (req: Request, res: Response) => {
  const { shortCode } = req.params;
  const link = getShortLink(shortCode);
  
  if (!link) {
    return res.status(404).send('Short link not found');
  }
  
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const ip = req.ip || req.connection.remoteAddress || 'Unknown';
  
  recordVisit(shortCode, userAgent, ip);
  
  res.redirect(link.originalUrl);
});

app.get('/api/stats', (req: Request, res: Response) => {
  const period = (req.query.period as string) || 'day';
  const totalLinks = getAllLinks().length;
  const totalVisits = getTotalVisits();
  const recentVisits = getRecentVisits(20);
  
  let visitsByPeriod: { date: string; count: number }[];
  
  switch (period) {
    case 'month':
      visitsByPeriod = getVisitsByMonth(12);
      break;
    case 'year':
      visitsByPeriod = getVisitsByYear(5);
      break;
    case 'day':
    default:
      visitsByPeriod = getVisitsByDate(7);
      break;
  }
  
  res.json({
    totalLinks,
    totalVisits,
    visitsByDate: visitsByPeriod,
    period,
    recentVisits
  });
});

app.get('/api/links', (_req: Request, res: Response) => {
  const links: ShortLink[] = getAllLinks();
  
  const linksWithStats: LinkStats[] = links.map(link => {
    const visits = getLinkVisits(link.shortCode);
    const visitsByDateMap = new Map<string, number>();
    
    visits.forEach(v => {
      const date = new Date(v.timestamp).toISOString().split('T')[0];
      visitsByDateMap.set(date, (visitsByDateMap.get(date) || 0) + 1);
    });
    
    const visitsByDate = Array.from(visitsByDateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      totalVisits: visits.length,
      createdAt: link.createdAt,
      visitsByDate,
      recentVisits: visits.slice(-10).reverse()
    };
  }).sort((a, b) => b.totalVisits - a.totalVisits);
  
  res.json(linksWithStats);
});

app.get('/api/stats/:shortCode', (req: Request, res: Response) => {
  const { shortCode } = req.params;
  const link = getShortLink(shortCode);
  
  if (!link) {
    return res.status(404).json({ error: 'Short link not found' });
  }
  
  const visits = getLinkVisits(shortCode);
  const visitsByDateMap = new Map<string, number>();
  
  visits.forEach(v => {
    const date = new Date(v.timestamp).toISOString().split('T')[0];
    visitsByDateMap.set(date, (visitsByDateMap.get(date) || 0) + 1);
  });
  
  const visitsByDate = Array.from(visitsByDateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  res.json({
    shortCode: link.shortCode,
    originalUrl: link.originalUrl,
    totalVisits: visits.length,
    createdAt: link.createdAt,
    visitsByDate,
    recentVisits: visits.slice(-20).reverse()
  });
});

async function startServer() {
  try {
    currentPort = await findAvailablePort(DEFAULT_PORT);
    
    const server = app.listen(currentPort, () => {
      console.log(`Server running on http://localhost:${currentPort}`);
    });
    
    process.on('SIGTERM', () => {
      server.close(() => {
        console.log('Server closed');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
