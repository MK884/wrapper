import { Router } from "express";
import { jwtVerify, upload } from "../middlewares";
import { getMetaData } from "../controllers";
import { getAllShortUrlOfUser, getShortLink, shortUrl } from "../controllers/url.controller";

const router = Router();



// public routes
router.route('/').get(shortUrl);


// private routes
router.use(jwtVerify)
router.route('/meta-data').post(getMetaData);
router.route('/short-url').post(upload.single('imageFile'), getShortLink);
router.route('/get-all').get(getAllShortUrlOfUser)


export default router;
