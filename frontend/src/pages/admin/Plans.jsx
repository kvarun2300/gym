import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Badge from '../../components/admin/Badge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import PlanFormModal from '../../components/admin/PlanFormModal';

const formatDuration = (days) => {
  if (days >= 365) return `${Math.round(days / 365)} yr`;
  if (days >= 30) return `${Math.round(days / 30)} mo`;
  return `${days} days`;
};

const Plans = () => {
  const { setTitle } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setTitle('Membership Plans'), [setTitle]);

  const fetchPlans = useCallback((page = 1) => {
    setLoading(true);
    adminService
      .getPlans({ page, limit: 10 })
      .then(({ data }) => {
        setRows(data.data.items);
        setPagination(data.data.pagination);
      })
      .catch(() => toast.error('Could not load plans'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => fetchPlans(1), [fetchPlans]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deletePlan(deleteTarget.id);
      toast.success('Plan deleted');
      setDeleteTarget(null);
      fetchPlans(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete plan');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Plan',
      render: (row) => (
        <div className="flex items-center gap-2">
          <p className="font-medium text-white">{row.name}</p>
          {row.isFeatured && <Star size={13} className="fill-warning text-warning" />}
        </div>
      ),
    },
    { key: 'price', label: 'Price', render: (row) => `₹${row.price}` },
    { key: 'durationDays', label: 'Duration', render: (row) => formatDuration(row.durationDays) },
    {
      key: 'features',
      label: 'Features',
      render: (row) => (
        <span className="text-xs text-white/50">
          {(row.features || []).slice(0, 2).join(', ')}
          {row.features?.length > 2 ? '…' : ''}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.isActive ? 'success' : 'danger'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setEditingPlan(row);
              setFormOpen(true);
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
            setFormOpen(true);
          }}
          className="btn-cta !py-2.5 text-xs"
        >
          <Plus size={15} /> Add Plan
        </button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} emptyLabel="No membership plans yet" />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={fetchPlans}
      />

      <PlanFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={() => fetchPlans(pagination.page)} plan={editingPlan} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this plan?"
        description={`"${deleteTarget?.name}" will be permanently removed.`}
      />
    </div>
  );
};

export default Plans;
