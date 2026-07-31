import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, UserRound, Dumbbell, Salad } from 'lucide-react';
import toast from 'react-hot-toast';
import trainerService from '../../services/trainerService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import WorkoutPlanModal from '../../components/trainer/WorkoutPlanModal';
import DietPlanModal from '../../components/trainer/DietPlanModal';

const Members = () => {
  const { setTitle } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [dietModalOpen, setDietModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => setTitle('My Members'), [setTitle]);

  const fetchMembers = useCallback(
    (page = 1) => {
      setLoading(true);
      trainerService
        .getMyMembers({ page, limit: 10, search: search || undefined })
        .then(({ data }) => {
          setRows(data.data.items);
          setPagination(data.data.pagination);
        })
        .catch(() => toast.error('Could not load members'))
        .finally(() => setLoading(false));
    },
    [search]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchMembers(1), 350);
    return () => clearTimeout(t);
  }, [fetchMembers]);

  const columns = [
    {
      key: 'name',
      label: 'Member',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.user?.profileImage ? (
            <img src={row.user.profileImage} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-crimson/15 text-crimson-light">
              <UserRound size={16} />
            </div>
          )}
          <div>
            <p className="font-medium text-white">{row.user?.name}</p>
            <p className="text-xs text-white/40">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'memberCode', label: 'Code' },
    { key: 'goal', label: 'Goal', render: (row) => row.goal || '—' },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setSelectedMemberId(row.id);
              setWorkoutModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-crimson-light hover:text-crimson-light"
          >
            <Dumbbell size={13} /> Workout
          </button>
          <button
            onClick={() => {
              setSelectedMemberId(row.id);
              setDietModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-crimson-light hover:text-crimson-light"
          >
            <Salad size={13} /> Diet
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search my members..."
          className="input-field pl-10"
        />
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} emptyLabel="No members assigned to you yet" />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={fetchMembers}
      />

      <WorkoutPlanModal
        open={workoutModalOpen}
        onClose={() => setWorkoutModalOpen(false)}
        onSaved={() => toast.success('You can view it under Workout Plans')}
        members={rows}
        presetMemberId={selectedMemberId}
      />
      <DietPlanModal
        open={dietModalOpen}
        onClose={() => setDietModalOpen(false)}
        onSaved={() => toast.success('You can view it under Diet Plans')}
        members={rows}
        presetMemberId={selectedMemberId}
      />
    </div>
  );
};

export default Members;
