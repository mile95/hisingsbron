import './App.css';
import { LineChart, XAxis, YAxis, Line } from 'recharts';
import React from 'react';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: "24h"
    };
    this.getStatus()
      .then(response => response.json())
      .then(data => this.setState({
        status: data.status
      }));
    this.fetchDataBetweenDates('2021-09-11', '2021-09-13')
      .then(response => response.json())
      .then(data => this.setState({
        data: data
      }));
  }
  
  getStatus() {
    return fetch("http://localhost:8000/current-status", {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    })
  }

  fetchDataBetweenDates(fromDate, toDate) {
    return fetch("http://localhost:8000/history?from_date=" + fromDate + "&to_date=" + toDate, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }) 
  }

  changeIntervalState(newInterval) {
    this.setState({
      interval: newInterval
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>
            Hissingsbron
          </h1>
        </header>
        <body className="App-body">
          <div>
            <p> Nuvarande status: {this.state.status} </p>
          </div>
          <div className="App-graph">
          <LineChart
            width={600}
            height={300}
            data={this.state.data}
          >
            <XAxis 
              dataKey="timestamp"
              tick={{stroke: '#EEEEEE', fontSize: 15, strokeWidth: 0.5}}
              padding={{ left: 40, right: 40 }}
              axisLine={{ stroke: '#EAF0F4' }}
            />
            <YAxis
              type="category"
              padding={{ top: 40, bottom: 40 }}
              tick={{stroke: '#EEEEEE', fontSize: 15, strokeWidth: 0.5}}
              axisLine={{ stroke: '#EAF0F4' }}
            />
            <Line 
              type="stepAfter" 
              dataKey="status" 
              stroke="#00ADB5"
              strokeWidth={3}
            />
          </LineChart>
          </div>
          <div className="App-buttons">
            <button className={this.state.interval === "24h" ? "App-button-selected" : "App-button" } onClick={() => this.changeIntervalState("24h")}> 24h </button>
            <button className={this.state.interval === "week" ? "App-button-selected" : "App-button" } onClick={() => this.changeIntervalState("week")}> Vecka </button>
            <button className={this.state.interval === "month" ? "App-button-selected" : "App-button" } onClick={() => this.changeIntervalState("month")}> Månad </button>
            <button className={this.state.interval === "custom" ? "App-button-selected" : "App-button" } onClick={() => this.changeIntervalState("custom")}> Custom </button>
          </div>
        </body>
        <footer></footer>
      </div>
    )
  }
}

export default App;