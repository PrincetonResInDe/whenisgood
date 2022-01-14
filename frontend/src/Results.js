import React from 'react';
import { useParams } from "react-router";
import ResultsChart from './ResultsChart';

class ResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
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
        let {results, loaded} = this.state;
        if(loaded) {
            return (
                <div style={{padding: "16px", width: "100%", height: "100%", margin: "auto"}}>
                    <h3>Results</h3>
                    <div>
                        {results}
                    </div>
                    <ResultsChart data={this.state.data}/>
                </div>
            );
        }
        return <div></div>
    }
}

export default function Results(props) {
    let { UUID } = useParams();
    return (
        <ResultsPage eventUUID={UUID}/>
    );
}