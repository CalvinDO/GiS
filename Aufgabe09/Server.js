"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aufgabe09Server = void 0;
const Http = require("http");
const url = require("url");
var Aufgabe09Server;
(function (Aufgabe09Server) {
    console.log("Starting server");
    //Den Port bekommen
    let port = Number(process.env.PORT);
    //Wenn es den Port nicht gibt, dann
    if (!port) {
        //setze ihn auf 8100
        port = 8100;
    }
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    //Der Server empfängt("listened") nach Verbindungsanfragen auf dem Port
    server.listen(port);
    //Hier werden die Listener beschrieben
    function handleListen() {
        console.log("Listening");
    }
    function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        let adresse = _request.url;
        let q = url.parse(adresse, true);
        console.log("iterate through q.query keys -->");
        if (_request.url) {
            /*
             for (let key in q.query) {
                 console.log(key + ": " + q.query[key]);
                 _response.write("|||...|||");
                 _response.write(key + ": " + q.query[key] + "<br/>");
             }
             */
            let jsonString = JSON.stringify(q.query);
            _response.write(jsonString);
        }
        _response.end();
        /*
        let qdata: ParsedUrlQuery = q.query;
         _response.write("q.host: " + q.host + "<br/>");
         _response.write("q.pathname: " + q.pathname + "<br/>");
         _response.write("q.search: " + q.search + "<br/>");
 */
    }
})(Aufgabe09Server = exports.Aufgabe09Server || (exports.Aufgabe09Server = {}));
//# sourceMappingURL=Server.js.map