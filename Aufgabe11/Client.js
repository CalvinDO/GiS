"use strict";
var Aufgabe09Server;
(function (Aufgabe09Server) {
    window.addEventListener("load", init);
    let formData;
    let buttonGet;
    let buttonSet;
    let buttonResetDB;
    //let baseUrl: string = "http://localhost:8100";
    let baseUrl = "https://dercalvino.herokuapp.com";
    let responseDisplayDiv;
    function init(_event) {
        buttonGet = document.querySelector("#getData");
        buttonGet.addEventListener("click", handleButtons);
        buttonSet = document.querySelector("#setData");
        buttonSet.addEventListener("click", handleButtons);
        buttonResetDB = document.querySelector("#resetDatabase");
        buttonResetDB.addEventListener("click", handleButtons);
        loadDisplayDiv();
    }
    async function communicate(_sendURL, _isRetrieve) {
        formData = new FormData(document.forms[0]);
        // tslint:disable-next-line: no-any
        let query = new URLSearchParams(formData);
        _sendURL += "/";
        _sendURL += "" + Aufgabe09Server.Pathnames[_isRetrieve];
        _sendURL += "?" + query.toString();
        console.log("url:  " + _sendURL);
        let response = await fetch(_sendURL);
        let responseText = await response.text();
        updateDisplayDiv(responseText);
        console.log("response:  " + responseText);
    }
    function updateDisplayDiv(_responseString) {
        responseDisplayDiv.innerHTML = _responseString;
    }
    function loadDisplayDiv() {
        responseDisplayDiv = document.querySelector("footer div");
    }
    function handleButtons(_event) {
        let targetButton = _event.target;
        let id = targetButton.id;
        switch (id) {
            case "setData":
                communicate(baseUrl, Aufgabe09Server.Pathnames.set);
                break;
            case "getData":
                communicate(baseUrl, Aufgabe09Server.Pathnames.get);
                break;
            case "resetDatabase":
                console.log("reset reset reset alarm");
                communicate(baseUrl, Aufgabe09Server.Pathnames.reset);
                break;
        }
    }
})(Aufgabe09Server || (Aufgabe09Server = {}));
//# sourceMappingURL=Client.js.map