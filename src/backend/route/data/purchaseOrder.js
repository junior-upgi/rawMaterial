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
    knex('rawMaterial.dbo.pOContentSummary').select('*').debug(false)
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
            .debug(false)
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
    .put(function(request, response, next) {
        const uuid = uuidV4().toUpperCase();
        const knex = require('knex')(serverConfig.mssqlConfig);
        const dataObject = {
            pOId: uuid,
            pONumber: genNewPONum(),
            revisionNumber: 1,
            contractType: request.body.contractType,
            startingDate: request.body.startingDate,
            endDate: request.body.endDate,
            CUS_NO: request.body.CUS_NO,
            confirmed: false,
            fulfilled: false
        };
        knex.transaction((trx) => {
            return trx
                .insert(dataObject)
                .into('rawMaterial.dbo.purchaseOrder')
                .debug(false)
                .then(() => {
                    const pOId = uuid;
                    const updateRequestPromiseList = [];
                    request.body.shipmentList.forEach((shipment) => {
                        updateRequestPromiseList.push(
                            trx('rawMaterial.dbo.shipmentRequest')
                            .update({
                                pOId: pOId,
                                modified: utility.currentDatetimeString()
                            }).where({ id: shipment.id })
                            .debug(false)
                        );
                    });
                    return Promise.all(updateRequestPromiseList);
                });
        }).then(() => {
            return response.status(200).end();
        }).catch((error) => {
            return response.status(500).json(
                utility.endpointErrorHandler(
                    request.method,
                    request.originalUrl,
                    `新增訂單資料寫入發生錯誤: ${error}`)
            );
        }).finally(() => {
            knex.destroy();
        });
    });

function genNewPONum() {
    const yearPartString = (new Date().getFullYear() - 1911).toString();
    const datePartString = moment(new Date(), 'YYYY-MM-DD HH:MM:ss').format('MMDD');
    return `${yearPartString}${datePartString}01`;
}

module.exports = router;
