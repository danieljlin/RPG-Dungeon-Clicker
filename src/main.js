var game = {};
var gameC = {};

game.player = {
    gold: 0,
    exp: 0,
    level: 0
}

gameC.monsters = {};
gameC.monsters["Trainer"] = { goldBase: 0, expBase: 1, hpBase: 1, source: 'img/0trainer.png' };
gameC.monsters["Beetle"] = { goldBase: 1, expBase: 3, hpBase: 3, source: 'img/1beetle.png' };
gameC.monsters["Frog"] = { goldBase: 1, expBase: 1, hpBase: 1, source: 'img/1frog.png' };
gameC.monsters["Pig"] = { goldBase: 1, expBase: 5, hpBase: 5, source: 'img/1pig.png' };
gameC.monsters["Rat"] = { goldBase: 1, expBase: 2, hpBase: 2, source: 'img/1rat.png' };
gameC.monsters["Sheep"] = { goldBase: 1, expBase: 4, hpBase: 4, source: 'img/1sheep.png' };

game.monsters = {};

loadMonsters();

document.getElementById("Trainer").style.display = "inherit";

function loadMonsters() {
    for (var monster in gameC.monsters) {
        game.monsters[monster] = {};
        game.monsters[monster].goldReward = gameC.monsters[monster].goldBase;
        game.monsters[monster].expReward = gameC.monsters[monster].expBase;
        game.monsters[monster].hp = game.monsters[monster].hpMax = 
            gameC.monsters[monster].hpBase;
        
    }

    for (var monster in gameC.monsters) {
        var monsterDiv = document.createElement("div");
        monsterDiv.id = monster;
        monsterDiv.className += "monster ";
        monsterDiv.style.backgroundImage = "url(" + gameC.monsters[monster].source + ")";
        monsterDiv.style.display = "none";
        document.getElementById("containerMonster").appendChild(monsterDiv);
    }

    document.getElementById("containerMonster").addEventListener("click", function (monster) {
        onMonsterClick(monster);
    });
}

function onMonsterClick(monster) {
    game.player.gold += game.monsters[monster.target.id].goldReward;
    document.getElementById("player.gold").innerHTML = game.player.gold;
    game.player.exp += game.monsters[monster.target.id].expReward;
    document.getElementById("player.exp").innerHTML = game.player.exp;
    document.getElementById(monster.target.id).style.display = "none";
    if (document.getElementById(monster.target.id).style.display === "none") {
        reviveRandomMonster();
    }
}

function reviveRandomMonster() {
    var monsterArray = Object.keys(game.monsters);
    var randomMonster = monsterArray[monsterArray.length * Math.random() << 0];
    document.getElementById(randomMonster).style.display = "inherit";
}