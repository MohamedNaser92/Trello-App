import { Schema, model } from 'mongoose';

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},

		userName: {
			type: String,
			required: true,
			minLength: [3, 'min char is 3'],
			maxLength: [15, 'max char is 3'],
		},

		password: {
			type: String,
			required: true,
		},
		firstName: String,
		lastName: String,
		age: Number,
		gender: String,
		phone: String,
		deleted: { type: Boolean, default: false },
		isVerified: { type: Boolean, default: false },
		role: {
			type: String,
			enum: ['admin', 'user'],
			default: 'user',
		},
	},
	{ timestamps: true }
);
const userModel = model('User', userSchema);
export default userModel;
