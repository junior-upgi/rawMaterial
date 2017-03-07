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
