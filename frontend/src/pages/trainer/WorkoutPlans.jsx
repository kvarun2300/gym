import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import trainerService from '../../services/trainerService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Badge from '../../components/admin/Badge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import WorkoutPlanModal from '../../components/trainer/WorkoutPlanModal';

const WorkoutPlans = () => {
  const { setTitle } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setTitle('Workout Plans'), [setTitle]);

  const fetchPlans = useCallback((page = 1) => {
    setLoading(true);
    trainerService
      .getWorkoutPlans({ page, limit: 10 })
      .then(({ data }) => {
        setRows(data.data.items);
        setPagination(data.data.pagination);
      })
      .catch(() => toast.error('Could not load workout plans'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => fetchPlans(1), [fetchPlans]);
  useEffect(() => {
    trainerService.getMyMembers({ limit: 100 }).then(({ data }) => setMembers(data.data.items)).catch(() => {});
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await trainerService.deleteWorkoutPlan(deleteTarget.id);
      toast.success('Workout plan deleted');
      setDeleteTarget(null);
      fetchPlans(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete plan');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Plan', render: (row) => <p className="font-medium text-white">{row.title}</p> },
    { key: 'member', label: 'Member', render: (row) => row.member?.user?.name || '—' },
    { key: 'goal', label: 'Goal', render: (row) => row.goal || '—' },
    { key: 'exercises', label: 'Exercises', render: (row) => `${row.exercises?.length || 0} exercises` },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.isActive ? 'success' : 'neutral'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setEditingPlan(row);
              setModalOpen(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-crimson-light hover:text-crimson-light"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-danger hover:text-danger"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingPlan(null);
            setModalOpen(true);
          }}
          className="btn-cta !py-2.5 text-xs"
        >
          <Plus size={15} /> Assign New Plan
        </button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} emptyLabel="No workout plans created yet" />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={fetchPlans}
      />

      <WorkoutPlanModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => fetchPlans(pagination.page)}
        plan={editingPlan}
        members={members}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this workout plan?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
      />
    </div>
  );
};

export default WorkoutPlans;
