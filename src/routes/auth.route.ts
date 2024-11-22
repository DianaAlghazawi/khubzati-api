import { Router } from 'express';
import { signup, verify, completeSignup, login } from '../controllers/auth.controller';
import { uploadFile } from '../middlewares/upload-file.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/verify', verify);
router.post(
  '/complete-signup',
  uploadFile([
    { name: 'profileImage', maxCount: 1 },
    { name: 'documentFile', maxCount: 1 },
  ]),
  completeSignup
);

export default router;
