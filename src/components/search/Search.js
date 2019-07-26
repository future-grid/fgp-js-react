import React, { Component } from 'react';
import './Search.css';
import { SearchRow } from './searchrow/SearchRow';
import axios from "axios";
import ResultTable from './resulttable/ResultTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      searchConfig : {
        searchingTypes : this.props.searchConfig.searchingTypes,
        searchingColumns : this.props.searchConfig.searchingColumns,
        columns : this.props.searchConfig.columns,
        locationColumns : this.props.searchConfig.locationColumns,
        customer : this.props.searchConfig.customer,
        reference : this.props.searchConfig.reference,
        defaultQtyRecordsToRetrieve : this.props.searchConfig.defaultQtyRecordsToRetrieve,
        startFrom : 0,
        searchDirection : "%20asc",
        apiUrl : (this.props.baseApiUrl + this.props.searchConfig.reference),
        hz : this.props.searchConfig.hz,
        map : this.props.searchConfig.map
      },
      searchRows : [
        { searchingType : this.props.defaultSearchType,
          searchingColumn : this.props.defaultSearchColumn,
          searchingKeyword : "",
          isFirst : true,
          indexKey : Math.random()
        }],
      hasLoaded : false,
      data : axios.get(this.props.baseApiUrl + this.props.searchConfig.reference + '/data/' +
      this.props.searchConfig.defaultQtyRecordsToRetrieve + "/" + 
      this.props.searchConfig.defaultStartFrom + "/" +
      this.props.searchConfig.customer +
      this.props.searchConfig.searchDirection
                      )
                        .then(res => {
                          // console.log(res)
                          this.setState({
                            data: res.data
                          })
                          this.setState({
                            hasLoaded: true
                          })
                        }).catch(function (error) {
                          console.log(error);
                        })
    };
    // console.log(this.props)
    this.addSearchCriteria = this.addSearchCriteria.bind(this);
    this.removeSearchCriteria = this.removeSearchCriteria.bind(this);
    this.makeSearch = this.makeSearch.bind(this);
  }

  addSearchCriteria() {
    let defaultSearchRow = {
      searchingType : this.props.defaultSearchType,
      searchingColumn : this.props.defaultSearchColumn,
      searchingKeyword : "",
      isFirst : false,
      indexKey : Math.random()
    };
    this.setState(state => ({
      searchRows: state.searchRows.concat([defaultSearchRow])
    }));
  }

  makeSearch() {
    this.setState({
      hasLoaded: false
    })
    let query_rsql = [];

    this.state.searchRows.forEach(_c => {
      if(_c.searchingType === "==*?*" || _c.searchingType === "==\"*?*\""){
        // var _tempSearch = _c.searchingKeyword.replace("\"", "\\\"");
        
        var items = [];
        var newSearch = null;

        if(_c.searchingType === "==\"*?*\""){
            // single like address with comma
          newSearch = _c.searchingKeyword;
        }else if(_c.searchingType === "==*?*"){
             // multi split by comma                     
          for(var i = 0; i < _c.searchingKeyword.split(',').length; i++){
            items.push(_c.searchingKeyword.split(',')[i].trim());
          }
        }
        
        if (_c.searchingColumn !== "all") {           
          if(_c.searchingType === "==\"*?*\""){ 
            // check
            query_rsql.push(_c.searchingColumn + _c.searchingType.replace("?", newSearch) + "");
          }else if(_c.searchingType === "==*?*"){
            var final = "";
            items.forEach(function(_item, _in){
              var _tempRSQL = _c.searchingColumn + "" + "==\"*?*\"".replace("?", _item);
              if(_in < items.length - 1){
                final += _tempRSQL + ",";
              }else{
                final += _tempRSQL;
              }
            });
            query_rsql.push(final);
          }
            
      } else if(_c.searchingColumn === "all" && _c.searchingKeyword !== null && 
                _c.searchingKeyword.trim() !== ""){
        if(_c.searchingType === "==\"*?*\""){
          // put all column names here
          var _tempRSQL = "(";
          this.props.SearchConfig.searchingColumns.forEach(function(_column, _index){
            if(_column.column !== "all"){
              if(_index <  this.props.SearchConfig.searchingColumns.length -1){
                _tempRSQL += _column.column + "" + _c.searchingType.replace("?", newSearch) + ",";
              }else{
                _tempRSQL += _column.column + "" + _c.searchingType.replace("?", newSearch);
              }
            }
          });
          _tempRSQL += ")";
                query_rsql.push(_tempRSQL);
        }else if(_c.searchingType === "==*?*"){
                //
          final = "";
          items.forEach(function(_item, _in){
            var _tempRSQL = "(";
            this.props.SearchConfig.searchingColumns.forEach(function(_column, _index){
              if(_column.column !== "all"){
                if(_index <  this.props.SearchConfig.searchingColumns.length -1){
                  _tempRSQL += _column.column + "" + "==\"*?*\"".replace("?", _item) + ",";
                }else{
                  _tempRSQL += _column.column + "" + "==\"*?*\"".replace("?", _item);
                }
              }
            });
            _tempRSQL += ")";
            if(_in < items.length - 1){
              final += _tempRSQL + ",";
            }else{
              final += _tempRSQL;
            }
          });
          query_rsql.push(final);
        }
            
      }
      }else{
        if (_c.searchingColumn !== "all") {                
          // check
          if (_c.searchingKeyword.indexOf("'") !== -1 || _c.searchingKeyword.indexOf("\"") !== -1) {
            //escape single and double quotes
            var _tempSearch = _c.searchingKeyword.replace("\"", "\\\"");
            _tempSearch = "\"" + _tempSearch + "\"";
            query_rsql.push(_c.searchingColumn + _c.searchingType.replace("?", _tempSearch) + "");
          }else{
            query_rsql.push(_c.searchingColumn + _c.searchingType.replace("?", _c.searchingKeyword) + "");
          }
        } else if(_c.searchingColumn === "all"){
          // put all column names here
          _tempRSQL = "(";
          this.props.SearchConfig.searchingColumns.forEach(function(_column, _index){
            if(_column.column !== "all"){
              if(_index <  this.props.SearchConfig.searchingColumns.length - 1){
                _tempRSQL += _column.column + "" + _c.searchingType.replace("?", newSearch) + ",";
              }else{
                _tempRSQL += _column.column + "" + _c.searchingType.replace("?", newSearch);
              }
            }
          });
          _tempRSQL += ")";
          query_rsql.push(_tempRSQL);   
        }    
      }
    });
   
    let url =  this.props.baseApiUrl + this.props.searchConfig.reference + '/data/' +
    this.props.searchConfig.defaultQtyRecordsToRetrieve + "/" + 
    this.props.searchConfig.defaultStartFrom + "/" +
    this.props.searchConfig.customer +
    this.props.searchConfig.searchDirection

    if (query_rsql && query_rsql.length > 0) {
      url = url + "?" + query_rsql.join(";");
    }
    // console.log(url)
    axios.get(url)
      .then(res => {
        this.setState({
          data: res.data
        })
        this.setState({
          hasLoaded: true
        })
      }).catch(function (error) {
        console.error(error)
      });     
  }

  removeSearchCriteria(indexKey) {
    let resultIndex = this.state.searchRows.findIndex(p => p.indexKey === indexKey)
    let tempArr = [...this.state.searchRows];
    tempArr.splice(resultIndex, 1)
    this.setState({
      searchRows: tempArr
    });
  }

  updateKeyword(key, rowKey, value) {
    let resultRow = this.state.searchRows.findIndex(p => p.indexKey === rowKey);
    let temp = [...this.state.searchRows];
    temp[resultRow][key] = value.target.value
    this.setState({searchRows: temp})
  }

  updateSearchingColumn(key, rowKey, value) {
    let resultRow = this.state.searchRows.findIndex(p => p.indexKey === rowKey);
    let temp = [...this.state.searchRows];
    temp[resultRow][key] = value.target.value
    this.setState({searchRows: temp})
  }

  updateSearchingType(key, rowKey, value) {
    let resultRow = this.state.searchRows.findIndex(p => p.indexKey === rowKey);
    let temp = [...this.state.searchRows];
    temp[resultRow][key] = value.target.value
    this.setState({searchRows: temp})
  }


  render() {
    return (
      <div className="fgReact_workingArea">
        <div className="container fgReact_SearchPageTitle">{this.props.title}</div>
          {
            this.props.hideFilter === true ?            
            "" :
            <div className="container fgReact_componentContainer">
            <div className="col-12">
              <div>
                {   
                   this.state.searchRows.map((row, i) => {
                    return (     
                      <SearchRow 
                        key={row.indexKey} 
                        indexKey={row.indexKey} 
                        addSearchCriteria={this.addSearchCriteria}
                        removeSearchCriteria={this.removeSearchCriteria}           
                        searchingKeyword = {row.searchingKeyword}      
                        searchingType = {row.searchingType}      
                        searchingColumn = {row.searchingColumn}      
                        updateKeyword={this.updateKeyword.bind(this , 'searchingKeyword', row.indexKey )}                  
                        updateSearchingType={this.updateSearchingType.bind(this , 'searchingType', row.indexKey )}                  
                        updateSearchingColumn={this.updateSearchingColumn.bind(this , 'searchingColumn', row.indexKey )}                  
                        makeSearch={this.makeSearch}
                        searchingTypes={this.props.searchConfig.searchingTypes} 
                        searchingColumns={this.props.searchConfig.searchingColumns} 
                        isFirst={row.isFirst}
                      />)
                  })
                }
              </div>
            </div>
          </div>
          }

        <div className="container fgReact_componentContainer">
          { 
            this.state.hasLoaded ? (
            <ResultTable
              data={this.state.data}
              columns={this.props.searchConfig.columns}
              redirectTo={this.props.redirectTo}
            />
            ) : 
            <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
            // <FontAwesomeIcon className="centerSpinner" icon={["fas", "spinner"]}/>
          }
        </div>
      </div>
    )
  }
}

export default Search
