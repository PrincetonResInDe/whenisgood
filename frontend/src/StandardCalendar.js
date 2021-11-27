import React from 'react';
import moment from 'moment-timezone';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';

export default class StandardCalendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      lastUid: 0,
      selectedIntervals: []
    }
    this.updateAvailabilities = this.updateAvailabilities.bind(this)
  }

  componentDidMount() {
    const request = {
      sp_name: "getAvailabilities",
      params: [this.props.eventUUID]
    }
    fetch("http://localhost:5000/api", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      })
      .then(response => response.json())
      .then(avails => {
        avails.forEach(avail => {
          console.log(avail.startTime);
          this.state.selectedIntervals.push(
            {
              uid: this.state.lastUid,
              start: moment(avail.startTime),
              end: moment(avail.endTime),
              value: ""
            }
          )
          this.state.lastUid++;
        });
      })
      .then(data => {
          console.log(this.state.selectedIntervals);
          this.state.selectedIntervals.forEach(avail => {
            console.log(avail.start.clone().utc().format("YYYY-M-D HH:mm:ss"));
            console.log(avail.end.clone().utc().format("YYYY-M-D HH:mm:ss"));
            console.log("-------");
          });
          this.setState({loaded: true});
      });
  }
  
  updateAvailabilities() {
    const request = {
      sp_name: "deleteAvailabilities",
      params: [this.props.eventUUID]
    };
    fetch("http://localhost:5000/api", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    this.state.selectedIntervals.forEach(avail => {
      const request = {
        sp_name: "addAvailability",
        params: [
                  this.props.eventUUID, 
                  avail.start.clone().utc().format("YYYY-M-D HH:mm:ss"), 
                  avail.end.clone().utc().format("YYYY-M-D HH:mm:ss")
                ]
      };
      fetch("http://localhost:5000/api", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
    });
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
        uid: lastUid + index
      }
    });

    this.setState({
      selectedIntervals: selectedIntervals.concat(intervals),
      lastUid: lastUid + newIntervals.length
    });
  }

  render() {
    if (!this.state.loaded) {
      return <div></div>
    }
    return <div><WeekCalendar
      startTime = {moment({h: 16, m: 15})}
      endTime = {moment({h: 22, m: 15})}
      firstDay = {moment("2021-11-22")}
      numberOfDays = {7}
      scaleFormat = {"HH:mm"}
      dayFormat = {"ddd. MM.DD"}
      //showModalCase = {["edit", "delete"]}
      selectedIntervals = {this.state.selectedIntervals}
      onIntervalSelect = {this.handleSelect}
      onIntervalUpdate = {this.handleEventUpdate}
      onIntervalRemove = {this.handleEventRemove}
      eventSpacing = {0}
    />
    <button onClick={this.updateAvailabilities}>Save</button>
    </div>
  }
}
