namespace Aufgabe09Server {

    window.addEventListener("load", init);
    let formData: FormData;
    let buttonGet: HTMLButtonElement;
    let buttonSet: HTMLButtonElement;
    let buttonResetDB: HTMLButtonElement;

    //let baseUrl: string = "http://localhost:8100";
    let baseUrl: string = "https://dercalvino.herokuapp.com";

    let responseDisplayDiv: HTMLDivElement;

    function init(_event: Event): void {
        buttonGet = <HTMLButtonElement>document.querySelector("#getData");
        buttonGet.addEventListener("click", handleButtons);
        buttonSet = <HTMLButtonElement>document.querySelector("#setData");
        buttonSet.addEventListener("click", handleButtons);
        buttonResetDB = <HTMLButtonElement>document.querySelector("#resetDatabase");
        buttonResetDB.addEventListener("click", handleButtons);

        loadDisplayDiv();
    }

    async function communicate(_sendURL: RequestInfo, _isRetrieve: Pathnames): Promise<void> {
        formData = new FormData(document.forms[0]);
        // tslint:disable-next-line: no-any
        let query: URLSearchParams = new URLSearchParams(<any>formData);

        _sendURL += "/";
        _sendURL += "" + Pathnames[_isRetrieve];
        _sendURL += "?" + query.toString();

        console.log("url:  " + _sendURL);

        let response: Response = await fetch(_sendURL);
        let responseText: string = await response.text();

        updateDisplayDiv(responseText);

        console.log("response:  " + responseText);
    }

    function updateDisplayDiv(_responseString: string): void {
        responseDisplayDiv.innerHTML = _responseString;
    }

    function loadDisplayDiv(): void {
        responseDisplayDiv = <HTMLDivElement>document.querySelector("footer div");
    }
    function handleButtons(_event: MouseEvent): void {
        let targetButton: HTMLButtonElement = <HTMLButtonElement>_event.target;
        let id: string = targetButton.id;
        switch (id) {
            case "setData":
                communicate(baseUrl, Pathnames.set);
                break;
            case "getData":
                communicate(baseUrl, Pathnames.get);
                break;
            case "resetDatabase":
                console.log("reset reset reset alarm");
                communicate(baseUrl, Pathnames.reset);
                break;
        }
    }
}
