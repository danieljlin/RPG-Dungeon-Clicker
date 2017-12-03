var game = {};
var gameC = {};

gameC.monsters = {};
gameC.monsters["Trainer"] = { goldBase: 0, expBase: 0, hpBase: 1, source: 'img/0trainer.png' };
gameC.monsters["Beetle"] = { goldBase: 1, expBase: 5, hpBase: 5, source: 'img/1beetle.png' };
gameC.monsters["Frog"] = { goldBase: 1, expBase: 5, hpBase: 3, source: 'img/1frog.png' };
gameC.monsters["Pig"] = { goldBase: 1, expBase: 5, hpBase: 7, source: 'img/1pig.png' };
gameC.monsters["Rat"] = { goldBase: 1, expBase: 5, hpBase: 4, source: 'img/1rat.png' };
gameC.monsters["Sheep"] = { goldBase: 1, expBase: 5, hpBase: 6, source: 'img/1sheep.png' };
gameC.monsters["Scorpion"] = { goldBase: 10, expBase: 20, hpBase: 100, source: 'img/1_scorpion.png' };

gameC.dungeons = [
    { level: "Home", min: 0, max: 0, goldMult: 1, expMult: 1, hpMult: 1, killsTnl: 5 },
    { level: 1, min: 1, max: 5, goldMult: 1, expMult: 1, hpMult: 1, killsTnl: 5 },
    { level: 2, min: 1, max: 5, goldMult: 1, expMult: 1, hpMult: 2, killsTnl: 5 },
    { level: 3, min: 1, max: 5, goldMult: 1, expMult: 1, hpMult: 3, killsTnl: 5 },
    { level: 4, min: 1, max: 5, goldMult: 1, expMult: 1, hpMult: 4, killsTnl: 5 },
    { level: 5, min: 6, max: 6, goldMult: 1, expMult: 1, hpMult: 1, killsTnl: 1 },
    { level: 6, min: 6, max: 6, goldMult: 1, expMult: 1, hpMult: 2, killsTnl: 5 }
];

gameC.player = [
    { level: 0, expTnl: 5 },
    { level: 1, expTnl: 10 },
    { level: 2, expTnl: 20 },
    { level: 3, expTnl: 40 },
    { level: 4, expTnl: 100 },
    { level: 5, expTnl: 1000 }
];

game.monsters = {};

game.dungeons = [
    { level: "Home", kills: 0 }
];

game.player = {
    gold: 0,
    exp: 0,
    expClick: 1,
    level: 0,
    damage: 0
}

loadMonsters();
game.monsterArray = Object.keys(game.monsters);
game.monsterChildren = document.getElementById("containerMonster").children;
startHome();

loadCheats();

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

    document.getElementById("containerMonster").addEventListener("click", function (event) {
        onMonsterClick(event);
    });
}

function startHome() {
    game.currentDungeon = "Home";
    document.getElementById("Trainer").style.display = "inherit";
    document.getElementById("dungeonHome").style.border = "4px solid black";
    document.getElementById("dungeonHome").addEventListener("click", function (event) {
        switchDungeon(event);
    });
    document.getElementById("dungeon").addEventListener("click", function (event) {
        switchDungeon(event);
    });
}

function onMonsterClick(event) {
    if (event.target.className === "monster ")
        if (event.target.id === "Trainer") {
            game.dungeons[0].kills++;
            document.getElementById("dungeon.kills").innerHTML = game.dungeons[0].kills;
            document.getElementById("player.exp").innerHTML =
                game.player.exp += game.player.expClick;
            isLevelUp();
            if (game.player.exp === 5) {
                unlockDungeonLevel();
            }
            return;
        }
    document.getElementById("monster.hp").innerHTML =
        game.monsters[event.target.id].hp -= game.player.damage;
    document.getElementById("monsterHpBar").style.width =
        game.monsters[event.target.id].hp / game.monsters[event.target.id].hpMax * 100 + "%";
    document.getElementById("player.exp").innerHTML =
        game.player.exp += game.player.expClick;
    isLevelUp();
    if (game.monsters[event.target.id].hp <= 0) {
        onMonsterKill(event);
        reviveRandomMonster();
    }
}

function onMonsterKill(event) {
    game.dungeons[game.currentDungeon].kills++;
    document.getElementById("dungeon.kills").innerHTML = game.dungeons[game.currentDungeon].kills;
    document.getElementById(event.target.id).style.display = "none";
    document.getElementById("player.gold").innerHTML =
        game.player.gold += game.monsters[event.target.id].goldReward;
    document.getElementById("player.exp").innerHTML =
        game.player.exp += game.monsters[event.target.id].expReward;
    isLevelUp();
    isUnlockDungeon();
}

function reviveRandomMonster() {
    if (game.currentDungeon === "Home") {
        document.getElementById("Trainer").style.display = "inherit";
        document.getElementById("monster.id").innerHTML = "Trainer";
        document.getElementById("monster.hp").innerHTML = "Invincible";
        document.getElementById("monsterHpBar").style.width = "100%";
        return;
    }
    getRandomInteger(gameC.dungeons[game.currentDungeon].min, gameC.dungeons[game.currentDungeon].max);
    game.randomMonster = game.monsterArray[game.randomInteger];
    game.monsters[game.randomMonster].hp = game.monsters[game.randomMonster].hpMax =
        Math.floor(gameC.monsters[game.randomMonster].hpBase * gameC.dungeons[game.currentDungeon].hpMult);
    document.getElementById(game.randomMonster).style.display = "inherit";
    document.getElementById("monster.id").innerHTML = game.randomMonster;
    document.getElementById("monster.hp").innerHTML = game.monsters[game.randomMonster].hp;
    document.getElementById("monsterHpBar").style.width = "100%";
}

function getRandomInteger(min, max) {
    game.randomInteger = Math.floor(Math.random() * (max - min + 1)) + min;
}

function isUnlockDungeon() {
    if (game.dungeons[game.currentDungeon].kills === gameC.dungeons[game.currentDungeon].killsTnl) {
        unlockDungeonLevel();
    }
}

function unlockDungeonLevel() {
    document.getElementById("dungeonKillsDisplay").style.display = "none";
    var dungeonDiv = document.createElement("div");
    var dungeonLevel = document.getElementById("dungeon").childElementCount + 1;
    dungeonDiv.innerHTML = dungeonLevel;
    dungeonDiv.id = "dungeon" + dungeonLevel;
    dungeonDiv.className += "levelSelect ";
    document.getElementById("dungeon").appendChild(dungeonDiv);
    game.dungeons.push({ level: dungeonLevel, kills: 0 });
}

function switchDungeon(event) {
    if (event.target.className === "levelSelect ") {
        if (event.target.innerHTML === game.currentDungeon) {
            return;
        }
        hideAllMonsters();
        document.getElementById("dungeonKillsDisplay").style.display = "none";
        document.getElementById("dungeon" + game.currentDungeon).style = "inherit";
        game.currentDungeon = event.target.innerHTML;
        document.getElementById("dungeon" + game.currentDungeon).style.border = "4px solid black";
        reviveRandomMonster();
        if (game.dungeons[game.currentDungeon].kills < gameC.dungeons[game.currentDungeon].killsTnl) {
            game.dungeons[game.currentDungeon].kills = 0;
            document.getElementById("dungeon.kills").innerHTML = 0;
            document.getElementById("dungeon.killsTnl").innerHTML = gameC.dungeons[game.currentDungeon].killsTnl;
            document.getElementById("dungeonKillsDisplay").style.display = "inline";
        }
    }
}

function hideAllMonsters() {
    for (var i = 0, n = game.monsterChildren.length; i < n; i++) {
        game.monsterChildren[i].style.display = "none";
    }
}

function isLevelUp() {
    if (game.player.exp >= gameC.player[game.player.level].expTnl) {
        game.player.level++;
        document.getElementById("player.level").innerHTML = game.player.level;
        document.getElementById("player.expTnl").innerHTML = gameC.player[game.player.level].expTnl;
        game.player.damage++;
        document.getElementById("player.damage").innerHTML = game.player.damage;
    }
}

function loadCheats() {
    game.cheats = true;
    document.getElementById("goldDisplay").addEventListener("click", function (event) { cheatGold(event); });
    document.getElementById("expDisplay").addEventListener("click", function (event) { cheatLevel(event); });
    document.getElementById("damageDisplay").addEventListener("click", function (event) { cheatDamage(event); });
    document.getElementById("dungeonKillsDisplay").addEventListener("click", function (event) { cheatDungeon(event); });
}

function cheatGold(event) {
    if (game.cheats === true && event.ctrlKey) {
        game.player.gold += 1000;
        document.getElementById("player.gold").innerHTML = game.player.gold;
    }
}

function cheatLevel(event) {
    if (game.cheats === true && event.ctrlKey) {
        game.player.exp = gameC.player[game.player.level].expTnl;
        document.getElementById("player.exp").innerHTML = game.player.exp;
        isLevelUp();
    }
}

function cheatDamage(event) {
    if (game.cheats === true && event.ctrlKey) {
        game.player.damage += 1000;
        document.getElementById("player.damage").innerHTML = game.player.damage;
    }
}

function cheatDungeon(event) {
    if (game.cheats === true && event.ctrlKey) {
        if (game.currentDungeon === "Home") {
            game.dungeons[0].kills = gameC.dungeons[0].killsTnl;
        }
        else {
            game.dungeons[game.currentDungeon].kills = gameC.dungeons[game.currentDungeon].killsTnl;
        }
        unlockDungeonLevel();
        hideAllMonsters();
        document.getElementById("dungeonKillsDisplay").style.display = "none";
        document.getElementById("dungeon" + game.currentDungeon).style = "inherit";
        game.currentDungeon = document.getElementById("dungeon").lastChild.innerHTML;
        document.getElementById("dungeon" + game.currentDungeon).style.border = "4px solid black";
        reviveRandomMonster();
        game.dungeons[game.currentDungeon].kills = 0;
        document.getElementById("dungeon.kills").innerHTML = 0;
        document.getElementById("dungeon.killsTnl").innerHTML = gameC.dungeons[game.currentDungeon].killsTnl;
        document.getElementById("dungeonKillsDisplay").style.display = "inline";
    }
}