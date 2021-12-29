import React from 'react';
import { Link } from "react-router-dom";

export default class Home extends React.Component {
    render() {
        return (
            <Link to="/respond">
                <button variant="outlined">
                    Respond to event
                </button>
            </Link>
        );
    }
}