"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Aufgabe09Server = void 0;
const Http = require("http");
const url = require("url");
const Mongo = require("mongodb");
var Aufgabe09Server;
(function (Aufgabe09Server) {
    let loginDataCollection;
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
                console.log("Input not readable. Instead, local is being used.");
                url = databaseURLs[0];
        }
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(url, options);
        await mongoClient.connect();
        loginDataCollection = mongoClient.db("Test").collection("Students");
        console.log("|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
        console.log("database connection: ", loginDataCollection != undefined);
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
                await retrieveLoginData(_response);
                break;
            case "/set":
                console.log("set received");
                storeData(q.query);
                break;
            case "/reset":
                console.log("reset reset reset alarm");
                loginDataCollection.drop();
                break;
            default:
                console.log("default");
        }
        _response.end();
    }
    function storeData(_order) {
        loginDataCollection.insertOne(_order);
    }
    async function retrieveLoginData(_response) {
        let output = await loginDataCollection.find().toArray();
        for (let index = 0; index < output.length; index++) {
            if (output[index]) {
                _response.write("|---|||---| <br/>");
                let current = output[index];
                console.log(current + "");
                for (let key in current) {
                    console.log(key + ": " + current[key].toString() + " <br/>");
                    _response.write(key + ": " + JSON.stringify(current[key]) + " <br/>");
                }
                _response.write("|---|||---| <br/>");
            }
        }
        _response.end();
        return output;
    }
})(Aufgabe09Server = exports.Aufgabe09Server || (exports.Aufgabe09Server = {}));
//# sourceMappingURL=Server.js.map