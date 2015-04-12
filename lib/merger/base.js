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

const PRIORITY_PROVIDER = 'official';

module.exports = BaseMerger;

function BaseMerger (source) {
    this.$providers = Object.keys(source);
    this.$source = source;

    this.$results = [];
}

BaseMerger.prototype.$getPriorityProvider = function $getPriorityProvider () {
    return PRIORITY_PROVIDER;
};

BaseMerger.prototype.$getProviders = function $getProviders (withoutPriority) {
    var except = (withoutPriority) ? this.$providers.indexOf(PRIORITY_PROVIDER) : -1;
    var providers = [];

    this.$providers.forEach(function onEach (providerName, index) {
        if (except !== index) {
            providers.push(providerName);
        }
    });

    return providers;
};

BaseMerger.prototype.$commit = function $commit (item) {
    this.$results.push(item);
};

BaseMerger.prototype.$pull = function $pull (attr, value) {
    return this.$results.filter(function onFilter (item) {
        return (item[attr] === value);
    })[0];
};
