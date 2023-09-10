import mongoose from 'mongoose';

const connection = () => {
	mongoose
		.connect('mongodb://127.0.0.1:27017/trello-App')
		.then(() => console.log('DB connected...'))
		.catch((err) => console.log(`DB error ${err}`));
};

export default connection;
