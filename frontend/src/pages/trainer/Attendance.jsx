import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import trainerService from '../../services/trainerService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Badge from '../../components/admin/Badge';
import ScrollReveal from '../../components/common/ScrollReveal';

const STATUS_VARIANT = { present: 'success', late: 'warning', absent: 'danger' };

const Attendance = () => {
  const { setTitle } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  useEffect(() => setTitle('Attendance'), [setTitle]);

  const fetchAttendance = useCallback((page = 1) => {
    setLoading(true);
    trainerService
      .getAttendance({ page, limit: 10 })
      .then(({ data }) => {
        setRows(data.data.items);
        setPagination(data.data.pagination);
      })
      .catch(() => toast.error('Could not load attendance'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => fetchAttendance(1), [fetchAttendance]);
  useEffect(() => {
    trainerService.getMyMembers({ limit: 100 }).then(({ data }) => setMembers(data.data.items)).catch(() => {});
  }, []);

  const onMark = async (values) => {
    try {
      await trainerService.markAttendance(values);
      toast.success('Attendance marked');
      reset();
      fetchAttendance(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not mark attendance');
    }
  };

  const columns = [
    { key: 'date', label: 'Date', render: (row) => new Date(row.date).toDateString() },
    { key: 'member', label: 'Member', render: (row) => row.member?.user?.name || '—' },
    { key: 'checkIn', label: 'Check In', render: (row) => row.checkIn || '—' },
    { key: 'checkOut', label: 'Check Out', render: (row) => row.checkOut || '—' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] || 'neutral'}>{row.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <ScrollReveal>
        <form onSubmit={handleSubmit(onMark)} className="glass p-6">
          <h3 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-white">
            <CalendarCheck size={18} className="text-crimson-light" /> Mark Attendance
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <select className="input-field sm:col-span-2" {...register('memberId', { required: true })}>
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.user?.name}
                </option>
              ))}
            </select>
            <input type="date" className="input-field" {...register('date')} />
            <select className="input-field" {...register('status')}>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="btn-cta mt-4 !py-2.5 text-xs disabled:opacity-60">
            {isSubmitting ? 'Saving...' : 'Mark Attendance'}
          </button>
        </form>
      </ScrollReveal>

      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-white">Attendance Records</h3>
        <DataTable columns={columns} rows={rows} loading={loading} emptyLabel="No attendance records yet" />
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={fetchAttendance}
        />
      </div>
    </div>
  );
};

export default Attendance;
