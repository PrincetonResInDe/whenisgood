
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

let mygoogle = null;

function redraw() {
      // Create the data table.
      const data = new mygoogle.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
      data.addRows([
          ['Mushrooms', 3],
          ['Onions', 1],
          ['Olives', 1],
          ['Zucchini', 1],
          ['Pepperoni', 2]
      ]);

      // Set chart options
      var options = {'title':'How Much Pizza I Ate Last Night',
                    'width': window.innerWidth,
                    'height': window.innerHeight};

      // Instantiate and draw our chart, passing in some options.
      /*const newChart = new google.visualization.PieChart(document.getElementById('pizzaChart'));
      console.log("drawing");
      newChart.draw(data, options);*/
      const newChart = new mygoogle.visualization.PieChart(document.getElementById('pizzaChart'));
      console.log("drawing");
      newChart.draw(data, options);

      //setChart(newChart);
}

function PizzaChart ({google, width, height}) {
  const [chart, setChart] = useState(null);
  mygoogle = google;
  useEffect(() => {
    if (google && !chart) {
        // Create the data table.
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows([
            ['Mushrooms', 3],
            ['Onions', 1],
            ['Olives', 1],
            ['Zucchini', 1],
            ['Pepperoni', 2]
        ]);

        // Set chart options
        var options = {'title':'How Much Pizza I Ate Last Night',
                      'width': width,
                      'height': height};

        // Instantiate and draw our chart, passing in some options.
        /*const newChart = new google.visualization.PieChart(document.getElementById('pizzaChart'));
        console.log("drawing");
        newChart.draw(data, options);*/
        const newChart = new google.visualization.PieChart(document.getElementById('pizzaChart'));
        console.log("drawing");
        newChart.draw(data, options);

        setChart(newChart);
        window.addEventListener('resize', redraw);
    }
  }, [google, chart]);

  return (
    <>
      {!google && <Spinner />}
      <button onClick={redraw}>Redraw</button>
      <div id="pizzaChart" className={!google ? 'd-none' : ''} style={{width: "100%", height: "100%", margin: "auto"}}/>
    </>
  )
}

export default PizzaChart;

/*
import React from "react";
import { Chart } from "react-google-charts";

const options = {
  isStacked: true,
  chartArea: { "width": "75%", "height": "75%" }, // percentage of chart div
  vAxis: { format: '0', minorGridlines:{count:0}},
  colors: ["#77DD77", "#EF6461"],
  focusTarget: 'category',
  tooltip: { isHtml: true },
}

export default function ResultsChart(props) {
  console.log("chart height: " + props.height);
  return (
    <Chart
      chartType="ColumnChart"
      width={props.width}
      height={props.height}
      data={props.data}
      options={options}
    />
  );
}
*/