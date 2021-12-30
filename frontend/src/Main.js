import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home'
import Respond from './Respond'

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            loaded: false
        };
    }
    componentDidMount() {
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
            events.forEach(event => {
                this.state.events.push(event);
            });
            this.setState({loaded: true});
        });
    }
    render() {
        let {events, loaded} = this.state;
        if (loaded) {
            return (
                <div>
                    <Routes>
                        <Route path='/' element={<Home events={events}/>}></Route>
                        <Route path='/respond/:UUID' element={<Respond events={events}/>}></Route>
                    </Routes> 
                </div>
              );
        }
        return <div></div>
    }
}