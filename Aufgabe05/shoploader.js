"use strict";
var Shop;
(function (Shop) {
    function main() {
        let categorys = [];
        let articlesScheite = [];
        articlesScheite.push(new Shop.Article("Saison-Zylinder", "Gerade zu dieser Jahreszeit sticht der Saison-Zylinder mit seiner Form heraus", "Saison.jpg", 20));
        articlesScheite.push(new Shop.Article("Günstig-Faser", "Für ganz besonders orthodoxe Sparfüchse hält diese Günstig-Faser immer etwas parat", "Billig.jpg", 5));
        articlesScheite.push(new Shop.Article("Öko-Ast", "Mit diesem Öko-Ast helfen Sie der Umwelt und sich selbst", "Öko.jpg", 40));
        articlesScheite.push(new Shop.Article("Verziert-Pfahl", "Verziert-Pfahl - Da man sich ja sonst nichts gönnt", "Verziert.jpg", 200));
        categorys.push(articlesScheite);
        let articlesPellets = [];
        articlesPellets.push(new Shop.Article("Gerade-Stiel", "Der Gerade-Stiel gibt Ihrem Kamin einen ganz besonderen Look", "gerade.jpg", 10));
        articlesPellets.push(new Shop.Article("Krumm-Säbel", "Vorsicht - scharf! Der Krumm-Säbel wird außerordentliche Performance leisten. Aber wie immer gilt: Nichts beschädigen", "krumm.jpg", 15));
        articlesPellets.push(new Shop.Article("Kurz-Stempel", "Auf den Kurz-Stempel können Sie sich vielleicht sogar setzten!", "kurz.jpeg", 10));
        articlesPellets.push(new Shop.Article("Big-Brownie", "Zum anbeißen!", "big.jpg", 50));
        categorys.push(articlesPellets);
        let articlesSpäne = [];
        articlesSpäne.push(new Shop.Article("Raspel-Grob", "Für herbe Typen", "grob.jpg", 4));
        articlesSpäne.push(new Shop.Article("Haar-Fein", "Für selbstbewusste Haarpflege-Experten", "haar.jpg", 18));
        articlesSpäne.push(new Shop.Article("Rot-Wunder", "Nun mit dem Rot-Wunder in die absolute Farbenexplosion starten!", "rot.jpg", 20));
        articlesSpäne.push(new Shop.Article("Raspel-Eule", "Eine Eule aus Holzspänen! Was wollen Sie denn noch??", "eule.jpg", 58043));
        categorys.push(articlesSpäne);
        let productsDiv;
        for (let category of categorys) {
            console.log(categorys.indexOf(category));
            switch (categorys.indexOf(category)) {
                case 0:
                    productsDiv = document.querySelector("#Holzscheite + .product-category");
                    break;
                case 1:
                    productsDiv = document.querySelector("#Holzpellets + .product-category");
                    break;
                case 2:
                    productsDiv = document.querySelector("#Holzspäne + .product-category");
                    break;
                case 3:
                    productsDiv = document.querySelector("#More + .product-category");
                    break;
                default: productsDiv = document.querySelector(".products:last-child");
            }
            for (let article of category) {
                productsDiv.append(article.buildDiv());
            }
        }
    }
    main();
})(Shop || (Shop = {}));
//# sourceMappingURL=Shoploader.js.map