const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { deleteFile } = require('../utils/fileService');


const createAccessToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });

exports.register = async (req, res) => {
 try {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    // Remove uploaded file if exists
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
    }
    return AppError(res,'Email already in use', 409);
  }

  const fileUrl = `http://localhost:5000/uploads/avatars/${req.file.filename}`;

  const user = await User.create({
    name,
    email,
    password,
    avatar:fileUrl,
  });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).json({ accessToken,user });

 } catch (error) {
  // Remove uploaded file if exists
  if (req.file && req.file.path) {
    deleteFile(req.file.path);
  }
  console.log(error);
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


  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }).json({ accessToken });
};


exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error();

    const accessToken = createAccessToken(user);
    res.json({ accessToken });
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out' });
};