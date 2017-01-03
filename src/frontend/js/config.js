export const systemReference = 'rawMaterial';

const development = true;

function serverHost() {
    if (development === true) {
        return 'http://127.0.0.1'; // development
    } else {
        return 'http://upgi.ddns.net'; // production
    }
}
const serverPort = '9006';

export const loginHtmlSource = './view/login.html';
export const loginUrl = `${serverHost()}:${serverPort}/${systemReference}/login`;
export let serverUrl = `${serverHost()}:${serverPort}/${systemReference}`;
