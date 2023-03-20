const api_key = "RGAPI-70243843-55d3-429a-8430-734ce879fdd6";
const region = "euw1";
const errorMessage = "Enter valid summoner name!";

function searchSummoner() {
  let summonerName = document.getElementById("player-name");
  let name = summonerName.value;
  let summonerId;
  let summonerData;
  let wins;
  let losses;
  let rank;
  fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${api_key}`
  )
    .then((response) => response.json())
    .then((data) => {
      summonerId = data.id;
      let summonerNameElement = document.querySelector("h1");
      summonerNameElement.innerText = data.name;
      console.log(summonerId);
      console.log(data.name);

      return fetch(
        `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${api_key}`
      );
    })
    .catch((error) => alert(`${errorMessage}`))
    .then((response) => response.json())
    .then((data) => {
      summonerData = data;
      console.log(summonerData);
      wins = data[0].wins;
      losses = data[0].losses;
      rank = data[0].tier + " " + data[0].rank;
      let summonerWinsElement = document.getElementById("summoner-wins");
      summonerWinsElement.innerText = wins;

      let summonerLossesElement = document.getElementById("summoner-losses");
      summonerLossesElement.innerText = losses;

      let winRate = ((wins / (wins + losses)) * 100).toFixed(1);
      let summonersWRelement = document.getElementById("winrate");
      summonersWRelement.innerText = winRate + "%";

      let summonersRankElement = document.getElementById("rank");
      summonersRankElement.innerText = rank;
      console.log(winRate);
      console.log(summonerData);
    });
}
