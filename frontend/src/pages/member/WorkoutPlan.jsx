import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Dumbbell, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import memberService from '../../services/memberService';
import ScrollReveal from '../../components/common/ScrollReveal';
import Skeleton from '../../components/common/Skeleton';
import Badge from '../../components/admin/Badge';

const groupByDay = (exercises = []) => {
  return exercises.reduce((acc, ex) => {
    const day = ex.day || 'General';
    if (!acc[day]) acc[day] = [];
    acc[day].push(ex);
    return acc;
  }, {});
};

const WorkoutPlan = () => {
  const { setTitle } = useOutletContext();
  const [plans, setPlans] = useState(null);

  useEffect(() => setTitle('Workout Plan'), [setTitle]);

  useEffect(() => {
    memberService
      .getMyWorkoutPlans()
      .then(({ data }) => setPlans(data.data.plans))
      .catch(() => toast.error('Could not load workout plans'));
  }, []);

  if (!plans) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="glass p-14 text-center">
        <Dumbbell size={28} className="mx-auto mb-4 text-white/20" />
        <p className="text-sm text-white/50">No workout plan assigned yet.</p>
        <p className="mt-1 text-xs text-white/30">Your trainer will build one for you based on your goals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {plans.map((plan, i) => {
        const grouped = groupByDay(plan.exercises);
        return (
          <ScrollReveal key={plan.id} delay={i * 0.05}>
            <div className="glass p-7">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-white">{plan.title}</h3>
                    {plan.isActive && <Badge variant="success">Active</Badge>}
                  </div>
                  {plan.goal && <p className="mt-1 text-sm text-white/50">Goal: {plan.goal}</p>}
                  <p className="mt-1 text-xs text-white/30">Assigned by {plan.trainer?.user?.name || 'your trainer'}</p>
                </div>
                {(plan.startDate || plan.endDate) && (
                  <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Calendar size={13} />
                    {plan.startDate ? new Date(plan.startDate).toLocaleDateString() : '—'} –{' '}
                    {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'ongoing'}
                  </div>
                )}
              </div>

              <div className="space-y-5">
                {Object.entries(grouped).map(([day, exercises]) => (
                  <div key={day}>
                    <p className="mb-2 font-accent text-xs font-semibold uppercase tracking-wider text-crimson-light">{day}</p>
                    <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                      <table className="w-full min-w-[420px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-white/40">
                            <th className="px-4 py-2.5 font-accent font-semibold">Exercise</th>
                            <th className="px-4 py-2.5 font-accent font-semibold">Sets</th>
                            <th className="px-4 py-2.5 font-accent font-semibold">Reps</th>
                            <th className="px-4 py-2.5 font-accent font-semibold">Rest</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercises.map((ex, idx) => (
                            <tr key={idx} className="border-b border-white/[0.04] last:border-0">
                              <td className="px-4 py-2.5 text-white/80">{ex.name}</td>
                              <td className="px-4 py-2.5 text-white/60">{ex.sets || '—'}</td>
                              <td className="px-4 py-2.5 text-white/60">{ex.reps || '—'}</td>
                              <td className="px-4 py-2.5 text-white/60">{ex.restSeconds ? `${ex.restSeconds}s` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
};

export default WorkoutPlan;
