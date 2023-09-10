import express from 'express';
import {
	addTask,
	updateTask,
	deleteTask,
	getAllTasksWithUserData,
	getallTasksNotDoneAfterDeadline,
} from './task.controller.js';
import { auth } from '../../middleware/authentication.js';

const taskRoutes = express.Router();

taskRoutes.post('/addTask', auth, addTask);
taskRoutes.post('/updateTask/:id', auth, updateTask);
taskRoutes.delete('/deleteTask/:id', auth, deleteTask);
taskRoutes.get('/getAllTasksWithUsersData', auth, getAllTasksWithUserData);
taskRoutes.get('/getaDelayedTasks', auth, getallTasksNotDoneAfterDeadline);

export default taskRoutes;
