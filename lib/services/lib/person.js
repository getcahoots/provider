/*
 * cahoots-provider-services
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

var debug = require('debug')('cahoots:provider:services:person');
var mandatory = require('mandatory');
var VError = require('verror');

var BaseService = require('./base');

module.exports = function instantiate () {
    var service = new PersonService();

    return {
        findAll: service.findAll.bind(service),
        findById: service.findById.bind(service)
    };
};

function PersonService () {
    this.$type = 'person';

    BaseService.call(this);
}

util.inherits(PersonService, BaseService);

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
