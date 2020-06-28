"use strict";
var Aufgabe09Server;
(function (Aufgabe09Server) {
    window.addEventListener("load", init);
    let formData;
    let buttonHTML;
    let buttonJSON;
    let baseUrl = "http://localhost:8100";
    let responseDisplayDiv;
    function init(_event) {
        buttonJSON = document.querySelector("#json");
        buttonJSON.addEventListener("click", handleSubmitJSON);
        buttonHTML = document.querySelector("#html");
        buttonHTML.addEventListener("click", handleSubmitHTML);
        loadDisplayDiv();
    }
    async function communicate(_sendURL, _isHTML) {
        formData = new FormData(document.forms[0]);
        // tslint:disable-next-line: no-any
        let query = new URLSearchParams(formData);
        _sendURL += _isHTML ? "/html" : "/json";
        _sendURL += "?" + query.toString();
        console.log("url:  " + _sendURL);
        let response = await fetch(_sendURL);
        let responseText = await response.text();
        updateDisplayDiv(responseText);
        if (!_isHTML) {
            let responseJSON = JSON.parse(responseText);
            console.log(responseJSON);
        }
        console.log("response:  " + responseText);
    }
    function updateDisplayDiv(_responseString) {
        responseDisplayDiv.innerHTML = _responseString;
    }
    function loadDisplayDiv() {
        responseDisplayDiv = document.querySelector("footer div");
        console.log(responseDisplayDiv);
    }
    function handleSubmitJSON(_event) {
        communicate(baseUrl, false);
    }
    function handleSubmitHTML(_event) {
        communicate(baseUrl, true);
    }
})(Aufgabe09Server || (Aufgabe09Server = {}));
//# sourceMappingURL=Client.js.map