var population = require('population');

module.exports.loop = function () {
    for (var i in Game.spawns) {
        console.log(Game.spawns[i].pos.roomName + ': ' + Game.spawns[i].name + ' (' + Game.spawns[i].pos.x + ',' + Game.spawns[i].pos.y + ')');
        population.checkPop(Game.spawns[i]);
    }

    var tower = Game.getObjectById('594a6d94e5eb61210d615ca6');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax /*&& structure.structureType != STRUCTURE_WALL*/
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    console.log('Tower is Active: ' + tower.pos.x + ',' + tower.pos.y);
    console.log('Harvesters: ' + population.harvesters.length);
    console.log('Miners: ' + population.miners.length);
    console.log('Carriers: ' + population.carriers.length);
    console.log('Upgraders: ' + population.upgraders.length);
    console.log('Builders: ' + population.builders.length);
    console.log('Repairers: ' + population.repairers.length);
    console.log('----------------');
};