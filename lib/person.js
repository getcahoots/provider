/*
 * provider
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

var debug = require('debug')('cahoots:provider:person');
var mandatory = require('mandatory');
var VError = require('verror');

var BaseService = require('./base');

module.exports = function instantiate (providers) {
    var service = new PersonService(providers);

    return {
        save: service.save.bind(service),
        findAll: service.findAll.bind(service),
        findById: service.findById.bind(service)
    };
};

function PersonService (providers) {
    this.$type = 'person';

    BaseService.call(this, providers);
}

util.inherits(PersonService, BaseService);

/**
 * Persists a person.
 *
 * @param {object} person
 * The person object that should be persisted.
 *
 * @param {function} callback
 * Will be executed when the person object has been stored.
 * Executed as `callback(err, person)`.
 *
 */
PersonService.prototype.save = function save (person, callback) {
    var self = this;

    mandatory(person).is('object', 'Please define a person which should be saved.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onUpdate (err, updatedPerson) {
        if (err) {
            console.log(err.type);
            if (err.type === 'NotFoundError') {
                debug('The person does not exist. Inserting it.');

                // This is a new person, set the timestamps accordingly
                person.created = person.modified = (Date.now() / 1000 | 0);

                return self.$insert(self.$type, person, onInsert);
            }

            return callback(new VError(err, 'failed to save the person.'));
        }

        debug('Updated existing person: %j', updatedPerson);

        callback(null, updatedPerson);
    }

    function onInsert (err, person) {
        if (err) {
            return callback(new VError(err, 'failed to persist a new person.'));
        }

        debug('save - Saved person: %j', person);

        callback(null, person);
    }

    person.modified = (Date.now() / 1000 | 0);

    this.$update(this.$type, person, onUpdate);
};

PersonService.prototype.findAll = function findAll (callback) {
    mandatory(callback).is('function', 'Please provide a proper callback function');

    function onQuery (err, persons) {
        if (err) {
            debug('[ERROR] failed to find all persons via all providers');

            return callback(new VError(err, 'failed to find all persons via all providers'));
        }

        debug('received all persons from all providers (found %d person(s))', persons.length);

        callback(null, persons);
    }

    let query = {};

    debug('request all persons from all providers');

    this.$query(this.$type, query, onQuery);
};

PersonService.prototype.findById = function findById (id, callback) {
    mandatory(id).is('string', 'Please provide a proper person id');
    mandatory(callback).is('function', 'Please provide a proper callback function');

    function onQuery (err, persons) {
        if (err) {
            debug('[ERROR] failed to find the person with the id "%s" from all providers', id);
            return callback(new VError(err, 'failed to find the person with the id "%s" from all providers', id));
        }

        if (persons.length > 1) {
            debug('Autsch! Found multiple persons with the id "%s". That should not be possible!', id);
        }

        callback(null, persons[0]);
    }

    let query = {id: id};

    debug('request the person with the id "%s" from all providers', id);

    this.$query(this.$type, query, onQuery);
};
