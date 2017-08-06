var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var roleHarvester = {
    
    assign: function (creep) {
        var targets = null;
        var buildTarget = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        var sources = creep.room.find(FIND_SOURCES);

        if (buildTarget.length && creep.room.energyAvailable >= creep.room.memory.spawnEnergy) {
            roleBuilder.assign(creep);
        }
        else if (creep.room.energyAvailable >= creep.room.memory.spawnEnergy && !buildTarget.length) {
            roleUpgrader.assign(creep);
        }
        else {
            if (creep.carry.energy == 0 && !creep.memory.harvesting) {
                creep.memory.harvesting = true;
            }
            if (creep.carry.energy == creep.carryCapacity && creep.memory.harvesting) {
                creep.memory.harvesting = false;
            }

            if (creep.memory.harvesting && creep.room.energyAvailable != creep.room.memory.spawnEnergy) {
                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);
                }
            }

            if (!creep.memory.harvesting && creep.carry.energy != 0) {
                targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity;
                    }
                });

                if (!targets) {
                    if (creep.room.energyAvailable != creep.room.memory.spawnEnergy) {
                        targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_TOWER) &&
                                    structure.energy <= structure.energyCapacity / 2;
                            }
                        });
                    }
                }

                if (creep.room.memory.storages.length && !targets) {
                    targets = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (s) => {
                            return ((s.structureType == STRUCTURE_STORAGE)/* && s.energy < s.energyCapacity*/)
                        }
                    });
                }

                if (targets) {
                    console.log('Storing: ' + targets.pos.x + ',' + targets.pos.y);
                    creep.memory.target = targets;
                    if (creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }


            }
        }
    }
};

module.exports = roleHarvester;
