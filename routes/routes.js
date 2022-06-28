const http = require('http');
const https = require('https');
const { responseSuccess, responseError } = require('../apps/utilities/utilities');

const getTimeStories = async (cb) => {
    https
        .get('https://time.com/', (response) => {
            const data = [];
            response.on('data', (chunkData) => data.push(chunkData));

            response.on('end', () => {
                const rawResult = data.join('');
                const getLines = rawResult.split('\n');
                const arrayOfStories = getLines
                    .filter((line) => line.includes('latest-stories__item') || line.includes('a href='))
                    .slice(40, 62);
                const getNecessaryLines = [];
                let itemTitle = '';
                let itemLink = '';
                arrayOfStories.forEach((item) => {
                    if (item.includes('a href=')) {
                        itemLink = item.replace(/<a href="/g, '').replace(/">/g, '');
                    }
                    if (item.match(/<h3 class="latest-stories__item-headline">(.*?)<\/h3>/g)) {
                        itemTitle = item
                            .replace(/<h3 class="latest-stories__item-headline">/g, '')
                            .replace(/<\/h3>/g, '');
                    }
                    getNecessaryLines.push({ title: itemTitle.trim(), link: `https://time.com${itemLink.trim()}` });
                });
                // mapping the link property
                const links = getNecessaryLines.map((o) => o.link);
                // filter to delete unique data
                resultFiltered = getNecessaryLines.filter(({ link }, index) => !links.includes(link, index + 1));
                // return the result
                cb(resultFiltered);
            });
        })
        .on('error', (e) => {
            cb(e);
            console.error('error', e.message);
        });
};

module.exports = http.createServer(async (req, res) => {
    // set the request route
    if (req.url === '/getTimeStories' && req.method === 'GET') {
        getTimeStories((result) => {
            if (result.code === 'ENOTFOUND') {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                // send the error
                return res.end(responseError(result.message));
            }
            // response headers
            res.writeHead(200, { 'Content-Type': 'application/json' });
            // end the response and return it
            return res.end(responseSuccess(result));
        });
    }
});
