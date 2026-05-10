import { ShortLink, VisitLog } from './types';

const linksMap = new Map<string, ShortLink>();
const visitsByCode = new Map<string, VisitLog[]>();
const allVisits: VisitLog[] = [];

function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function createShortLink(originalUrl: string, customCode?: string): ShortLink | null {
  let shortCode: string;
  
  if (customCode) {
    if (linksMap.has(customCode)) {
      return null;
    }
    shortCode = customCode;
  } else {
    do {
      shortCode = generateShortCode();
    } while (linksMap.has(shortCode));
  }
  
  const link: ShortLink = {
    shortCode,
    originalUrl,
    createdAt: Date.now(),
    customCode: customCode || undefined
  };
  
  linksMap.set(shortCode, link);
  visitsByCode.set(shortCode, []);
  
  return link;
}

function getShortLink(shortCode: string): ShortLink | undefined {
  return linksMap.get(shortCode);
}

function recordVisit(shortCode: string, userAgent: string, ip: string): void {
  const visit: VisitLog = {
    shortCode,
    timestamp: Date.now(),
    userAgent,
    ip
  };
  
  const visits = visitsByCode.get(shortCode);
  if (visits) {
    visits.push(visit);
  } else {
    visitsByCode.set(shortCode, [visit]);
  }
  
  allVisits.push(visit);
}

function getLinkVisits(shortCode: string): VisitLog[] {
  return visitsByCode.get(shortCode) || [];
}

function getAllLinks(): ShortLink[] {
  return Array.from(linksMap.values());
}

function getTotalVisits(): number {
  return allVisits.length;
}

function getVisitsByDate(days: number = 7): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const startOfDay = date.setHours(0, 0, 0, 0);
    const endOfDay = date.setHours(23, 59, 59, 999);
    
    const count = allVisits.filter(v => v.timestamp >= startOfDay && v.timestamp <= endOfDay).length;
    result.push({ date: dateStr, count });
  }
  
  return result;
}

function getRecentVisits(limit: number = 20): VisitLog[] {
  return allVisits.slice(-limit).reverse();
}

function getVisitsByMonth(months: number = 12): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    date.setDate(1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
    
    const count = allVisits.filter(v => v.timestamp >= startOfMonth && v.timestamp <= endOfMonth).length;
    result.push({ date: monthStr, count });
  }
  
  return result;
}

function getVisitsByYear(years: number = 5): { date: string; count: number }[] {
  const result: { date: string; count: number }[] = [];
  const now = new Date();
  
  for (let i = years - 1; i >= 0; i--) {
    const year = now.getFullYear() - i;
    const yearStr = `${year}`;
    
    const startOfYear = new Date(year, 0, 1).getTime();
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999).getTime();
    
    const count = allVisits.filter(v => v.timestamp >= startOfYear && v.timestamp <= endOfYear).length;
    result.push({ date: yearStr, count });
  }
  
  return result;
}

export {
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
};
