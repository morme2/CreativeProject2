var accountID = "";
var results = "";
const key = "RGAPI-8a427a1c-8cc0-4a1f-a44d-d77179fe1a45";
var championJson = "";

document.getElementById("summonerSubmit").addEventListener("click", function(event) {
    event.preventDefault();
    const value = document.getElementById("summonerInput").value;
    if (value === "")
        return;
    console.log(value);
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + value + "?api_key=" + key;
    fetch(proxyUrl + targetUrl) //get account
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log(json);
            if (json.hasOwnProperty("status")) {
                document.getElementById("results").innerHTML = "<br><p>Summoner Not Found</p>";
                document.getElementById("getLowChampion").style.visibility = "hidden";
                document.getElementById("getHighChampion").style.visibility = "hidden";
                return;
            }
            document.getElementById("getLowChampion").style.visibility = "visible";
            document.getElementById("getHighChampion").style.visibility = "visible";
            results = "<br>";
            results += '<h2>Summoner Name: ' + json.name + "</h2>";
            results += "<p>Summoner Level: " + json.summonerLevel + "</p>";
            accountID = json.id;
            document.getElementById("results").innerHTML = results;
            document.getElementById("championResults").innerHTML = "";

        });
    fetch("http://ddragon.leagueoflegends.com/cdn/9.20.1/data/en_US/champion.json") //get champ info
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log(json);
            championJson = json;
        });
});

document.getElementById("getLowChampion").addEventListener("click", function(event) {
    event.preventDefault();
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + accountID + "?api_key=" + key;
    fetch(proxyUrl + targetUrl) //get account
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log(json);

            let champOutput = "";
            champOutput += "<h2>Champions never played (at least since 5/6/2015): </h2>"
            let nameKeys = Object.keys(championJson.data);
            for (let i = 0; i < nameKeys.length; i++) {
                if (!hasBeenPlayed(json, championJson.data[nameKeys[i]].key)) {
                    champOutput += "<p>" + championJson.data[nameKeys[i]].name + "</p>";
                }
            }

            document.getElementById("championResults").innerHTML = champOutput;

        });
});

document.getElementById("getHighChampion").addEventListener("click", function(event) {
    event.preventDefault();
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = "https://na1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + accountID + "?api_key=" + key;
    fetch(proxyUrl + targetUrl) //get account
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log(json);

            let topChampID = json[0].championId;
            let topChampName = getNameFromID(topChampID);

            let champOutput = "<h2>Top 5 Champions:</h2>";
            for (let i = 0; i < 5; i++) {
                let champID = json[i].championId;
                let champName = getNameFromID(champID);
                let mastery = json[i].championPoints;
                champOutput += "<p>" + (i + 1) + ") " + champName + ": " + mastery + " Points</p>";
            }
            document.getElementById("championResults").innerHTML = champOutput;

        });
});

function getNameFromID(id) {
    let name = "";
    let nameKeys = Object.keys(championJson.data);
    for (let i = 0; i < nameKeys.length; i++) {
        if (championJson.data[nameKeys[i]].key == id)
            return championJson.data[nameKeys[i]].name;
    }
    return name;
}

function hasBeenPlayed(json, key) {
    for (let i = 0; i < json.length; i++) {
        if (json[i].championId == key)
            return true;
    }
    return false;
}
