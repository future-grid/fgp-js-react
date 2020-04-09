import React, { Component } from 'react';
import './ResultTable.css';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { NavLink} from 'react-router-dom' ;
import Moment from 'react-moment';
import moment from 'moment';
import { BasicMapFGP } from '../../Map/BasicMapFGP/BasicMapFGP'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import axios from "axios";

export class ResultTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      columnsReady : false,
      columns : [],
      mapData : [],
      dataReady : false,
      mapReady : false,
      data:[],
      originaldata: this.props.data,
      highlightedRowLength: 0
    };
    // console.log(this.props)
    this.buildData = this.buildData.bind(this);
    this.buildColumns = this.buildColumns.bind(this);
    this.dynamicWidth = this.dynamicWidth.bind(this);
    this.mutationHandler = this.mutationHandler.bind(this);
    // this.toggleMap = this.toggleMap.bind(this);
  }


    componentWillReceiveProps(props){
      if(props.highlight !== undefined && props.highlight.length > 0){
          this.highlightRow(props.highlight);
      }
    }

    componentDidUpdate(prevProps){
      if(prevProps.data !== this.props.data){
        // console.log(prevProps.data)
        // console.log(this.props.data)
        // console.log("Data changed in resultTable component")
        this.buildData(this.props.data);
        this.buildColumns(this.props.columns);
        if(this.props.isDynamicWidth){
          this.dynamicWidth(this.props.columns, this.props.data);
        }
      }
    }


  componentDidMount(){
    this.buildData(this.props.data)
    this.buildColumns(this.props.columns)
    if(this.props.isDynamicWidth){
      this.dynamicWidth(this.props.columns, this.props.data);
    }
  }

  buildData(data){
    if(this.props.hasResultMap === true){
      var locationArray = [{
        deviceType : "meter",
        style : {
          fillColor : "blue",
          fillColor : "lightblue"
        },
        children : []
      }]
      // building up the map data
      data.forEach(element => {
        let childObj = element;
        //console.log(element)
        childObj.lat = element[`${this.props.latColumn}`];
        childObj.lng = element[`${this.props.lngColumn}`];
        childObj.name = element[`${this.props.mapDeviceColumnName}`];
        childObj.style = {fillColor : "blue",fillColor : "lightblue"}
        childObj.type = "Device ID";
        locationArray[0].children.push(childObj);
        // locationArray[0].children.push(
        //   {
        //     lat: element[`${this.props.latColumn}`],
        //     lng: element[`${this.props.lngColumn}`],
        //     name : element[`${this.props.mapDeviceColumnName}`],
        //     style : {
        //       fillColor : "blue",
        //       fillColor : "lightblue"
        //     },
        //     type : "Device ID"
        //   }
        // )
      });
    }
    this.setState({
      mapData : locationArray,
      dataReady : true,
      data : data,
      mapReady : true
    })
  }



  // mutates each row of data to present how we want it, returns a row after processing
  mutationHandler(element, row){
    // then we want to collect data along the way
    let processedRow = {...row};
    // mutating the value
    // ensuring we have a split-able value
    // !null === true
    // !"" === true
    // !undefined === true
    if(!row.value === false){
      // Replace ASCII control characters with a space.
      if (typeof processedRow.value === 'string' || processedRow.value instanceof String){
        processedRow.value = processedRow.value.replace(/[^ -~]+/g, " ");
      }

      // value mutation
      if(element["fgpValueMutate"]){
        if(element["fgpValueMutateIndex"]){
          processedRow.value = row.value.split(element.fgpValueMutate)[element.fgpValueMutateIndex];
        }else{
          processedRow.value = row.value.split(element.fgpValueMutate)[0];
        }
      }

      // formatting mutations
      if(element["fgpMutate"]){
        if(element.fgpMutate === "date"){
          if(element["fgpMutateConfig"]){
            processedRow.value = moment(row.value).format(element.fgpMutateConfig)

          }else{
            processedRow.value = moment(row.value).format("lll")
          }
        }else if(element.fgpMutate === "round"){
          if(element["fgpMutateConfig"]){
            processedRow.value = Math.round((row.value * Math.pow(10, element.fgpMutateConfig))) / Math.pow(10, element.fgpMutateConfig);
            if(element["fgpAdditionalSymbol"]){
              processedRow.value = `${Math.trunc(processedRow.value * 100)}${element.fgpAdditionalSymbol}`
            }
          }else{
            processedRow.value = Math.round(row.value);
            if(element["fgpAdditionalSymbol"]){
              processedRow.value = `${Math.trunc(processedRow.value * 100)}${element.fgpAdditionalSymbol}`
            }
          }
        }
      }


      // final step is redirection
      if(element["fgpRedirect"]){
        // check if the row itself is allowed to redirect based on rules
        if(element["fgpLimitRedirectAccessor"]){
          // checks if the column specified is not empty, if it is, do not render a link redirect.
          if(element.fgpLimitRedirectCriteria === "notEmpty"){
            if(row.original[element.fgpLimitRedirectAccessor]){
              var link = row.value;
              // if we want to mutate the redirect link (don't want to mutate the data that gets displayed)
              if(element["fgpRedirectMutate"]){
                if(element["fgpRedirectMutateIndex"]){
                  if(this.props.openInNewPage === true){
                    return(
                    <a target={"_blank"} href={`${window.location.origin}${element.fgpRedirect}${link.split(element.fgpRedirectMutate)[element.fgpRedirectMutateIndex]}`}>
                       {String(processedRow.value)}
                    </a>
                    )
                  }else{
                    return(
                    <NavLink to={`${element.fgpRedirect}${link.split(element.fgpRedirectMutate)[element.fgpRedirectMutateIndex]}`}>
                       {String(processedRow.value)}
                    </NavLink>
                    )
                  }
                }else{
                  if(this.props.openInNewPage === true){
                    return(
                    <a target={"_blank"} href={`${window.location.origin}${element.fgpRedirect}${link.split(element.fgpRedirectMutate)[0]}`}>
                       {String(processedRow.value)}
                    </a>
                    )
                  }else{
                    return(
                    <NavLink to={`${element.fgpRedirect}${link.split(element.fgpRedirectMutate)[0]}`}>
                       {String(processedRow.value)}
                    </NavLink>
                    )
                  }
                }
              }else{
                // if the prop is set, open in new tab
                if(this.props.openInNewPage === true){
                  return (
                    <a target={"_blank"} href={`${window.location.origin}${element.fgpRedirect}${link}`}>
                       {String(processedRow.value)}
                    </a>
                  )
                }else{
                  return (
                    <NavLink to={`${element.fgpRedirect}${link}`}>
                       {String(processedRow.value)}
                    </NavLink>
                  )
                }
              }
            }else{
              return (<div>  {String(processedRow.value)} </div>)
            }
          }
        }else{
          var link = row.value;
          // if we want to mutate the redirect link (don't want to mutate the data that gets displayed)
          if(element["fgpRedirectMutate"]){
            if(element["fgpRedirectMutateIndex"]){
              if(this.props.openInNewPage === true){
                return(
                <a target={"_blank"} href={`${window.location.origin}${element.fgpRedirect}${link.split(element.fgpRedirectMutate)[element.fgpRedirectMutateIndex]}`}>
                  {String(processedRow.value)}
                </a>
                )
              }else{
                return(
                <NavLink to={`${element.fgpRedirect}${link.split(element.fgpRedirectMutate)[element.fgpRedirectMutateIndex]}`}>
                  {String(processedRow.value)}
                </NavLink>
                )
              }
            }else{
              if(this.props.openInNewPage === true){
                return(
                <a target={"_blank"} href={`${window.location.origin}${element.fgpRedirect}${link.split(element.fgpRedirectMutate)[0]}`}>
                  {String(processedRow.value)}
                </a>
                )
              }else{
                return(
                <NavLink to={`${element.fgpRedirect}${link.split(element.fgpRedirectMutate)[0]}`}>
                  {String(processedRow.value)}
                </NavLink>
                )
              }
            }
          }else{
            // if the prop is set, open in new tab
            if(this.props.openInNewPage === true){
              return (
                <a target={"_blank"} href={`${window.location.origin}${element.fgpRedirect}${link}`}>
                  {String(processedRow.value)}
                </a>
              )
            }else{
              return (
                <NavLink to={`${element.fgpRedirect}${link}`}>
                  {String(processedRow.value)}
                </NavLink>
              )
            }
          }
        }
      // redirect the whole row (the fgpRedirectRow variable will consist of a string like this, you should know the properties from your config of the search)
      // example of a fgpRedirectRow config is
      // fgpRedirectRow : "/icp/"
      // fgpRedirectRowPath : "accessor1->accessor2->accessor3"
      }else if(element["fgpRedirectRow"]){
        let path = new String;
        let accessorArr = element.fgpRedirectRowPath.split("->");
        accessorArr.forEach( (accessor, i) => {
            path += row.original[accessor] +  "/"
        });
        // check if the row itself is allowed to redirect based on rules
        if(element["fgpLimitRedirectAccessor"]){
          if(element.fgpLimitRedirectCriteria === "notEmpty"){
            if(row.original[element.fgpLimitRedirectAccessor]){
              if(this.props.openInNewPage === true){
                return (
                  <a target={"_blank"} href={`${window.location.origin}/${element.fgpRedirectRow}${path}`}>
                    {String(processedRow.value)}
                  </a>
                )
              }else{
                return (
                  <NavLink to={`${element.fgpRedirectRow}${path}`}>
                    {String(processedRow.value)}
                  </NavLink>
                )
              }
            }else{
              return (<div>  {String(processedRow.value)} </div>)
            }
          }
        }else{
          if(this.props.openInNewPage === true){
            return (
              <a target={"_blank"} href={`${window.location.origin}/${element.fgpRedirectRow}${path}`}>
                {String(processedRow.value)}
              </a>
            )
          }else{
            return (
              <NavLink to={`${element.fgpRedirectRow}${path}`}>
                {String(processedRow.value)}
              </NavLink>
            )
          }
        }
      }else if(element["fgpExternalLink"]){
        var link = element["fgpExternalLink"];
        var splitValue = element["fgpExternalLinkValue"].split(",");
        for(var i=1; i<=splitValue.length; i++){
          link = link.replace("$"+i, processedRow.row[splitValue[i-1]]);
        }
        return (
          <a target={"_blank"} href={link}>
            {String(processedRow.value)}
          </a>
        )
      }else{
        return(<div> {String(processedRow.value)} </div>)
      }
    }else{
      return(<div> {String("")} </div>)
    }
  }


  buildColumns(data){
    // console.log(data)
    if(this.props.ignoreBuildCols){
    }else{
        data.forEach(element => {
          element["Cell"] = row => (
            this.mutationHandler(element, row)
          )

        });
    }
    this.setState({
      columns : data,
      columnsReady : true
    })
  }

  HandlePagination(){

  }

  dynamicWidth(columns, data){
    columns.forEach(element => {
      let widthMultipleFactor = element["widthMultipleFactor"] !== undefined ? element["widthMultipleFactor"] : 10;
      element["width"] = this.getColumnWidth(data, element["accessor"], element["Header"], element["minWidth"], widthMultipleFactor);
    });
  }

  // getColumnWidth = (rows, accessor, headerText, minWidth, widthMultipleFactor) => {
  //   const cellLength = Math.max(
  //     ...rows.map(row => (`${row[accessor]}` || '').length),
  //     headerText.length,
  //   )
  //   return Math.max(minWidth, cellLength * widthMultipleFactor)
  // }

  getColumnWidth(rows, accessor, headerText, minWidth, widthMultipleFactor){
    const cellLength = Math.max(
      ...rows.map(row => (`${row[accessor]}` || '').length),
      headerText.length,
    )
    return Math.max(minWidth, cellLength * widthMultipleFactor);
  }

  highlightRow(mapInteractions){
    //console.log(mapInteractions);
    // put the click feature on top of result table
    let highlightedRow = [];
    mapInteractions.forEach((featureObj)=>{
      //let featureObj = feature.getProperties();
      if(featureObj !== undefined && featureObj !== null){
        if(this.props.keyColumns !== undefined || this.props.keyColumns !== null){
          this.state.originaldata.forEach((row) => {
            let isRow = true;
            this.props.keyColumns.forEach((col) => {
              if(row[col] !== featureObj.additionalInfo[col]){
                isRow = false;
              }
            })
            if(isRow){
              highlightedRow.push(row);
            }
          })
        }
      }
    })
    //console.log(highlightedRow);
    let newData = [...highlightedRow, ...this.state.originaldata];
    this.setState({data: newData,highlightedRowLength: highlightedRow.length})
    this.buildData(newData);
  }

  render() {
    const filterCaseInsensitive = ({ id, value }, row) =>
      row[id] ? row[id].toLowerCase() .includes(value.toLowerCase()) : true

    return (
      <div className="ResultTable">
        {/* <span className="ResultTable-title">{this.props.title}</span> */}
        {
          this.props.mapVisible === true ? (

            <div className={"col-12 row"}>
            {
              this.state.mapReady === true ? (
                <BasicMapFGP
                  mapInteractions={this.props.mapInteractions}
                  isHighlightRow={this.props.isHighlightRow}
                  highlightRow={this.highlightRow.bind(this)}
                  isBefore1910={this.props.isBefore1910}
                  mapProjection={this.props.mapProjection}
                  featuresParent={{
                    deviceName: "",
                    lat:  null ,
                    lng : null
                }}
                featuresParentStyles={{
                    label : "",
                    borderColor : 'red',
                    borderWidth : "1",
                    fillColor : 'red',
                }}
                featuresChildren={this.state.mapData}
                mapPopupInfo={this.props.mapPopupInfo}
                mapLayers={this.props.mapLayers}
                />
              ) : (
                <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
              )
            }

            </div>
          ) : ""
        }
        <div style={{"display":"contents"}}>
        {
          this.state.dataReady === true && this.state.columnsReady ?  (
            this.props.serverSidePagination === true ? (
              <ReactTable
                  getTrProps={(state, rowInfo, column, instance) => {
                    if(rowInfo!==undefined && rowInfo!== null & rowInfo.index < this.state.highlightedRowLength){
                      return {
                        style: {
                          background: '#d28f287d'
                        }
                      }
                    }
                    else{
                      return {
                        style: {
                          background: 'white'
                        }
                      }
                    }
                  }}
                  showPagination={this.props.showPagination}
                  showPageSizeOptions={this.props.showPageSizeOptions}
                  showPageJump={this.props.showPageJump}
                  filterable={this.props.filterable}
                  data={this.state.data}
                  columns={this.state.columns}
                  minRows={this.props.defaultRowSize}
                  defaultPageSize={this.props.defaultPageSize ? this.props.defaultPageSize : 25}
                  pageSizeOptions={this.props.defaultRowSizeArray}
                  defaultFilterMethod={filterCaseInsensitive}
                  page={this.props.clientPage}
                  // onPageChange={(pageSize,pageIndex) => {
                  //   console.log("pagesize = ", pageIndex, "pageindex = ", pageSize)
                  //   this.props.dynamicResultFunctionPage(pageIndex)
                  // }}
                  onPageChange={this.props.onPageChange}
                  // onPageSizeChange={(pageSize,pageIndex) => {
                  //   console.log("pagesize = ", pageIndex, "pageindex = ", pageSize)
                  //   this.props.dynamicResultFunction(pageSize,pageIndex)
                  // }}
                  onPageSizeChange={this.props.onRowCountChange}
              />
            ) : (
              <ReactTable
                  getTrProps={(state, rowInfo, column, instance) => {
                    if(rowInfo!==undefined && rowInfo!== null & rowInfo.index < this.state.highlightedRowLength){
                      return {
                        style: {
                          background: '#d28f287d'
                        }
                      }
                    }
                    else{
                      return {
                        style: {
                          background: 'white'
                        }
                      }
                    }
                  }}
                  showPagination={this.props.showPagination}
                  showPageSizeOptions={this.props.showPageSizeOptions}
                  showPageJump={this.props.showPageJump}
                  filterable={this.props.filterable}
                  data={this.state.data}
                  columns={this.state.columns}
                  minRows={this.props.defaultRowSize}
                  defaultPageSize={this.props.defaultPageSize ? this.props.defaultPageSize : 25}
                  pageSizeOptions={this.props.defaultRowSizeArray}
                  defaultFilterMethod={filterCaseInsensitive}
              />
            )
          ) : (
            <FontAwesomeIcon className="centerSpinner fa-spin" icon={["fas", "spinner"]}/>
          )
        }
        </div>
      </div>
  )}
}

export default ResultTable
