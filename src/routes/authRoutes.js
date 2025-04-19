const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../middleware/authValidator');
const validateRequest = require('../middleware/validateRequest');
const upload = require('../middleware/uploadAvatar');

router.post(
    '/register',
    upload.single('avatar'), // <-- handle file
    registerValidator,
    validateRequest,
    register
  );
  
router.post('/login', loginValidator, validateRequest, login);

router.post('/refresh', refreshToken);
router.post('/logout', logout);

module.exports = router;
