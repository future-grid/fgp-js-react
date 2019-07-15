import React, { Component } from 'react';
import './ResultTable.css';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { NavLink} from 'react-router-dom' ;
import Moment from 'react-moment';
// import axios from "axios";

export class ResultTable extends Component {
  constructor(props){
    super(props);
    this.state = {

    };  
    // console.log(this.props)
    this.buildData = this.buildData.bind(this);
    this.buildColumns = this.buildColumns.bind(this);
  }

  buildData(data){
    data.forEach(element => {
      // element["Cell"] = "hello world"
    });
    return data;
  }

  buildColumns(data){
    // console.log(data)
    if(this.props.ignoreBuildCols){

    }else{
      data.forEach(element => {
        if(element["fgpRedirect"]){
          element["Cell"] = row => (
            <NavLink to={element.fgpRedirect + row.value}>
               {row.value}
            </NavLink>
          )
        }else if(element["fgpMutate"]){
          if(element.fgpMutate === "date"){
            element["Cell"] = row => (
              <Moment date={row.value} format={"lll"}>
  
              </Moment>
            )
          }
        }
      });  
    }
    
    return data;
  }
  
  
  render() {
    return (
      <div className="ResultTable">
        <span className="ResultTable-title">{this.props.title}</span>
        <ReactTable 
            showPagination={this.props.showPagination}
            showPageSizeOptions={this.props.showPageSizeOptions}
            showPageJump={this.props.showPageJump}
            filterable={this.props.filterable}
            data={this.buildData(this.props.data)}
            columns={this.buildColumns(this.props.columns)}
            minRows={this.props.defaultRowSize}
            pageSizeOptions={this.props.defaultRowSizeArray}
            // getTdProps={(state, rowInfo, column, instance) => {
            //   return{
            //     onClick: e => 
            //       // console.log("cell\n", "\nstate", state, "rowinfo\n", rowInfo,"\ncolumn", column,"\ninstance", instance,"\ne", e)
            //       console.log(rowInfo, column)
                  
            //   }
            // }}
        />
      </div>
  )}
}

export default ResultTable
