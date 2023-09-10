import express from 'express';
import {
	signUp,
	verifyEmail,
	signIn,
	getAllUsers,
	changePassword,
	updateUser,
	deleteUser,
	softDeleteUser,
	logout,
} from './user.controller.js';
import validation from '../../middleware/validation.js';
import {
	signUpValidationScema,
	signInValidationShcema,
	changePasswordValidationSchema,
	updateUserValidationSchema,
} from './user.validation.js';
import {
	authUser,
	auth,
	authVerificationSignUp,
} from '../../middleware/authentication.js';

const userRoutes = express.Router();

userRoutes.post('/user/signup', validation(signUpValidationScema), signUp);

userRoutes.get('/user', getAllUsers);
userRoutes.get(
	'/user/verify/:verificationSignUpToken',
	authVerificationSignUp,
	verifyEmail
);

userRoutes.post('/signin', validation(signInValidationShcema), signIn);

userRoutes.patch(
	'/changePassword/:id',
	authUser,
	validation(changePasswordValidationSchema),
	changePassword
);

userRoutes.patch(
	'/updateUser/:id',
	authUser,
	validation(updateUserValidationSchema),
	updateUser
);

userRoutes.delete('/deleteUser/:id', authUser, deleteUser);

userRoutes.put('/softDeleteUser/:id', authUser, softDeleteUser);
userRoutes.post('/logout/:id', authUser, logout);

export default userRoutes;
