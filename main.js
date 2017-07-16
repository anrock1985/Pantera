var population = require('population');

module.exports.loop = function () {
    for (var i in Game.spawns) {
        console.log(Game.spawns[i].pos.roomName + ': ' + Game.spawns[i].name + ' (' + Game.spawns[i].pos.x + ',' + Game.spawns[i].pos.y + ')');
        population.checkPop(Game.spawns[i]);
    }

    for (var i in population.room.memory.towers) {
        //var tower = Game.getObjectById('594a6d94e5eb61210d615ca6');
        var tower = population.room.memory.towers[i];
        if (tower) {
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                console.log('>>>>>> HOSTILE: ' + closestHostile.pos.x + ',' + closestHostile.pos.y);
            }
            if (closestHostile) {
                tower.attack(closestHostile);
            }
            if (!closestHostile) {
                var closestInjuredCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                    filter: (c) => {
                        return (c.hits < c.hitsMax)
                    }
                });

                if (closestInjuredCreep) {
                    console.log('Healing creep: ' + closestInjuredCreep.name);
                    tower.heal(closestInjuredCreep);
                }

                var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_RAMPART && (s.hits < s.hitsMax / 3000)) || (s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
                });
                if (closestDamagedStructure) {
                    tower.repair(closestDamagedStructure);
                }
            }
        }
    }

    console.log('H:' + population.room.memory.harvesters.length + ' M:' + population.room.memory.miners.length + ' C:' + population.room.memory.carriers.length + ' U:' + population.room.memory.upgraders.length + ' B:' + population.room.memory.builders.length + ' R:' + population.room.memory.repairers.length);
    console.log('----------------');
};