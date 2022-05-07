const { green, blue, yellow, red } = require('chalk');
const dayjs = require('dayjs');

const timestamp = () => dayjs(Date.now()).format('DD.MM.YYYY HH:mm:ss');

module.exports = {
	ready: (content) => {
		console.log(green(`(${timestamp()}) [READY]: ${content}`));
	},
	info: (content) => {
		console.log(blue(`(${timestamp()}) [INFO]: ${content}`));
	},
	warn: (content) => {
		console.log(yellow(`(${timestamp()}) [WARN]: ${content}`));
	},
	error: (content) => {
		console.log(red(`(${timestamp()}) [ERROR]: ${content}`));
	}
}