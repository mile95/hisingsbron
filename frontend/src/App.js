import './App.css';
import { LineChart, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import { Splide, SplideSlide } from '@splidejs/react-splide';
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
        function() { this.changeIntervalState("24h")})
      ).then(
        console.log(this.state),
      )
      .catch(error => {
        console.log("Failed to fetch data.", error)
      });
  }

  changeIntervalState(newInterval) {
    this.setState({
      interval: newInterval
    })
    var currentDate = new Date()
    var ts = ""
    if (newInterval === "24h") {
      ts = new Date(currentDate.setDate(currentDate.getDate() - 1)).getTime()
      this.setState({
        data: this.state.allData.filter(x => x.timestamp >= ts)
      })
    } else if (newInterval === "week") {
      ts = new Date(currentDate.setDate(currentDate.getDate() - 7)).getTime()
      this.setState({
        data: this.state.allData.filter(x => x.timestamp >= ts)
      })
    } else if (newInterval === "month") {
      this.setState({
        data: this.state.allData,
      })
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>Hisingsbron</h2>
        </header>
        <body className="App-body">
          <div className="App-graph">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={900}
              height={450}
              data={this.state.data}
            >
              <XAxis 
                dataKey="timestamp"
                type='number'
                scale='time'
                domain = {['auto', 'auto']}
                tickFormatter={unix => formatXAxis(unix, this.state.interval) }
                padding={{ left: 40, right: 40 }}
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
          </ResponsiveContainer>
          </div>
          <div className="App-slider">
          <Splide onMoved={ ( newIndex, prevIndex, destIndex ) => {
            if (prevIndex === 0) {
              this.changeIntervalState("24h")
            } else if (prevIndex === 1) {
              this.changeIntervalState("week")
            } else {
              this.changeIntervalState("month")
            }
          } }>
            <SplideSlide>
              <h4>Dygn</h4>
            </SplideSlide>
            <SplideSlide>
              <h4>Vecka</h4>
            </SplideSlide>
            <SplideSlide>
              <h4>Månad</h4>
            </SplideSlide>
          </Splide>
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
    formattedDate = date.getHours() + ':' + date.getMinutes();
  }
  else {
    formattedDate = (date.getMonth() + 1)+ '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
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