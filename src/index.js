const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const path = require('path');


const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');


dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

// Serve files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Middleware: HTTP request logger
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // More detailed logs
} else {
  app.use(morgan('dev')); // Developer-friendly logs
}

app.get('/', (req, res) => {
    res.send('🎉 User Management API is running...');
  });
  

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.use('/api/comments', require('./routes/commentRoutes'));


app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(err.statusCode || 400).json({ message: err.message });
  }
  next(err);
});

// Global error handler for handling JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    // This will handle cases where JSON is malformed
    return res.status(400).json({ error: 'Invalid JSON format' });
  }

  // For other errors, pass it to the default error handler
  next(err);
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
