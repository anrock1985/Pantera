/*
 MOVE	        50	    Decreases fatigue by 2 points per tick.

 WORK            100     Harvests 2 energy units from a source per tick.
 Builds a structure for 5 energy units per tick.
 Repairs a structure for 100 hits per tick consuming 1 energy unit per tick.
 Dismantles a structure for 50 hits per tick returning 0.25 energy unit per tick.
 Upgrades a controller for 1 energy unit per tick.

 CARRY	        50	    Can contain up to 50 resource units.

 ATTACK	        80	    Attacks another creep/structure with 30 hits per tick in a short-ranged attack.

 RANGED_ATTACK	150     Attacks another single creep/structure with 10 hits per tick in a long-range attack up to 3 squares long.
 Attacks all hostile creeps/structures within 3 squares range with 1-4-10 hits (depending on the range).

 HEAL	        250	    Heals self or another creep restoring 12 hits per tick in short range or 4 hits per tick at a distance.

 CLAIM	        600     Claims a neutral room controller.
 Reserves a neutral room controller for 1 tick per body part.
 Attacks a hostile room controller downgrade or reservation timer with 1 tick per 5 body parts.
 A creep with this body part will have a reduced life time of 500 ticks and cannot be renewed.

 TOUGH	        10	    No effect, just additional hit points to the creep's body. Can be boosted to resist damage.
 */

var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

var population = {
    body: [],
    room: {},
    creeps: [],
    spawner: {},
    name: {},
    extEnergy: 0,
    totalEnergy: 0,

    checkPop: function (spawn) {
        population.spawner = spawn;
        population.room = spawn.room;
        population.creeps = population.room.find(FIND_MY_CREEPS);
        population.room.memory.harvesters = _.filter(Game.creeps, (c) => c.memory.role == 'harvester');
        population.room.memory.miners = _.filter(Game.creeps, (c) => c.memory.role == 'miner');
        population.room.memory.carriers = _.filter(Game.creeps, (c) => c.memory.role == 'carrier');
        population.room.memory.upgraders = _.filter(Game.creeps, (c) => c.memory.role == 'upgrader');
        population.room.memory.builders = _.filter(Game.creeps, (c) => c.memory.role == 'builder');
        population.room.memory.repairers = _.filter(Game.creeps, (c) => c.memory.role == 'repairer');

        population.room.memory.hasHarvestPoint = _.filter(Game.creeps, (c) => c.memory.HarvestPointX != undefined);

        population.room.memory.towers = _.filter(Game.structures, (t) => t.structureType == STRUCTURE_TOWER);
        population.room.memory.towersNeedRefuel = false;
        if (population.room.memory.towers.length) {
            for (var i = 0; i < population.room.memory.towers.length; i++) {
                if (population.room.memory.towers[i].energy < (population.room.memory.towers[i].energyCapacity / 2)) {
                    population.room.memory.towersNeedRefuel = true;
                }
            }
        }

        population.room.memory.storages = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_STORAGE);
        population.room.memory.extensions = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_EXTENSION);
        population.room.memory.containers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_CONTAINER);
        //population.room.memory.emptyStorages = population.room.find(FIND_STRUCTURES, {filter: (s) => {return (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN) && s.energy < s.energyCapacity}});

        population.extEnergy = 0;
        population.totalEnergy = 0;
        if (population.room.memory.extensions.length) {
            for (var i = 0; i < population.room.memory.extensions.length; i++) {
                population.extEnergy += population.room.memory.extensions[i].energy;
            }
            population.extEnergy += population.spawner.energy;
            population.totalEnergy = (population.room.memory.extensions.length * 50) + population.spawner.energyCapacity;
            population.room.memory.spawnEnergy = population.totalEnergy;
            console.log('Energy: ' + population.extEnergy + '/' + population.totalEnergy + ' [' + population.room.energyCapacityAvailable + ']');
        }
        else {
            population.totalEnergy = population.spawner.energyCapacity;
        }

        var buildTarget = population.room.find(FIND_MY_CONSTRUCTION_SITES);

        for (var i in Memory.creeps) {
            if (Game.creeps[i] == undefined) {
                console.log('Clearing non-existing creep memory:', i);
                delete Memory.creeps[i];
            }
        }

        if (population.room.memory.harvesters.length < 3) {
            population.spawn('harvester');
            population.assignRole();
        }
        else if (population.room.memory.miners.length < 1) {
            population.spawn('miner');
            population.assignRole();
        }
        else if (population.room.memory.carriers.length < 2 && population.room.memory.miners.length) {
            population.spawn('carrier');
            population.assignRole();
        }
        else if (population.room.memory.upgraders.length < 1) {
            population.spawn('upgrader');
            population.assignRole();
        }
        else if (population.room.memory.builders.length < 1 && buildTarget.length) {
            population.spawn('builder');
            population.assignRole();
        }
        else if (population.room.memory.repairers.length < 2) {
            population.spawn('repairer');
            population.assignRole();
        }
        else {
            population.assignRole();
        }
    },

    spawn: function (role) {
        if (!population.spawner.spawning && population.room.memory.harvesters.length < 3 && (population.assembleBody(population.extEnergy, 'harvester') != ERR_NOT_ENOUGH_ENERGY)) {
            console.log("+ " + population.name + ", " + role + " (" + (population.creeps.length + 1) + ")");
        }
        else if (!population.spawner.spawning && (population.assembleBody(population.totalEnergy, role) != ERR_NOT_ENOUGH_ENERGY)) {
            console.log("+ " + population.name + ", " + role + " (" + (population.creeps.length + 1) + ")");
        }
    },

    assignRole: function () {
        for (var i in population.creeps) {
            var creep = population.creeps[i];
            if (creep.memory.role == 'harvester') {
                roleHarvester.assign(creep);
            }
            else if (creep.memory.role == 'miner') {
                roleMiner.assign(creep);
            }
            else if (creep.memory.role == 'carrier') {
                roleCarrier.assign(creep);
            }
            else if (creep.memory.role == 'upgrader') {
                roleUpgrader.assign(creep);
            }
            else if (creep.memory.role == 'builder') {
                roleBuilder.assign(creep);
            }
            else if (creep.memory.role == 'repairer') {
                roleRepairer.assign(creep);
            }
        }
    },

    assembleBody: function (energy, r) {
        population.body = [];
        population.name = undefined;

        if (energy >= 200 && r != 'miner' && r != 'carrier') {
            var parts1 = Math.floor(energy / 200);
            parts1 = Math.min(parts1, Math.floor(50 / 3));

            for (let i = 0; i < parts1; i++) {
                population.body.push(WORK);
            }
            for (let i = 0; i < parts1; i++) {
                population.body.push(CARRY);
            }
            for (let i = 0; i < parts1; i++) {
                population.body.push(MOVE);
            }
            return population.name = population.spawner.createCreep(population.body, undefined, {role: r});
        }
        else if (energy >= 150 && r == 'miner') {
            var parts2 = Math.floor(energy / 150);
            parts2 = Math.min(parts2, Math.floor(50 / 2));

            for (let i = 0; i < parts2; i++) {
                population.body.push(WORK);
            }
            for (let i = 0; i < 1; i++) {
                population.body.push(MOVE);
            }
            return population.name = population.spawner.createCreep(population.body, undefined, {role: r});
        }
        else if (energy >= 100 && r == 'carrier') {
            var parts3 = Math.floor(energy / 100);
            parts3 = Math.min(parts3, Math.floor(50 / 2));

            for (let i = 0; i < parts3; i++) {
                population.body.push(CARRY);
            }
            for (let i = 0; i < parts3; i++) {
                population.body.push(MOVE);
            }
            return population.name = population.spawner.createCreep(population.body, undefined, {role: r});
        }
        else {
            return 'Exit';
        }
    }
};

module.exports = population;