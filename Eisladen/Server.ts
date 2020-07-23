import * as Http from "http";
import * as url from "url";
import * as Mongo from "mongodb";

export namespace Eisladen {
    interface IceData {
        [type: string]: string | string[];
    }

    let iceDataCollection: Mongo.Collection;

    let port: string | number | undefined = Number(process.env.PORT);

    if (!port) {
        port = 8100;
    }

    let databaseURLs: string[] = ["mongodb://localhost:27017", "mongodb+srv://CalvinDO:gismongo@dercalvino.d1jir.mongodb.net/Test?retryWrites=true&w=majority"];

    startServer(port);
    connectToDatabse(databaseURLs);

    async function connectToDatabse(_databaseURLs: string[]): Promise<void> {
        let url: string;
        switch (process.argv.slice(2)[0]) {
            case "local":
                console.log("local database is being used");
                url = databaseURLs[0];
                break;
            case "remote":
                console.log("remote database is being used");
                url = databaseURLs[1];
                break;
            default:
                console.log("Input not readable. Instead, LOCAL is being used.");
                url = databaseURLs[0];
        }

        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(url, options);
        await mongoClient.connect();

        iceDataCollection = mongoClient.db("Eisladen").collection("Orders");
        console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
        console.log("database connection: ", iceDataCollection != undefined);
        console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
    }

    function startServer(_port: number | string): void {
        let server: Http.Server = Http.createServer();
        console.log("server starting on port: " + _port);
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);

        server.listen(_port);
    }

    function handleListen(): void {
        console.log("Listening");
    }
    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        let adresse: string = <string>_request.url;

        console.log(adresse);
        let q: url.UrlWithParsedQuery = url.parse(adresse, true);

        let pathname: string = <string>q.pathname;

        console.log("Requested");

        console.log("|||||||Pathname:    " + q.pathname + "    ||||||");
        console.log("|||||||Query:   " + JSON.stringify(q.query) + "   ||||||");


        switch (pathname) {
            case "/get":
                console.log("get received");
                _response.write(JSON.stringify(await retrieveIceData(_response)));
                break;
            case "/set":
                console.log("set received");
                storeData(<IceData>q.query);
                break;
            case "/reset":
                console.log("reset reset reset alarm");
                iceDataCollection.drop();
                break;
            default:
                console.log("default");
        }
        _response.end();
    }
    function storeData(_order: IceData): void {
        iceDataCollection.insertOne(_order);
    }

    async function retrieveIceData(_response: Http.ServerResponse): Promise<IceData[]> {
        let output: IceData[] = await iceDataCollection.find().toArray();
        return output;
    }
}