const api_key = "RGAPI-70243843-55d3-429a-8430-734ce879fdd6";
const region = "euw1";
const liveGameError = "Summoner name invalid or summoner not in game!";
function searchGame() {
  let gameName = document.getElementById("game-search");
  let name = gameName.value;
  let gameId;
  let gameData;
  let gameMode;
  let redTeam = [];
  let blueTeam = [];
  fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${api_key}`
  )
    .then((response) => response.json())
    .then((data) => {
      gameId = data.id;
      let summonerGameElement = document.querySelector("h1");
      summonerGameElement.innerText = data.name + "'s" + " Live game";

      return fetch(
        ` https://${region}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${gameId}?api_key=${api_key}`
      );
    })
    .catch((error) => alert(`${liveGameError}`))
    .then((response) => response.json())
    .then((data) => {
      gameData = data;
      console.log(gameData);
      console.log(gameData.mapId);
      gameMode = gameData.gameQueueConfigId;
      if (gameMode === 420) {
        let gameModeElement = document.getElementById("game-mode");
        gameModeElement.innerText = "Ranked Solo/Duo";
      } else if (gameMode === 440) {
        let gameModeElement = document.getElementById("game-mode");
        gameModeElement.innerText = "Ranked Flex";
      } else if (gameMode === 450) {
        let gameModeElement = document.getElementById("game-mode");
        gameModeElement.innerText = "ARAM";
      } else if (gameMode === 400) {
        let gameModeElement = document.getElementById("game-mode");
        gameModeElement.innerText = "Normal Draft";
      } else {
        let gameModeElement = document.getElementById("game-mode");
        gameModeElement.innerText = "Unknown Game mode";
      }

      Promise.all(
        gameData.participants.map((participant) => {
          const { summonerId } = participant;
          return fetch(
            `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${api_key}`
          ).then((response) => response.json());
        })
      ).then((rankData) => {
        // Promise.all varmistaa että kaikki fetchit tehään ensin jokaiselle participantille
        // sit käydään läpi jokaisen participantin data ja lisätään player objectille joka pusketaan oikeeseen tiimii
        gameData.participants.forEach((participant, index) => {
          const { teamId, summonerName } = participant;
          const wins = rankData[index][0].wins;
          const losses = rankData[index][0].losses;
          const winRate = ((wins / (wins + losses)) * 100).toFixed(1);
          const rank = rankData[index][0].tier + " " + rankData[index][0].rank;
          const player = {
            name: summonerName,
            rank: rank,
            wins: wins,
            losses: losses,
            winrate: winRate,
          };
          if (teamId === 100) {
            blueTeam.push(player);
          } else {
            redTeam.push(player);
          }
        });

        console.log(blueTeam);
        console.log(redTeam);
        console.log(gameData.participants[0]);

        // Get a reference to the table element
        let table = document.getElementById("team-table");

        // Create a header row
        let headerRow = document.createElement("tr");

        // Create header cells for the two teams
        let blueTeamHeader = document.createElement("th");
        blueTeamHeader.innerText = "Blue Team";
        blueTeamHeader.classList.add("blue");
        headerRow.appendChild(blueTeamHeader);

        let redTeamHeader = document.createElement("th");
        redTeamHeader.innerText = "Red Team";
        redTeamHeader.classList.add("red");
        headerRow.appendChild(redTeamHeader);

        // Add the header row to the table
        table.appendChild(headerRow);

        // Loop through the players in both teams
        for (let i = 0; i < Math.max(blueTeam.length, redTeam.length); i++) {
          // Create a new row
          let row = document.createElement("tr");

          // Create cells for the players in the blue team
          let blueTeamCell = document.createElement("td");
          if (blueTeam[i]) {
            let playerInfo = document.createElement("div");
            playerInfo.innerHTML = `<strong>${blueTeam[i].name}</strong>&nbsp;  (${blueTeam[i].rank})&nbsp;  W/L: ${blueTeam[i].wins}/${blueTeam[i].losses} &nbsp; Winrate: ${blueTeam[i].winrate}%`;
            blueTeamCell.appendChild(playerInfo);
          }
          row.appendChild(blueTeamCell);

          // Create cells for the players in the red team
          let redTeamCell = document.createElement("td");
          if (redTeam[i]) {
            let playerInfo = document.createElement("div");
            playerInfo.innerHTML = `<strong>${redTeam[i].name}</strong>&nbsp;  (${redTeam[i].rank}) &nbsp; W/L: ${redTeam[i].wins}/${redTeam[i].losses}&nbsp;  Winrate: ${redTeam[i].winrate}%`;
            redTeamCell.appendChild(playerInfo);
          }
          row.appendChild(redTeamCell);

          // Add the row to the table
          table.appendChild(row);
        }
      });
    });
}
