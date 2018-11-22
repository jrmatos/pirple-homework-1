// dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// the server should respond to all requests with a string
const httpServer = http.createServer(serverHandler);

// start the server and have it listen on port 3000
httpServer.listen(3000, () => {
    console.log(`The server is listening on port ${3000}`);
});

function serverHandler(req, res) {
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object
    const queryStringObject = parsedUrl.query;

    // get headers
    const headers = req.headers;

    // get the HTTP method
    const method = req.method.toLowerCase();

    // get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', data => {
        buffer += decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        // choose the handler
        const chosenHandler = router.hasOwnProperty(trimmedPath) ? router[trimmedPath]: handlers.notFound;

        const data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        };

        // route the request to the handler
        chosenHandler(data, (statusCode = 200, payload = {}) => {
            const payloadString = JSON.stringify(payload);

            // set content-type
            res.setHeader('Content-Type', 'application/json');

            // set status code
            res.writeHead(statusCode);

            // send the response
            res.end(payloadString);

            // log the request
            console.log(`request received on path: ${trimmedPath}
                        method: ${method}
                        query: ${JSON.stringify(queryStringObject)}
                        headers: ${JSON.stringify(headers)}
                        payload: ${buffer}`);
        });
     
    });

}

// handlers
const handlers = {};

// hello handler
handlers.hello = (data, callback) => {
    callback(200, {message: 'hello world!'});
};

// not found
handlers.notFound = (data, callback) => {
    callback(404);
};

// router
const router = {
    'hello': handlers.hello
};