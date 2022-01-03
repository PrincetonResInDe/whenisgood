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
            startDate: moment(this.props.event["startDate"]).add(1, 'days').format("YYYY-MM-DD"),
            endDate: moment(this.props.event["endDate"]).add(1, 'days').format("YYYY-MM-DD"),
            redirect: false
        }
        this.editEvent = this.editEvent.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
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
          params: [this.props.event.UUID, this.state.name, this.state.description, this.state.startDate, this.state.endDate, 0]
        };
        fetch("/api", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        })
        .then(data => {
                // redirect on success, need error popup with toastr.js or something
                this.props.refresh(this.setRedirect);
            }
        );
    }

    handleName(event) {
        this.setState({name: event.target.value});
    }

    handleDescription(event) {
        this.setState({description: event.target.value});
    }

    handleStartDate(event) {
        this.setState({startDate: event.target.value});
    }
    
    handleEndDate(event) {
        this.setState({endDate: event.target.value});
    }

    render() {
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to='/'/>;
        }
        return (
            <div style={{padding: "16px"}}>
                <h2>Edit Event</h2>
                <form onSubmit={event => this.editEvent(event)}>
                    <p>Name:</p>
                    <p><input type="text" value={this.state.name} onChange={this.handleName}/></p>
                    <p>Description:</p>
                    <p><input type="text" value={this.state.description} onChange={this.handleDescription} /></p>
                    <p>Start Date:</p>
                    <p><input type="date" value={this.state.startDate} onChange={this.handleStartDate} /></p>
                    <p>End Date:</p>
                    <p><input type="date" value={this.state.endDate} onChange={this.handleEndDate} /></p>
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