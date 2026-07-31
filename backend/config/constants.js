module.exports = {
  ROLES: {
    ADMIN: 'admin',
    TRAINER: 'trainer',
    MEMBER: 'member',
  },
  SUBSCRIPTION_STATUS: {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
    PENDING: 'pending',
  },
  PAYMENT_STATUS: {
    PAID: 'paid',
    PENDING: 'pending',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },
  PAYMENT_METHOD: {
    CASH: 'cash',
    CARD: 'card',
    UPI: 'upi',
    NET_BANKING: 'net_banking',
  },
  ATTENDANCE_STATUS: {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
  },
  INVOICE_STATUS: {
    PAID: 'paid',
    UNPAID: 'unpaid',
    OVERDUE: 'overdue',
  },
  GENDER: {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
  },
  NOTIFICATION_TYPE: {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
  },
  UPLOAD_LIMITS: {
    PROFILE_MB: 5,
    GALLERY_MB: 8,
  },
};
