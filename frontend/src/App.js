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


function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Hissingsbron
        </h1>
      </header>
      <body className="App-body">
        <div>
          <p> Stängd </p>
        </div>
        <div className="App-graph">
        <LineChart
          width={800}
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
  );
}

export default App;