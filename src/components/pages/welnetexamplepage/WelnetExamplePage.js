import React, { Component } from 'react';
import './WelnetExamplePage.css';
import { Navigation } from '../../navigation/Navigation';
import { DeviceData } from './devicedata/DeviceData'
import { BasicMapFGP } from '../../map/basicMap/BasicMapFGP'
import axios from "axios";
import welApiConfig  from '../../../configs/welApiConfig.json'

// import Moment from 'react-moment';


export class WelnetExamplePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      sampleIcpHasLoaded : false,
      sampleTx: this.props.match.params.handle,
      txLocations:false,
      // getting extension data and location data for a parent
      txExtensions: axios.post(
        welApiConfig.baseUrl + "transformer/name/" + this.props.match.params.handle,
        {"extensions":["transformer_ext","transformer_anzsic","transformer_event_stats_ext", "location"]}
      ).then(resp => {
          this.setState({
            txExtension:resp.data,
            txLocations:resp.data.location
          })
        }),
      // getting the children locations
      sampleTxIcpExtLocList: axios.get( 
        welApiConfig.baseUrl + "transformer/" + this.props.match.params.handle + welApiConfig.relation_icp_tx
      ).then(resp => {
        let icpNames = [];
        resp.data.forEach(icp => {
          icpNames.push(icp.name);
        });
        axios.post( 
          welApiConfig.baseUrl + "icp/location",
          { 
            timestamp: new Date().getTime(),
            devices:icpNames
          }
        ).then(resp => {
          this.setState({
            icpLocations: resp.data
          })
        })
      })    
    };  
    
  } 

  render() {
    return (
      <div className="fgReact_home ">
        <Navigation
          currentPage="/WelnetExample/E00025675COMP"
          history={this.props.history}
          topNavTitle={this.props.topNavTitle}
          sideNavLogoPath={this.props.sideNavLogoPath}
        />
        
        <div className=" fgReact_componentContainer container fgReact_startTop ">
        
        {
          this.state.txExtension ? 
          <div className="col-5">
            <DeviceData 
            deviceExtension={this.state.txExtension}
            deviceName={this.state.sampleTx}
            deviceType={"Transformer"}
            /> 
          </div>  
        : 
            "loading"
        }
        

        { 
          this.state.icpLocations && this.state.txLocations !== false ?
          <div className="col-7">
          
            <BasicMapFGP 
              featuresChildren={this.state.icpLocations}
              featuresChildrenStyles={
                {
                  label : "ICP",
                  borderColor : "red",
                  borderWidth: "1",
                  fillColor : "pink"
                }
              }
              featuresParent={this.state.txLocations}
              featuresParentStyles={
                {
                  label : "Transformer",
                  borderColor : "blue",
                  borderWidth : "1",
                  fillColor : "lightblue",
                }
              }
            />
          </div>
          
         : "Map loading..."
        }
        </div>          
      </div>
    )
  }
}

export default WelnetExamplePage 
