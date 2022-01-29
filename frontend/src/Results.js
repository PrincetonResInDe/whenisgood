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
    createCustomTooltip(window, available_names, not_available_names) {
        let tooltip = '<div style="padding: 20px"><div class="center"><b style="font-size: 20px">' + window + '</b></div>';
        tooltip += '<div class="center" style="padding: 8px"><button class="tooltipbutton">Choose This Date & Time</button></div>';
        tooltip += '<table class="center" style="font-size: 16px"><th style="color: #77DD77">Available</th><th style="color: #EF6461">Not Available</th>'; //  font-weight: bold
        let i = 0;
        let j = 0;
        while (i < available_names.length && j < not_available_names.length) {
          tooltip += '<tr><td>' + available_names[i] + '</td><td>' + not_available_names[j] + '</td></tr>'
          i++;
          j++;
        }
        while (i < available_names.length) {
          tooltip += '<tr><td>' + available_names[i] + '</td><td></td></tr>';
          i++;
        }
        while (j < not_available_names.length) {
          tooltip += '<tr><td></td><td>' + not_available_names[j] + '</td></tr>';
          j++;
        }
        return tooltip + '</table></div>';
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
            this.state.data.push(["Date and Time", { role: 'tooltip', p: { "html": true } }, "Available", "Not Available"]);
            results.forEach(result => {
                const startDate = result.window_startTime.slice(4, 16)
                const startTime = result.window_startTime.slice(17, 22)
                const endTime = result.window_endTime.slice(17, 22)
                const window = startDate + '\n' + startTime + "-" + endTime
                this.state.data.push([window, this.createCustomTooltip(window, result.available_names.split(';'), result.not_available_names.split(';')), result.available_cnt, result.not_available_cnt]) // { role: 'tooltip', p: { "html": true } }
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