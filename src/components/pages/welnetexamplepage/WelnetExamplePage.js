import React, { Component } from 'react';
import './WelnetExamplePage.css';
import { Navigation } from '../../navigation/Navigation';
import { DeviceData } from './devicedata/DeviceData'
import { BasicMapFGP } from '../../map/basicMap/BasicMapFGP'
import { NwpMapFGP } from '../../map/networkPlanningMap/NwpMapFGP'
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
      icpLocations: false,
      // getting extension data and location data for a parent
      txExtensions: axios.post(
        welApiConfig.baseUrl + "transformer/name/" + this.props.match.params.handle,
        {"extensions":["transformer_ext","transformer_anzsic","transformer_event_stats_ext", "location"]}
      ).then(resp => {
        this.setState({
          txExtension:resp.data,
          txLocations:resp.data.location
        })
      }).catch(resp=>{
        console.log("error:", resp)
        this.setState({
          txExtension: {},
          txLocations: {}
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
          let temp = resp.data
          // temp.forEach(child => {
          //   child["isSwapped"] = false; // a simple flag to determine if the child has been swapped (avoid string comparisons)
          //   child["parentDeviceName"] = "E00025675COMP"; // set to the original device parent
          //   child["currentNwpParent"] = "E00025675COMP"; // set to the original device parent, however will be modified in <NwpMapFGP> component
          // })
          this.setState({
            icpLocations: temp
          })
        }).catch(resp=>{
          console.log("error:", resp)
          this.setState({
            icpLocations: []
          })
        })
      }),
      sampleDestinationTx : "E000300e9COMP",
      destinationTxLocations:false,
      destinationIcpLocations: false,
      destinationTxExtensions: axios.post(
        welApiConfig.baseUrl + "transformer/name/" + "E000300e9COMP",
        {"extensions":["transformer_ext","transformer_anzsic","transformer_event_stats_ext", "location"]}
      ).then(resp => {
        this.setState({
          destinationTxExtension:resp.data,
          destinationTxLocations:resp.data.location
        })
      }),
      sampleDestinationTxIcpExtLocList: axios.get( 
        welApiConfig.baseUrl + "transformer/" + "E000300e9COMP" + welApiConfig.relation_icp_tx
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
            destinationIcpLocations: resp.data
          })
        }).catch(resp=>{
          console.log("error:", resp)
          this.setState({
            destinationIcpLocations: []
          })
        })
      }),
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
          <div className={"col-12"}>
          { 
          this.state.icpLocations !== false && this.state.txLocations !== false && 
          this.state.destinationIcpLocations && this.state.destinationTxLocations !== false 
           ?
          <div className="col-12">
          
            <NwpMapFGP 
              // Source Devices
              sourceFeaturesChildren={this.state.icpLocations}
              sourceFeaturesChildrenStyles={
                {
                  label : "ICP",
                  borderColor : "black",
                  borderWidth: "1",
                  fillColor : "lightblue"
                }
              }
              sourceFeaturesParent={this.state.txLocations}
              sourceFeaturesParentStyles={
                {
                  label : "Transformer",
                  borderColor : "blue",
                  borderWidth : "1",
                  fillColor : "blue",
                }
              }

              // new way to handle destinations
              destinationFeatures={
                [
                  {
                    parent : {
                      device : this.state.destinationTxLocations,
                      style : {
                        label : "Transformer",
                        borderColor : "red",
                        borderWidth : "1",
                        fillColor : "red",
                      }
                    },
                    children : {
                      devices: this.state.destinationIcpLocations,
                      style: {
                        label : "ICP",
                        borderColor : "black",
                        borderWidth: "1",
                        fillColor : "pink"
                      }
                    }
                  }
                ]
                
              }
            />
          </div>          
         :  <div className="col-7"> Map loading... </div>
        }
          </div>
        </div> 
        
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
         :  <div className="col-7"> Map loading... </div>
        }
          {/* <div className="col-7">
            nothing to see here
          </div>
          <div className="col-5">
            nothing to see here
          </div> */}
        </div>     
    
      </div>
    )
  }
}

export default WelnetExamplePage 
