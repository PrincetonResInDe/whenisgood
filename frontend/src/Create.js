import React from 'react';
import { Navigate } from 'react-router-dom'
import { Row, Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

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
            redirect: false
        }
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
        this.setState({name: event.target.value});
    }

    handleDescription(event) {
        this.setState({description: event.target.value});
    }

    handleGroup(event) {
        this.setState({group: event.target.value});
    }

    handleLocation(event) {
        this.setState({location: event.target.value});
    }

    handleEventType(event) {
        this.setState({eventType: event.target.value});
    }

    handleLength(event) {
        this.setState({length: event.target.value});
    }

    handleIsRecurring(event) {
        if (this.state.isRecurring == 0) {
            this.setState({isRecurring: 1});
        }
        else {
            this.setState({isRecurring: 0});
        }
    }

    handleStartDate(event) {
        this.setState({startDate: event.target.value, 
                    dueDate: event.target.value});
    }
    
    handleEndDate(event) {
        this.setState({endDate: event.target.value});
    }

    handleDueDate(event) {
        this.setState({dueDate: event.target.value});
    }

    setRedirect() {
        this.setState({redirect: true});
    }
    addEvent(event) {
        event.preventDefault()
        // do this required check properly
        if(this.state.name == "" || this.state.startDate == "" || this.state.endDate == "") {
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
          params: [this.state.name, this.state.description, this.state.group, this.state.location, 
            this.state.eventType, this.state.length, this.state.isRecurring, this.state.startDate, 
            this.state.endDate, this.state.dueDate]
        };
        fetch("/api", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        })
        .then(data => {
                this.props.refresh();
                this.setRedirect();
            }
        );
    }

    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to='/'/>;
        }
        return (
            <div style={{padding: "16px"}}>
                <Row>
                    <Col>
                        <Form onSubmit={event => this.addEvent(event)}>
                            <h3>Create New Event</h3>
                                <FormGroup>
                                    <Label for="name">Name:</Label>
                                    <Input type="text" id="name" value={this.state.name} onChange={this.handleName} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="description">Description:</Label>
                                    <Input type="text" id="description" value={this.state.description} onChange={this.handleDescription} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="location">Location:</Label>
                                    <Input type="text" id="location" value={this.state.location} onChange={this.handleLocation} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="length">Length:</Label>
                                    <Input type="number" id="length" min={15} value={this.state.length} onChange={this.handleLength} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="startDate">Start Date:</Label>
                                    <Input type="date" id="startDate" value={this.state.startDate} onChange={this.handleStartDate} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="endDate">End Date:</Label>
                                    <Input type="date" id="endDate" value={this.state.endDate} onChange={this.handleEndDate} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="isRecurring">Recurring:</Label>
                                    <Input type="checkbox" id="isRecurring" onChange={this.handleIsRecurring} />
                                </FormGroup>
                            <Button color="primary">Submit</Button>
                        </Form>
                    </Col>
                    <Col></Col>
                </Row>
            </div>
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