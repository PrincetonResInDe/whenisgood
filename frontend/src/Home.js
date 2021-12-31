import React from 'react';
import { Link } from "react-router-dom";

class ResponseLink extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let url = "/respond/" + this.props.event["UUID"]
        return (
            <div>
                <Link to={url}>
                    {this.props.event["name"]} - {this.props.event["description"]}
                </Link>
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
        let links = []
        this.props.events.forEach(event => {
            links.push(<ResponseLink key={event["UUID"]} event={event}/>);
        });
        return (
        <div>
            <h1>My Events</h1>
            <br />
            {links}
        </div>);
    }
}