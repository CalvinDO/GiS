import * as Http from "http";

export namespace A08Server {
    console.log("Starting server");

    //Den Port bekommen
    let port: number = Number(process.env.PORT);

    //Wenn es den Port nicht gibt, dann
    if (!port) {
        //setze ihn auf 8100
        port = 8100;
    }

    //Initialisiert den Server mithilfe von der Http-Extension
    let server: Http.Server = Http.createServer();

    //Den _events des Servers wird unter request und listen die entsprechenden Listeners hinzugrfügt

    //handleRequest wird ausgeführt, wenn eine neue Anfrage über den Port aufkommt
    server.addListener("request", handleRequest);
    //handleListen wird ausgeführt, wenn der Server komplett neu gestartet wird
    server.addListener("listening", handleListen);

    //Der Server empfängt("listened") nach Verbindungsanfragen auf dem Port
    server.listen(port);

    //Hier werden die Listener beschrieben

    function handleListen(): void {
        console.log("Listening");
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("I hear!");
        //Request und Respnse sind Http Datenpakete. Diese beiden Parameter, sind in ihrer Reihenfolge, für den request Listener des Servers absolut notwendig+

        //Die in der Bilddatei "ServerResponse.png" gezeigten Header "content-type" und "Access-Control-Allow-Origin" werden auf values gesetzt

        //Entity-Header
        _response.setHeader("content-type", "text/html; charset=utf-8");
        //Request-Header
        _response.setHeader("Access-Control-Allow-Origin", "*");

        for (let header of _response.getHeaderNames()) {
            //console.log(_response.getHeader(header));
        }

       

        //Vom Router auf der Webseite die url des _requests in Server-Konsole ausgeben lassen

        _response.write(_request.url);
         console.log(_request.url);
        _response.end();
    }
}