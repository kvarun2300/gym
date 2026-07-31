import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Badge from '../../components/admin/Badge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import TrainerFormModal from '../../components/admin/TrainerFormModal';

const Trainers = () => {
  const { setTitle } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setTitle('Manage Trainers'), [setTitle]);

  const fetchTrainers = useCallback(
    (page = 1) => {
      setLoading(true);
      adminService
        .getTrainers({ page, limit: 10, search: search || undefined })
        .then(({ data }) => {
          setRows(data.data.items);
          setPagination(data.data.pagination);
        })
        .catch(() => toast.error('Could not load trainers'))
        .finally(() => setLoading(false));
    },
    [search]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchTrainers(1), 350);
    return () => clearTimeout(t);
  }, [fetchTrainers]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteTrainer(deleteTarget.id);
      toast.success('Trainer deleted');
      setDeleteTarget(null);
      fetchTrainers(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete trainer');
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Trainer',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.user?.profileImage ? (
            <img src={row.user.profileImage} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-crimson/15 font-display text-sm font-bold text-crimson-light">
              {row.user?.name?.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-white">{row.user?.name}</p>
            <p className="text-xs text-white/40">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'trainerCode', label: 'Code' },
    { key: 'specialization', label: 'Specialization', render: (row) => row.specialization || '—' },
    { key: 'experienceYears', label: 'Experience', render: (row) => (row.experienceYears ? `${row.experienceYears} yrs` : '—') },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <span className="flex items-center gap-1">
          <Star size={13} className="fill-warning text-warning" /> {row.rating || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.user?.isActive ? 'success' : 'danger'}>{row.user?.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setEditingTrainer(row);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field pl-10"
          />
        </div>
        <button
          onClick={() => {
            setEditingTrainer(null);
            setFormOpen(true);
          }}
          className="btn-cta !py-2.5 text-xs"
        >
          <Plus size={15} /> Add Trainer
        </button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} emptyLabel="No trainers found" />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={fetchTrainers}
      />

      <TrainerFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => fetchTrainers(pagination.page)}
        trainer={editingTrainer}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this trainer?"
        description={`${deleteTarget?.user?.name || 'This trainer'} will be permanently removed. Assigned members will be unassigned.`}
      />
    </div>
  );
};

export default Trainers;
