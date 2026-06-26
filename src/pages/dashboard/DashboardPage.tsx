import { useNavigate } from 'react-router-dom';
import { Package, Layers, TrendingDown, BellRing, AlertTriangle, ArrowRight, CheckCircle, Info, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from '@/hooks/useDashboard';
import { useAlertStore } from '@/store/alert.store';
import { StatCard } from '@/components/composite/StatCard';
import { Card } from '@/components/composite/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export const DashboardPage = () => {
  const { stats, monthlyAnalytics, loading } = useDashboard();
  const alerts = useAlertStore(state => state.alerts);
  const navigate = useNavigate();

  const unresolvedAlerts = alerts.filter(a => !a.resolved).slice(0, 3);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ALERT': return <AlertTriangle className="text-warning" size={20} />;
      case 'INVENTORY': return <Package className="text-success" size={20} />;
      case 'SYSTEM': return <Info className="text-primary" size={20} />;
      default: return <Activity className="text-muted" size={20} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'ALERT': return 'bg-warning/10 text-warning';
      case 'INVENTORY': return 'bg-success/10 text-success';
      case 'SYSTEM': return 'bg-primary/10 text-primary';
      default: return 'bg-surface text-muted';
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard Overview</h1>
          <p className="text-muted">Welcome back! Here's what's happening with your inventory today.</p>
        </div>
        <div className="text-sm font-medium text-muted bg-card px-4 py-2 rounded-xl border border-border shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats?.totalProducts || 0} 
          icon={<Package size={24} />} 
          iconColor="primary"
          loading={loading}
          href="/products"
        />
        <StatCard 
          title="Total Batches" 
          value={stats?.totalBatches || 0} 
          icon={<Layers size={24} />} 
          iconColor="accent"
          loading={loading}
          href="/batches"
        />
        <StatCard 
          title="Low Stock Items" 
          value={stats?.lowStockItems || 0} 
          icon={<TrendingDown size={24} />} 
          iconColor="warning"
          trend="Needs Attention"
          loading={loading}
          href="/inventory"
        />
        <StatCard 
          title="Active Alerts" 
          value={stats?.activeAlerts || 0} 
          icon={<BellRing size={24} />} 
          iconColor="danger"
          trend="Critical"
          loading={loading}
          href="/alerts"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Analytics Chart */}
          <Card title="Inventory Value Over Time">
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="w-full h-full bg-surface animate-pulse rounded-lg flex items-center justify-center">
                  <Activity size={32} className="text-muted opacity-30" />
                </div>
              ) : monthlyAnalytics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyAnalytics} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} className="text-primary" />
                        <stop offset="95%" stopColor="currentColor" stopOpacity={0} className="text-primary" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-muted" />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12 }} 
                      tickFormatter={(value) => `$${value/1000}k`}
                      stroke="currentColor" 
                      className="text-muted"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text)' }}
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Value']}
                    />
                    <Area type="monotone" dataKey="totalValue" stroke="currentColor" fillOpacity={1} fill="url(#colorValue)" className="text-primary" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted">
                  <TrendingDown size={48} className="opacity-20 mb-3" />
                  <p>Not enough data to display analytics yet.</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card 
            title="Recent Activity" 
            action={<Button variant="ghost" onClick={() => navigate('/inventory')}>View All</Button>}
          >
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-surface rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface rounded w-3/4"></div>
                      <div className="h-3 bg-surface rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-6">
                {stats.recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4 relative">
                    {/* Timeline Line */}
                    {index !== stats.recentActivity.length - 1 && (
                      <div className="absolute top-10 bottom-[-24px] left-5 w-px bg-border"></div>
                    )}
                    
                    <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full z-10 border border-card shadow-sm ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="pt-2 flex-1">
                      <p className="text-sm text-text font-medium">{activity.description}</p>
                      <p className="text-xs text-muted mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted">
                <Activity size={48} className="mx-auto mb-3 opacity-20" />
                <p>No recent activity found.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Quick Actions & Alerts */}
        <div className="space-y-6">
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 items-center justify-center hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all" onClick={() => navigate('/products')}>
                <Package size={20} />
                <span className="text-xs">Add Product</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 items-center justify-center hover:bg-accent/5 hover:border-accent/30 hover:text-accent transition-all" onClick={() => navigate('/batches')}>
                <Layers size={20} />
                <span className="text-xs">Receive Batch</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 items-center justify-center hover:bg-warning/5 hover:border-warning/30 hover:text-warning transition-all col-span-2" onClick={() => navigate('/inventory')}>
                <TrendingDown size={20} />
                <span className="text-xs">Adjust Stock Levels</span>
              </Button>
            </div>
          </Card>

          <Card 
            title="Real-Time Alerts" 
            action={
              unresolvedAlerts.length > 0 ? 
              <Badge variant="danger">{unresolvedAlerts.length} New</Badge> : null
            }
          >
            {unresolvedAlerts.length > 0 ? (
              <div className="space-y-3">
                {unresolvedAlerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-danger/5 border border-danger/20 rounded-lg flex gap-3 items-start cursor-pointer hover:bg-danger/10 transition-colors" onClick={() => navigate('/alerts')}>
                    <AlertTriangle size={16} className="text-danger shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text">{alert.productName}</p>
                      <p className="text-xs text-muted mt-0.5">Stock dropped to {alert.currentStock}</p>
                    </div>
                    <ArrowRight size={14} className="text-muted" />
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-xs mt-2" onClick={() => navigate('/alerts')}>
                  View all alerts
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 text-muted flex flex-col items-center bg-surface rounded-lg border border-dashed border-border">
                <CheckCircle size={32} className="text-success/50 mb-2" />
                <p className="text-sm">All clear! No active alerts.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
