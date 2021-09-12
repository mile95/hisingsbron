import './App.css';
import { LineChart, XAxis, YAxis, Line } from 'recharts';
import React from 'react';

const data = [
  { day: '05-01', value: "Öppen" },
  { day: '05-02', value: "Stängd" },
  { day: '05-03', value: "Öppen" },
  { day: '05-04', value: "Stängd" },
  { day: '05-05', value: "Stängd" },
  { day: '05-06', value: "Öppen" },
  { day: '05-07', value: "Öppen" },
  { day: '05-08', value: "Öppen" },
  { day: '05-09', value: "Stängd" },
];


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getStatus()
      .then(response => response.json())
      .then(data => this.setState({
        status: data.status
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
            <p> {this.state.status} </p>
          </div>
          <div className="App-graph">
          <LineChart
            width={600}
            height={300}
            data={data}
          >
            <XAxis 
              dataKey="day"
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
              dataKey="value" 
              stroke="#00ADB5"
              strokeWidth={3}
            />
          </LineChart>
          </div>
        </body>
        <footer></footer>
      </div>
    )
  }
}

export default App;