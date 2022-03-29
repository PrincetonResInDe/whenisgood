import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Grid, IconButton, Button } from "@material-ui/core";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EqualizerIcon from "@mui/icons-material/Equalizer";

class EventLink extends React.Component {
  constructor(props) {
    super(props);
    this.deleteEvent = this.deleteEvent.bind(this);
  }
  deleteEvent() {
    const request = {
      sp_name: "deleteEvent",
      params: [this.props.event.UUID],
    };
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then((data) => {
      this.props.refresh();
    });
  }
  render() {
    let respond = "/respond/" + this.props.event["UUID"];
    let edit = "/edit/" + this.props.event["UUID"];
    let results = "/results/" + this.props.event["UUID"];
    return (
      <Grid item style={{ width: "100%" }}>
        <Card style={{ height: "12rem" }}>
          <Card.Body>
            <div style={{ height: "8rem" }}>
              <Card.Title>{this.props.event["name"]}</Card.Title>
              <Card.Text>{this.props.event["description"]}</Card.Text>
            </div>
            <footer>
              <Button variant="text" href={respond}>
                Respond
              </Button>
              <IconButton aria-label="edit" edge="end" href={edit}>
                <ModeEditOutlineIcon />
              </IconButton>
              <IconButton
                aria-lable="delete"
                edge="end"
                onClick={this.deleteEvent}
              >
                <DeleteOutlineIcon />
              </IconButton>
              <IconButton aria-label="results" edge="end" href={results}>
                <EqualizerIcon />
              </IconButton>
            </footer>
          </Card.Body>
        </Card>
      </Grid>
    );
  }
}

class MainColumn extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid
        item
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        xs={3}
        spacing={3}
      >
        <Grid item style={{ width: "100%" }}>
          <h4 style={{ borderBottom: "2px solid rgba(0, 71, 119, 1)" }}>
            {this.props.title}
          </h4>
        </Grid>
        {this.props.title == "Drafts" && (
          <Grid item style={{ width: "100%" }}>
            <Card style={{ height: "4 rem" }}>
              <Card.Body>
                <div style={{ height: "100%" }}>
                  <Card.Title>
                    <Link to="/create">
                      <h5>Create new event</h5>
                    </Link>
                  </Card.Title>
                </div>
              </Card.Body>
            </Card>
          </Grid>
        )}
        {this.props.cards}
      </Grid>
    );
  }
}

class ResponseLink extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let respond = "/respond/" + this.props.response["UUID"];
    return (
      <Grid item style={{ width: "100%" }}>
        <Card style={{ height: "12rem" }}>
          <Card.Body>
            <div style={{ height: "8rem" }}>
              <Card.Title>{this.props.response["name"]}</Card.Title>
              <Card.Text>{this.props.response["description"]}</Card.Text>
            </div>
            <footer>
              <Card.Link>
                <Link to={respond}>Edit Response</Link>
              </Card.Link>
            </footer>
          </Card.Body>
        </Card>
      </Grid>
    );
  }
}

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { host: true };
  }

  changeToHost = () => {
    this.setState({ host: true });
  }

  changeToAttendee = () => {
    this.setState({ host: false });
  }

  render() {
    let eventLinks = [];
    let responseLinks = [];
    this.props.events.forEach((event) => {
      eventLinks.push(
        <EventLink
          key={event["UUID"]}
          event={event}
          refresh={this.props.refresh}
        />
      );
    });
    this.props.responses.forEach((response) => {
      responseLinks.push(
        <ResponseLink key={"r" + response["UUID"]} response={response} />
      );
    });

    const hostColumns = [
      { title: "Drafts", cards: eventLinks },
      { title: "Sent", cards: [] },
      { title: "All Responses In", cards: responseLinks },
      { title: "Final Date Set", cards: [] },
    ];

    const attendeeColumns = [
      { title: "Need To Respond To", cards: [] },
      { title: "Responded To", cards: [] },
      { title: "Final Date Set", cards: [] },
      { title: "Past Events", cards: [] },
    ];

    return (
      <Grid
        container
        direction="row"
        className="parent-container"
        justifyContent="space-between"
        spacing={6}
      >
        <Grid
          item
          container
          spacing={2}
          direction="row"
          xs={12}
          className="host-attendee"
        >
          <Grid item onClick={this.changeToHost}>
            <h3
              style={
                !this.state.host ? { color: "rgba(160, 160, 160, 1)" } : {}
              }
            >
              Host
            </h3>
          </Grid>

          <Grid item onClick={this.changeToAttendee}>
            <h3
              style={this.state.host ? { color: "rgba(160, 160, 160, 1)" } : {}}
            >
              Attendee
            </h3>
          </Grid>
        </Grid>

        {this.state.host
          ? hostColumns.map(({ title, cards }) => (
              <MainColumn title={title} cards={cards} />
            ))
          : attendeeColumns.map(({ title, cards }) => (
              <MainColumn title={title} cards={cards} />
            ))}
      </Grid>
    );
  }
}
