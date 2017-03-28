import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
// const prettyJson = require('prettyjson');

import serverConfig from './serverConfig.js';
import utility from './utility.js';
import emailShipmentSchedule from './module/scheduledTask/emailShipmentSchedule.js';

const app = express();
const main = express.Router();
app.use(`/${serverConfig.systemReference}`, main);
main.use(cors());
main.use(morgan('dev'));
main.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
main.use(bodyParser.json()); // parse application/json

main.use('/', express.static(path.join(__dirname, '/../public'))); // frontend client server route
main.use('/bower_components', express.static(path.join(__dirname, '/../bower_components'))); // serve bower packages

if (process.env.NODE_ENV === 'development') {
    main.use('/lintingReport', express.static(path.join(__dirname, '/../temp/lintingReport'))); // Eslint html reporter results
    utility.logger.info('running in development mode');
}

// utility routes
main.use('/', require('./route/utility/login.js'));
main.use('/', require('./route/utility/status.js'));
// data routes
main.use('/', require('./route/data/purchaseOrder.js'));
main.use('/', require('./route/data/rawMaterial.js'));
main.use('/', require('./route/data/shipment.js'));
main.use('/', require('./route/data/supplier.js'));
main.use('/', require('./route/data/vacationException.js'));

// initiate server script
if (!module.parent) {
    app.listen(serverConfig.serverPort, (error) => { // start backend server
        if (error) {
            utility.logger.error(`error starting ${serverConfig.systemReference} server: ${error}`);
        } else {
            utility.logger.info(`${serverConfig.systemReference} server in operation... (${serverConfig.serverUrl})`);
            utility.statusReport.start(); // start the server status reporting function
            emailShipmentSchedule.start();
        }
    });
}
