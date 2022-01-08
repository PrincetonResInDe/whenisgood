import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'
import Respond from './Respond'
import Create from './Create'
import Navbar from './Navbar';
import Edit from './Edit';
import Results from './Results';

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            responses: [],
            loaded: false
        };
        this.getResponses = this.getResponses.bind(this)
    }
    getEvents(callback) {
        const request = {
            sp_name: "getEvents",
            params: []
        }
        fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })
        .then(response => response.json())
        .then(events => {
            const newEvents = [];
            events.forEach(event => {
                newEvents.push(event);
            });
            this.setState({events: newEvents, loaded: true});
            if (callback) {
                callback();
            }
        });
    }
    getResponses(callback) {
        const request = {
            sp_name: "getResponses",
            params: []
        }
        fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }).then(response => response.json())
        .then(responses => {
            const newResponses = []
            responses.forEach(response => {
                newResponses.push(response);
            });
            this.setState({responses: newResponses});
            this.getEvents(callback);
        });
    }
    componentDidMount() {
        this.getResponses();
    }
    render() {
        let {events, responses, loaded} = this.state;
        if (loaded) {
            return (
                <div>
                    <Navbar loggedIn={true}/>
                    <Routes>
                        <Route path='/' element={<Home events={events} responses={responses} refresh={this.getResponses}/>}></Route>
                        <Route path='/respond/:UUID' element={<Respond refresh={this.getResponses}/>}></Route>
                        <Route path='/create' element={<Create refresh={this.getResponses}/>}></Route>
                        <Route path='/edit/:UUID' element={<Edit events={events} refresh={this.getResponses}/>}></Route>
                        <Route path='/results/:UUID' element={<Results/>}></Route>
                    </Routes> 
                </div>
              );
        }
        return <div></div>
    }
}