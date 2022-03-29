import React from "react";
import StandardCalendar from "./StandardCalendar";
import { useParams } from "react-router";
import moment from "moment-timezone";

class RespondPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        UUID: "",
        isRecurring: "",
      },
      loaded: false,
    };
    this.setLoaded = this.setLoaded.bind(this);
  }
  setLoaded() {
    this.setState({ loaded: true });
  }
  getEvent() {
    const request = {
      sp_name: "getEvent",
      params: [this.props.eventUUID],
    };
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.json())
      .then((events) => {
        this.state.event.name = events[0]["name"];
        this.state.event.description = events[0]["description"];
        this.state.event.startDate = events[0]["startDate"];
        this.state.event.endDate = events[0]["endDate"];
        this.state.event.UUID = events[0]["UUID"];
        this.state.event.isRecurring = events[0]["isRecurring"];
        this.setLoaded();
      });
  }
  componentDidMount() {
    this.getEvent();
  }
  render() {
    let { event, loaded } = this.state;
    if (loaded) {
      return (
        <div class="parent-container">
          <div style={{ textAlign: "center", padding: "10px" }}>
            <h3>
              {event.name} - {event.description}
            </h3>
          </div>
          <StandardCalendar event={event} />
        </div>
      );
    }
    return <div></div>;
  }
}

export default function Respond(props) {
  let { UUID } = useParams();
  return <RespondPage eventUUID={UUID} refresh={props.refresh} />;
}
