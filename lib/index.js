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

var mandatory = require('mandatory');

const SERVICES = {
    person: require('./person'),
    organization: require('./organization')
};

module.exports = function instantiate (name) {
    var service = SERVICES[name];

    mandatory(service).is('function', 'Please provide a proper service name');

    return service();
};
