var roleRepairer = require('role.repairer');

var roleBuilder = {

    assign: function (creep) {
        var container;
        var buildTarget = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);

        if (!buildTarget) {
            roleRepairer.assign(creep);
        }

        if (buildTarget) {
            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }

            if (!creep.memory.building) {
                if (creep.room.memory.storages.length) {
                    container = creep.room.memory.storages[0];
                }
                else {
                    container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => {
                            return ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_CONTAINER) && s.energy == s.energyCapacity)
                        }
                    });
                }
                
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                if (creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;
