const cron = require('node-cron');
const fs = require('fs');
const moment = require('moment-timezone');
const httpRequest = require('request-promise');
const winston = require('winston');

const serverConfig = require('./serverConfig.js');
const telegramUser = require('../model/telegramUser.js');
const telegramBot = require('../model/telegramBot.js');

function currentTime() { return moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss'); }

// Create the log directory if it does not exist
if (!fs.existsSync(serverConfig.logDir)) {
    fs.mkdirSync(serverConfig.logDir);
}

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

let statusReport = cron.schedule('0 0 8,22 * * *', function() {
    logger.info(`${serverConfig.systemReference} reporting mechanism triggered`);
    let issuedDatetime = currentTime();
    let message = `${issuedDatetime} ${serverConfig.systemReference} server reporting in from ${serverConfig.serverHostname}`;
    httpRequest({
        method: 'post',
        uri: serverConfig.botAPIUrl + telegramBot.getToken('upgiITBot') + '/sendMessage',
        body: {
            chat_id: telegramUser.getUserID('蔡佳佑'),
            text: `${message}`,
            token: telegramBot.getToken('upgiITBot')
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

function alertSystemError(functionRef, message) {
    httpRequest({ // broadcast alert heading
        method: 'post',
        uri: serverConfig.botAPIUrl + telegramBot.getToken('upgiITBot') + '/sendMessage',
        body: {
            chat_id: telegramUser.getUserID('蔡佳佑'),
            text: `error encountered while executing [${serverConfig.systemReference}][${functionRef}] @ ${currentTime()}`,
            token: telegramBot.getToken('upgiITBot')
        },
        json: true
    }).then(function(response) {
        return httpRequest({ // broadcast alert body message
            method: 'post',
            uri: serverConfig.botAPIUrl + telegramBot.getToken('upgiITBot') + '/sendMessage',
            form: {
                chat_id: telegramUser.getUserID('蔡佳佑'),
                text: `error message: ${message}`,
                token: telegramBot.getToken('upgiITBot')
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
