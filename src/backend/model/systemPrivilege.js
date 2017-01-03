const list = [{
    erpID: '05060001',
    membershipList: [{
        systemID: 1,
        role: 'admin', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessLevel: 'full', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: []
    }, {
        systemID: 6,
        role: 'admin', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessLevel: 'full', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: []
    }, {
        systemID: 7,
        role: 'admin', // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
        accessLevel: 'full', // 'full','partial','none'
        accessPeriod: 3600,
        funcPrivList: ['*']
    }]
}];

function checkRoutePriv(erpID, systemID, requestRoute) {
    let userPrivObj = list.filter(function(userPrivObj) {
        return userPrivObj.erpID === erpID; // get the user privilge object
    });
    if (userPrivObj.length > 0) { // privilage membership found
        let membership = userPrivObj[0].membershipList.filter(function(membership) {
            return membership.systemID === parseInt(systemID);
        });
        if (membership.length > 0) { // privilage routes found
            if (membership[0].accessLevel === 'full') { return true; } // if user has full access right
            if (membership[0].accessLevel === 'none') { return false; } // if user has no access right
            // loop through the membership list to get a match
            membership.forEach(function(privRoute) {
                if (privRoute === requestRoute) {
                    return true; // matching privilege found
                }
            });
        }
    }
    return false; // no matching privilege
}

function getPrivObject(erpID, systemID) {
    let privObject = {
        role: null,
        accessLevel: null,
        funcPrivList: []
    };
    list.forEach(function(userPrivObj) {
        if (userPrivObj.erpID === erpID) {
            userPrivObj.membershipList.forEach(function(membership) {
                if (membership.systemID === parseInt(systemID)) {
                    privObject.role = membership.role;
                    privObject.accessLevel = membership.accessLevel;
                    privObject.funcPrivList = membership.funcPrivList.slice();
                }
            });
        }
    });
    return privObject;
}

module.exports = {
    checkRoutePriv: checkRoutePriv,
    getPrivObject: getPrivObject,
    list: list
};
