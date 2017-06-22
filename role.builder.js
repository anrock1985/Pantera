var roleRepairer = require('role.repairer');

var roleBuilder = {

    assign: function (creep) {
        var buildTarget = creep.room.find(FIND_MY_CONSTRUCTION_SITES);

        if (!buildTarget.length) {
            roleRepairer.assign(creep);
        }
        else {
            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }

            if (!creep.memory.building) {
                var sources = creep.room.find(FIND_SOURCES);

                if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else {
                if (creep.build(buildTarget[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTarget[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;
