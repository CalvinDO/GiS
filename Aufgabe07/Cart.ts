namespace ShopJson {
    window.addEventListener("load", init);

    let productsWrapper: HTMLDivElement;
    let container: HTMLDivElement;
    let articleDiv: HTMLDivElement;
    let counterLi: HTMLLIElement;
    let totalPrice: number;
    let totalAmount: number;

    let removeAllButton: HTMLAnchorElement;
    let generateRandomButton: HTMLButtonElement;

    let colorAngle: number = 0;
    let colorOffset: number = 45;
    let strobeSpeed: number = 0.5;

    let allArticles: Article[];
    let randomAmount: number = 5;

    function init(_event: Event): void {
        productsWrapper = <HTMLDivElement>document.querySelector(".products");
        container = <HTMLDivElement>document.createElement("div");
        container.setAttribute("class", "product-category");

        productsWrapper.append(container);

        counterLi = <HTMLLIElement>document.querySelector(".counterCart");
        generateRandomButton = <HTMLButtonElement>document.querySelector("button");

        loadRemoveAllListener();
        generateRandomButton.addEventListener("click", handlePickRandom);


        loadForRandomPicker("Articles.json");
        updateArticles();
        animate();
    }

    async function loadForRandomPicker(_url: RequestInfo): Promise<void> {
        let response: Response = await fetch(_url);
        let categorysJSON: Article[][] = <Article[][]>await response.json();
        allArticles = [];
        for (let index: number = 0; index < categorysJSON.length; index++) {
            allArticles = allArticles.concat(categorysJSON[index]);
        }
    }

    export function updateArticles(): void {
        container.innerHTML = "";
        totalPrice = 0;
        totalAmount = 0;

        for (let index: number = 0; index < localStorage.length; index++) {
            let key: string = <string>localStorage.key(index);
            if (key != "cartAmount") {
                let articleJson: string = <string>localStorage.getItem(key);
                let parsed: Article = <Article>JSON.parse(articleJson);
                let article: Article = Article.createFromJSON(parsed);

                totalAmount += article.amount;
                totalPrice += article.price * article.amount;
                articleDiv = article.buildDiv(false);
                container.append(articleDiv);
            }
        }
        localStorage.setItem("cartAmount", totalAmount + "");
        updateCounter();
    }

    function loadRemoveAllListener(): void {
        removeAllButton = <HTMLAnchorElement>document.querySelector("#removeAll");
        removeAllButton.addEventListener("click", handleRemoveAll);
    }

    function updateCounter(): void {
        counterLi.setAttribute("style", totalPrice <= 0 ? "display:none !important" : "display:inline-block !important");
        counterLi.innerHTML = totalPrice <= 0 ? "" : totalPrice + "€";
        if (totalAmount <= 0) {
            container.innerHTML = "Der Einkaufswagen ist leer";
            container.style.font = "22px Arial, sans-serif";
        } else {
            container.style.removeProperty("font");
        }
    }

    function handleRemoveAll(_event: MouseEvent): void {
        localStorage.clear();
        updateArticles();
    }

    function animateGradients(): void {
        let offsetIndex: number = 0;
        let currentDiv: HTMLDivElement;
        let currentAmount: number = 0;
        let speed: number = 0;

        for (let index: number = 0; index < localStorage.length; index++) {
            let key: string = <string>localStorage.key(index);
            if (key != "cartAmount") {
                currentDiv = <HTMLDivElement>container.children[index - offsetIndex];
                let articleJson: string = <string>localStorage.getItem(key);
                let parsed: Article = <Article>JSON.parse(articleJson);

                currentAmount = parsed.amount;
                speed = currentAmount * strobeSpeed;

                let color1: string = "HSLA(" + colorAngle * speed + ",100%,50%, 1)";
                let color2: string = "HSLA(" + (colorAngle * speed + colorOffset) + ",100%,50%, 1)";
                currentDiv.style.backgroundImage = "linear-gradient(" + color1 + "," + color2 + ")";
            } else {
                offsetIndex++;
            }
        }
    }

    function animateRandomButton(): void {
        let color1: string = "HSLA(" + colorAngle * strobeSpeed * 10 + ",100%,50%, 1)";
        let color2: string = "HSLA(" + (colorAngle * strobeSpeed * 10 + colorOffset) + ",100%,50%, 1)";
        generateRandomButton.style.backgroundImage = "linear-gradient(" + color1 + "," + color2 + ")";
    }

    function handlePickRandom(_event: MouseEvent): void {
        let random: number;
        let randomInt: number = 0;

        for (let index: number = 0; index < randomAmount; index++) {
            random = Math.random() * allArticles.length;
            randomInt = Math.floor(random);
            let pickedArticle: Article = allArticles[randomInt];

            let establishArticle: Article = <Article>JSON.parse(<string>localStorage.getItem(pickedArticle.name));
            if (establishArticle == null) {
                pickedArticle.amount = 1;
            } else {
                pickedArticle.amount = establishArticle.amount + 1;
            }
            localStorage.setItem(pickedArticle.name, JSON.stringify(pickedArticle));
        }
        updateArticles();
    }

    function animate(): void {
        colorAngle++;

        animateGradients();
        animateRandomButton();

        requestAnimationFrame(animate);
    }
}