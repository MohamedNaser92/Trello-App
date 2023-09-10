import { createTransport } from 'nodemailer';
import jwt from 'jsonwebtoken';

export const sendToEmail = async (email, verificationSignUpToken) => {
	const transporter = createTransport({
		service: 'gmail',
		auth: {
			user: 'servertest273000@gmail.com',
			pass: 'llgz qjca jxkw joeu',
		},
	});
	const info = await transporter.sendMail({
		from: '"Trello App 📒" <servertest273000@gmail.com>', // sender address
		to: email, // list of receivers

		subject: 'Hello ✔ 🙋🏻', // Subject line
		text: 'Hello ', // plain text body
		html: `<h1>Hello from trello application 📒 <br> <a href='http://localhost:3000/user/verify/${verificationSignUpToken}'>Please Verify Email </a></h1>`, // html body
	});
	console.log('Message sent: %s', info.messageId);
};

// export const verificationSignUpToken = async (userId) => {};
