import React from 'react';
import { Link } from "react-router-dom";

class EventLink extends React.Component {
    constructor(props) {
        super(props);
        this.deleteEvent = this.deleteEvent.bind(this);
    }
    deleteEvent() {
        const request = {
            sp_name: "deleteEvent",
            params: [this.props.event.UUID]
        }
        fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }).then(data => {
            this.props.refresh();
        });
    }
    render() {
        let respond = "/respond/" + this.props.event["UUID"]
        let edit = "/edit/" + this.props.event["UUID"]
        let results = "/results/" + this.props.event["UUID"]
        let del = "/delete/" + this.props.event["UUID"]
        return (
            <div>
                {this.props.event["name"]} - <Link to={respond}>Respond</Link> - <Link to={edit}>Edit</Link> - <a href="#" onClick={this.deleteEvent}>Delete</a> - <Link to={results}>Results</Link>
                <br />
                <br />
            </div>
        )
    }
}

class ResponseLink extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let respond = "/respond/" + this.props.response["UUID"]
        return (
            <div>
                {this.props.response["name"]} - <Link to={respond}>Edit Response</Link>
                <br />
                <br />
            </div>
        )
    }
}

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let eventLinks = []
        let responseLinks = []
        this.props.events.forEach(event => {
            eventLinks.push(<EventLink key={event["UUID"]} event={event} refresh={this.props.refresh}/>);
        });
        this.props.responses.forEach(response => {
            responseLinks.push(<ResponseLink key={'r' + response["UUID"]} response={response}/>);
        })
        return (
        <div style={{padding: "16px"}}>
            <h2>My Events</h2>
            <Link to="/create">
                <h3>
                   Create new event
                </h3>
            </Link>
            <br />
            {eventLinks}
            <br />
            <h2>My Responses</h2>
            <br />
            {responseLinks}
        </div>);
    }
}