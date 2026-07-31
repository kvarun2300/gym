import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import adminService from '../../services/adminService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Badge from '../../components/admin/Badge';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import MemberFormModal from '../../components/admin/MemberFormModal';

const Members = () => {
  const { setTitle } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [trainers, setTrainers] = useState([]);

  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => setTitle('Manage Members'), [setTitle]);

  const fetchMembers = useCallback(
    (page = 1) => {
      setLoading(true);
      adminService
        .getMembers({ page, limit: 10, search: search || undefined, gender: gender || undefined })
        .then(({ data }) => {
          setRows(data.data.items);
          setPagination(data.data.pagination);
        })
        .catch(() => toast.error('Could not load members'))
        .finally(() => setLoading(false));
    },
    [search, gender]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchMembers(1), 350);
    return () => clearTimeout(t);
  }, [fetchMembers]);

  useEffect(() => {
    adminService.getTrainers({ limit: 100 }).then(({ data }) => setTrainers(data.data.items)).catch(() => {});
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteMember(deleteTarget.id);
      toast.success('Member deleted');
      setDeleteTarget(null);
      fetchMembers(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete member');
    } finally {
      setDeleting(false);
    }
  };

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
    { key: 'phone', label: 'Phone', render: (row) => row.user?.phone || '—' },
    { key: 'gender', label: 'Gender', render: (row) => (row.gender ? <span className="capitalize">{row.gender}</span> : '—') },
    { key: 'trainer', label: 'Trainer', render: (row) => row.trainer?.user?.name || <span className="text-white/30">Unassigned</span> },
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
              setEditingMember(row);
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
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative max-w-xs flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="input-field pl-10"
            />
          </div>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-field max-w-[160px]">
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setFormOpen(true);
          }}
          className="btn-cta !py-2.5 text-xs"
        >
          <Plus size={15} /> Add Member
        </button>
      </div>

      <DataTable columns={columns} rows={rows} loading={loading} emptyLabel="No members found" />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={fetchMembers}
      />

      <MemberFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => fetchMembers(pagination.page)}
        member={editingMember}
        trainers={trainers}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this member?"
        description={`${deleteTarget?.user?.name || 'This member'} will be permanently removed along with their records.`}
      />
    </div>
  );
};

export default Members;
