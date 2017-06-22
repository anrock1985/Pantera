//var roleHarvester = require('role.harvester');

var roleRepairer = {
    assign: function (creep) {
        var repairTarget = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL)
            }
        });

        var repairWalls = creep.room.find(FIND_STRUCTURES, {filter: (s) => {return ((s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && s.hits < (s.hitsMax / 50))}});

        if (!repairTarget.length) {
 //           roleHarvester.assign(creep);
        }
        else {
            if (creep.memory.repairing && creep.carry.energy == 0) {
                creep.memory.repairing = false;
            }

            if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
                creep.memory.repairing = true;
            }
        }

        if (!creep.memory.repairing) {
            var container = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN && s.energy == s.energyCapacity)
                }
            });

            if (creep.withdraw(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            if (creep.repair(repairTarget[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(repairTarget[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleRepairer;