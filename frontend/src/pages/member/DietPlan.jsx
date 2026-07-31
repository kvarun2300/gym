import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Salad, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import memberService from '../../services/memberService';
import ScrollReveal from '../../components/common/ScrollReveal';
import Skeleton from '../../components/common/Skeleton';
import Badge from '../../components/admin/Badge';

const DietPlan = () => {
  const { setTitle } = useOutletContext();
  const [plans, setPlans] = useState(null);

  useEffect(() => setTitle('Diet Plan'), [setTitle]);

  useEffect(() => {
    memberService
      .getMyDietPlans()
      .then(({ data }) => setPlans(data.data.plans))
      .catch(() => toast.error('Could not load diet plans'));
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
        <Salad size={28} className="mx-auto mb-4 text-white/20" />
        <p className="text-sm text-white/50">No diet plan assigned yet.</p>
        <p className="mt-1 text-xs text-white/30">Your trainer will build one based on your goals and calorie targets.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {plans.map((plan, i) => (
        <ScrollReveal key={plan.id} delay={i * 0.05}>
          <div className="glass p-7">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-white">{plan.title}</h3>
                  {plan.isActive && <Badge variant="success">Active</Badge>}
                </div>
                <p className="mt-1 text-xs text-white/30">Assigned by {plan.trainer?.user?.name || 'your trainer'}</p>
              </div>
              {plan.targetCalories && (
                <div className="flex items-center gap-1.5 rounded-full bg-crimson/15 px-3 py-1.5 text-xs font-semibold text-crimson-light">
                  <Flame size={13} /> {plan.targetCalories} kcal / day
                </div>
              )}
            </div>

            {plan.notes && <p className="mb-5 rounded-xl bg-white/[0.03] p-4 text-sm text-white/50">{plan.notes}</p>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {(plan.meals || []).map((meal, idx) => (
                <div key={idx} className="rounded-xl border border-white/[0.06] p-4">
                  <p className="mb-3 font-accent text-xs font-semibold uppercase tracking-wider text-crimson-light">
                    {meal.mealType}
                  </p>
                  <ul className="space-y-2">
                    {(meal.items || []).map((item, ii) => (
                      <li key={ii} className="flex items-center justify-between text-sm">
                        <span className="text-white/75">{item.name}</span>
                        <span className="text-xs text-white/40">
                          {item.quantity} {item.calories ? `· ${item.calories} kcal` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
};

export default DietPlan;
