const fs = require('fs');
const moment = require('moment-timezone');
const winston = require('winston');

const serverConfig = require('./serverConfig.js');

// Create the log directory if it does not exist
if (!fs.existsSync(serverConfig.logDir)) {
    fs.mkdirSync(serverConfig.logDir);
}

function currentTime() { return moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'); }

const logger = new(winston.Logger)({
    transports: [
        // colorize the output to the console
        new(winston.transports.Console)({
            timestamp: currentTime(),
            colorize: true,
            level: 'debug'
        }),
        new(winston.transports.File)({
            filename: `${serverConfig.logDir}/results.log`,
            timestamp: currentTime(),
            level: serverConfig.development ? 'debug' : 'info'
        })
    ]
});

module.exports = {
    logger: logger
};
