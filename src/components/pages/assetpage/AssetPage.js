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
      hasAssetInfoLoaded: false,
      hasAssetExtensionLoaded: false,
      hasEmployeeAssignedToLoaded: false,
      hasAssetStatusLoaded: false,
      hasComputerExtensionLoaded: false,
      hasAssetEventsLoaded: false,
      hasRenderedYet: false,
      assetName: this.props.match.params.handle,
      assetInfo: axios.get(apiConfig.baseUrl + "asset/name/" + this.props.match.params.handle)
      .then(asset => {
        this.setState({
          assetInfo : asset.data
        })
      }).then(() => {this.setState({hasAssetInfoLoaded: true})}),
      assetExtension: axios.get(apiConfig.baseUrl + "asset/name/" + this.props.match.params.handle + "/asset_ext")
      .then(assetExt => {
        this.setState({
          assetExtension : assetExt.data
        })
      }).then(() => {this.setState({hasAssetExtensionLoaded: true})}),
      employeeAssignedTo : axios.get(apiConfig.baseUrl + "asset/" + this.props.match.params.handle + apiConfig.assetToEmp)
      .then(asset => {
        this.setState({
         employeeAssignedTo : asset.data
        })
       })
       .catch( error => {
         console.log("caught, likely not assigned \n> error:", error)
       }).then(() => {this.setState({hasEmployeeAssignedToLoaded: true})}),                 
      assetStatus : axios.get(apiConfig.baseUrl + "asset/name/" + this.props.match.params.handle + apiConfig.assetStatus + new Date().getTime())
      .then(asset => {
        this.setState({
          assetStatus : asset.data
        })
      }).then(() => {this.setState({hasAssetStatusLoaded: true})}),
      computerExtension : axios.get(apiConfig.baseUrl + "asset/name/" + this.props.match.params.handle + apiConfig.computerExt + new Date().getTime())
      .then(asset => {
        this.setState({
          computerExtension : asset.data
        })
      }).then(() => {this.setState({hasComputerExtensionLoaded: true})}),
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
      }).then(() => {this.setState({hasAssetEventsLoaded: true})})
    };
  } 

  componentDidUpdate() {
    // this is honestly a shit way of doing it I think but you know whatever bro do your thing
    // will pass the info to be cleaned and rendered only after all promises have resolved
    if(this.state.hasAssetInfoLoaded &&
       this.state.hasAssetExtensionLoaded &&
       this.state.hasEmployeeAssignedToLoaded &&
       this.state.hasAssetStatusLoaded &&
       this.state.hasComputerExtensionLoaded &&
       this.state.hasAssetEventsLoaded &&
       !this.state.hasRenderedYet) {
        this.cleanData();
        this.setState({hasRenderedYet: true});
    }
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
  // group all of the data from the API call into one neat little bundle thing
  cleanData () {
  let data = [
    {
      data:this.state.assetExtension,
        relationship:"assetExtension"
      },
      {
        data:this.state.assetInfo,
        relationship:"assetInfo"
      },
      {
        data:this.state.employeeAssignedTo,
        relationship:"employeeAssigned"
      },
      {
        data:this.state.assetStatus,
        relationship:"assetStatus"
      },
      {
        data:this.state.computerExtension,
        relationship:"computerExtension"
      },
      //this.state.assetEvents, do not include! it doesn't work ;(
    ];

    // new array for where the cleanedData will be stored
    let cleanedData = new Array();

    // iterate over each category
    data.map(category => {
      // for each key value pair in the category
      for(let [key, value] of Object.entries(category.data)) {
        // if it is not in the blacklist defined in the JSON
        if(!deviceConfig.excludedColumns.includes(key)){
          // add it to the list of data with some prettifying
          // console.log(`${key}, ${value}, ${this.getFormat(key)}, ${this.getRedirect(key, value)}`);
          cleanedData.push({
            title : key,
            data : value,
            style : this.getFormat(key),
            key : Date.now() + Math.random(), // key to make React happier :)
            redirect : this.getRedirect(key, value),
            extension: category.relationship
          });
        }
      }
    });

    this.cleanRelationshipData(cleanedData);
  }

  // excludes, mutates, redirects, renames data by specific category and key, rather than just key (handled by cleanData)
  cleanRelationshipData (data) {
    //console.log(data);
    // new array for where the cleaned data will be stored
    let cleanedData = this.relationshipExclude(data);
    // iterates over the list of excluded data
    cleanedData = cleanedData.map(point => {
      let newpoint = new Object();
      Object.assign(point, newpoint); // copy data over instead of reference, makes JSON configs possible.
      // passes relevant values through functions configured by the JSON file
      newpoint.title = this.relationshipRename(point);
      newpoint.style = this.relationshipFormat(point);
      newpoint.redirect = this.relationshipRedirect(point);
      newpoint.data = point.data;
      newpoint.extension = point.extension;
      newpoint.key = point.key;

      return newpoint;
    });

    console.log(cleanedData);
    this.setState({cleanData:cleanedData});
  }

  // removes data from the given list if its extension and key match exclusions in the JSON
  relationshipExclude (data) {
    let excludedData = new Array();
    // iterates over the data given
    data.map(point => {
      let excluded = false;
      
      // iterates over the list of excluded extension/key pairs
      for (let i=0; i<deviceConfig.relation_excludedColumns.length; i++) {
        // if the given point does not match both the given extension AND key
        if((deviceConfig.relation_excludedColumns[i].extension === point.extension
          && deviceConfig.relation_excludedColumns[i].key === point.title)) {
            // push to the array
           excluded = true;
        }
      }

      if (!excluded) { excludedData.push(point) }; // if not excluded, then add it to the array
    });

    return excludedData;
  }

  // mutates the title of the data if configured by the JSON
  relationshipRename(point) {
    // iterates over the list of renaming extension/key pairs
    for(let i=0; i<deviceConfig.relation_renameColumns.length; i++) {
      if((deviceConfig.relation_renameColumns[i].extension === point.extension
        && deviceConfig.relation_renameColumns[i].key === point.title)) {
          return deviceConfig.relation_renameColumns[i].desiredKey; // change the title to the desired one
      }
    }

    return this.wordConvert(point.title);
  }

  // mutates the style of the data if configured by the JSON
  relationshipFormat(point) {
    //
    for(let i=0; i<deviceConfig.relation_mutatedColumns.length; i++) {
      if((deviceConfig.relation_mutatedColumns[i].extension === point.extension
        && deviceConfig.relation_mutatedColumns[i].key === point.title)) {
          return deviceConfig.relation_mutatedColumns[i].style; // change the title to the desired one
      }
    }

    return point.style;
  }

  // mutates the redirect of the data if configured by the JSON
  relationshipRedirect(point) {
    //
    for(let i=0; i<deviceConfig.relation_redirectColumns.length; i++) {
      if((deviceConfig.relation_redirectColumns[i].extension === point.extension
        && deviceConfig.relation_redirectColumns[i].key === point.title)) {
          let newredirect = deviceConfig.relation_redirectColumns[i].redirect;
          newredirect = newredirect.replace("*", point.data);
          return newredirect;
      }
    }

    return point.redirect;
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
