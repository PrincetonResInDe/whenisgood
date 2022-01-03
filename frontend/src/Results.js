import React from 'react';
import { useParams } from "react-router";

class ResultsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            loaded: false
        }
    }
    getAllAvailabilities() {
        const request = {
            sp_name: "getAllAvailabilities",
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
            results.forEach(result => {
                this.state.results.push(<p>{result.name}: {result.startTime} - {result.endTime}</p>);
            })
            this.setState({loaded: true});
        });
    }
    componentDidMount() {
        this.getAllAvailabilities();
    }
    render() {
        let {results, loaded} = this.state;
        if(loaded) {
            return (
                <div style={{padding: "16px"}}>
                    <h2>Results</h2>
                    <div>
                        {results}
                    </div>
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