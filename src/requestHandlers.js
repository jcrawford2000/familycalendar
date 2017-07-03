
const calendar = require('./calendar');
const pug = require('pug');

var cal = calendar;

/**
 * The index function returns a list of calendars associated with the user
 * @param {*} req The HTTP Request from Express
 * @param {*} res The HTTP Response from Express
 */
function index(req, res) 
{
    //Get List of Calendars available to user, then render
    cal.getCalendarList(function(calendarList){
        res.render('index', {title: 'Family Calendar', message: 'Available Calendars', list: calendarList});
    })
}

function showCalendar(req, res) {
    res.render('calendar', {title: 'Family Calendar'});
}

/**
 * Lists the events associated with the specific calendar
 * @param {*} req 
 * @param {*} res 
 */
function listEventsByCalendar(req, res) { 
    //Get List of Events available from this calendar, then render
    var calendarId = req.params.id;
    cal.listEvents(calendarId, function(eventsList){
        if (eventsList.length == 0) {
            res.render('eventsList', {title: 'Calendar Events', message: 'No Events in Calendar', list: eventsList});
        }
        else {
            var eventList = [];
            for (var i = 0; i < eventsList.length; i++) {
                var event = new Object();
                event.calId = calendarId;
                event.id = eventsList[i].id;
                event.name = eventsList[i].summary;
                eventList.push(event);
            }
            res.render('eventsList',{title: 'Calendar Events', message: 'Events in Calendar', list: eventList});
        }
    })
}


function listAllEvents(req, res) { res.send("List All Events"); }


function getEvent (req, res) {
     var calendarId = req.params.calId;
     var eventId = req.params.id;
     cal.getEvent(calendarId, eventId, function(event){
         if (event == null)
         {
             res.render('event', {title: 'Event', message: 'Event Not Found', event: event});
         }
         else
         {
             res.render('event', {title: 'Event', message: 'Event Details', event: event});
         }
     })
    }



exports.index = index;
exports.listEventsByCalendar = listEventsByCalendar;
exports.listAllEvents = listAllEvents;
exports.getEvent = getEvent;
exports.showCalendar = showCalendar;