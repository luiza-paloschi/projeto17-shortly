import { Router } from 'express'
import { deleteUrl, getUrlById, getUrlByShort, shortenUrl } from '../controllers/urls.js';
import { authValidation } from '../middleware/authMiddleware.js';


const urlsRouter = Router();

urlsRouter.post("/urls/shorten", authValidation, shortenUrl);
urlsRouter.get("/urls/:id", getUrlById);
urlsRouter.get("/urls/open/:shortUrl", getUrlByShort);
urlsRouter.delete("/urls/:id", authValidation, deleteUrl);

export default urlsRouter;