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

var mandatory = require('mandatory');

const AVAILABLE_SERVICES = {
    person: require('./person'),
    organization: require('./organization')
};

/**
 * Creates a factory method which is capable of instantiating services.
 *
 * @param  {string} providers a comma-delimited list of providers (when empty then all providers will be used)
 *
 * @return {function} the service factory method
 *
 */
module.exports = function instantiate (providers) {

    if (providers) {
        providers = providers.split(',').map(function onMap (providerName) {
            return providerName.trim();
        });
    }

    return function createService (name) {
        var service = AVAILABLE_SERVICES[name];

        mandatory(service).is('function', 'Please provide a proper service name');

        return service(providers);
    };
};
