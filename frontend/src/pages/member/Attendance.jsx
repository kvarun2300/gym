import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import memberService from '../../services/memberService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Badge from '../../components/admin/Badge';

const STATUS_VARIANT = { present: 'success', late: 'warning', absent: 'danger' };

const Attendance = () => {
  const { setTitle } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => setTitle('My Attendance'), [setTitle]);

  const fetchHistory = useCallback((page = 1) => {
    setLoading(true);
    memberService
      .getMyAttendance({ page, limit: 10 })
      .then(({ data }) => {
        setRows(data.data.items);
        setPagination(data.data.pagination);
      })
      .catch(() => toast.error('Could not load attendance history'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => fetchHistory(1), [fetchHistory]);

  const columns = [
    { key: 'date', label: 'Date', render: (row) => new Date(row.date).toDateString() },
    { key: 'checkIn', label: 'Check In', render: (row) => row.checkIn || '—' },
    { key: 'checkOut', label: 'Check Out', render: (row) => row.checkOut || '—' },
    { key: 'checkInMethod', label: 'Method', render: (row) => <span className="capitalize">{row.checkInMethod}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={STATUS_VARIANT[row.status] || 'neutral'}>{row.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-5">
      <DataTable columns={columns} rows={rows} loading={loading} emptyLabel="No attendance records yet. Check in from your dashboard!" />
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={fetchHistory}
      />
    </div>
  );
};

export default Attendance;
