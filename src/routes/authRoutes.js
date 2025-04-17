const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
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


module.exports = router;
