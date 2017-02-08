const previligeList = [
    { erpId: '05060001', role: 'admin', name: '蔡佳佑' },
    { erpId: '95070003', role: 'purchasing', name: '陳連虹貞' },
    { erpId: '09100001', role: 'furnace', name: '林柏志' }
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
    },
    getName: function(loginId) {
        let name = '';
        previligeList.forEach(function(privilegeObject) {
            if (privilegeObject.erpId === loginId) {
                name = privilegeObject.name;
            }
        });
        return name;
    }
};
