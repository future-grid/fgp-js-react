import React, { Component } from 'react';
import './MultiTableFilterSearch.css';
import axios from "axios";
import ResultTable from '../Search/resulttable/ResultTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FilterSearchRow } from './FilterSearchRow/FilterSearchRow';
import moment from 'moment';

export class MultiTableFilterSearch extends Component {
  constructor(props){
    super(props);
    this.state = {
      hasLoaded : false,
      data : [],
      fromDate: this.props.fromDate ? this.props.fromDate :  moment().subtract(7, 'd').startOf('day').valueOf(),
      toDate: this.props.toDate ? this.props.toDate : moment().startOf('day').valueOf(),
      currentTable : this.props.searchingTables[0].isTs === true ? 
        `${this.props.searchingTables[0].deviceType}/${this.props.searchingTables[0].tableName}` :
        `${this.props.searchingTables[0].deviceType}/${this.props.searchingTables[0].tableName}|nts`,
      currentColumns: this.props.searchingTables[0].columnsToShow,
      hasMadeSearch : false,
      errorInSearch : false
    };
    console.log(this.props)
    this.makeSearch = this.makeSearch.bind(this);
  }

  componentDidMount(){
    this.makeSearch();
  }

  makeSearch(isFirstTime) {
    console.log(
      "Search is being made with the following params:\n from date => ", this.state.fromDate,
      "\nto date => ",this.state.toDate,
      "\nstate => ", this.state.currentTable
    );
    // checking if it is a time series model, at this stage selected table is already a combination
    // of the device type and the current table in the format <deviceType>/<tableName> 
    let selectedEvent = this.state.currentTable;
    let isTs = selectedEvent.split("|").length > 1 ;
    let deviceNames;

    if(isTs){
      selectedEvent = selectedEvent.split("|")[0]
    }
    

    if(this.props.isChildEvents === true){
      //do the child thing
    }else{
      deviceNames = [this.props.deviceName]
    }

    //making the search call
    axios.post(
      `${this.props.baseApiUrl}${selectedEvent}`,
      {
        start: this.state.fromDate,
        end: this.state.toDate,
        devices : deviceNames
      }
    ).then(resp => {
      // child things are hard so ill do them later
      if(this.props.isChildEvents === true){

      }else{
        console.log("resp is here => ", resp)
        this.setState({
          hasMadeSearch : true,
          hasLoaded : true,
          errorInSearch: false,
          data:resp.data[`${this.props.deviceName}`].data
        })
      }
    }).catch(err => {
      this.setState({
        errorInSearch: true,
        hasMadeSearch : false,
        hasLoaded : false
      })
      console.error("error is here => ", err)
    })
  }

  updateSearchingTable(event) {
    let index = event.target.value
    this.setState({
      currentTable : `${this.props.searchingTables[index].deviceType}/${this.props.searchingTables[index].tableName}`,
      currentColumns : this.props.searchingTables[index].columnsToShow

    },this.makeSearch);
  }

  updateFromDate(date) {
    this.setState({
      fromDate : moment(date).startOf('day').valueOf()
    },this.makeSearch);
  }

  updateToDate(date) {
    this.setState({
      toDate : moment(date).startOf('day').valueOf()
    }, this.makeSearch);
  }
  


  render() {
    return (
      <div className={(this.props.isTab === true ? " " : "fgReact_workingArea") }>
        <div className={"fgReact_SearchPageTitle " + (this.props.isFluid === true ? " container-fluid " : " container ") +
          (this.props.isTab === true ? " d-none " : " ") }>
          {this.props.title}
        </div>
          {
            this.props.hideFilter === true ?            
            "" :
            <div className={"fgReact_componentContainer " + (this.props.isFluid === true ? " container-fluid " : " container ") + (this.props.isTab === true ? " mb-0 pb-0 border-bottom-0 " : "fgReact_workingArea")}>
            <div className="col-12">
              <div>
                <FilterSearchRow 
                  isFluid={this.props.isFluid}
                  searchingTables={this.props.searchingTables}
                  fromDate={this.state.fromDate}
                  toDate={this.state.toDate}      

                  dateFormat={this.props.dateFormat ? this.props.dateFormat : "yyyy-MM-dd"}
                  
                  updateFromDate={this.updateFromDate.bind(this)}
                  updateToDate={this.updateToDate.bind(this)}
                  updateSearchingTable={this.updateSearchingTable.bind(this)}

                  makeSearch={this.makeSearch}
                />
              </div>
            </div>
          </div>
          }
        <div className={"fgReact_componentContainer " + 
          (this.props.isFluid === true ? " container-fluid " : " container ") + 
          (this.state.hasLoaded==false && this.state.hasMadeSearch==false && this.state.errorInSearch ==false ? " d-none " : " ") + 
          (this.props.isTab === true ? " mt-0 pt-0 border-top-0 quadPad" : "fgReact_workingArea") }>
          {
            this.state.errorInSearch === true ? (
              <div>Error</div>
            ) : (
              this.state.hasLoaded && this.state.hasMadeSearch ? (
              <ResultTable
                data={this.state.data}
                columns={this.state.currentColumns}
                filterable={this.props.filterableResults}
                redirectTo={this.props.redirectTo}
                openInNewPage={this.props.openInNewPage}
                defaultPageSize={this.state.data.length < 10 &&  this.state.data.length !== 0 ? this.state.data.length : 5}
              />
              ) : this.state.hasMadeSearch && this.state.hasLoaded === false ? (
                <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
              ) : (
                ""
              )
            )
          }
        </div>
      </div>
    )
  }
}

export default MultiTableFilterSearch
