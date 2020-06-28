import * as Http from "http";
import * as url from "url";

export namespace Aufgabe09Server {
    console.log("Starting server");

    let port: number = Number(process.env.PORT);

    if (!port) {
        port = 8100;
    }

    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);

    server.addListener("listening", handleListen);

    server.listen(port);

    function handleListen(): void {
        console.log("Listening");
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        let adresse: string = <string>_request.url;
        let q: url.UrlWithParsedQuery = url.parse(adresse, true);
        let pathname: string = <string>q.pathname;

        console.log(pathname);

        console.log("pathname = /html: " + (pathname == "/html"));
        console.log("pathname = /json: " + (pathname == "/json"));

        if (_request.url) {
            if (pathname == "/json") {
                let jsonString: string = JSON.stringify(q.query);
                _response.write(jsonString);
            } else if (pathname == "/html") {
                for (let key in q.query) {
                    _response.write(key + ": " + q.query[key] + "<br/>");
                }
            }
        }
        _response.end();
    }
}