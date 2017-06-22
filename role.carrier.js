var roleCarrier = {

    assign: function (creep) {
        var sources = creep.room.find(FIND_DROPPED_RESOURCES);

        if (sources.length > 0 && creep.carry.energy == 0) {
            if (creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var storages = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if (!storages.length) {
                if (creep.room.energyAvailable != creep.room.energyCapacityAvailable) {
                    storages = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy <= structure.energyCapacity / 2;
                        }
                    });
                }
                else {
                    storages = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) &&
                                structure.energy < structure.energyCapacity;
                        }
                    });
                }
            }

            if (storages.length) {
                console.log('Current Storage: ' + storages[0].pos.x + ',' + storages[0].pos.y);
            }

            if (storages.length > 1) {
                if (creep.transfer(storages[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storages[1], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (storages.length > 0) {
                if (creep.transfer(storages[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleCarrier;