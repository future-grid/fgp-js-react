import React, { Component } from 'react';
import './AssetPage.css';
import { Navigation } from '../../navigation/Navigation';
import { AssetData } from './assetdata/AssetData';
import axios from "axios";
import apiConfig from '../../../configs/apiConfig.json';
// import Moment from 'react-moment';

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
      }) 
    };  

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
          assetExtension={this.state.assetExtension}
          assetInfo={this.state.assetInfo}
          assetName={this.state.assetName}
          employeeAssignedTo={this.state.employeeAssignedTo}
          assetStatus={this.state.assetStatus}
          computerExtension={this.state.computerExtension}
          assetEvents={this.state.assetEvents}
          assetEventsLoaded={this.state.assetEventsLoaded}
        />
      </div>
    )
  }
}

export default AssetPage
