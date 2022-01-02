import React from 'react';
import moment from 'moment-timezone';
import WeekCalendar from './WeekCalendar/WeekCalendar';
import { handleClientLoad, handleAuthClick } from './gcal';

export default class StandardCalendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      gcalLoaded: false,
      lastUid: 0,
      selectedIntervals: [], // take from props  firstDay={moment(event["startDate"])} numberOfDays={7}
      event: this.props.event
    }
    this.updateAvailabilities = this.updateAvailabilities.bind(this)
    this.setSelectedIntervals = this.setSelectedIntervals.bind(this)
    this.setGcalLoaded = this.setGcalLoaded.bind(this)
  }
  setGcalLoaded() {
    console.log("gcal loaded");
    this.setState({gcalLoaded: true});
  }
  componentDidMount() {
    const request = {
      sp_name: "getAvailabilities",
      params: [this.state.event["UUID"]]
    }
    fetch("/api", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      })
      .then(response => response.json())
      .then(avails => {
        avails.forEach(avail => {
          this.state.selectedIntervals.push(
            {
              uid: this.state.lastUid,
              start: moment(avail.startTime),
              end: moment(avail.endTime),
              value: "",
              type: "event"
            }
          )
          this.state.lastUid++;
        });
      })
      .then(data => {
          handleClientLoad(this.state, this.setGcalLoaded);
          this.setState({loaded: true});
      });
  }

  updateAvailabilities() {
    const request = {
      sp_name: "deleteAvailabilities",
      params: [this.state.event["UUID"]]
    };
    fetch("/api", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then(data => {
        this.state.selectedIntervals.forEach(avail => {
          if (avail.type == "event") {
            const request = {
              sp_name: "addAvailability",
              params: [
                        this.state.event["UUID"], 
                        avail.start.clone().utc().format("YYYY-M-D HH:mm:ss"), 
                        avail.end.clone().utc().format("YYYY-M-D HH:mm:ss")
                      ]
            };
            fetch("/api", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(request),
            });
          }
        });
      }
    );
  }

  handleEventRemove = (event) => {
    const {selectedIntervals} = this.state;
    const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
    if (index > -1) {
      selectedIntervals.splice(index, 1);
      this.setState({selectedIntervals});
    }
  }

  handleEventUpdate = (event) => {
    const {selectedIntervals} = this.state;
    const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
    if (index > -1) {
      selectedIntervals[index] = event;
      this.setState({selectedIntervals});
    }
  }

  handleSelect = (newIntervals) => {
    const {lastUid, selectedIntervals} = this.state;
    const intervals = newIntervals.map( (interval, index) => {

      return {
        ...interval,
        type: "event",
        uid: lastUid + index
      }
    });

    this.setState({
      selectedIntervals: selectedIntervals.concat(intervals),
      lastUid: lastUid + newIntervals.length
    });
  }

  setSelectedIntervals = (intervals) => {
    this.state.selectedIntervals.length = 0
    intervals.forEach(interval => {
      this.state.selectedIntervals.push(interval);
    });
  }

  render() {
    if (!this.state.loaded) {
      return <div></div>
    }
    return <div><WeekCalendar
      startTime = {moment({h: 7, m: 0})}
      endTime = {moment({h: 22, m: 15})}
      firstDay = {moment(this.state.event["startDate"]).add(1, 'days')}
      numberOfDays = {moment(this.state.event["endDate"]).diff(moment(this.state.event["startDate"]), "days")+1}
      scaleFormat = {"HH:mm"}
      dayFormat = {"ddd. MM.DD"}
      //showModalCase = {["edit", "delete"]}
      useModal = {false}
      selectedIntervals = {this.state.selectedIntervals}
      onIntervalSelect = {this.handleSelect}
      onIntervalUpdate = {this.handleEventUpdate}
      onIntervalRemove = {this.handleEventRemove}
      setSelectedIntervals = {this.setSelectedIntervals}
      onEventClick = {this.handleEventRemove} // function(){console.log("clicked on event");}
      eventSpacing = {0} // <button onClick={this.loadGoogleCalendar}>Load Gcal</button>
    />
    <div style={{textAlign: "right", padding: "10px"}}>
      <button class="bluebutton" onClick={handleAuthClick} disabled={this.state.gcalLoaded}>Load Google Calendar</button>
      <button class="greenbutton" onClick={this.updateAvailabilities}>Save</button>
    </div>
    </div>
  }
}
