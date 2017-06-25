//var roleHarvester = require('role.harvester');

var roleRepairer = {
    assign: function (creep) {
        var container;
        var repairTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.hits < (s.hitsMax / 2) && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)
            }
        });

        var repairWalls = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => {
                return ((s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < (s.hitsMax / 7200))
            }
        });

        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
        }

        if (!creep.memory.repairing) {
            if (creep.room.memory.storages.length) {
                container = creep.room.memory.storages[0];
            }
            else if (creep.room.memory.miners.length && creep.room.memory.carriers.length) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => {
                        return ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_CONTAINER) && s.energy == s.energyCapacity)
                    }
                });
            }

            if (container) {
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }

        if (creep.memory.repairing && repairTarget) {
            console.log('Repairing: ' + repairTarget.pos.x + ',' + repairTarget.pos.y);
            if (creep.repair(repairTarget) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

        if (creep.memory.repairing && !repairTarget && repairWalls) {
            console.log('Repairing Wall: ' + repairWalls.pos.x + ',' + repairWalls.pos.y);
            if (creep.repair(repairWalls) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairWalls, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

    }
};

module.exports = roleRepairer;