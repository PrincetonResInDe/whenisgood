import React from 'react';
import { useParams } from "react-router";
import ResultsChart from './ResultsChart';

class ResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false
        }
        this.createCustomTooltip = this.createCustomTooltip.bind(this);
    }
    createCustomTooltip(names) {
        let tooltip = '<ol>';
        names.split(';').forEach(name => {
          tooltip += '<li>' + name + '</li>';
        });
        return tooltip + '</ol>';
    }
    getResults() {
        const request = {
            sp_name: "getResults_Collapsed",
            params: [this.props.eventUUID]
        }
        fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })
        .then(response => response.json())
        .then(results => {
            this.state.data.push(["Date and Time", "Available", { role: 'tooltip', p: { "html": true } }, "Not Available", { role: 'tooltip', p: { "html": true } }]);
            results.forEach(result => {
                const startDate = result.window_startTime.slice(4, 16)
                const startTime = result.window_startTime.slice(17, 22)
                const endTime = result.window_endTime.slice(17, 22)
                const window = startDate + '\n' + startTime + '-' + endTime
                this.state.data.push([window, result.available_cnt, this.createCustomTooltip(result.available_names), result.not_available_cnt, this.createCustomTooltip(result.not_available_names)])
            });
            this.setState({loaded: true});
        });
    }
    componentDidMount() {
        this.getResults();
    }
    render() {
        let {data, loaded} = this.state;
        let event = this.props.event;
        if(loaded) {
            return (
                <div style={{padding: "16px", margin: "auto"}}>
                    <h3 style={{textAlign: "center"}}>Results of {event.name}</h3>
                    <div style={{width: "50%", margin: "auto"}}>
                        <br />
                        <b>Description:</b> {event.description}
                        <br />
                        <br />
                        <b>Length:</b> {event.length} minutes
                        <br />
                        <br />
                        <b>Location:</b> {event.location}
                        <br />
                    </div>
                    <div style={{margin: "auto", width: "80%"}}>
                        <ResultsChart data={data}/>
                    </div>
                </div>
            );
        }
        return <div></div>
    }
}

export default function Results(props) {
    let { UUID } = useParams();
    let event = props.events.find(event => {
        return event.UUID === UUID;
    });
    return (
        <ResultsPage eventUUID={UUID} event={event}/>
    );
}