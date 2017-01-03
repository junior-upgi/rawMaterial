const list = [{
    erpID: '05060001',
    membership: [{
        systemID: 1,
        role: 'admin', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessType: 'full', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: []
    }, {
        systemID: 6,
        role: 'admin', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessType: 'full', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: []
    }, {
        systemID: 7,
        role: 'admin', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessType: 'full', // 'full','partial','none'
        accessPeriod: 10,
        funcPrivList: []
    }]
}];

function getPrivObject(erpID, systemID) {
    let privObject = {
        role: null,
        accessType: null,
        funcPrivList: []
    };
    list.forEach(function(listItem) {
        if (listItem.erpID === erpID) {
            listItem.membership.forEach(function(membershipItem) {
                if (membershipItem.systemID === parseInt(systemID)) {
                    privObject.role = membershipItem.role;
                    privObject.accessType = membershipItem.accessType;
                    privObject.funcPrivList = membershipItem.funcPrivList.slice();
                }
            });
        }
    });
    return privObject;
}

module.exports = {
    list: list,
    getPrivObject: getPrivObject
};
