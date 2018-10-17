import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import config from './config.json';
import messagesLog from '../messagesLog.json';
import { writeFile } from 'fs';

// const router = express.Router();
let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

let messages = messagesLog;

app.post('/', (req, res) => {
	console.log('⚡', ...req.body);
	messages = [...messages, ...req.body];
	writeFile('messagesLog.json', JSON.stringify(messages, null, 4), (err) => {
		if (err) throw err;
		console.log('Success appending!');
	})
	res.send('ОК');
})

app.get('/', (req, res) => {
	res.send(messages);
})

app.server.listen(process.env.PORT || config.port, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
