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

BaseMerger.prototype.$getPriorityProviderName = function $getPriorityProviderName () {
    return PRIORITY_PROVIDER;
};

BaseMerger.prototype.$getProviders = function $getProviders (withoutPriority) {
    var self = this;
    var except = (withoutPriority) ? this.$providers.indexOf(PRIORITY_PROVIDER) : -1;
    var items = [];

    this.$providers.forEach(function onEach (providerName, index) {
        if (except !== index) {
            let entries = self.$source[providerName];

            entries.forEach(function onEach (entry) {
                items.push(entry);
            });
        }
    });

    return items;
};

BaseMerger.prototype.$commit = function $commit (item) {
    this.$results.push(item);
};

BaseMerger.prototype.$getCommittedItemBy = function $getCommittedItemBy (attr, value) {
    return this.$results.filter(function onFilter (item) {
        return (item[attr] === value);
    })[0];
};
