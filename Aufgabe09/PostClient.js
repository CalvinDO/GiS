"use strict";
var Aufgabe09Server;
(function (Aufgabe09Server) {
    window.addEventListener("load", init);
    let formData;
    let buttonPost;
    let baseUrl = "https://dercalvino.herokuapp.com";
    let responseDisplayDiv;
    function init(_event) {
        buttonPost = document.querySelector("button[type = button]");
        buttonPost.addEventListener("click", handleSubmitPOST);
        loadDisplayDiv();
    }
    async function communicate(_sendURL) {
        formData = new FormData(document.forms[0]);
        // tslint:disable-next-line: no-any
        let query = new URLSearchParams(formData);
        //_sendURL += "?" + query.toString();
        console.log("url:  " + _sendURL);
        //let response: Response = await fetch(_sendURL);
        let response = await fetch(_sendURL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: JSON.stringify(formData)
        });
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
    function handleSubmitPOST(_event) {
        communicate(baseUrl);
    }
})(Aufgabe09Server || (Aufgabe09Server = {}));
//# sourceMappingURL=PostClient.js.map