import { DashboardStats, LinkStats } from './types';

const API_BASE = '/api';

export async function shortenUrl(url: string, customCode?: string): Promise<{ shortCode: string; originalUrl: string; shortUrl: string }> {
  const response = await fetch(`${API_BASE}/shorten`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, customCode })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to shorten URL');
  }
  
  return response.json();
}

export async function getDashboardStats(period: 'day' | 'month' | 'year' = 'day'): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE}/stats?period=${period}`);
  return response.json();
}

export async function getAllLinks(): Promise<LinkStats[]> {
  const response = await fetch(`${API_BASE}/links`);
  return response.json();
}

export async function getLinkStats(shortCode: string): Promise<LinkStats> {
  const response = await fetch(`${API_BASE}/stats/${shortCode}`);
  
  if (!response.ok) {
    throw new Error('Link not found');
  }
  
  return response.json();
}
