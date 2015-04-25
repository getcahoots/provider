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

var debug = require('debug')('cahoots:provider:base');

var series = require('async-light').series;
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
        var provider = self.providers[providerName];
        var entity = provider(entityType);

        tasks.push(function execute (done) {
            function onQuery (err, datasets) {
                if (err) {
                    return done(new VError(err, 'failed to query the entity "%s" on the provider "%s"', entityType, providerName));
                }

                results[providerName] = datasets;

                debug('recevied result from querying the entity type "%s" on the provider "%s"', entityType, providerName);

                done(null);
            }

            debug('about to query the entity type "%s" on the provider "%s"', entityType, providerName);

            entity.query(query, onQuery);
        });
    });

    series(tasks, onDone);
};

module.exports = BaseService;
