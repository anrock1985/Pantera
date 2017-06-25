var roleCarrier = {

    assign: function (creep) {
        var sources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);

        if (creep.memory.carrying && creep.carry.energy == 0) {
            creep.memory.carrying = false;
        }
        if (!creep.memory.carrying && creep.carry.energy > 0) {
            creep.memory.carrying = true;
        }

        if (sources && !creep.memory.carrying) {
            if (creep.pickup(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

        if (creep.memory.carrying) {
            if (creep.room.memory.towersNeedRefuel) {
                if (creep.room.energyAvailable != creep.room.energyCapacityAvailable) {
                    storages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy <= structure.energyCapacity / 2;
                        }
                    });
                }
                else {
                    storages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy < structure.energyCapacity;
                        }
                    });
                }
            }
            else {
                var storages = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => {
                        return ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.energy < s.energyCapacity)
                    }
                });
            }

            if (storages) {
                console.log('Current Storage: ' + storages.pos.x + ',' + storages.pos.y);
                if (creep.transfer(storages, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storages, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleCarrier;