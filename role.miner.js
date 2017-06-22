var roleMiner = {

    assign: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);

            if (creep.harvest(sources[0]) == OK) {
                if (creep.room.memory.harvestPoints == undefined) {
                    creep.room.memory.harvestPoints = [[creep.pos.x, creep.pos.y]];
                }
                var i = 0;
                var j = 0;
                var matchXY = true;
                for (i; i < creep.room.memory.harvestPoints.length; i++) {
                    for (j; j <= i; j++) {
                        if (creep.room.memory.harvestPoints[i][0] == creep.pos.x && creep.room.memory.harvestPoints[j][1] == creep.pos.y) {
                            matchXY = false;
                        }
                    }
                }
                if (matchXY) {
                    creep.room.memory.harvestPoints.push([creep.pos.x, creep.pos.y]);
                }
            }
            else {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
    }};

module.exports = roleMiner;
