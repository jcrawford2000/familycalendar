/**
 * Copyright 2017 Justin Crawford, All Rights Reserved
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use-strict';

/*
 * Includes
 */
const express = require('express');
const log4js = require('log4js');
const calendar = require('./calendar');
const pug = require('pug');

const logger = log4js.getLogger("server");
const app = express();
const PORT = process.env.PORT || 8888;
const router = express.Router();
var cal;

function setCal(calendar)
{
    cal = calendar;
}


/**
 * Server Startup 
 * Setup server and router using Express
 */
function start() {
    logger.info("Server Initializing...")
    app.use(log4js.connectLogger(logger, { level: log4js.levels.DEBUG}));
    //router.use(log4js.connectLogger(logger, { level: log4js.levels.DEBUG}));
    //router.get('/', function(req, res){
    //    res.json({message:'Hello World!'});
    //});
    //app.use('/api', router);
    app.set('views', './views');
    app.set('view engine','pug');
    app.get('/', function(req, res)
        {
            res.render('index', {title: 'Hey', message: 'Hello there!', list: ['one','two','three']});
        });
    app.listen(PORT);
    
    logger.info("Initialization Complete. Server listenting on port:" + PORT);
}

/*
 * Exports
 */
exports.start = start;