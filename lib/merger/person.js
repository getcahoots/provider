/*
 * cahoots-provider
 *
 * Copyright Cahoots.pw
 * MIT Licensed
 *
 */

/**
 * @author André König <andre@cahoots.ninja>
 *
 */

'use strict';

var util = require('util');

var debug = require('debug')('cahoots:provider:provider:merger:person');

var BaseMerger = require('./base');

//
// Source example:
//
// HashMap<providerName, Array[<Person>]>
//
// {
//     torial: [<array-with-persons],
//     official: [<array-with-persons]
// };
//
module.exports = function execute (source) {
    var merger = new PersonMerger(source);

    return merger.execute();
};

function PersonMerger (source) {
    this.$results = [];

    console.log(JSON.stringify(source));

    BaseMerger.call(this, source);
}

util.inherits(PersonMerger, BaseMerger);

PersonMerger.prototype.execute = function execute () {
    var self = this;
    var priority = this.$source[this.$getPriorityProvider()];

    debug('about to merge persons');

    //
    // Commit all entries from the `priority provider` first
    //
    priority.forEach(self.$commit.bind(self));

    debug('1. committed all persons from the priority provider');

    //
    // Get all persons from all other providers (`except the persons from the `priority provider`).
    //
    let providers = this.$getProviders(true);
    let persons = [];

    providers.forEach(function onEach (providerName) {
        var data = self.$source[providerName];

        persons.push.apply(persons, data);
    });

    debug('2. extracted all persons from all providers (without the priority provider)');

    debug('3. about to merge the extracted persons');

    persons.forEach(function onEach (person) {
        var existing = self.$pull('name', person.name);

        if (existing) {
            debug('- The person has been already committed. Merge persons cahoots into existing person.');

            person.cahoots.forEach(function onEach (cahoot) {
                existing.cahoots.push(cahoot);
            });
        } else {
            debug('- The person has not been committed before. Committing!');
            self.$commit(person);
        }
    });

    debug('=> merged all persons');

    return this.$results;
};
