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
      firstTouchScroll : true,
      popupInfo: [],
      searchConfig : {
        searchingTypes : this.props.searchConfig.searchingTypes,
        searchingColumns : this.props.searchConfig.searchingColumns,
        columns : this.props.searchConfig.columns,
        locationColumns : this.props.searchConfig.locationColumns,
        customer : this.props.searchConfig.customer,
        reference : this.props.searchConfig.reference,
        defaultQtyRecordsToRetrieve : this.props.searchConfig.defaultQtyRecordsToRetrieve ?  this.props.searchConfig.defaultQtyRecordsToRetrieve : 125,
        startFrom : this.props.searchConfig.defaultQtyRecordsToRetrieve ? this.props.searchConfig.defaultQtyRecordsToRetrieve : 0,
        searchDirection : this.props.searchConfig.searchDirection ? this.props.searchConfig.searchDirection : "%20asc",
        apiUrl : (this.props.baseApiUrl + this.props.searchConfig.reference),
        hz : this.props.searchConfig.hz,
        map : this.props.searchConfig.map,
        mapVisible : false,

      },
      rowsPerPage : this.props.defaultPageSize !== undefined ? this.props.defaultPageSize : 25,
      totalRecords : this.props.searchConfig.defaultQtyRecordsToRetrieve ?  this.props.searchConfig.defaultQtyRecordsToRetrieve : 250,
      serverPage : 0,
      clientPage : 0,
      totalPages : this.props.defaultPageSize !== undefined && this.props.searchConfig.defaultQtyRecordsToRetrieve !== undefined ? this.props.searchConfig.defaultQtyRecordsToRetrieve / this.props.defaultPageSize : 5,
      currentQueryString : this.props.baseApiUrl + this.props.searchConfig.reference + '/data/' +
      this.props.searchConfig.defaultQtyRecordsToRetrieve + "/" +
      this.props.searchConfig.startFrom + "/" +
      this.props.searchConfig.customer +
      this.props.searchConfig.searchDirection,
      searchRows : [
        { searchingType : this.props.defaultSearchType,
          searchingColumn : this.props.defaultSearchColumn,
          searchingKeyword : this.props.defaultSearchValue,
          isFirst : true,
          indexKey : Math.random()
        }],
      hasLoaded : false,
      data : [],
      showHScroll : false,
      slideValue : 0,
      scrollInterval : 0,
      scrollIntervalTotal : 0
      // scrollInterval : this.calculateSliderIntervalSize(this.props.searchConfig.columns),
      // scrollIntervalTotal : this.calculateSliderTotalSize(this.props.searchConfig.columns)
    };

    // console.log(this.props)
    this.addSearchCriteria = this.addSearchCriteria.bind(this);
    this.removeSearchCriteria = this.removeSearchCriteria.bind(this);
    this.toggleMap = this.toggleMap.bind(this);
    this.makeSearch = this.makeSearch.bind(this);
    this.makeSearchWithCache = this.makeSearchWithCache.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changeRowCount = this.changeRowCount.bind(this);
    this.slide = this.slide.bind(this)
    this.calculateSliderIntervalSize = this.calculateSliderIntervalSize.bind(this);
    this.calculateSliderTotalSize = this.calculateSliderTotalSize.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount(){
    if(this.props.horizontalScrollBar === true){
      window.addEventListener("resize", this.handleResize);  
    }
    let popupInfo = [];
    if(this.props.mapPopupInfo !== undefined ){
      if(this.props.mapPopupInfo === 'all' || this.props.mapPopupInfo === 'ALL'){
        //console.log(this.props.searchConfig.columns)
        this.props.searchConfig.columns.forEach((row) => {
          let obj = {};
          obj.label=row.Header;
          obj.colName=row.accessor;
          popupInfo.push(obj)
        })
      } else {
        this.props.mapPopupInfo.forEach((col)=>{
          this.props.searchConfig.columns.forEach((row) => {
            if(col === row.accessor){
              let obj = {};
              obj.label=row.Header;
              obj.colName=row.accessor;
              popupInfo.push(obj)
            }
          });
        })
      }
    }
    //console.log(popupInfo);
    this.setState({popupInfo: popupInfo})
    if(this.props.defaultSearchValue === undefined || this.props.defaultSearchValue === null || this.props.defaultSearchValue === ""){
      this.makeSearch(true)
    } else {
      this.makeSearch(false)
    }

  }

  componentWillUnmount(){
    if(this.props.horizontalScrollBar === true){
      window.removeEventListener("resize", this.handleResize);
    }
  }

  calculateSliderIntervalSize(columns){
    let avg;
    var sum = 0;
    columns.forEach( column => {
      sum += column.minWidth
    })
    avg = Math.ceil(sum / columns.length);
    return avg
  }

  calculateSliderTotalSize(columns){
    let avg;
    var sum = 0;
    columns.forEach( column => {
      sum += column.minWidth
    })
    avg = Math.floor(sum / columns.length);
    return sum
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

  makeSearchWithCache(isFirstTime){
    var queryString;
    // using the check query method from the cache
    if(isFirstTime === true ){
      // the query string
      queryString = this.props.baseApiUrl + this.props.searchConfig.reference + '/data/' +
      this.props.searchConfig.defaultQtyRecordsToRetrieve + "/" +
      this.props.searchConfig.startFrom + "/" +
      this.props.searchConfig.customer +
      this.props.searchConfig.searchDirection;
    }else{
      // setting the loading to false
      this.setState({
        hasLoaded : false
      })
      // building up the query string
      let query_rsql = [];

      this.state.searchRows.forEach(_c => {
        if(_c.searchingType === "==*?*" || _c.searchingType === "==\"*?*\"" ||  _c.searchingType === "!=*?*"){
          // var _tempSearch = _c.searchingKeyword.replace("\"", "\\\"");
          var items = [];
          var newSearch = null;
          if(_c.searchingType === "==\"*?*\""){
              // single like address with comma
            newSearch = _c.searchingKeyword;
          }else if(_c.searchingType === "==*?*" ||  _c.searchingType === "!=*?*"){
               // multi split by comma
            for(var i = 0; i < _c.searchingKeyword.split(',').length; i++){
              items.push(_c.searchingKeyword.split(',')[i].trim());
            }
          }

          if (_c.searchingColumn !== "all") {
            if(_c.searchingType === "==\"*?*\""){
              // check
              query_rsql.push(_c.searchingColumn + _c.searchingType.replace("?", newSearch) + "");
            }else if(_c.searchingType === "==*?*" ||  _c.searchingType === "!=*?*"){
              var final = "";
              items.forEach((_item, _in)=>{
                if(_c.searchingType === "!=*?*"){
                  var _tempRSQL = _c.searchingColumn + "" + "!=\"?\"".replace("?", _item);
                }else{
                  var _tempRSQL = _c.searchingColumn + "" + "==\"*?*\"".replace("?", _item);
                }
                if(_in < items.length - 1){
                  _c.searchingType === "!=*?*" ? final += _tempRSQL + ";" : final += _tempRSQL + ",";
                }else{
                  final += _tempRSQL;
                }
              });
              query_rsql.push(final);
            }

        } else if(_c.searchingColumn === "all" && _c.searchingKeyword !== null &&
                  _c.searchingKeyword.trim() !== ""){
                    console.log('trap in here3')
          if(_c.searchingType === "==\"*?*\""){
            // put all column names here
            var _tempRSQL = "(";
            this.state.searchConfig.searchingColumns.forEach((_column, _index)=>{
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
          }else if(_c.searchingType === "==*?*" ||  _c.searchingType === "!=*?*"){
                  //
            final = "";
            //let _searchConfig = this.state.searchConfig;
            items.forEach((_item, _in)=>{
              var _tempRSQL = "(";

              this.state.searchConfig.searchingColumns.forEach((_column, _index)=>{
                if(_column.column !== "all"){
                  if(_index <  this.state.searchConfig.searchingColumns.length -1){
                    _c.searchingType === "!=*?*" ? _tempRSQL += _column.column + "" + "!=\"?\"".replace("?", _item) + ";" : _tempRSQL += _column.column + "" + "==\"*?*\"".replace("?", _item) + ",";
                  }else{
                    _c.searchingType === "!=*?*" ? _tempRSQL += _column.column + "" + "!=\"*?*\"".replace("?", _item) : _tempRSQL += _column.column + "" + "==\"*?*\"".replace("?", _item);
                  }
                }
              });
              _tempRSQL += ")";
              if(_in < items.length - 1){
                _c.searchingType === "!=*?*" ? final += _tempRSQL + ";" : final += _tempRSQL + ",";
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
            this.state.searchConfig.searchingColumns.forEach((_column, _index)=>{
              if(_column.column !== "all"){
                if(_index <  this.state.searchConfig.searchingColumns.length - 1){
                  _c.searchingType === "!=\"?\"" || _c.searchingType === "=isnull=true" || _c.searchingType === "=isnull=false" ? _tempRSQL += _column.column + "" + _c.searchingType.replace("?", _c.searchingKeyword) + ";" : _tempRSQL += _column.column + "" + _c.searchingType.replace("?", _c.searchingKeyword) + ",";
                }else{
                  _tempRSQL += _column.column + "" + _c.searchingType.replace("?", _c.searchingKeyword);
                }
              }
            });
            _tempRSQL += ")";
            query_rsql.push(_tempRSQL);
          }
        }
      });

      queryString =  this.props.baseApiUrl + this.props.searchConfig.reference + '/data/' +
      this.props.searchConfig.defaultQtyRecordsToRetrieve + "/" +
      this.props.searchConfig.startFrom + "/" +
      this.props.searchConfig.customer +
      this.props.searchConfig.searchDirection

      if (query_rsql && query_rsql.length > 0) {
        queryString = queryString + "?" + query_rsql.join(";");
      }
    }


    // checking if this search has been made in the session, if it has been, resolve to saved data, else make api call
    if(this.props.sspCache.checkQueryString(queryString) === true){ // is cached
      console.log('checked and true, setting to true')
      let data = this.props.sspCache.getQueryStringData(queryString);
      this.setState({
        data: data,
        hasLoaded : true
      })
    }else{
      // make query to api and save the result to the session
      axios.get(queryString)
        .then(res => {
          // console.log(res)
          this.setState({
            data: res.data,
            hasLoaded : true
          })
          this.props.sspCache.setQueryStringData(queryString, res.data)
        }).catch(function (error) {
          console.log(error);
        })
    }
  }

  makeSearch(isFirstTime) {
    if(this.props.serverSidePagination === true){
      //checking if there is not a sessionStorage object, creating one if there is not and making the query, saving the query into the session storage too
      if(this.props.sspCache.checkStorageKey()){
        this.makeSearchWithCache(isFirstTime);
      }else{
        this.props.sspCache.setStorageKey();
        this.makeSearchWithCache(isFirstTime);
      }

    }else{
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
                              data: res.data,
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


        // http://fgp-api-qa.domain.prd.int.domain.dev.int/ue-neutral-health/
        // meter_lookup_vw/data/350/0/meterSerialNum%20asc?nicMacId==%22*000011*%22,nicMacId==%22*0000135*%22

        this.state.searchRows.forEach(_c => {

          if(_c.searchingType === "==*?*" || _c.searchingType === "==\"*?*\"" ||  _c.searchingType === "!=*?*"){
            // var _tempSearch = _c.searchingKeyword.replace("\"", "\\\"");

            var items = [];
            var newSearch = null;

            if(_c.searchingType === "==\"*?*\""){
                // single like address with comma
              newSearch = _c.searchingKeyword;
            }else if(_c.searchingType === "==*?*" ||  _c.searchingType === "!=*?*"){
                 // multi split by comma
              for(var i = 0; i < _c.searchingKeyword.split(',').length; i++){
                items.push(_c.searchingKeyword.split(',')[i].trim());
              }
            }

            if (_c.searchingColumn !== "all") {
              if(_c.searchingType === "==\"*?*\""){
                // check
                query_rsql.push(_c.searchingColumn + _c.searchingType.replace("?", newSearch) + "");
              }else if(_c.searchingType === "==*?*" ||  _c.searchingType === "!=*?*"){
                var final = "";
                items.forEach((_item, _in)=>{
                  var _tempRSQL
                  if(_c.searchingType === "!=*?*"){
                    _tempRSQL = _c.searchingColumn + "" + "!=\"?\"".replace("?", _item)
                  } else {
                    _tempRSQL = _c.searchingColumn + "" + "==\"*?*\"".replace("?", _item);
                  }
                  //_c.searchingType === "!=*?*" ?  _tempRSQL = _c.searchingColumn + "" + "!=\"?\"".replace("?", _item) : _c.searchingColumn + "" + "==\"*?*\"".replace("?", _item);
                  if(_in < items.length - 1){
                    _c.searchingType === "!=*?*" ? final += _tempRSQL + ";" : final += _tempRSQL + ",";
                  }else{
                    final += _tempRSQL;
                  }
                });
                //console.log("final",final);
                query_rsql.push(final);
              }

          } else if(_c.searchingColumn === "all" && _c.searchingKeyword !== null &&
                    _c.searchingKeyword.trim() !== ""){
            if(_c.searchingType === "==\"*?*\""){
              // put all column names here
              var _tempRSQL = "(";
              this.state.searchConfig.searchingColumns.forEach((_column, _index)=>{
                if(_column.column !== "all"){
                  if(_index <  this.props.searchConfig.searchingColumns.length -1){
                    _tempRSQL += _column.column + "" + _c.searchingType.replace("?", _c.searchingKeyword) + ",";
                  }else{
                    _tempRSQL += _column.column + "" + _c.searchingType.replace("?", _c.searchingKeyword);
                  }
                }
              });
              _tempRSQL += ")";
                    query_rsql.push(_tempRSQL);
            }else if(_c.searchingType === "==*?*" ||  _c.searchingType === "!=*?*"){
                    //
              final = "";

              //let _searchConfig = this.state.searchConfig;
              items.forEach((_item, _in)=>{
                var _tempRSQL = "(";

                this.state.searchConfig.searchingColumns.forEach((_column, _index)=>{
                  if(_column.column !== "all"){
                    if(_index <  this.state.searchConfig.searchingColumns.length -1){
                      _c.searchingType === "!=*?*" ?  _tempRSQL += _column.column + "" + "!=\"?\"".replace("?", _item) + ";" : _tempRSQL += _column.column + "" + "==\"*?*\"".replace("?", _item) + ",";
                    }else{
                      _c.searchingType === "!=*?*" ? _tempRSQL += _column.column + "" + "!=\"?\"".replace("?", _item) : _tempRSQL += _column.column + "" + "==\"*?*\"".replace("?", _item);
                    }
                  }
                });
                _tempRSQL += ")";
                if(_in < items.length - 1){
                  _c.searchingType === "!=*?*" ? final += _tempRSQL + ";" : final += _tempRSQL + ",";
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
              this.state.searchConfig.searchingColumns.forEach((_column, _index)=>{
                if(_column.column !== "all"){
                  if(_index <  this.state.searchConfig.searchingColumns.length - 1){
                    _tempRSQL += _column.column + "" + _c.searchingType.replace("?", _c.searchingKeyword) + ",";
                  }else{
                    _tempRSQL += _column.column + "" + _c.searchingType.replace("?", _c.searchingKeyword);
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
              data: res.data,
              hasLoaded: true
            })
          }).catch(function (error) {
            console.error(error)
          });
      }
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

  resizeCallBack(val){
      document.getElementsByClassName('rt-table')[0].scrollTo(this.state.scrollInterval * val, 0)
  }

  slide(val, isButton){
    if(this.state.scrollInterval === 0 ){
      if(!isButton){
        this.handleResize([val.target.value, isButton])
      }else{
        this.handleResize([val, isButton])
      }
    }else{
      if(isButton){
        document.getElementsByClassName('rt-table')[0].scrollTo(this.state.scrollInterval * val, 0)
      }else{
        document.getElementsByClassName('rt-table')[0].scrollTo(this.state.scrollInterval * val.target.value,0)
      }
    }
  }

  scrollLeft(){
    document.getElementById('customSliderInput').value = parseInt(document.getElementById('customSliderInput').value) + 1
    this.slide(parseInt(document.getElementById('customSliderInput').value), true)
  }

  scrollRight(){
    document.getElementById('customSliderInput').value = parseInt(document.getElementById('customSliderInput').value) - 1
    this.slide(parseInt(document.getElementById('customSliderInput').value), true)
  }

  // allow resize handling so that the scrollbar is actually
  handleResize(scroll) {
    if(this.state.hasLoaded === true){
      const resultTableWidth = document.getElementsByClassName('ResultTable')[0].clientWidth //container (smaller)
      const totalTableWidth = document.getElementsByClassName('rt-thead')[0].clientWidth// content (larger)
      const offset = totalTableWidth - resultTableWidth;
      const interval = offset / 100
      if(scroll === undefined){
        this.setState({
          scrollInterval : interval,
          scrollIntervalTotal : offset
        })
      }else{
        this.setState({
          scrollInterval : interval,
          scrollIntervalTotal : offset
        }, () => {
          this.resizeCallBack(scroll[0], scroll[1])
        })
      }

    }
    
  }


  changePage(){

    var currentPageFromArgs = arguments[0]
    var currentPage_frontEnd = this.state.clientPage; // how to get this
    var currentPagesCount_frontend = this.state.totalPages;
    var currentPageSize_frontend = this.state.rowsPerPage;
    var currentPage_serverSide = this.state.serverPage;
    var currentQueryString = this.state.currentQueryString;
    var data = [...this.state.data];

    // increase the current page number if the table component page number is more than current
    if(currentPageFromArgs  > currentPage_frontEnd){
      console.log('changing page ')
      currentPage_frontEnd ++;
      // checking if we need to fetch more data (at last page)
      if(currentPagesCount_frontend === currentPage_frontEnd + 1 ){
        console.log('reached end ')
        //increasing the count of the page in the query string
        currentQueryString = currentQueryString.split("/"+currentPage_serverSide+"/")[0] +
          `/${currentPage_serverSide+1}/` +
          currentQueryString.split("/"+currentPage_serverSide+"/")[1]
        // as changePage() will be primarily used in serverside pagination code, we check the cache for the query first
        if(this.props.sspCache.checkStorageKey()){ // have a key, check the query string
          if(this.props.sspCache.checkQueryString(currentQueryString)){ // have a query string, load in the data from cache
            console.log('retriving from cache')
            data.push(...this.props.sspCache.getQueryStringData(currentQueryString))
            this.setState({
              data : data,
              hasLoaded : true,
              currentQueryString : currentQueryString,
              clientPage : currentPage_frontEnd,
              serverPage : currentPage_serverSide + 1,
              totalPages : (Math.ceil(data.length / currentPageSize_frontend))
            })
          }else{ // make the api call, load into cache up and update state
            axios.get(currentQueryString)
            .then(res => {
              data.push(...res.data)
              this.setState({
                data : data,
                hasLoaded : true,
                currentQueryString : currentQueryString,
                clientPage : currentPage_frontEnd,
                serverPage : currentPage_serverSide + 1,
                totalPages : (Math.ceil(data.length / currentPageSize_frontend))
              })
              this.props.sspCache.setQueryStringData(currentQueryString, res.data)
            }).catch(function (error) {
              console.error(error)
            });
          }
        }else{ // set the key and string
          this.props.sspCache.setStorageKey()
          this.props.sspCache.setQueryStringData(currentQueryString, res.data)
        }
      }else{
        this.setState({
          clientPage : currentPage_frontEnd,
        })
      }
    // decrease the page number, no other code really needed here
    }else{
      currentPage_frontEnd --;
      this.setState({
        clientPage : currentPage_frontEnd,
      })
    }
  }

  changeRowCount(){
    console.log('arguments', arguments)
    var currentRowsPerPage = arguments[0];
    var currentQueryString = this.state.currentQueryString;
    var previousRowsPerPage = this.state.rowsPerPage;
    var data = [...this.state.data];
    var defecit = 0;
    this.setState({
      rowsPerPage : currentRowsPerPage,
      totalPages : (Math.ceil(data.length / currentRowsPerPage))
    })
  }

  render() {
    var slideValue = 0;
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
                        exportCsv={this.props.exportCsv}
                        csvData={this.state.data}
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
              mapProjection={this.props.mapProjection ? this.props.mapProjection : "EPSG:4326"}
              mapInteractions={this.props.mapInteractions ? this.props.mapInteractions : []}
              mapVisible={this.state.mapVisible}
              highlight={this.props.highlight}
              isHighlightRow={this.props.isHighlightRow === true ? this.props.isHighlightRow : false}
              keyColumns={this.props.keyColumns ? this.props.keyColumns : []}
              isDynamicWidth={this.props.isDynamicWidth}
              mapPopupInfo={this.state.popupInfo}
              mapLayers={this.props.mapLayers}
              defaultPageSize={this.props.defaultPageSize ? this.props.defaultPageSize : 25}
              pageSizeOptions={this.props.defaultRowSizeArray}
              clientPage={this.state.clientPage}
              serverPage={this.state.serverPage}
              totalPages={this.state.totalPages}
              totalRecords={this.state.totalRecords}
              rowsPerPage={this.state.rowsPerPage}
              onPageChange={this.changePage}
              onRowCountChange={this.changeRowCount}
              serverSidePagination={this.props.serverSidePagination}
            />
            ) :
            <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
          }
        </div>
        {
          this.props.horizontalScrollBar === true ? (
            <div className={ this.state.hasLoaded ? " customScrollBar-cont " : "importantHidden"}>
            <div className={"customScrollBar"}>
               <button className={"customSlider-btn"} onClick={this.scrollRight.bind(this, "right")}>
                   &lt;
               </button>
               <input id="customSliderInput" type="range" onInput={(e) => this.slide(e)} className={"customSlider"} min={0} max={100} step={1} defaultValue={this.state.slideValue}></input>
               <button className={"customSlider-btn"} onClick={this.scrollLeft.bind(this, "left")}>
                   &gt;
               </button>
             </div>
           </div>
          ) : (
          ""
          )
        }
      </div>
    )
  } 
}

export default Search
