import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'
import Respond from './Respond'
import Create from './Create'

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            loaded: false
        };
        this.getEvents = this.getEvents.bind(this)
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
            this.setState({events: []});
            events.forEach(event => {
                this.state.events.push(event);
            });
            this.setState({loaded: true});
            callback();
        });
    }
    componentDidMount() {
        this.getEvents(function() {});
    }
    render() {
        let {events, loaded} = this.state;
        if (loaded) {
            return (
                <div>
                    <Routes>
                        <Route path='/' element={<Home events={events}/>}></Route>
                        <Route path='/respond/:UUID' element={<Respond events={events}/>}></Route>
                        <Route path='/create' element={<Create refresh={this.getEvents}/>}></Route>
                    </Routes> 
                </div>
              );
        }
        return <div></div>
    }
}