'use strict'
const _ = require('loadsh');

module.exports = {
    indexAction: function*() {
        let respData = {
            name: 'firs blog',
        }
        yield this.render('modules/console/index', respData);
    }
}
