const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');

const serverConfig = require('./module/serverConfig.js');
const utility = require('./module/utility.js');

let app = express();
let main = express.Router();
app.use(`/${serverConfig.systemReference}`, main);
main.use(cors());
main.use(morgan('dev'));
main.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
main.use(bodyParser.json()); // parse application/json
main.use(favicon(path.join(__dirname + '/upgiLogo.png'))); // middleware to serve favicon
main.use('/', express.static(path.join(__dirname + '/../public'))); // serve static files
main.use('/bower_components', express.static(path.join(__dirname + '/../bower_components'))); // serve static files

main.use('/', require('./route/status.js')); // serve system status
main.use('/', require('./route/login.js')); // handles login requests
main.use('/', require('./route/validate.js')); // handles page entry jwt validation
main.use('/', require('./route/rawMaterial.js')); // serves raw material list
main.use('/', require('./route/shipment.js')); // route to serve shipment related information
main.use('/', require('./route/monthlyMemo.js')); // server monthlyMemo data

app.listen(serverConfig.serverPort, function(error) { // start backend server
    if (error) {
        utility.logger.error(`error starting ${serverConfig.systemReference} server: ${error}`);
    } else {
        utility.logger.info(`${serverConfig.systemReference} server in operation... (${serverConfig.serverUrl})`);
        utility.statusReport.start(); // start the server status reporting function
    }
});
