var roleMiner = {

    assign: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);

        if (!creep.room.memory.harvestPoints) {
            creep.room.memory.isHarvestChecking = true;
        }

        if (creep.room.memory.isHarvestChecking) {
            for (let i = 0; i < sources.length; i++) {
                var temp = creep.room.lookForAtArea(LOOK_TERRAIN, +sources[i].pos.y - 1, +sources[i].pos.x - 1, +sources[i].pos.y + 1, +sources[i].pos.x + 1, true);
                //temp[i] {type: terrain, terrain: plain\wall\swamp, x: 10, y: 20}
                for (let j in temp) {
                    if (temp[j].terrain != 'wall') {
                        if (!creep.room.memory.harvestPoints) {
                            creep.room.memory.harvestPoints = [];
                        }
                        creep.room.memory.harvestPoints.push([+temp[j].x]);
                        creep.room.memory.harvestPoints.push([+temp[j].y]);
                        console.log('+ Harvest point: ' + +temp[j].x + ',' + +temp[j].y)
                    }
                }
            }
            creep.room.memory.isHarvestChecking = false;
        }

        if (!creep.room.memory.isHarvestChecking) {
            //TODO: Присвоить каждому майнеру персональный HarvestPoint из массива доступных. Удалить присвоенный HarvestPoint из списка доступных. При смерти майнера вернуть используемый им HarvestPoint в список доступных.
            //TODO: Проверка доступности сгенерированных HarvestPoint, например если они внутри замкнутой области гор.
            if (creep.memory.HarvestPointX == undefined && creep.memory.HarvestPointX == undefined && creep.room.memory.harvestPoints != undefined) {
                creep.memory.HarvestPointX = creep.room.memory.harvestPoints.splice(0, 1);
                creep.memory.HarvestPointY = creep.room.memory.harvestPoints.splice(0, 1);
            }
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleMiner;
