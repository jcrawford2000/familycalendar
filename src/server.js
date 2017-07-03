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
const path = require('path');

const logger = log4js.getLogger("server");
const app = express();
const PORT = process.env.PORT || 8888;


function setEventsList(events)
{
    if (events.length == 0)
    {
        response.render('index',{title: 'Calendar Events', message: "No events in list", list: events})
    }
    else
    {
        var eventsList = [];
        for (var i = 0; i < events.length; i++)
        {
            var event = new Object();
            event.id = events[i].id;
            event.name = events[i].summary;
            eventsList.push(event);
        }
        response.render('index',{title: 'Calendar Events', message: "Events", list: eventsList});
    }
}


/**
 * Server Startup 
 * Setup server using Express
 */
function start(routeMap) {
    logger.info("Server Initializing...")
    app.use(log4js.connectLogger(logger, { level: log4js.levels.DEBUG}));
    app.set('views', './views');
    app.set('view engine','pug');
    app.use(express.static(path.join(__dirname, 'public')));
    for (var i=0; i < routeMap.length; i++)
    {
        logger.debug("Path:" + routeMap[i].path + " Uses Handler:" + routeMap[i].handler );
        app.get(routeMap[i].path, routeMap[i].handler);
    }
    app.listen(PORT);
    
    logger.info("Initialization Complete. Server listenting on port:" + PORT);
}

/*
 * Exports
 */
exports.start = start;
exports.setEventsList = setEventsList;