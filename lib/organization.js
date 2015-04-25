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

var debug = require('debug')('cahoots:provider:organization');
var mandatory = require('mandatory');
var VError = require('verror');

var BaseService = require('./base');

module.exports = function instantiate (providers) {
    var service = new OrganizationService(providers);

    return {
        save: service.save.bind(service),
        findAll: service.findAll.bind(service),
        findById: service.findById.bind(service),
        findByIds: service.findByIds.bind(service)
    };
};

function OrganizationService (providers) {
    this.$type = 'organization';

    BaseService.call(this, providers);
}

util.inherits(OrganizationService, BaseService);

/**
 * Persists an organization.
 *
 * @param {object} organization
 * The organization object that should be persisted.
 *
 * @param {function} callback
 * Will be executed when the organization object has been stored. Executed as
 * `callback(err, organization)`.
 *
 */
OrganizationService.prototype.save = function save (organization, callback) {
    var self = this;

    mandatory(organization).is('object', 'Please define a organization which should be saved.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onUpdate (err, updatedOrg) {
        if (err) {
            if (err.type === 'NotFoundError') {
                debug('The organization does not exist. Inserting it.');

                // Due to the fact that this is a new organization entry, set the
                // timestamps accordingly.
                organization.created = organization.modified = (Date.now() / 1000 | 0);

                return self.$insert(self.$type, organization, onInsert);
            }

            return callback(new VError(err, 'failed to save the organization.'));
        }

        debug('Updated existing organization: %j', updatedOrg);

        callback(null, updatedOrg);
    }

    function onInsert (err, insertedOrg) {
        if (err) {
            return callback(new VError(err, 'failed to save the organization.'));
        }

        debug('Created new organization: %j', insertedOrg);

        callback(null, insertedOrg);
    }

    organization.modified = (Date.now() / 1000 | 0);

    this.$update(this.$type, organization, onUpdate);
};

OrganizationService.prototype.findAll = function findAll (callback) {
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onQuery (err, organizations) {
        if (err) {
            debug('[ERROR] failed to find all organizations via all providers');

            return callback(new VError(err, 'failed to find all organizations via all providers'));
        }

        debug('received all organizations from all providers (found %d organization(s))', organizations.length);

        callback(null, organizations);
    }

    let query = {};

    debug('request all organizations from all providers');

    this.$query(this.$type, query, onQuery);
};

OrganizationService.prototype.findById = function findById (id, callback) {
    mandatory(id).is('string', 'Please provide an organization id.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onQuery (err, organizations) {
        if (err) {
            debug('[ERROR] failed to find the organization with the id "%s" from all providers', id);
            return callback(new VError(err, 'failed to find the organization with the id "%s" from all providers', id));
        }

        if (organizations.length > 1) {
            debug('Autsch! Found multiple organizations with the id "%s". That should not be possible!', id);
        }

        callback(null, organizations[0]);
    }

    let query = {id: id};

    debug('request the organization with the id "%s" from all providers', id);

    this.$query(this.$type, query, onQuery);
};

OrganizationService.prototype.findByIds = function findByIds (ids, callback) {
    mandatory(ids).is('array', 'Please define an array with ids.');
    mandatory(callback).is('function', 'Please define a proper callback function.');

    function onQuery (err, organizations) {
        if (err) {
            debug('[ERROR] failed to find the organizations with the id\'s "%j" from all providers', ids);
            return callback(new VError(err, 'failed to find the organizations with the id\'s "%j" from all providers', ids));
        }

        debug('received the organizations with the id\'s from all providers (found %d organization(s))', organizations.length);

        callback(null, organizations);
    }

    let query = {id: {$in: ids}};

    debug('request the organizations with the id\'s "%j" from all providers', ids);

    this.$query(this.$type, query, onQuery);
};
