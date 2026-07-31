import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Users, Dumbbell, CalendarCheck, IndianRupee, Activity, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import '../../utils/chartSetup';
import { chartTooltipStyle, chartGridStyle, chartTickStyle } from '../../utils/chartSetup';
import adminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import ScrollReveal from '../../components/common/ScrollReveal';
import Skeleton from '../../components/common/Skeleton';

const monthLabel = (ym) => {
  if (!ym) return '';
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'short' });
};

const AdminDashboard = () => {
  const { setTitle } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle('Dashboard Overview');
  }, [setTitle]);

  useEffect(() => {
    adminService
      .getAdminDashboard()
      .then(({ data }) => setData(data.data))
      .catch(() => toast.error('Could not load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const { summary, charts, recentPayments, topTrainers } = data || {};

  const revenueChartData = {
    labels: (charts?.monthlyRevenue || []).map((r) => monthLabel(r.month)),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: (charts?.monthlyRevenue || []).map((r) => Number(r.total)),
        borderColor: '#E63946',
        backgroundColor: 'rgba(230,57,70,0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#E63946',
      },
    ],
  };

  const growthChartData = {
    labels: (charts?.membershipGrowth || []).map((r) => monthLabel(r.month)),
    datasets: [
      {
        label: 'New Memberships',
        data: (charts?.membershipGrowth || []).map((r) => Number(r.count)),
        backgroundColor: '#B3001B',
        borderRadius: 6,
        maxBarThickness: 32,
      },
    ],
  };

  const planColors = ['#E63946', '#B3001B', '#F59E0B', '#22C55E', '#6366F1'];
  const planChartData = {
    labels: (charts?.planDistribution || []).map((p) => p.planName),
    datasets: [
      {
        data: (charts?.planDistribution || []).map((p) => Number(p.count)),
        backgroundColor: planColors,
        borderWidth: 0,
      },
    ],
  };

  const genderColors = { male: '#E63946', female: '#B3001B', other: '#F59E0B' };
  const genderChartData = {
    labels: (charts?.genderRatio || []).map((g) => g.gender || 'Unspecified'),
    datasets: [
      {
        data: (charts?.genderRatio || []).map((g) => Number(g.count)),
        backgroundColor: (charts?.genderRatio || []).map((g) => genderColors[g.gender] || '#666'),
        borderWidth: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: chartTooltipStyle },
    scales: {
      x: { grid: { display: false }, ticks: chartTickStyle },
      y: { grid: chartGridStyle, ticks: chartTickStyle },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: chartTooltipStyle },
    scales: {
      x: { grid: { display: false }, ticks: chartTickStyle },
      y: { grid: chartGridStyle, ticks: chartTickStyle, beginAtZero: true },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter', size: 11 }, padding: 16 } },
      tooltip: chartTooltipStyle,
    },
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Users} label="Total Members" value={summary?.totalMembers ?? 0} accent="crimson" />
        <StatCard icon={Dumbbell} label="Total Trainers" value={summary?.totalTrainers ?? 0} accent="crimson" />
        <StatCard icon={Activity} label="Active Subscriptions" value={summary?.activeSubscriptions ?? 0} accent="success" />
        <StatCard icon={IndianRupee} label="Revenue This Month" value={`₹${summary?.revenueThisMonth ?? 0}`} accent="success" />
        <StatCard icon={CalendarCheck} label="Attendance Today" value={summary?.attendancePercentageToday ?? 0} suffix="%" accent="warning" />
      </div>

      {/* Revenue + Growth */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ScrollReveal>
          <div className="glass p-6">
            <h3 className="mb-5 font-display text-base font-bold text-white">Monthly Revenue</h3>
            {charts?.monthlyRevenue?.length ? <Line data={revenueChartData} options={lineOptions} /> : <EmptyChart />}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <div className="glass p-6">
            <h3 className="mb-5 font-display text-base font-bold text-white">Membership Growth</h3>
            {charts?.membershipGrowth?.length ? <Bar data={growthChartData} options={barOptions} /> : <EmptyChart />}
          </div>
        </ScrollReveal>
      </div>

      {/* Plan distribution + Gender ratio + Top trainers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ScrollReveal>
          <div className="glass p-6">
            <h3 className="mb-5 font-display text-base font-bold text-white">Plan Distribution</h3>
            {charts?.planDistribution?.length ? <Doughnut data={planChartData} options={doughnutOptions} /> : <EmptyChart />}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <div className="glass p-6">
            <h3 className="mb-5 font-display text-base font-bold text-white">Gender Ratio</h3>
            {charts?.genderRatio?.length ? <Doughnut data={genderChartData} options={doughnutOptions} /> : <EmptyChart />}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="glass p-6">
            <h3 className="mb-5 font-display text-base font-bold text-white">Top Trainers</h3>
            <div className="space-y-4">
              {topTrainers?.length ? (
                topTrainers.map((t) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-crimson/15 font-display text-sm font-bold text-crimson-light">
                      {t.user?.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{t.user?.name}</p>
                      <p className="text-xs text-white/40">{t.specialization || 'General Training'}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-warning">
                      <Star size={12} className="fill-warning" /> {t.rating || '—'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/30">No trainers yet.</p>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Recent payments */}
      <ScrollReveal>
        <div className="glass overflow-x-auto p-6">
          <h3 className="mb-5 font-display text-base font-bold text-white">Recent Payments</h3>
          {recentPayments?.length ? (
            <table className="w-full min-w-[500px] text-left">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/40">
                  <th className="pb-3 font-accent font-semibold">Member</th>
                  <th className="pb-3 font-accent font-semibold">Amount</th>
                  <th className="pb-3 font-accent font-semibold">Method</th>
                  <th className="pb-3 font-accent font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="py-3 text-sm text-white/80">{p.member?.user?.name || '—'}</td>
                    <td className="py-3 text-sm text-white/80">₹{p.amount}</td>
                    <td className="py-3 text-sm capitalize text-white/60">{p.method}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                          p.status === 'paid' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-white/30">No payments recorded yet.</p>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
};

const EmptyChart = () => <p className="py-10 text-center text-xs text-white/30">Not enough data yet.</p>;

export default AdminDashboard;
