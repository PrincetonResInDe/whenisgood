import React from "react";
import { Navigate } from "react-router-dom";
import { Col, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Grid } from "@material-ui/core";

export default class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      description: null,
      group: "default",
      location: null,
      eventType: "default",
      length: null,
      isRecurring: 0,
      startDate: null,
      endDate: null,
      dueDate: null,
      redirect: false,
    };
    this.addEvent = this.addEvent.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleGroup = this.handleGroup.bind(this);
    this.handleLocation = this.handleLocation.bind(this);
    this.handleEventType = this.handleEventType.bind(this);
    this.handleLength = this.handleLength.bind(this);
    this.handleIsRecurring = this.handleIsRecurring.bind(this);
    this.handleStartDate = this.handleStartDate.bind(this);
    this.handleEndDate = this.handleEndDate.bind(this);
    this.handleDueDate = this.handleDueDate.bind(this);
    this.setRedirect = this.setRedirect.bind(this);
  }
  handleName(event) {
    this.setState({ name: event.target.value });
  }

  handleDescription(event) {
    this.setState({ description: event.target.value });
  }

  handleGroup(event) {
    this.setState({ group: event.target.value });
  }

  handleLocation(event) {
    this.setState({ location: event.target.value });
  }

  handleEventType(event) {
    this.setState({ eventType: event.target.value });
  }

  handleLength(event) {
    this.setState({ length: event.target.value });
  }

  handleIsRecurring(event) {
    if (this.state.isRecurring === 0) {
      this.setState({ isRecurring: 1 });
    } else {
      this.setState({ isRecurring: 0 });
    }
  }

  handleStartDate(event) {
    this.setState({
      startDate: event.target.value,
      dueDate: event.target.value,
    });
  }

  handleEndDate(event) {
    this.setState({ endDate: event.target.value });
  }

  handleDueDate(event) {
    this.setState({ dueDate: event.target.value });
  }

  setRedirect() {
    this.setState({ redirect: true });
  }
  addEvent(event) {
    event.preventDefault();
    // do this required check properly
    if (
      this.state.name === "" ||
      this.state.startDate === "" ||
      this.state.endDate === ""
    ) {
      return;
    }
    /*
                        name: null,
                description: null,
                group: null,
                location: null,
                eventType: null,
                length: null,
                isRecurring: 0,
                startDate: null,
                endDate: null,
                dueDate: null,
            */
    const request = {
      sp_name: "addEvent",
      params: [
        this.state.name,
        this.state.description,
        this.state.group,
        this.state.location,
        this.state.eventType,
        this.state.length,
        this.state.isRecurring,
        this.state.startDate,
        this.state.endDate,
        this.state.dueDate,
      ],
    };
    fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }).then((data) => {
      this.props.refresh();
      this.setRedirect();
    });
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Navigate to="/" />;
    }
    const lengths = [15, 30, 45, 60, 75, 90, 120, 270];
    return (
      <Grid
        container
        spacing={3}
        direction="row"
        style={{ padding: "30px 15%" }}
      >
        <Grid item xs={12} style={{ padding: "15px 10%" }}>
          <Form onSubmit={(event) => this.addEvent(event)}>
            <h3>Create New Event</h3>
            <FormGroup row>
              <Label for="name" sm={2}>
                Event Name:
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  id="name"
                  value={this.state.name}
                  onChange={this.handleName}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="description" sm={2}>
                Description:
              </Label>
              <Col sm={10}>
                <Input
                  type="textarea"
                  id="description"
                  value={this.state.description}
                  onChange={this.handleDescription}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="location" sm={2}>
                Location:
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  id="location"
                  value={this.state.location}
                  onChange={this.handleLocation}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="length" sm={2}>
                Length:
              </Label>
              <Col sm={10}>
                <Input
                  type="select"
                  id="length"
                  min={15}
                  value={this.state.length}
                  onChange={this.handleLength}
                >
                  {lengths.map((length) => (
                    <option>{length}</option>
                  ))}
                </Input>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="startDate" sm={2}>
                Start Date:
              </Label>
              <Col sm={10}>
                <Input
                  type="date"
                  id="startDate"
                  value={this.state.startDate}
                  onChange={this.handleStartDate}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="endDate" sm={2}>
                End Date:
              </Label>
              <Col sm={10}>
                <Input
                  type="date"
                  id="endDate"
                  value={this.state.endDate}
                  onChange={this.handleEndDate}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="isRecurring" sm={2}>
                Recurring:
              </Label>
              <Col sm={{ size: 10 }}>
                <Input
                  type="checkbox"
                  id="isRecurring"
                  onChange={this.handleIsRecurring}
                />
              </Col>
            </FormGroup>
            <Button color="primary">Submit</Button>
          </Form>
        </Grid>
        <Grid item xs={12}>
          <div
            style={{
              minHeight: "50vh",
              width: "100%",
              border: "1px solid black",
            }}
          ></div>
        </Grid>
      </Grid>
    );
  }

  /*
      netID varchar(8) 
  name varchar(128) 
  description varchar(512) 
  group varchar(64) 
  location varchar(128) 
  eventType varchar(32) 
  length smallint(6) 
  isRecurring tinyint(4) 
  startDate date 
  endDate date 
  dueDate date 
  timeCreated timestamp 
  UUID varchar(36)
  
                  
  <form onSubmit={event => this.addEvent(event)}>
      <p>Name:</p>
      <p><input type="text" value={this.state.name} onChange={this.handleName}/></p>
      <p>Description:</p>
      <p><input type="text" value={this.state.description} onChange={this.handleDescription} /></p>
      <p>Group:</p>
      <p><input type="text" value={this.state.group} onChange={this.handleGroup} /></p>
      <p>Location:</p>
      <p><input type="text" value={this.state.location} onChange={this.handleLocation} /></p>
      <p>Event Type:</p>
      <p><input type="text" value={this.state.eventType} onChange={this.handleEventType} /></p>
      <p>Length:</p>
      <p><input type="number" min={15} value={this.state.length} onChange={this.handleLength} /></p>
      <p>Recurring:</p>
      <p><input type="checkbox" onChange={this.handleIsRecurring} /></p>
      <p>Start Date:</p>
      <p><input type="date" value={this.state.startDate} onChange={this.handleStartDate} /></p>
      <p>End Date:</p>
      <p><input type="date" value={this.state.endDate} onChange={this.handleEndDate} /></p>
      <p>Due Date:</p>
      <p><input type="date" value={this.state.dueDate} onChange={this.handleDueDate} /></p>
      <p><input type="submit" class="greenbutton" value="Create" /></p>
                  </form>
  
      */
}
