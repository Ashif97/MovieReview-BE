const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

console.log(process.env.MONGODB_URI)

const app = express();

app.use(express.json());
app.use(cookieParser());

connectDB();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
