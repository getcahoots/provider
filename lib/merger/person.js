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
    var priority = this.$source[this.$getPriorityProviderName()];

    debug('about to merge persons');

    //
    // Commit all entries from the `priority provider` first
    //
    priority.forEach(self.$commit.bind(self));

    debug('1. committed all persons from the priority provider');

    //
    // Get all persons from all other providers (`except the persons from the `priority provider`).
    //
    let persons = this.$getProviders(true);

    debug('2. extracted all persons from all providers (without the priority provider)');

    debug('3. about to merge the extracted persons');

    persons.forEach(function onEach (person) {
        var committedPerson = self.$getCommittedItemBy('name', person.name);

        console.log(person.cahoots.length);

        if (committedPerson) {
            debug('- The person has been committed already. Merge all cahoots into the committed one.');

            person.cahoots.forEach(function onEach(cahoot) {
                // TODO: Merge only if not exists already
                committedPerson.cahoots.push(cahoot);
            });
        } else {
            debug('- The person was not available committing.');
            self.$commit(person);
        }
    });

    debug('=> merged all persons');

    // ForEach provider `except the priority provider`
    //     ForEach person in the `provider results`
    //         If person is already committed -> merge cahoots (this.$get({name: person.name}))

    return this.$results;
};
