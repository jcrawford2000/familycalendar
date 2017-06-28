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
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const log4js = require('log4js');
const path = require('path');

/*
 * Constants
 */ 
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = path.resolve(__dirname, 'calendar-nodejs-quickstart.json');
const CLIENT_SECRET_PATH = path.resolve(__dirname, 'client_secret.json');
const logger = log4js.getLogger('calendar');

/** 
 * Initialize Calendar and authorize with Google OAuth2
 * @param {function} callback The callback to call when initialization is completed.
 */
function init(callback){
    logger.info("Calendar Initializing");
    // Load client secrets from a local file.
    logger.info("Loading Client Secret from " + CLIENT_SECRET_PATH);
    fs.readFile(CLIENT_SECRET_PATH, function processClientSecrets(err, content) {
        if (err) {
            logger.error("Error loading client secret file" + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Google Calendar API.
        logger.info("Authorizing with Google.");
        authorize(JSON.parse(content), function (auth) { 
            //Set Auth Token
            gauth = auth; 
            logger.debug("Authorized with Google"); 
            callback();});
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  logger.info("Checking for stored token");
  logger.debug("Token Path:"+ TOKEN_PATH);
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      logger.info("Using stored token.");
      oauth2Client.credentials = JSON.parse(token);
    }
    callback(oauth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {function} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client) {
  logger.info("Stored token not found, getting a new token.");
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        logger.error("Error retrieving access token", err);
        return;
      }
      logger.info("Successfully retreived Token.");
      oauth2Client.credentials = token;
      storeToken(token);
      return;
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  logger.info("Saving Token.")
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  logger.info('Token stored to ' + TOKEN_PATH);
}

/**
 * Retreive list of calendars for the user
 */
function getCalendarList()
{
    logger.info("Getting Calendar List");
    var gcalendar = google.calendar('v3');
    var calendars = [];
    var cal;
    gcalendar.calendarList.list({auth: gauth}, function(err, response){
                      if (err) {
                          logger.fatal("Error retrieving Calendars List", err);
                          return;
                      }
                      //logger.debug("Response:\n" + JSON.stringify(response));
                      var list = response.items;
                      logger.debug("List contains " + list.length + " calendars");
                      for (var i=0; i < list.length; i++)
                      {
                          cal = new Object();
                          cal.id = list[i].id;
                          cal.name = list[i].summary;
                          logger.debug("Adding Calendar with ID:" + cal.id + " and Name:" + cal.name + " to Calendars Collection");
                          calendars.push(cal);
                      }
                      logger.debug("Calendars Collection:\n" + JSON.stringify(calendars,null,2));
                  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth, calendarId) {
  logger.info("Retreiving list of events from Calendar.");
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: calendarId,
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      logger.error('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    logger.info("Calendar contains " + events.length + " events.");
    if (events.length == 0) {
      logger.info('No upcoming events found.');
    } else {
      logger.info('Listing Upcoming 10 events:');
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        logger.info('Event %d:\n\tStart Date: %s \n\tSummary: %s', i+1, start, event.summary);
      }
    }
  });
}

/*
 * Exports
 */
exports.init = init;
exports.getCalendarList = getCalendarList;