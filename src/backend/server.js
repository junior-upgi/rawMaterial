const express = require('express');
const path = require('path');

const serverConfig = require('./module/serverConfig.js');
const utility = require('./module/utility.js');

let app = express();
let main = express.Router();
app.use(`/${serverConfig.systemReference}`, main);
main.use('/', express.static(path.join(__dirname + '/../public'))); // serve static files

if (!module.parent) {
    app.listen(serverConfig.serverPort, (error) => { // start backend server
        if (error) {
            utility.logger.error(`error starting ${serverConfig.systemReference} server: ${error}`);
        } else {
            utility.logger.info(`${serverConfig.systemReference} server in operation... (${serverConfig.serverUrl})`);
            utility.statusReport.start(); // start the server status reporting function
        }
    });
}
