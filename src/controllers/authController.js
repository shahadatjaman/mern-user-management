const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const { deleteFile } = require('../utils/fileService');

exports.register = async (req, res,next) => {
 try {
  const { name, email, password } = req.body;
  const avatar = req.file ? req.file.path : '';

  const userExists = await User.findOne({ email });

  if (userExists) {
    // Remove uploaded file if exists
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
    }
    return AppError(res,'Email already in use', 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    avatar,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token, avatar: user.avatar
  });
 } catch (error) {
  // Remove uploaded file if exists
  if (req.file && req.file.path) {
    deleteFile(req.file.path);
  }

  res.status(500).json({
    statusCode:500,
    message:"There was an server error!"
  });
 }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);

  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token
  });
};
