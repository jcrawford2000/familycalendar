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
const server = require('./src/server');
const calendar = require('./src/calendar');
const requestHandlers = require('./src/requestHandlers');
const log4js = require('log4js');

var logger = log4js.getLogger('index');
/**
 * Handler map sets up the valid paths from the app and the associated handler which is passed to the server
 */
var handlerMap = [ {path: '/', handler: requestHandlers.index},
                   {path: '/list/:id', handler: requestHandlers.listEventsByCalendar},
                   {path: '/listall', handler: requestHandlers.listAllEvents},
                   {path: '/event/:calId/:id', handler: requestHandlers.getEvent},
                   {path: '/calendar', handler: requestHandlers.showCalendar}
                 ];
/**
 * Initialize Calendar Access, start server
 */
logger.info("Family Calendar Server Starting");
calendar.init();
server.start(handlerMap);


/**
 * Notes
 * 
 * Startup Tasks
 *  - When app starts up, need to get auths for the calendars we're tracking.
 *  --- Get a list of calendars for each user
 *  ------ Initialize the Server and setup routes (Each route should be assigned a handler)
 * 
 * 
 * Pages:
 * index - Lists available calendars
 * /list/{calendarId} - Lists the events within a given calendar
 * /listall - List all events for all known calendars
 * /event/{eventId} - Lists details for a given event
 * 
 * 
 * Calendar Functions Needed
 * 1. Get Calendars - gets all calendars for the user
 * 2. List Events by Calendar - lists all events on a calendar
 * 3. List All Events - lists all events for all calendars
 * 4. Get Event - Gets a single event 
 * 
 * 
 * index --> Init Calendar
 *       --> Start Server
 * 
 * Server --> Accept requests - route to appropriate request handler
 * 
 * Calendar -->  All calendar functions
 * 
 * Request Handler --> Handle Request - i.e. Pull info from Calendar
 * 
 */