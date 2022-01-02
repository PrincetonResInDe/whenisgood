import moment from 'moment-timezone';

// make this file into react component

let gapi = window.gapi
let CLIENT_ID = "1061583639488-a6in0ntustneh0hqfcnn9ju5g8uu6e7t.apps.googleusercontent.com"
let API_KEY = "AIzaSyBu5yiQId53xE4PW-zoJRseKqFhSoPwv30"
let DISCOVERY_DOCS=["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
let SCOPES = "https://www.googleapis.com/auth/calendar.events"
let state = null;
let callback = null;

//export a function that gets start time(date picker), location, name 
export const handleClientLoad = (calendarState, callbackFunc) => {
    gapi.load('client:auth2', () => {
        state = calendarState;
        callback = callbackFunc;
        initClient();
    });
}

export const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
}

export const handleSignoutClick = (event) => {
    gapi.auth2.getAuthInstance().signOut();
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        //appendPre(JSON.stringify(error, null, 2));
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      listUpcomingEvents();
    }
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    /*
    calendarId="primary",
    timeMin=data["timeMin"], timeMax=data["timeMax"],
    singleEvents=True, orderBy="startTime"
    )
    */
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': moment(state.event["startDate"]).format(),
        'timeMax': moment(state.event["endDate"]).format(),
        'singleEvents': true,
        'orderBy': 'startTime'
    }).then(function(response) {
        var events = response.result.items;
        events.forEach(event => {
            state.selectedIntervals.push(
              {
                uid: state.lastUid,
                start: moment(event.start.dateTime),
                end: moment(event.end.dateTime),
                value: event.summary,
                type: "gcalevent"
              }
            )
            state.lastUid++;
          });
        callback();
    });
}