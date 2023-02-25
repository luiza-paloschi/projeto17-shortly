import { Router } from 'express'
import { signIn, signUp } from '../controllers/auth.js';
import { validateLogin, validateUser } from '../middleware/authMiddleware.js';

const authRouter = Router();

authRouter.post("/signup", validateUser, signUp);
authRouter.post("/signin", validateLogin, signIn);

export default authRouter;