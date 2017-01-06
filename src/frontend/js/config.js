export const systemReference = 'rawMaterial';

const development = true;

function serverHost() {
    if (development === true) {
        return 'http://localhost'; // development
    } else {
        return 'http://upgi.ddns.net'; // production
    }
}
const serverPort = 9006;
const browserSyncPort = 9996;

export const viewFileSourceUrl = './view';
export function loginUrl() {
    if (development === true) {
        return `${serverHost()}:${browserSyncPort}/${systemReference}/login`;
    } else {
        return `${serverHost()}:${serverPort}/${systemReference}/login`;
    }
}

export function validateTokenUrl() {
    if (development === true) {
        return `${serverHost()}:${browserSyncPort}/${systemReference}/validateToken`;
    } else {
        return `${serverHost()}:${serverPort}/${systemReference}/validateToken`;
    }
}

export function serverUrl() {
    if (development === true) {
        return `${serverHost()}:${browserSyncPort}/${systemReference}`;
    } else {
        return `${serverHost()}:${serverPort}/${systemReference}`;
    }
}
