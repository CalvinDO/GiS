"use strict";
var Aufgabe09Server;
(function (Aufgabe09Server) {
    window.addEventListener("load", init);
    let formData;
    let button;
    let url = "http://localhost:8100";
    let responseDisplayDiv;
    function init(_event) {
        button = document.querySelector("button[type = button]");
        button.addEventListener("click", handleSubmit);
        loadDisplayDiv();
    }
    async function communicate(_url) {
        formData = new FormData(document.forms[0]);
        let query = new URLSearchParams(formData);
        _url += "?" + query.toString();
        // console.log("url:  " + url);
        let response = await fetch(_url);
        let responseText = await response.text();
        updateDisplayDiv(responseText);
        let responseJSON = JSON.parse(responseText);
        console.log(responseJSON);
        console.log("response:  " + responseText);
    }
    function updateDisplayDiv(_responseString) {
        responseDisplayDiv.innerHTML = _responseString;
    }
    function loadDisplayDiv() {
        responseDisplayDiv = document.querySelector("footer div");
        console.log(responseDisplayDiv);
    }
    function handleSubmit(_event) {
        communicate(url);
    }
})(Aufgabe09Server || (Aufgabe09Server = {}));
//# sourceMappingURL=Client.js.map