import { Router } from "express";
import { jwtVerify, upload } from "../middlewares";
import { getMetaData, getAllShortUrlOfUser, getAllStaticsByProjectId, getShortLink, shortUrl, deleteUrl } from "../controllers";
import { editUrl, getTotalClicks } from "../controllers/url.controller";

const router = Router();



// public routes
router.route('/').get(shortUrl);


// private routes
router.use(jwtVerify)
router.route('/p').get(getAllStaticsByProjectId);
router.route('/meta-data').post(getMetaData);
router.route('/short-url').post(upload.single('imageFile'), getShortLink);
router.route('/e/:projectId').patch(upload.single('imageFile'), editUrl);
router.route('/get-all').get(getAllShortUrlOfUser)
router.route('/clicks').get(getTotalClicks)
router.route('/:projectId').delete(deleteUrl)


export default router;
