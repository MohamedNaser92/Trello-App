import jwt from 'jsonwebtoken';
import userModel from '../DB/models/user.model.js';

const authUser = async (req, res, next) => {
	let { token } = req.headers;
	let id = req.params.id;
	try {
		!token && res.status(401).json({ message: 'Please provide a token' });

		let decoded = jwt.verify(token, 'signInToken');
		!decoded && res.status(401).json({ message: 'invalid token' });

		if (id !== decoded.id) {
			res.json({ message: 'You are not authorized to update user' });
		} else {
			let user = await userModel.findById(decoded.id);
			if (!user || !user.isVerified || user.deleted) {
				res.status(401).json({
					message:
						'Authentication failed, User not found, or deleted Temporarily, or not verified.',
				});
			} else {
				next();
			}
		}
	} catch (err) {
		res.status(500).json({ message: 'Error in Authentication', err });
	}
};
const auth = async (req, res, next) => {
	let { token } = req.headers;
	try {
		!token && res.status(401).json({ message: 'Please provide a token' });

		let decoded = jwt.verify(token, 'signInToken');

		!decoded && res.status(401).json({ message: 'invalid token' });

		let user = await userModel.findById(decoded.id);
		if (!user || !user.isVerified || user.deleted) {
			res.status(401).json({
				message:
					'Authentication failed, User not found, or deleted Temporarily, or not verified.',
			});
		} else {
			req.user = user;
			next();
		}
	} catch (err) {
		res.status(500).json({ message: 'Error in Authentication', err });
	}
};
const authVerificationSignUp = (req, res, next) => {
	let verificationSignUpToken = req.params.verificationSignUpToken;
	!verificationSignUpToken &&
		res.status(401).json({ message: 'Please provide a token from Email' });

	if (verificationSignUpToken) {
		let decoded = jwt.verify(verificationSignUpToken, 'signUpToken');

		if (decoded) {
			next();
		} else {
			res.status(401).json({ message: 'invalid token' });
		}
	}
};

export { authUser, auth, authVerificationSignUp };
