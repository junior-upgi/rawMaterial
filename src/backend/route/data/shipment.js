const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment-timezone');
const Treeize = require('treeize');
// const uuidV4 = require('uuid/v4');
const serverConfig = require('../../serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../utility.js');

const router = express.Router();
router.use(bodyParser.json());

router.get('/data/shipment/newRequestSummary', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.newRequestSummary')
        .orderBy('workingYear')
        .orderBy('workingMonth')
        .orderBy('CUS_NO')
        .debug(false)
        .then((resultset) => {
            return response.status(200).json({ newRequestSummary: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `新增預約概況資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

router.route('/data/shipment')
    .all(tokenValidation)
    .get(function(request, response, next) {
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex.select('*').from('rawMaterial.dbo.shipmentSchedule')
            .orderBy('PRD_NO').orderBy('CUS_NO').orderBy('workingDate').debug(false)
            .then((resultset) => {
                let shipmentSchedule = new Treeize();
                shipmentSchedule.setOptions({
                    input: {
                        detectCollection: false,
                        uniformRows: true
                    },
                    output: {
                        prune: false,
                        objectOverwrite: false
                    }
                });
                shipmentSchedule.grow(resultset);
                return response.status(200).json({ shipmentSchedule: shipmentSchedule.getData() });
            })
            .catch((error) => {
                return response.status(500).json(
                    utility.endpointErrorHandler(
                        request.method,
                        request.originalUrl,
                        `原料進貨預約相關資料讀取發生錯誤: ${error}`)
                );
            })
            .finally(() => {
                knex.destroy();
            });
    })
    .post((request, response, next) => {
        let responseObject = {
            shipmentSchedule: null,
            newRequestSummary: null,
            activePOList: null,
            pOContentSummary: null
        };
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex.transaction((trx) => {
            let requestPromiseList = [];
            for (let index = 0; index < request.body.shipmentCount; index++) {
                requestPromiseList.push(
                    trx.insert({
                        requestDate: request.body.requestDate,
                        CUS_NO: request.body.CUS_NO,
                        PRD_NO: request.body.PRD_NO,
                        typeId: request.body.typeId,
                        requestWeight: request.body.qtyPerShipment
                    }).into('rawMaterial.dbo.shipment').debug(false)
                );
            }
            return Promise.all(requestPromiseList)
                .then(() => {
                    // get a set of fresh shipment data
                    return trx.select('*').from('rawMaterial.dbo.shipmentSchedule')
                        .orderBy('PRD_NO').orderBy('CUS_NO').orderBy('workingDate').debug(false);
                }).then((resultset) => {
                    let shipmentSchedule = new Treeize();
                    shipmentSchedule.setOptions({
                        input: {
                            detectCollection: false,
                            uniformRows: true
                        },
                        output: {
                            prune: false,
                            objectOverwrite: false
                        }
                    });
                    shipmentSchedule.grow(resultset);
                    responseObject.shipmentSchedule = shipmentSchedule.getData();
                    // get a set of fresh newRequestSummary data
                    return trx.select('*').from('rawMaterial.dbo.newRequestSummary')
                        .orderBy('workingYear').orderBy('workingMonth').orderBy('CUS_NO').debug(false);
                }).then((resultset) => {
                    responseObject.newRequestSummary = resultset;
                    // get a set of fresh purchaseOrder data
                    return trx('rawMaterial.dbo.ActivePurchaseOrder').select('*')
                        .orderBy('CUS_NO').debug(false);
                }).then((resultset) => {
                    // process active purchase order data
                    let pOList = new Treeize();
                    pOList.setOptions({
                        input: {
                            detectCollection: false,
                            uniformRows: true
                        },
                        output: {
                            prune: false,
                            objectOverwrite: false
                        }
                    });
                    pOList.grow(resultset);
                    let tempList = pOList.getData();
                    tempList.forEach((purchaseOrder, index, array) => {
                        array[index].supplier = purchaseOrder.suppliers[0];
                        delete array[index].suppliers;
                    });
                    responseObject.activePOList = tempList;
                    // get a set of fresh contentSummary data
                    return trx('rawMaterial.dbo.pOContentSummary').select('*').debug(false);
                });
        }).then((resultset) => {
            responseObject.pOContentSummary = resultset;
            return response.status(200).json(responseObject);
        }).catch((error) => {
            return utility.endpointErrorHandler(
                request.method,
                request.originalUrl,
                `新增原料進貨預約作業發生錯誤: ${error}`);
        }).finally(() => {
            knex.destroy();
        });
    })
    .delete((request, response, next) => {
        let responseObject = {
            shipmentSchedule: null,
            newRequestSummary: null,
            activePOList: null,
            pOContentSummary: null
        };
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex.transaction((trx) => {
            let requestPromiseList = [];
            for (let index = 0; index < request.body.targetList.length; index++) {
                requestPromiseList.push(
                    trx('rawMaterial.dbo.shipment')
                        .update({ deprecated: moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss') })
                        .where({ id: request.body.targetList[index] })
                        .debug(false)
                );
            }
            return Promise.all(requestPromiseList)
                .then(() => {
                    // get a set of fresh shipment data
                    return trx.select('*').from('rawMaterial.dbo.shipmentSchedule')
                        .orderBy('PRD_NO').orderBy('CUS_NO').orderBy('workingDate').debug(false);
                }).then((resultset) => {
                    let shipmentSchedule = new Treeize();
                    shipmentSchedule.setOptions({
                        input: {
                            detectCollection: false,
                            uniformRows: true
                        },
                        output: {
                            prune: false,
                            objectOverwrite: false
                        }
                    });
                    shipmentSchedule.grow(resultset);
                    responseObject.shipmentSchedule = shipmentSchedule.getData();
                    // get a set of fresh newRequestSummary data
                    return trx.select('*').from('rawMaterial.dbo.newRequestSummary')
                        .orderBy('workingYear').orderBy('workingMonth').orderBy('CUS_NO').debug(false);
                }).then((resultset) => {
                    responseObject.newRequestSummary = resultset;
                    // get a set of fresh purchaseOrder data
                    return trx('rawMaterial.dbo.ActivePurchaseOrder').select('*')
                        .orderBy('CUS_NO').debug(false);
                }).then((resultset) => {
                    // process active purchase order data
                    let pOList = new Treeize();
                    pOList.setOptions({
                        input: {
                            detectCollection: false,
                            uniformRows: true
                        },
                        output: {
                            prune: false,
                            objectOverwrite: false
                        }
                    });
                    pOList.grow(resultset);
                    let tempList = pOList.getData();
                    tempList.forEach((purchaseOrder, index, array) => {
                        array[index].supplier = purchaseOrder.suppliers[0];
                        delete array[index].suppliers;
                    });
                    responseObject.activePOList = tempList;
                    // get a set of fresh contentSummary data
                    return trx('rawMaterial.dbo.pOContentSummary').select('*').debug(false);
                });
        }).then((resultset) => {
            responseObject.pOContentSummary = resultset;
            return response.status(200).json(responseObject);
        }).catch((error) => {
            return utility.endpointErrorHandler(
                request.method,
                request.originalUrl,
                `取消預約作業發生錯誤: ${error}`);
        }).finally(() => {
            knex.destroy();
        });
    })
    .put((request, response, next) => {
        return response.status(200).json(request.body);
        /*
        const responseObject = {
            shipmentSchedule: null,
            shipmentSummary: null
        };
        const knex = require('knex')(serverConfig.mssqlConfig);
        knex('rawMaterial.dbo.shipmentRequest')
            .update({
                arrivalDate: request.body.arrivalDate,
                actualWeight: request.body.actualWeight,
                supplierWeight: request.body.supplierWeight,
                note: request.body.note,
                modified: utility.currentDatetimeString()
            })
            .where({ id: request.body.id })
            .debug(false)
            .then(() => {
                return shipmentSchedule(knex, request.body.workingYear, request.body.workingMonth);
            })
            .then((resultset) => {
                responseObject.shipmentSchedule = resultset;
                return shipmentSummary(knex, request.body.workingYear, request.body.workingMonth);
            })
            .then((resultset) => {
                responseObject.shipmentSummary = resultset;
                return response.status(200).json(responseObject);
            })
            .catch((error) => {
                return response.status(500).json(
                    utility.endpointErrorHandler(
                        request.method,
                        request.originalUrl,
                        `原料進廠資料寫入發生錯誤: ${error}`)
                );
            })
            .finally(() => {
                knex.destroy();
            });
        */
    });

module.exports = router;

/*
function shipmentSchedule(knexObj) {
    return knexObj.select('*')
        .from('rawMaterial.dbo.shipmentSchedule')
        .orderBy('PRD_NO')
        .orderBy('CUS_NO')
        .orderBy('workingDate')
        .debug(false);
}
*/

/*
router.get('/data/shipment/newPOListing', tokenValidation, function(request, response) {
    const contractType = request.query.contractType;
    const startingDate = request.query.startingDate;
    const endDate = request.query.endDate;
    const CUS_NO = request.query.CUS_NO;
    const knex = require('knex')(serverConfig.mssqlConfig);
    const query = knex.select('*')
        .from('rawMaterial.dbo.newPOListing')
        .where({ CUS_NO: CUS_NO });
    if (contractType !== 'oneTime') {
        query.whereBetween('workingDate', [startingDate, endDate]);
    }
    query.orderBy('PRD_NO')
        .orderBy('typeId')
        .orderBy('workingDate');
    query.debug(false)
        .then((resultset) => {
            return response.status(200).json(resultset);
        }).catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `新增訂單進貨資料讀取發生錯誤: ${error}`)
            );
        }).finally(() => {
            knex.destroy();
        });
});
*/

/*
router.get('/data/shipment/tonnageSummary', tokenValidation, function(request, response) {
    const knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.tonnageSummary')
        .where({
            workingYear: request.query.workingYear,
            workingMonth: request.query.workingMonth
        })
        .orderBy('CUS_NO')
        .orderBy('PRD_NO')
        .debug(false)
        .then((resultset) => {
            return response.status(200).json({ tonnageSummary: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `原料進貨重量概況相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});
*/

/*
router.get('/data/shipment/overview', tokenValidation, function(request, response) {
    const knex = require('knex')(serverConfig.mssqlConfig);
    knex.select('*')
        .from('rawMaterial.dbo.shipmentOverview')
        .where({
            workingYear: request.query.workingYear,
            workingMonth: request.query.workingMonth
        })
        .orderBy('CUS_NO')
        .orderBy('PRDT_SNM')
        .orderBy('workingDate')
        .debug(false)
        .then((resultset) => {
            return response.status(200).json({ shipmentOverview: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `原料進貨概況相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});
*/

/*
router.get('/data/shipment/summary', tokenValidation, function(request, response) {
    const knex = require('knex')(serverConfig.mssqlConfig);
    shipmentSummary(knex, request.query.workingYear, request.query.workingMonth)
        .debug(false)
        .then((resultset) => {
            return response.status(200).json({ shipmentSummary: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `原料每日進貨預約相關資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});
*/

/*
function shipmentSummary(knexObj, workingYear, workingMonth) {
    return knexObj.select('*')
        .from('rawMaterial.dbo.shipmentSummary')
        .where({
            workingYear: workingYear,
            workingMonth: workingMonth
        })
        .orderBy('workingDate');
}
*/
