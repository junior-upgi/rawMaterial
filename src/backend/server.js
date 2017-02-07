const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
// const prettyJson = require('prettyjson');

const serverConfig = require('./module/serverConfig.js');
const utility = require('./module/utility.js');

let app = express();
let main = express.Router();
app.use(`/${serverConfig.systemReference}`, main);
main.use(cors());
main.use(morgan('dev'));
main.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
main.use(bodyParser.json()); // parse application/json

// static routes
main.use('/', express.static(path.join(__dirname + '/../public')));

// available routes
main.use('/', require('./route/utility/status.js')); // serve system status

// initiate server script
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

/*
// knex template
const knex = require('knex')(serverConfig.mssqlConfig);

knex.select('*').from('rawMaterial.dbo.knownRawMaterial') // simple select
    .then((resultset) => {
        console.log(prettyJson.render(resultset)); // result for simple select
        return knex.select('*').from('rawMaterial.dbo.shipment').limit(1); // select with limit
    })
    .then((resultset) => {
        console.log(prettyJson.render(resultset)); // result for select with limit
        // select distinct with raw sql
        return knex.select(knex.raw('CONVERT(char(10),requestDate,126) AS requestDate')).from('rawMaterial.dbo.shipment').distinct();
    })
    .then((resultset) => {
        console.log(prettyJson.render(resultset)); // result for select with distinct
        // raw sql with bindings
        return knex.raw('SELECT CONVERT(char(10),requestDate,126) AS requestDate FROM rawMaterial.dbo.shipment WHERE requestDate=? OR requestDate=?;', ['2017-02-10', '2017-02-11']);
    })
    .then((resultset) => {
        console.log(prettyJson.render(resultset)); // result for raw sql with bindings
        // select distinct order by
        return knex.select(knex.raw('CONVERT(char(10),requestDate,126) AS requestDate')).from('rawMaterial.dbo.shipment').distinct().orderBy('requestDate', 'desc');
    })
    .then((resultset) => {
        console.log(JSON.stringify(resultset)); // result for select distinct order by
        // select with limit and pagination 1
        return knex
            .select(knex.raw('CONVERT(char(10),requestDate,126) AS requestDate'))
            .from('rawMaterial.dbo.shipment')
            .distinct()
            .orderBy('requestDate')
            .limit(3);
    })
    .then((resultset) => {
        console.log(JSON.stringify(resultset)); // result for select with limit and pagination 1
        // select with limit and pagination 2
        return knex
            .select(knex.raw('CONVERT(char(10),requestDate,126) AS requestDate'))
            .from('rawMaterial.dbo.shipment')
            .distinct()
            .orderBy('requestDate')
            .limit(3)
            .offset(1);
    })
    .then((resultset) => {
        console.log(JSON.stringify(resultset)); // result for select with limit and pagination 2
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        knex.destroy();
    });
*/
