import React from 'react';
import { useParams } from "react-router";
import { Navigate } from 'react-router-dom'
import moment from 'moment-timezone';

class EditPrefilled extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.event["name"],
            description: this.props.event["description"],
            group: this.props.event["group"],
            location: this.props.event["location"],
            eventType: this.props.event["eventType"],
            length: this.props.event["length"],
            isRecurring: this.props.event["isRecurring"],
            startDate: moment(this.props.event["startDate"]).add(1, 'days').format("YYYY-MM-DD"),
            endDate: moment(this.props.event["endDate"]).add(1, 'days').format("YYYY-MM-DD"),
            dueDate: moment(this.props.event["dueDate"]).add(1, 'days').format("YYYY-MM-DD"),
            redirect: false
        }
        this.editEvent = this.editEvent.bind(this);
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
    setRedirect() {
        this.setState({redirect: true});
    }
    editEvent(event) {
        event.preventDefault()
        // do this required check properly
        if(this.state.name == "" || this.state.startDate == "" || this.state.endDate == "") {
            return;
        }
        const request = {
          sp_name: "editEvent",
          params: [this.state.name, this.state.description, this.state.group, this.state.location, 
            this.state.eventType, this.state.length, this.state.isRecurring, this.state.startDate, 
            this.state.endDate, this.state.dueDate, this.props.event.UUID]
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
        this.setState({startDate: event.target.value});
    }
    
    handleEndDate(event) {
        this.setState({endDate: event.target.value});
    }

    handleDueDate(event) {
        this.setState({dueDate: event.target.value});
    }

    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to='/'/>;
        }
        return (
            <div style={{padding: "16px"}}>
                <h3>Edit Event</h3>
                <form onSubmit={event => this.editEvent(event)}>
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
                    <p><input type="checkbox" checked={this.state.isRecurring} onChange={this.handleIsRecurring} /></p>
                    <p>Start Date:</p>
                    <p><input type="date" value={this.state.startDate} onChange={this.handleStartDate} /></p>
                    <p>End Date:</p>
                    <p><input type="date" value={this.state.endDate} onChange={this.handleEndDate} /></p>
                    <p>Due Date:</p>
                    <p><input type="date" value={this.state.dueDate} onChange={this.handleDueDate} /></p>
                    <p><input type="submit" class="greenbutton" value="Save" /></p>
                </form>
            </div>
        );
    }
}

export default function Edit(props) {
    let { UUID } = useParams();
    let event = props.events.find(event => {
      return event.UUID === UUID;
    });
    return (
        <EditPrefilled event={event} refresh={props.refresh}/>
    )
}