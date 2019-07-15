import React, { Component } from 'react';
import './Graph.css';
import { ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend} from 'recharts';

const data = [
  {
    time: 'Aug 18', hwCharge: 523000, userCount: 8300
  },
  {
    time: 'Sept 18', hwCharge: 536000, userCount: 8543
  },
  {
    time: 'Oct 18', hwCharge: 531000, userCount: 8432
  },
  {
    time: 'Nov 18', hwCharge: 538000, userCount: 8579
  },
  {
    time: 'Dec 18', hwCharge: 551000, userCount: 8678
  },
  {
    time: 'Jan 19', hwCharge: 560000, userCount: 8780
  },
  {
    time: 'Feb 19', hwCharge: 561000, userCount: 8850
  },
  {
    time: 'Mar 19', hwCharge: 582000, userCount: 9225
  },
  {
    time: 'Apr 19', hwCharge: 581000, userCount: 9320
  }
];

// const CustomTooltip = ({ active, payload, label }) => {
//     if (active) {
//       return (
//         <div className="custom-tooltip">
//           <p className="label">{`${label}`}</p>
//           <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
//           <p className="label">{`${payload[1].name} : ${payload[1].value}`}</p>
//         </div>
//       );
//     }

//   return null;
// };
export default class BarLineGraph extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <ComposedChart
        
        width={this.props.width}
        height={this.props.height}
        data={data}
        margin={{
            top: 5, right: 30, left: 40, bottom: 150,
        }}
      >
        {/* <CartesianGrid stroke="#f5f5f5" /> */}
        <XAxis dataKey="time" tick={{fontSize: 15}} angle={0} textAnchor="end" interval={0}/>
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{fontSize: 15}} 
            type="number" domain={['auto', 'auto']} unit="$"/>
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{fontSize: 15}} 
            type="number" domain={['auto', 'auto']}/>
        <Tooltip 
            labelStyle={{ fontSize:20 }}
            itemStyle={{ fontSize:20 }}
        />
        {/* <Tooltip labelStyle={{ fontSize:20 }} content={<CustomTooltip />} /> */}
        <Legend verticalAlign="top" wrapperStyle={{fontSize: 15}}/>
        <Bar yAxisId="left" dataKey="hwCharge" barSize={20} fill="#8884d8" />
        <Line yAxisId="right" type="monotone" dataKey="userCount" stroke="#82ca9d" />
        {/* <Scatter dataKey="cnt" fill="red" /> */}
      </ComposedChart>
    );
  }
}
