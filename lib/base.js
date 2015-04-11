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
    torial: require('cahoots-provider-torial')
};

module.exports = BaseService;

function BaseService () {}

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
