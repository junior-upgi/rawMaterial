const previligeList = [
    { erpId: '05060001', role: 'admin' },
    { erpId: '95070003', role: 'purchasing' },
    { erpId: '09100001', role: 'furnace' }
];

module.exports = {
    previligeList: previligeList,
    checkMembership: function(loginId) {
        let foundMatch = false;
        previligeList.forEach(function(privilegeObject) {
            if (privilegeObject.erpId === loginId) {
                foundMatch = true;
            }
        });
        return foundMatch;
    },
    getRole: function(loginId) {
        let role = '';
        previligeList.forEach(function(privilegeObject) {
            if (privilegeObject.erpId === loginId) {
                role = privilegeObject.role;
            }
        });
        return role;
    }
};
