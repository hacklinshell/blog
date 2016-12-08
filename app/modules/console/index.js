'use strict';
const Router = require('koa-router');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

let Module = function() {}
    //路由定义
Module.prototype.routers = function() {
    let router = new Router();
    let controllerDir = path.join(__dirname, 'controller');
    if (fs.existsSync(controllerDir)) {
        let files = fs.readdirSync(controllerDir);
        _.each(files, function(v, k) {
                if (v.lastIndexOf('Controller.js')) {
                    let controllerName = v.replace('Controller.js', '')
                    let controller = require(path.join(controllerDir, v));
                    let actions = _.keys(controller);
                    controllerName = controllerName.toLowerCase();
                    _.each(actions, function(v, k) {
                        if (v.lastIndexOf('Action')) {
                            let actionName = v.replace('Action', '').toLowerCase();
                            if (controllerName == 'console') {
                                router.all('/' + controllerName + '/' + actionName, controller[v]);
                            }
                        }
                    })
                }
            })
            //默认路由
        router.all('/', require(path.join(controllerDir, 'MainController'))['indexAction']);
    }
    return router.middleware();
};

module.exports = Module;
