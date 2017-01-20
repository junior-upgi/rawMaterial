const bodyParser = require('body-parser');
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
        // utility.logger.info('check if any existing records of the same requirement exists');
        if (resultset.count > 0) { // utility.logger.info('existing requirement exists, tally the total requirement qty');
            resultset.rows.forEach(function(result) {
                existingReqQty += result.quantity;
            });
            quantity += existingReqQty;
        }
        return shipment.table.update({ // utility.logger.info('deprecate existing records that matches the requirement');
            deprecated: moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        }, {
            where: { requestDate: requestDate, CUS_NO: CUS_NO, PRD_NO: PRD_NO, typeId: typeId, deprecated: null }
        });
    }).then(function() { // utility.logger.info('insert the new record');
        return shipment.table.create({ requestDate: requestDate, CUS_NO: CUS_NO, PRD_NO: PRD_NO, typeId: typeId, quantity: quantity });
    }).then(function() { // utility.logger.info('/data/planSchedule/add successful');
        return response.status(200).json({ success: true });
    }).catch(function(error) { // utility.logger.error(`/data/planSchedule/add route failure: ${error}`);
        return response.status(500).json({ errorMessage: `/data/planSchedule/add route failure: ${error}` });
    });
});

router.get('/data/availability', tokenValidation, function(request, response) {
    let queryString = 'SELECT DATEPART(yyyy,requestDate) AS year FROM rawMaterial.dbo.planSchedule GROUP BY DATEPART(yyyy,requestDate) ORDER BY DATEPART(yyyy,requestDate);';
    utility.executeQuery(queryString, function(recordset, error) {
        if (error) {
            utility.logger.error(`/data/availability route failure: ${error}`);
            return response.status(500).json({ errorMessage: error });
        }
        return response.status(200).json(recordset);
    });
});

module.exports = router;
