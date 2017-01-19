const bodyParser = require('body-parser');
const express = require('express');

const tokenValidation = require('../middleware/tokenValidation.js');

const utility = require('../module/utility');

const router = express.Router();
router.use(bodyParser.json());

router.post('/data/planSchedule', tokenValidation, function(request, response) {
    let queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${request.body.year} AND DATEPART(m,requestDate)=${request.body.month + 1} ORDER BY requestDate,CUS_NO,typeId;`;
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
    utility.logger.info('check if any existing records of the same requirement exists');
    let queryString = `SELECT SUM(quantity) AS existingReqQty FROM rawMaterial.dbo.planSchedule WHERE requestDate='${requestDate}' AND CUS_NO='${CUS_NO}' AND PRD_NO='${PRD_NO}' AND typeId='${typeId}' AND deprecated IS NULL;`;
    utility.executeQuery(queryString, function(recordset, error) {
        if (error) {
            utility.logger.error(`/data/planSchedule/add route failure: ${error}`);
            return response.status(500).json({ errorMessage: error });
        }
        let existingReqQty = recordset[0].existingReqQty;
        if (existingReqQty === null) {
            utility.logger.info('no prior requirement exists, insert new record');
            queryString = `INSERT INTO rawMaterial.dbo.shipment (requestDate,CUS_NO,PRD_NO,typeId,quantity) VALUES ('${requestDate}','${CUS_NO}','${PRD_NO}',${typeId},${quantity});`;
            utility.executeQuery(queryString, function(recordset, error) {
                if (error) {
                    utility.logger.error(`/data/planSchedule/add route failure: ${error}`);
                    return response.status(500).json({ errorMessage: error });
                }
                return response.status(200).json({ success: true });
            });
        } else {
            utility.logger.info('existing requirement exists, deprecate *all* previous records');
            queryString = `UPDATE rawMaterial.dbo.shipment SET deprecated=GETDATE() WHERE requestDate='${requestDate}' AND CUS_NO='${CUS_NO}' AND PRD_NO='${PRD_NO}' AND typeId=${typeId} AND deprecated IS NULL;`;
            utility.executeQuery(queryString, function(recordset, error) {
                if (error) {
                    utility.logger.error(`/data/planSchedule/add route failure: ${error}`);
                    return response.status(500).json({ errorMessage: error });
                }
                utility.logger.info('write a single record to the previous sum *plus* the new requirement qty');
                queryString = `INSERT INTO rawMaterial.dbo.shipment (requestDate,CUS_NO,PRD_NO,typeId,quantity) VALUES ('${requestDate}','${CUS_NO}','${PRD_NO}',${typeId},${quantity + existingReqQty});`;
                utility.executeQuery(queryString, function(recordset, error) {
                    if (error) {
                        utility.logger.error(`/data/planSchedule/add route failure: ${error}`);
                        return response.status(500).json({ errorMessage: error });
                    }
                    return response.status(200).json({ success: true });
                });
            });
        }
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
