const Notification = require('../models/Notification');
const inMemoryStore = require('../services/inMemoryStore');
const { getStatus } = require('../config/db');

// @desc Get all notifications for the authenticated user
// @route GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const { isConnected } = getStatus();

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    let notifications = [];
    let total = 0;
    let unreadCount = 0;

    if (isConnected) {
      const query = { recipientId: userId };
      if (unreadOnly === 'true') {
        query.isRead = false;
      }

      total = await Notification.countDocuments(query);
      unreadCount = await Notification.countDocuments({ recipientId: userId, isRead: false });

      notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean();
    } else {
      let userNotifs = inMemoryStore.getNotificationsByUserId
        ? inMemoryStore.getNotificationsByUserId(userId)
        : [];
      
      if (unreadOnly === 'true') {
        userNotifs = userNotifs.filter(n => !n.isRead);
      }

      total = userNotifs.length;
      unreadCount = userNotifs.filter(n => !n.isRead).length;
      notifications = userNotifs.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    }

    return res.json({
      success: true,
      count: notifications.length,
      total,
      unreadCount,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      notifications,
    });
  } catch (error) {
    console.error('getNotifications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.', error: error.message });
  }
};

// @desc Get unread notification count
// @route GET /api/notifications/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isConnected } = getStatus();

    let unreadCount = 0;
    if (isConnected) {
      unreadCount = await Notification.countDocuments({ recipientId: userId, isRead: false });
    } else {
      const userNotifs = inMemoryStore.getNotificationsByUserId
        ? inMemoryStore.getNotificationsByUserId(userId)
        : [];
      unreadCount = userNotifs.filter(n => !n.isRead).length;
    }

    return res.json({ success: true, count: unreadCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve notification count.' });
  }
};

// @desc Mark a notification as read
// @route PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { isConnected } = getStatus();

    if (isConnected) {
      const notif = await Notification.findById(id);
      if (!notif) {
        return res.status(404).json({ success: false, message: 'Notification not found.' });
      }

      // Authorization: Recipient ownership check
      if (notif.recipientId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to modify this notification.' });
      }

      notif.isRead = true;
      notif.updatedAt = new Date();
      await notif.save();

      return res.json({ success: true, message: 'Notification marked as read.', notification: notif });
    } else {
      const updated = inMemoryStore.markNotificationAsRead ? inMemoryStore.markNotificationAsRead(id) : null;
      return res.json({ success: true, message: 'Notification marked as read.', notification: updated });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};

// @desc Mark all notifications as read for current user
// @route PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { isConnected } = getStatus();

    if (isConnected) {
      await Notification.updateMany({ recipientId: userId, isRead: false }, { isRead: true, updatedAt: new Date() });
    } else if (inMemoryStore.markAllNotificationsAsRead) {
      inMemoryStore.markAllNotificationsAsRead(userId);
    }

    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
};

// @desc Delete a notification
// @route DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { isConnected } = getStatus();

    if (isConnected) {
      const notif = await Notification.findById(id);
      if (!notif) return res.status(404).json({ success: false, message: 'Notification not found.' });

      if (notif.recipientId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized.' });
      }

      await Notification.findByIdAndDelete(id);
    } else if (inMemoryStore.deleteNotification) {
      inMemoryStore.deleteNotification(id);
    }

    return res.json({ success: true, message: 'Notification deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete notification.' });
  }
};

// Helper function to create persistent notifications internally
const createNotificationHelper = async ({ recipientId, senderId, jobId, applicationId, title, message, type, link }) => {
  try {
    const { isConnected } = getStatus();
    if (isConnected) {
      return await Notification.create({
        recipientId,
        senderId,
        jobId,
        applicationId,
        title,
        message,
        type: type || 'GENERAL',
        link: link || '',
        isRead: false,
      });
    } else if (inMemoryStore.addNotification) {
      return inMemoryStore.addNotification({
        recipientId,
        senderId,
        jobId,
        applicationId,
        title,
        message,
        type: type || 'GENERAL',
        link: link || '',
        isRead: false,
      });
    }
  } catch (err) {
    console.warn('[Notification] Creation notice:', err.message);
    return null;
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotificationHelper,
};
