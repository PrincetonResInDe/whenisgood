import React from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Grid, Typography } from "@material-ui/core";

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
              <Card.Link>
                <Link to={respond}>Respond</Link>
              </Card.Link>
              <Card.Link>
                <Link to={edit}>Edit</Link>
              </Card.Link>
              <Card.Link onClick={this.deleteEvent}>Delete</Card.Link>
              <Card.Link>
                <Link to={results}>Results</Link>
              </Card.Link>
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
        <Grid item style={{ width: "100%" }}>
          {this.props.title == "Drafts" && (
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
          )}
        </Grid>
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
      <Grid item style={{ maxWidth: "18rem", width: "100%" }}>
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

    const columns = [
      { title: "Drafts", cards: eventLinks },
      { title: "Sent", cards: [] },
      { title: "All Responses In", cards: responseLinks },
      { title: "Final Date Set", cards: [] },
    ];

    return (
      <Grid
        container
        direction="row"
        className="parent-container"
        justifyContent="space-between"
        spacing={6}
      >
        {columns.map(({ title, cards }) => (
          <MainColumn title={title} cards={cards} />
        ))}
      </Grid>
    );
  }
}
