namespace ShopInteractive {

    window.addEventListener("load", init);

    export let articleCount: number = 0;
    export let priceCount: number = 0;

    let scheiteDiv: HTMLDivElement;
    let pelletsDiv: HTMLDivElement;
    let späneDiv: HTMLDivElement;

    let categorys: Article[][] = [];
    let articlesScheite: Article[] = [];

    function init(_event: Event): void {
        loadArticles();
        loadNavListeners();
        loadSearchListener();
    }

    function loadArticles(): void {
        articlesScheite.push(new Article("Saison-Zylinder", "Gerade zu dieser Jahreszeit sticht der Saison-Zylinder mit seiner Form heraus", "Saison.jpg", 20));
        articlesScheite.push(new Article("Günstig-Faser", "Für ganz besonders orthodoxe Sparfüchse hält diese Günstig-Faser immer etwas parat", "Billig.jpg", 5));
        articlesScheite.push(new Article("Öko-Ast", "Mit diesem Öko-Ast helfen Sie der Umwelt und sich selbst", "Öko.jpg", 40));
        articlesScheite.push(new Article("Verziert-Pfahl", "Verziert-Pfahl - Da man sich ja sonst nichts gönnt", "Verziert.jpg", 200));

        categorys.push(articlesScheite);

        let articlesPellets: Article[] = [];
        articlesPellets.push(new Article("Gerade-Stiel", "Der Gerade-Stiel gibt Ihrem Kamin einen ganz besonderen Look", "gerade.jpg", 10));
        articlesPellets.push(new Article("Krumm-Säbel", "Vorsicht - scharf! Der Krumm-Säbel wird außerordentliche Performance leisten. Aber wie immer gilt: Nichts beschädigen", "krumm.jpg", 15));
        articlesPellets.push(new Article("Kurz-Stempel", "Auf den Kurz-Stempel können Sie sich vielleicht sogar setzten!", "kurz.jpeg", 10));
        articlesPellets.push(new Article("Big-Brownie", "Zum anbeißen!", "big.jpg", 50));

        categorys.push(articlesPellets);

        let articlesSpäne: Article[] = [];
        articlesSpäne.push(new Article("Raspel-Grob", "Für herbe Typen", "grob.jpg", 4));
        articlesSpäne.push(new Article("Haar-Fein", "Für selbstbewusste Haarpflege-Experten", "haar.jpg", 18));
        articlesSpäne.push(new Article("Rot-Wunder", "Nun mit dem Rot-Wunder in die absolute Farbenexplosion starten!", "rot.jpg", 20));
        articlesSpäne.push(new Article("Raspel-Eule", "Eine Eule aus Holzspänen! Was wollen Sie denn noch??", "eule.jpg", 58043));

        categorys.push(articlesSpäne);

        let productsDiv: HTMLDivElement = document.createElement("div");

        for (let category of categorys) {
            switch (categorys.indexOf(category)) {
                case 0:
                    productsDiv = <HTMLDivElement>document.querySelector("#Holzscheite + .product-category");
                    scheiteDiv = productsDiv;
                    break;
                case 1:
                    productsDiv = <HTMLDivElement>document.querySelector("#Holzpellets + .product-category");
                    pelletsDiv = productsDiv;
                    break;
                case 2:
                    productsDiv = <HTMLDivElement>document.querySelector("#Holzspäne + .product-category");
                    späneDiv = productsDiv;
                    break;
                default:
                    productsDiv = <HTMLDivElement>document.querySelector(".products:last-child");
                    break;
            }
            for (let article of category) {
                productsDiv.append(article.buildDiv());
            }
        }
    }

    function loadNavListeners(): void {
        let navButton: HTMLAnchorElement;
        let logo: HTMLAnchorElement = <HTMLAnchorElement>document.querySelector("h1>a");
        logo.addEventListener("click", handleClickCategory.bind(logo));
        for (let liIndex: number = 1; liIndex < 4; liIndex++) {
            navButton = <HTMLAnchorElement>document.querySelector(".nav-list li:nth-child(" + liIndex + ") a");
            navButton.addEventListener("click", handleClickCategory.bind(navButton));
        }
    }

    function loadSearchListener(): void {
        let searchButton: HTMLAnchorElement;
        let searchInput: HTMLInputElement = <HTMLInputElement>document.querySelector("nav input");
        searchButton = <HTMLAnchorElement>document.querySelector("li:last-child a");
        searchButton.addEventListener("click", handleClickSearch.bind(searchInput));
    }

    function handleClickSearch(this: HTMLInputElement, _event: MouseEvent): void {
        showElementsContaining(this.value);
    }

    function showElementsContaining(_substring: string): void {
        console.log(_substring);
        let searchRegEx: RegExp = new RegExp(_substring.toLowerCase());


        let name: string;
        let description: string;
        let bothKonkat: string;

        let articleDiv: HTMLDivElement;
        let catIndex: number;
        let aIndex: number;

        let match: boolean;
        for (let category of categorys) {
            for (let article of category) {
                name = article.name;
                description = article.description;
                bothKonkat = name + description;
                aIndex = category.indexOf(article) + 1;
                catIndex = categorys.indexOf(category) + 2;
                articleDiv = <HTMLDivElement>document.querySelector("#" + name);
                console.log(articleDiv);

                match = searchRegEx.test(bothKonkat.toLowerCase());
                articleDiv.style.display = match ? "flex" : "none";

            }
        }
    }

    function handleClickCategory(this: HTMLAnchorElement, _click: MouseEvent): void {
        let clickedAtt: string = <string>this.getAttribute("href");
        switch (clickedAtt) {
            case "#Startseite":
                showAll();
                break;
            case "#Holzscheite":
                showScheite();
                break;
            case "#Holzpellets":
                showPellets();
                break;
            case "#Holzspäne":
                showSpäne();
                break;
        }
    }

    function showAll(): void {
        scheiteDiv.style.display = "flex";
        pelletsDiv.style.display = "flex";
        späneDiv.style.display = "flex";
    }

    function showScheite(): void {
        scheiteDiv.style.display = "flex";
        pelletsDiv.style.display = "none";
        späneDiv.style.display = "none";
    }

    function showPellets(): void {
        scheiteDiv.style.display = "none";
        pelletsDiv.style.display = "flex";
        späneDiv.style.display = "none";
    }

    function showSpäne(): void {
        scheiteDiv.style.display = "none";
        pelletsDiv.style.display = "none";
        späneDiv.style.display = "flex";
    }
}
