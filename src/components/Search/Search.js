import React, { Component } from 'react';
import './Search.css';
import { SearchRow } from './searchrow/SearchRow';
import moment from 'moment'
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
        defaultQtyRecordsToRetrieve : this.props.searchConfig.defaultQtyRecordsToRetrieve ?  this.props.searchConfig.defaultQtyRecordsToRetrieve : 250,
        startFrom : this.props.searchConfig.defaultQtyRecordsToRetrieve ? this.props.searchConfig.defaultQtyRecordsToRetrieve : 0,
        searchDirection : this.props.searchConfig.searchDirection ? this.props.searchConfig.searchDirection : "%20asc",
        apiUrl : (this.props.baseApiUrl + this.props.searchConfig.reference),
        hz : this.props.searchConfig.hz,
        map : this.props.searchConfig.map,
        mapVisible : false
      },
      searchRows : [
        { searchingType : this.props.defaultSearchType,
          searchingColumn : this.props.defaultSearchColumn,
          searchingKeyword : "",
          isFirst : true,
          indexKey : Math.random()
        }],
      hasLoaded : false,
      data : []
    };
    // console.log(this.props)
    this.addSearchCriteria = this.addSearchCriteria.bind(this);
    this.removeSearchCriteria = this.removeSearchCriteria.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
    this.makeSearch = this.makeSearch.bind(this);
  }

  componentDidMount(){
    this.makeSearch(true)
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

  makeSearch(isFirstTime) {
    if(isFirstTime === true){
      axios.get(this.props.baseApiUrl + this.props.searchConfig.reference + '/data/' +
      this.props.searchConfig.defaultQtyRecordsToRetrieve + "/" + 
      this.props.searchConfig.startFrom + "/" +
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
    }else{

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
            this.state.searchConfig.searchingColumns.forEach(function(_column, _index){
              if(_column.column !== "all"){
                if(_index <  this.props.searchConfig.searchingColumns.length -1){
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
              this.state.searchConfig.searchingColumns.forEach(function(_column, _index){
                if(_column.column !== "all"){
                  if(_index <  this.state.searchConfig.searchingColumns.length -1){
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
            console.log(_c.searchingKeyword);
            if (String(_c.searchingKeyword).indexOf("'") !== -1 || String(_c.searchingKeyword).indexOf("\"") !== -1) {
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
            this.state.searchConfig.searchingColumns.forEach(function(_column, _index){
              if(_column.column !== "all"){
                if(_index <  this.state.searchConfig.searchingColumns.length - 1){
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
      this.props.searchConfig.startFrom + "/" +
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
  }

  removeSearchCriteria(indexKey) {
    let resultIndex = this.state.searchRows.findIndex(p => p.indexKey === indexKey)
    let tempArr = [...this.state.searchRows];
    tempArr.splice(resultIndex, 1)
    this.setState({
      searchRows: tempArr
    });
  }

  toggleMap(){
    this.setState({
      mapVisible : !this.state.mapVisible
    })
    console.log('toggled', this.state.mapVisible)
  }

  updateDateTime(key, rowKey, value){
    let ts = moment(value).format("YYYY-MM-DD")
    let resultRow = this.state.searchRows.findIndex(p => p.indexKey === rowKey);
    let temp = [...this.state.searchRows];
    temp[resultRow][key] = ts
    this.setState({searchRows: temp})
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

  dynamicResultFunction(pageIndex, pageSize){
    console.log(arguments, "pagination server side not implemented in this release")
    let initialData = 125;
    let initialSize = 25;
    let initialPages = 5;

    let amountOfDataToRetrieve = pageSize * 5;
    
  }

  dynamicResultFunctionPage(){
    console.log(arguments, "pagination server side not implemented in this release")
    // let initialData = 125;
    // let initialSize = 25;
    // let initialPages = 5;

    
  }


  render() {
    return (
      <div className="fgReact_workingArea">
        <div className={"fgReact_SearchPageTitle " + (this.props.isFluid === true ? " container-fluid " : " container ")}>{this.props.title}</div>
          {
            this.props.hideFilter === true ?            
            "" :
            <div className={"fgReact_componentContainer " + (this.props.isFluid === true ? " container-fluid " : " container ")}>
            <div className="col-12">
              <div>
                {   
                   this.state.searchRows.map((row, i) => {
                    return (     
                      <SearchRow 
                        isFluid={this.props.isFluid}
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
                        updateDateTime={this.updateDateTime.bind(this , 'searchingKeyword', row.indexKey )}                  
                        makeSearch={this.makeSearch}
                        searchingTypes={this.props.searchConfig.searchingTypes} 
                        dateSearchingTypes={this.props.searchConfig.dateSearchingTypes ? this.props.searchConfig.dateSearchingTypes : [{"key": "<?","label": "Less Than"},{"key": ">?","label": "Greater Than"}] } 
                        searchingColumns={this.props.searchConfig.searchingColumns} 
                        isFirst={row.isFirst}
                        hasResultMap={this.props.hasResultMap === true ? this.props.hasResultMap : false}
                        toggleMap={this.toggleMap}
                      />)
                  })
                }
              </div>
            </div>
          </div>
          }

        <div className={"fgReact_componentContainer " + (this.props.isFluid === true ? " container-fluid " : " container ")}>
          { 
            this.state.hasLoaded ? (
            <ResultTable
              data={this.state.data}
              columns={this.props.searchConfig.columns}
              filterable={this.props.filterableResults}
              redirectTo={this.props.redirectTo}
              openInNewPage={this.props.openInNewPage}
              hasResultMap={this.props.hasResultMap === true ? this.props.hasResultMap : false}
              latColumn={this.props.latColumn ? this.props.latColumn : false}
              lngColumn={this.props.lngColumn ? this.props.lngColumn : false}
              mapDeviceColumnName={this.props.mapDeviceColumnName ? this.props.mapDeviceColumnName : false}
              dynamicResultFunction={this.dynamicResultFunction.bind(this)}
              dynamicResultFunctionPage={this.dynamicResultFunctionPage.bind(this)}
              mapProjection={this.props.mapProjection ? this.props.mapProjection : "EPSG:4326"}
              mapInteractions={this.props.mapInteractions ? this.props.mapInteractions : []} 
              mapVisible={this.state.mapVisible}
            />
            ) : 
            <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
          }
        </div>
      </div>
    )
  }
}

export default Search
