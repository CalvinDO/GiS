"use strict";
var ShopInteractive;
(function (ShopInteractive) {
    window.addEventListener("load", init);
    ShopInteractive.articleCount = 0;
    ShopInteractive.priceCount = 0;
    let scheiteDiv;
    let pelletsDiv;
    let späneDiv;
    function init(_event) {
        loadArticles();
        loadNavListeners();
        loadSearchListener();
    }
    function loadArticles() {
        let categorys = [];
        let articlesScheite = [];
        articlesScheite.push(new ShopInteractive.Article("Saison-Zylinder", "Gerade zu dieser Jahreszeit sticht der Saison-Zylinder mit seiner Form heraus", "Saison.jpg", 20));
        articlesScheite.push(new ShopInteractive.Article("Günstig-Faser", "Für ganz besonders orthodoxe Sparfüchse hält diese Günstig-Faser immer etwas parat", "Billig.jpg", 5));
        articlesScheite.push(new ShopInteractive.Article("Öko-Ast", "Mit diesem Öko-Ast helfen Sie der Umwelt und sich selbst", "Öko.jpg", 40));
        articlesScheite.push(new ShopInteractive.Article("Verziert-Pfahl", "Verziert-Pfahl - Da man sich ja sonst nichts gönnt", "Verziert.jpg", 200));
        categorys.push(articlesScheite);
        let articlesPellets = [];
        articlesPellets.push(new ShopInteractive.Article("Gerade-Stiel", "Der Gerade-Stiel gibt Ihrem Kamin einen ganz besonderen Look", "gerade.jpg", 10));
        articlesPellets.push(new ShopInteractive.Article("Krumm-Säbel", "Vorsicht - scharf! Der Krumm-Säbel wird außerordentliche Performance leisten. Aber wie immer gilt: Nichts beschädigen", "krumm.jpg", 15));
        articlesPellets.push(new ShopInteractive.Article("Kurz-Stempel", "Auf den Kurz-Stempel können Sie sich vielleicht sogar setzten!", "kurz.jpeg", 10));
        articlesPellets.push(new ShopInteractive.Article("Big-Brownie", "Zum anbeißen!", "big.jpg", 50));
        categorys.push(articlesPellets);
        let articlesSpäne = [];
        articlesSpäne.push(new ShopInteractive.Article("Raspel-Grob", "Für herbe Typen", "grob.jpg", 4));
        articlesSpäne.push(new ShopInteractive.Article("Haar-Fein", "Für selbstbewusste Haarpflege-Experten", "haar.jpg", 18));
        articlesSpäne.push(new ShopInteractive.Article("Rot-Wunder", "Nun mit dem Rot-Wunder in die absolute Farbenexplosion starten!", "rot.jpg", 20));
        articlesSpäne.push(new ShopInteractive.Article("Raspel-Eule", "Eine Eule aus Holzspänen! Was wollen Sie denn noch??", "eule.jpg", 58043));
        categorys.push(articlesSpäne);
        let productsDiv = document.createElement("div");
        //let wagenCounter: HTMLParagraphElement = <HTMLParagraphElement>document.querySelector("#Holzscheite + .product-category");
        for (let category of categorys) {
            switch (categorys.indexOf(category)) {
                case 0:
                    productsDiv = document.querySelector("#Holzscheite + .product-category");
                    scheiteDiv = productsDiv;
                    break;
                case 1:
                    productsDiv = document.querySelector("#Holzpellets + .product-category");
                    pelletsDiv = productsDiv;
                    break;
                case 2:
                    productsDiv = document.querySelector("#Holzspäne + .product-category");
                    späneDiv = productsDiv;
                    break;
                default: productsDiv = document.querySelector(".products:last-child");
            }
            for (let article of category) {
                productsDiv.append(article.buildDiv());
            }
        }
    }
    function loadNavListeners() {
        let navButton;
        let logo = document.querySelector("h1>a");
        logo.addEventListener("click", handleClickCategory.bind(logo));
        for (let liIndex = 1; liIndex < 4; liIndex++) {
            navButton = document.querySelector(".nav-list li:nth-child(" + liIndex + ") a");
            navButton.addEventListener("click", handleClickCategory.bind(navButton));
        }
    }
    function loadSearchListener() {
        let searchButton;
        searchButton = document.querySelector("li:last-child a");
        searchButton.addEventListener("click", handleClickSearch);
    }
    function handleClickSearch(_event) {
        console.log("clickSearch");
    }
    function handleClickCategory(_click) {
        console.log(this.getAttribute("href"));
        let clickedAtt = this.getAttribute("href");
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
    function showAll() {
        scheiteDiv.style.display = "flex";
        pelletsDiv.style.display = "flex";
        späneDiv.style.display = "flex";
    }
    function showScheite() {
        scheiteDiv.style.display = "flex";
        pelletsDiv.style.display = "none";
        späneDiv.style.display = "none";
    }
    function showPellets() {
        scheiteDiv.style.display = "none";
        pelletsDiv.style.display = "flex";
        späneDiv.style.display = "none";
    }
    function showSpäne() {
        scheiteDiv.style.display = "none";
        pelletsDiv.style.display = "none";
        späneDiv.style.display = "flex";
    }
})(ShopInteractive || (ShopInteractive = {}));
//# sourceMappingURL=shoploader.js.map