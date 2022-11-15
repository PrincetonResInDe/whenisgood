import React from 'react';
import moment from 'moment-timezone';
import WeekCalendar from './WeekCalendar/WeekCalendar';
import { handleClientLoad, handleAuthClick } from './gcal';
import { Button } from 'reactstrap';

export default class StandardCalendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      lastUid: 0,
      selectedIntervals: [], // take from props  firstDay={moment(event["startDate"])} numberOfDays={7}
      event: this.props.event
    }
    this.updateAvailabilities = this.updateAvailabilities.bind(this)
    this.setSelectedIntervals = this.setSelectedIntervals.bind(this)
    this.setLoaded = this.setLoaded.bind(this)
  }
  setLoaded() {
    console.log("setting loaded true");
    this.setState({loaded: true});
  }
  componentDidMount() {
    const request = {
      sp_name: "getUserAvailabilities",
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
          this.setState({ "lastUid": this.state.lastUid+1})
        });
      })
      .then(data => {
          handleClientLoad(this.state, this.setLoaded);
          this.setLoaded();
      });
  }

  updateAvailabilities() {
    let availabilityString = "";
    this.state.selectedIntervals.forEach(avail => {
      if (avail.type === "event") {
        let startTime = avail.start.clone().utc().format("YYYY-M-D HH:mm:ss")
        let endTime = avail.end.clone().utc().format("YYYY-M-D HH:mm:ss")
        availabilityString += startTime + ',' + endTime + ';';
      }
    });
    const request = {
      sp_name: "saveAvailabilityArray",
      params: [
                this.state.event["UUID"],
                availabilityString
              ]
    };
    fetch("/api", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then(
      data => {
        alert("Saved");
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

  // TODO: check if my changes work (changed to setState)
  setSelectedIntervals = (intervals) => {
    intervals.forEach(interval => {
      this.setState({"selectedIntervals": [...this.state.selectedIntervals, interval]});
    });
  }

  render() {
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
      <Button color="primary" onClick={handleAuthClick} disabled={!this.state.loaded}>Load Google Calendar</Button>
      <Button color="success" onClick={this.updateAvailabilities}>Save</Button>
    </div>
    </div>
  }
}
/*
      <button class="bluebutton" onClick={handleAuthClick} disabled={!this.state.loaded}>Load Google Calendar</button>
      <button class="greenbutton" onClick={this.updateAvailabilities}>Save</button> */
