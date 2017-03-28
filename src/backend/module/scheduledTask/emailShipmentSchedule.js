import moment from 'moment-timezone';
import cron from 'node-cron';
import httpRequest from 'request-promise';
import rimraf from 'rimraf';
import xlsx from 'xlsx';

import serverConfig from '../../serverConfig.js';
import telegram from '../../model/telegram.js';
import utility from '../../utility.js';

const taskConfig = {
    reference: 'emailShipmentSchedule',
    interval: '0 10 8 28-31 * *',
    // interval: '0 0 8 28-31 * *',
    targetCUS_NO: 'JJ07',
    targetEmailList: [
        'cindy.chiu@upgi.com.tw',
        'yang@upgi.com.tw',
        'hcl4167@upgi.com.tw',
        'furnace@upgi.com.tw',
        'olivia@upgi.com.tw',
        'mien@upgi.com.tw',
        'junior@upgi.com.tw'
    ]
};

function currentYear() {
    return new Date().getFullYear();
}

function currentMonth() {
    return new Date().getMonth();
}

function currentDate() {
    return moment(new Date()).format('YYYY-MM-DD');
}

function lastDateOfCurrentMonth() {
    return moment(new Date(currentYear(), currentMonth() + 1, 1))
        .subtract(1, 'day').format('YYYY-MM-DD');
}

function firstDateOfNextMonth() {
    return moment(new Date(currentYear(), currentMonth() + 1, 1))
        .format('YYYY-MM-DD');
}

function lastDateOfNextMonth() {
    return moment(new Date(currentYear(), currentMonth() + 2, 1))
        .subtract(1, 'day').format('YYYY-MM-DD');
}

export default cron.schedule(taskConfig.interval, () => {
    if (
        // currentDate() === lastDateOfCurrentMonth()
        currentDate() === '2017-03-29'
    ) {
        let knex = require('knex')(serverConfig.mssqlConfig);
        knex('rawMaterial.dbo.shipmentSchedule')
            .select('purchaseOrder:pONumber', 'purchaseOrder:revisionNumber', 'requestDate', 'CUST_SNM', 'PRDT_SNM', 'specification', 'requestWeight')
            .where({
                CUS_NO: taskConfig.targetCUS_NO,
                deprecated: null
            }).whereBetween('requestDate', [
                firstDateOfNextMonth(),
                lastDateOfNextMonth()
            ]).then((resultset) => {
                let flatArray = []; // array to hold arrays(rows) of excel data
                flatArray.push(['訂單編號', '版次', '預約日期', '廠商', '原料', '類別', '預約重量']); // push the title row into the temp array
                resultset.forEach((result) => { // convert the resultset from array of objects into array of arrays
                    let flatObject = []; // temp array to hold a flattened object
                    for (let objIndex in result) { // loop through object attributes
                        flatObject.push(result[objIndex]); // push the indexed attrib value on to the temp array
                    }
                    flatArray.push(flatObject); // push an array(row) of values into the final array
                });
                let ws_name = `佳集${currentMonth() + 2}月份預估進廠車次列表`; // indicate the worksheet name
                let wb = new Workbook(); // create an workbook object
                wb.SheetNames.push(ws_name); // add a worksheet to the workbook
                wb.Sheets[ws_name] = sheet_from_array_of_arrays(flatArray); // insert the data into the worksheet
                xlsx.writeFile(wb, './temp/預估進廠車次列表.xlsx'); // write the workbook to file
                return utility.sendEmail(taskConfig.targetEmailList, [{ path: './temp/預估進廠車次列表.xlsx' }]);
            }).then((response) => {
                return httpRequest({ // broadcast notification
                    method: 'post',
                    uri: serverConfig.botAPIUrl + telegram.getBotToken('upgiITBot') + '/sendMessage',
                    body: {
                        chat_id: telegram.getChatID('統義原料控管系統群組'),
                        text: `${currentYear()}年度${currentMonth() + 2}月份佳集預估進廠車次列表已郵寄至各單位郵件信箱`,
                        token: telegram.getBotToken('upgiITBot')
                    },
                    json: true
                });
            }).then((response) => {
                // remove temp file
                rimraf('./temp/預估進廠車次列表.xlsx', () => {
                    console.log('file deleted');
                });
            }).catch((error) => {
                utility.alertSystemError(taskConfig.reference, error);
            }).finally(() => {
                knex.destroy();
            });
    }
}, false);

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function datenum(v, date1904) {
    if (date1904) v += 1462;
    let epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    let ws = {};
    let range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
    for (let R = 0; R !== data.length; ++R) {
        for (let C = 0; C !== data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            let cell = { v: data[R][C] };
            if (cell.v === null) continue;
            let cell_ref = xlsx.utils.encode_cell({ c: C, r: R });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = xlsx.SSF._table[14];
                cell.v = datenum(cell.v);
            } else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = xlsx.utils.encode_range(range);
    return ws;
}
