import Joi from 'joi';

const signUpValidationScema = Joi.object({
	userName: Joi.string().alphanum().min(3).max(15).required(),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ['com', 'net'] },
	}),
	password: Joi.string().pattern(/^[A-Z][a-z0-9]{5,10}$/),
	age: Joi.number().min(12),
	phone: Joi.string(),
	role: Joi.string(),
});

const signInValidationShcema = Joi.object({
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ['com', 'net'] },
	}),
	password: Joi.string().pattern(/^[A-Z][a-z0-9]{5,10}$/),
});

const changePasswordValidationSchema = Joi.object({
	currentPassword: Joi.string().pattern(/^[A-Z][a-z0-9]{5,10}$/),
	newPassword: Joi.string().pattern(/^[A-Z][a-z0-9]{5,10}$/),
});

const updateUserValidationSchema = Joi.object({
	firstName: Joi.string().min(3),
	lastName: Joi.string().min(3),
	age: Joi.number().min(12),
});

export {
	signUpValidationScema,
	signInValidationShcema,
	changePasswordValidationSchema,
	updateUserValidationSchema,
};
