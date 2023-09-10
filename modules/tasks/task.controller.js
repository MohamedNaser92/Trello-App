import taskModel from '../../DB/models/task.model.js';
import userModel from '../../DB/models/user.model.js';

const addTask = async (req, res) => {
	let { title, description, assignTo, deadline } = req.body;
	let id = req.user.id;
	let role = req.user.role;

	try {
		if (role !== 'admin') {
			res.status(403).json({ message: "You don't have permission " });
		} else {
			let addedTask = await taskModel.insertMany({
				title,
				description,
				status: 'todo',
				userId: id,
				assignTo,
				deadline,
			});

			let assignedTo = await taskModel.findOne({ assignTo: assignTo });

			let assignedToUser = await userModel.findById(assignedTo.assignTo);
			if (
				assignedToUser &&
				assignedToUser.isVerified &&
				!assignedToUser.deleted
			) {
				res.status(201).json({ message: 'Task Added successfully', addedTask });
			} else {
				let assignedTo = await taskModel.findByIdAndDelete({
					assignTo: assignTo,
				});
				res.status(403).json({ message: 'User assigned to task not found' });
			}
		}
	} catch (err) {
		res.status(500).json({ message: 'Error occuring while Adding task', err });
	}
};

const updateTask = async (req, res) => {
	let user = req.user.id;
	let role = req.user.role;

	let taskID = req.params.id;

	try {
		role !== 'admin' &&
			res.status(403).json({ message: "You don't have permission " });
		let taskAutherized = await taskModel.findOne({
			_id: taskID,
			userId: user,
		});
		console.log(taskAutherized);

		if (taskAutherized) {
			let updatedTask = await taskModel.findByIdAndUpdate(
				taskID,
				{
					title: req.body.title,
					description: req.body.description,
					assignTo: req.body.assignTo,
					status: req.body.status,
					deadline: req.body.deadline,
				},
				{ new: true }
			);
			res
				.status(200)
				.json({ message: 'Task Updated Successfully', updatedTask });
		} else {
			res
				.status(404)
				.json({ message: 'You are not authorized to update task  ' });
		}
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error occuring while updating task', err });
	}
};

const deleteTask = async (req, res) => {
	let user = req.user.id;
	let role = req.user.role;
	let taskID = req.params.id;

	try {
		role !== 'admin' &&
			res.status(403).json({ message: "You don't have permission " });
		let taskAutherized = await taskModel.findOne({
			_id: taskID,
			userId: user,
		});
		console.log(taskAutherized);

		if (taskAutherized) {
			let deletedTask = await taskModel.findByIdAndDelete(taskID);
			console.log(deletedTask);
			res
				.status(200)
				.json({ message: 'Task deleted successfully.', deletedTask });
		} else {
			res.json({ message: 'You are not authorized to Delete task ' });
		}

		// !deletedTask && res.status(404).json({ message: 'Task not found' });
	} catch (err) {
		res
			.status(500)
			.json({ message: 'Error occuring while deleting task', err });
	}
};

const getAllTasksWithUserData = async (req, res) => {
	try {
		// user = await userModel.findById(userId);

		let getAllTasksWithUsersData = await taskModel
			.find()
			.populate('userId', 'userName email role');
		console.log(getAllTasksWithUsersData);
		res.status(200).json({ message: 'All tasks', getAllTasksWithUsersData });
	} catch (err) {
		res.status(500).json({ message: 'Error while getting tasks', err });
	}
};

const getallTasksNotDoneAfterDeadline = async (req, res) => {
	let user = req.user.id;
	let role = req.user.role;
	console.log(role);

	try {
		role !== 'admin' &&
			res.status(403).json({ message: "You don't have permission " });
		let query = req.user.role === 'admin' ? {} : { user };
		console.log(query);
		let tasksDelayed = await taskModel.find({
			...query,
			status: { $ne: 'done' },
			deadline: { $lt: new Date() },
		});
		res.status(200).json({ message: 'Delayed tasks:', tasksDelayed });
	} catch (err) {
		res.status(500).json({ message: 'Error while getting tasks' });
	}
};

export {
	addTask,
	updateTask,
	deleteTask,
	getAllTasksWithUserData,
	getallTasksNotDoneAfterDeadline,
};
