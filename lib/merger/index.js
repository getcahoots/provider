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

const mergers = {
    person: require('./person')
};

module.exports = function createMerger (name) {
    var merger = mergers[name];

    mandatory(merger).is('function', 'Please define a proper name of the merger you want to create');

    return merger;
};
