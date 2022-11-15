import React from 'react';
import { Link } from "react-router-dom";

export default class Navbar extends React.Component {
    render() {
        if(this.props.loggedIn) {
            return (
                <div class="topnav">
                    <h2 style={{pointerEvents: "none"}}>TigerMeet</h2>
                    <div class="topnav-right">
                        <Link to={"/"}>
                            <h2>Dashboard</h2>
                        </Link>
                        <Link to="/">
                            <h2>About</h2>
                        </Link>
                        <a href="/logout">
                            <h2>Log Out</h2>
                        </a>
                    </div>
                </div>
            );
        }
        return (
            <div class="topnav">
                <h2>TigerMeet</h2>
                <div class="topnav-right">
                    <Link to="/">
                        <h2>About</h2>
                    </Link>
                    <a href="/login">
                        <h2>Log In</h2>
                    </a>
                </div>
            </div>
        );
    }
}