import React from "react";
import { Chart } from "react-google-charts";

const options = {
  isStacked: true,   
  chartArea: { "width": "75%", "height": "95%" }, // percentage of chart div
  hAxis: { format: '0', minorGridlines:{count:0}},
  colors: ["#77DD77", "#EF6461"],
  focusTarget: 'category',
  tooltip: { isHtml: true }
}

export default function ResultsChart(props) {
  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height={props.data.length*100}
      data={props.data}
      options={options}
    />
  );
}