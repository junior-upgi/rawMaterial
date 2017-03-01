const cron = require('node-cron');
const fs = require('fs');
const moment = require('moment-timezone');
const os = require('os');
const httpRequest = require('request-promise');
const winston = require('winston');

const serverConfig = require('./serverConfig.js');
const telegram = require('../model/telegram.js');

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
        uri: serverConfig.botAPIUrl + telegram.getBotToken('upgiITBot') + '/sendMessage',
        body: {
            chat_id: 241630569,
            text: `${message}`,
            token: telegram.getBotToken('upgiITBot')
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
        uri: serverConfig.botAPIUrl + telegram.getBotToken('upgiITBot') + '/sendMessage',
        body: {
            chat_id: 241630569,
            text: `error encountered while executing [${serverConfig.systemReference}][${functionRef}] @ ${currentDatetimeString()}`,
            token: telegram.getBotToken('upgiITBot')
        },
        json: true
    }).then(function(response) {
        return httpRequest({ // broadcast alert body message
            method: 'post',
            uri: serverConfig.botAPIUrl + telegram.getBotToken('upgiITBot') + '/sendMessage',
            form: {
                chat_id: 241630569,
                text: `error message: ${message}`,
                token: telegram.getBotToken('upgiITBot')
            }
        });
    }).then(function(response) {
        return logger.info(`${serverConfig.systemReference} alert sent`);
    }).catch(function(error) {
        return logger.error(`${serverConfig.systemReference} failure: ${error}`);
    });
}

function sendMobileMessage(recipientIDList, messageList, botName) {
    recipientIDList.forEach(function(recipientID) {
        messageList.forEach(function(message) {
            httpRequest({
                method: 'post',
                uri: serverConfig.botAPIUrl + telegram.getBotToken(botName) + '/sendMessage',
                form: {
                    chat_id: recipientID,
                    text: message,
                    token: telegram.getBotToken(botName)
                }
            }).then(function(response) {
                logger.info('message sent');
            }).catch(function(error) {
                logger.error('messaging failure');
            });
        });
    });
    return;
}

function endpointErrorHandler(method, originalUrl, errorMessage) {
    let errorString = `${method} ${originalUrl} route failure: ${errorMessage}`;
    logger.error(errorString);
    logger.info(alertSystemError(serverConfig.systemReference, errorString));
    return {
        errorMessage: errorString
    };
}

// date and time utility
function currentDatetimeString() {
    return moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
}

function firstOfMonthString(year, month) {
    return moment(new Date(year, month - 1, 1), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
}

function todayDateString() {
    return moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
}

module.exports = {
    alertSystemError: alertSystemError,
    endpointErrorHandler: endpointErrorHandler,
    logger: logger,
    sendMobileMessage: sendMobileMessage,
    statusReport: statusReport,
    // date and time utility
    currentDatetimeString: currentDatetimeString,
    firstOfMonthString: firstOfMonthString,
    todayDateString: todayDateString
};
