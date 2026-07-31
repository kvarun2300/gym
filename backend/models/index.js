const { sequelize } = require('../config/database');

const User = require('./User');
const Member = require('./Member');
const Trainer = require('./Trainer');
const Plan = require('./Plan');
const Subscription = require('./Subscription');
const Attendance = require('./Attendance');
const Payment = require('./Payment');
const Invoice = require('./Invoice');
const Notification = require('./Notification');
const Gallery = require('./Gallery');
const WorkoutPlan = require('./WorkoutPlan');
const DietPlan = require('./DietPlan');
const Progress = require('./Progress');
const ContactMessage = require('./ContactMessage');
const Blog = require('./Blog');
const Setting = require('./Setting');

/* ---------------------------- User <-> Member ---------------------------- */
User.hasOne(Member, { foreignKey: 'userId', as: 'memberProfile', onDelete: 'CASCADE' });
Member.belongsTo(User, { foreignKey: 'userId', as: 'user' });

/* --------------------------- User <-> Trainer ---------------------------- */
User.hasOne(Trainer, { foreignKey: 'userId', as: 'trainerProfile', onDelete: 'CASCADE' });
Trainer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

/* ------------------------- Member <-> Trainer (assigned) ------------------ */
Trainer.hasMany(Member, { foreignKey: 'assignedTrainerId', as: 'assignedMembers' });
Member.belongsTo(Trainer, { foreignKey: 'assignedTrainerId', as: 'trainer' });

/* ---------------------------- Subscriptions ------------------------------- */
Member.hasMany(Subscription, { foreignKey: 'memberId', as: 'subscriptions', onDelete: 'CASCADE' });
Subscription.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

Plan.hasMany(Subscription, { foreignKey: 'planId', as: 'subscriptions' });
Subscription.belongsTo(Plan, { foreignKey: 'planId', as: 'plan' });

/* ----------------------------- Attendance --------------------------------- */
Member.hasMany(Attendance, { foreignKey: 'memberId', as: 'attendanceRecords', onDelete: 'CASCADE' });
Attendance.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

Trainer.hasMany(Attendance, { foreignKey: 'trainerId', as: 'attendanceRecords', onDelete: 'CASCADE' });
Attendance.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });

/* ------------------------------ Payments ----------------------------------- */
Member.hasMany(Payment, { foreignKey: 'memberId', as: 'payments', onDelete: 'CASCADE' });
Payment.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

Subscription.hasMany(Payment, { foreignKey: 'subscriptionId', as: 'payments' });
Payment.belongsTo(Subscription, { foreignKey: 'subscriptionId', as: 'subscription' });

/* ------------------------------ Invoices ------------------------------------ */
Member.hasMany(Invoice, { foreignKey: 'memberId', as: 'invoices', onDelete: 'CASCADE' });
Invoice.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

Payment.hasOne(Invoice, { foreignKey: 'paymentId', as: 'invoice' });
Invoice.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });

/* --------------------------- Notifications ----------------------------------- */
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

/* ------------------------------- Gallery -------------------------------------- */
User.hasMany(Gallery, { foreignKey: 'uploadedBy', as: 'galleryUploads' });
Gallery.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

/* ---------------------------- Workout / Diet Plans ----------------------------- */
Member.hasMany(WorkoutPlan, { foreignKey: 'memberId', as: 'workoutPlans', onDelete: 'CASCADE' });
WorkoutPlan.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
Trainer.hasMany(WorkoutPlan, { foreignKey: 'trainerId', as: 'assignedWorkoutPlans' });
WorkoutPlan.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });

Member.hasMany(DietPlan, { foreignKey: 'memberId', as: 'dietPlans', onDelete: 'CASCADE' });
DietPlan.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });
Trainer.hasMany(DietPlan, { foreignKey: 'trainerId', as: 'assignedDietPlans' });
DietPlan.belongsTo(Trainer, { foreignKey: 'trainerId', as: 'trainer' });

/* --------------------------------- Progress ------------------------------------- */
Member.hasMany(Progress, { foreignKey: 'memberId', as: 'progressRecords', onDelete: 'CASCADE' });
Progress.belongsTo(Member, { foreignKey: 'memberId', as: 'member' });

/* ---------------------------------- Blog ----------------------------------------- */
User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogPosts' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = {
  sequelize,
  User,
  Member,
  Trainer,
  Plan,
  Subscription,
  Attendance,
  Payment,
  Invoice,
  Notification,
  Gallery,
  WorkoutPlan,
  DietPlan,
  Progress,
  ContactMessage,
  Blog,
  Setting,
};
