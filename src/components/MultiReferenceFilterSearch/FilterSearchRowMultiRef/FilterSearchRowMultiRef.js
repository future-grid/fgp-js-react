import React, { Component } from 'react';
import './FilterSearchRowMultiRef.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {DatePickerWrapper} from '../DatePickerWrapper/DatePickerWrapper';
export class FilterSearchRowMultiRef extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <div className="col-12 row fgReact_searchrow d-inline-flex align-items-center">
        <div className={"col-md-4 col-12 fgReact_searchInputContainer d-md-inline-flex align-items-center"}>
          <select className="form-control" onChange={this.props.updateSearchingTable}>
            {
              this.props.searchingReferences.map((option, i) => {
                  return(
                    <option  key={i} value={`${i}`}>{option.dropdownLabel}</option>
                  )
              })
            }
          </select>
        </div>
        <div className={"col-md-4 col-12 d-md-inline-flex align-items-center fgReact_searchInputContainer"}>
          <DatePickerWrapper
            date={this.props.fromDate}
            dateFormat={this.props.dateFormat ? this.props.dateFormat : "yyyy-MM-dd"}
            handleChange={this.props.updateFromDate}
            dropdownMode="select"
          />
        </div>
        <div className={"col-md-4 col-12 d-md-inline-flex align-items-center fgReact_searchInputContainer "}>
          <DatePickerWrapper
            date={this.props.toDate}
            dateFormat={this.props.dateFormat ? this.props.dateFormat : "yyyy-MM-dd"}
            handleChange={this.props.updateToDate}
            dropdownMode="select"
          />
        </div>
      </div>
    )
  }
}

export default FilterSearchRowMultiRef
