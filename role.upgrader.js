var roleUpgrader = {

    assign: function (creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if (!creep.memory.upgrading) {
            // var container = creep.room.find(FIND_STRUCTURES, {
            //     filter: (s) => {
            //         return (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN && s.energy == s.energyCapacity)
            //     }
            // });
            // if (creep.withdraw(container[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(container[0], {visualizePathStyle: {stroke: '#ffffff'}});
            // }

            var sources = creep.room.find(FIND_SOURCES);

            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
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