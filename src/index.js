const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

const connectDB = require('./config/db');

dotenv.config();
const app = express();

app.use(express.json());

// Middleware: HTTP request logger
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // More detailed logs
} else {
  app.use(morgan('dev')); // Developer-friendly logs
}

app.get('/', (req, res) => {
    res.send('🎉 User Management API is running...');
  });
  
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
