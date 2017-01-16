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
const browsersyncPort = 9996;

function constructServerUrl() {
    if (development === true) {
        return `${serverHost()}:${browsersyncPort}/${systemReference}`; // development
    } else {
        return `${serverHost()}:${serverPort}/${systemReference}`; // production
    }
}

export const serverUrl = constructServerUrl();
