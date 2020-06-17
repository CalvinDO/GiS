namespace Server {
    window.addEventListener("load", init);
    let formData: FormData;
    let button: HTMLButtonElement;

    function init(_event: Event): void {
        button = <HTMLButtonElement>document.querySelector("button");
        button.addEventListener("click", handleSubmit);

        /*
        for (let entry of formData) {
            console.log(entry[0] + ": " + entry[1]);
        }
        */
    }

    async function communicate(_url: RequestInfo): Promise<void> {
        formData = new FormData(document.forms[0]);
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        _url += _url + "?" + query.toString();


        for (let entry of query) {
            console.log(entry[0] + ": " + entry[1]);
        }
        console.log(_url);
        await fetch(_url);
    }

    function handleSubmit(_event: MouseEvent): void {

        console.log("1");
        communicate("https://gis-example.herokuapp.com/");
        console.log("2");
    }
}