'use strict'
const _ = require('lodash');
const fs = require('fs');
const koa = require('koa');
const path = require('path');
const serve = require('koa-static');
const mount = require('koa-mount');
const favicon = require('koa-favicon');

const bodyParser = require('koa-bodyparser');
const bodyXmlParser = require('koa-xml');
const winstonKoaLogger = require('./lib/KoaLogger');
const userAgent = require('./lib/UserAgent');
const moment = require('moment');
const locale = require('koa-locale');

//模块定义
const Modules = require('./config/modules');
const config = require('./config/config');
const Dstabase = require('./config/databases')
const Logger = require('./config/logger');

//实例化对象
const modules = new Modules();
const logger = new Logger(config.app.name);
const database = new Dstabase(modules.getCollections()); //模块数据库

process.setMaxListeners(0); //取消最大监听数限制

let app = koa();

locale(app, 'zh-cn');

//错误处理
app.on('error', function(err) {
    logger.error('app error', err, err.stack);
});

app.proxy = true;
app.name = config.app.name;
app.keys = config.app.keys;

app.use(winstonKoaLogger(logger));
app.use(bodyXmlParser({
    explicitArray: false,
    ignoreAttrs: true
}));
app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}));

app.use(function*(next) {
    var ua = new userAgent.UserAgent();
    var source = this.request.headers['user-agent'] || '';
    if (typeof source === 'undefined') {
        source = 'unknown';
    }
    this.state = {};
    this.state.userAgent = ua.parse(source);
    yield next;
});
//静态文件
app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use(serve(path.join(__dirname, '../public')));

//输出的公共变量
app.use(function*(next) {
    this.config = config;
    this.logger = logger;
    this.models = this.app.models;
    yield next;
    this.models = null;
    this.logger = null;
});

//mount modules
var m = modules.getModules();
_.each(_.keys(m), function(v, k) {
    app.use(mount('/' + v, m[v].routers()));
});

app.use(mount('/', function*() {
    this.body = 'My blog system'
}))

database.initialize(function(err, models) {
    if (err) {
        throw err;
    }
    app.models = models;
    app.listen(config.port, function(err) {
        if (!err) {
            logger.info('http start listen', config.port);
        }
    });
});
