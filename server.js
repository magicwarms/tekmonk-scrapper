const server = require('./routes/routes'); // imports the routing file

const port = 9000;
const hostname = 'http://localhost';

server.listen(port, () => {
    console.log(`⚡️[tekmonk-backend]: Server running at ${hostname}:${port}/`);
});
