import * as Http from "http";
import * as url from "url";

import { ParsedUrlQuery } from "querystring";

export namespace Aufgabe09Server {
    console.log("Starting server");

    //Den Port bekommen
    let port: number = Number(process.env.PORT);

    //Wenn es den Port nicht gibt, dann
    if (!port) {
        //setze ihn auf 8100
        port = 8100;
    }
    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);

    server.addListener("listening", handleListen);

    //Der Server empfängt("listened") nach Verbindungsanfragen auf dem Port
    server.listen(port);

    //Hier werden die Listener beschrieben

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
        //_response.write(pathname);

        console.log("pathname = /html: " + (pathname == "/html"));
        console.log("pathname = /json: " + (pathname == "/json"));

        if (_request.url) {
            if (pathname == "/json") {
                let jsonString: string = JSON.stringify(q.query);
                _response.write(jsonString);
            } else if (pathname == "/html") {
                for (let key in q.query) {
                   // console.log(key + ": " + q.query[key]);
                   // _response.write("|||...|||");
                    _response.write(key + ": " + q.query[key] + "<br/>");
                }
            }
        }
        _response.end();

        /*
         //  console.log("iterate through q.query keys -->");
            for (let key in q.query) {
                console.log(key + ": " + q.query[key]);
                _response.write("|||...|||");
                _response.write(key + ": " + q.query[key] + "<br/>");
            }
            */
        /*
        let qdata: ParsedUrlQuery = q.query;
         _response.write("q.host: " + q.host + "<br/>");
         _response.write("q.pathname: " + q.pathname + "<br/>");
         _response.write("q.search: " + q.search + "<br/>");
 */
    }
}