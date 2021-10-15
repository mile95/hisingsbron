import './App.css';
import { LineChart, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import React from 'react';

import '@splidejs/splide/dist/css/splide.min.css';

// let URL = String(process.env.REACT_APP_HOST_IP_ADDRESS);
 let URL = "http://127.0.0.1:8000"
 let ref = React.createRef()
// let URL = "http://13.51.70.56"


class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      interval: "24h"
    };
    this.getStatus()
      .then(response => response === "undefined" ? response.json() : undefined)
      .then(data => this.setState({
        status: data === "undefined" ? data.status : "N/A"
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
    .catch(error => {
      console.log("Failed to fetch data.")
    });
  }

  fetchDataBetweenDates(fromDate, toDate) {
    fetch(URL + "/history?from_date=" + fromDate + "&to_date=" + toDate, {
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
      .then(data => this.setState({
        data: data.map(convertToMilis)
      }))
      .catch(error => {
        console.log("Failed to fetch data.")
      });
  }

  changeIntervalState(newInterval) {
    this.setState({
      interval: newInterval
    })
    var currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + 1)
    var dateInHistory = new Date()

    if (newInterval === "24h") {
      dateInHistory.setDate(new Date().getDate())
    } else if (newInterval === "week") {
      dateInHistory.setDate(new Date().getDate() - 7)
    } else if (newInterval === "month") {
      dateInHistory.setMonth(new Date().getMonth() - 1)
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
          <h2>Hissingsbron</h2>
        </header>
        <body className="App-body">
          <p className="Warning-text">Den officiela brostatusen inte tillgänglig än. Använder fake data under tiden.</p>
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
          <a href="https://github.com/mile95/hissingsbron">Source code available on Github!</a> 
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