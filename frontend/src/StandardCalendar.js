import React from 'react';
import moment from 'moment';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';

export default class StandardCalendar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastUid: 0,
      selectedIntervals: [
        /*
        {
          uid: 1,
          start: moment({h: 10, m: 5}),
          end: moment({h: 12, m: 5}),
          value: "Booked by Smith"
        },
        {
          uid: 2,
          start: moment({h: 13, m: 0}).add(2,'d'),
          end: moment({h: 13, m: 45}).add(2,'d'),
          value: "Closed"
        },
        {
          uid: 3,
          start: moment({h: 11, m: 0}),
          end: moment({h: 14, m: 0}),
          value: "Reserved by White"
        },
        */
      ]
    }
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
      body: JSON.stringify(request), // '{"sp_name": "getAvailabilities", "params": ["' + this.props.eventUUID + '"]}'
      })
      .then(response => response.json())
      .then(avails => {
        console.log(avails);
        avails.forEach(avail => {
          this.state.selectedIntervals.push(
            {
              uid: this.state.lastUid,
              start: moment(avail.startTime).add(5,'h'),
              end: moment(avail.endTime).add(5,'h'),
              value: avail.name
            }
          )
          this.state.lastUid++;
        });
      });
      console.log(this.state);
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
                  avail.start.format("YYYY-M-D h:mm:ss"), 
                  avail.end.format("YYYY-M-D h:mm:ss") 
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
    this.updateAvailabilities();
  }

  handleEventUpdate = (event) => {
    const {selectedIntervals} = this.state;
    const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
    if (index > -1) {
      selectedIntervals[index] = event;
      this.setState({selectedIntervals});
    }
    this.updateAvailabilities();
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

    this.updateAvailabilities();
  }

  render() {
    return <WeekCalendar
      startTime = {moment({h: 16, m: 0})} // bug where events aren't being shown until you scroll the calendar
      endTime = {moment({h: 22, m: 15})}
      numberOfDays= {7}
      selectedIntervals = {this.state.selectedIntervals}
      onIntervalSelect = {this.handleSelect}
      onIntervalUpdate = {this.handleEventUpdate}
      onIntervalRemove = {this.handleEventRemove}
    />
  }
}
