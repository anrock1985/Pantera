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

//var _ = require('lodash');
var roleHarvester = require('role.harvester');
var roleMiner = require('role.miner');
var roleCarrier = require('role.carrier');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

var population = {
    body: [],
    harvesters: [],
    miners: [],
    carriers: [],
    upgraders: [],
    builders: [],
    repairers: [],
    room: {},
    creeps: [],
    spawner: {},
    name: {},

    checkPop: function (spawn) {
        population.spawner = spawn;
        population.room = spawn.room;
        population.creeps = population.room.find(FIND_MY_CREEPS);
        population.harvesters = _.filter(Game.creeps, (c) => c.memory.role == 'harvester');
        population.miners = _.filter(Game.creeps, (c) => c.memory.role == 'miner');
        population.carriers = _.filter(Game.creeps, (c) => c.memory.role == 'carrier');
        population.upgraders = _.filter(Game.creeps, (c) => c.memory.role == 'upgrader');
        population.builders = _.filter(Game.creeps, (c) => c.memory.role == 'builder');
        population.repairers = _.filter(Game.creeps, (c) => c.memory.role == 'repairer');

        var buildTarget = population.room.find(FIND_MY_CONSTRUCTION_SITES);

        for (var i in Memory.creeps) {
            if (Game.creeps[i] == undefined) {
                console.log('Clearing non-existing creep memory:', i);
                delete Memory.creeps[i];
            }
        }

        if (population.harvesters.length < 3) {
            population.spawn('harvester');
            population.assignRole();
        }
        else if (population.miners.length < 1) {
            population.spawn('miner');
            population.assignRole();
        }
        else if (population.carriers.length < 2) {
            population.spawn('carrier');
            population.assignRole();
        }
        else if (population.upgraders.length < 1) {
            population.spawn('upgrader');
            population.assignRole();
        }
        else if (population.builders.length < 1 && buildTarget.length) {
            population.spawn('builder');
            population.assignRole();
        }
        else if (population.repairers.length < 1) {
            population.spawn('repairer');
            population.assignRole();
        }
        else {
            population.assignRole();
        }
    },

    spawn: function (role) {
            if (!population.spawner.spawning && (population.assembleBody(population.room.energyCapacityAvailable, role) != ERR_NOT_ENOUGH_ENERGY)) {
                console.log("+ " + population.name + ", " + role + " (" +(population.creeps.length+1)+")");
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