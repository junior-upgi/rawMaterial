const cron = require('node-cron');
const fs = require('fs');
const moment = require('moment-timezone');
const os = require('os');
const httpRequest = require('request-promise');
const winston = require('winston');

const serverConfig = require('./serverConfig.js');
const telegram = require('../model/telegram.js');

function currentDatetimeString() { return moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'); }

// logging utility
if (!fs.existsSync(serverConfig.logDir)) { fs.mkdirSync(serverConfig.logDir); } // Create the log directory if it does not exist
const logger = new(winston.Logger)({
    transports: [
        // colorize the output to the console
        new(winston.transports.Console)({
            timestamp: currentDatetimeString(),
            colorize: true,
            level: 'debug'
        }),
        new(winston.transports.File)({
            filename: `${serverConfig.logDir}/results.log`,
            timestamp: currentDatetimeString(),
            level: serverConfig.development ? 'debug' : 'info'
        })
    ]
});

// status report utility
let statusReport = cron.schedule('0 0 8,22 * * *', function() {
    logger.info(`${serverConfig.systemReference} reporting mechanism triggered`);
    let issuedDatetime = currentDatetimeString();
    let message = `${issuedDatetime} ${serverConfig.systemReference} server reporting in from ${os.hostname()}`;
    httpRequest({
        method: 'post',
        uri: serverConfig.botAPIUrl + telegram.getToken('upgiITBot') + '/sendMessage',
        body: {
            chat_id: telegram.getUserID('蔡佳佑'),
            text: `${message}`,
            token: telegram.getToken('upgiITBot')
        },
        json: true
    }).then(function(response) {
        logger.verbose(`${message}`);
        return logger.info(`${serverConfig.systemReference} reporting mechanism completed`);
    }).catch(function(error) {
        alertSystemError('statusReport', error);
        return logger.error(`${serverConfig.systemReference} reporting mechanism failure ${error}`);
    });
}, false);

// telegram messaging utility
function alertSystemError(functionRef, message) {
    httpRequest({ // broadcast alert heading
        method: 'post',
        uri: serverConfig.botAPIUrl + telegram.getToken('upgiITBot') + '/sendMessage',
        body: {
            chat_id: telegram.getUserID('蔡佳佑'),
            text: `error encountered while executing [${serverConfig.systemReference}][${functionRef}] @ ${currentDatetimeString()}`,
            token: telegram.getToken('upgiITBot')
        },
        json: true
    }).then(function(response) {
        return httpRequest({ // broadcast alert body message
            method: 'post',
            uri: serverConfig.botAPIUrl + telegram.getToken('upgiITBot') + '/sendMessage',
            form: {
                chat_id: telegram.getUserID('蔡佳佑'),
                text: `error message: ${message}`,
                token: telegram.getToken('upgiITBot')
            }
        });
    }).then(function(response) {
        return logger.info(`${serverConfig.systemReference} ${functionRef} alert sent`);
    }).catch(function(error) {
        return logger.error(`${serverConfig.systemReference} ${functionRef} failure: ${error}`);
    });
}

module.exports = {
    alertSystemError: alertSystemError,
    logger: logger,
    statusReport: statusReport
};
