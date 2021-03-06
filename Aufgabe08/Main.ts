namespace Server {
    window.addEventListener("load", init);
    let formData: FormData;
    let button: HTMLButtonElement;

    function init(_event: Event): void {
        button = <HTMLButtonElement>document.querySelector("button");
        button.addEventListener("click", handleSubmit);
    }

    async function communicate(_url: RequestInfo): Promise<void> {
        formData = new FormData(document.forms[0]);
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        _url += "?" + query.toString();

        console.log(_url);
        let response: Response = await fetch(_url);
        console.log(await response.text());
    }

    function handleSubmit(_event: MouseEvent): void {
        console.log("1");
        communicate("https://dercalvino.herokuapp.com/");
        console.log("2");
    }
}