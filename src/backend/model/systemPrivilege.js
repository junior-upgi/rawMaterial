const clone = require('clone');

const list = [{
    erpID: '05060001',
    membership: [{
        systemID: 1,
        status: 'admin', // 'admin','corporateUser','supplierUser'
        accessType: 'full', // 'full','partial'
        accessPeriod: 3600,
        funcList: []
    }, {
        systemID: 6,
        status: 'admin', // 'admin','corporateUser','supplierUser'
        accessType: 'full', // 'full','partial'
        accessPeriod: 3600,
        funcList: []
    }, {
        systemID: 7,
        status: 'admin', // 'admin','corporateUser','supplierUser'
        accessType: 'full', // 'full','partial'
        accessPeriod: 3600,
        funcList: []
    }]
}];

function getPrivObject(erpID, systemID) {
    let userPrivObject = {
        erpID: '',
        membership: []
    };
    list.forEach(function(userPrivItem) {
        if (userPrivItem.erpID === erpID) {
            userPrivObject.erpID = userPrivItem.erpID;
            userPrivItem.membership.forEach(function(membershipItem) {
                if (membershipItem.systemID === parseInt(systemID)) {
                    userPrivObject.membership[0] = clone(membershipItem);
                }
            });
        }
    });
    return userPrivObject;
}

module.exports = {
    list: list,
    getPrivObject: getPrivObject
};
