const fs = require('fs');
const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');

const uploadDir = 'uploads/avatars/';

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Destination & Filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    req.body.avatar = uniqueName;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new AppError('Only images are allowed', 400), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
