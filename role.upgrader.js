var roleUpgrader = {

    assign: function (creep) {
        var container;
        if (creep.memory.upgrading == undefined) {
            creep.memory.upgrading = false;
        }
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (!creep.memory.upgrading) {
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

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;