import { Router } from "express";
import { jwtVerify } from "../middlewares";
import { getMetaData } from "../controllers";


const router = Router();


router.route('/meta-data').post(jwtVerify, getMetaData);


export default router;
