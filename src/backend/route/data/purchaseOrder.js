const express = require('express');
const moment = require('moment-timezone');
const Treeize = require('treeize');
const uuidV4 = require('uuid/v4');
const serverConfig = require('../../serverConfig.js');
const utility = require('../../utility.js');
const tokenValidation = require('../../middleware/tokenValidation.js');

const router = express.Router();

router.get('/data/purchaseOrder/contentSummary', tokenValidation, (request, response, next) => {
    const knex = require('knex')(serverConfig.mssqlConfig);
    knex('rawMaterial.dbo.pOContentSummary').select('*').debug(true)
        .then((resultset) => {
            return response.status(200).json({ pOContentSummary: resultset });
        }).catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `訂單預約進貨細節資料讀取發生錯誤: ${error}`)
            );
        }).finally(() => {
            knex.destroy();
        });
});

router.route('/data/purchaseOrder')
    .all(tokenValidation)
    .get((request, response, next) => {
        const knex = require('knex')(serverConfig.mssqlConfig);
        knex('rawMaterial.dbo.ActivePurchaseOrder')
            .select('*')
            .orderBy('CUS_NO')
            .debug(true)
            .then((resultset) => {
                const pOList = new Treeize();
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
                const tempList = pOList.getData();
                tempList.forEach((purchaseOrder, index, array) => {
                    array[index].supplier = purchaseOrder.suppliers[0];
                    delete array[index].suppliers;
                });
                return response.status(200).json({ activePOList: tempList });
            }).catch((error) => {
                return response.status(500).json(
                    utility.endpointErrorHandler(
                        request.method,
                        request.originalUrl,
                        `訂單資料讀取發生錯誤: ${error}`)
                );
            }).finally(() => {
                knex.destroy();
            });
    })
    .put((request, response, next) => {
        let responseObject = {
            shipmentSchedule: null,
            newRequestSummary: null,
            activePOList: null,
            pOContentSummary: null
        };
        // create a new PO entry
        let newPOId = uuidV4().toUpperCase();
        let newPOEntry = {
            id: newPOId,
            revisionNumber: request.body.targetPO.revisionNumber + 1,
            originalPOId: request.body.targetPO.originalPOId,
            pONumber: request.body.targetPO.pONumber,
            contractType: request.body.targetPO.contractType,
            documentDate: moment.utc(new Date()).format('YYYY-MM-DD'),
            workingYear: request.body.targetPO.workingYear,
            workingMonth: request.body.targetPO.workingMonth,
            startingDate: request.body.targetPO.startingDate,
            endDate: request.body.targetPO.endDate,
            CUS_NO: request.body.targetPO.CUS_NO
        };
        // create a list holding data of the shipments to be moved to the new pOId
        let tempArray = request.body.targetPO.shipments.filter((existingShipment) => {
            return existingShipment.deprecated === null;
        });
        let existingValidShipmentArray = [];
        tempArray.forEach((existingValidShipment) => {
            existingValidShipmentArray.push(existingValidShipment);
        });
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex.transaction((trx) => {
            // create a new PO entry
            return trx.insert(newPOEntry).into('rawMaterial.dbo.purchaseOrder').debug(true)
                .then(() => {
                    // create by copying valid shipments and attach to the new PO
                    return trx.raw('INSERT INTO rawMaterial.dbo.shipment (id,pOId,requestDate,CUS_NO,PRD_NO,typeId,unitPrice,requestWeight,receivedDate,supplierWeight,actualWeight,note,created,deprecated) SELECT ? AS id,pOId,requestDate,CUS_NO,PRD_NO,typeId,unitPrice,requestWeight,receivedDate,supplierWeight,actualWeight,note,created,deprecated FROM rawMaterial.dbo.shipment WHERE id=?;', [newPOId, request.body.targetPO.id]);
                })
                .then(() => {
                    // deprecate the original valid shipment entries
                    return trx('rawMaterial.dbo.shipment')
                        .update({ deprecated: moment.utc(new Date()).format('YYYY-MM-DD hh:mm:ss') })
                        .where({ pOId: request.body.targetPO.id }).debug(true);
                }).then(() => {
                    // attach pending shipments to the new PO
                    let queryList = [];
                    request.body.pendingOrderList.forEach((pendingShipment) => {
                        queryList.push(
                            trx('rawMaterial.dbo.shipment').update({ pOId: newPOId }).where({ id: pendingShipment.id }).debug(true)
                        );
                    });
                    return Promise.all(queryList);
                }).then(() => {
                    // deprecate the old purchase order
                    return trx('rawMaterial.dbo.purchaseOrder')
                        .update({ deprecated: moment.utc(new Date()).format('YYYY-MM-DD hh:mm:ss') })
                        .where({ id: request.body.targetPO.id });
                }).then(() => {
                    // get a set of fresh shipment data
                    return trx.select('*').from('rawMaterial.dbo.shipmentSchedule').orderBy('PRD_NO').orderBy('CUS_NO').orderBy('workingDate').debug(true);
                }).then((resultset) => {
                    responseObject.shipmentSchedule = resultset;
                    // get a set of fresh newRequestSummary data
                    return trx.select('*').from('rawMaterial.dbo.newRequestSummary').orderBy('CUS_NO').orderBy('workingYear').orderBy('workingMonth').debug(true);
                }).then((resultset) => {
                    responseObject.newRequestSummary = resultset;
                    // get a set of fresh purchaseOrder data
                    return trx('rawMaterial.dbo.ActivePurchaseOrder').select('*').orderBy('CUS_NO').debug(true);
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
                    return trx('rawMaterial.dbo.pOContentSummary').select('*').debug(true);
                });
        }).then((resultset) => {
            responseObject.pOContentSummary = resultset;
            return response.status(200).json(responseObject);
        }).catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `更新訂單資料發生錯誤: ${error}`)
            );
        }).finally(() => {
            knex.destroy();
        });
        return response.status(200).json(existingValidShipmentArray);
    });

/*
function genNewPONum() {
    const yearPartString = (new Date().getFullYear() - 1911).toString();
    const datePartString = moment(new Date(), 'YYYY-MM-DD HH:MM:ss').format('MMDD');
    return `${yearPartString}${datePartString}01`;
}
*/

module.exports = router;
