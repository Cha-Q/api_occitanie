// On va donc récupérer les éléments du DOM qui vont nous permettre l'affichage des 
// dynamique des évènements

let zone = document.querySelector("#zone");
let valider = document.querySelector("#button");
let commune = document.querySelector("#commune");


// Ici on va récupèrer une première Url qui va nous permettre de récupérer les noms des communes
// de la région Occitanie

const urlfull = "https://data.laregion.fr/api/records/1.0/search/?dataset=agendas-participatif-des-sorties-en-occitanie&q=&facet=type&facet=thematique&facet=date_debut&facet=commune";

async function happy(urlfull) {
    let response = await fetch(urlfull);
    let data = await response.json();

    select(data);
}

function select(data) {
    let ville = data.facet_groups[3].facets;
    for (let k in ville) {
        let ciudad = document.createElement("option");

        ciudad.textContent = ville[k].name;

        commune.appendChild(ciudad);
    }
}
happy(urlfull);


// déclaration d'une nouvelle url incomplète
const url = "https://data.laregion.fr/api/records/1.0/search/?dataset=agendas-participatif-des-sorties-en-occitanie&q=&facet=type&facet=thematique&facet=date_debut&facet=commune&refine.commune=";

// écouteur d'évènement sur le bouton valider.
valider.addEventListener("click", function() {

    let id = commune.value;
    let newUrl = `${url}${id}`;
    zone.innerHTML = " ";
    async function requestApi() {
        let response = await fetch(newUrl);
        let json = await response.json();

        ideeMB(json);
    }

    function ideeMB(json) {

        // On déclare une variable nous permettant de stocker le Json qui va
        // retourner les évènements
        let bonjour = json.records;

        // A chaque itération de i dans bonjour
        for (let i in bonjour) {

            let newZone = document.createElement("div");
            let event = document.createElement("p");
            let date = document.createElement("p");
            let titre = document.createElement("h3");
            let description = document.createElement("p");
            let adresse = document.createElement("p");
            let internet = document.createElement("iframe");

            date.style.fontStyle = "italic";

            let eventUrl = bonjour[i].fields.url;
            internet.setAttribute("src", eventUrl);
            titre.textContent = decodeHtml(bonjour[i].fields.titre);
            event.textContent = bonjour[i].fields.thematique;
            date.textContent = "Du " + bonjour[i].fields.date_debut + " au " + bonjour[i].fields.date_fin;
            description.textContent = decodeHtml(bonjour[i].fields.description);
            adresse.textContent = "Adresse : " + bonjour[i].fields.adresse;


            zone.appendChild(newZone);
            newZone.appendChild(titre);
            newZone.appendChild(date);
            newZone.appendChild(adresse);
            newZone.appendChild(event);
            newZone.appendChild(description);
            newZone.appendChild(internet);

        }


    }

    requestApi();
});

function decodeHtml(str) {
    var map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#8217;': "'",
        '&nbsp;': " "
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#8217;|&nbsp;/g, function(m) { return map[m]; });
}