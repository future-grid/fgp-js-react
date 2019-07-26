import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default class BarGraph extends Component {
  render() {
    return (
      <BarChart
        width={1000}
        height={600}
        data={this.props.data}
        margin={{
          top: 5, right: 30, left: 40, bottom: 150,
        }}
      >
        {/* <CartesianGrid vertical={false} strokeDashArray="3 3" /> */}
        <XAxis tick={{fontSize: 15}} dataKey="modelId" angle={-90} textAnchor="end" interval={0}/>
        <YAxis tick={{fontSize: 15}} unit="$"/>
        <Tooltip 
            labelStyle={{ color: "green", fontSize:20 }}
            itemStyle={{ color: "green" , fontSize:20 }}
        />
        <Legend verticalAlign="top" wrapperStyle={{fontSize: 15}}/>
        <Bar dataKey="hwCharge" fill="#8884d8" />
        {/* <Bar dataKey="totalAssets" fill="#8884d8" /> */}
      </BarChart>
    );
  }
}
