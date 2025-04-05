import express from 'express';
import { Router } from 'express';
import { registerUser , verifyUser,loginUser,getMe,logoutUser,resetPassword,forgotPassword  } from '../controllers/user.controller.js';
import isLoggedIn from '../middlewarea/auth.middleware.js';

const router =new Router();
router.post('/register', registerUser); // Public
router.get('/verify/:token', verifyUser); // Public
router.post('/login', loginUser); // Public
router.get('/me', isLoggedIn, getMe); // ✅ Authenticated route
router.post('/logout', isLoggedIn, logoutUser); // ✅ Authenticated route
router.post('/reset-password', resetPassword); // Public
router.post('/forgot-password', forgotPassword); // Public

export default router;