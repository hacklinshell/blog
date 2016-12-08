'use strict';
const _ = require('lodash');
const config = require('./config');
const Waterline = require('waterline');
const mongo = require('sails-mongo');

let orm_settings = {
    adapters: {
        'mongo': mongo,
    },
    connections: {
        mongo: _.defaults(_.clone(config.database.mongo), {
            adapter: 'mongo',
            auto_reconnect: true,
            reconnectInterval: 1000,
            reconnectTries: 99999999,
            wlNext: {
                caseSensitive: true
            }
        })
    },
    defaults: {
        migrate: 'safe'
    }
};

module.exports = function(collections) {
    let orm = new Waterline();
    _.each(collections, function(v, k) {
        orm.loadCollection(v);
    });

    return {
        initialize: function(cb) {
            orm.initialize(orm_settings, cb);
        }
    };
}
