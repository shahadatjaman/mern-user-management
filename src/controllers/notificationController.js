const Notification = require('../models/Notification');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Fetching notifications failed', error });
  }
};
