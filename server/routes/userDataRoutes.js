import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userData.js';

const userDataRouter = express.Router();


userDataRouter.get('/data', userAuth , getUserData)


export default userDataRouter;