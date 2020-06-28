"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aufgabe09Server = void 0;
const Http = require("http");
const url = require("url");
var Aufgabe09Server;
(function (Aufgabe09Server) {
    console.log("Starting server");
    let port = Number(process.env.PORT);
    if (!port) {
        port = 8100;
    }
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);
    function handleListen() {
        console.log("Listening");
    }
    function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        let adresse = _request.url;
        let q = url.parse(adresse, true);
        let pathname = q.pathname;
        console.log(pathname);
        console.log("pathname = /html: " + (pathname == "/html"));
        console.log("pathname = /json: " + (pathname == "/json"));
        switch (_request.method) {
            //Post vorerst vernachlässigen, scheint unvollständig zu sein
            case "POST":
                let body = "";
                _request.on("data", data => {
                    body += data;
                });
                _request.on("end", async () => {
                    // tslint:disable-next-line: no-any
                    let post = JSON.parse(body);
                });
            case "GET":
                if (_request.url) {
                    if (pathname == "/json") {
                        let jsonString = JSON.stringify(q.query);
                        _response.write(jsonString);
                    }
                    else if (pathname == "/html") {
                        for (let key in q.query) {
                            _response.write(key + ": " + q.query[key] + "<br/>");
                        }
                    }
                }
        }
        _response.end();
    }
})(Aufgabe09Server = exports.Aufgabe09Server || (exports.Aufgabe09Server = {}));
//# sourceMappingURL=Server.js.map