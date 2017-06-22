var i = 0;
var j = 0;
if (creep.room.memory.harvestPoints[i][0] == creep.pos.x) {
    for (i; i < creep.room.memory.harvestPoints.length; ++i) {
        console.log('[i][0] == X. i=' + i + '  array[i][0]=' + creep.room.memory.harvestPoints[i][0] + '  x=' + creep.pos.x);
        if (creep.room.memory.harvestPoints[i][0] != creep.pos.x) {
            console.log('[i][0] != X. i=' + i + '  array[i][0]=' + creep.room.memory.harvestPoints[i][0] + '  x=' + creep.pos.x);
            var tempX = creep.room.memory.harvestPoints.length;
            console.log('tempX: ' + tempX);
            creep.room.memory.harvestPoints[tempX] = [creep.pos.x, creep.pos.y];
            console.log('Добавлен новый X. ' + creep.room.memory.harvestPoints);
            console.log('Выход из циклов X.');
            return;
        }
    }
    if (creep.room.memory.harvestPoints[j][1] == creep.pos.y) {
        for (j; j < creep.room.memory.harvestPoints.length; ++j) {
            if (creep.room.memory.harvestPoints[j][1] != creep.pos.y) {
                console.log('[j][1] != Y. j=' + i + '  array[j][1]=' + creep.room.memory.harvestPoints[j][1] + '  y=' + creep.pos.y);
                var tempY = creep.room.memory.harvestPoints.length;
                console.log('tempY: ' + tempY);
                creep.room.memory.harvestPoints[tempY] = [creep.pos.x, creep.pos.y];
                console.log('Добавлен новый Y. ' + creep.room.memory.harvestPoints);
                console.log('Выход из циклов Y.');
                return;
            }
        }
    }
}
else {

}






var matchX = false;
var matchY = false;

for (i; i < creep.room.memory.harvestPoints.length; i++) {
    if (creep.room.memory.harvestPoints[i][0] == creep.pos.x) {
        for (j; j < creep.room.memory.harvestPoints.length; j++) {
            if (creep.room.memory.harvestPoints[j][1] == creep.pos.y) {
                return;
            }
        }
    }
}



for (i; i < creep.room.memory.harvestPoints.length; i++) {
    for (j; j < creep.room.memory.harvestPoints.length; j++) {
        if (creep.room.memory.harvestPoints[i][0] == creep.pos.x && creep.room.memory.harvestPoints[j][1] == creep.pos.y) {
            console.log('Найдено совпадение X:' + creep.room.memory.harvestPoints[i][0] + ', Y:' + creep.room.memory.harvestPoints[j][1]);
            return;
        }
    }
}
creep.room.memory.harvestPoints.length = [creep.pos.x, creep.pos.y];
console.log('Совпадений не найдено, добавляем ' + creep.pos.x + ',' + creep.pos.y);
console.log('Итог: ' + creep.room.memory.harvestPoints);