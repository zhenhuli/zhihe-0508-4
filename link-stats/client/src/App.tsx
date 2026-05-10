import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { shortenUrl, getDashboardStats, getAllLinks } from './api';
import { DashboardStats, LinkStats } from './types';

type Period = 'day' | 'month' | 'year';

function App() {
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortUrlResult, setShortUrlResult] = useState<{ shortCode: string; originalUrl: string; shortUrl: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [links, setLinks] = useState<LinkStats[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [period, setPeriod] = useState<Period>('day');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [serverPort, setServerPort] = useState<string>('8080');

  useEffect(() => {
    const backendPort = import.meta.env.VITE_BACKEND_PORT;
    if (backendPort) {
      setServerPort(backendPort);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [stats, linksData] = await Promise.all([
          getDashboardStats(period),
          getAllLinks()
        ]);
        if (isMounted) {
          setDashboardStats(stats);
          setLinks(linksData);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [period]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrlResult(null);
    setIsLoading(true);

    try {
      const result = await shortenUrl(
        url.startsWith('http') ? url : `https://${url}`,
        customCode || undefined
      );
      setShortUrlResult(result);
      setUrl('');
      setCustomCode('');
      fetchData();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create short link');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, linkId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (linkId) {
        setCopiedLink(linkId);
        setTimeout(() => setCopiedLink(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatChartDate = (date: string) => {
    if (period === 'year') {
      return date;
    } else if (period === 'month') {
      const [year, month] = date.split('-');
      return `${year.slice(2)}/${month}`;
    } else {
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }
  };

  const getChartTitle = () => {
    switch (period) {
      case 'year':
        return '📊 年度访问趋势（近5年）';
      case 'month':
        return '📊 月度访问趋势（近12月）';
      case 'day':
      default:
        return '📊 7 日访问趋势';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🔗 短链接统计平台</h1>
        <p>生成短链接，追踪访问数据</p>
      </header>

      <main className="container">
        <section className="shorten-form">
          <h2>生成短链接</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="url">目标 URL</label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="请输入要缩短的网址（例如：https://example.com）"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="customCode">自定义短码（可选）</label>
              <input
                id="customCode"
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="留空则自动生成（仅支持字母、数字、连字符和下划线）"
                pattern="^[a-zA-Z0-9_-]*$"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? '生成中...' : '生成短链接'}
            </button>
            
            {error && <p className="error">{error}</p>}
            
            {shortUrlResult && (
              <div className="result">
                <h3>✓ 短链接生成成功！</h3>
                <div className="short-url">
                  <a
                    href={shortUrlResult.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {shortUrlResult.shortUrl}
                  </a>
                  <button
                    type="button"
                    className="btn btn-copy"
                    onClick={() => copyToClipboard(shortUrlResult.shortUrl)}
                  >
                    复制
                  </button>
                </div>
              </div>
            )}
          </form>
        </section>

        {loadingData ? (
          <div className="loading">
            <p>加载数据中...</p>
          </div>
        ) : (
          <>
            {dashboardStats && (
              <section className="stats-dashboard">
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>总短链接数</h3>
                    <div className="stat-value">{dashboardStats.totalLinks}</div>
                  </div>
                  <div className="stat-card">
                    <h3>总访问次数</h3>
                    <div className="stat-value">{dashboardStats.totalVisits}</div>
                  </div>
                </div>

                <div className="chart-container">
                  <div className="chart-header">
                    <h3>{getChartTitle()}</h3>
                    <div className="period-buttons">
                      <button
                        type="button"
                        className={`btn-period ${period === 'day' ? 'active' : ''}`}
                        onClick={() => setPeriod('day')}
                      >
                        日
                      </button>
                      <button
                        type="button"
                        className={`btn-period ${period === 'month' ? 'active' : ''}`}
                        onClick={() => setPeriod('month')}
                      >
                        月
                      </button>
                      <button
                        type="button"
                        className={`btn-period ${period === 'year' ? 'active' : ''}`}
                        onClick={() => setPeriod('year')}
                      >
                        年
                      </button>
                    </div>
                  </div>
                  {dashboardStats.visitsByDate.some(d => d.count > 0) ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dashboardStats.visitsByDate}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickFormatter={formatChartDate}
                        />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#667eea"
                          strokeWidth={3}
                          dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                          name="访问次数"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="empty-state">
                      <p>暂无访问数据</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="links-section">
              <h2>📋 所有短链接</h2>
              {links.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="links-table">
                    <thead>
                      <tr>
                        <th>短码</th>
                        <th>原始链接</th>
                        <th>访问次数</th>
                        <th>创建时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {links.map((link) => {
                        const shortUrl = `http://localhost:${serverPort}/${link.shortCode}`;
                        return (
                          <tr key={link.shortCode}>
                            <td>
                              <a
                                href={shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-code"
                                title="点击访问短链接"
                              >
                                {link.shortCode}
                              </a>
                            </td>
                            <td className="link-url" title={link.originalUrl}>
                              {link.originalUrl}
                            </td>
                            <td>
                              <span className="visit-count">{link.totalVisits}</span>
                            </td>
                            <td>{formatDate(link.createdAt)}</td>
                            <td>
                              <button
                                type="button"
                                className={`btn btn-mini ${copiedLink === link.shortCode ? 'btn-copied' : ''}`}
                                onClick={() => copyToClipboard(shortUrl, link.shortCode)}
                              >
                                {copiedLink === link.shortCode ? '已复制' : '复制'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p>暂无短链接，请先创建一个</p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
