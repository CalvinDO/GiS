"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eisladen = void 0;
const Http = require("http");
const url = require("url");
const Mongo = require("mongodb");
var Eisladen;
(function (Eisladen) {
    let iceDataCollection;
    let port = Number(process.env.PORT);
    if (!port) {
        port = 8100;
    }
    let databaseURLs = ["mongodb://localhost:27017", "mongodb+srv://CalvinDO:gismongo@dercalvino.d1jir.mongodb.net/Test?retryWrites=true&w=majority"];
    startServer(port);
    connectToDatabse(databaseURLs);
    async function connectToDatabse(_databaseURLs) {
        let url;
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
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(url, options);
        await mongoClient.connect();
        iceDataCollection = mongoClient.db("Eisladen").collection("Orders");
        console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
        console.log("database connection: ", iceDataCollection != undefined);
        console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
    }
    function startServer(_port) {
        let server = Http.createServer();
        console.log("server starting on port: " + _port);
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(_port);
    }
    function handleListen() {
        console.log("Listening");
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        let adresse = _request.url;
        console.log(adresse);
        let q = url.parse(adresse, true);
        let pathname = q.pathname;
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
                storeData(q.query);
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
    function storeData(_order) {
        iceDataCollection.insertOne(_order);
    }
    async function retrieveIceData(_response) {
        let output = await iceDataCollection.find().toArray();
        return output;
    }
})(Eisladen = exports.Eisladen || (exports.Eisladen = {}));
//# sourceMappingURL=Server.js.map