import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDb from './config/MongoDb.js';
import authRouter from './routes/authRoutes.js';
import userDataRouter from './routes/userDataRoutes.js';

const app = express();
const port = process.env.PORT || 4000;



app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "https://email-authentication-frontend-fimw.onrender.com",
  credentials: true,
}))

app.use('/api/auth' , authRouter);
app.use('/api/user', userDataRouter);
app.get('/' , (req  , res) => {
  res.send('Hello World')
})

app.listen(port , () => {
  console.log(`Server is running on port ${port}`)
  connectDb()
})
