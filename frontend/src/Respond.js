import React from 'react';
import StandardCalendar from './StandardCalendar';
import { useParams } from "react-router";
import moment from 'moment-timezone';

export default function Respond(props) {
    let { UUID } = useParams();
    let event = props.events.find(event => {
      return event.UUID === UUID;
    });
    return (
      <div>
        <div style={{textAlign: "center"}}>
          <h2>{event["name"]} - {event["description"]}</h2>
        </div>
        <StandardCalendar event={event}/>
      </div>
    )
}