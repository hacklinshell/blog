'use strict';
//定义加载的模块 modules
const path = require('path');
const fs = require('fs');
const _ = require('lodash');


let Modules = function() {
    let folder = path.join(__dirname, '../modules');
    this.modules = {};
    let self = this;
    if (fs.existsSync(folder)) {
        let modulesDir = fs.readdirSync(folder);
        //路径
        _.each(modulesDir, function(v, k) {
            let dir = path.join(folder, v);
            //判断路径是否是目录
            if (fs.statSync(dir).isDirectory()) {
                let moduleName = v.toLowerCase();
                //判断是否存在index.js
                let filepath = path.join(dir, 'index.js');
                if (fs.existsSync(filepath)) {
                    let m = require(filepath);
                    self.modules[moduleName] = new m();
                }
            }
        });
    }
}
Modules.prototype.getCollections = function() {
    let self = this;
    let all_collections = {};
    _.each(_.keys(self.modules), function(v, k) {
        let collections = self.modules[v].modules;
        _.each(collections, function(v, k) {
            all_collections.push(v);
        });
    });
    return all_collections;
};
Modules.prototype.getModules = function() {
    return this.modules;
};

module.exports = Modules;
