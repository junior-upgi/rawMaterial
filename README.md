# raw-material

> program backend to monitor and regulate purchase and transport of raw material used in glass production

## Build Setup

``` bash
# install dependencies
npm install
bower install

# start development server with hot reload at localhost:9006
npm run start:dev:server (browser client should start automatically)

# start production server at upgi.ddns.net:9006
1. modify src/backend/serverConfig.js (const development = false;)
2. modify src/frontend/clientConfig.js (const development = false;)
npm run production:build (only the server is starting on nodemon, browser client should connect from http://upgi.ddns.net:9006/rawMaterial/index.html)
