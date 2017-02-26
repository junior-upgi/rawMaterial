// const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment-timezone');
// const Treeize = require('treeize');
// const uuidV4 = require('uuid/v4');
// const serverConfig = require('../../module/serverConfig.js');
const tokenValidation = require('../../middleware/tokenValidation.js');
// const utility = require('../../module/utility.js');

const router = express.Router();
// router.use(bodyParser.json());

router.route('/data/erp/pss')
    .all(tokenValidation)
    .put(function(request, response, next) {
        let nowMomentObj = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
        let firstOfWorkingMonth = moment(new Date(request.body.workingYear, request.body.workingMonth - 1, 1), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
        let MF_PSS_data = {
            SQ_DD: nowMomentObj.format('YYYY-MM-DD'),
            SQ_NO:
                (parseInt(nowMomentObj.format('YYYY')) - 1911).toString() +
                nowMomentObj.format('MMDD') +
                '-' +
                request.body.CUS_NO,
            DEP: request.body.DEP,
            CUS_NO: request.body.CUS_NO,
            SAL_NO: request.body.SAL_NO,
            INC_ID: 'F',
            EST_DD: firstOfWorkingMonth,
            REM: '原料控管系統資料',
            USR: request.body.SAL_NO,
            CHK_MAN: 'ADMIN',
            PRT_SW: 'N',
            PO_DEP: '1500',
            CLS_ID: 'F',
            EXC_RTP: 1,
            CLS_DATE: nowMomentObj.format('YYYY-MM-DD'),
            SYS_DATE: nowMomentObj.format('YYYY-MM-DD HH:mm:ss'),
            MODIFY_DD: nowMomentObj.format('YYYY-MM-DD HH:mm:ss'),
            MODIFY_MAN: 'ADMIN'
        };
        return response.status(200).end();
    });

module.exports = router;
