import React from 'react';
import { Link } from "react-router-dom";

class ResponseLink extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let url = "/respond/" + this.props.UUID
        return (
            <div>
                <Link to={url}>
                    {this.props.name}
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
            links.push(<ResponseLink key={event["UUID"]} UUID={event["UUID"]} name={event["name"]}/>);
        });
        return <div>{links}</div>
    }
}