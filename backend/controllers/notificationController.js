const { Notification } = require('../models');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { getPagination, buildPaginatedResponse } = require('../utils/paginate');

/**
 * @route GET /api/notifications
 * @access Any authenticated user - own notifications only
 */
const getMyNotifications = async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { unreadOnly } = req.query;

  const where = { userId: req.user.id };
  if (unreadOnly === 'true') where.isRead = false;

  const { rows, count } = await Notification.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  const unreadCount = await Notification.count({ where: { userId: req.user.id, isRead: false } });

  res
    .status(200)
    .json(new ApiResponse(200, { ...buildPaginatedResponse(rows, count, page, limit), unreadCount }, 'Notifications fetched'));
};

/**
 * @route PUT /api/notifications/:id/read
 */
const markAsRead = async (req, res) => {
  const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!notification) throw ApiError.notFound('Notification not found');

  notification.isRead = true;
  await notification.save();

  res.status(200).json(new ApiResponse(200, { notification }, 'Notification marked as read'));
};

/**
 * @route PUT /api/notifications/read-all
 */
const markAllAsRead = async (req, res) => {
  await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
  res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
};

/**
 * @route DELETE /api/notifications/:id
 */
const deleteNotification = async (req, res) => {
  const notification = await Notification.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!notification) throw ApiError.notFound('Notification not found');
  await notification.destroy();
  res.status(200).json(new ApiResponse(200, null, 'Notification deleted'));
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, deleteNotification };
