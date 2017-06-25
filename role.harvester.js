var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var roleHarvester = {
    
    assign: function (creep) {
        var buildTarget = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        var sources = creep.room.find(FIND_SOURCES);

        if (buildTarget.length && creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
            roleBuilder.assign(creep);
        }
        else if (creep.room.energyAvailable == creep.room.energyCapacityAvailable && !buildTarget.length) {
            roleUpgrader.assign(creep);
        }
        else {
            if (creep.carry.energy == 0 && !creep.memory.harvesting) {
                creep.memory.harvesting = true;
            }
            if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
                creep.memory.harvesting = false;
            }
        }

        if (creep.memory.harvesting && creep.room.energyAvailable != creep.room.energyCapacityAvailable) {
            if (creep.harvest(sources[1]) == OK) {
                if (creep.room.memory.harvestPoints == undefined) {
                    creep.room.memory.harvestPoints = [[creep.pos.x, creep.pos.y]];
                }
                var i = 0;
                var j = 0;
                var matchXY = true;
                for (i; i < creep.room.memory.harvestPoints.length; i++) {
                    for (j; j <= i; j++) {
                        if (creep.room.memory.harvestPoints[i][0] == creep.pos.x && creep.room.memory.harvestPoints[j][1] == creep.pos.y) {
                            matchXY = false;
                        }
                    }
                }
                if (matchXY) {
                    creep.room.memory.harvestPoints.push([creep.pos.x, creep.pos.y]);
                }
            }
            else {
                creep.moveTo(sources[1]);
            }
        }

        if (!creep.memory.harvesting && creep.carry.energy != 0) {
            var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity;
                }
            });

            if (!targets) {
                if (creep.room.energyAvailable != creep.room.energyCapacityAvailable) {
                    targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy <= structure.energyCapacity / 2;
                        }
                    });
                }
            }

            /*
             TODO: Сделать персональные цели для каждого крипа (например, через память комнаты. Добавлять в массив только действующие цели. Придётся каждый раз формировать массив целей, а потом сравнивать его с массивом в памяти и отсеивать совпадения)
             */

            /*
             var i = 0;
             var j = 0;
             var matchXY = true;
             for (i; i < creep.room.memory.tStorage.length; i++) {
             for (j; j <= i; j++) {
             if (creep.room.memory.tStorage[i][0] == creep.pos.x && ccreep.room.memory.tStorage[j][1] == creep.pos.y) {
             matchXY = false;
             }
             }
             }
             if (matchXY) {
             creep.room.memory.tStorage.push([creep.pos.x, creep.pos.y]);
             }
             */

            if (targets) {
                creep.memory.target = targets;
                if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }


        }
    }
};

module.exports = roleHarvester;
