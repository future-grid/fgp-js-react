import React, { Component } from 'react';
import './SearchRow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DatePickerWrapper } from '../../MultiReferenceFilterSearch/DatePickerWrapper/DatePickerWrapper';
import moment from 'moment'
export class SearchRow extends Component {
  constructor(props){
    super(props);
    this.state = {
   
    };
    // this.updateKeyword = this.updateKeyword.bind(this);
    console.log('Hey I am the search row props', this.props)
  }

  render() {
    return (
      <div className="col-12 row fgReact_searchrow d-inline-flex align-items-center">
        <div className={"col-md-3 col-12 fgReact_searchInputContainer d-md-inline-flex align-items-center"}>
          <select className="form-control" value={this.props.searchingColumn} onChange={this.props.updateSearchingColumn}>>
            {
              this.props.searchingColumns.map((option, i) => {
                return (
                  <option key={i} value={option.column}>{option.label}</option>
                )
              })
            }
          </select>
        </div>
        {
          this.props.searchingColumns[this.props.searchingColumns.findIndex( row => row.column === this.props.searchingColumn )]["isTs"] === true ? (
              <div className={"col-md-3 col-12 d-md-inline-flex align-items-center fgReact_searchInputContainer"}>
                <select className="form-control " value={this.props.searchingType} onChange={this.props.updateSearchingType}>
                  {
                    this.props.dateSearchingTypes.map((option, i) => {
                      return (
                        <option key={i} value={option.key}>{option.label}</option>
                        )
                      })
                  }
                </select>
              </div>              
            ):(
              <div className={"col-md-3 col-12 d-md-inline-flex align-items-center fgReact_searchInputContainer"}>
                <select className="form-control " value={this.props.searchingType} onChange={this.props.updateSearchingType}>
                  {
                    this.props.searchingTypes.map((option, i) => {
                      return (
                        <option key={i} value={option.key}>{option.label}</option>
                        )
                      })
                  }
                </select>
              </div>              
            )
        }

        {
          this.props.searchingColumns[this.props.searchingColumns.findIndex( row => row.column === this.props.searchingColumn )]["isTs"] === true ? (

            <DatePickerWrapper
              customClasses={" col-md-4 col-12 d-md-inline-flex align-items-center"}
              date={this.props.searchingKeyword}
              handleChange={this.props.updateDateTime}
            />
            )  : (
            <div className={"col-md-3 col-12 d-md-inline-flex align-items-center fgReact_searchInputContainer "}>
              <input className="form-control" placeholder="Keyword..." value={this.props.searchingKeyword} onChange={this.props.updateKeyword}>
              </input>
            </div>   
          ) 
        }
        
          <div className="d-inline-flex align-items-center col-12 col-md-3 "> 
          { 
            this.props.isFirst === true ? (
                  <button className="btn btn-secondary" style={{"marginRight":"10px"}} onClick={this.props.addSearchCriteria}>
                    <FontAwesomeIcon className="" icon={["fas", "plus"]}/>
                  </button> 
              ) 
              : (
                  <button className="btn btn-secondary" onClick={() => this.props.removeSearchCriteria(this.props.indexKey)}>
                    <FontAwesomeIcon className="" icon={["fas", "minus"]}/>
                  </button>
              )
            }
          { 
            this.props.isFirst === true ? (
                  <div style={{"display" : "contents"}}>
                    <button className="btn btn-primary" onClick={this.props.makeSearch}>
                        <FontAwesomeIcon className="" icon={["fas", "search"]}/>
                    </button>
                    {
                      this.props.hasResultMap === true ? (
                        <button className="btn btn-secondary" style={{"marginLeft":"10px"}} onClick={this.props.toggleMap}>
                          <FontAwesomeIcon className="" icon={["fas", "map"]}/>
                        </button>                         
                      ) : (
                        ""
                      )
                    }
                  </div>  
              ) 
              : (
                ""
              )
            }
          </div>

      </div>
    )
  }
}

export default SearchRow
