import mongoose, { Schema, model } from 'mongoose';

const taskSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		status: {
			type: String,
			enum: ['todo', 'doing', 'done'],
		},
		userId: { type: mongoose.Types.ObjectId, ref: 'User' },
		assignTo: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		deadline: Date,
	},
	{ timestamps: true }
);
const taskModel = model('Task', taskSchema);
export default taskModel;
