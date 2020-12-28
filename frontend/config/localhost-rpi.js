
const ip = require('ip');

module.exports = {
    useMockedBackend: false,
    backend: {
        baseURL: `http://<type-your-raspberry-pi-ip>:3001`,
        w1sensors: '/w1sensors',
        temperature: {
            sensors: '/temperature/sensors',
            values: '/temperature/values'
        },
    },
};
