const development = true;

export const systemReference = 'rawMaterial';

function serverHost() {
    if (development === true) {
        return 'http://localhost'; // development
    } else {
        return 'http://upgi.ddns.net'; // production
    }
}
const serverPort = 9006;

function constructServerUrl() {
    return `${serverHost()}:${serverPort}/${systemReference}`;
}

export const serverUrl = constructServerUrl();

export const employeeChatGroup = {
    id: -170186986,
    title: '統義原料控管系統群組',
    type: 'group'
};

export const defaultBot = {
    id: 287236637,
    first_name: 'UPGI IT 機器人',
    username: 'upgiITBot',
    token: '287236637:AAHSuMHmaZJ2Vm9gXf3NeSlInrgr-XXzoRo'
};

export const broadcastServiceUrl = 'http://upgi.ddns.net:9001/broadcast';
