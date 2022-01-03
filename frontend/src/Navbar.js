import React from 'react';
import { Link } from "react-router-dom";

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.loggedIn) {
            return (
                <div class="topnav">
                    <p>TigerMeet</p>
                    <div class="topnav-right">
                        <Link to={"/"}>
                            Dashboard
                        </Link>
                        <Link to="/">
                            About
                        </Link>
                        <a href="/logout">
                            Log Out
                        </a>
                    </div>
                </div>
            );
        }
        return (
            <div class="topnav">
                <p>TigerMeet</p>
                <div class="topnav-right">
                    <Link to="/">
                        About
                    </Link>
                    <a href="/login">
                        Log In
                    </a>
                </div>
            </div>
        );
    }
}