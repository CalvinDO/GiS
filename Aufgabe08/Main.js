"use strict";
var Server;
(function (Server) {
    window.addEventListener("load", init);
    let formData;
    let button;
    function init(_event) {
        button = document.querySelector("button");
        button.addEventListener("click", handleSubmit);
    }
    async function communicate(_url) {
        formData = new FormData(document.forms[0]);
        let query = new URLSearchParams(formData);
        _url += "?" + query.toString();
        console.log(_url);
        for (let entry of query) {
            console.log(entry[0] + ": " + entry[1]);
        }
        let response = await fetch(_url);
        console.log(await response.text());
    }
    function handleSubmit(_event) {
        console.log("1");
        communicate("https://gis-example.herokuapp.com/");
        console.log("2");
    }
})(Server || (Server = {}));
//# sourceMappingURL=Main.js.map