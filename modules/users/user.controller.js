import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../../DB/models/user.model.js';
import { sendToEmail } from '../../utils/sendEmail.js';

const signUp = async (req, res) => {
	try {
		let email = req.body.email;
		let emailIsExist = await userModel.findOne({ email: email });
		emailIsExist &&
			res
				.status(409)
				.json({ message: 'User already regestried, go to sign in...' });
		// emailIsExist.deleted &&
		// 	res.json({ message: 'You account is deleted Temporarily... ' });
		if (!emailIsExist) {
			let hashedPassword = bcrypt.hashSync(req.body.password, 10);

			let newUser = await userModel.create({
				...req.body,
				password: hashedPassword,
			});

			// let newUser = new userModel({
			// 	...req.body,
			// 	password: hashedPassword,
			// });
			// console.log(5);

			// await newUser.save();

			let verificationSignUpToken = jwt.sign({ id: newUser.id }, 'signUpToken');

			sendToEmail(req.body.email, verificationSignUpToken);

			res.status(201).json({ message: 'Successfully signed up', newUser });
		}
	} catch (err) {
		res.status(500).json({ message: 'Error in Sign up' });
	}
};

const verifyEmail = async (req, res) => {
	let verificationSignUpToken = req.params.verificationSignUpToken;

	let decoded = jwt.verify(verificationSignUpToken, 'signUpToken');

	try {
		let user = await userModel.findById(decoded.id);
		if (!user) {
			res.status(404).json({
				message: 'Invalid verification token.User not found or not verified.',
			});
		} else {
			user.isVerified = true;
			await user.save();

			res.status(201).json({ message: 'Verified', user });
		}
	} catch (err) {
		res.status(500).json({ message: 'An error occurred during verification' });
	}
};

const signIn = async (req, res) => {
	let email = req.body.email;

	let foundUser = await userModel.findOne({ email: email });
	if (!foundUser || !foundUser.isVerified || foundUser.deleted) {
		res.status(401).json({
			message: 'User not found, or deleted Temporarily, or not verified.',
		});
	} else {
		let matched = bcrypt.compareSync(req.body.password, foundUser.password);
		!matched && res.status(401).json({ message: 'Wrong password ' });
		if (matched) {
			let token = jwt.sign({ id: foundUser.id }, 'signInToken');
			// res.header('Authorization', 'Bearer ' + token);
			// res.setHeader('Authorization', 'Bearer ' + token);

			res
				.status(200)
				.json({ message: 'Successfully signed in, Welcome back 🙋🏻', token });
		}
	}
};

const getAllUsers = async (req, res) => {
	try {
		let allUser = await userModel.find();

		res.status(200).json({ message: 'Welcome 🙋🏻, All user: ', allUser });
	} catch (err) {
		res.status(400).json({ message: 'Error', err });
	}
};

const changePassword = async (req, res) => {
	try {
		let id = req.params.id;

		let user = await userModel.findById(id);
		let matched = bcrypt.compareSync(req.body.currentPassword, user.password);
		!matched && res.status(401).json({ message: 'Current password incorrect' });
		if (matched) {
			let hashedNewPassword = bcrypt.hashSync(req.body.newPassword, 10);
			user.password = hashedNewPassword;
			await user.save();
			res.json({ message: 'Password updated successfully ' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error occured while changing the password ', err });
	}
};

const updateUser = async (req, res) => {
	let id = req.params.id;
	try {
		let updatedUser = await userModel.findByIdAndUpdate(
			id,
			{
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				age: req.body.age,
			},
			{ new: true }
		);
		!updatedUser && res.status(404).json({ message: 'User not found' });
		res.status(200).json({ message: 'User Updated Successfully', updatedUser });
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error occured while updatig user data ', err });
	}
};

const deleteUser = async (req, res) => {
	let id = req.params.id;
	try {
		if (id !== idParams) {
			res.json({ message: 'You are not authorized to update user' });
		} else {
			let deletedUser = await userModel.findByIdAndDelete(id);
			!deletedUser && res.status(404).json({ message: 'User not found' });
			res
				.status(200)
				.json({ message: 'User deleted successfully.', deletedUser });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error occured while Deleting user data ', err });
	}
};

const softDeleteUser = async (req, res) => {
	let id = req.params.id;
	try {
		let softDeletedUser = await userModel.findById(id);
		!softDeletedUser && res.status(404).json({ message: 'User not found' });
		softDeletedUser.deleted = true;
		await softDeletedUser.save();
		res.status(200).json({
			message: 'The user has been deleted Temporarily',
			softDeletedUser,
		});
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error occured while soft deleting user data', err });
	}
};

const logout = (req, res) => {
	res.removeHeader('token');
	res.json({ message: 'Logout successful.' });
};

export {
	signUp,
	verifyEmail,
	signIn,
	getAllUsers,
	changePassword,
	updateUser,
	deleteUser,
	softDeleteUser,
	logout,
};
