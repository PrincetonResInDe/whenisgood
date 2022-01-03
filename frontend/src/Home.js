import React from 'react';
import { Link } from "react-router-dom";

class ResponseLink extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let url = "/respond/" + this.props.event["UUID"]
        let edit = "/edit/" + this.props.event["UUID"]
        return (
            <div>
                <Link to={url}>{this.props.event["name"]}</Link> - <Link to={edit}>Edit</Link>
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
        <div style={{padding: "16px"}}>
            <h2>My Dashboard</h2>
            <Link to="/create">
                <h3>
                   Create new event
                </h3>
            </Link>
            <br />
            {links}
        </div>);
    }
}