const express = require('express');
const moment = require('moment-timezone');
const Treeize = require('treeize');
const uuidV4 = require('uuid/v4');
const serverConfig = require('../../module/serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../module/utility.js');

const router = express.Router();

router.route('/data/purchaseOrder')
    .all(tokenValidation)
    .get(function(request, response, next) {
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex('rawMaterial.dbo.availablePOList')
            .select('*')
            .orderBy('CUS_NO')
            .orderBy('pONumber')
            .orderBy('revisionNumber')
            .debug(false)
            .then((resultset) => {
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
                return response.status(200).json({ pOList: pOList.getData() });
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
        let uuid = uuidV4().toUpperCase();
        let knex = require('knex')(serverConfig.mssqlConfig);
        let dataObject = {
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
                    let pOId = uuid;
                    let updateRequestPromiseList = [];
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
    let yearPartString = (new Date().getFullYear() - 1911).toString();
    let datePartString = moment(new Date(), 'YYYY-MM-DD HH:MM:ss').format('MMDD');
    return `${yearPartString}${datePartString}01`;
}

module.exports = router;
