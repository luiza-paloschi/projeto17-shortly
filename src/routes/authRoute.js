import { Router } from 'express'
import { getUser, signIn, signUp } from '../controllers/auth.js';
import { authValidation, validateLogin, validateUser } from '../middleware/authMiddleware.js';

const authRouter = Router();



authRouter.post("/signup", validateUser, signUp);
authRouter.post("/signin", validateLogin, signIn);
authRouter.get("/users/me", authValidation, getUser);

export default authRouter;