const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment-timezone');
const uuidV4 = require('uuid/v4');
const serverConfig = require('../../module/serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
const utility = require('../../module/utility.js');

const router = express.Router();
router.use(bodyParser.json());

router.get('/data/shipment/newPOListing', tokenValidation, function(request, response) {
    let contractType = request.query.contractType;
    let startingDate = request.query.startingDate;
    let endDate = request.query.endDate;
    let CUS_NO = request.query.CUS_NO;
    let knex = require('knex')(serverConfig.mssqlConfig);
    let query = knex.select('*')
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

router.get('/data/shipment/tonnageSummary', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
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

router.get('/data/shipment/overview', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
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

function shipmentSummary(knexObj, workingYear, workingMonth) {
    return knexObj.select('*')
        .from('rawMaterial.dbo.shipmentSummary')
        .where({
            workingYear: workingYear,
            workingMonth: workingMonth
        })
        .orderBy('workingDate');
}

function shipmentSchedule(knexObj, workingYear, workingMonth) {
    return knexObj.select('*')
        .from('rawMaterial.dbo.shipmentSchedule')
        .where({
            workingYear: workingYear,
            workingMonth: workingMonth
        })
        .orderBy('PRD_NO')
        .orderBy('CUS_NO')
        .orderBy('workingDate');
}

router.get('/data/shipment/summary', tokenValidation, function(request, response) {
    let knex = require('knex')(serverConfig.mssqlConfig);
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

router.route('/data/shipment')
    .all(tokenValidation)
    .get(function(request, response, next) {
        let knex = require('knex')(serverConfig.mssqlConfig);
        shipmentSchedule(knex, request.query.workingYear, request.query.workingMonth)
            .debug(false)
            .then((resultset) => {
                return response.status(200).json({ shipmentSchedule: resultset });
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
    .post(function(request, response, next) {
        let uuid = uuidV4().toUpperCase();
        let responseObject = {
            shipmentSchedule: null,
            shipmentSummary: null
        };
        let shipmentTableData = {
            id: uuid,
            CUS_NO: request.body.CUS_NO,
            PRD_NO: request.body.PRD_NO,
            SQ_NO: request.body.SQ_NO,
            SQ_ITM: 1,
            requestDate: request.body.requestDate,
            shipmentCount: request.body.shipmentCount,
            typeId: request.body.typeId,
            workingMonth: request.body.contractType === 'annual' ? null : request.body.workingMonth,
            workingYear: request.body.contractType === 'oneTime' ? null : request.body.workingYear,
            note: '批次預約'
        };
        let mfsqTableData = {
            SQ_DD: moment.utc(new Date()).format('YYYY-MM-DD'),
            SQ_NO: request.body.SQ_NO,
            DEP: '3F12',
            CUS_NO: request.body.CUS_NO,
            SAL_NO: '09100001',
            INC_ID: 'F',
            REM: '原料控管資料',
            USR: '09100001',
            CHK_MAN: 'ADMIN',
            PRT_SW: 'N',
            PO_DEP: '1500',
            CLS_ID: 'F',
            EXC_RTO: 1,
            CLS_DATE: moment.utc(new Date()).format('YYYY-MM-DD'),
            SYS_DATE: moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };
        let tfsqTableData = {
            ITM: 1,
            PRD_NO: request.body.PRD_NO,
            PRD_NAME: request.body.PRDT_SNM,
            WH: '0000',
            UNIT: '1',
            QTY: request.body.qtyPerShipment * request.body.shipmentCount,
            EST_DD: request.body.requestDate,
            CUS_NO: request.body.CUS_NO,
            SQ_NO: request.body.SQ_NO,
            REMARK: '原料控管資料',
            DEP: '3F12',
            UNIT_NAME: '公斤',
            EST_ITM: 1,
            EXC_RTO: 1
        };
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex.transaction((trx) => {
            return trx
                .insert(shipmentTableData)
                .into('rawMaterial.dbo.shipment').debug(false)
                .then(() => {
                    return trx.insert(mfsqTableData).into('DB_1111.dbo.MF_SQ').debug(false);
                }).then(() => {
                    return trx.insert(tfsqTableData).into('DB_1111.dbo.TF_SQ').debug(false);
                });
        }).then(() => {
            return shipmentSchedule(knex, request.body.workingYear, request.body.workingMonth);
        }).then((resultset) => {
            responseObject.shipmentSchedule = resultset;
            return shipmentSummary(knex, request.body.workingYear, request.body.workingMonth);
        }).then((resultset) => {
            responseObject.shipmentSummary = resultset;
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
    .delete(function(request, response, next) {
        let responseObject = {
            shipmentSchedule: null,
            shipmentSummary: null
        };
        let knex = require('knex')(serverConfig.mssqlConfig);
        let condition = {
            id: request.body.id,
            SQ_NO: request.body.SQ_NO,
            SQ_ITM: request.body.SQ_ITM,
            OS_NO: request.body.OS_NO,
            OS_ITM: request.body.OS_ITM
        };
        // go into transaction mode
        // ---- delete rawMaterial.dbo.shipment by update the modified and deprecated fields according to the conditions
        // ---- if OS_NO !== null
        // ---- ---- delete DB_1111.dbo.TF_POS record accordingly
        // ---- ---- select query of DB_1111.dbo.TF_POS according to OS_NO
        // ---- ---- ---- if resultset.length===0, delete DB_1111.dbo.MF_POS record WHERE OS_NO
        // ---- if SQ_NO !== null
        // ---- ---- delete DB_1111.dbo.TF_SQ record accordingly SQ_NO,SQ_ITM
        // ---- ---- select query of DB_1111.dbo.TF_SQ according to SQ_NO
        // ---- ---- ---- if resultset.length===0, delete DB_1111.dbo.MF_SQ record WHERE SQ_NO
        knex('rawMaterial.dbo.shipmentRequest')
            .update({
                modified: utility.currentDatetimeString(),
                deprecated: utility.currentDatetimeString()
            })
            .where(condition)
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
                        `取消原料進貨預約作業發生錯誤: ${error}`)
                );
            })
            .finally(() => {
                knex.destroy();
            });
    })
    .put(function(request, response, next) {
        let responseObject = {
            shipmentSchedule: null,
            shipmentSummary: null
        };
        let knex = require('knex')(serverConfig.mssqlConfig);
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
    });

module.exports = router;
