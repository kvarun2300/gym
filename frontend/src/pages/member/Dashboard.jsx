import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { CalendarCheck, Wallet, ShieldCheck, ArrowRight, LogIn, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import memberService from '../../services/memberService';
import StatCard from '../../components/admin/StatCard';
import ScrollReveal from '../../components/common/ScrollReveal';
import Skeleton from '../../components/common/Skeleton';
import { useAuth } from '../../context/AuthContext';

const MemberDashboard = () => {
  const { setTitle } = useOutletContext();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);

  useEffect(() => setTitle('Dashboard'), [setTitle]);

  const fetchDashboard = () => {
    memberService
      .getMemberDashboard()
      .then(({ data }) => setData(data.data))
      .catch(() => toast.error('Could not load dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchDashboard, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    try {
      await memberService.checkIn();
      setCheckedInToday(true);
      toast.success('Checked in! Have a great session 💪');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setCheckingIn(true);
    try {
      await memberService.checkOut();
      toast.success('Checked out. See you next session!');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const { summary } = data || {};
  const sub = summary?.activeSubscription;

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="glass flex flex-col items-start justify-between gap-4 p-7 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow mb-2">Welcome back</p>
            <h2 className="font-display text-2xl font-extrabold text-white">{user?.name?.split(' ')[0]}, ready to train?</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCheckIn} disabled={checkingIn} className="btn-cta !py-2.5 text-xs disabled:opacity-60">
              <LogIn size={15} /> Check In
            </button>
            <button onClick={handleCheckOut} disabled={checkingIn} className="btn-ghost !py-2.5 text-xs disabled:opacity-60">
              <LogOut size={15} /> Check Out
            </button>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard icon={CalendarCheck} label="Sessions This Month" value={summary?.attendanceThisMonth ?? 0} accent="success" />
        <StatCard icon={Wallet} label="Pending Payments" value={summary?.pendingPayments ?? 0} accent="warning" />
        <StatCard
          icon={ShieldCheck}
          label="Membership Status"
          value={sub ? 'Active' : 'None'}
          accent={sub ? 'success' : 'warning'}
        />
      </div>

      <ScrollReveal>
        <div className="glass p-7">
          <h3 className="mb-4 font-display text-base font-bold text-white">Current Membership</h3>
          {sub ? (
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-xl font-bold text-crimson-light">{sub.plan?.name}</p>
                <p className="mt-1 text-sm text-white/50">
                  Valid until <span className="text-white/80">{new Date(sub.endDate).toDateString()}</span>
                </p>
              </div>
              <Link to="/member/payments" className="btn-ghost !py-2.5 text-xs">
                View Payment History <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-white/50">You don't have an active membership plan right now.</p>
              <p className="mt-2 text-xs text-white/30">Speak to our front desk to activate or renew your plan.</p>
            </div>
          )}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link to="/member/workout-plan" className="glass glass-hover p-6">
          <p className="font-display text-sm font-bold text-white">Workout Plan</p>
          <p className="mt-1 text-xs text-white/40">View your assigned training program</p>
        </Link>
        <Link to="/member/diet-plan" className="glass glass-hover p-6">
          <p className="font-display text-sm font-bold text-white">Diet Plan</p>
          <p className="mt-1 text-xs text-white/40">Check your nutrition targets</p>
        </Link>
        <Link to="/member/progress" className="glass glass-hover p-6">
          <p className="font-display text-sm font-bold text-white">Progress & BMI</p>
          <p className="mt-1 text-xs text-white/40">Log today's measurements</p>
        </Link>
      </div>
    </div>
  );
};

export default MemberDashboard;
