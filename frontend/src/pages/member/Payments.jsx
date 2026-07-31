import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import memberService from '../../services/memberService';
import DataTable from '../../components/admin/DataTable';
import Pagination from '../../components/admin/Pagination';
import Badge from '../../components/admin/Badge';

const PAYMENT_STATUS_VARIANT = { paid: 'success', pending: 'warning', failed: 'danger', refunded: 'neutral' };
const INVOICE_STATUS_VARIANT = { paid: 'success', unpaid: 'warning', overdue: 'danger' };

const Payments = () => {
  const { setTitle } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [paymentsPagination, setPaymentsPagination] = useState({ page: 1, limit: 8, total: 0, totalPages: 1 });
  const [invoices, setInvoices] = useState([]);
  const [invoicesPagination, setInvoicesPagination] = useState({ page: 1, limit: 8, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => setTitle('Payments & Invoices'), [setTitle]);

  const fetchPayments = useCallback((page = 1) => {
    memberService
      .getMyPayments({ page, limit: 8 })
      .then(({ data }) => {
        setPayments(data.data.items);
        setPaymentsPagination(data.data.pagination);
      })
      .catch(() => toast.error('Could not load payment history'));
  }, []);

  const fetchInvoices = useCallback((page = 1) => {
    memberService
      .getMyInvoices({ page, limit: 8 })
      .then(({ data }) => {
        setInvoices(data.data.items);
        setInvoicesPagination(data.data.pagination);
      })
      .catch(() => toast.error('Could not load invoices'));
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchPayments(1), fetchInvoices(1)]).finally(() => setLoading(false));
  }, [fetchPayments, fetchInvoices]);

  const handleDownload = async (invoice) => {
    setDownloadingId(invoice.id);
    try {
      const response = await api.get(`/invoices/${invoice.id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Could not download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const paymentColumns = [
    { key: 'createdAt', label: 'Date', render: (row) => new Date(row.createdAt).toDateString() },
    { key: 'amount', label: 'Amount', render: (row) => `₹${row.amount}` },
    { key: 'method', label: 'Method', render: (row) => <span className="capitalize">{row.method}</span> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={PAYMENT_STATUS_VARIANT[row.status] || 'neutral'}>{row.status}</Badge>,
    },
  ];

  const invoiceColumns = [
    { key: 'invoiceNumber', label: 'Invoice #' },
    { key: 'issuedAt', label: 'Issued', render: (row) => new Date(row.issuedAt).toDateString() },
    { key: 'total', label: 'Total', render: (row) => `₹${row.total}` },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={INVOICE_STATUS_VARIANT[row.status] || 'neutral'}>{row.status}</Badge>,
    },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <button
          onClick={() => handleDownload(row)}
          disabled={downloadingId === row.id}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-crimson-light hover:text-crimson-light disabled:opacity-50"
        >
          <Download size={13} /> {downloadingId === row.id ? 'Downloading...' : 'PDF'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-white">Payment History</h3>
        <DataTable columns={paymentColumns} rows={payments} loading={loading} emptyLabel="No payments recorded yet" />
        <Pagination
          page={paymentsPagination.page}
          totalPages={paymentsPagination.totalPages}
          total={paymentsPagination.total}
          limit={paymentsPagination.limit}
          onPageChange={fetchPayments}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-white">Invoices</h3>
        <DataTable columns={invoiceColumns} rows={invoices} loading={loading} emptyLabel="No invoices yet" />
        <Pagination
          page={invoicesPagination.page}
          totalPages={invoicesPagination.totalPages}
          total={invoicesPagination.total}
          limit={invoicesPagination.limit}
          onPageChange={fetchInvoices}
        />
      </div>
    </div>
  );
};

export default Payments;
