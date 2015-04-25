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

var series = require('series');
var VError = require('verror');

const AVAILABLE_PROVIDERS = {
    official: require('@getcahoots/provider-official'),
    torial: require('@getcahoots/provider-torial')
};

function BaseService (providers) {
    this.providers = {};

    // If no providers has been specified, take all available providers
    providers = providers || Object.keys(AVAILABLE_PROVIDERS);

    // Mount the actual providers for this service;
    providers.forEach(function onEach (providerName) {
        if (AVAILABLE_PROVIDERS[providerName]) {
            this.providers[providerName] = AVAILABLE_PROVIDERS[providerName];
        }
    }.bind(this));

    if (!Object.keys(this.providers).length) {
        throw new VError('Please specify at least one available provider. Available Providers are: %s', Object.keys(AVAILABLE_PROVIDERS).join(', '));
    }
}

/**
 * DOCME
 *
 * @param  {Function}
 * @return {[type]}
 *
 */
BaseService.prototype.$handleNotWritable = function $handleNotWritable (callback) {
    return process.nextTick(function onTick() {
        callback(new VError('The `official` provider has not been mounted. Therefore no write operations are possible.'));
    });
};

/**
 * DOCME
 *
 * @param  {[type]}
 * @return {[type]}
 *
 */
BaseService.prototype.$tag = function $tag (results) {
    var tagged = [];

    Object.keys(results).forEach(function onEach (providerName) {
        var items = results[providerName];

        items.forEach(function onEach (item) {
            item.provider = providerName;
        });

        tagged.push.apply(tagged, items);
    });

    return tagged;
};

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
    var official = this.providers.official;

    if (!official) {
        return this.$handleNotWritable(callback);
    }

    let entity = official(entityType);

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
    var official = this.providers.official;

    if (!official) {
        return this.$handleNotWritable(callback);
    }

    let entity = official(entityType);

    function onInsert (err, result) {
        if (err) {
            return callback(new VError(err, 'failed to insert "%s" entity in the official provider', entityType));
        }

        callback(null, result);
    }

    entity.insert(record, onInsert);
};

BaseService.prototype.$query = function $query (entityType, query, callback) {
    var self = this;
    var results = {};

    function onDone (err) {
        if (err) {
            return callback(new VError(err, 'failed to query all "%s" provider entities', entityType));
        }

        let tagged = self.$tag(results);

        callback(null, tagged);
    }

    let tasks = [];

    Object.keys(this.providers).forEach(function onEach (providerName) {
        var provider = this.providers[providerName];
        var entity = provider(entityType);

        tasks.push(function execute (done) {
            function onQuery (err, datasets) {
                if (err) {
                    return done(new VError(err, 'failed to query the entity "%s" on the provider "%s"', entityType, providerName));
                }

                results[providerName] = datasets;

                done(null);
            }

            entity.query(query, onQuery);
        });
    }.bind(this));

    series(tasks, onDone);
};

module.exports = BaseService;
