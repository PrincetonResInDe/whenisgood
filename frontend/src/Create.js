import React from 'react';
import { Navigate } from 'react-router-dom'

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            redirect: false
        }
        this.addEvent = this.addEvent.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.setRedirect = this.setRedirect.bind(this);
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
        const request = {
          sp_name: "addEvent",
          params: [this.state.name, this.state.description, this.state.startDate, this.state.endDate, 0]
        };
        fetch("/api", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        })
        .then(data => {
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
            <div style={{padding: "10px"}}>
                <h1>Create New Event</h1>
                <form onSubmit={event => this.addEvent(event)}>
                    <p>Name:</p>
                    <p><input type="text" value={this.state.name} onChange={this.handleName}/></p>
                    <p>Description:</p>
                    <p><input type="text" value={this.state.description} onChange={this.handleDescription} /></p>
                    <p>Start Date:</p>
                    <p><input type="date" value={this.state.startDate} onChange={this.handleStartDate} /></p>
                    <p>End Date:</p>
                    <p><input type="date" value={this.state.endDate} onChange={this.handleEndDate} /></p>
                    <p><input type="submit" class="greenbutton" value="Submit" /></p>
                </form>
            </div>
        );
    }
}