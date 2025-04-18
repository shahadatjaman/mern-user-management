const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All routes below this require authentication

router.get('/', restrictTo('admin','manager','member'), getUsers);
router.get('/:id', restrictTo('admin', 'manager','member'), getUser);
router.put('/:id', restrictTo('admin', 'manager','member'), updateUser);
router.delete('/:id', restrictTo('admin','manager','member'), deleteUser);

module.exports = router;
