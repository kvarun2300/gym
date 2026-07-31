import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Users, CalendarCheck, LogIn, LogOut, UserRound, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import trainerService from '../../services/trainerService';
import StatCard from '../../components/admin/StatCard';
import ScrollReveal from '../../components/common/ScrollReveal';
import Skeleton from '../../components/common/Skeleton';
import { useAuth } from '../../context/AuthContext';

const TrainerDashboard = () => {
  const { setTitle } = useOutletContext();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => setTitle('Dashboard'), [setTitle]);

  const fetchDashboard = () => {
    trainerService
      .getTrainerDashboard()
      .then(({ data }) => setData(data.data))
      .catch(() => toast.error('Could not load dashboard'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchDashboard, []);

  const handleCheckIn = async () => {
    setBusy(true);
    try {
      await trainerService.checkIn();
      toast.success("You're checked in!");
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setBusy(false);
    }
  };

  const handleCheckOut = async () => {
    setBusy(true);
    try {
      await trainerService.checkOut();
      toast.success('Checked out. Great session!');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const { summary, recentAssignedMembers } = data || {};

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="glass flex flex-col items-start justify-between gap-4 p-7 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow mb-2">Welcome back, Coach</p>
            <h2 className="font-display text-2xl font-extrabold text-white">{user?.name?.split(' ')[0]}</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCheckIn} disabled={busy} className="btn-cta !py-2.5 text-xs disabled:opacity-60">
              <LogIn size={15} /> Check In
            </button>
            <button onClick={handleCheckOut} disabled={busy} className="btn-ghost !py-2.5 text-xs disabled:opacity-60">
              <LogOut size={15} /> Check Out
            </button>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <StatCard icon={Users} label="Assigned Members" value={summary?.assignedMembersCount ?? 0} accent="crimson" />
        <StatCard
          icon={CalendarCheck}
          label="Today's Status"
          value={summary?.checkedInToday ? 'Checked In' : 'Not Checked In'}
          accent={summary?.checkedInToday ? 'success' : 'warning'}
        />
      </div>

      <ScrollReveal>
        <div className="glass p-7">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">Recently Assigned Members</h3>
            <Link to="/trainer/members" className="flex items-center gap-1 text-xs text-crimson-light hover:underline">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {recentAssignedMembers?.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentAssignedMembers.map((m) => (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] p-4">
                  {m.user?.profileImage ? (
                    <img src={m.user.profileImage} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-crimson/15 text-crimson-light">
                      <UserRound size={18} />
                    </div>
                  )}
                  <p className="text-sm font-medium text-white">{m.user?.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/30">No members assigned to you yet.</p>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
};

export default TrainerDashboard;
