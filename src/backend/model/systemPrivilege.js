const serverConfig = require('../module/serverConfig.js');

const list = [{
    erpId: '05060001',
    role: 'admin' // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
}, {
    erpId: '95070003',
    role: 'purchasingStaff' // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
}, {
    erpId: '09100001',
    role: 'furnaceStaff' // 'admin','furnaceStaff','purchasingStaff','supplier','blackListed'
}];

function checkMembership(loginId) {
    let foundMatch = false;
    list.forEach(function(privilegeObject) {
        if (privilegeObject.erpId === loginId) {
            foundMatch = true;
        }
    });
    return foundMatch;
}

function getRole(loginId) {
    let role = '';
    list.forEach(function(privilegeObject) {
        if (privilegeObject.erpId === loginId) {
            role = privilegeObject.role;
        }
    });
    return role;
}

module.exports = {
    checkMembership: checkMembership,
    getRole: getRole,
    list: list
};
