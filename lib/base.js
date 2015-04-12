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

var series = require('async-light').series;
var VError = require('verror');

const PROVIDERS = {
    torial: require('cahoots-provider-torial'),
    official: require('cahoots-provider-official')
};

module.exports = BaseService;

function BaseService () {}

/**
 * @private
 *
 * Update a given entity type.
 *
 * IMPORTANT NOTE: This method will only update the given record via the official provider.
 *
 * @param {string} entityType
 * The entity type on which the `update` method should be performed.
 *
 * @param {object} record
 * The data record which should be updated.
 *
 * @param {function} callback
 * Will be executed as `callback(err, updatedRecord)`.
 *
 */
BaseService.prototype.$update = function $update (entityType, record, callback) {
    var official = PROVIDERS.official;
    var entity = official(entityType);

    function onUpdate (err, result) {
        if (err) {
            let error = new VError(err, 'failed to update "%s" entity in the official provider', entityType);
            error.type = err.type;

            return callback(error);
        }

        callback(null, result);
    }

    entity.update(record, onUpdate);
};

/**
 * @private
 *
 * Inserts a given entity type.
 *
 * IMPORTANT NOTE: This method will only insert the given record via the official provider.
 *
 * @param {string} entityType
 * The entity type on which the `insert` method should be performed.
 *
 * @param {object} record
 * The data record which should be inserted.
 *
 * @param {function} callback
 * Will be executed as `callback(err, insertedRecord)`.
 *
 */
BaseService.prototype.$insert = function $insert (entityType, record, callback) {
    var official = PROVIDERS.official;
    var entity = official(entityType);

    function onInsert (err, result) {
        if (err) {
            return callback(new VError(err, 'failed to insert "%s" entity in the official provider', entityType));
        }

        callback(null, result);
    }

    entity.insert(record, onInsert);
};

BaseService.prototype.$query = function $query (entityType, query, callback) {
    var entities = Object.keys(PROVIDERS).map(function onMap (provider) {
        var entity = PROVIDERS[provider](entityType);

        return entity;
    });

    var results = [];

    function onDone (err) {
        if (err) {
            return callback(new VError(err, 'failed to query all "%s" provider entities', entityType));
        }

        // TODO: Normalize the results

        callback(null, results);
    }

    let tasks = [];

    entities.forEach(function onEach (entity) {
        tasks.push(function execute (done) {

            function onQuery (err, datasets) {
                if (err) {
                    return done(new VError(err, 'failed to query an provider entity'));
                }

                results.push.apply(results, datasets);

                done(null);
            }

            entity.query(query, onQuery);
        });
    });

    series(tasks, onDone);
};
