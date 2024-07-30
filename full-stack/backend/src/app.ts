import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3000' // or whatever port your frontend is running on
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('LinkedIn Trait Matcher API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});