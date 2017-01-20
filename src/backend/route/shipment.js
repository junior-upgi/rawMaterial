const bodyParser = require('body-parser');
const clone = require('clone');
const express = require('express');
const moment = require('moment-timezone');

const tokenValidation = require('../middleware/tokenValidation.js');

const utility = require('../module/utility');

const shipment = require('../model/shipmentTable.js');

const router = express.Router();
router.use(bodyParser.json());

router.post('/data/planSchedule', tokenValidation, function(request, response) {
    let queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${request.body.year} AND DATEPART(m,requestDate)=${request.body.month + 1} ORDER BY requestDate,CUS_NO,typeId,created,modified,deprecated;`;
    utility.executeQuery(queryString, function(recordset, error) {
        if (error) {
            utility.logger.error(`/data/planSchedule route failure: ${error}`);
            return response.status(500).json({ errorMessage: error });
        }
        return response.status(200).json(recordset);
    });
});

router.delete('/data/planSchedule/delete', tokenValidation, function(request, response) {
    utility.logger.info('deprecate a specific record');
    let year = new Date(request.body.requestDate).getFullYear();
    let month = new Date(request.body.requestDate).getMonth();
    return shipment.table.update({
        deprecated: moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    }, {
        where: { id: request.body.id }
    }).then(function() {
        let queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${year} AND DATEPART(m,requestDate)=${month + 1} ORDER BY requestDate,CUS_NO,typeId,created,modified,deprecated;`;
        utility.executeQuery(queryString, function(recordset, error) {
            if (error) {
                utility.logger.error(`/data/planSchedule/delete route failure: ${error}`);
                return response.status(500).json({ errorMessage: error });
            }
            return response.status(200).json(recordset);
        });
    }).catch(function(error) {
        utility.logger.error(`/data/planSchedule/delete route failure: ${error}`);
        return response.status(500).json({ errorMessage: `/data/planSchedule/delete route failure: ${error}` });
    });
});

router.get('/data/dataAvailability', tokenValidation, function(request, response) {
    let queryString = 'SELECT DATEPART(yyyy,requestDate) AS year FROM rawMaterial.dbo.planSchedule GROUP BY DATEPART(yyyy,requestDate) ORDER BY DATEPART(yyyy,requestDate);';
    utility.performQuery(queryString)
        .then(function(recordset) {
            return response.status(200).json(recordset);
        }).catch(function(error) {
            utility.logger.error(`/data/dataAvailability route failure: ${error}`);
            return response.status(500).json({ errorMessage: `/data/dataAvailability route failure: ${error}` });
        });
});

router.put('/data/planSchedule/update', tokenValidation, function(request, response) {
    let requestDate = request.body.requestDate;
    let id = request.body.id;
    let quantity = request.body.quantity;
    let note = request.body.note;
    let arrivalDate = request.body.arrivalDate;
    utility.logger.info('get a copy of the original record');
    let queryString = `SELECT * FROM rawMaterial.dbo.shipment WHERE id='${id}'`;
    let originalRecord = {};
    utility.performQuery(queryString)
        .then(function(recordset) {
            originalRecord = clone(recordset[0]);
            utility.logger.info('deprecate the original record');
            queryString = `UPDATE rawMaterial.dbo.shipment SET deprecated=GETDATE() WHERE id='${id}';`;
            return utility.performQuery(queryString);
        }).then(function() {
            utility.logger.info('create a new record with updated info');
            queryString = `INSERT INTO rawMaterial.dbo.shipment (requestDate,CUS_NO,PRD_NO,typeId,quantity,note,arrivalDate) VALUES ('${requestDate}','${originalRecord.CUS_NO}','${originalRecord.PRD_NO}',${originalRecord.typeId},${quantity},${note},${arrivalDate});`;
            return utility.performQuery(queryString);
        }).then(function() {
            utility.logger.info('return a fresh copy of updated schedule');
            queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${new Date(requestDate).getFullYear()} AND DATEPART(m,requestDate)=${new Date(requestDate).getMonth() + 1} ORDER BY requestDate,CUS_NO,typeId,created,modified,deprecated;`;
            return utility.performQuery(queryString);
        }).then(function(recordset) {
            return response.status(200).json(recordset);
        }).catch(function(error) {
            return response.status(500).json({ errorMessage: `/data/planSchedule/update route failure: ${error}` });
        });
});

router.post('/data/planSchedule/add', tokenValidation, function(request, response) {
    let requestDate = request.body.requestDate;
    let CUS_NO = request.body.CUS_NO;
    let PRD_NO = request.body.PRD_NO;
    let typeId = request.body.typeId;
    let quantity = request.body.quantity;
    let existingReqQty = 0;
    shipment.table.findAndCountAll({
        where: { requestDate: requestDate, CUS_NO: CUS_NO, PRD_NO: PRD_NO, typeId: typeId, deprecated: null }
    }).then(function(resultset) {
        if (resultset.count > 0) { // utility.logger.info('check if any existing records of the same requirement exists');
            // utility.logger.info('existing requirement exists, tally the total requirement qty');
            resultset.rows.forEach(function(result) {
                existingReqQty += result.quantity;
            });
            quantity += existingReqQty;
        }
        return shipment.table.update({ // utility.logger.info('deprecate any existing records that matches the requirement');
            deprecated: moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: { requestDate: requestDate, CUS_NO: CUS_NO, PRD_NO: PRD_NO, typeId: typeId, deprecated: null }
        });
    }).then(function() { // utility.logger.info('insert the new record');
        return shipment.table.create({ requestDate: requestDate, CUS_NO: CUS_NO, PRD_NO: PRD_NO, typeId: typeId, quantity: quantity });
    }).then(function() { // utility.logger.info('/data/planSchedule/add successful');
        // utility.logger.info('get a copy of refreshed planSchedule and return to client');
        let queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${new Date(requestDate).getFullYear()} AND DATEPART(m,requestDate)=${new Date(requestDate).getMonth() + 1} ORDER BY requestDate,CUS_NO,typeId,created,modified,deprecated;`;
        utility.executeQuery(queryString, function(recordset, error) {
            if (error) {
                utility.logger.error(`/data/planSchedule route failure: ${error}`);
                return response.status(500).json({ errorMessage: error });
            }
            return response.status(200).json(recordset);
        });
    }).catch(function(error) { // utility.logger.error(`/data/planSchedule/add route failure: ${error}`);
        return response.status(500).json({ errorMessage: `/data/planSchedule/add route failure: ${error}` });
    });
});

module.exports = router;
