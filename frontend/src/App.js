import './App.css';
import { LineChart, XAxis, YAxis, Line, ResponsiveContainer, Tooltip} from 'recharts';
import React from 'react';

import '@splidejs/splide/dist/css/splide.min.css';

let URL = "https://hisingsbron.freedynamicdns.org/"

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      interval: "24h"
    };
    this.fetchDataForLastMonth();
  }

  fetchDataForLastMonth() {
    var currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + 1)
    var dateInHistory = new Date()
    dateInHistory.setMonth(new Date().getMonth() - 1)
    dateInHistory = dateInHistory.toJSON().slice(0,10).replace(/-/g,'-')
    currentDate = currentDate.toJSON().slice(0,10).replace(/-/g,'-')
    fetch(URL + "/history?from_date=" + dateInHistory + "&to_date=" + currentDate, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }).then(response => response.json())
      .then(data => 
        this.setState({allData: data.map(convertToMilis)},
        function() { this.splitData()})
      ).then(
        console.log(this.state),
      )
      .catch(error => {
        console.log("Failed to fetch data.", error)
      });
  }

  splitData() {
    var currentDate = new Date()
    var ts = new Date(currentDate.setDate(currentDate.getDate() - 1)).getTime()
    var ts_week = new Date(currentDate.setDate(currentDate.getDate() - 7)).getTime()
    this.setState({
      data: this.state.allData.filter(x => x.timestamp >= ts),
      count_day: this.state.allData.filter(x => x.timestamp >= ts && x.status === "Closed").length,
      count_week: this.state.allData.filter(x => x.timestamp >= ts_week && x.status === "Closed").length,
      count_month: this.state.allData.filter(x => x.status === "Closed").length
    })
  }

  CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${formatXAxis(label, "month")} : ${translateStatus(payload[0].value)}`}</p>
          <p className="intro">{''}</p>
        </div>
      );
    }
    return null;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Hisingsbron</h2>
        </header>
        <body className="App-body">
          <p>Brostatus senaste 24h</p>
          <div className="App-graph">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={this.state.data}>
              <XAxis 
                dataKey="timestamp"
                type='number'
                scale='time'
                domain = {['auto', 'auto']}
                tickFormatter={unix => formatXAxis(unix, "24h") }
                stroke="black"
                style={{
                  fontSize: '0.8rem',
                  fontFamily: "Roboto, sans-serif",
                  fill: "white"
              }}
              />
              <YAxis
                type="category"
                stroke="black"
                tickFormatter={translateStatus}
                padding={{ top: 20, bottom: 20 }}
                style={{
                  fontSize: '0.8rem',
                  fontFamily: "Roboto, sans-serif",
                  fill: "white"
              }}
              />
              <Tooltip content={<this.CustomTooltip />} />
              <Line 
                type="stepAfter" 
                dataKey="status" 
                stroke="#00ADB5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
          <div className="App-info-container-row">
            <div className="App-info-container">
              <div className="App-info-container-item-left">
                <p># Stängningar senaste 24h</p>
                <p> {this.state.count_day} </p>
              </div>
            </div>
            <div className="App-info-container">
              <div className="App-info-container-item-center">
                <p># Stängningar senaste veckan</p>
                <p> {this.state.count_week} </p>
              </div>
            </div>
            <div className="App-info-container">
              <div className="App-info-container-item-right">
                <p># Stängningar senaste 30 dagarna</p>
                <p> {this.state.count_month} </p>
              </div>
            </div>
          </div>
        </body>
        <footer className="App-footer">
          <p>Created by Fredrik Mile, 2021</p>
          <a href="https://github.com/mile95/hisingsbron">Source code available on Github!</a> 
        </footer>
      </div>
    )
  }
}

function formatXAxis(tickItem, interval) {
  var date = new Date(tickItem)
  var formattedDate = ""
  if (interval === "24h") {
    formattedDate = date.toISOString().slice(11,16)
  }
  else {
    formattedDate = (date.getMonth() + 1)+ '/' + date.getDate() + " " + date.toISOString().slice(11,16)
  }
  return String(formattedDate)
}

function translateStatus(status) {
  if (status === "Open") {
    return "Öppen"
  } else if (status === "Closed") {
    return "Stängd"
  }
  return "N/A"
}

function convertToMilis(entry) {
  var date = new Date(entry.timestamp)
  return {
    timestamp: date.getTime(),
    status: entry.status
  }
}

export default App;