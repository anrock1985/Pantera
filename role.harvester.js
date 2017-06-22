var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var roleHarvester = {

    useHarvestSpot: function (creep) {

    },

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
//        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });

            if (!targets.length) {
                if (creep.room.energyAvailable != creep.room.energyCapacityAvailable) {
                    targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy <= structure.energyCapacity / 2;
                        }
                    });
                }
            }

            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }


        }
    }
};

module.exports = roleHarvester;
