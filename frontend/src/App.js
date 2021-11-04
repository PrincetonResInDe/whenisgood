import React from 'react'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import './react-big-calendar.css'

const propTypes = {}

class Selectable extends React.Component {
  constructor(...args) {
    super(...args)
    
    let events = [
  {
    id: 0,
    title: 'All Day Event very long title',
    allDay: true,
    start: new Date(2015, 3, 0),
    end: new Date(2015, 3, 1),
  }];

    this.state = { events }
  }

  handleSelect = ({ start, end }) => {
    /*const title = window.prompt('New Event name')
    if (title)*/
      const title = "";
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title,
          },
        ],
      })
  }

  render() {
    const localizer = momentLocalizer(moment);
    return (
      <>
        <Calendar
          selectable
          localizer={localizer}
          events={this.state.events}
          defaultView={Views.WEEK}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2015, 3, 12)}
          onSelectEvent={event => {}/*alert(event.title)*/}
          onSelectSlot={this.handleSelect}
        />
      </>
    )
  }
}

Selectable.propTypes = propTypes

export default Selectable
