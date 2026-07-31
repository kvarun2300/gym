import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import '../../utils/chartSetup';
import { chartTooltipStyle, chartGridStyle, chartTickStyle } from '../../utils/chartSetup';
import memberService from '../../services/memberService';
import ScrollReveal from '../../components/common/ScrollReveal';
import Skeleton from '../../components/common/Skeleton';
import DataTable from '../../components/admin/DataTable';

const getBmiLabel = (bmi) => {
  if (!bmi) return '—';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

const Progress = () => {
  const { setTitle } = useOutletContext();
  const [entries, setEntries] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => setTitle('Progress & BMI'), [setTitle]);

  const fetchEntries = useCallback(() => {
    memberService
      .getMyProgress({ limit: 20 })
      .then(({ data }) => setEntries(data.data.items))
      .catch(() => toast.error('Could not load progress history'));
  }, []);

  useEffect(fetchEntries, [fetchEntries]);

  const onSubmit = async (values) => {
    try {
      await memberService.addProgress(values);
      toast.success('Progress logged');
      reset();
      fetchEntries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save entry');
    }
  };

  const chronological = entries ? [...entries].reverse() : [];
  const chartData = {
    labels: chronological.map((e) => new Date(e.recordedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Weight (kg)',
        data: chronological.map((e) => e.weightKg),
        borderColor: '#E63946',
        backgroundColor: 'rgba(230,57,70,0.15)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'BMI',
        data: chronological.map((e) => e.bmi),
        borderColor: '#22C55E',
        backgroundColor: 'transparent',
        borderDash: [4, 4],
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.6)', font: { family: 'Inter', size: 11 } } },
      tooltip: chartTooltipStyle,
    },
    scales: {
      x: { grid: { display: false }, ticks: chartTickStyle },
      y: { position: 'left', grid: chartGridStyle, ticks: chartTickStyle },
      y1: { position: 'right', grid: { display: false }, ticks: chartTickStyle },
    },
  };

  const columns = [
    { key: 'recordedAt', label: 'Date', render: (row) => new Date(row.recordedAt).toDateString() },
    { key: 'weightKg', label: 'Weight (kg)', render: (row) => row.weightKg || '—' },
    { key: 'bmi', label: 'BMI', render: (row) => (row.bmi ? `${row.bmi} (${getBmiLabel(row.bmi)})` : '—') },
    { key: 'bodyFatPercent', label: 'Body Fat %', render: (row) => (row.bodyFatPercent ? `${row.bodyFatPercent}%` : '—') },
  ];

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <div className="glass p-7">
          <h3 className="mb-5 font-display text-base font-bold text-white">Weight & BMI Trend</h3>
          {entries === null ? (
            <Skeleton className="h-64 w-full" />
          ) : entries.length ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p className="py-10 text-center text-sm text-white/30">Log your first entry below to start tracking trends.</p>
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <form onSubmit={handleSubmit(onSubmit)} className="glass p-7">
          <h3 className="mb-5 font-display text-base font-bold text-white">Log New Measurement</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div>
              <label className="label-field">Weight (kg)</label>
              <input type="number" step="0.1" className="input-field" {...register('weightKg')} />
            </div>
            <div>
              <label className="label-field">Height (cm)</label>
              <input type="number" step="0.1" className="input-field" {...register('heightCm')} />
            </div>
            <div>
              <label className="label-field">Body Fat %</label>
              <input type="number" step="0.1" className="input-field" {...register('bodyFatPercent')} />
            </div>
            <div>
              <label className="label-field">Chest (cm)</label>
              <input type="number" step="0.1" className="input-field" {...register('chestCm')} />
            </div>
            <div>
              <label className="label-field">Waist (cm)</label>
              <input type="number" step="0.1" className="input-field" {...register('waistCm')} />
            </div>
            <div>
              <label className="label-field">Arms (cm)</label>
              <input type="number" step="0.1" className="input-field" {...register('armsCm')} />
            </div>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-cta mt-5 !py-2.5 text-xs disabled:opacity-60">
            <Plus size={15} /> {isSubmitting ? 'Saving...' : 'Log Entry'}
          </button>
        </form>
      </ScrollReveal>

      <div>
        <h3 className="mb-4 font-display text-base font-bold text-white">History</h3>
        <DataTable columns={columns} rows={entries} loading={entries === null} emptyLabel="No entries logged yet" />
      </div>
    </div>
  );
};

export default Progress;
