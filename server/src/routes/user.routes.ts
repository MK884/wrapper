import { Router } from 'express';
import { login, register, logout, refreshAccessToken, updateUser, updateAvatar, deleteUser } from '../controllers';
import { jwtVerify, upload } from '../middlewares';

const router = Router();

router.route('/register').post(upload.single('avatar'), register);
router.route('/login').post(login);
router.route('/refresh').get(refreshAccessToken);

// protected routes
router.route('/logout').get(jwtVerify, logout);
router
    .route('/update-avatar')
    .patch(jwtVerify, upload.single('avatar'), updateAvatar);

router.route('/update-user').patch(jwtVerify, updateUser);
router.route('/delete').delete(jwtVerify, deleteUser)

export default router;
