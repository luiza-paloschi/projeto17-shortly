import { Router } from 'express'
import { getUrlById, shortenUrl } from '../controllers/urls.js';
import { authValidation } from '../middleware/authMiddleware.js';


const urlsRouter = Router();

urlsRouter.post("/urls/shorten", authValidation, shortenUrl);
urlsRouter.get("/urls/:id", getUrlById);

export default urlsRouter;