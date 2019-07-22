import React, { Component } from 'react';
import './WelnetExamplePage.css';
import { Navigation } from '../../navigation/Navigation';
import { DeviceData } from './devicedata/DeviceData'
import { MapFGP2 } from '../../map/MapFGP2'
import axios from "axios";
import welApiConfig  from '../../../configs/welApiConfig.json'
// import Moment from 'react-moment';


export class WelnetExamplePage extends Component {
  constructor(props){
    super(props);
    this.state = {
      sampleIcpHasLoaded : false,
      sampleTx: this.props.match.params.handle,
      // icpLocations: [
      //   {
      //     lng: 174.880836345938,
      //     lat: -37.8028377815772,
      //     deviceName:"09283098fFjw",
      //     type:"ICP"
      //   },
      //   {
      //     lng: 175.120603129093,
      //     lat: -37.8914305756977,
      //     deviceName:"0937h398dfg4",
      //     type:"ICP"
      //   },
      // ],
      txLocations:false,
      txExtensions: axios.post(
        welApiConfig.baseUrl + "transformer/name/" + this.props.match.params.handle,
        {"extensions":["transformer_ext","transformer_anzsic","transformer_event_stats_ext", "location"]}
      ).then(resp => {
          this.setState({
            txExtension:resp.data,
            txLocations:resp.data.location
          })
        }),
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
        {/* <div className=" fgReact_componentContainer container fgReact_startTop ">
          <div className="col-5">
            <h3>Transformer: <label className={"deviceLabelHead"}> {this.props.match.params.handle} </label> </h3>
          </div>   */}
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
            <MapFGP2 
            // lat={19514291.235482115}
            // lng={-4549771.9135484705}
              zoom={16}
              radius={5}
              featuresChildren={this.state.icpLocations}
              featuresParent={this.state.txLocations}
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
