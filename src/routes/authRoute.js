import { Router } from 'express'
import { signUp } from '../controllers/auth.js';
import { validateUser } from '../middleware/authMiddleware.js';

const authRouter = Router();

authRouter.post("/signup", validateUser, signUp);

export default authRouter;