const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment-timezone');

const tokenValidation = require('../middleware/tokenValidation.js');

const utility = require('../module/utility');

const shipment = require('../model/shipmentTable.js');

const router = express.Router();
router.use(bodyParser.json());

router.route('/data/restful/planSchedule')
    .all(tokenValidation)
    .get(function(request, response, next) {
        let queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${request.query.year} AND DATEPART(m,requestDate)=${parseInt(request.query.month) + 1} ORDER BY requestDate,CUS_NO,typeId,created,modified,deprecated;`;
        utility.performQuery(queryString)
            .then(function(recordset) {
                utility.logger.info('record retrieved and filtered');
                return response.status(200).json(recordset);
            }).catch(function(error) {
                utility.logger.error(error);
                return response.status(500).json({ errorMessage: `${error}` });
            });
    })
    .post(function(request, response, next) {
        utility.logger.info('POST /data/restful/planSchedule invoked...');
        shipment.table
            .create(request.body.fieldList)
            .then(function() {
                utility.logger.info('record inserted');
                return response.status(200).end();
            }).catch(function(error) {
                utility.logger.error(error.name);
                utility.logger.error(error.message);
                return response.status(500).json({ errorMessage: error.message });
            });
    })
    .put(function(request, response, next) {
        utility.logger.info('PUT /data/restful/planSchedule invoked...');
        shipment.table
            .update(request.body.fieldList, { where: request.body.conditionList })
            .then(function() {
                utility.logger.info('record updated');
                return response.status(200).end();
            }).catch(function(error) {
                utility.logger.error(error.name);
                utility.logger.error(error.message);
                return response.status(500).json({ errorMessage: error.message });
            });
    })
    .delete(function(request, response, next) {
        utility.logger.info('DELETE /data/restful/planSchedule invoked...');
        let currentDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        shipment.table
            .update({ deprecated: currentDatetime }, { where: request.body.condition })
            .then(function() {
                utility.logger.info('record deprecated');
                return response.status(200).end();
            }).catch(function(error) {
                utility.logger.error(error.name);
                utility.logger.error(error.message);
                return response.status(500).json({ errorMessage: error.message });
            });
    });

router.route('/data/planSchedule')
    .all(tokenValidation)
    .get(function(request, response, next) {
        let queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${request.query.year} AND DATEPART(m,requestDate)=${parseInt(request.query.month) + 1} ORDER BY requestDate,CUS_NO,typeId,created,modified,deprecated;`;
        utility.performQuery(queryString)
            .then(function(recordset) {
                return response.status(200).json(recordset);
            }).catch(function(error) {
                utility.logger.error(`/data/planSchedule route failure: ${error}`);
                return response.status(500).json({ errorMessage: `/data/planSchedule route failure: ${error}` });
            });
    })
    .post(function(request, response, next) {
        let currentDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        let requestDate = request.body.requestDate;
        let CUS_NO = request.body.CUS_NO;
        let PRD_NO = request.body.PRD_NO;
        let typeId = request.body.typeId;
        let quantity = request.body.quantity;
        let existingReqQty = 0;
        utility.logger.info('check if any existing records of the same requirement exists');
        shipment.table.findAndCountAll({
            where: { requestDate: requestDate, CUS_NO: CUS_NO, PRD_NO: PRD_NO, typeId: typeId, deprecated: null }
        }).then(function(resultset) {
            if (resultset.count > 0) {
                utility.logger.info('existing requirement exists, tally the total requirement qty');
                resultset.rows.forEach(function(result) {
                    existingReqQty += result.quantity;
                });
                quantity += existingReqQty;
            }
            utility.logger.info('deprecate any existing records that matches the requirement');
            return shipment.table.update({
                modified: currentDatetime,
                deprecated: currentDatetime
            }, {
                where: { requestDate: requestDate, CUS_NO: CUS_NO, PRD_NO: PRD_NO, typeId: typeId, deprecated: null }
            });
        }).then(function() {
            utility.logger.info('insert the new record');
            return shipment.table.create({ requestDate: requestDate, CUS_NO: CUS_NO, PRD_NO: PRD_NO, typeId: typeId, quantity: quantity });
        }).then(function() {
            utility.logger.info('/data/planSchedule/add successful');
            utility.logger.info('get a copy of refreshed planSchedule and return to client');
            let queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${new Date(requestDate).getFullYear()} AND DATEPART(m,requestDate)=${new Date(requestDate).getMonth() + 1} ORDER BY requestDate,CUS_NO,typeId,created,modified,deprecated;`;
            return utility.performQuery(queryString);
        }).then(function(recordset) {
            return response.status(200).json(recordset);
        }).catch(function(error) {
            utility.logger.error(`/data/planSchedule/add route failure: ${error}`);
            return response.status(500).json({ errorMessage: `/data/planSchedule/add route failure: ${error}` });
        });
    })
    .put(function(request, response, next) {
        let original = request.body.original;
        let updated = request.body.updated;
        let combined = {};
        utility.logger.info('deprecate the original record');
        let queryString = `UPDATE rawMaterial.dbo.shipment SET modified=GETDATE(),deprecated=GETDATE() WHERE id='${request.body.original.id}';`;
        utility.performQuery(queryString)
            .then(function() {
                utility.logger.info('incorporate updated data with the original record data');
                for (let key in original) {
                    if (key in updated) {
                        if (updated[key] === null) {
                            combined[key] = original[key];
                        } else if (updated[key] === '') {
                            combined[key] = null;
                        } else {
                            combined[key] = updated[key];
                        }
                    } else {
                        combined[key] = original[key];
                    }
                }
                delete combined.id; // remove the id field
                utility.logger.info('create a new record with updated info');
                return shipment.table.create(combined);
            }).then(function() {
                utility.logger.info('return a fresh copy of updated schedule');
                queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${new Date(request.body.original.requestDate).getFullYear()} AND DATEPART(m,requestDate)=${new Date(request.body.original.requestDate).getMonth() + 1} ORDER BY requestDate,CUS_NO,typeId,created,modified,deprecated;`;
                return utility.performQuery(queryString);
            }).then(function(recordset) {
                return response.status(200).json(recordset);
            }).catch(function(error) {
                return response.status(500).json({ errorMessage: `/data/planSchedule/update route failure: ${error}` });
            });
    })
    .delete(function(request, response, next) {
        utility.logger.info('deprecate a specific record');
        let currentDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        let year = new Date(request.body.requestDate).getFullYear();
        let month = new Date(request.body.requestDate).getMonth();
        return shipment.table.update({
            modified: currentDatetime,
            deprecated: currentDatetime
        }, {
            where: { id: request.body.id }
        }).then(function() {
            let queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE DATEPART(yyyy,requestDate)=${year} AND DATEPART(m,requestDate)=${month + 1} ORDER BY requestDate,CUS_NO,typeId,created,modified,deprecated;`;
            return utility.performQuery(queryString);
        }).then(function(recordset) {
            return response.status(200).json(recordset);
        }).catch(function(error) {
            utility.logger.error(`/data/planSchedule/delete route failure: ${error}`);
            return response.status(500).json({ errorMessage: `/data/planSchedule/delete route failure: ${error}` });
        });
    });

router.get('/data/planSchedule/availability', tokenValidation, function(request, response) {
    let queryString = 'SELECT DATEPART(yyyy,requestDate) AS year FROM rawMaterial.dbo.planSchedule GROUP BY DATEPART(yyyy,requestDate) ORDER BY DATEPART(yyyy,requestDate);';
    utility.performQuery(queryString)
        .then(function(recordset) {
            return response.status(200).json(recordset);
        }).catch(function(error) {
            utility.logger.error(`/data/planSchedule/availability route failure: ${error}`);
            return response.status(500).json({ errorMessage: `/data/planSchedule/availability route failure: ${error}` });
        });
});

router.get('/data/planSchedule/checkExistence', tokenValidation, function(request, response) {
    utility.logger.info('check if any existing records of the same requirement exists');
    let queryString = `SELECT * FROM rawMaterial.dbo.planSchedule WHERE requestDate='${request.body.requestDate}' AND CUS_NO='${request.body.CUS_NO}' AND PRD_NO='${request.body.PRD_NO}' AND typeId=${request.body.typeId} AND deprecated IS NULL;`;
    utility.performQuery(queryString)
        .then(function(recordset) {
            return response.status(200).json(recordset);
        }).catch(function(error) {
            utility.logger.error(`/data/planSchedule/checkExistence route failure: ${error}`);
            return response.status(500).json({ errorMessage: `/data/planSchedule/checkExistence route failure: ${error}` });
        });
});

module.exports = router;
