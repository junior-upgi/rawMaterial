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

router.route('/data/shipment')
    .all(tokenValidation)
    .get(function (request, response, next) {
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex('rawMaterial.dbo.shipmentSchedule').select('*')
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
            pOContentSummary: null,
            consolidatedReceivingRecord: null,
            receivingRecord: null,
            monthlyShipmentOverview: null
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
                    // get a fresh copy of vacation exceptions
                    return trx('rawMaterial.dbo.vacationException')
                        .select(knex.raw('CONVERT(CHAR(10),exceptionDate,126) AS exceptionDate, flag, CUS_NO'))
                        .orderBy('exceptionDate').debug(false);
                }).then((resultset) => {
                    responseObject.vacationException = resultset;
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
                    return trx('rawMaterial.dbo.ActivePurchaseOrder')
                        .select('*')
                        .orderBy('pONumber')
                        .orderBy('shipments:workingDate')
                        /*
                        .orderBy('workingYear')
                        .orderBy('workingMonth')
                        .orderBy('CUS_NO')
                        */
                        .debug(false);
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
                }).then((resultset) => {
                    responseObject.pOContentSummary = resultset;
                    // get simplified shipment records
                    return trx('rawMaterial.dbo.consolidatedReceivingRecord').select('*')
                        .orderBy('CUS_NO').orderBy('PRD_NO').orderBy('workingDate').debug(false);
                }).then((resultset) => {
                    responseObject.consolidatedReceivingRecord = resultset;
                    // get simplified shipment records
                    return trx('rawMaterial.dbo.receivingRecord').select('*')
                        .orderBy('CUS_NO').orderBy('PRD_NO').orderBy('workingDate').debug(false);
                }).then((resultset) => {
                    responseObject.receivingRecord = resultset;
                    // get monthly shipment overview data
                    return trx('rawMaterial.dbo.monthlyShipmentOverview').select('*')
                        .orderBy('workingYear').orderBy('workingMonth').orderBy('CUS_NO')
                        .orderBy('PRD_NO').debug(false);
                });
        }).then((resultset) => {
            responseObject.monthlyShipmentOverview = resultset;
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
            pOContentSummary: null,
            consolidatedReceivingRecord: null,
            receivingRecord: null,
            monthlyShipmentOverview: null
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
                    // get a fresh copy of vacation exceptions
                    return trx('rawMaterial.dbo.vacationException')
                        .select(knex.raw('CONVERT(CHAR(10),exceptionDate,126) AS exceptionDate, flag, CUS_NO'))
                        .orderBy('exceptionDate').debug(false);
                }).then((resultset) => {
                    responseObject.vacationException = resultset;
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
                    return trx('rawMaterial.dbo.ActivePurchaseOrder')
                        .select('*')
                        .orderBy('pONumber')
                        .orderBy('shipments:workingDate')
                        /*
                        .orderBy('workingYear')
                        .orderBy('workingMonth')
                        .orderBy('CUS_NO')
                        */
                        .debug(false);
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
                }).then((resultset) => {
                    responseObject.pOContentSummary = resultset;
                    // get simplified shipment records
                    return trx('rawMaterial.dbo.consolidatedReceivingRecord').select('*')
                        .orderBy('CUS_NO').orderBy('PRD_NO').orderBy('workingDate').debug(false);
                }).then((resultset) => {
                    responseObject.consolidatedReceivingRecord = resultset;
                    // get simplified shipment records
                    return trx('rawMaterial.dbo.receivingRecord').select('*')
                        .orderBy('CUS_NO').orderBy('PRD_NO').orderBy('workingDate').debug(false);
                }).then((resultset) => {
                    responseObject.receivingRecord = resultset;
                    // get monthly shipment overview data
                    return trx('rawMaterial.dbo.monthlyShipmentOverview').select('*')
                        .orderBy('workingYear').orderBy('workingMonth').orderBy('CUS_NO')
                        .orderBy('PRD_NO').debug(false);
                });
        }).then((resultset) => {
            responseObject.monthlyShipmentOverview = resultset;
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
        let responseObject = {
            shipmentSchedule: null,
            newRequestSummary: null,
            activePOList: null,
            pOContentSummary: null,
            consolidatedReceivingRecord: null,
            receivingRecord: null,
            monthlyShipmentOverview: null
        };
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex.transaction((trx) => {
                return trx('rawMaterial.dbo.shipment')
                    .update({
                        receivedDate: request.body.receivedDate,
                        actualWeight: request.body.actualWeight,
                        supplierWeight: request.body.supplierWeight,
                        note: request.body.note
                    })
                    .where({ id: request.body.id })
                    .debug(false)
                    .then(() => {
                        // get a fresh copy of vacation exceptions
                        return trx('rawMaterial.dbo.vacationException')
                            .select(knex.raw('CONVERT(CHAR(10),exceptionDate,126) AS exceptionDate, flag, CUS_NO'))
                            .orderBy('exceptionDate').debug(false);
                    }).then((resultset) => {
                        responseObject.vacationException = resultset;
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
                        return trx('rawMaterial.dbo.ActivePurchaseOrder')
                            .select('*')
                            .orderBy('pONumber')
                            .orderBy('shipments:workingDate')
                            /*
                            .orderBy('workingYear')
                            .orderBy('workingMonth')
                            .orderBy('CUS_NO')
                            */
                            .debug(false);
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
                    }).then((resultset) => {
                        responseObject.pOContentSummary = resultset;
                        // get simplified shipment records
                        return trx('rawMaterial.dbo.consolidatedReceivingRecord').select('*')
                            .orderBy('CUS_NO').orderBy('PRD_NO').orderBy('workingDate').debug(false);
                    }).then((resultset) => {
                        responseObject.consolidatedReceivingRecord = resultset;
                        // get simplified shipment records
                        return trx('rawMaterial.dbo.receivingRecord').select('*')
                            .orderBy('CUS_NO').orderBy('PRD_NO').orderBy('workingDate').debug(false);
                    }).then((resultset) => {
                        responseObject.receivingRecord = resultset;
                        // get monthly shipment overview data
                        return trx('rawMaterial.dbo.monthlyShipmentOverview').select('*')
                            .orderBy('workingYear').orderBy('workingMonth').orderBy('CUS_NO')
                            .orderBy('PRD_NO').debug(false);
                    });
            }).then((resultset) => {
                responseObject.monthlyShipmentOverview = resultset;
                return response.status(200).json(responseObject);
            })
            .catch((error) => {
                return response.status(500).json(
                    utility.endpointErrorHandler(
                        request.method,
                        request.originalUrl,
                        `預約記錄備註資料寫入發生錯誤: ${error}`)
                );
            })
            .finally(() => {
                knex.destroy();
            });
    });

router.get('/data/shipment/newRequestSummary', tokenValidation, function (request, response) {
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

router.get('/data/shipment/receivingRecord/consolidated', tokenValidation, function (request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex('rawMaterial.dbo.consolidatedReceivingRecord').select('*')
        .orderBy('CUS_NO').orderBy('PRD_NO').orderBy('workingDate').debug(false)
        .then((resultset) => {
            return response.status(200).json({ consolidatedReceivingRecord: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `簡化每日進貨明細資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

router.get('/data/shipment/receivingRecord', tokenValidation, function (request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex('rawMaterial.dbo.receivingRecord').select('*')
        .orderBy('CUS_NO').orderBy('PRD_NO').orderBy('workingDate').debug(false)
        .then((resultset) => {
            return response.status(200).json({ receivingRecord: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `簡化進貨明細資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

router.get('/data/shipment/monthlyOverview', tokenValidation, function (request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
    knex('rawMaterial.dbo.monthlyShipmentOverview').select('*')
        .orderBy('workingYear').orderBy('workingMonth').orderBy('CUS_NO').orderBy('PRD_NO').debug(false)
        .then((resultset) => {
            return response.status(200).json({ monthlyShipmentOverview: resultset });
        })
        .catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `進貨概況資料讀取發生錯誤: ${error}`)
            );
        })
        .finally(() => {
            knex.destroy();
        });
});

module.exports = router;
