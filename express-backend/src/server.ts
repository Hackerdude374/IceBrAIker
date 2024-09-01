import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profiles';
import matchRoutes from './routes/matches';
import { errorHandler } from './middleware/errorHandler';
import prisma from './config/database';
import passport from './config/passport';
import session from 'express-session';
dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
  optionsSuccessStatus: 200
};

console.log('CORS options:', corsOptions); // Debug log

app.use(cors(corsOptions));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/matches', matchRoutes);

app.use(errorHandler);
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
const PORT = process.env.PORT || 3000;

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database!');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`Numbers of users in the database: ${userCount}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

async function startServer() {
  try {
    await testDatabaseConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}
app.use(passport.initialize());
app.use(passport.session());
startServer();

export { app, prisma };