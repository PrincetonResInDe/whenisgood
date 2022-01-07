import React from 'react';
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';

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
        return (
            <div>
                <Card style={{width:'18rem', height:'12rem'}}>
                    <Card.Body>
                        <div style={{height:'8rem'}}>
                            <Card.Title>{this.props.event["name"]}</Card.Title>
                            <Card.Text>
                                {this.props.event["description"]}
                            </Card.Text>
                        </div>
                        <footer>
                            <Card.Link>
                                <Link to={respond}>Respond</Link>
                            </Card.Link>
                            <Card.Link>
                                <Link to={edit}>Edit</Link>
                            </Card.Link>
                            <Card.Link onClick={this.deleteEvent}>
                                Delete
                            </Card.Link>
                            <Card.Link>
                                <Link to={results}>Results</Link>
                            </Card.Link>
                        </footer>
                    </Card.Body>
                </Card>
            </div>
        );
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
                <Card style={{width:'18rem', height:'12rem'}}>
                    <Card.Body>
                        <div style={{height:'8rem'}}>
                            <Card.Title>{this.props.response["name"]}</Card.Title>
                            <Card.Text>
                                {this.props.response["description"]}
                            </Card.Text>
                        </div>
                        <footer>
                            <Card.Link>
                                <Link to={respond}>Edit Response</Link>
                            </Card.Link>
                        </footer>
                    </Card.Body>
                </Card>
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
            <h3>My Events</h3>
            <Link to="/create">
                <h5>
                   Create new event
                </h5>
            </Link>
            <br />
            <div style={{ display: "flex", flexWrap: "wrap" }}> 
                {eventLinks}
            </div>
            <br />
            <h3>My Responses</h3>
            <br />
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {responseLinks}
            </div>
        </div>);
    }
}