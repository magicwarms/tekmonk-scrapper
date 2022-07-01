const http = require('http');
const https = require('https');

const port = 9000;
const hostname = 'http://localhost';

const getTimeStories = async () => {
    return new Promise((resolve, reject) => {
        https
            .get('https://time.com/', (response) => {
                const data = [];
                response.on('data', (chunkData) => data.push(chunkData));
                response.on('end', () => {
                    const getLines = data.toString('utf8').split('\n');
                    const arrayOfStories = getLines
                        .filter((line) => line.match(/latest-stories__item/g) || line.match(/a href=/g))
                        .slice(40, 64);

                    const getNecessaryLines = [];
                    let itemTitle = '';
                    let itemLink = '';
                    arrayOfStories.forEach((item) => {
                        if (item.match('a href=')) {
                            itemLink = item
                                .replace(/<a href="/g, '')
                                .replace(/">/g, '')
                                .trim();
                        }
                        if (item.match(/latest-stories__item-headline/g)) {
                            itemTitle = item
                                .replace(/<h3 class="latest-stories__item-headline">/g, '')
                                .replace(/<\/h3>/g, '')
                                .trim();
                        }
                        if (itemTitle !== '') {
                            getNecessaryLines.push({
                                title: itemTitle,
                                link: `https://time.com${itemLink}`,
                            });
                        }
                    });
                    // mapping the link property
                    const links = getNecessaryLines.map((o) => o.link);
                    // filter to delete duplicate data
                    resultFiltered = getNecessaryLines.filter(({ link }, index) => !links.includes(link, index + 1));
                    resolve(resultFiltered);
                });
            })
            .on('error', (e) => {
                console.error('error', e.message);
                reject(e);
            })
            .end();
    });
};

http.createServer(async (req, res) => {
    // set the request route
    if (req.url === '/getTimeStories' && req.method === 'GET') {
        getTimeStories()
            .then((getData) => {
                // response headers
                res.writeHead(200, { 'Content-Type': 'application/json' });
                // end the response and return it
                return res.end(
                    JSON.stringify({
                        data: getData,
                        error: null,
                    })
                );
            })
            .catch((err) => {
                if (err.code === 'ENOTFOUND') {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    // send the error
                    return res.end(
                        JSON.stringify({
                            data: null,
                            errors: err.message,
                        })
                    );
                }
                res.writeHead(500, { 'Content-Type': 'application/json' });
                // send the error
                return res.end(
                    JSON.stringify({
                        data: null,
                        errors: err.message,
                    })
                );
            });
    } else {
        // response headers
        res.writeHead(404, { 'Content-Type': 'application/json' });
        // end the response and return it
        return res.end(
            JSON.stringify({
                data: { message: 'API Route not found' },
                error: null,
            })
        );
    }
}).listen(port, () => {
    console.log(`⚡️[tekmonk-backend]: Server running at ${hostname}:${port}/`);
});
