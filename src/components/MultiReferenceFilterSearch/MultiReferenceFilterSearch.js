import React, { Component } from 'react';
import './MultiReferenceFilterSearch.css';
import axios from "axios";
import ResultTable from '../Search/resulttable/ResultTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FilterSearchRowMultiRef } from './FilterSearchRowMultiRef/FilterSearchRowMultiRef';
import moment from 'moment';

export class MultiReferenceFilterSearch extends Component {
  constructor(props){
    super(props);
    this.state = {
      hasLoaded : false,
      data : [],
      fromDate: moment().subtract(7, 'd').startOf('day').valueOf(),
      toDate: moment().startOf('day').valueOf(),
      currentReference : `${this.props.searchingReferences[0].referenceName}/data/${this.props.searchingReferences[0].noOfRecords}/0/${this.props.searchingReferences[0].startTimeStampColumn}%20asc`,
      currentColumns: this.props.searchingReferences[0].columnsToShow,
      currentFromColumn : this.props.searchingReferences[0].startTimeStampColumn,
      currentToColumn : this.props.searchingReferences[0].endTimeStampColumn,
      hasMadeSearch : false,
      errorInSearch : false,
      searchTypes: {
        greaterThanEqualTo : ">=?",
        lessThanEqualTo : "<=?"
      }
    };
    console.log(this.props)
    this.makeSearch = this.makeSearch.bind(this);
  }

  componentDidMount(){
    this.makeSearch();
  }
  // https://compass-api.dev.welnet.co.nz/compass/icp_reference/data/125/0/icpNumber%20asc
  //                   http://localhost:8081/sapn/reference/site_constraint_exceeded_excursion_day/data/125/0/excursionTs%20asc


  makeSearch(isFirstTime) {
    console.log(
      "Search is being made with the following params:\n from date => ", this.state.fromDate,
      "\nto date => ",this.state.toDate,
      "\nstate => ", this.state.currentReference
    );
    // checking if it is a time series model, at this stage selected table is already a combination
    // of the device type and the current table in the format <deviceType>/<tableName> 
    let selectedEvent = `${this.state.currentReference}?${this.state.currentFromColumn}%3E=${moment(this.state.fromDate).format("YYYY-MM-DD")};${this.state.currentToColumn}%3C=${moment(this.state.toDate).format("YYYY-MM-DD")}`;

    //making the search call
    axios.get(
      `${this.props.baseApiUrl}${selectedEvent}`
    ).then(resp => {
      // child things are hard so ill do them later
      if(this.props.isChildEvents === true){

      }else{
        console.log("resp is here => ", resp)
        this.setState({
          hasMadeSearch : true,
          hasLoaded : true,
          errorInSearch: false,
          data:resp.data
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
      currentReference : `${this.props.searchingReferences[index].referenceName}/data/${this.props.searchingReferences[index].noOfRecords}/0/`,
      currentColumns : this.props.searchingReferences[index].columnsToShow,
      currentFromColumn : this.props.searchingReferences[index].startTimeStampColumn,
      currentToColumn : this.props.searchingReferences[index].endTimeStampColumn

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
                <FilterSearchRowMultiRef 
                  isFluid={this.props.isFluid}
                  searchingReferences={this.props.searchingReferences}
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
                defaultPageSize={this.state.data.length < 10 &&  this.state.data.length !== 0 ? this.state.data.length : 25}
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

export default MultiReferenceFilterSearch
