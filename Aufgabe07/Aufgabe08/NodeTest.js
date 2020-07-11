"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A08Server = void 0;
const Http = require("http");
var A08Server;
(function (A08Server) {
    console.log("Starting server");
    //Den Port bekommen
    let port = Number(process.env.PORT);
    //Wenn es den Port nicht gibt, dann
    if (!port) {
        //setze ihn auf 8100
        port = 8100;
    }
    //Initialisiert den Server mithilfe von der Http-Extension
    let server = Http.createServer();
    //Den _events des Servers wird unter request und listen die entsprechenden Listeners hinzugrfügt
    //handleRequest wird ausgeführt, wenn eine neue Anfrage über den Port aufkommt
    server.addListener("request", handleRequest);
    //handleListen wird ausgeführt, wenn der Server komplett neu gestartet wird
    server.addListener("listening", handleListen);
    //Der Server empfängt("listened") nach Verbindungsanfragen auf dem Port
    server.listen(port);
    //Hier werden die Listener beschrieben
    function handleListen() {
        console.log("Listening");
    }
    function handleRequest(_request, _response) {
        console.log("I hear!");
        //Request und Respnse sind Http Datenpakete. Diese beiden Parameter, sind in ihrer Reihenfolge, für den request Listener des Servers absolut notwendig+
        //Die in der Bilddatei "ServerResponse.png" gezeigten Header "content-type" und "Access-Control-Allow-Origin" werden auf values gesetzt
        //Entity-Header
        _response.setHeader("content-type", "text/html; charset=utf-8");
        //Request-Header
        _response.setHeader("Access-Control-Allow-Origin", "*");
        //Vom Router auf der Webseite die url des _requests in Server-Konsole ausgeben lassen
        _response.write(_request.url);
        console.log(_request.url);
        _response.end();
    }
})(A08Server = exports.A08Server || (exports.A08Server = {}));
//# sourceMappingURL=NodeTest.js.map