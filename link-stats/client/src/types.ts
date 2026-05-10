export interface ShortLink {
  shortCode: string;
  originalUrl: string;
  createdAt: number;
  customCode?: string;
}

export interface VisitLog {
  shortCode: string;
  timestamp: number;
  userAgent: string;
  ip: string;
}

export interface LinkStats {
  shortCode: string;
  originalUrl: string;
  totalVisits: number;
  createdAt: number;
  visitsByDate: { date: string; count: number }[];
  recentVisits: VisitLog[];
}

export interface DashboardStats {
  totalLinks: number;
  totalVisits: number;
  visitsByDate: { date: string; count: number }[];
  recentVisits: VisitLog[];
}
