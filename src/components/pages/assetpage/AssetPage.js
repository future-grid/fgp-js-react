import React, { Component } from 'react';
import './AssetPage.css';
import { Navigation } from '../../navigation/Navigation';
import { AssetData } from './assetdata/AssetData';
import axios from "axios";
import apiConfig from '../../../configs/apiConfig.json';
import deviceConfig from '../../../configs/deviceConfig_asset.json';
import Moment from 'react-moment';

export class AssetPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      assetName: this.props.match.params.handle,
      assetInfo: axios.get(apiConfig.baseUrl + "asset/name/" + this.props.match.params.handle)
      .then(asset => {
        this.setState({
          assetInfo : asset.data
        })
      }),
      assetExtension: axios.get(apiConfig.baseUrl + "asset/name/" + this.props.match.params.handle + "/asset_ext")
      .then(assetExt => {
        this.setState({
          assetExtension : assetExt.data
        })
      }),
      employeeAssignedTo : axios.get(apiConfig.baseUrl + "asset/" + this.props.match.params.handle + apiConfig.assetToEmp)
      .then(asset => {
        this.setState({
         employeeAssignedTo : asset.data
        })
       })
       .catch( error => {
         console.log("caught, likely not assigned \n> error:", error)
       }),                 
      assetStatus : axios.get(apiConfig.baseUrl + "asset/name/" + this.props.match.params.handle + apiConfig.assetStatus + new Date().getTime())
      .then(asset => {
        this.setState({
          assetStatus : asset.data
        })
      }),
      computerExtension : axios.get(apiConfig.baseUrl + "asset/name/" + this.props.match.params.handle + apiConfig.computerExt + new Date().getTime())
      .then(asset => {
        this.setState({
          computerExtension : asset.data
        })
      }),
      assetEventsLoaded  : false,
      assetEvents : axios.get(apiConfig.baseUrl + apiConfig.assetEvent + this.props.match.params.handle + "/start")
      .then( timestamp => {
        console.log(timestamp.data.start)
        axios.post(apiConfig.baseUrl + apiConfig.assetEvent,
        {
          "start" : timestamp.data.start,
          "end" : new Date().getTime(),
          "devices" : [this.props.match.params.handle]
        })
        .then(eventData => {
          this.setState({
            assetEvents : eventData.data[this.props.match.params.handle].data,
            assetEventsLoaded: true
          })
        })
        .catch( res => {
          this.setState({
            assetEvents : null,
            assetEventsLoaded: true
          })
        }) 
      })
      .catch( res => {
        this.setState({
          assetEvents : null,
          assetEventsLoaded: false
        })
      }).finally( () => {
        this.cleanData();
      })
    };  

  } 

  // iterates over the mutable columns in the JSON config and will return the thing to mutate them with, will otherwise just return 'plain'
  getFormat(key) {
    for(let i=0; i<deviceConfig.mutatedColumns.length; i++){
      if(key === deviceConfig.mutatedColumns[i].key) {
        return deviceConfig.mutatedColumns[i].style;
      }
    }
    
    return 'plain';
  }

  // iterates over the redirectable columns in the JSON config and will return its given redirect.
  // also replaces all asterisks with the given value (for things like employeeID or whatever)
  getRedirect(key, value) {
    for(let i=0; i<deviceConfig.redirectColumns.length; i++){
      if(key === deviceConfig.redirectColumns[i].key) {
        return deviceConfig.redirectColumns[i].redirectTo.replace("*", value);
      }
    }
    return null; // there is no redirect given.
  }

  // converts a camelCased string into seperate words with capitals
  wordConvert(given) {
    let temp = given.split(/(?=[A-Z])/); // split word at capitals
    temp[0] = this.capitalise(temp[0]);
    temp.map(word => this.capitalise(word));
      
    return temp.join(" "); // return completed string
  }

  capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // will return an array of pairs with titles and data for display. will remove any columns mentioned in deviceConfig.json
  cleanData () {
    // group all of the data from the API call into one neat little bundle thing
    let data = [
      this.state.assetExtension,
      this.state.assetInfo,
      this.state.employeeAssignedTo,
      this.state.assetStatus,
      this.state.computerExtension,
      //this.state.assetEvents, do not include! it doesn't work ;(
      this.state.assetEventsLoaded
    ];

    // new array for where the cleanedData will be stored
    let cleanedData = new Array();

    // iterate over each category
    data.map(category => {
      // for each key value pair in the category
      for(let [key, value] of Object.entries(category)) {
        // if it is not in the blacklist defined in the JSON
        if(!deviceConfig.excludedColumns.includes(key)){
          // add it to the list of data with some prettifying
          console.log(`${key}, ${value}, ${this.getFormat(key)}, ${this.getRedirect(key, value)}`);
          cleanedData.push({
            title : this.wordConvert(key),
            data : value,
            style : this.getFormat(key),
            key : Date.now() + Math.random(), // key to make React happier :)
            redirect : this.getRedirect(key, value)
          });
        }
      }
    });

    this.setState({
      cleanData : cleanedData
    });
  }

  render() {
    return (
      <div className="fgReact_home">
        <Navigation
          currentPage="/Home"
          history={this.props.history}
          topNavTitle={this.props.topNavTitle}
          sideNavLogoPath={this.props.sideNavLogoPath}
        />
        <AssetData
          hasMap={false}
          assetName={this.state.assetName}
          data={this.state.cleanData}
          deviceConfig={deviceConfig}
          history={this.props.history}
        />
      </div>
    )
  }
}

export default AssetPage
