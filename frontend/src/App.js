import './App.css';
import { LineChart, XAxis, YAxis, Line } from 'recharts';
import React from 'react';


let URL = String(process.env.REACT_APP_HOST_IP_ADDRESS);

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
    this.changeIntervalState("24h");
  }
  
  getStatus() {
    return fetch(URL + "/current-status", {
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
    fetch(URL + "/history?from_date=" + fromDate + "&to_date=" + toDate, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }).then(response => response.json())
      .then(data => this.setState({
        data: data.map(convertToMilis)
      }));
  }

  changeIntervalState(newInterval) {
    this.setState({
      interval: newInterval
    })
    var currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + 1)
    var dateInHistory = new Date()

    if (this.state.interval === "24h") {
      dateInHistory.setDate(new Date().getDate())
    } else if (this.state.interval === "week") {
      dateInHistory.setDate(new Date().getDate() - 7)
    } else if (this.state.interval === "month") {
      dateInHistory.setDate(new Date().getMonth() - 1)
    }

    this.fetchDataBetweenDates(
      dateInHistory.toJSON().slice(0,10).replace(/-/g,'-'),
      currentDate.toJSON().slice(0,10).replace(/-/g,'-')
    )
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
            <p> Nuvarande status: {translateStatus(this.state.status)} </p>
          </div>
          <div className="App-graph">
          <LineChart
            width={600}
            height={300}
            data={this.state.data}
          >
            <XAxis 
              dataKey="timestamp"
              type='number'
              scale='time'
              domain = {['auto', 'auto']}
              tickFormatter={unix => formatXAxis(unix, this.state.interval) }
              padding={{ left: 40, right: 40 }}
              style={{
                fontSize: '0.8rem',
                fontFamily: "Roboto, sans-serif",
                fill: "white"
            }}
            />
            <YAxis
              type="category"
              tickFormatter={translateStatus}
              padding={{ top: 40, bottom: 40 }}
              style={{
                fontSize: '0.8rem',
                fontFamily: "Roboto, sans-serif",
                fill: "white"
            }}
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
          </div>
        </body>
        <footer></footer>
      </div>
    )
  }
}

function formatXAxis(tickItem, interval) {
  var date = new Date(tickItem)
  var formattedDate = ""
  if (interval === "24h") {
    formattedDate = date.getHours() + ':' + date.getMinutes();
  }
  else {
    formattedDate = (date.getMonth() + 1)+ '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
  }
  return String(formattedDate)
}

function translateStatus(status) {
  return String(status) === "Open" ? "Öppen" : "Stängd"
}

function convertToMilis(entry) {
  var date = new Date(entry.timestamp)
  return {
    timestamp: date.getTime(),
    status: entry.status
  }
}

export default App;